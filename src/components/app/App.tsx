import React from 'react';
import './App.css';
import Boards from "../boards/Boards";
import BoardModel from "../../data-models/BoardModel";
const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
          <Boards boards={[new BoardModel()]}></Boards>
      </header>
    </div>
  );
}

export default App;
