import React from "react";
import { CellState, CellValue } from "../../Types";
import "./ButtonCell.scss";

interface ButtonCellProps {
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
}

const ButtonCell: React.FC<ButtonCellProps> = ({ row, col, state, value }) => {
  const renderContent = (): React.ReactNode => {
    if (state === CellState.visible) {
      if (value === CellValue.bomb) {
        //Display bomb emoji here
        return (
          <span role="img" aria-label="bomb">
            💣
          </span>
        );
      }
      return value;
      
    } else if (state === CellState.flagged) {
      //Display flag emoji here
      return (
        <span role="img" aria-label="flag">
          🚩
        </span>
      );
    }

    return null;
  };

  return (
    <div
      className={`ButtonCell ${state === CellState.visible ? "visible" : ""}`}
    >
      {renderContent()}
    </div>
  );
};

export default ButtonCell;
