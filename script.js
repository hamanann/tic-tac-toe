const gameBoard = (() => {
  let board = new Array(9).fill(null);

  const getBoard = () => board;

  const addMark = (position, mark) => {
    board[position] = mark;
  };

  const resetBoard = () => {
    board = board.map(el => null);
  };

  return { getBoard, addMark, resetBoard };
})();

const displayController = (() => {
  const restartButton = document.querySelector('.restart-button');
  const boardElement = document.querySelector('.board-container');
  const statusElement = document.querySelector('.status-container');
  const squareElements = document.querySelectorAll('.square');

  restartButton.addEventListener('click', e => {
    gameController.resetGame();
  });

  squareElements.forEach(square => {
    square.addEventListener('click', e => {
      const position = Number.parseInt(e.target.dataset.index);
      const currentSquare = e.target;
      if (currentSquare.textContent) {
        return;
      }
      gameController.playMove(position);
    });
  });

  const markSquare = (position, mark) => {
    squareElements[position].textContent = mark;
  };

  const gameOver = message => {
    if (message === 'draw') {
      setDrawMessage();
    } else {
      setWinnerMessage(message);
    }
    blockBoard();
  };

  const blockBoard = () => {
    boardElement.classList.add('unclickable');
  };

  const unblockBoard = () => {
    boardElement.classList.remove('unclickable');
  };

  const emptyBoard = () => {
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

  const resetBoard = startPlayerMark => {
    emptyBoard();
    updateTurnMessage(startPlayerMark);
    unblockBoard();
  };

  const setCurrentPlayer = player => {
    updateTurnMessage(player.getMark());
  };

  return { markSquare, gameOver, resetBoard, setCurrentPlayer };
})();

const Player = (name, mark) => {
  const getMark = () => mark;
  const getName = () => name;

  return { getMark, getName };
};

const gameController = (() => {
  const player1 = Player('player1', 'X');
  const player2 = Player('player2', 'O');
  let turnsPlayed = 0;

  const getCurrentPlayer = () => {
    return turnsPlayed % 2 == 0 ? player1 : player2;
  };

  const playMove = position => {
    const currentPlayerMark = getCurrentPlayer().getMark();
    gameBoard.addMark(position, currentPlayerMark);
    displayController.markSquare(position, currentPlayerMark);

    turnsPlayed++;
    if (hasWon(currentPlayerMark)) {
      displayController.gameOver(currentPlayerMark);
    } else if (turnsPlayed == 9) {
      displayController.gameOver('draw');
    } else {
      displayController.setCurrentPlayer(getCurrentPlayer());
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
    turnsPlayed = 0;
    gameBoard.resetBoard();
    displayController.resetBoard(player1.getMark());
  };

  return { playMove, resetGame };
})();
