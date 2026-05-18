// create.js - AI创作页面逻辑
Page({
  data: {
    createMode: 'text2img', // 创作模式：text2img或img2img
    textPrompt: '', // 文字描述
    selectedStyle: 'chinese_painting', // 选中的风格
    creativity: 70, // 创意度
    resolution: '512x512', // 分辨率
    uploadedImage: '', // 上传的图片
    generatedImage: '', // 生成的图片
    generating: false, // 生成中状态
    canGenerate: false, // 是否可以生成
    styles: [
      {
        name: '国画',
        value: 'chinese_painting',
        image: '/images/国风.png'
      },
      {
        name: '剪纸',
        value: 'paper_cut',
        image: '/images/剪纸.png'
      },
      {
        name: '水彩',
        value: 'watercolor',
        image: '/images/水彩.png'
      },
      {
        name: '油画',
        value: 'oil_painting',
        image: '/images/油画.png'
      },
      {
        name: '素描',
        value: 'sketch',
        image: '/images/水彩.png'
      }
    ]
  },

  onLoad(options) {
    // 从页面参数获取创作模式
    if (options.type) {
      this.setData({
        createMode: options.type
      });
    }
    
    // 初始化生成状态
    this.updateGenerateStatus();
  },

  // 切换创作模式
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      createMode: mode,
      generatedImage: ''
    });
    this.updateGenerateStatus();
  },

  // 文字描述输入
  onTextInput(e) {
    this.setData({
      textPrompt: e.detail.value
    });
    this.updateGenerateStatus();
  },

  // 选择风格
  selectStyle(e) {
    const style = e.currentTarget.dataset.style;
    this.setData({
      selectedStyle: style
    });
  },

  // 调整创意度
  onCreativityChange(e) {
    this.setData({
      creativity: e.detail.value
    });
  },

  // 选择分辨率
  onResolutionChange(e) {
    this.setData({
      resolution: e.detail.value
    });
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          uploadedImage: tempFilePath
        });
        this.updateGenerateStatus();
      }
    });
  },

  // 更新生成状态
  updateGenerateStatus() {
    let canGenerate = false;
    if (this.data.createMode === 'text2img') {
      canGenerate = this.data.textPrompt.trim().length > 0;
    } else {
      canGenerate = this.data.uploadedImage !== '';
    }
    this.setData({
      canGenerate: canGenerate
    });
  },

  generateImage() {
    if (!this.data.canGenerate || this.data.generating) return;

    this.setData({
      generating: true,
      generatedImage: ''
    });

    const app = getApp();
    const apiKey = app.globalData.aiConfig.huoshanArkKey;

    const styleMap = {
      chinese_painting: '中国国画风格',
      paper_cut: '中国剪纸风格',
      watercolor: '水彩画风格',
      oil_painting: '油画风格',
      sketch: '素描风格'
    };
    const styleText = styleMap[this.data.selectedStyle] || '';
    const finalPrompt = styleText
      ? `${styleText}：${this.data.textPrompt || '传统中国风格图片'}`
      : (this.data.textPrompt || '传统中国风格图片');

    wx.request({
      url: 'https://ark.cn-beijing.volces.com/api/v3/images/generations',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: {
        model: 'doubao-seedream-4-0-250828',
        prompt: finalPrompt,
        size: '2K',
        response_format: 'url',
        n: 1
      },
      timeout: 60000,
      success: (res) => {
        if (res.data && res.data.data && res.data.data.length > 0) {
          this.setData({
            generatedImage: res.data.data[0].url,
            generating: false
          });
          wx.showToast({ title: '生成成功', icon: 'success' });
        } else {
          wx.showToast({ title: '生成失败，请重试', icon: 'none', duration: 2000 });
          this.setData({ generating: false });
        }
      },
      fail: (err) => {
        let msg = '网络错误，请稍后重试';
        if (err.errMsg.indexOf('timeout') !== -1) msg = '生成超时，请稍后重试';
        wx.showToast({ title: msg, icon: 'none', duration: 3000 });
        this.setData({ generating: false });
      }
    });
  },

  // 保存图片
  saveImage() {
    if (!this.data.generatedImage) return;

    wx.saveImageToPhotosAlbum({
      filePath: this.data.generatedImage,
      success: (res) => {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('保存失败', err);
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
        
        // 如果是因为权限问题，引导用户开启权限
        if (err.errMsg.indexOf('auth deny') !== -1) {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存图片到相册',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.openSetting();
              }
            }
          });
        }
      }
    });
  },

  // 发布作品
  publishWork() {
    if (!this.data.generatedImage) return;

    // 跳转到发布页面
    wx.navigateTo({
      url: `/pages/community/publish?image=${encodeURIComponent(this.data.generatedImage)}&prompt=${encodeURIComponent(this.data.textPrompt)}&style=${this.data.selectedStyle}`
    });
  },

  // 重新生成
  regenerateImage() {
    this.generateImage();
  }
})