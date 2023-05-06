const GameBoard = () => {
  let board = new Array(9).fill(null);

  const getBoard = () => board;

  const addMark = (position, mark) => {
    board[position] = mark;
  };

  const resetBoard = () => {
    board = board.map(el => null);
  };

  return { getBoard, addMark, resetBoard };
};

const Player = (name, mark) => {
  const getMark = () => mark;
  const getName = () => name;

  return { getMark, getName };
};

const GameController = (name1 = 'player1', name2 = 'player2') => {
  const player1 = Player(name1, 'X');
  const player2 = Player(name2, 'O');
  const gameBoard = GameBoard();
  let turnsPlayed = 0;
  let winner = null;
  let draw = false;

  const isDraw = () => draw;

  const getWinner = () => winner;

  const getActivePlayer = () => {
    return turnsPlayed % 2 == 0 ? player1 : player2;
  };

  const playMove = position => {
    const activePlayerMark = getActivePlayer().getMark();
    gameBoard.addMark(position, activePlayerMark);

    turnsPlayed++;
    if (hasWon(activePlayerMark)) {
      winner = activePlayerMark;
    } else if (turnsPlayed == 9) {
      draw = true;
    }
  };

  const hasWon = mark => {
    const board = gameBoard.getBoard();
    return (
      (board[0] === mark && board[0] === board[1] && board[0] === board[2]) ||
      (board[3] === mark && board[3] === board[4] && board[3] === board[5]) ||
      (board[6] === mark && board[6] === board[7] && board[6] === board[8]) ||
      (board[0] === mark && board[0] === board[3] && board[0] === board[6]) ||
      (board[1] === mark && board[1] === board[4] && board[1] === board[7]) ||
      (board[2] === mark && board[2] === board[5] && board[2] === board[8]) ||
      (board[0] === mark && board[0] === board[4] && board[0] === board[8]) ||
      (board[2] === mark && board[2] === board[4] && board[2] === board[6])
    );
  };

  const resetGame = () => {
    gameBoard.resetBoard();
    turnsPlayed = 0;
    winner = null;
    draw = false;
  };

  return {
    playMove,
    resetGame,
    isDraw,
    getWinner,
    getActivePlayer,
    getBoard: gameBoard.getBoard,
  };
};

const DisplayController = (() => {
  const game = GameController();
  const restartButton = document.querySelector('.restart-button');
  const boardElement = document.querySelector('.board-container');
  const statusElement = document.querySelector('.status-container');
  const squareElements = document.querySelectorAll('.square');

  restartButton.addEventListener('click', e => {
    game.resetGame();
    updateScreen();
  });

  squareElements.forEach(square => {
    square.addEventListener('click', e => {
      const position = Number.parseInt(e.target.dataset.index);
      const currentSquare = e.target;
      if (currentSquare.textContent) {
        return;
      }
      game.playMove(position);
      updateScreen();
    });
  });

  const updateScreen = () => {
    const draw = game.isDraw();
    const winner = game.getWinner();
    const activePlayer = game.getActivePlayer();

    if (draw) {
      setDrawMessage();
      blockBoard();
    } else if (winner !== null) {
      setWinnerMessage(winner);
      blockBoard();
    } else {
      updateTurnMessage(activePlayer.getMark());
      unblockBoard();
    }

    clearBoard();
    game.getBoard().forEach((value, index) => {
      if (value !== null) {
        squareElements[index].innerHTML = value;
      }
    });
  };

  const blockBoard = () => {
    boardElement.classList.add('unclickable');
  };

  const unblockBoard = () => {
    boardElement.classList.remove('unclickable');
  };

  const clearBoard = () => {
    squareElements.forEach(square => (square.innerHTML = ''));
  };

  const setGameStatusMessage = message => {
    statusElement.innerHTML = message;
  };

  const updateTurnMessage = mark => {
    setGameStatusMessage(`${mark}'s turn`);
  };

  const setWinnerMessage = mark => {
    setGameStatusMessage(`The winner is ${mark}`);
  };

  const setDrawMessage = () => {
    setGameStatusMessage(`It's a draw`);
  };

  updateScreen();
})();
