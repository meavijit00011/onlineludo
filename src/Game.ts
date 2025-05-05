import { CanMove, PlayerPiecesDefaultPos } from "./constants";
import { CanMoveType, DiceNumsType, PlayerPosType, PlayersType } from "./types";
const init_dice_nums = {
    player1: -1,
    player2: -1,
    player3: -1,
    player4: -1
}
export class Game {
    piecesPosOfPlayers: PlayerPosType;
    diceNum: DiceNumsType;
    activePlayer: PlayersType;
    canMove: CanMoveType;
    allowedToMove: boolean;
    gameFinished: boolean;
    playerFinishedOrder: PlayersType[];
    quitGame: boolean;
    allowedToRoll: 'allowed' | 'not_allowed';
    constructor(piecesPosOfPlayers?: PlayerPosType, diceNum?: DiceNumsType, activePlayer?: PlayersType, canMove?: CanMoveType, allowedToMove?: boolean, gameFinished?: boolean, playerFinishedOrder?: PlayersType[], quitGame?: boolean, allowedToRoll?: 'allowed' | 'not_allowed') {
        this.piecesPosOfPlayers = piecesPosOfPlayers || PlayerPiecesDefaultPos;
        this.diceNum = diceNum || init_dice_nums;
        this.activePlayer = activePlayer || 'player1';
        this.canMove = canMove || CanMove;
        this.allowedToMove = allowedToMove || false;
        this.gameFinished = gameFinished || false;
        this.playerFinishedOrder = playerFinishedOrder || [];
        this.quitGame = quitGame || false;
        this.allowedToRoll = allowedToRoll || 'allowed';
    }
}