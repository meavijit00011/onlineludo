export const PlayerWaitingQueueName = "Play_With_Random_Player_Queue";
export const event1 = "Player_Added_To_Random_Queue";
export const event2 = "Player_Added_To_Arr";
export const event3 = "Error";
export const event4 = "Start_Random";
export const event5 = "Start_With_Friend";
export const event6 = "New_Game_Created";
export const event7 = "Make_Move";
export const event8 = "Roll_Dice";
export const event9 = "State_Change";
import { TileType, PlayerColorsType, TileMapType, CanMoveType, PlayerPosType, StartingTileType } from "./types";

export const BoardHeight = 500;
export const BoardWidth = 500;
export const PlayerColors: PlayerColorsType = {
    player1: {
        defaultColor: "#3498db",
        pieceColor: "#21618c",
    },
    player2: {
        defaultColor: "#e74c3c",
        pieceColor: "#b03a2e",
    },
    player3: {
        defaultColor: "#28b463",
        pieceColor: "#1d8348",
    },
    player4: {
        defaultColor: "#f4d03f",
        pieceColor: "#b7950b",
    },
};
const T1: TileType = {
    color: PlayerColors.player2.defaultColor,
    border: false,
    id: -1
};
const T2: TileType = {
    color: "white",
    border: true,
    id: -1
};
const T3: TileType = {
    color: PlayerColors.player3.defaultColor,
    border: false,
    id: -1
};
const T4: TileType = {
    color: "white",
    border: false,
    id: -1
};
const T5: TileType = {
    color: PlayerColors.player1.defaultColor,
    border: false,
    id: -1
};
const T6: TileType = {
    color: PlayerColors.player1.defaultColor,
    border: true,
    id: -1
};
const T7: TileType = {
    color: PlayerColors.player4.defaultColor,
    border: false,
    id: -1
};
const T8: TileType = {
    color: PlayerColors.player4.defaultColor,
    border: true,
    id: -1
};
const T9: TileType = {
    color: PlayerColors.player3.defaultColor,
    border: true,
    id: -1
};
const T10: TileType = {
    color: PlayerColors.player2.defaultColor,
    border: true,
    id: -1
};

export const TileMap: TileMapType = [
    [
        { ...T1, id: 0 },
        { ...T1, id: 1 },
        { ...T1, id: 2 },
        { ...T1, id: 3 },
        { ...T1, id: 4 },
        { ...T1, id: 5 },
        { ...T2, id: 6 },
        { ...T2, id: 7 },
        { ...T2, id: 8 },
        { ...T3, id: 9 },
        { ...T3, id: 10 },
        { ...T3, id: 11 },
        { ...T3, id: 12 },
        { ...T3, id: 13 },
        { ...T3, id: 14 },
    ],
    [
        { ...T1, id: 15 },
        { ...T4, id: 16 },
        { ...T4, id: 17 },
        { ...T4, id: 18 },
        { ...T4, id: 19 },
        { ...T1, id: 20 },
        { ...T2, id: 21 },
        { ...T9, id: 22 },
        { ...T9, id: 23 },
        { ...T3, id: 24 },
        { ...T4, id: 25 },
        { ...T4, id: 26 },
        { ...T4, id: 27 },
        { ...T4, id: 28 },
        { ...T3, id: 29 },
    ],
    [
        { ...T1, id: 30 },
        { ...T4, id: 31 },
        { ...T4, id: 32 },
        { ...T4, id: 33 },
        { ...T4, id: 34 },
        { ...T1, id: 35 },
        { ...T2, id: 36 },
        { ...T9, id: 37 },
        { ...T2, id: 38 },
        { ...T3, id: 39 },
        { ...T4, id: 40 },
        { ...T4, id: 41 },
        { ...T4, id: 42 },
        { ...T4, id: 43 },
        { ...T3, id: 44 },
    ],
    [
        { ...T1, id: 45 },
        { ...T4, id: 46 },
        { ...T4, id: 47 },
        { ...T4, id: 48 },
        { ...T4, id: 49 },
        { ...T1, id: 50 },
        { ...T2, id: 51 },
        { ...T9, id: 52 },
        { ...T2, id: 53 },
        { ...T3, id: 54 },
        { ...T4, id: 55 },
        { ...T4, id: 56 },
        { ...T4, id: 57 },
        { ...T4, id: 58 },
        { ...T3, id: 59 },
    ],
    [
        { ...T1, id: 60 },
        { ...T4, id: 61 },
        { ...T4, id: 62 },
        { ...T4, id: 63 },
        { ...T4, id: 64 },
        { ...T1, id: 65 },
        { ...T2, id: 66 },
        { ...T9, id: 67 },
        { ...T2, id: 68 },
        { ...T3, id: 69 },
        { ...T4, id: 70 },
        { ...T4, id: 71 },
        { ...T4, id: 72 },
        { ...T4, id: 73 },
        { ...T3, id: 74 },
    ],
    [
        { ...T1, id: 75 },
        { ...T1, id: 76 },
        { ...T1, id: 77 },
        { ...T1, id: 78 },
        { ...T1, id: 79 },
        { ...T1, id: 80 },
        { ...T2, id: 81 },
        { ...T9, id: 82 },
        { ...T2, id: 83 },
        { ...T3, id: 84 },
        { ...T3, id: 85 },
        { ...T3, id: 86 },
        { ...T3, id: 87 },
        { ...T3, id: 88 },
        { ...T3, id: 89 },
    ],
    [
        { ...T2, id: 90 },
        { ...T10, id: 91 },
        { ...T2, id: 92 },
        { ...T2, id: 93 },
        { ...T2, id: 94 },
        { ...T2, id: 95 },
        { ...T4, id: 96 },
        { ...T4, id: 97 },
        { ...T4, id: 98 },
        { ...T2, id: 99 },
        { ...T2, id: 100 },
        { ...T2, id: 101 },
        { ...T2, id: 102 },
        { ...T2, id: 103 },
        { ...T2, id: 104 },
    ],
    [
        { ...T2, id: 105 },
        { ...T10, id: 106 },
        { ...T10, id: 107 },
        { ...T10, id: 108 },
        { ...T10, id: 109 },
        { ...T10, id: 110 },
        { ...T4, id: 111 },
        { ...T4, id: 112 },
        { ...T4, id: 113 },
        { ...T8, id: 114 },
        { ...T8, id: 115 },
        { ...T8, id: 116 },
        { ...T8, id: 117 },
        { ...T8, id: 118 },
        { ...T2, id: 119 },
    ],
    [
        { ...T2, id: 120 },
        { ...T2, id: 121 },
        { ...T2, id: 122 },
        { ...T2, id: 123 },
        { ...T2, id: 124 },
        { ...T2, id: 125 },
        { ...T4, id: 126 },
        { ...T4, id: 127 },
        { ...T4, id: 128 },
        { ...T2, id: 129 },
        { ...T2, id: 130 },
        { ...T2, id: 131 },
        { ...T2, id: 132 },
        { ...T8, id: 133 },
        { ...T2, id: 134 },
    ],
    [
        { ...T5, id: 135 },
        { ...T5, id: 136 },
        { ...T5, id: 137 },
        { ...T5, id: 138 },
        { ...T5, id: 139 },
        { ...T5, id: 140 },
        { ...T2, id: 141 },
        { ...T6, id: 142 },
        { ...T2, id: 143 },
        { ...T7, id: 144 },
        { ...T7, id: 145 },
        { ...T7, id: 146 },
        { ...T7, id: 147 },
        { ...T7, id: 148 },
        { ...T7, id: 149 },
    ],
    [
        { ...T5, id: 150 },
        { ...T4, id: 151 },
        { ...T4, id: 152 },
        { ...T4, id: 153 },
        { ...T4, id: 154 },
        { ...T5, id: 155 },
        { ...T2, id: 156 },
        { ...T6, id: 157 },
        { ...T2, id: 158 },
        { ...T7, id: 159 },
        { ...T4, id: 160 },
        { ...T4, id: 161 },
        { ...T4, id: 162 },
        { ...T4, id: 163 },
        { ...T7, id: 164 },
    ],
    [
        { ...T5, id: 165 },
        { ...T4, id: 166 },
        { ...T4, id: 167 },
        { ...T4, id: 168 },
        { ...T4, id: 169 },
        { ...T5, id: 170 },
        { ...T2, id: 171 },
        { ...T6, id: 172 },
        { ...T2, id: 173 },
        { ...T7, id: 174 },
        { ...T4, id: 175 },
        { ...T4, id: 176 },
        { ...T4, id: 177 },
        { ...T4, id: 178 },
        { ...T7, id: 179 },
    ],
    [
        { ...T5, id: 180 },
        { ...T4, id: 181 },
        { ...T4, id: 182 },
        { ...T4, id: 183 },
        { ...T4, id: 184 },
        { ...T5, id: 185 },
        { ...T2, id: 186 },
        { ...T6, id: 187 },
        { ...T2, id: 188 },
        { ...T7, id: 189 },
        { ...T4, id: 190 },
        { ...T4, id: 191 },
        { ...T4, id: 192 },
        { ...T4, id: 193 },
        { ...T7, id: 194 },
    ],
    [
        { ...T5, id: 195 },
        { ...T4, id: 196 },
        { ...T4, id: 197 },
        { ...T4, id: 198 },
        { ...T4, id: 199 },
        { ...T5, id: 200 },
        { ...T6, id: 201 },
        { ...T6, id: 202 },
        { ...T2, id: 203 },
        { ...T7, id: 204 },
        { ...T4, id: 205 },
        { ...T4, id: 206 },
        { ...T4, id: 207 },
        { ...T4, id: 208 },
        { ...T7, id: 209 },
    ],
    [
        { ...T5, id: 210 },
        { ...T5, id: 211 },
        { ...T5, id: 212 },
        { ...T5, id: 213 },
        { ...T5, id: 214 },
        { ...T5, id: 215 },
        { ...T2, id: 216 },
        { ...T2, id: 217 },
        { ...T2, id: 218 },
        { ...T7, id: 219 },
        { ...T7, id: 220 },
        { ...T7, id: 221 },
        { ...T7, id: 222 },
        { ...T7, id: 223 },
        { ...T7, id: 224 },
    ],
];

export const PlayerPiecesDefaultPos: PlayerPosType = {
    player1: {
        p1: 167,
        p2: 168,
        p3: 182,
        p4: 183,
    },
    player2: {
        p1: 32,
        p2: 33,
        p3: 47,
        p4: 48,
    },
    player3: {
        p1: 41,
        p2: 42,
        p3: 56,
        p4: 57,
    },
    player4: {
        p1: 176,
        p2: 177,
        p3: 191,
        p4: 192,
    }
};
export const StarTiles = [122, 36, 102, 188];

export const ArrowTiles = {
    player1: 217,
    player2: 105,
    player3: 7,
    player4: 119
};

export const CanMove: CanMoveType = [false, false, false, false];

export const PlayerActiveAnimatingTiles = {
    player1: [
        210, 211, 212, 213, 214, 215, 200, 185, 170, 155, 140, 139, 138, 137, 136,
        135, 150, 165, 180, 195,
    ],
    player2: [
        0, 1, 2, 3, 4, 5, 20, 35, 50, 65, 80, 79, 78, 77, 76, 75, 60, 45, 30, 15,
    ],
    player3: [
        9, 10, 11, 12, 13, 14, 24, 39, 54, 69, 84, 85, 86, 87, 88, 89, 74, 59, 44,
        29,
    ],
    player4: [
        144, 145, 146, 147, 148, 149, 164, 179, 194, 209, 224, 223, 222, 221, 220,
        219, 204, 189, 174, 159,
    ],
};

export const SafeZoneTiles = {
    player1: [202, 187, 172, 157, 142, 127],
    player2: [106, 107, 108, 109, 110, 111],
    player3: [22, 37, 52, 67, 82, 97],
    player4: [118, 117, 116, 115, 114, 113]
}

export const FinishedPosition = {
    player1: 127,
    player2: 111,
    player3: 97,
    player4: 113
}
export const PiecesMovementOrderArr = [201, 186, 171, 156, 141, 125, 124, 123, 122, 121, 120, 105, 90, 91, 92, 93, 94, 95, 81, 66, 51, 36, 21, 6, 7, 8, 23, 38, 53, 68, 83, 99, 100, 101, 102, 103, 104, 119, 134, 133, 132, 131, 130, 129, 143, 158, 173, 188, 203, 218, 217, 216];

export const StartingTilesForEachPlayer: StartingTileType = {
    player1: 201,
    player2: 91,
    player3: 23,
    player4: 133
};