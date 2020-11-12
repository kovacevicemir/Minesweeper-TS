import React from "react";
import "./Face.scss";

interface IFace {
  smiley: any;
  onClick():void;
}

const Face:React.FC<IFace> = ({ smiley, onClick}) => {
  return (
    <div onClick={() => onClick()} className="Face">
      {smiley}
    </div>
  );
};

export default Face;
