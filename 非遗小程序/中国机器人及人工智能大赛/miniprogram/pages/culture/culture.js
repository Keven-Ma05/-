// culture.js - 文化资源库逻辑
Page({
  data: {
    searchKeyword: '', // 搜索关键词
    currentCategory: '', // 当前选中分类
    categories: [], // 分类列表
    resources: [], // 资源列表
    loading: false, // 加载状态
    page: 1, // 当前页码
    hasMore: true // 是否有更多数据
  },

  onLoad() {
    // 初始化数据
    this.initCategories();
    this.loadResources();
  },

  // 初始化分类
  initCategories() {
    const app = getApp();
    this.setData({
      categories: app.globalData.cultureCategories
    });
  },

  // 加载资源
  loadResources(refresh = false) {
    if (this.data.loading) return;

    this.setData({
      loading: true
    });

    // 模拟数据 - 实际项目中替换为云数据库请求
    setTimeout(() => {
      const mockResources = [
        {
          id: 'culture_1',
          title: '中国传统水墨画',
          description: '水墨画是中国传统绘画形式，以水和墨为主要原料，通过浓淡变化表现意境。',
          image: 'https://img95.699pic.com/photo/60001/0888.jpg_wh860.jpg',
          type: '民间工艺',
          views: 1234,
          category: 'painting'
        },
        {
          id: 'culture_2',
          title: '非遗剪纸艺术',
          description: '剪纸是中国民间传统艺术，用剪刀或刻刀在纸上剪刻花纹，用于装饰和表达吉祥寓意。',
          image: 'https://ts2.tc.mm.bing.net/th/id/OIP-C.-ScjbHTyQPoJHr99JdLKzgHaG1?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
          type: '民间工艺',
          views: 892,
          category: 'folk'
        },
        {
          id: 'culture_3',
          title: '古典诗词文化',
          description: '中国古典诗词是中华文化的瑰宝，包含唐诗、宋词、元曲等多种形式。',
          image: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.VBlyYuvjwgIHtdzri2uMvAHaEp?w=276&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
          type: '古典文学',
          views: 2341,
          category: 'literature'
        },
        {
          id: 'culture_4',
          title: '传统戏曲文化',
          description: '中国传统戏曲是一种综合舞台艺术形式，包含京剧、豫剧、越剧等多种剧种。',
          image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.rPc6pJHDL4WogZBi2eyefAHaE7?w=250&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
          type: '传统音乐',
          views: 1567,
          category: 'music'
        },
        {
          id: 'culture_5',
          title: '古代建筑艺术',
          description: '中国古代建筑以木构架结构为主要特点，包含宫殿、寺庙、园林等多种类型。',
          image: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.nKboKmZokGIII5j14RkKXAHaE7?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
          type: '传统建筑',
          views: 1890,
          category: 'architecture'
        },
        {
          id: 'culture_6',
          title: '传统陶瓷工艺',
          description: '中国陶瓷工艺历史悠久，景德镇瓷器、唐三彩等都是中国陶瓷文化的代表。',
          image: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.ackimh_oz0BD1UvKJxl_zQAAAA?w=221&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
          type: '民间工艺',
          views: 987,
          category: 'folk'
        }
      ];

      // 筛选数据
      let filteredResources = mockResources;
      if (this.data.currentCategory) {
        filteredResources = filteredResources.filter(item => item.category === this.data.currentCategory);
      }
      if (this.data.searchKeyword) {
        const keyword = this.data.searchKeyword.toLowerCase();
        filteredResources = filteredResources.filter(item => 
          item.title.toLowerCase().includes(keyword) || 
          item.description.toLowerCase().includes(keyword)
        );
      }

      this.setData({
        resources: refresh ? filteredResources : [...this.data.resources, ...filteredResources],
        loading: false,
        hasMore: this.data.page < 3, // 模拟只有3页数据
        page: this.data.page + 1
      });
    }, 1000);
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 搜索
  onSearch() {
    this.setData({
      page: 1,
      resources: []
    });
    this.loadResources(true);
  },

  // 分类切换
  onCategoryChange(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category,
      page: 1,
      resources: []
    });
    this.loadResources(true);
  },

  // 点击资源
  onResourceTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/culture/detail?id=${id}`
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      page: 1,
      resources: []
    });
    this.loadResources(true);
    wx.stopPullDownRefresh();
  },

  // 上拉加载更多
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadResources();
    }
  }
})