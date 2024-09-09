const DomElts = (function () {
  let squares = document.querySelectorAll(".sqr");
  let message = document.querySelector(".msg");
  let gameBoard = document.querySelector(".gameBoard");
  let resetGame = document.getElementById("newGame");

  return { squares, message, resetGame };
})();

const gameBoardArray = (function () {
  let board = [null, null, null, null, null, null, null, null, null];

  function resetBoard() {
    board = [null, null, null, null, null, null, null, null, null];
  }

  function updateBoard(index, value) {
    board[index] = value;
  }

  function getBoard() {
    return board;
  }

  return { resetBoard, updateBoard, getBoard };
})();

const GameControllers = (function () {
  let currentPlayer = null;
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const players = {
    player1: "X",
    player2: "O",
  };

  function initGame() {
    currentPlayer = players.player1; // Initialize the first player
  }

  function switchPlayer() {
    currentPlayer =
      currentPlayer === players.player1 ? players.player2 : players.player1;
    return currentPlayer;
  }

  function startGame() {
    gameBoardArray.resetBoard();
    initGame(); // Initialize the game and the current player
  }

  function checkTie() {
    return !gameBoardArray.getBoard().includes(null);
  }

  function checkWin(player) {
    return winPatterns.some(
      ([a, b, c]) =>
        DomElts.squares[a].textContent === player &&
        DomElts.squares[b].textContent === player &&
        DomElts.squares[c].textContent === player
    );
  }

  return {
    startGame,
    switchPlayer,
    currentPlayer: () => currentPlayer,
    checkWin,
    checkTie,
  };
})();

const Game = (function () {
  let gameActive = true;
  let player1Name = "Player 1";
  let player2Name = "Player 2";

  const player1Input = document.getElementById("player1");
  const player2Input = document.getElementById("player2");
  const playerBtnSubmit = document.getElementById("player-tbn-submit");

  playerBtnSubmit.addEventListener("click", (event) => {
    event.preventDefault();
    player1Name = player1Input.value || "Player 1";
    player2Name = player2Input.value || "Player 2";
  });

  function playGame() {
    GameControllers.startGame(); // Start the game

    DomElts.squares.forEach((square, index) => {
      square.addEventListener("click", function () {
        if (gameActive && !square.textContent) {
          square.textContent = GameControllers.currentPlayer(); // Use the current player
          gameBoardArray.updateBoard(index, square.textContent);

          if (GameControllers.checkWin(square.textContent)) {
            DomElts.message.textContent = `Game over! ${square.textContent} wins!`;
            gameActive = false;
            return;
          }
          if (GameControllers.checkTie()) {
            DomElts.message.textContent = `Game is tied`;
            DomElts.message.style.color = "green";
            return;
          }

          DomElts.message.textContent =
            GameControllers.currentPlayer() === "X"
              ? `${player1Name}'s turn!`
              : `${player2Name}'s turn!`;

          GameControllers.switchPlayer(); // Switch player after the click
        }
      });
    });
  }

  function newGame() {
    gameActive = true; // Reset game state
    DomElts.message.textContent = ""; // Reset message
    DomElts.squares.forEach((square) => {
      square.textContent = ""; // Clear square content
    });
    GameControllers.startGame(); // Reset game
    playGame(); // Restart the game
  }

  DomElts.resetGame.addEventListener("click", newGame); // Attach event here

  return { playGame, newGame };
})();

Game.playGame();
