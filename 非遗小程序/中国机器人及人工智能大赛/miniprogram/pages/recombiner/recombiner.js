const CULTURAL_ELEMENTS = [
  {
    id: 'dunhuang',
    name: '敦煌飞天',
    icon: '🧚',
    category: '壁画',
    desc: '丝绸之路上的艺术瑰宝，飞天形象飘逸灵动',
    keywords: '敦煌壁画,飞天,丝路文化,西域风情,飘逸彩带,佛教艺术'
  },
  {
    id: 'blue_porcelain',
    name: '青花瓷',
    icon: '🏺',
    category: '陶瓷',
    desc: '白底蓝花的经典陶瓷艺术，典雅清丽',
    keywords: '青花瓷,蓝白纹样,景德镇,缠枝莲,釉下彩,典雅清丽'
  },
  {
    id: 'peking_opera',
    name: '京剧脸谱',
    icon: '🎭',
    category: '戏曲',
    desc: '色彩浓烈的脸谱艺术，忠奸善恶一笔勾勒',
    keywords: '京剧脸谱,红脸关公,白脸曹操,戏曲,浓烈色彩,对称图案'
  },
  {
    id: 'calligraphy',
    name: '书法艺术',
    icon: '✒️',
    category: '书法',
    desc: '汉字书写的极致美学，墨韵流转千姿百态',
    keywords: '书法,行书,草书,墨韵,笔走龙蛇,汉字之美,黑白艺术'
  },
  {
    id: 'embroidery',
    name: '苏绣纹样',
    icon: '🪡',
    category: '刺绣',
    desc: '以针代笔的江南绝艺，精妙细腻栩栩如生',
    keywords: '苏绣,江南,花鸟纹样,丝线,精细刺绣,柔美秀丽'
  },
  {
    id: 'shadow_puppet',
    name: '皮影艺术',
    icon: '🎪',
    category: '民间艺术',
    desc: '光影交错间的民间故事，镂空艺术的极致表达',
    keywords: '皮影戏,镂空,民间故事,剪影,透光,民俗艺术'
  },
  {
    id: 'ink_landscape',
    name: '水墨山水',
    icon: '🏔️',
    category: '绘画',
    desc: '浓淡干湿间的天地意境，中国画的灵魂所在',
    keywords: '水墨画,山水,意境,留白,皴法,云雾缭绕,古松奇石'
  },
  {
    id: 'bronze_pattern',
    name: '青铜纹饰',
    icon: '🔔',
    category: '青铜器',
    desc: '商周青铜器上的神秘纹样，庄重威严跨越千年',
    keywords: '青铜器,饕餮纹,云雷纹,商周,钟鼎,庄重威严,神秘符号'
  },
  {
    id: 'tang_sancai',
    name: '唐三彩',
    icon: '🐴',
    category: '陶瓷',
    desc: '盛唐气象的绚丽釉彩，黄绿白三色交融',
    keywords: '唐三彩,盛唐,釉彩,黄绿白,陶俑,华丽富贵,丝绸之路'
  },
  {
    id: 'garden_art',
    name: '苏州园林',
    icon: '🏡',
    category: '建筑',
    desc: '移步换景的江南园林，天人合一的建筑哲学',
    keywords: '苏州园林,亭台楼阁,曲径通幽,太湖石,小桥流水,借景'
  }
]

Page({
  data: {
    elements: CULTURAL_ELEMENTS,
    selectedA: null,
    selectedB: null,
    canRecombine: false,
    recombining: false,
    fusionProgress: 0,
    fusionPhase: '',
    resultImage: '',
    resultTitle: '',
    resultDesc: '',
    showResult: false,
    historyList: []
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: '文化基因重组器' })
    this.loadHistory()
  },

  loadHistory() {
    try {
      const history = wx.getStorageSync('recombine_history') || []
      this.setData({ historyList: history.slice(0, 6) })
    } catch (e) {
      console.error('加载历史记录失败', e)
    }
  },

  selectElement(e) {
    const id = e.currentTarget.dataset.id
    const element = CULTURAL_ELEMENTS.find(el => el.id === id)
    if (!element) return

    const { selectedA, selectedB } = this.data

    if (selectedA && selectedA.id === id) {
      this.setData({ selectedA: null })
    } else if (selectedB && selectedB.id === id) {
      this.setData({ selectedB: null })
    } else if (!selectedA) {
      this.setData({ selectedA: element })
    } else if (!selectedB) {
      this.setData({ selectedB: element })
    } else {
      wx.showToast({ title: '最多选择两个元素', icon: 'none' })
      return
    }

    this.updateCanRecombine()
  },

  swapElements() {
    const { selectedA, selectedB } = this.data
    if (!selectedA || !selectedB) return
    this.setData({
      selectedA: selectedB,
      selectedB: selectedA
    })
  },

  updateCanRecombine() {
    const { selectedA, selectedB, recombining } = this.data
    this.setData({
      canRecombine: !!(selectedA && selectedB && !recombining)
    })
  },

  startRecombine() {
    if (!this.data.canRecombine || this.data.recombining) return

    const { selectedA, selectedB } = this.data
    this.setData({
      recombining: true,
      canRecombine: false,
      fusionProgress: 0,
      fusionPhase: '',
      showResult: false,
      resultImage: '',
      resultTitle: '',
      resultDesc: ''
    })

    this.runFusionAnimation()
    this.callRecombineAPI(selectedA, selectedB)
  },

  runFusionAnimation() {
    const phases = [
      { progress: 15, text: '正在分析文化基因序列...' },
      { progress: 35, text: '提取核心美学特征...' },
      { progress: 55, text: '进行文化元素匹配...' },
      { progress: 75, text: 'AI 创意融合生成中...' },
      { progress: 90, text: '渲染全新文化作品...' }
    ]

    let index = 0
    this._animTimer = setInterval(() => {
      if (index >= phases.length) {
        clearInterval(this._animTimer)
        this.setData({
          fusionProgress: 95,
          fusionPhase: '即将完成...'
        })
        return
      }
      this.setData({
        fusionProgress: phases[index].progress,
        fusionPhase: phases[index].text
      })
      index++
    }, 800)
  },

  callRecombineAPI(elemA, elemB) {
    const app = getApp()
    const apiKey = app.globalData.aiConfig.huoshanArkKey

    const fusionPrompt = `创作一幅融合了中国${elemA.name}和${elemB.name}两种文化元素的全新艺术作品。
具体要求：
1. 将${elemA.keywords}的核心视觉特征
2. 与${elemB.keywords}的核心视觉特征
3. 进行有创意且和谐的艺术融合
4. 保持中国传统美学的整体基调
5. 画面构图精美、色彩协调、细节丰富
请生成一张高质量的中国传统文化融合艺术作品。`

    wx.request({
      url: 'https://ark.cn-beijing.volces.com/api/v3/images/generations',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: {
        model: 'doubao-seedream-4-0-250828',
        prompt: fusionPrompt,
        size: '2K',
        response_format: 'url',
        n: 1
      },
      timeout: 90000,
      success: (res) => {
        this.finishFusionAnimation()

        if (res.data && res.data.data && res.data.data.length > 0) {
          const resultTitle = `${elemA.icon} × ${elemB.icon} ${elemA.name}·${elemB.name}`
          const resultDesc = `AI将${elemA.name}与${elemB.name}的文化基因进行了创意融合，生成了这幅独一无二的文化艺术作品。`

          this.setData({
            resultImage: res.data.data[0].url,
            resultTitle,
            resultDesc,
            showResult: true,
            recombining: false,
            fusionProgress: 100
          })

          this.saveToHistory({
            id: Date.now(),
            elemA,
            elemB,
            image: res.data.data[0].url,
            title: resultTitle,
            time: new Date().toLocaleString()
          })

          wx.showToast({ title: '融合成功！', icon: 'success' })
        } else {
          this.setData({ recombining: false, canRecombine: true })
          wx.showToast({ title: '融合失败，请重试', icon: 'none' })
        }
      },
      fail: (err) => {
        this.finishFusionAnimation()
        this.setData({ recombining: false, canRecombine: true })

        let msg = '网络错误，请稍后重试'
        if (err.errMsg && err.errMsg.indexOf('timeout') !== -1) {
          msg = '融合超时，请稍后重试'
        }
        wx.showToast({ title: msg, icon: 'none', duration: 3000 })
      }
    })
  },

  finishFusionAnimation() {
    if (this._animTimer) {
      clearInterval(this._animTimer)
      this._animTimer = null
    }
    this.setData({
      fusionProgress: 100,
      fusionPhase: '融合完成！'
    })
  },

  saveToHistory(item) {
    try {
      let history = wx.getStorageSync('recombine_history') || []
      history.unshift(item)
      if (history.length > 20) history = history.slice(0, 20)
      wx.setStorageSync('recombine_history', history)
      this.setData({ historyList: history.slice(0, 6) })
    } catch (e) {
      console.error('保存历史失败', e)
    }
  },

  saveImage() {
    if (!this.data.resultImage) return
    wx.saveImageToPhotosAlbum({
      filePath: this.data.resultImage,
      success: () => {
        wx.showToast({ title: '已保存到相册', icon: 'success' })
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.indexOf('auth deny') !== -1) {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存图片到相册',
            success: (modalRes) => {
              if (modalRes.confirm) wx.openSetting()
            }
          })
        } else {
          wx.showToast({ title: '保存失败', icon: 'none' })
        }
      }
    })
  },

  shareResult() {
    if (!this.data.resultImage) return
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
  },

  onShareAppMessage() {
    const { selectedA, selectedB, resultImage } = this.data
    return {
      title: `我用AI融合了「${selectedA?.name||''}」和「${selectedB?.name||''}」的文化基因，来看看效果！`,
      path: '/pages/recombiner/recombiner',
      imageUrl: resultImage || ''
    }
  },

  regenerate() {
    if (this.data.recombining) return
    this.setData({ showResult: false })
    this.updateCanRecombine()
    this.startRecombine()
  },

  newRecombine() {
    this.finishFusionAnimation()
    this.setData({
      selectedA: null,
      selectedB: null,
      showResult: false,
      resultImage: '',
      resultTitle: '',
      resultDesc: '',
      recombining: false,
      canRecombine: false,
      fusionProgress: 0,
      fusionPhase: ''
    })
  },

  onHistoryTap(e) {
    const item = e.currentTarget.dataset.item
    if (!item) return
    const elemA = CULTURAL_ELEMENTS.find(el => el.id === item.elemA.id)
    const elemB = CULTURAL_ELEMENTS.find(el => el.id === item.elemB.id)
    this.setData({
      selectedA: elemA || null,
      selectedB: elemB || null,
      resultImage: item.image,
      resultTitle: item.title,
      resultDesc: `这是之前将${item.elemA.name}与${item.elemB.name}融合生成的作品。`,
      showResult: true
    })
    this.updateCanRecombine()
  },

  onUnload() {
    this.finishFusionAnimation()
  }
})
