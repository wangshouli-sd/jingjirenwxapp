// pages/user/main-menu/main-shouru/shouru-yongjinmingxi/shouru-yongjinmingxi.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl ,
    baseUrlData: app.siteInfo.siteroot,
    openid: app.globalData.openid,
    
    list:[],
    psize: 4,
    next: 1,
    stopRefresh: false,
    nomoredata: false,

    money_all:'',
    typearr:{
      main: '业务佣金收入',
      son: '一级佣金收入',
      grand_son: '二级佣金收入'
    }
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.handleinit()
  },
  /**
   * 初始化获取佣金列表
   */
  handleinit: function () {
    let that = this
    // 初始化列表数据
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-getmoney/detail-money',
      method: 'get',
      data: {
        page: that.data.next,
        size: that.data.psize,
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        console.log(res.data)
        let current = res.data.page.current
        let next = res.data.page.next
        if (current == next) {
          that.setData({
            nomoredata: true,
            stopRefresh: true
          })
        }
        that.setData({
          next: res.data.page.next,
          list: res.data.list
        })
      },
    })
    // 获取佣金余额
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-wallert',
      method: 'get',
      data: {
        openid: app.globalData.openid,
      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          money_all: res.data.all_money
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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
      wx.request({
        url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-getmoney/detail-money',
        method: 'get',
        data: {
          size: that.data.psize,
          page: that.data.next,
          openid: app.globalData.openid
        },
        header: {
          'content-type': 'application/json' // 
        },
        success: function (res) {
          console.log(res.data)
          let current = res.data.page.current
          let next = res.data.page.next
          if (current == next) {
            that.setData({
              nomoredata: true,
              stopRefresh: true
            })
          }
          that.setData({
            list: that.data.list.concat(res.data.list),
            next: res.data.page.next,
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
  
  }
})