// app 它控制应用程序的事件生命周期。
// BrowserWindow 模块，它创建和管理应用程序 窗口。
const { app, BrowserWindow } = require('electron');

// 创建浏览器窗口
const createWindow = () => {
    //__dirname 字符串指向当前正在执行脚本的路径 (在本例中，它指向你的项目的根文件夹)
    const mainWindow = new BrowserWindow({
      width: 640,        // 整数型 (可选) - 窗口的宽度（以像素为单位）。 默认值为 800。
      height: 1280,        // 整数型 (可选) - 窗口的高度（以像素为单位）。 默认值为 600。
      resizable: false,   // boolean (可选) - 窗口大小是否可调整。 默认值为 true。
      fullscreen: false,   // boolean (可选) - 窗口是否全屏. 当明确设置为 false 时，在 macOS 上全屏的按钮将被隐藏或禁用. 默认值为 false.
      title: "Demo",      // string(可选) - 默认窗口标题 默认为"Electron"。 如果由loadURL()加载的HTML文件中含有标签<title>，此属性将被忽略。
      // icon: "",        // (NativeImage | string) (可选) - 窗口图标。 在 Windows 上推荐使用 ICO 图标来获得最佳的视觉效果, 默认使用可执行文件的图标.
      // frame: false,       // boolean (可选) - 设置为 false 时可以创建一个无边框窗口 默认值为 true。
      })
      // mainWindow.removeMenu() // 删除窗口的菜单栏。
      mainWindow.loadFile('web-mobile/index.html');  // 本地文件
      
      // mainWindow.loadURL('https://www.baidu.com/') // 线上页面
      // mainWindow.webContents.openDevTools();// 打开控制台

};

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})

// 部分 API 在 ready 事件触发后才能使用。
// 在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口
app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
      // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他打开的窗口，那么程序会重新创建一个窗口。
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
