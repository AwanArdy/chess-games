const board = document.getElementById("chess-board");

// Posisi awal bidak
const initialPieces = [
    [
        "b_Rook",
        "b_Knight",
        "b_Bishop",
        "b_Queen",
        "b_King",
        "b_Bishop",
        "b_Knight",
        "b_Rook",
    ],
    [
        "b_Pawn",
        "b_Pawn",
        "b_Pawn",
        "b_Pawn",
        "b_Pawn",
        "b_Pawn",
        "b_Pawn",
        "b_Pawn",
    ],
    [],
    [],
    [],
    [],
    [
        "w_Pawn",
        "w_Pawn",
        "w_Pawn",
        "w_Pawn",
        "w_Pawn",
        "w_Pawn",
        "w_Pawn",
        "w_Pawn",
    ],
    [
        "w_Rook",
        "w_Knight",
        "w_Bishop",
        "w_Queen",
        "w_King",
        "w_Bishop",
        "w_Knight",
        "w_Rook",
    ],
];

// Membuat papan catur
function createChessBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            // warna sel terang dan gelap
            const isLight = (row + col) % 2 === 0;
            cell.classList.add(isLight ? "light" : "dark");

            // tambahkan bidak
            const piece = initialPieces[row]?.[col];
            if (piece) {
                const img = document.createElement("img");
                img.src = `assets/${piece}.png`;
                img.alt = piece;
                cell.appendChild(img);
            }
            board.appendChild(cell);
        }   
    }
}

createChessBoard();
