let gameBoard = ["", "", "", "", "", "", "", "", ""];
const gameBoardElement = document.querySelector("div.js-board-container");

let computerPiece, playerPiece;

function renderGameBoard() {
    gameBoardElement.innerHTML = "";
    gameBoard.forEach((move) => {
        if (!move) {
            gameBoardElement.innerHTML += `
                <div class="board-element">
                    <img class="grey-square" alt="Grey Square" src="images/grey-square.png">
                </div>
            `;
        } else if (move === "x") {
            gameBoardElement.innerHTML += `
                <div class="board-element">
                    <img class="grey-square" alt="Grey Square" src="images/grey-square.png">
                    <div class="move">
                        <img alt="X" src="images/cross.png" class="move-icon">
                    </div>
                </div>
            `;
        } else if (move === "o") {
            gameBoardElement.innerHTML += `
                <div class="board-element">
                    <img class="grey-square" alt="Grey Square" src="images/grey-square.png">
                    <div class="move">
                        <img alt="O" src="images/circle.png" class="move-icon">
                    </div>
                </div>
            `;
        }
    });

    const greySquareImages = document.querySelectorAll("img.grey-square");
    greySquareImages.forEach((element, index) =>
        element.addEventListener("click", () => {
            if (gameStatus.innerHTML === "Your move" && !gameBoard[index]) {
                gameBoard.splice(index, 1, playerPiece);
                renderGameBoard();
                const status = checkGameStatus();
                if (!status) playComputerMove();
            }
        })
    );
}

function pickRandomMove() {
    const filteredGameBoard = gameBoard
        .map((move, index) => ({
            move,
            index,
        }))
        .filter((move) => !move.move);

    return filteredGameBoard[Math.floor(Math.random() * filteredGameBoard.length)].index;
}

function minimax(board, depth, isMaximizing) {
    const winner = getWinner(board);
    if (winner === computerPiece) return 10 - depth;
    if (winner === playerPiece) return depth - 10;
    if (isBoardFull(board)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = computerPiece;
                const score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = playerPiece;
                const score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function getWinner(board) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
        [0, 4, 8], [2, 4, 6]             // Diagonal
    ];

    for (const [a, b, c] of winningCombinations) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function isBoardFull(board) {
    return board.every(cell => cell);
}

function pickBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < gameBoard.length; i++) {
        if (!gameBoard[i]) {
            gameBoard[i] = computerPiece;
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function playMove(index, move) {
    gameBoard[index] = move;
    renderGameBoard();
}

const gameStatus = document.querySelector("p.js-game-status");
const difficultySelection = document.querySelector("select.js-difficult-selector");

function playComputerMove() {
    gameStatus.innerHTML = "Computer's move";

    setTimeout(() => {
        const moveIndex =
            // @ts-ignore
            difficultySelection.value === "Easy" ||
            // @ts-ignore
            (difficultySelection.value === "Medium" && Math.random() > 0.5)
                ? pickRandomMove()
                : pickBestMove();
        playMove(moveIndex, computerPiece);

        const status = checkGameStatus();
        if (!status) gameStatus.innerHTML = "Your move";
    }, Math.random() * 1000 + 1000);
}

const startGameButton = document.querySelector("button.js-start-game-button");

function checkGameStatus() {
    let status;

    gameBoard.forEach((move, index) => {
        if (
            move &&
            // Horizontal row check.
            ((index % 3 === 0 && gameBoard[index + 1] === move && gameBoard[index + 2] === move) ||
                // Vertical row check.
                (gameBoard[index + 3] === move && gameBoard[index + 6] === move) ||
                // Diagonal up to down check.
                (move === gameBoard[0] && move === gameBoard[4] && move === gameBoard[8]) ||
                // Diagonal down to up check.
                (move === gameBoard[2] && move === gameBoard[4] && move === gameBoard[6]))
        ) {
            gameStatus.innerHTML =
                move === playerPiece ? "Congratulations, you won!" : "The AI won";
            status = "complete";
        }
    });

    if (!status && gameBoard.every((move) => move)) {
        gameStatus.innerHTML = "It's a tie!";
        status = "complete";
    }

    return status;
}

startGameButton.addEventListener("click", () => {
    // @ts-ignore
    if (difficultySelection.value !== "Select Difficulty") {
        gameBoard = ["", "", "", "", "", "", "", "", ""];

        if (Math.random() < 0.5) {
            playerPiece = "x";
            computerPiece = "o";
            gameStatus.innerHTML = "Your move";
        } else {
            playerPiece = "o";
            computerPiece = "x";
            gameStatus.innerHTML = "AI's move";
            playComputerMove();
        }

        renderGameBoard();
    }
});
