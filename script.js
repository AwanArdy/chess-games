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

let selectedCell = null;
let validMoves = [];

// Membuat papan catur
function createChessBoard() {
    board.innerHTML = "";
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            // warna sel terang dan gelap
            const isLight = (row + col) % 2 === 0;
            cell.classList.add(isLight ? "light" : "dark");
            cell.dataset.row = row;
            cell.dataset.col = col;

            // tambahkan bidak
            const piece = initialPieces[row]?.[col];
            if (piece) {
                const img = document.createElement("img");
                img.src = `assets/${piece}.png`;
                img.alt = piece;
                cell.appendChild(img);
            }

            cell.addEventListener("click", () => handleCellClick(cell));
            board.appendChild(cell);
        }   
    }
}

// Mengatur langkah valid
function getValidMoves(piece, row, col) {
    const moves = [];
    const isWhite = piece.startsWith("w");
    const direction = isWhite ? -1 : 1;

    if (piece.includes("Pawn")) {

        // Maju satu langkah
        if (isValidCell(row + direction, col)) moves.push([row + direction, col]);

        // Maju dua langkah (langkah pertama)
        if ((isWhite && row === 6) || (!isWhite && row === 1)) {
            if (isValidCell(row + 2 * direction, col)) moves.push([row + 2 * direction, col]);
        }

        // Makan bidak diagonal
        [[row + direction, col - 1], [row + direction, col + 1]].forEach(([r, c]) => {
            if (isValidCell(r, c) && isOpponentPiece(r, c, isWhite)) moves.push([r, c]);
        })
    }

    if (piece.includes("Rook") || piece.includes("Queen")) {
        // Gerakan horizontal & vertikal
        addLinearMoves(row, col, moves, isWhite, [[1, 0], [-1, 0], [0, 1], [0, -1]]);
    }

    if (piece.includes("Bishop") || piece.includes("Queen")) {
        // Gerakan diagonal
        addLinearMoves(row, col, moves, isWhite, [[1, 1], [1, -1], [-1, 1], [-1, -1]]);
    }

    if (piece.includes("Knight")) {
        [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, dc]) => {
            const r = row + dr, c = col + dc;
            if (isValidCell(r, c) && !isSameTeam(r, c, isWhite)) moves.push([r, c]);
        });
    }

    if (piece.includes("King")) {
        [[1, 0], [-1, 0], [0, 1], [0, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dr, dc]) => {
            const r = row + dr, c = col + dc;
            if (isValidCell(r, c) && !isSameTeam(r, c, isWhite)) moves.push([r, c]);
        });
    }

    return moves;
}

// Menambah langkah linear (Rook, Bishop, Queen)
function addLinearMoves(row, col, moves, isWhite, directions) {
    directions.forEach(([dr, dc]) => {
        let r = row + dr, c = col + dc;
        while (isValidCell(r, c)) {
            if (isSameTeam(r, c, isWhite)) break;
            moves.push([r, c]);
            if (isOpponentPiece(r, c, isWhite)) break;
            r += dr;
            c += dc;
        }
    });
}

// validasi sel
function isValidCell(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// Apakah bidak lawan?
function isOpponentPiece(row, col, isWhite) {
    const piece = initialPieces[row]?.[col];
    return piece && piece.startsWith(isWhite ? "b" : "w");
}

// Apakah bidak satu tim?
function isSameTeam(row, col, isWhite) {
    const piece = initialPieces[row]?.[col];
    return piece && piece.startsWith(isWhite ? "w" : "b");
}

// Highlight langkah valid
function highlightValidMoves(moves) {
    validMoves = moves;
    moves.forEach(([row, col]) => {
        const cell = getCell(row, col);
        cell.classList.add("valid-move");
    });
}

// Hapus highlight
function clearHighlights() {
    validMoves.forEach(([row, col]) => {
        const cell = getCell(row, col);
        cell.classList.remove("valid-move");
    });
    validMoves = [];
}

// Mendapatkan sel berdasarkan posisi
function getCell(row, col) {
    return board.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

// Menangani klik pada cell
function handleCellClick(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const piece = initialPieces[row][col];

    // Jika ada langkah valid dan klik pada langkah valid, pindahkan bidak
    if (selectedCell && validMoves.some(([r, c]) => r === row && c === col)) {
        movePiece(selectedCell, cell);
        selectedCell = null;
        clearHighlights();
        return;
    }

    // Jika klik bidak baru
    if (piece) {
        selectedCell = cell;
        clearHighlights();
        const moves = getValidMoves(piece, row, col);
        highlightValidMoves(moves);
    }
}

// Memindahkan bidak
function movePiece(fromCell, toCell) {
    const fromRow = parseInt(fromCell.dataset.row);
    const fromCol = parseInt(fromCell.dataset.col);
    const toRow = parseInt(toCell.dataset.row);
    const toCol = parseInt(toCell.dataset.col);

    // Pindahkan data bidak
    const piece = initialPieces[fromRow][fromCol];
    initialPieces[fromRow][fromCol] = null;
    initialPieces[toRow][toCol] = piece;

    // Perbarui UI
    createChessBoard();
}

createChessBoard();
