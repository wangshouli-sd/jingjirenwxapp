var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.siteInfo.siteroot,
    // 轮播图参数
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,

    //banner: [], // 轮播图
    xmtab: [], // 项目分类
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    // 轮播图参数

    // 公告参数
    translateY: '0%',
    animation: true,
    gglist: [],


    // 列表上拉刷新相关
    renwuList: [],
    // current:1,
    psize: '5',
    next: '1',

    psize2: '3',
    next2:'1',
    stopRefresh: false,
    nomoredata: false,

    yongjin: '',

    project: [{}, {}, {}, {}, {}], //最新项目下面的
    more: [], // 轮播图下面的更多项目
    luobo: [],   // 轮播图加跳转链接
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    // app.getUserState()

    that.getIndexInfo()
    //  that.getDetailInfo()
  },

  // 整合首页接口 我写的
  getIndexInfo: function() {
    let that = this;
    // 初始化轮播图,项目分类,公告
    app.util.request({
        'url': 'entry/wxapp/index',
        'data': {
          m: 'jc_jingjiren',
          r: 'fr-project/info',
        },
        success(res) {
          that.setData({
            gglist: res.data.gglist,
           // banner: res.data.banner,
            // xmtab: res.data.xmtab,
            project: res.data.xmtab,
           //  more: res.data.more,
            luobo:res.data.luobo,
          })
          // console.log(res.data.luobo)
        }
      }),
      // 最新项目初始化数据列表
      app.util.request({
        'url': 'entry/wxapp/index',
        'data': {
          m: 'jc_jingjiren',
          r: 'fr-project',
          page: that.data.next2,
          psize: that.data.psize2,
          type: 1,
        },
        success(res) {
          let current = res.data.pager.current
          let next = res.data.pager.next
          if (current == next) {
            that.setData({
              nomoredata: true,
              stopRefresh: true
            })
          }
          that.setData({
            next2: res.data.pager.next,
            renwuListnew: res.data.list
          })
        }
      })
      // 最热项目 初始化列表数据
      app.util.request({
        'url': 'entry/wxapp/index',
        'data': {
          m: 'jc_jingjiren',
          r: 'fr-project',
          page: that.data.next,
          psize: that.data.psize,
          type: 2,
        },
        success(res) {
          console.log(res.data)
          let current = res.data.pager.current
          let next = res.data.pager.next
          if (current == next) {
            that.setData({
              nomoredata: true,
              stopRefresh: true
            })
          }
          that.setData({
            next: res.data.pager.next,
            renwuList: res.data.list
          })
        }
      })
    // 初始化客服信息
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        m: 'jc_jingjiren',
        r: 'base/kefu',
      },
      success(res) {
        getApp().globalData.kefuinfo = res.data
      }
    })
    // 初始化自定义
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        m: 'jc_jingjiren',
        r: 'fr-distribution/getdic',
      },
      success: function(res) {
        getApp().globalData.yongjin = res.data
        that.setData({
          yongjin: res.data
        })
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this
    wx.showLoading({
      title: '数据更新中',
    })
    that.setData({
      psize: 3,
      next: 1,
      stopRefresh: false,
      nomoredata: false
    })
    that.getIndexInfo()
    setTimeout(function() {
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }, 1200)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    let list = that.data.renwuList
    let stopRefresh = that.data.stopRefresh
    console.log("触底")
    if (stopRefresh) {

      return wx.showToast({
        title: '暂无更多数据',
        icon: 'none',
        duration: 1000
      })
    } else {
        app.util.request({
          'url': 'entry/wxapp/index',
          'data': {
            m: 'jc_jingjiren',
            r: 'fr-project',
            psize: that.data.psize,
            page: that.data.next,
            type: 2,
          },
        success: function(res) {
          console.log(res.data)
          let current = res.data.pager.current
          let next = res.data.pager.next
          if (current == next) {
            that.setData({
              nomoredata: true,
              stopRefresh: true
            })
          }
          that.setData({
            renwuList: list.concat(res.data.list),
            next: res.data.pager.next,
          })
          wx.showToast({
            title: '更新' + res.data.list.length + '条数据',
            icon: 'none',
            duration: 1000
          })
        },
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      path: '/pages/renwu/renwu-index/renwu-index?scene=' + app.globalData.onlyid,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  // 跳转
  navigateTopage: function(e) {
    let that = this
    let name = e.currentTarget.dataset.name
    let cateid = e.currentTarget.dataset.cate
    //console.log(e.currentTarget.dataset)
    let url = e.currentTarget.dataset.url + '?cateid=' + cateid + '&name=' + name
    wx.navigateTo({
      url: url,
    })
  },

   /**banner
   *跳转详情页 
   **/
  navigateTobanner: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    // console.log(e.currentTarget.dataset)
    let url = e.currentTarget.dataset.url + '?id=' + id
    wx.navigateTo({
      url: url,
    })
  },

  // 轮播图下面的更多项目
  navigateTomoreproject: function (e) {
    let that = this
    // console.log(e.currentTarget.dataset)
    // let url = e.currentTarget.dataset.url + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-project&psize=12'
    let url = e.currentTarget.dataset.url + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-project&psize=12'
    wx.navigateTo({
      url: url,
    })
  },

  // 查看最新项目更多
  navigateTomore: function(e) {
    let that = this
    // console.log(e.currentTarget.dataset)
    // let url = e.currentTarget.dataset.url + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-project&psize=12'
    let url = e.currentTarget.dataset.url + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-project&psize=12&type=1'
    wx.navigateTo({
      url: url,
    })
  },

  // 查看最热项目更多
  navigateTomorehot: function (e) {
    let that = this
    // let type = e.currentTarget.dataset.type
    // console.log(e.currentTarget.dataset)
    // let url = e.currentTarget.dataset.url + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-project&psize=12'
    let url = e.currentTarget.dataset.url + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-project&psize=12&type=2'
    wx.navigateTo({
      url: url,
    })
  },
  /**
   *跳转详情页 
   **/
  navigateToDetail: function(e) {
    let url = e.currentTarget.dataset.url + '?id=' + e.currentTarget.dataset.id
    wx.navigateTo({
      url: url,
    })
  }
})