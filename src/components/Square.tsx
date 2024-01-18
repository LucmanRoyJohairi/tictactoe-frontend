import React from "react";

export const Square = ({ value, onSquareClick }) => {
  return (
    <button className="square border" onClick={onSquareClick}>
      {value}
    </button>
  );
}