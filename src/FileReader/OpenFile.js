import React, { Component } from 'react';
import './OpenFile.css';

const ipc = window.require("electron").ipcRenderer;

class OpenFile extends Component {

  constructor() {
    super();
    ipc.on('selected-directory', function (event, path) {
      console.log("Selected path" + typeof(path));


    });
  }

  openNew = () => {
    ipc.send('open-file-dialog');
  }

  render() {

    return (
      <div>
        <button type="button" className="open" onClick={this.openNew}>Load Data</button>
      </div>
    );
  }
}

export default OpenFile;
