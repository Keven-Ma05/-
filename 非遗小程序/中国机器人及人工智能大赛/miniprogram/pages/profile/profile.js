// profile.js - 个人中心逻辑
Page({
  data: {
    isLogin: false, // 是否登录
    userInfo: {}, // 用户信息
    defaultAvatar: 'https://picsum.photos/100/100?random=500',
    stats: {
      works: 12,
      followings: 34,
      followers: 56,
      likes: 789
    }
  },

  onLoad() {
    // 检查用户登录状态
    this.checkLoginStatus();
  },

  onShow() {
    // 页面显示时再次检查登录状态
    this.checkLoginStatus();
  },

  // 检查用户登录状态
  checkLoginStatus() {
    try {
      // 先从全局获取
      const app = getApp();
      if (app.globalData.userInfo) {
        this.setData({
          isLogin: true,
          userInfo: app.globalData.userInfo
        });
        return;
      }
      
      // 再从本地存储获取
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        app.globalData.userInfo = userInfo;
        this.setData({
          isLogin: true,
          userInfo: userInfo
        });
      }
    } catch (e) {
      console.error('检查登录状态失败', e);
    }
  },

  // 登录
  login() {
    // 先获取用户授权
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          this.getUserInfo();
        } else {
          // 未授权，引导用户授权
          wx.getUserProfile({
            desc: '用于完善用户资料，体验更多功能',
            success: (res) => {
              this.saveUserInfo(res.userInfo);
            },
            fail: (err) => {
              console.error('获取用户信息失败', err);
              wx.showToast({
                title: '授权失败，部分功能无法使用',
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      },
      fail: (err) => {
        console.error('获取设置失败', err);
      }
    });
  },

  // 获取用户信息
  getUserInfo() {
    wx.getUserInfo({
      success: (res) => {
        this.saveUserInfo(res.userInfo);
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    });
  },

  // 保存用户信息
  saveUserInfo(userInfo) {
    try {
      // 保存到全局
      const app = getApp();
      app.globalData.userInfo = userInfo;
      
      // 保存到本地存储
      wx.setStorageSync('userInfo', userInfo);
      
      // 更新页面数据
      this.setData({
        isLogin: true,
        userInfo: userInfo
      });
      
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
    } catch (e) {
      console.error('保存用户信息失败', e);
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      });
    }
  },

  // 跳转到我的作品
  navigateToMyWorks() {
    if (!this.data.isLogin) {
      this.login();
      return;
    }
    wx.navigateTo({
      url: '/pages/profile/my-works'
    });
  },

  // 跳转到我的收藏
  navigateToCollection() {
    if (!this.data.isLogin) {
      this.login();
      return;
    }
    wx.navigateTo({
      url: '/pages/profile/collection'
    });
  },

  // 跳转到我的关注
  navigateToFollowing() {
    if (!this.data.isLogin) {
      this.login();
      return;
    }
    wx.navigateTo({
      url: '/pages/profile/following'
    });
  },

  // 跳转到设置
  navigateToSettings() {
    wx.navigateTo({
      url: '/pages/profile/settings'
    });
  },

  // 关于我们
  onAboutUs() {
    wx.showModal({
      title: '关于中华文脉·AI共创工坊',
      content: '中华文脉·AI共创工坊是一款基于AI技术的传统文化共创平台，旨在通过人工智能技术降低传统文化创作门槛，激发大众参与热情，推动中华优秀传统文化的传承与创新。',
      showCancel: false
    });
  },

  // 使用帮助
  onHelp() {
    wx.navigateTo({
      url: '/pages/profile/help'
    });
  },

  // 隐私政策
  onPrivacy() {
    wx.navigateTo({
      url: '/pages/profile/privacy'
    });
  },

  // 联系我们
  onContact() {
    wx.showModal({
      title: '联系我们',
      content: '如有问题或建议，请发送邮件至：contact@ai-culture.com',
      showCancel: false
    });
  }
})