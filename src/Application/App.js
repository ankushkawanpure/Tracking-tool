import React, { Component } from 'react';
import './App.css';
// const ipc = require('electron').ipcRenderer;

// const selectDirBtn = document.getElementById('select-directory')
const ipc = window.require("electron").ipcRenderer;

class App extends Component {

  constructor() {
    super();
    ipc.on('selected-directory', function (event, path) {
      console.log("Selected path" + path);
    });

  }

  openNew = () => {
        ipc.send('open-file-dialog')
  }



  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <button type="button" onClick={this.openNew}>Click Me!</button>
      </div>
    );
  }
}

export default App;
