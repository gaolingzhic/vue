module.exports = {
  devServer: {
    open: true, // 是否自动弹出浏览器页面
    public: 'localhost:8014',
    port: '8014',
    hotOnly: false, // 是否开启热更新
    proxy: {
      '/api': {
        target: 'http://122.114.67.68:8014', // 对应服务器地址
        changeOrigin: true, // 允许跨域
        ws: false,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
}
