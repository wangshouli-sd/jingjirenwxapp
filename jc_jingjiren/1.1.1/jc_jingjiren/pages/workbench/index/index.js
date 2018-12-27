// pages/workbench/index/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.siteInfo.siteroot,
    openid: '',
    list:[],
    currentpage:'1',
    pagesize:'5',
    banner:'../../../images/pic/back.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getUserInfo(
      function (userInfo) {
        that.setData({
          openid: userInfo.openid,
        })
      }
    )
    that.getUserState()
  },
  //获取顶部长图片
  getUserState: function () {
    let that = this
    console.log(123)
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        m: 'jc_jingjiren',
        r: 'fr-san/banner',
      },
      success(res) {
        that.setData({
          banner: res.data,
        })
        console.log(that.data.baseUrlData)
        console.log(that.data.baseUrl)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handleNavigateTo: function (e) {
    console.log(e.currentTarget.dataset.url)
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
    //console.log(e.currentTarget.dataset.url)
  }
})