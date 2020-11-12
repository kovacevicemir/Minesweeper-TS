import "./app.scss";

import React, { useState, useEffect } from "react";
import NumberDisplay from "../NumberDisplay";
import { generateCells, openMultipleCells } from "../../Utils";
import Face from "../Face/Face";
import ButtonCell from "../ButtonCell";
import { Cell, CellState, CellValue, EFace } from "../../Types";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<EFace>(EFace.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCount, setBombCount] = useState<number>(10);

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
  }, []);

  useEffect(() => {
    if (live && time < 999) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [live, time]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    //start the game
    if (!live) {
      //TODO: Make sure you dont click on a bomb in the beginning
      setLive(true);
    }

    const currentCell = cells[rowParam][colParam];
    let newCells = cells.slice();

    if(currentCell.state === CellState.flagged || currentCell.state === CellState.visible){
      return; //if there is a flag or cell is already opened dont do anything
    }

    if(currentCell.value === CellValue.bomb){
      //TODO: take care of bomb click!
    }else if(currentCell.value === CellValue.none){
      //Open multiple cells - spreading;
      newCells = openMultipleCells(newCells,rowParam,colParam);
      setCells(newCells)
    }else{
      newCells[rowParam][colParam].state = CellState.visible;
    }
    setCells(newCells)
  };

  //right click - put flag
  const onContextMenu = (rowParam: number, colParam: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
    if(!live){
      return //Cant put flag if game hasn`t started
    }

    const currentCells = cells.slice(); //copy of current cells
    const currentCell = cells[rowParam][colParam];
    if (currentCell.state === CellState.visible) {
      return;
    } else if (currentCell.state === CellState.open) {
      currentCells[rowParam][colParam].state = CellState.flagged;
      setCells(currentCells);
      setBombCount(bombCount-1);
    }else{
      currentCells[rowParam][colParam].state = CellState.open;
      setCells(currentCells);
      setBombCount(bombCount+1);
    }
  };

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
            onContextMenu={onContextMenu}
          />
        );
      })
    );
  };

  const handleFaceClick = (): void => {
    console.log("CLICK");
    if (live) {
      setLive(false);
      setTime(0);
      setCells(generateCells());
    }
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={bombCount} />
        <Face smiley={face} onClick={handleFaceClick} />
        <NumberDisplay value={time} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default App;
