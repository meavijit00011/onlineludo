
export type GameModeType = 'online' | 'offline';

export type PlayerColorsType = {
    player1: {
        defaultColor: string,
        pieceColor: string,
    },
    player2: {
        defaultColor: string,
        pieceColor: string,
    },
    player3: {
        defaultColor: string,
        pieceColor: string,
    },
    player4: {
        defaultColor: string,
        pieceColor: string,
    }
}

export type TileType = {
    border: boolean,
    color: string,
    id: number
}

export type TileMapType = TileType[][];

export type PiecesPosType = {
    p1: number, p2: number, p3: number, p4: number
}

export type PlayerPosType = {
    player1: PiecesPosType,
    player2: PiecesPosType,
    player3: PiecesPosType,
    player4: PiecesPosType
};

export type PlayersType = 'player1' | 'player2' | 'player3' | 'player4';

export type DiceNumsType = {
    player1: number,
    player2: number,
    player3: number,
    player4: number
}

export type CanMoveType = boolean[];

export type UpdateGameActionType = 'roll_dice' | 'move_piece' | 'reset' | 'goback' | 'cancelgoback';

export type UpdateGameFnType = (actionType: UpdateGameActionType, payload: any) => void



export type StartingTileType = {
    player1: number,
    player2: number,
    player3: number,
    player4: number
}