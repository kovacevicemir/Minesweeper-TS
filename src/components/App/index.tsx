import "./app.scss"

import React from 'react'
import NumberDisplay from "../NumberDisplay"
import Face from "../Face/Face"

const App: React.FC = () => {
    return (
        <div className="App">
            <div className="Header">
                <NumberDisplay value={0} />
                <Face />
                <NumberDisplay value={23} />
            </div>
            <div className="Body">Body</div>
        </div>
    )
}

export default App
