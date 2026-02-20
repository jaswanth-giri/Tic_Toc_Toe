let board;
let gameOver;

// 🏆 SCORE COUNTERS
let humanWins = 0;
let aiWins = 0;

const boardDiv = document.getElementById("board");
const statusText = document.getElementById("status");
const humanScoreSpan = document.getElementById("humanScore");
const aiScoreSpan = document.getElementById("aiScore");

const HUMAN = "X";
const AI = "O";

const WIN_COMBOS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

/* ---------- START / RESTART ---------- */

function startGame() {
    board = Array(9).fill("");
    gameOver = false;
    boardDiv.innerHTML = "";
    statusText.innerText = "";

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.onclick = () => playerMove(i);
        boardDiv.appendChild(cell);
    }

    const first = document.querySelector('input[name="first"]:checked').value;
    if (first === "ai") aiMove();
}

/* ---------- PLAYER MOVE ---------- */

function playerMove(index) {
    if (board[index] || gameOver) return;

    board[index] = HUMAN;
    render();

    if (checkWinner(board, HUMAN)) {
        humanWins++;
        updateScore();
        statusText.innerText = "You Win ❌";
        gameOver = true;
        return;
    }

    if (isDraw(board)) {
        statusText.innerText = "Draw 🤝";
        gameOver = true;
        return;
    }

    aiMove();
}

/* ---------- AI MOVE ---------- */

function aiMove() {
    const move = minimax(board, AI).index;
    board[move] = AI;
    render();

    if (checkWinner(board, AI)) {
        aiWins++;
        updateScore();
        statusText.innerText = "AI Wins 🤖";
        gameOver = true;
        return;
    }

    if (isDraw(board)) {
        statusText.innerText = "Draw 🤝";
        gameOver = true;
    }
}

/* ---------- UPDATE SCOREBOARD ---------- */

function updateScore() {
    humanScoreSpan.innerText = humanWins;
    aiScoreSpan.innerText = aiWins;
}

/* ---------- RENDER ---------- */

function render() {
    document.querySelectorAll(".cell").forEach((cell, i) => {
        cell.innerText = board[i];
    });
}

/* ---------- GAME CHECKS ---------- */

function checkWinner(b, player) {
    return WIN_COMBOS.some(combo =>
        combo.every(i => b[i] === player)
    );
}

function isDraw(b) {
    return b.every(cell => cell !== "");
}

/* ---------- MINIMAX (PERFECT AI) ---------- */

function minimax(newBoard, player) {

    if (checkWinner(newBoard, AI)) return { score: 10 };
    if (checkWinner(newBoard, HUMAN)) return { score: -10 };
    if (isDraw(newBoard)) return { score: 0 };

    const moves = [];

    for (let i = 0; i < 9; i++) {
        if (newBoard[i] === "") {
            const move = {};
            move.index = i;

            newBoard[i] = player;
            const result = minimax(newBoard, player === AI ? HUMAN : AI);
            move.score = result.score;
            newBoard[i] = "";

            moves.push(move);
        }
    }

    let bestScore = player === AI ? -Infinity : Infinity;
    let bestMoves = [];

    for (let m of moves) {
        if (
            (player === AI && m.score > bestScore) ||
            (player === HUMAN && m.score < bestScore)
        ) {
            bestScore = m.score;
            bestMoves = [m];
        } else if (m.score === bestScore) {
            bestMoves.push(m);
        }
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

/* ---------- AUTO START ---------- */

startGame();