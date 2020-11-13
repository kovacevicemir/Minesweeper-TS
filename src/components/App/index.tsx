import "./app.scss";

import React, { useState, useEffect } from "react";
import NumberDisplay from "../NumberDisplay";
import { generateCells, openMultipleCells } from "../../Utils";
import Face from "../Face/Face";
import ButtonCell from "../ButtonCell";
import { Cell, CellState, CellValue, EFace } from "../../Types";
import { MAX_ROWS, MAX_COLS } from "../../Constants";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<EFace>(EFace.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCount, setBombCount] = useState<number>(10);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);

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

  useEffect(() => {
    if (hasLost) {
      setFace(EFace.lost);
      setLive(false);
    }
  }, [hasLost]);

  useEffect(() => {
    if (hasWon) {
      setLive(false);
      setFace(EFace.won);
    }
  }, [hasWon]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    let newCells = cells.slice();

    //start the game
    if (!live) {
      //Make sure you dont click on a bomb in the beginning:
      let isBomb = newCells[rowParam][colParam].value === CellValue.bomb;
      while (isBomb) {
        newCells = generateCells();
        if (newCells[rowParam][colParam].value !== CellValue.bomb) {
          isBomb = false;
          break;
        }
      }

      setLive(true);
    }

    const currentCell = newCells[rowParam][colParam];

    if (
      currentCell.state === CellState.flagged ||
      currentCell.state === CellState.visible
    ) {
      return; //if there is a flag or cell is already opened dont do anything
    }

    if (currentCell.value === CellValue.bomb) {
      //take care of bomb click!
      setHasLost(true);
      newCells[rowParam][colParam].red = true;
      newCells = showAllBombs();
    } else if (currentCell.value === CellValue.none) {
      //Open multiple cells - spreading;
      newCells = openMultipleCells(newCells, rowParam, colParam);
      setCells(newCells);
    } else {
      newCells[rowParam][colParam].state = CellState.visible;
    }

    // Check to see if you have won
    let safeOpenCellsExists = false;
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        const currentCell = newCells[row][col];

        if (
          currentCell.value !== CellValue.bomb &&
          currentCell.state === CellState.open
        ) {
          safeOpenCellsExists = true;
          break;
        }
      }
    }

    if (!safeOpenCellsExists) {
      newCells = newCells.map((row) =>
        row.map((cell) => {
          if (cell.value === CellValue.bomb) {
            return {
              ...cell,
              state: CellState.flagged,
            };
          }
          return cell;
        })
      );
      setHasWon(true);
    }

    setCells(newCells);
  };

  //right click - put flag
  const onContextMenu = (rowParam: number, colParam: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
    if (!live) {
      return; //Cant put flag if game hasn`t started
    }

    const currentCells = cells.slice(); //copy of current cells
    const currentCell = cells[rowParam][colParam];
    if (currentCell.state === CellState.visible) {
      return;
    } else if (currentCell.state === CellState.open) {
      currentCells[rowParam][colParam].state = CellState.flagged;
      setCells(currentCells);
      setBombCount(bombCount - 1);
    } else {
      currentCells[rowParam][colParam].state = CellState.open;
      setCells(currentCells);
      setBombCount(bombCount + 1);
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
            red={cell.red}
          />
        );
      })
    );
  };

  const handleFaceClick = (): void => {
    setLive(false);
    setTime(0);
    setCells(generateCells());
    setHasLost(false);
    setHasWon(false);
    setBombCount(10);
  };

  const showAllBombs = (): Cell[][] => {
    const currentCells = cells.slice();
    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.bomb) {
          return {
            ...cell,
            state: CellState.visible,
          };
        } else {
          return cell;
        }
      })
    );
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
