// pages/user/main-menu/main-shouru/shouru-addcard/shouru-addcard.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    isAgree: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid: options.openid,
    })

    console.log(this.data.openid)
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
  formSubmit: function (e) {
    console.log(e.detail.value)
    var that = this
    let agree = this.data.isAgree
    let baseUrlData = this.data.baseUrlData
    let parameter = e.detail.value
    parameter.openid = that.data.openid
    parameter.formid = e.detail.formId
    if (that.data.openid==""){
      app.getUserInfo(
        function (userInfo) {
          that.getUserState(userInfo)
          parameter.openid = userInfo.openid
          console.log('ioio')
          console.log(userInfo.openid)
        }
      )
    }
    if (parameter.username == '' || parameter.username == null) {
      wx.showToast({
        title: '请输入联系人姓名',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if (parameter.userphone == '' || parameter.userphone == null) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if (!(/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(parameter.userphone))) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if (parameter.remark == '' || parameter.remark == null) {
      wx.showToast({
        title: '请输入联系人备注',
        icon: 'none',
        duration: 1000
      })
    }
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-member/add-customer',
      method: 'post',
      data: parameter,
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        if (res.data.status.state == 'success') {
          wx.showModal({
            title: '提示',
            content: '添加联系人成功',
            showCancel: false,
            success(res) {
              if (res.confirm) {

                wx.navigateBack({
                  delta: 1
                })

              }
            }
          })
        } else if (res.data.status.state == 'exit') {
          wx.showModal({
            title: '提示',
            content: '提交失败,您提交的意向联系人已被抢先提交过',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                // wx.navigateBack({
                //   delta: 1
                // })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '提交失败,请稍后重试',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                // wx.navigateBack({
                //   delta: 1
                // })
              }
            }
          })
        }
      }
    })
  },
  /**
  * 跳转
  */
  navigatetopage: function (e) {

    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  }
})
