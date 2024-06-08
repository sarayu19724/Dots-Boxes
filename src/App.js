// js
import React, { Component } from 'react';
import { Container, Row, Col, Input, InputGroup, InputGroupAddon, Button } from 'reactstrap';
import { Game, CONST } from 'dots-and-boxes';
// css
import 'bootstrap/dist/css/bootstrap.css';
import './css/style.css';
// img
import logo from './img/ms-icon-144x144.png';
import fieldEmptyImg from './img/empty.png';
import fieldArcImg from './img/arc.png';
import fieldCrossImg from './img/cross.png';

const PLAYER = CONST.PLAYER;
const BORDER_STYLE_FREE   = "1px dotted rgba(204,31,48,1)";
const BORDER_STYLE_STOKED = "2px solid ";
const BORDER_STYLE_HIDDEN = "1px none";
const fieldImageWidth     = 60;
const sideWidth           = 8; // see style.css
const fieldWidth          = fieldImageWidth + sideWidth + sideWidth;



/**
 * 
 * @props {Box} box
 * @props {function} onClick
 */
class BoardBox extends React.Component {

  fieldImageUrl () {
    let box = this.props.box;
    if(box) {
      if(box.owner === PLAYER.USER)     return fieldCrossImg;
      if(box.owner === PLAYER.COMPUTER) return fieldArcImg;
    };  
    return fieldEmptyImg;
  }
  
  lineCursor (side) {
    if (this.props.box.lines[side].owner === 0)
      return {};
    return {cursor: 'default'};
  }

  render () {
    let box = this.props.box;
    let x = box.pos.x + 1;
    let y = box.pos.y + 1;
    let ownerColor = ['rgba(204,31,48,1)', 'red', 'blue'];
    let boxStyle = {
      gridColumnStart: x,
      gridColumnEnd: x,
      gridRowStart:  y,
      gridRowEnd: y,
      borderTop:    BORDER_STYLE_HIDDEN,
      borderRight:  BORDER_STYLE_FREE,
      borderBottom: BORDER_STYLE_FREE,
      borderLeft:   BORDER_STYLE_HIDDEN
    };
    let imgStyle = {
      top:    4,
      left:   4,
      width:  50, 
      height: 50
    };
  
    if(box.pos.x === 0) {
      boxStyle.borderLeft = box.left ? BORDER_STYLE_STOKED + ownerColor[box.left] : BORDER_STYLE_FREE;
    }
    if(box.pos.y === 0) {
      boxStyle.borderTop = box.top ? BORDER_STYLE_STOKED + ownerColor[box.top] : BORDER_STYLE_FREE;
    }
    boxStyle.borderRight = box.right ? BORDER_STYLE_STOKED + ownerColor[box.right] : BORDER_STYLE_FREE;
    boxStyle.borderBottom = box.bottom ? BORDER_STYLE_STOKED + ownerColor[box.bottom] : BORDER_STYLE_FREE;

    return (
      <div className="boxContainer" key={this.props.box.id} style={boxStyle} >
        <div className="boxSideN" style={this.lineCursor('top')} onClick={this.props.lineClick.bind(this,box.lines.top.id)}></div>
        <div className="boxSideS" style={this.lineCursor('bottom')} onClick={this.props.lineClick.bind(this,box.lines.bottom.id)}></div>
        <div className="boxSideE" style={this.lineCursor('right')} onClick={this.props.lineClick.bind(this,box.lines.right.id)}></div>
        <div className="boxSideW" style={this.lineCursor('left')} onClick={this.props.lineClick.bind(this,box.lines.left.id)}></div>
        <img className="boxCenter" style={imgStyle} src={this.fieldImageUrl()} alt={this.props.box.id} />              
        </div>        
    );  
  }
  
};



/**
 * @property {Board} board
 * @property {function} lineClick
 */
class GameBoard extends React.Component {
    
  cells () {
    let boxes = this.props.board.boxes;
    let result = [];
    for (let i=0; i < boxes.length; i++) 
      result.push(<BoardBox box={boxes[i]} key={boxes[i].id} lineClick={this.props.lineClick} />);
    return result;
  }
  
  render () {
    let board = this.props.board;
    let boardWidth  = board.size.x * fieldWidth;
    let boardHeight = board.size.y * fieldWidth;
    let boardStyle = {
      display: 'grid',
      width:   boardWidth,
      height:  boardHeight,
      gridTemplateColumns: 'repeat(' + board.size.x + ' ' + fieldWidth + 'px)',
      gridTemplateRows:    'repeat(' + board.size.y + ' ' + fieldWidth + 'px)',
    }
    return (
     <div className="board_container" style={boardStyle}>
       {this.cells()}
     </div>
    );
  }
  
};


/**
 * 
 * @props {object} game
 * @props {object} turn
 * @props {function} undo
 * @props {function} computerStarts
 * @props {function} newGame
 */

class StatusMessage extends React.Component  {
  
  render () {
    let game = this.props.game;
    let turn = this.props.turn;
    let scores = game.scores;
    let undoButton = <Button outline color="secondary"  size="sm" onClick={this.props.undo}>Undo</Button>;
    let computerStartsButton = <Button outline color="warning"  size="sm" onClick={this.props.computerStarts}>Computer Starts</Button>;
    let newGameButton = <Button outline color="danger"  size="sm" onClick={this.props.newGame}>New Game</Button>;
    let scoreTxt = <p><strong>Scores</strong><br/>you <strong>{scores[PLAYER.USER]}</strong> computer <strong>{scores[PLAYER.COMPUTER]}</strong> </p>;

    if (turn === null) {
      return (
        <div>
          <p><strong>New game</strong></p>
          <p>
            {computerStartsButton}        
          </p>
        </div>
      );
    }

    if (scores[PLAYER.NONE] === 0) {
      return (
        <div>
          <p><strong>Game is over</strong></p>
          {scoreTxt}
          <p>
            {game.isSaved() ? undoButton : ''}
            &nbsp;
            {newGameButton}
            &nbsp;
            {computerStartsButton}        
          </p>
        </div>
      );
    }

    if (turn.complete) {
      return (
        <div>
          <p>Your turn: {describeTurn(turn)}</p>
          <p>You have occupied a field and can play again</p>
          {scoreTxt}
          <p>
            {game.isSaved() ? undoButton : ''}
            &nbsp;
            {newGameButton}
            &nbsp;
            {computerStartsButton}
          </p>
        </div>
      );
    }

    if (turn.otherTurn) {
      return (
        <div>
          <p>Your turn: {describeTurn(turn)}</p>
          <p>Computer: {describeTurnList(turn.otherTurn)}</p>
          {scoreTxt}
          <p>
            {game.isSaved() ? undoButton : ''}
            &nbsp;
            {newGameButton}
            &nbsp;
            {computerStartsButton}
          </p>
        </div>
      );
    }

    return (
      <div>
        <p>Your turn: {describeTurn(turn)}</p>
        {scoreTxt}
        <p>
          {game.isSaved() ? undoButton : ''}
          &nbsp;
          {newGameButton}
          &nbsp;
          {computerStartsButton}
        </p>
      </div>
    );  
  

    function describeTurn(turn) {
      if (!turn || turn.line === undefined) return '';
      let line = game.board.lines[ turn.line ];
      return [line.boxes[0].pos.x+1, line.boxes[0].pos.y+1, line.side].join(' ');
    }

    function describeTurnList(list) {
      if (!list) return '';
      var a = [];
      for (var i = 0; i < list.length; i++) a.push(describeTurn(list[i]));
      return a.join(', ');
    }
   
  }  
};


/**
 * 
 * @props {Pos} boardDim
 * @props {function} onBoardDimChange
 */
class OptionsPanel extends React.Component {

  constructor (props) {
    super(props);
    this.boardDimChangeX = this.boardDimChangeX.bind(this);
    this.boardDimChangeY = this.boardDimChangeY.bind(this);
  }
  
  boardDimChangeX (e) {
    let value = parseInt(e.target.value);
    if (value > 10) value = 10;
    if (value < 2)  value = 2;
    this.props.onBoardDimChange({x: value, y: this.props.boardDim.y});
  }

  boardDimChangeY (e) {
    let value = parseInt(e.target.value);
    if (value > 10) value = 10;
    if (value < 2)  value = 2;
    this.props.onBoardDimChange({y: value, x: this.props.boardDim.x});
  }

  render () {
    return (
      <div>
          <span className="display-5">Options</span>
          <InputGroup size="sm">
            <InputGroupAddon addonType="prepend">Columns</InputGroupAddon>
            <Input placeholder="Columns" type="number" min="2" max="10" step="1" onChange={this.boardDimChangeX} value={this.props.boardDim.x} />
            <InputGroupAddon addonType="prepend">Rows</InputGroupAddon>
            <Input placeholder="Rows" type="number" min="2" max="10" step="1" onChange={this.boardDimChangeY} value={this.props.boardDim.y} />
          </InputGroup>
      </div>
    );
  }
};



class App extends Component {
  
  constructor (props) {
    super(props);
    const boardDim = {x:4, y:4};
    this.state = {
      boardDim: boardDim,
      game: new Game({size: boardDim, level:2}),
      turn: null
    };
    this.lineClick = this.lineClick.bind(this);
    this.boardDimChange = this.boardDimChange.bind(this);
    this.computerStarts = this.computerStarts.bind(this);
    this.newGame = this.newGame.bind(this);
    this.undo = this.undo.bind(this);
  }
  
  boardDimChange (newDim) {
    let game = new Game({size: newDim, level:2});
    this.setState({
      boardDim: newDim,
      game:     game,
      turn:     null
    });
  }
  
  lineClick (line) {
    line = parseInt(line);
    console.log('lineClick', line);
    let game = this.state.game;
    let turn = game.executeUserTurn(line);
    if (turn) {
      this.setState({
        game: game,
        turn: turn
      });
    }
  }
  
  newGame () {
    let game = new Game({size: this.state.boardDim, level:2});
    this.setState({
      game:     game,
      turn:     null
    });
  }
  
  computerStarts () {
    let game = new Game({size: this.state.boardDim, level:2});
    game.executeAutoTurn(PLAYER.COMPUTER);
    this.setState({
      game:     game,
      turn:     null
    });
  }
  
  undo () {
    let game = this.state.game;
    game.restoreGame();
    this.setState({
      game:     game,
      turn:     {}
    });
  }
  
  render() {
    return (
      <Container>
        <Row>
          <Col size="10">
            <h1 className="display-3">Dots And Boxes</h1>
          </Col>
          <Col size="2S">
            <img src={logo} alt="logo"  className="img-responsive img-rounded" max-width="100%" height="50%" display="block" />
          </Col>
        </Row>
        <Row>
          <Col size="1">
            <StatusMessage 
              game={this.state.game} 
              turn={this.state.turn} 
              newGame={this.newGame}
              computerStarts={this.computerStarts}
              undo={this.undo}
            />
          </Col>   
          <Col size="auto" >
            <GameBoard 
              board={this.state.game.board} 
              lineClick={this.lineClick} 
            />
          </Col>   
          <Col size="1">
          </Col>   
        </Row>
        <Row>
          <Col size="1">
            <OptionsPanel 
              boardDim={this.state.boardDim} 
              onBoardDimChange={this.boardDimChange}
              />
          </Col>   
          <Col size="auto" />
          <Col size="1">
          </Col>   
        </Row>
      </Container>      
    );
  }
};

export default App;
