const DomElts = (function () {
  let squares = document.querySelectorAll(".sqr");
  let message = document.querySelector(".msg");
  let gameBoard = document.querySelector(".gameBoard");
  let resetGame = document.getElementById("newGame");

  return { squares, message, resetGame };
})();

const gameBoardArray = (function () {
  let gameBoardArray = [null, null, null, null, null, null, null, null, null];

  function resetBoard() {
    gameBoardArray = [null, null, null, null, null, null, null, null, null];
  }

  return { resetBoard, gameBoardArray };
})();

const GameControllers = (function () {
  let currentPlayers = null;
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
    currentPlayers = players.player1; // Initialise le premier joueur
  }

  function switchPlayer() {
    currentPlayers =
      currentPlayers === players.player1 ? players.player2 : players.player1;
    return currentPlayers;
  }

  function startGame() {
    gameBoardArray.resetBoard();
    initGame(); // Initialise le jeu et le joueur courant
  }

  function checkTie() {
    for (let i = 0; i < DomElts.squares.length; i++) {
      if (DomElts.squares[i].textContent === "") {
        return false;
      }
    }
    return true;
  }

  function checkWin(currentPlayer) {
    for (let i = 0; i < winPatterns.length; i++) {
      const [a, b, c] = winPatterns[i];
      if (
        DomElts.squares[a].textContent === currentPlayer &&
        DomElts.squares[b].textContent === currentPlayer &&
        DomElts.squares[c].textContent === currentPlayer
      ) {
        return true;
      }
    }
    return false;
  }

  return {
    startGame,
    switchPlayer,
    currentPlayers: () => currentPlayers,
    checkWin,
    checkTie,
  };
})();

const Game = (function () {
  let gameActive = true;

  function playGame() {
    GameControllers.startGame(); // Démarre le jeu

    DomElts.squares.forEach((square, index) => {
      square.addEventListener("click", function () {
        if (gameActive && !square.textContent) {
          // Vérifie si la case est vide
          square.textContent = GameControllers.currentPlayers(); // Utilise le joueur courant
          console.log(square.textContent);
          gameBoardArray.gameBoardArray[index] = square.textContent;

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

          GameControllers.switchPlayer(); // Change de joueur après le clic
          console.log(gameBoardArray.gameBoardArray);
        }
      });
    });
  }
  function newGame() {
    gameActive = true; // Réinitialiser l'état du jeu
    DomElts.message.textContent = ""; // Réinitialiser le message
    DomElts.squares.forEach((square) => {
      square.textContent = ""; // Réinitialiser le contenu des carrés
    });
    GameControllers.startGame(); // Réinitialiser le jeu
    playGame(); // Relancer le jeu
  }

  DomElts.resetGame.addEventListener("click", newGame); // Attacher l'événement ici

  return { playGame, newGame };
})();

Game.playGame();
