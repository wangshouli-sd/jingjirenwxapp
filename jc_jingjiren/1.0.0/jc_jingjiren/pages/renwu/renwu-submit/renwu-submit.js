var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {

    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.siteInfo.siteroot,
    openid: app.globalData.openid,
  
    maxlength: 300,
    realength: 0,
    isAgree: false,
    project_id:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      project_id: options.id
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
  /**
   * 输入字符统计
   */
  bindTextinput: function (e) {  //输入触发
    this.setData({
      liuyancontent: e.detail.value,
      realength: e.detail.value.length

    });
  },
   /**
   * 同意用户协议
   */
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  // 需求表单提交
  formSubmit: function (e) {
    var that = this
    let agree = this.data.isAgree
    let baseUrlData = this.data.baseUrlData
    let parameter = e.detail.value
    parameter.project_id = that.data.project_id
    parameter.openid = app.globalData.openid
    if(parameter.username == '' || parameter.username == null){
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
    } else if (parameter.describe == '' || parameter.describe == null){
      wx.showToast({
        title: '请输入需求备注',
        icon: 'none',
        duration: 1000
      })
    }else if (!agree) {
      return wx.showToast({
        title: '请先阅读并同意用户协议',
        icon: "none"
      })
    } 
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-table/add',
      method: 'post',
      data: parameter,
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        if(res.data.status.state == 'success') {
          wx.showModal({
            title: '提示',
            content: '提交成功，等待管理员审核',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                
                wx.navigateBack({
                  delta: 1
                })

              } 
            }
          })
        } else if (res.data.status.state == 'have'){
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
        } else if (res.data.status.state == 'black') {
          wx.showModal({
            title: '提示',
            content: '提交失败,您的账号当处于禁用状态,暂时不能提交业务,如有疑问请联系平台管理员',
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
  }
})