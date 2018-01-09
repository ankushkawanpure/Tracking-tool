import React, { Component } from 'react';
import Styles from './OpenFile.css.js';

const ipc = window.require("electron").ipcRenderer;

class OpenFile extends Component {

  constructor() {
    super();
    ipc.on('selected-directory', function (event, path) {
      console.log("Selected path" + path);
    });
  }

  openNew = () => {
    ipc.send('open-file-dialog');
  }

  render() {
    var style = Object.assign({},
        Styles.open,
        this.props.isDisabled && Styles.disabled
      );

    return (
      <div>
        <button type="button" Style={style} onClick={this.openNew}>Click Me!</button>
      </div>
    );
  }
}

export default OpenFile;
