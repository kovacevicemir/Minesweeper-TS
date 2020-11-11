import "./app.scss";

import React, { useState, useEffect } from "react";
import NumberDisplay from "../NumberDisplay";
import { generateCells } from "../../Utils";
import Face from "../Face/Face";
import ButtonCell from "../ButtonCell";
import { Cell, EFace } from "../../Types";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<EFace>(EFace.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseDown = (): void => {
      setFace(EFace.oh);
    };

    const handleMouseUp = (): void => {
      setFace(EFace.smile);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    //clear listeners
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  },[]);

  useEffect(()=>{
    if(live){
      const timer = setInterval(()=>{
        setTime(time + 1);
      },1000)

      return () => {
        clearInterval(timer);
      }
    }
    
  },[live, time])

  const handleCellClick = (rowParam:number, colParam:number):void =>{
    console.log(rowParam, colParam)
    //start the game
    if(!live){
      setLive(true);
    }
  }

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        return (
          <ButtonCell
            key={`${rowIndex}-${colIndex}`}
            state={cell.state}
            value={cell.value}
            row={rowIndex}
            col={colIndex}
            onClick={handleCellClick}
          />
        );
      })
    );
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={0} />
        <Face smiley={face} />
        <NumberDisplay value={time} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default App;
