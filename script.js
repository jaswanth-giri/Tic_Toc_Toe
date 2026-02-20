const boardDiv = document.getElementById("board");
const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");

const modal = document.getElementById("resultModal");
const resultText = document.getElementById("resultText");

const HUMAN = "X";
const AI = "O";

const WIN_COMBOS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

let board;
let currentPlayer;
let gameOver;
let mode = "HUMAN_AI";

let score = { X: 0, O: 0 };

document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener("change", e => {
        mode = e.target.value;
        restartGame();
    });
});

function startBoard() {
    boardDiv.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("button");
        cell.className = "cell";
        cell.onclick = () => playerMove(i);
        boardDiv.appendChild(cell);
    }
}

function playerMove(i) {
    if (board[i] || gameOver) return;

    board[i] = currentPlayer;
    render();

    if (checkWinner(board, currentPlayer)) {
        score[currentPlayer]++;
        updateScore();
        gameOver = true;
        showResult(mode === "HUMAN_HUMAN"
            ? `Player ${currentPlayer} Wins 🎉`
            : "🎉 You Win!");
        return;
    }

    if (isDraw()) {
        gameOver = true;
        showResult("🤝 It's a Draw!");
        return;
    }

    currentPlayer = currentPlayer === HUMAN ? AI : HUMAN;

    if (mode !== "HUMAN_HUMAN" && currentPlayer === AI) {
        setTimeout(aiMove, 300);
    }
}

function aiMove() {
    if (gameOver) return;

    const bestMove = minimax(board, AI).index;
    board[bestMove] = AI;
    render();

    if (checkWinner(board, AI)) {
        score.O++;
        updateScore();
        gameOver = true;
        showResult("🤖 AI Wins!");
        return;
    }

    if (isDraw()) {
        gameOver = true;
        showResult("🤝 It's a Draw!");
        return;
    }

    currentPlayer = HUMAN;
}

/* -------- MINIMAX WITH RANDOMIZED BEST MOVES -------- */
function minimax(newBoard, player) {
    const empty = newBoard
        .map((v, i) => v === "" ? i : null)
        .filter(v => v !== null);

    if (checkWinner(newBoard, HUMAN)) return { score: -10 };
    if (checkWinner(newBoard, AI)) return { score: 10 };
    if (empty.length === 0) return { score: 0 };

    const moves = [];

    for (let i of empty) {
        const move = {};
        move.index = i;
        newBoard[i] = player;

        const result = minimax(newBoard, player === AI ? HUMAN : AI);
        move.score = result.score;

        newBoard[i] = "";
        moves.push(move);
    }

    let bestScore = player === AI ? -Infinity : Infinity;

    for (let m of moves) {
        if (player === AI) bestScore = Math.max(bestScore, m.score);
        else bestScore = Math.min(bestScore, m.score);
    }

    const bestMoves = moves.filter(m => m.score === bestScore);
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

/* -------- HELPERS -------- */
function checkWinner(b, p) {
    return WIN_COMBOS.some(c => c.every(i => b[i] === p));
}

function isDraw() {
    return board.every(c => c !== "");
}

function render() {
    document.querySelectorAll(".cell").forEach((c, i) => {
        c.textContent = board[i];
    });
}

function updateScore() {
    xScoreEl.textContent = score.X;
    oScoreEl.textContent = score.O;
}

/* -------- POPUP -------- */
function showResult(msg) {
    resultText.innerText = msg;
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
    
}

/* -------- RESTART -------- */
function restartGame() {
    board = Array(9).fill("");
    gameOver = false;
    currentPlayer = HUMAN;
    startBoard();

    if (mode === "AI_HUMAN") {
        currentPlayer = AI;
        aiMove();
    }
}

restartGame();