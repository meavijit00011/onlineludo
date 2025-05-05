import { Game } from "./Game";

type ClientsType = {
    c1: string,
    c2: string,
    c3: string,
    c4: string
};
type PlayersType = {
    player1: {
        cid: string,
        isAvailable: boolean
    },
    player2: {
        cid: string,
        isAvailable: boolean
    }
    player3: {
        cid: string,
        isAvailable: boolean
    },
    player4: {
        cid: string,
        isAvailable: boolean
    }
}
export class GameManager {
    clients: ClientsType;
    players: PlayersType;
    game: Game;
    lastMove: number;
    createdAt: number;
    gameid: string;
    constructor(clients: ClientsType, players: PlayersType, lastMove: number, gameid: string, createdAt?: number, game?: Game) {
        this.clients = clients;
        this.players = players;
        this.lastMove = lastMove;
        this.createdAt = createdAt || Date.now();
        this.game = game || new Game(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
        this.gameid = gameid;
    }
}