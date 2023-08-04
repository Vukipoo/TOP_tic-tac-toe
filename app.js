const difficultyEnum = {
  easy: 0,
  medium: 1,
  hard: 2,
};

Object.freeze(difficultyEnum);

let gameActive = false;
let gameWon = false;
let playerChoice = "";
let computerChoice = "";
let playerTurn = true;
const gameBoard = ["", "", "", "", "", "", "", "", ""];

const board = document.querySelector(".board");
const cells = document.querySelectorAll(".cell");
let gameStatus = document.querySelector(".game--status");
let difficulty = 0;

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const winningMessage = () => (playerTurn ? "Computer Won!" : "You Won");
const drawMessage = "Draw!";

// player and computer choice buttons

const choiceX = document.getElementById("choiceX");
choiceX.addEventListener("click", () => {
  playerChoice = "X";
  computerChoice = "O";
  gameActive = true;
  toggleAllCells(false);
  choiceO.setAttribute("disabled", "true");
});

const choiceO = document.getElementById("choiceO");
choiceO.addEventListener("click", () => {
  playerChoice = "O";
  computerChoice = "X";
  gameActive = true;
  toggleAllCells(false);
  choiceX.setAttribute("disabled", "true");
});

// difficulty buttons

let easyMode = document.getElementById("easy");
let mediumMode = document.getElementById("medium");
let hardMode = document.getElementById("hard");

easyMode.addEventListener("click", function () {
  difficulty = difficultyEnum[this.id];
  mediumMode.disabled = true;
  hardMode.disabled = true;
});

mediumMode.addEventListener("click", function () {
  difficulty = difficultyEnum[this.id];
  easyMode.disabled = true;
  hardMode.disabled = true;
});

hardMode.addEventListener("click", function () {
  difficulty = difficultyEnum[this.id];
  mediumMode.disabled = true;
  easyMode.disabled = true;
});

function renderBoard() {
  cells.forEach((cell, index) => {
    cell.innerHTML = gameBoard[index];
  });
}

function toggleAllCells(disable = true) {
  cells.forEach((cell) =>
    disable ? cell.setAttribute("disabled", true) : cell.removeAttribute("disabled")
  );
}

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (gameActive && playerTurn && gameBoard[index] === "") {
      gameBoard[index] = playerChoice;
      playerTurn = false;
      renderBoard();

      if (!checkForWinner() && gameBoard.includes("")) {
        setTimeout(computerMove, 500); // added a delay for the computers move
      }
    }
  });

  if (!gameActive) cell.setAttribute("disabled", true);
});

function computerMove() {
  playerTurn = true;

  switch (difficulty) {
    case difficultyEnum.easy:
      let boardCopy = [...gameBoard.slice()];
      boardCopy.forEach((space, i) => {
        boardCopy[i] = { value: space, location: i };
      });
      const boardCopyFilteredByEmpty = boardCopy.filter(
        (space) => space.value === ""
      );
      let newRandom = Math.floor(
        Math.random() * boardCopyFilteredByEmpty.length
      );
      const location = boardCopyFilteredByEmpty[newRandom].location;
      gameBoard[location] = computerChoice;

      cells[location].innerHTML = computerChoice;
      cells[location].setAttribute("disabled", true);

      checkForWinner();

      break;
    case difficultyEnum.medium:
      // Implement medium difficulty logic here
      makeRandomMove();
      break;
    case difficultyEnum.hard:
      makeHardMove();
      break;
  }

  renderBoard();
  checkForWinner();
}




function makeHardMove() {
  const bestMove = minimax(gameBoard, computerChoice).index;
  gameBoard[bestMove] = computerChoice;
}

function minimax(board, currentPlayer) {
  const availableMoves = emptyCells(board);

  
  if (checkWin(board, playerChoice)) {
    return { score: -10 };
  } else if (checkWin(board, computerChoice)) {
    return { score: 10 };
  } else if (availableMoves.length === 0) {
    return { score: 0 };
  }

  const moves = [];

  for (let i = 0; i < availableMoves.length; i++) {
    const move = {};
    move.index = availableMoves[i];
    board[availableMoves[i]] = currentPlayer;

    if (currentPlayer === computerChoice) {
      const result = minimax(board, playerChoice);
      move.score = result.score;
    } else {
      const result = minimax(board, computerChoice);
      move.score = result.score;
    }

    board[availableMoves[i]] = ""; // reset the board after trying a move

    moves.push(move);
  }

  let bestMove;
  if (currentPlayer === computerChoice) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }//as
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function emptyCells(board) {
  return board.map((cell, index) => (cell === "" ? index : null)).filter((cell) => cell !== null);
}

function checkWin(board, player) {
  for (let i = 0; i < winningCombos.length; i++) {
    const [a, b, c] = winningCombos[i];
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }
  return false;
}

function checkForWinner() {
  if (gameBoard.filter((v) => v !== "").length > 4) {
    let len = winningCombos.length;

    for (let i = 0; i < len; i++) {
      const winCondition = winningCombos[i];
      const a = gameBoard[winCondition[0]];
      const b = gameBoard[winCondition[1]];
      const c = gameBoard[winCondition[2]];

      if (a !== "" && a === b && b === c) {
        gameWon = true;
        break;
      }
    }

    if (gameWon) {
      gameStatus.innerHTML = winningMessage();
      gameActive = false;
      return true;
    }

    let roundDraw = !gameBoard.includes("");

    if (roundDraw) {
      gameStatus.innerHTML = drawMessage;
      gameActive = false;
      return true;
    }
  }

  return false;
}
