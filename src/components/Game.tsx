import React, { useEffect, useState } from "react";
import { Board } from "./Board";
import axios from 'axios'

export const Game = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [playerId, setPlayerId] = useState('');

  const currentSquares = history[currentMove];


  useEffect(()=>{
    try {
     async function getPlayers() {
      const res = await axios.get('http://localhost:3002/api/join').then((res)=>{
        const { playerId } = res.data;
        setPlayerId(playerId);
      });
      console.log(res)
     
     }
     async function getGameState(){
       const res = await axios.get('http://localhost:3002/api/game').then((res)=>{
        const {history, currentMove} = res.data;
        setHistory(history || [Array(9).fill(null)]);
        setCurrentMove(currentMove);
        setXIsNext(playerId === 1)
      });
      console.log(res)
     }
     getGameState();
     getPlayers();
    } catch (err) {
      console.log(err)
    }
  },[])

  useEffect(()=>{

  },[])

  async function handlePlay (nextSquares) {
    try {
        const res = await axios.post('http://localhost:3002/api/play', {nextSquares: nextSquares})
        .then((res)=>{
          const {history, currentMove} = res.data;
          setHistory(history || [Array(9).fill(null)])
          setCurrentMove(currentMove || 0)
          setXIsNext(!xIsNext);
        })
      console.log(res)
      
    } catch (err) {
      console.log(err)
    }
  }
  async function handleReset() {
    try {
       const res = await axios.post('http://localhost:3002/api/reset')
        .then((res)=>{
          const {history, currentMove} = res.data;
          setHistory(history || [Array(9).fill(null)])
          setCurrentMove(currentMove || 0)
          setXIsNext(true);
        })
      console.log(res)
    } catch (err) {
      
    }
  }

  function jumpTo(nextMove) {
    if(nextMove === 0){
      handleReset()
    }
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Restart game';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  console.log('current player: ', playerId)
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
