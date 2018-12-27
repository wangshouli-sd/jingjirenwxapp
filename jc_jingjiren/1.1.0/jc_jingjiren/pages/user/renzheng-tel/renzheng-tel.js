// pages/user/renzheng-tel/renzheng-tel.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.siteInfo.siteroot,
    openid: app.globalData.openid,

    intervalTime: 61,
    sendalready: false,
    sendcode: 'no',
    tel: '',
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

  setTelphone: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  setcode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  /**
   * 获取验证码
   */
  getValidationCode: function () {
    let that = this
    let tel = that.data.tel
    if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(tel))) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 1000
      })
      return false
    } else{
      wx.request({
        url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=base/sendcode',
        method: 'post',
        data: {
          openid: app.globalData.openid,
          phone: tel
        },
        header: {
          'content-type': 'application/json' // 
        },
        success: function (res) {
          if (res.data.status.state == 'success') {
            wx.showToast({
              title: '验证码已发送，注意查收',
              icon: 'none',
              duration: 1000
            })
            that.setData({
              sendcode: 'ok',
              sendalready: true
            })
            let timer = setInterval(function(){
              let intervalTime = that.data.intervalTime
              intervalTime--
              that.setData({
                intervalTime: intervalTime
              })
              if (intervalTime == 0){
                that.setData({
                  intervalTime: '61',
                  sendalready: false
                })
                clearTimeout(timer)
              }
            },1000)
          } else {
            wx.showToast({
              title: '验证码发送失败，请稍后重试',
              icon: 'none'
            })
          }
        },
      })
    }
  },
  getValidationalready: function() {
    wx.showToast({
      title: '验证码已发送',
      icon: 'none',
      duration: 1000
    })
  },
// 提交验证码 
  handlesubmit: function () {
    let that = this
    let sendcode = that.data.sendcode
    if (sendcode == 'no'){
      wx.showToast({
        title: '请先获取验证码',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    let codenum = that.data.code
    let tel = that.data.tel
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=base/checkcode',
      method: 'post',
      data: {
        code: codenum,
        phone: tel,
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        if(res.data.status.state == 'success'){
          wx.navigateTo({
            url: '../renzheng-idc/renzheng-idc',
          })
        }else{
          wx.showToast({
            title: '验证失败，请核对后重新输入',
            icon: 'none'
          })
        }
      },
    })
  }
})