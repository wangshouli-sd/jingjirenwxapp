// pages/renwu/renwu-detail/renwu-detail.js
var sliderWidth = 40; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.siteInfo.siteroot,
    openid: app.globalData.openid,

    tabs: ["佣金计划", "项目合同"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    detail: {},
    collect: 0,

    // 轮播图参数
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 1000,
    circular: true,

    yongjin: app.globalData.yongjin,

    // 客服弹窗
    showView: true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    let id = options.id
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.setData({
      yongjin: app.globalData.yongjin
    })
    // 获取详情
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        m: 'jc_jingjiren',
        r: 'fr-task/one',
        id: id,
      },
      success: function(res) {
        console.log(res.data.task)
        that.setData({
          detail: res.data.task
        })
        // 获取收藏状态
        app.util.request({
          'url': 'entry/wxapp/index',
          'data': {
            m: 'jc_jingjiren',
            r: 'fr-member/like',
            openid: app.globalData.openid,
            project_id: res.data.task.project_id
          },
          success: function(res) {
            console.log(res.data)
            that.setData({
              collect: res.data.state
            })

          },
        })
      },
    })



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
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * tab切换
   */
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  /**
   * 跳转页面
   */
  navigateTopage: function(e) {
    console.log(e.currentTarget.dataset)
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  // 预览
  makepreviewImage: function(e) {
    let that = this
    let url = e.currentTarget.dataset.url
    let urlsarr = that.data.detail.contract
    wx.previewImage({
      current: url,
      urls: urlsarr
    })
  },
  /**
   *收藏 
   */
  makeCollectionChange: function(e) {
    var that = this
    let id = e.currentTarget.dataset.id
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        m: 'jc_jingjiren',
        r: 'fr-member/likes',
        openid: app.globalData.openid,
        project_id: id
      },
      success: function(res) {
        console.log(res.data)
        let collect = that.data.collect == 1 ? 0 : 1
        that.setData({
          collect: collect
        })
        if (that.data.collect == 1) {
          wx.showToast({
            title: '已加入收藏',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '已取消收藏',
            icon: 'none',
            duration: 1000
          })
        }
      },
    })
  },
  //显示客服
  showButton: function() {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  handleCoverTap: function() {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  // 显示客服电话
  makephone: function() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.kefuinfo.phone,
    })
  },
})