// index.js - 首页逻辑
Page({
  data: {
    hotWorks: [], // 热门创作
    recommendedCulture: [], // 文化推荐
    challengeStats: {
      participants: 1236,
      daysLeft: 15
    }
  },

  onLoad() {
    // 页面加载时初始化数据
    this.loadHotWorks();
    this.loadRecommendedCulture();
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadHotWorks();
  },

  // 加载热门创作
  loadHotWorks() {
   
    const mockHotWorks = [
      {
        id: 1,
        title: 'AI生成国画山水',
        author: '墨韵AI',
        image: 'https://img95.699pic.com/photo/60001/0888.jpg_wh860.jpg',
        likes: 128,
        comments: 24
      },
      {
        id: 2,
        title: '剪纸艺术创新',
        author: '剪纸大师',
          image: 'https://ts2.tc.mm.bing.net/th/id/OIP-C.-ScjbHTyQPoJHr99JdLKzgHaG1?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
        likes: 96,
        comments: 18
      },
      {
        id: 3,
        title: '古风人物插画',
        author: 'AI画手',
        image: 'https://ts4.tc.mm.bing.net/th/id/OIP-C.MHV8fm31MTiMSYMW9A9lCwHaJ4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
        likes: 156,
        comments: 32
      },
      {
        id: 4,
        title: '传统纹样设计',
        author: '纹样设计师',
        image: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.1sV6lwlpCmFEQYKHAlEPxwHaHa?w=209&h=209&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
        likes: 89,
        comments: 15
      }
    ];

    this.setData({
      hotWorks: mockHotWorks
    });
  },

  // 加载文化推荐
  loadRecommendedCulture() {
    // 模拟数据 - 实际项目中替换为云数据库请求
    const mockCulture = [
      {
        id: 1,
        title: '中国传统水墨画',
        description: '水墨画是中国传统绘画形式，以水和墨为主要原料，通过浓淡变化表现意境。',
        image: 'https://img95.699pic.com/photo/60001/0888.jpg_wh860.jpg',

        tags: ['国画', '水墨', '传统艺术']
      },
      {
        id: 2,
        title: '非遗剪纸艺术',
        description: '剪纸是中国民间传统艺术，用剪刀或刻刀在纸上剪刻花纹，用于装饰和表达吉祥寓意。',
        image: 'https://ts2.tc.mm.bing.net/th/id/OIP-C.-ScjbHTyQPoJHr99JdLKzgHaG1?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',

        tags: ['剪纸', '非遗', '民间艺术']
      },
      {
        id: 3,
        title: '古典诗词文化',
        description: '中国古典诗词是中华文化的瑰宝，包含唐诗、宋词、元曲等多种形式。',
        image: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.VBlyYuvjwgIHtdzri2uMvAHaEp?w=276&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',

        tags: ['诗词', '文学', '传统文化']
      }
    ];

    this.setData({
      recommendedCulture: mockCulture
    });
  },

  // 点击热门作品
  onHotWorkTap(e) {
    const workId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/community/detail?id=${workId}`
    });
  },

  // 点击文化推荐
  onCultureTap(e) {
    const cultureId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/page/webview/webview?url=${encodeURIComponent('https://www.doubao.com/chat/?channel=xiazais')}`
     } );
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadHotWorks();
    this.loadRecommendedCulture();
    wx.stopPullDownRefresh();
  }
})