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
   
    banner:[], // 轮播图
    xmtab :[], // 项目分类
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    // 轮播图参数

    // 公告参数
    translateY: '0%',
    animation: true,
    gglist:[],



    // 列表上拉刷新相关
    renwuList:[],
    // current:1,
    psize:3,
    next:1,
    stopRefresh:false,
    nomoredata:false,

    yongjin: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
     // app.getUserState()
    that.getDetailInfo()
  },
  // 获取详情  banner  公告  项目类目  列表数据  客服信息 自定义字段
  getDetailInfo: function () {
    let that = this;
    // 初始化banner
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-san&type=1',
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        that.setData({
          banner: res.data
        })
      },
    })
    // 初始化公告
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-notice',
      method: 'get',
      data: {
        limit: 6
      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        let gglist = res.data
        gglist.push(res.data[0])
        that.setData({
          gglist: gglist
        })
      },
    })
    // 初始化项目类目
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-san/san',
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        that.setData({
          xmtab: res.data
        })
      },
    })
    // 初始化列表数据
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-project',
      method: 'get',
      data: {
        page: that.data.next,
        psize: that.data.psize,
        type:2,
      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
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
      },
    })
    // 初始化客服信息
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=base/kefu',
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        getApp().globalData.kefuinfo = res.data
      },
    })
    // 初始化自定义
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-distribution/getdic',
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        getApp().globalData.yongjin = res.data
        that.setData({
          yongjin: res.data
        })
      },
    })
  },  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    
    let showindex = 0
    let translateY = that.data.translateY
    let gglist = that.data.gglist
    // console.log(gglist.length)
    setInterval(function () {
      if (showindex == that.data.gglist.length-1){
        showindex = 0;
      }else{
        showindex++
      }
      let translateValue = "-" + showindex + "00%"

      that.setData({
        translateY: translateValue
      })
      // if (showindex == gglist.length - 1) {
      //   that.setData({
      //     animation: false,
      //     translateY: '0'
      //   })
      //   setTimeout(function () {
      //     that.setData({
      //       animation: true
      //     })
      //   }, 800)
      // }
      if (showindex == 0) {
        that.setData({
          animation: false
        })
        setTimeout(function(){
          that.setData({
            animation: true
          })
        },800)
      }
    }, 5000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
   
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
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
    that.getDetailInfo()
    setTimeout(function () {
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }, 1200)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    let list = that.data.renwuList
    let stopRefresh = that.data.stopRefresh
    console.log("触底")
    if (stopRefresh){
       
    return  wx.showToast({
        title: '暂无更多数据',
        icon: 'none',
        duration: 1000
      })
    }else{
      wx.request({
        url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-project',
        method: 'get',
        data: {
          psize: that.data.psize,
          page : that.data.next
        },
        header: {
          'content-type': 'application/json' // 
        },
        success: function (res) {
          console.log(res.data)
          let current = res.data.pager.current
          let next =    res.data.pager.next
          if (current == next) {
            that.setData({
              nomoredata: true,
              stopRefresh:true
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
  onShareAppMessage: function () {
    return {
      path: '/pages/renwu/renwu-index/renwu-index?scene=' + app.globalData.onlyid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  navigateTopage: function (e) {
    let that = this 
    let name = e.currentTarget.dataset.name
    let cateid = e.currentTarget.dataset.cate
    console.log(e.currentTarget.dataset)
    let url = e.currentTarget.dataset.url + '?cateid=' + cateid + '&name='+ name
    wx.navigateTo({
      url: url,
    })
  },
  /**
   *跳转详情页 
   **/ 
  navigateToDetail: function (e) {
    let url = e.currentTarget.dataset.url+'?id='+e.currentTarget.dataset.id
    wx.navigateTo({
      url: url,
    })
  }
  

})
//获取用户授权状态
// wx.getSetting({
//   success(res) {
//     console.log(res.authSetting)
//     // res.authSetting = {
//     //   "scope.userInfo": true,
//     //   "scope.userLocation": true
//     // }
//   }
// })
// wx.request({
//   url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-project',
//   method: 'get',
//   data: {
//     psize: that.data.psize,
//     page: that.data.next
//   },
//   header: {
//     'content-type': 'application/json' // 
//   },
//   success: function (res) {
//     console.log(res.data)
//     that.setData({
//       renwuList: list.concat(res.data.list),
//       next: res.data.pager.next,
//     })
   
//   },
// })