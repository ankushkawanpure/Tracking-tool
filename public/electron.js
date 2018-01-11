const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const fs = require('fs');
const papa = require('papaparse');
const template = require('./template/menus');
// const csv=require('csvtojson');

const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

let mainWindow;

function addUpdateMenuItems (items, position) {
  if (process.mas) return

  const version = electron.app.getVersion()
  let updateItems = [{
    label: `Version ${version}`,
    enabled: false
  }, {
    label: 'Checking for Update',
    enabled: false,
    key: 'checkingForUpdate'
  }, {
    label: 'Check for Update',
    visible: false,
    key: 'checkForUpdate',
    click: function () {
      require('electron').autoUpdater.checkForUpdates()
    }
  }, {
    label: 'Restart and Install Update',
    enabled: true,
    visible: false,
    key: 'restartToUpdate',
    click: function () {
      require('electron').autoUpdater.quitAndInstall()
    }
  }]

  items.splice.apply(items, [position, 0].concat(updateItems))
}

function findReopenMenuItem () {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  let reopenMenuItem
  menu.items.forEach(function (item) {
    if (item.submenu) {
      item.submenu.items.forEach(function (item) {
        if (item.key === 'reopenMenuItem') {
          reopenMenuItem = item
        }
      })
    }
  })
  return reopenMenuItem
}

if (process.platform === 'darwin') {
  const name = electron.app.getName()
  template.unshift({
    label: name,
    submenu: [{
      label: `About ${name}`,
      role: 'about'
    }, {
      type: 'separator'
    }, {
      label: 'Services',
      role: 'services',
      submenu: []
    }, {
      type: 'separator'
    }, {
      label: `Hide ${name}`,
      accelerator: 'Command+H',
      role: 'hide'
    }, {
      label: 'Hide Others',
      accelerator: 'Command+Alt+H',
      role: 'hideothers'
    }, {
      label: 'Show All',
      role: 'unhide'
    }, {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: function () {
        app.quit()
      }
    }]
  })

  // Window menu.
  template[3].submenu.push({
    type: 'separator'
  }, {
    label: 'Bring All to Front',
    role: 'front'
  })

  addUpdateMenuItems(template[0].submenu, 1)
}

if (process.platform === 'win32') {
  const helpMenu = template[template.length - 1].submenu
  addUpdateMenuItems(helpMenu, 0)
}

function createWindow() {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  mainWindow = new BrowserWindow({width: 900, height: 680});
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


ipc.on('open-file-dialog', openFile);

function openFile(event) {

  dialog.showOpenDialog({
    filters: [{name: 'CSV', extensions: ['csv']}],
    properties: ['openFile']
  }, function (file) {
      if (file) {
        file = file.toString();
        console.log(typeof(file));
        data = parsecsv(file, event);
      }
  });
}

function parsecsv(file, event) {
  console.log("Filepath" + file);

  var inputSteam = fs.createReadStream(file, 'utf-8');
    papa.parse(inputSteam, {
      header: true,
    	complete: function(results) {
        let ExchangeObj = parseData(results.data);

        console.log("line 168" + JSON.stringify(ExchangeObj));

        event.sender.send('selected-directory', results.data);
    	}
  });


function parseData(data) {

    let trades = data;
    console.log(trades.length);
    let coins = new Set(trades.map((item) => item.Market));

    console.log(coins);

    let exchangeName = "Binance";
    let mapped = [];

    coins.forEach((coin) => {
      console.log("line 184" + coin);
      let coinAndTrades = processCoin(coin, trades);
      mapped.push(coinAndTrades);
    })

    return {
      Exchange : exchangeName,
      MappedTrade : mapped
    }
}


function processCoin(coin, trades) {

  // let coinTrades = [];
  console.log("line 202" + coin);
  console.log("line 203" + typeof(coin));
  coinTrades = trades.filter(trade => trade.Market === coin);
  console.log("line 200"+ coinTrades);

  return {
    [coin] : coinTrades
  }

}


}
