import { ArrowTiles, PiecesMovementOrderArr, PlayerPiecesDefaultPos, SafeZoneTiles, StarTiles, StartingTilesForEachPlayer } from "./constants";
import { PiecesPosType, PlayerPosType, PlayersType, StartingTileType } from "./types";
// this function check if curr player has cut other player's piece.
const checkIfHasRemovedAnotherPiece = (piecesPosOfPlayers: PlayerPosType, activePlayerId: PlayersType, startingTileOfPlayers: StartingTileType, StarTiles: number[], defaultPos: PlayerPosType) => {
    const tempPiecesPosOfPlayers = JSON.parse(JSON.stringify(piecesPosOfPlayers));
    let hasRemovedAnotherPiece = false;
    for (let i = 1; i <= 4; i++) {
        const playerId = `player${i}` as PlayersType;
        const piecesPosOfCurrPlayer = piecesPosOfPlayers[playerId];
        for (let j = 1; j <= 4; j++) {
            const pieceId = `p${j}` as keyof PiecesPosType;
            const piecePos = piecesPosOfCurrPlayer[pieceId];
            // check if this piece exist on this tile and the tile is not a startile and the tile is not a starting tile.
            if ((piecePos == piecesPosOfPlayers[activePlayerId].p1 || piecePos == piecesPosOfPlayers[activePlayerId].p2 || piecePos == piecesPosOfPlayers[activePlayerId].p3 || piecePos == piecesPosOfPlayers[activePlayerId].p4) && playerId != activePlayerId && Object.values(startingTileOfPlayers).indexOf(piecePos) == -1 && StarTiles.indexOf(piecePos) == -1) {
                tempPiecesPosOfPlayers[playerId][pieceId] = defaultPos[playerId][pieceId]
                hasRemovedAnotherPiece = true;
                break;
            }
        }
    }
    return {
        hasRemovedAnotherPiece,
        tempPiecesPosOfPlayers
    }
}
// this function check if player is finished.
const checkIfPlayerHasFinished = (piecePos: PiecesPosType, finishedPos: number): boolean => {
    let hasFinished = false;
    if (piecePos.p1 == finishedPos && piecePos.p2 == finishedPos && piecePos.p3 == finishedPos && piecePos.p4 == finishedPos) {
        hasFinished = true;
    }
    return hasFinished;
}
// this function find next pos of the piece.
const findNextTile = (num: number, currPos: number, startingPos: number, safeZoneTiles: number[], entryToSafeZoneTile: number, defaultPos: boolean, movementOrder: number[]): number => {
    let nextPos = -1;
    const safeZoneInd = safeZoneTiles.indexOf(currPos);
    // if the piece is in default pos.
    if (defaultPos) {
        if (num == 6) {
            nextPos = startingPos;
        }
    }
    // if the piece is inside the safezone.
    else if (safeZoneInd != -1) {
        const nextInd = safeZoneInd + num;
        if (nextInd < 6) {
            nextPos = safeZoneTiles[nextInd];
        }
    }
    else {
        const currInd = movementOrder.indexOf(currPos);
        const nextInd = currInd + num;
        const safeZoneEntryInd = movementOrder.indexOf(entryToSafeZoneTile);
        //   check if entry to safeZone exist on this path.
        if (currInd <= safeZoneEntryInd && nextInd > safeZoneEntryInd) {
            const dis1 = safeZoneEntryInd - currInd;
            const disLeft = num - dis1;
            nextPos = safeZoneTiles[disLeft - 1];
        }
        else if (nextInd > 51) {
            const dis1 = nextInd - 51;
            nextPos = movementOrder[dis1 - 1];
        }
        else {
            nextPos = movementOrder[nextInd];
        }
    }
    return nextPos;
}
// 1.find which piece exist on that tile of curr player.
// 2.if piece of curr player exist on that tile then move it 
// 3.check after moving if the piece has removed another piece.
export const MovePieces = (playerId: PlayersType, playerPiecesPos: PlayerPosType, tileId: number, diceNum: number) => {
    let updatedPos = JSON.parse(JSON.stringify(playerPiecesPos));
    let hasMoved = false;
    let hasCutAnotherPiece = false;
    let hasPieceFinished = false;
    for (let i = 1; i <= 4; i++) {
        const pieceId = `p${i}` as keyof PiecesPosType;
        const currPiecePos = playerPiecesPos[playerId][pieceId];
        const currPos = updatedPos[playerId][pieceId];
        if (currPiecePos == tileId) {
            const ifDefaultPos = PlayerPiecesDefaultPos[playerId][pieceId] == tileId;
            const nextTile = findNextTile(diceNum, currPos, StartingTilesForEachPlayer[playerId], SafeZoneTiles[playerId], ArrowTiles[playerId], ifDefaultPos, PiecesMovementOrderArr);
            if (nextTile != -1) {
                updatedPos[playerId][pieceId] = nextTile;
                hasMoved = true;
                // piece has finished.
                if (nextTile == SafeZoneTiles[playerId][5]) {
                    hasPieceFinished = true;
                }
                break;
            }
        }
    }
    // if the piece has moved then check if has removed any other piece.
    if (hasMoved) {
        const newUpdatedPos = checkIfHasRemovedAnotherPiece(updatedPos, playerId, StartingTilesForEachPlayer, StarTiles, PlayerPiecesDefaultPos);
        hasCutAnotherPiece = newUpdatedPos.hasRemovedAnotherPiece;
        updatedPos = newUpdatedPos.tempPiecesPosOfPlayers;
    };
    // check if player has finished.
    let playerHasFinished = checkIfPlayerHasFinished(updatedPos[playerId], SafeZoneTiles[playerId][5]);

    return { hasMoved, updatedPos, hasCutAnotherPiece, hasPieceFinished, playerHasFinished };
};

const ChangeActivePlayer = (currPlayer: PlayersType, playerFinishedOrder: PlayersType[],availablePlayers:{player1:boolean,player2:boolean,player3:boolean,player4:boolean}): PlayersType => {
    let tempPlayer = currPlayer;
    while (true) {
        if (playerFinishedOrder.indexOf(tempPlayer) == -1 && tempPlayer != currPlayer && availablePlayers[tempPlayer] == true) {
            return tempPlayer;
        }
        if (tempPlayer == 'player1') {
            tempPlayer = 'player2';
        }
        else if (tempPlayer == 'player2') {
            tempPlayer = 'player3';
        }
        else if (tempPlayer == 'player3') {
            tempPlayer = 'player4';
        }
        else {
            tempPlayer = 'player1';
        }
    }
}

export default ChangeActivePlayer;

// this component check how many pieces of curr player can move with curr dice number.
export const CheckIfPiecesCanMove = (playerId: PlayersType, piecesPosOfCurrPlayer: PiecesPosType, diceNum: number): boolean[] => {
    let arr = [false, false, false, false];
    for (let i = 1; i <= 4; i++) {
        const pieceId = `p${i}` as keyof typeof piecesPosOfCurrPlayer;
        const pos = piecesPosOfCurrPlayer[pieceId];
        const safeZoneInd = SafeZoneTiles[playerId].indexOf(pos);
        //   check if the piece is inside the safe zone.
        if (safeZoneInd != -1 && diceNum) {
            const nextInd = safeZoneInd + diceNum;
            if (nextInd <= 5) {
                arr[i - 1] = true;
            }
        }
        // check if the piece is in default pos.
        else if (PlayerPiecesDefaultPos[playerId].p1 == pos || PlayerPiecesDefaultPos[playerId].p2 == pos || PlayerPiecesDefaultPos[playerId].p3 == pos || PlayerPiecesDefaultPos[playerId].p4 == pos) {
            if (diceNum == 6) {
                arr[i - 1] = true;
            }
        }
        else {
            arr[i - 1] = true;
        }
    }

    return arr;
}

