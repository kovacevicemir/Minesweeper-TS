import "./app.scss";

import React, {useState} from "react";
import NumberDisplay from "../NumberDisplay";
import {generateCells} from "../../Utils"
import Face from "../Face/Face";
import ButtonCell from "../ButtonCell"


const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells());

  console.log(cells)
  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) => row.map((cell, colIndex) => {
      return <ButtonCell key={`${rowIndex}-${colIndex}`} state={cell.state} value={cell.value} row={rowIndex} col={colIndex}/>
    }))
  }

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={0} />
        <Face />
        <NumberDisplay value={23} />
      </div>
      <div className="Body">
        {renderCells()}
      </div>
    </div>
  );
};

export default App;
