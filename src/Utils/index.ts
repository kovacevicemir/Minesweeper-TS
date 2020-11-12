import { MAX_COLS, MAX_ROWS, NO_OF_BOMBS } from "../Constants";
import { CellValue, CellState, Cell } from "../Types";

//get cells around current cell x8
const grabAllAdjacentCells = (
  cells: Cell[][],
  rowIndex: number,
  colIndex: number
): {
  topLeftCell: Cell | null;
  topCell: Cell | null;
  topRightCell: Cell | null;
  leftCell: Cell | null;
  rightCell: Cell | null;
  bottomLeftCell: Cell | null;
  bottomCell: Cell | null;
  bottomRightCell: Cell | null;
} => {
  const topLeftCell =
    rowIndex > 0 && colIndex > 0 ? cells[rowIndex - 1][colIndex - 1] : null;
  const topCell = rowIndex > 0 ? cells[rowIndex - 1][colIndex] : null;
  const topRightCell =
    rowIndex > 0 && colIndex < MAX_COLS - 1
      ? cells[rowIndex - 1][colIndex + 1]
      : null;
  const leftCell = colIndex > 0 ? cells[rowIndex][colIndex - 1] : null;
  const rightCell =
    colIndex < MAX_COLS - 1 ? cells[rowIndex][colIndex + 1] : null;
  const bottomLeftCell =
    rowIndex < MAX_ROWS - 1 && colIndex > 0
      ? cells[rowIndex + 1][colIndex - 1]
      : null;
  const bottomCell =
    rowIndex < MAX_ROWS - 1 ? cells[rowIndex + 1][colIndex] : null;
  const bottomRightCell =
    rowIndex < MAX_ROWS - 1 && colIndex < MAX_COLS - 1
      ? cells[rowIndex + 1][colIndex + 1]
      : null;

  return {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  };
};

//DOES NOT WORK
// const spreadCells = (
// currentCell:Cell | null,
// newCells:Cell[][],
// rowParam:number,
// colParam:number,
// rowIndex:number,
// colIndex:number) =>{

//   if (currentCell?.state === CellState.open && currentCell.value !== CellValue.bomb) {
//     if (currentCell.value === CellValue.none) {
//       newCells = openMultipleCells(newCells, rowParam + rowIndex, colParam + colIndex);
//     } else {
//       newCells[rowParam + rowIndex][colParam + colIndex].state = CellState.visible;
//     }
//   }
// }

export const generateCells = (): Cell[][] => {
  const cells: Cell[][] = [];

  // generating all cells
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.open,
      });
    }
  }

  //randomly put bombs
  let bombsPlaced = 0;
  while (bombsPlaced < NO_OF_BOMBS) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);

    const currentCell = cells[randomRow][randomCol];
    if (currentCell.value !== CellValue.bomb) {
      //turn cell into bomb
      cells[randomRow][randomCol] = {
        value: CellValue.bomb,
        state: CellState.open,
      };

      bombsPlaced++;
    }
  }

  // calculate the numbers for each cell
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];

      if (currentCell.value !== CellValue.bomb) {
        let numberOfBombs = 0;

        const adjCells = grabAllAdjacentCells(cells, rowIndex, colIndex);

        let bombsToCount = [];
        bombsToCount.push(
          adjCells.topLeftCell,
          adjCells.topCell,
          adjCells.topRightCell,
          adjCells.leftCell,
          adjCells.rightCell,
          adjCells.bottomLeftCell,
          adjCells.bottomCell,
          adjCells.bottomRightCell
        );

        bombsToCount.map((cell) => {
          if (cell?.value === CellValue.bomb) {
            numberOfBombs++;
          }
        });

        if (numberOfBombs > 0) {
          cells[rowIndex][colIndex].value = numberOfBombs;
        }
      }
    }
  }
  return cells;
};

export const openMultipleCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): Cell[][] => {
  const currentCell = cells[rowParam][colParam];

  if (
    currentCell.state === CellState.visible ||
    currentCell.state === CellState.flagged
  ) {
    return cells;
  }

  let newCells = cells.slice();
  newCells[rowParam][colParam].state = CellState.visible;

  const {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell
  } = grabAllAdjacentCells(cells, rowParam, colParam);

  if (
    topLeftCell?.state === CellState.open &&
    topLeftCell.value !== CellValue.bomb
  ) {
    if (topLeftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam - 1);
    } else {
      newCells[rowParam - 1][colParam - 1].state = CellState.visible;
    }
  }

  if (topCell?.state === CellState.open && topCell.value !== CellValue.bomb) {
    if (topCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam);
    } else {
      newCells[rowParam - 1][colParam].state = CellState.visible;
    }
  }

  if (
    topRightCell?.state === CellState.open &&
    topRightCell.value !== CellValue.bomb
  ) {
    if (topRightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam + 1);
    } else {
      newCells[rowParam - 1][colParam + 1].state = CellState.visible;
    }
  }

  if (leftCell?.state === CellState.open && leftCell.value !== CellValue.bomb) {
    if (leftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, colParam - 1);
    } else {
      newCells[rowParam][colParam - 1].state = CellState.visible;
    }
  }

  if (
    rightCell?.state === CellState.open &&
    rightCell.value !== CellValue.bomb
  ) {
    if (rightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, colParam + 1);
    } else {
      newCells[rowParam][colParam + 1].state = CellState.visible;
    }
  }

  if (
    bottomLeftCell?.state === CellState.open &&
    bottomLeftCell.value !== CellValue.bomb
  ) {
    if (bottomLeftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam - 1);
    } else {
      newCells[rowParam + 1][colParam - 1].state = CellState.visible;
    }
  }

  if (
    bottomCell?.state === CellState.open &&
    bottomCell.value !== CellValue.bomb
  ) {
    if (bottomCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam);
    } else {
      newCells[rowParam + 1][colParam].state = CellState.visible;
    }
  }

  if (
    bottomRightCell?.state === CellState.open &&
    bottomRightCell.value !== CellValue.bomb
  ) {
    if (bottomRightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam + 1);
    } else {
      newCells[rowParam + 1][colParam + 1].state = CellState.visible;
    }
  }

  //DOES NOT WORK....
  // spreadCells(currentCell,newCells,rowParam,colParam,-1,-1)
  // spreadCells(currentCell,newCells,rowParam,colParam,-1,0)
  // spreadCells(currentCell,newCells,rowParam,colParam,-1,1)

  // spreadCells(currentCell,newCells,rowParam,colParam,0,-1)
  // spreadCells(currentCell,newCells,rowParam,colParam,0,1)

  // spreadCells(currentCell,newCells,rowParam,colParam,1,-1)
  // spreadCells(currentCell,newCells,rowParam,colParam,1,0)
  // spreadCells(currentCell,newCells,rowParam,colParam,1,1)

  return newCells;
};
