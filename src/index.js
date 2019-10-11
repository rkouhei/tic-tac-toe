import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square (props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare (i) {
    return (
    <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
    );
  }

  render () {
    const items = Array(3);
    for (let i = 0; i < 3; i++) {
      const col_item = Array(3);
      for (let j = 0; j < 3; j++) {
        col_item[j] = this.renderSquare(i*3+j);
      }
      items[i] = (
        <div key={i} className="board-row">{col_item}</div>
      );
    }
    return (
      <div>{items}</div>
    );
  }
}

class Game extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        col: null,
        row: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      asc: true,
    };
  }

  handleClick (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const col = (i / 3) + 1;
    const row = (i % 3) + 1;;

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        col: parseInt(col),
        row: parseInt(row),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo (step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  historyReverse () {
    this.setState({
      asc: !this.state.asc,
    });
  }

  render () {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let oldplayer = (move % 2) === 0 ? 'O' : 'X';
      let choicehand = move > 0 ? ' ,' + oldplayer + ' turn ' + 'row: ' + history[move].row + ', col: ' + history[move].col : null;
      let desc = move ? 'Go to move #' + move + choicehand : 'Go to game start';
      if (this.state.stepNumber === move) {
        desc = <strong>{desc}</strong>;
      }
      return (
        <li key={move}>
          <buton onClick={() => this.jumpTo(move)}>{desc}</buton>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <div><buton onClick={() => this.historyReverse()}>
              {this.state.asc ? 'ascending' : 'descending'}
            </buton></div>
            {this.state.asc ? <ol>{moves}</ol> : <ol reversed>{moves.reverse()}</ol>}
          </div>
      </div>
    );
  }
}

function calculateWinner (squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

ReactDOM.render (
  <Game />,
  document.getElementById('root')
);