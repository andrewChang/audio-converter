// preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
    // 使用 invoke 方法替代 send 方法
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
    // 直接暴露 on 方法用于事件监听
    on: (channel, listener) => ipcRenderer.on(channel, listener)
  }
});

console.log('preload.js is loaded!')
console.log(ipcRenderer)

