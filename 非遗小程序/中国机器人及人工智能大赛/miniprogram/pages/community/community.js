Page({
  data: {
    currentTab: 'hot',
    loading: false,
    works: [],
    page: 1,
    hasMore: true
  },

  onLoad() {
    this.loadWorks(true)
  },

  onPullDownRefresh() {
    this.loadWorks(true, () => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadWorks(false)
    }
  },

  getFilteredWorks() {
    const tab = this.data.currentTab
    let list = this.getMockWorks()
    if (tab === 'hot') {
      list.sort((a, b) => b.likes - a.likes)
    } else if (tab === 'latest') {
      list.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    } else if (tab === 'challenge') {
      list = list.filter(w => w.challenge)
    } else if (tab === 'following') {
      list = list.filter(w => w.author.following)
    }
    return list
  },

  loadWorks(reset = false, callback) {
    if (this.data.loading) return
    this.setData({ loading: true })

    if (reset) {
      wx.pageScrollTo({ scrollTop: 0, duration: 0 })
    }

    const filtered = this.getFilteredWorks()
    const page = reset ? 1 : this.data.page
    const pageSize = 4
    const start = (page - 1) * pageSize
    const list = filtered.slice(start, start + pageSize)

    setTimeout(() => {
      const works = reset ? list : this.data.works.concat(list)
      this.setData({
        works,
        loading: false,
        page: reset ? 2 : page + 1,
        hasMore: start + pageSize < filtered.length
      })
      if (callback) callback()
    }, 400)
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    if (tab === this.data.currentTab) return

    this.setData({
      currentTab: tab,
      works: [],
      page: 1,
      hasMore: true,
      loading: true
    })

    const filtered = this.getFilteredWorks()
    const list = filtered.slice(0, 4)
    this.setData({
      works: list,
      hasMore: filtered.length > 4,
      page: 2,
      loading: false
    })
  },

  likeWork(e) {
    const id = e.currentTarget.dataset.workId
    const works = this.data.works.map(w => {
      if (w.id === id) {
        return { ...w, liked: !w.liked, likes: w.liked ? w.likes - 1 : w.likes + 1 }
      }
      return w
    })
    this.setData({ works })
  },

  followAuthor(e) {
    const authorId = e.currentTarget.dataset.authorId
    const works = this.data.works.map(w => {
      if (w.author.id === authorId) {
        return { ...w, author: { ...w.author, following: true } }
      }
      return w
    })
    this.setData({ works })
    wx.showToast({ title: '关注成功', icon: 'success' })
  },

  unfollowAuthor(e) {
    const authorId = e.currentTarget.dataset.authorId
    const works = this.data.works.map(w => {
      if (w.author.id === authorId) {
        return { ...w, author: { ...w.author, following: false } }
      }
      return w
    })
    this.setData({ works })
    wx.showToast({ title: '已取消关注', icon: 'none' })
  },

  commentWork(e) {
    wx.showToast({ title: '评论功能开发中', icon: 'none' })
  },

  shareWork(e) {
    wx.showActionSheet({
      itemList: ['分享给朋友', '生成分享海报', '复制链接'],
      success: (res) => {
        const tips = ['已发送给朋友', '海报生成中', '链接已复制']
        wx.showToast({ title: tips[res.tapIndex], icon: 'none' })
      }
    })
  },

  getMockWorks() {
    return [
      {
        id: 'w1',
        author: {
          id: 'u1',
          name: '墨韵书生',
          avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=u1',
          following: false
        },
        image: 'https://picsum.photos/seed/cn1/600/400',
        title: '《山水清音图》',
        description: '以AI重现宋代山水意境，远山如黛，近水含烟，墨色浓淡间尽显东方美学神韵。',
        tags: ['国画', '山水', '宋代美学'],
        likes: 256,
        liked: false,
        comments: 28,
        postTime: '2小时前',
        createTime: '2026-05-17T10:00:00',
        challenge: true,
        previewComments: [
          { id: 'c1', author: '画中仙', content: '这水墨韵味太绝了！' },
          { id: 'c2', author: '诗意栖居', content: '仿佛听到了古琴声' }
        ]
      },
      {
        id: 'w2',
        author: {
          id: 'u2',
          name: '剪纸姑娘',
          avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=u2',
          following: true
        },
        image: 'https://picsum.photos/seed/cn2/600/400',
        title: '《龙凤呈祥》',
        description: '传统剪纸艺术与现代AI的结合，龙凤环绕，祥云瑞彩，寓意国泰民安。',
        tags: ['剪纸', '龙凤', '吉祥'],
        likes: 189,
        liked: true,
        comments: 15,
        postTime: '4小时前',
        createTime: '2026-05-17T08:00:00',
        challenge: true,
        previewComments: [
          { id: 'c3', author: '非遗传承人', content: '剪纸元素运用得太巧妙了' }
        ]
      },
      {
        id: 'w3',
        author: {
          id: 'u3',
          name: '青花瓷韵',
          avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=u3',
          following: false
        },
        image: 'https://picsum.photos/seed/cn3/600/400',
        title: '《牡丹亭·游园惊梦》',
        description: '昆曲《牡丹亭》的AI视觉化呈现，杜丽娘与柳梦梅的梦中相会，唯美动人。',
        tags: ['昆曲', '牡丹亭', '戏曲'],
        likes: 312,
        liked: false,
        comments: 42,
        postTime: '6小时前',
        createTime: '2026-05-17T06:00:00',
        challenge: false,
        previewComments: [
          { id: 'c4', author: '戏迷小王', content: '太美了！' },
          { id: 'c5', author: '曲苑风荷', content: '良辰美景奈何天' },
          { id: 'c6', author: '游园惊梦', content: '不到园林怎知春色如许' }
        ]
      },
      {
        id: 'w4',
        author: {
          id: 'u4',
          name: '敦煌画师',
          avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=u4',
          following: false
        },
        image: 'https://picsum.photos/seed/cn4/600/400',
        title: '《飞天·反弹琵琶》',
        description: '取材敦煌莫高窟壁画，AI重绘飞天仙女反弹琵琶的经典舞姿，色彩绚丽。',
        tags: ['敦煌', '飞天', '壁画'],
        likes: 445,
        liked: false,
        comments: 56,
        postTime: '8小时前',
        createTime: '2026-05-17T04:00:00',
        challenge: true,
        previewComments: [
          { id: 'c7', author: '西域行者', content: '敦煌壁画永远的神' },
          { id: 'c8', author: '丝路花雨', content: '色彩还原度好高' }
        ]
      },
      {
        id: 'w5',
        author: {
          id: 'u5',
          name: '茶禅一味',
          avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=u5',
          following: true
        },
        image: 'https://picsum.photos/seed/cn5/600/400',
        title: '《禅茶一味》',
        description: '水彩风格演绎中国茶文化，一盏清茶，几缕茶香，禅意悠然。',
        tags: ['水彩', '茶文化', '禅意'],
        likes: 178,
        liked: false,
        comments: 22,
        postTime: '10小时前',
        createTime: '2026-05-17T02:00:00',
        challenge: false,
        previewComments: [
          { id: 'c9', author: '品茗人', content: '一杯清茶可抵十年尘梦' }
        ]
      },
      {
        id: 'w6',
        author: {
          id: 'u6',
          name: '水墨江南',
          avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=u6',
          following: false
        },
        image: 'https://picsum.photos/seed/cn6/600/400',
        title: '《苏州园林·拙政园》',
        description: 'AI还原苏州园林的移步换景，亭台楼榭，曲径通幽，尽显江南园林之美。',
        tags: ['园林', '苏州', '建筑'],
        likes: 267,
        liked: true,
        comments: 34,
        postTime: '12小时前',
        createTime: '2026-05-16T22:00:00',
        challenge: false,
        previewComments: [
          { id: 'c10', author: '园林爱好者', content: '仿佛置身拙政园' },
          { id: 'c11', author: '江南烟雨', content: '我最爱的苏州' }
        ]
      },
      {
        id: 'w7',
        author: {
          id: 'u7',
          name: '京剧脸谱',
          avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=u7',
          following: false
        },
        image: 'https://picsum.photos/seed/cn7/600/400',
        title: '《生旦净丑》',
        description: '油画风格演绎京剧四大行当，生旦净丑各具神韵，传统与现代的碰撞。',
        tags: ['油画', '京剧', '脸谱'],
        likes: 198,
        liked: false,
        comments: 18,
        postTime: '14小时前',
        createTime: '2026-05-16T20:00:00',
        challenge: false,
        previewComments: [
          { id: 'c12', author: '戏台上下', content: '蓝脸的窦尔敦盗御马' }
        ]
      },
      {
        id: 'w8',
        author: {
          id: 'u8',
          name: '瓷器匠人',
          avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=u8',
          following: true
        },
        image: 'https://picsum.photos/seed/cn8/600/400',
        title: '《青花瓷·缠枝莲》',
        description: '素描手法绘制青花瓷经典纹样，缠枝莲花纹舒展优美，白釉青花一色成。',
        tags: ['素描', '青花瓷', '纹样'],
        likes: 223,
        liked: false,
        comments: 26,
        postTime: '16小时前',
        createTime: '2026-05-16T18:00:00',
        challenge: true,
        previewComments: [
          { id: 'c13', author: '陶瓷艺术', content: '天青色等烟雨，而我在等你' }
        ]
      },
      {
        id: 'w9',
        author: {
          id: 'u9',
          name: '诗经小雅',
          avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=u9',
          following: false
        },
        image: 'https://picsum.photos/seed/cn9/600/400',
        title: '《蒹葭苍苍》',
        description: '以诗经《蒹葭》为灵感，白露为霜，秋水伊人，水墨氤氲中诗意流淌。',
        tags: ['国画', '诗经', '水墨'],
        likes: 334,
        liked: false,
        comments: 41,
        postTime: '18小时前',
        createTime: '2026-05-16T16:00:00',
        challenge: false,
        previewComments: [
          { id: 'c14', author: '采薇', content: '所谓伊人在水一方' },
          { id: 'c15', author: '鹿鸣', content: '太有意境了' }
        ]
      },
      {
        id: 'w10',
        author: {
          id: 'u10',
          name: '元宵灯会',
          avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=u10',
          following: false
        },
        image: 'https://picsum.photos/seed/cn10/600/400',
        title: '《上元灯会图》',
        description: 'AI再现古代元宵灯会的盛况，千盏花灯照亮夜空，游人如织，热闹非凡。',
        tags: ['剪纸', '节日', '元宵'],
        likes: 278,
        liked: true,
        comments: 31,
        postTime: '20小时前',
        createTime: '2026-05-16T14:00:00',
        challenge: true,
        previewComments: [
          { id: 'c16', author: '灯火阑珊', content: '蓦然回首那人却在灯火阑珊处' },
          { id: 'c17', author: '花灯如昼', content: '好热闹的场景' }
        ]
      },
      {
        id: 'w11',
        author: {
          id: 'u11',
          name: '汉服同袍',
          avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=u11',
          following: false
        },
        image: 'https://picsum.photos/seed/cn11/600/400',
        title: '《锦绣华裳》',
        description: '汉服形制与敦煌色系的完美融合，齐胸襦裙飘逸如仙，尽显华夏衣冠之美。',
        tags: ['水彩', '汉服', '传统服饰'],
        likes: 367,
        liked: false,
        comments: 48,
        postTime: '1天前',
        createTime: '2026-05-16T10:00:00',
        challenge: false,
        previewComments: [
          { id: 'c18', author: '华夏有衣', content: '岂曰无衣与子同袍' },
          { id: 'c19', author: '衣冠楚楚', content: '汉服之美穿越千年' }
        ]
      },
      {
        id: 'w12',
        author: {
          id: 'u12',
          name: '节气匠人',
          avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=u12',
          following: true
        },
        image: 'https://picsum.photos/seed/cn12/600/400',
        title: '《二十四节气·谷雨》',
        description: '谷雨时节，雨生百谷。牡丹吐蕊，樱桃红熟，一幅生机盎然的暮春图卷。',
        tags: ['国画', '节气', '花鸟'],
        likes: 156,
        liked: false,
        comments: 14,
        postTime: '1天前',
        createTime: '2026-05-16T08:00:00',
        challenge: false,
        previewComments: [
          { id: 'c20', author: '四季歌', content: '雨生百谷，春去夏来' }
        ]
      }
    ]
  }
})
