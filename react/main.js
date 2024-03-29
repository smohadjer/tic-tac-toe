const app = document.getElementById('app');

function Game() {
  const [history, setHistory] = React.useState([
    {
      squares: Array(9).fill(null),
      index: undefined
    }
  ]);
  const [currentMove, setCurrentMove] = React.useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <Moves history={history} currentMove={currentMove} jumpTo={jumpTo}/>
      </div>
    </div>
  );
}

function Board({xIsNext, squares, onPlay}) {
  const {winner, lines} = calculateWinner(squares) || {};
  const status = winner ? `Winner: ${winner}` :
    !squares.includes(null) ? 'It\'s a draw!' :
    `Next player: ${xIsNext ? 'X' : 'O'}`;

  React.useEffect(() => {
    console.log('squares:', squares);
  });

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = [...squares];
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay({
      squares: nextSquares,
      index: i
    });
  }

  function getRowContent(i) {
    const tmp = [];
    for (let j=i; j<i+3; j++) {
      const win = (lines && lines.includes(j)) ? true : false;
      tmp.push(
        <Square win={win} key={j} value={squares[j]} onSquareClick={() => {handleClick(j)}} />
      )
    }
    return tmp;
  }

  function getBoard() {
    const rows = [];
    for (let i=0; i<9; i+=3) {
      rows.push(
        <div key={i} className="board-row">
          {getRowContent(i)}
        </div>
      )
    }
    return rows;
  }

  return (
    <div className="board">
      <div className="status">{status}</div>
      {getBoard()}
    </div>
  )
}

function Square({value, onSquareClick, win}) {
  const className = win ? 'square won' : 'square';
  return (
    <button className={className} onClick={onSquareClick}>{value}</button>
  )
}

function Moves({history, currentMove, jumpTo}) {
  const [orderIsReversed, setOrderIsReversed] = React.useState(false);

  function reverseOrder() {
    setOrderIsReversed(!orderIsReversed);
  }

  const moves = history.map((historyObject, move) => {
    const cells = ['row1, col1','row1, col2','row1, col3','row2, col1','row2, col2','row2, col3','row3, col1','row3, col2','row3, col3'];
    const index = historyObject.index;
    const info = ' (' + historyObject.squares[index] + ' at ' + cells[index] + ')';
    let description;
    if (move === currentMove) {
      description = 'You are at move #' + move;
      if (move > 0) description += info;
    } else {
      if (move > 0) {
        description = 'Go to move #' + move + info;
      } else {
        description = 'Go to game start';
      }
    }

    return (
      <li key={move}>
        {(move === currentMove) ? <span>{description}</span> :
          <button onClick={() => jumpTo(move)}>{description}</button>
        }
      </li>
    );
  });

  return (
    <>
      <button onClick={reverseOrder}>Reverse Order of Moves</button>
      <h3>Moves</h3>
      <ul>
        {orderIsReversed ? [...moves].reverse() : moves}
      </ul>
    </>
  )
}

/* returns an object containing winner and the winning squares otherwise null */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        lines: lines[i]
      }
    }
  }
  return null;
}

ReactDOM.render(<Game />, app);
