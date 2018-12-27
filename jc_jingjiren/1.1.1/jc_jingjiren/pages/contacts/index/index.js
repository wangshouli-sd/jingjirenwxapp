// pages/contacts/index/index.js
var app = getApp()
var airportDate = require('../../../we7/resource/js/airport.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    title: 'grid',
    lists: airportDate.list,
    touchmove: false,
    touchmoveIndex: -1,
    itemHeight: 0,
    winHeight: 0,
    scrollViewId: "A",

    // 列表上拉刷新相关
    stopRefresh: false,
    nomoredata: false,
    customer: [], // 顾客列表

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let winHeight = wx.getSystemInfoSync().windowHeight;
    app.getUserInfo(
      function(userInfo) {
        // console.log(userInfo)
        that.setData({
          openid: userInfo.openid
        })
        // console.log(that.data.openid)
      }
    )
    that.setData({
      itemHeight: winHeight / 26,
      winHeight: winHeight,
    })
    console.log(winHeight / 26)
    that.getIndexInfo()

  },

 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    that.getIndexInfo()

  },

  getIndexInfo: function() {
    let that = this;
    // 初始化通讯录
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        m: 'jc_jingjiren',
        r: 'fr-member/first',
        openid: that.data.openid
      },
      success(res) {
        if (res.data.list) {
          that.setData({
            customer: res.data.list
          })
        } else {
          that.setData({
            customer: null
          })
        }
        // console.log(JSON.parse(res.data.list)) 
        // console.log(res.data.list)
        console.log(res.data.list)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this
    wx.showLoading({
      title: '数据更新中',
    })
    
    setTimeout(function () {
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }, 1200)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    let list = that.data.customer
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
        url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-member/customer-list',
        method: 'get',
        data: {
          psize: that.data.psize,
          page: that.data.next
        },
        header: {
          'content-type': 'application/json' // 
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
            customer: list.concat(res.data.list),
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

  },
  // 索引滑动相关
  touchStart(e) {
    let that = this
    // this.data.touchmove = true;
    let pageY = e.touches[0].pageY;
    let index = Math.floor(pageY / that.data.itemHeight);
    console.log(index)
    wx.vibrateShort();
    that.setData({
      touchmove: true,
      scrollViewId: that.data.lists[index].letter,
      touchmoveIndex: index
    })
  },
  touchMove(e) {
    let that = this
    let pageY = e.touches[0].pageY;
    let index = Math.floor(pageY / that.data.itemHeight);
    if (index != that.data.touchmoveIndex) {
    // if (that.data.lists[index].letter !== that.data.scrollViewId) {
      wx.vibrateShort();
      console.log(index)
    }
    that.setData({
      scrollViewId: that.data.lists[index].letter,
      touchmoveIndex: index,
    })
   
  },
  touchEnd() {
    this.setData({
      touchmove: false,
      // touchmoveIndex: -1
    })
  },
  touchCancel() {

    this.setData({
      touchmove: false,
      // touchmoveIndex : -1
    })
  },
  // 索引滑动相关

  handleNavigateTo: function(e) {
    console.log(e.currentTarget.dataset.url)
    let url = e.currentTarget.dataset.url
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