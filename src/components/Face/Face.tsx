import React from "react";
import "./Face.scss";

type Smiley = any;

const Face = ({smiley}: Smiley) => {
  return <div className="Face">{smiley}</div>;
};

export default Face;
