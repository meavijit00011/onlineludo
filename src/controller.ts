import WebSocket from "ws";
import { redis } from "./redisConfig";
import { CanMove, event1, event2, event3, event4, event5, event6, event9, PlayerWaitingQueueName } from "./constants";
import { v4 as uuid } from 'uuid';
import { Game } from "./Game";
import ChangeActivePlayer, { CheckIfPiecesCanMove, MovePieces } from "./utils";
import { PlayersType } from "./types";
import { GameManager } from "./GameManager";
let connections: Map<string, WebSocket> = new Map();
const runningGames: Map<string, GameManager> = new Map();
const timeOut = 30000;

// this fn create a new game.
export async function CreateNewGame(c1: string, c2: string, c3: string, c4: string, gameid?: string) {
    // if gameid is provided that means create a game(play with friend) otherwise normal game.
    try {
        let createdGame: GameManager;
        let createdGameId = gameid;
        if (createdGameId) {
            createdGame = new GameManager({ c1, c2, c3, c4 }, { player1: { cid: c1, isAvailable: true }, player2: { cid: c2, isAvailable: true }, player3: { cid: c3, isAvailable: true }, player4: { cid: c4, isAvailable: true } }, Date.now(), createdGameId);
        }
        else {
            createdGameId = uuid();
            createdGame = new GameManager({ c1, c2, c3, c4 }, { player1: { cid: c1, isAvailable: true }, player2: { cid: c2, isAvailable: true }, player3: { cid: c3, isAvailable: true }, player4: { cid: c4, isAvailable: true } }, Date.now(), createdGameId);
        };
        runningGames.set(createdGameId, JSON.parse(JSON.stringify(createdGame)));
        BraodCastToAllPlayers(createdGameId, createdGame.game, false);

        // if game was created with random player then remove the players from queue.
        if (!gameid) {
            redis.lpop(PlayerWaitingQueueName);
            redis.lpop(PlayerWaitingQueueName);
            redis.lpop(PlayerWaitingQueueName);
            redis.lpop(PlayerWaitingQueueName);
        }
        else {
            // remove the gameid from redis which contained all friend's cids.
            await redis.del(gameid);
        }

    }
    catch (err) {
        console.log(err);
    }

};

// this fn check if a game can be created.
export async function CheckIfGameCanBeCreated(gameid?: string) {
    // if play with friends contain four players 
    try {
        // play game with friend.
        if (gameid) {
            const gameWithFriends = await redis.get(gameid);
            if (gameWithFriends) {
                const { clients } = JSON.parse(gameWithFriends);
                if (clients.length == 4) {
                    CreateNewGame(clients[0], clients[1], clients[2], clients[3], gameid);
                }
            }

        }
        // play game with random player.
        else {
            const queueLen = await redis.llen(PlayerWaitingQueueName);
            if (queueLen >= 4) {
                const firstFourPlayers = await redis.lrange(PlayerWaitingQueueName, 0, 3);
                const p1 = firstFourPlayers[0];
                const p2 = firstFourPlayers[1];
                const p3 = firstFourPlayers[2];
                const p4 = firstFourPlayers[3];
                CreateNewGame(p1, p2, p3, p4);
            }
        }
    }
    catch (err) {
        console.log(err);
    }

}

// this fn will check if a player has crossed timelimit of 30 seconds.
// if the player has crossed 30 seconds then change active player.
(() => {
    setInterval(() => {
        for (const [id, game] of runningGames) {
            const lastMoveTime = game.lastMove;
            const currTime = Date.now();
            const diff = currTime - lastMoveTime;
            const { allowedToMove, activePlayer, piecesPosOfPlayers, diceNum, playerFinishedOrder, gameFinished, quitGame } = game.game;
            if (diff >= timeOut) {
                const availablePlayersObj = {
                    player1: game.players.player1.isAvailable,
                    player2: game.players.player2.isAvailable,
                    player3: game.players.player3.isAvailable,
                    player4: game.players.player4.isAvailable,
                }
                const changedActivePlayer = ChangeActivePlayer(activePlayer, playerFinishedOrder, availablePlayersObj);
                const newGameState = new Game(piecesPosOfPlayers, diceNum, changedActivePlayer, CanMove, allowedToMove, gameFinished, playerFinishedOrder, quitGame, 'allowed');
                SaveGameState(id, newGameState, true, false);
            }
        };
    }, 1000);
})()

export async function Add(socket: WebSocket, mode: string, gameid?: string) {
    // this fn will add a client to the waiting queue or add a client to game arr (means play with friends) and then call the cangamebestarted fn
    try {
        // check if the connection already exist.
        let ifConExist: boolean = false;
        connections.forEach(con => {
            if (con == socket) {
                ifConExist = true;
            }
        });
        //   if player is already connected then send him msg that you are already connected.
        if (ifConExist) {
            return socket.send(JSON.stringify({ status: false, msg: 'You are already added,please wait.', data: null }));
        }


        if (!gameid) {
            // create a client id
            const cid = uuid();
            // create a game to play with friend.
            if (mode == event5) {
                const gameid = uuid();
                const tx = redis.multi();
                tx.set(gameid, JSON.stringify({ clients: [cid], createdAt: Date.now() }));
                socket.send(JSON.stringify({ event: event2, msg: `Ask your friend to join with gameid - ${gameid}`, data: gameid, cid }));
                connections.set(cid, socket);
                await tx.exec();
                await redis.expire(gameid, 300)
            }
            // create a game to play with random player.
            else if (mode == event4) {
                const tx = redis.multi();
                tx.rpush(PlayerWaitingQueueName, cid);
                socket.send(JSON.stringify({ event: event1, msg: "Please wait for matching.", data: null, cid }));
                connections.set(cid, socket);
                await tx.exec();
                CheckIfGameCanBeCreated();
            }

        }
        //join game created by friend.
        else {
            const cid = uuid();
            const gameWithFriend = await redis.get(gameid);
            if (gameWithFriend) {
                const { clients, createdAt } = JSON.parse(gameWithFriend);
                clients.push(cid);
                const tx = redis.multi();
                tx.set(gameid, JSON.stringify({ clients, createdAt }));
                socket.send(JSON.stringify({ event: event2, msg: 'Please wait for your friends to join.', data: null, cid }));
                connections.set(cid, socket);
                await tx.exec();
                CheckIfGameCanBeCreated(gameid);
            }
            else {
                throw new Error;
            }

        }
    }
    catch (err) {
        socket.send(JSON.stringify({ event: event3, msg: "Something went wrong!", data: null }));
    }

}

// remove client 
export async function Remove(socket: WebSocket) {
    // remove the client from connections set.
    for (const [key, value] of connections) {
        if (value == socket) {
            // if that client exist on the redis then remove the client.
            await redis.lrem(PlayerWaitingQueueName, 1, key);

            // if the client is on any running game then remove the client from game.
            for (const [id, game] of runningGames) {
                let playerLeft: PlayersType | null = null;
                let temp: GameManager | null = null;
                if (game.players.player1.cid == key) {
                    const tempGame = JSON.parse(JSON.stringify(game));
                    tempGame.players.player1.isAvailable = false;
                    temp = tempGame;
                    playerLeft = 'player1';
                }
                else if (game.players.player2.cid == key) {
                    const tempGame = JSON.parse(JSON.stringify(game));
                    tempGame.players.player2.isAvailable = false;
                    temp = tempGame;
                    playerLeft = 'player2';
                }
                else if (game.players.player3.cid == key) {
                    const tempGame = JSON.parse(JSON.stringify(game));
                    tempGame.players.player3.isAvailable = false;
                    temp = tempGame;
                    playerLeft = 'player3';
                }
                else if (game.players.player4.cid == key) {
                    const tempGame = JSON.parse(JSON.stringify(game));
                    tempGame.players.player4.isAvailable = false;
                    temp = tempGame;
                    playerLeft = 'player4';
                };
                // if client is removed from the game then check how many players is left in that game and also change active player.
                if (temp) {
                    //  player removed so change active player.
                    if (playerLeft == game.game.activePlayer) {
                        const availablePlayersObj = {
                            player1: temp.players.player1.isAvailable,
                            player2: temp.players.player2.isAvailable,
                            player3: temp.players.player3.isAvailable,
                            player4: temp.players.player4.isAvailable,
                        }
                        const newActivePlayer = ChangeActivePlayer(game.game.activePlayer, game.game.playerFinishedOrder, availablePlayersObj);
                        temp.game.activePlayer = newActivePlayer
                    }


                    let noOfPlayerAvilable = 4;
                    if (!temp.players.player1.isAvailable || temp.game.playerFinishedOrder.indexOf('player1') != -1) {
                        noOfPlayerAvilable -= 1;
                    };
                    if (!temp.players.player2.isAvailable || temp.game.playerFinishedOrder.indexOf('player2') != -1) {
                        noOfPlayerAvilable -= 1;
                    };
                    if (!temp.players.player3.isAvailable || temp.game.playerFinishedOrder.indexOf('player3') != -1) {
                        noOfPlayerAvilable -= 1;
                    };
                    if (!temp.players.player4.isAvailable || temp.game.playerFinishedOrder.indexOf('player4') != -1) {
                        noOfPlayerAvilable -= 1;
                    }
                    // if no of players left for game is less than 2 that means end the game.
                    if (noOfPlayerAvilable < 2) {
                        temp.game.gameFinished = true;
                    };
                    runningGames.set(id, JSON.parse(JSON.stringify(temp)));
                    SaveGameState(id, JSON.parse(JSON.stringify(temp.game)), true, false, `${playerLeft} has left the game.`);
                    break;
                }

            };
            connections.delete(key);
            break;
        }
    };
};

// this fn save new state of game.
function SaveGameState(gameid: string, newState: Game, moved: boolean, hasRemovedAnotherPiece: boolean, extraMsg?: string) {
    const currRunningGame = runningGames.get(gameid);
    if (currRunningGame) {
        const changedGame = moved ? new GameManager(currRunningGame.clients, currRunningGame.players, Date.now(), currRunningGame.gameid, currRunningGame.createdAt, newState) : new GameManager(currRunningGame.clients, currRunningGame.players, currRunningGame.lastMove, currRunningGame.gameid, currRunningGame.createdAt, newState);
        runningGames.set(gameid, JSON.parse(JSON.stringify(changedGame)));
        BraodCastToAllPlayers(gameid, changedGame.game, hasRemovedAnotherPiece, extraMsg);
    }
};

// this fn braodcase new state to all the players.
function BraodCastToAllPlayers(gameid: string, newState: Game, hasRemovedAnotherPiece: boolean, extraMsg?: string) {
    //   get all the conns and braoadcast them new states.
    const runningGame = runningGames.get(gameid);
    if (runningGame) {
        const c1 = connections.get(runningGame.clients.c1);
        const c2 = connections.get(runningGame.clients.c2);
        const c3 = connections.get(runningGame.clients.c3);
        const c4 = connections.get(runningGame.clients.c4);
        const timeLeft = Math.round((runningGame.lastMove + 30000 - Date.now()) / 1000);
        runningGame.players.player1.isAvailable && c1 ? c1.send(JSON.stringify({ event: event9, status: true, msg: extraMsg || "New state", data: newState, gameid, hasRemovedAnotherPiece, playerid: 'player1', timeLeft })) : null;
        runningGame.players.player2.isAvailable && c2 ? c2.send(JSON.stringify({ event: event9, status: true, msg: extraMsg || "New state", data: newState, gameid, hasRemovedAnotherPiece, playerid: 'player2', timeLeft })) : null;
        runningGame.players.player3.isAvailable && c3 ? c3.send(JSON.stringify({ event: event9, status: true, msg: extraMsg || "New state", data: newState, gameid, hasRemovedAnotherPiece, playerid: 'player3', timeLeft })) : null;
        runningGame.players.player4.isAvailable && c4 ? c4.send(JSON.stringify({ event: event9, status: true, msg: extraMsg || "New state", data: newState, gameid, hasRemovedAnotherPiece, playerid: 'player4', timeLeft })) : null;

        // after broadcasting new state check if game is finished 
        // if finished then remove from runningGame.
        if (newState.gameFinished) {
            // 1.close all connections.
            const game = runningGames.get(gameid);
            if (game) {
                Object.values(game.clients).forEach(cli => connections.delete(cli));
            };
            // 2.delete the game.
            runningGames.delete(gameid);
        }

    }
    else {
        console.log('Failed to broadcast!');
    }
};


// this fn will make a move.
export async function MakeMove(gameid: string, cid: string, socket: WebSocket, tileid: number) {
    const game = runningGames.get(gameid);
    if (game) {
        const { allowedToMove, activePlayer, piecesPosOfPlayers, diceNum, playerFinishedOrder, gameFinished, quitGame, } = game.game;
        let pid: PlayersType | null = null;
        for (const [key, value] of Object.entries(game.players)) {
            if (value.cid == cid) {
                pid = key as PlayersType;
                break;
            }
        }
        let newGameState: Game = game.game;

        if (allowedToMove && pid == activePlayer) {
            const { hasMoved, updatedPos, hasCutAnotherPiece, hasPieceFinished, playerHasFinished } = MovePieces(activePlayer, piecesPosOfPlayers, tileid, diceNum[activePlayer]);

            // if player has finished then change active player.
            if (playerHasFinished) {
                let tempPlayerFinishedOrder = playerFinishedOrder;
                tempPlayerFinishedOrder.push(activePlayer);
                const availablePlayersObj = {
                    player1: game.players.player1.isAvailable,
                    player2: game.players.player2.isAvailable,
                    player3: game.players.player3.isAvailable,
                    player4: game.players.player4.isAvailable,
                }
                const newUpdatedPlayer = ChangeActivePlayer(activePlayer, tempPlayerFinishedOrder, availablePlayersObj);
                const updatedGame = new Game(updatedPos, diceNum, newUpdatedPlayer, CanMove, false, gameFinished, tempPlayerFinishedOrder, quitGame, 'allowed');
                newGameState = updatedGame;
                // game finished
                if (tempPlayerFinishedOrder.length > 2 && !gameFinished) {
                    newGameState.gameFinished = true;
                }
            }
            // if the dice number was 6 or the player has cut piece of other player then curr player get extra one move.
            else if (hasCutAnotherPiece || (diceNum[activePlayer] == 6 && !playerHasFinished && hasMoved) || (hasPieceFinished && !playerHasFinished)) {
                const updatedGame = new Game(updatedPos, diceNum, activePlayer, CanMove, false, false, playerFinishedOrder, quitGame, 'allowed');
                newGameState = updatedGame;
            }
            // if piece has moved then change active player.
            else if (hasMoved) {
                const availablePlayersObj = {
                    player1: game.players.player1.isAvailable,
                    player2: game.players.player2.isAvailable,
                    player3: game.players.player3.isAvailable,
                    player4: game.players.player4.isAvailable,
                }
                const newActivePlayer = ChangeActivePlayer(activePlayer, playerFinishedOrder, availablePlayersObj);
                const updatedGame = new Game(updatedPos, diceNum, newActivePlayer, CanMove, false, gameFinished, playerFinishedOrder, quitGame, 'allowed');
                newGameState = updatedGame;
            }
            SaveGameState(gameid, JSON.parse(JSON.stringify(newGameState)), true, hasCutAnotherPiece);
        }
        else {
            const timeLeft = Math.round((game.lastMove + 30000 - Date.now()) / 1000);
            socket.send(JSON.stringify({ status: false, msg: 'Invalid Move!', data: null, timeLeft }));
        }
    }
    else {
        socket.send(JSON.stringify({ status: false, msg: 'Something went wrong with gameid!', data: null }));
    }

}

// this fn will roll dice.
export async function RollDice(gameid: string, cid: string, socket: WebSocket) {
    const game = runningGames.get(gameid);
    if (!gameid) {
        return socket.send(JSON.stringify({ status: false, msg: "Something went wrong with gameid", data: null }))
    }
    if (game) {
        const { activePlayer, piecesPosOfPlayers, diceNum, playerFinishedOrder, gameFinished, quitGame, allowedToRoll } = game.game;
        let pid: PlayersType | null = null;
        for (const [key, value] of Object.entries(game.players)) {
            if (value.cid == cid) {
                pid = key as PlayersType;
                break;
            }
        }
        let newGameState: Game = game.game;
        if (allowedToRoll == 'allowed' && pid == activePlayer) {
            let num = 1;
            const updatedDiceNums = diceNum;
            updatedDiceNums[activePlayer] = num;
            const whichPiecesCanMove = CheckIfPiecesCanMove(activePlayer, piecesPosOfPlayers[activePlayer], num);
            const updatedGame1 = new Game(piecesPosOfPlayers, updatedDiceNums, activePlayer, whichPiecesCanMove, true, gameFinished, playerFinishedOrder, quitGame, 'not_allowed');
            newGameState = updatedGame1;

            // if all pieces cannot move then change active player.
            let newActivePlayer = activePlayer;
            let playerChanged = false;
            if (whichPiecesCanMove[0] == false && whichPiecesCanMove[1] == false && whichPiecesCanMove[2] == false && whichPiecesCanMove[3] == false) {
                const availablePlayersObj = {
                    player1: game.players.player1.isAvailable,
                    player2: game.players.player2.isAvailable,
                    player3: game.players.player3.isAvailable,
                    player4: game.players.player4.isAvailable,
                }
                newActivePlayer = ChangeActivePlayer(activePlayer, playerFinishedOrder, availablePlayersObj);
                const updatedGame2 = new Game(piecesPosOfPlayers, updatedDiceNums, newActivePlayer, CanMove, false, gameFinished, playerFinishedOrder, quitGame, 'allowed');
                newGameState = updatedGame2;
                playerChanged = true;
            };
            SaveGameState(gameid, JSON.parse(JSON.stringify(newGameState)), playerChanged ? true : false, false);
        }
        else {
            const timeLeft = Math.round((game.lastMove + 30000 - Date.now()) / 1000);
            socket.send(JSON.stringify({ status: false, msg: "Invalid Move!", data: null, timeLeft }))
        }

    }
}