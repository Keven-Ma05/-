// app.js
App({
  onLaunch() {
    console.log('小程序启动成功')
    // 检查本地存储的用户信息
    this.checkLocalUserInfo()
  },
  
  // 检查本地存储的用户信息
  checkLocalUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.globalData.userInfo = userInfo
      }
    } catch (e) {
      console.error('获取本地用户信息失败', e)
    }
  },
  
  // 全局数据
  globalData: {
    userInfo: null,
    // AI服务配置
    aiConfig: {
      // AI API密钥配置
      apiKey1: 'api-key-20260502134021',
      // 火山引擎方舟API密钥
      huoshanArkKey: 'ark-413cfebe-4090-4208-acb3-e80b594fa73f-307f1',
      defaultKey: 'default',
      apiKey2: 'apikey-20260502134029-98wh8'
    },
    // 文化资源分类
    cultureCategories: [
      { id: 'folk', name: '民间工艺', icon: '🧵' },
      { id: 'painting', name: '传统绘画', icon: '🎨' },
      { id: 'music', name: '传统音乐', icon: '🎵' },
      { id: 'literature', name: '古典文学', icon: '📜' },
      { id: 'architecture', name: '传统建筑', icon: '🏯' }
    ]
  }
})