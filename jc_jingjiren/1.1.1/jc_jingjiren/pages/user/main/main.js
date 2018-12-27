// pages/user/main/main.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.globalData.baseUrlData,
    openid: wx.getStorageSync('openid'),

    identityState: '',
    nopasscase: '',
    collectnumber: '', // 收藏数
    yu_money: '', // 余额
    onlyid: '', // 推广码
    blacklist: '', //黑名单状态
    level: '', //分销等级

    // 客服弹窗
    showView: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.getUserInfo(
      function(userInfo) {
        that.getUserState(userInfo)
        console.log(userInfo)
        console.log('打印')
      }
    )
  },
  //获取用户审核状态
  getUserState: function(userInfo) {
    let that = this

    // 初始化个人信息
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        m: 'jc_jingjiren',
        r: 'fr-member/info',
        openid: userInfo.openid,
      },
      success(res) {
        that.setData({
          collectnumber: res.data.likecount,
          yu_money: res.data.yu_money,
          onlyid: res.data.onlyid,
          blacklist: res.data.is_black,
          level: res.data.level,
          identityState: res.data.status
        })
      }
    })
  },
  // 授权1 获取用户信息 点击授权 + 提交保存用户信息 + 跳转修改信息
  getUserInfo: function(e) {
    console.log(e.detail.userInfo)
    let that = this
    let userinfo = e.detail.userInfo
    app.util.request({
      'url': app.util.url('entry/wxapp/index'),
      'method': 'post',
      'data': {
        m: 'jc_jingjiren',
        r: 'fr-member/edit',
        openid: app.globalData.openid,
        image: userinfo.avatarUrl,
        sex: userinfo.gender,
        nick_name: userinfo.nickName
      },
      success(res) {
        wx.navigateTo({
          url: '../main-editor/main-editor',
        })
      }
    })
  },
  // 授权2 获取用户信息 点击授权 + 提交保存用户信息 + 跳转海报
  getUserInfoPoster: function(e) {
    console.log(e.detail.userInfo)
    let that = this
    let userinfo = e.detail.userInfo
    // 提交用户信息
    app.util.request({
      'url': app.util.url('entry/wxapp/index'),
      'method': 'post',
      'data': {
        m: 'jc_jingjiren',
        r: 'fr-member/edit',
        openid: app.globalData.openid,
        image: userinfo.avatarUrl,
        sex: userinfo.gender,
        nick_name: userinfo.nickName
      },
      success: function(res) {
        let blacklist = that.data.blacklist
        let level = that.data.level
        if (level == '0') {
          wx.showModal({
            title: '提示',
            content: '当前未开启分销功能,海报推广暂不能使用',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {}
            }
          })
          return false
        }
        if (blacklist == '0') {
          wx.showModal({
            title: '提示',
            content: '当前账号状态为禁用，如有疑问请联系平台管理员',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {}
            }
          })
        } else {
          wx.navigateTo({
            url: '../main-menu/main-posters2/main-posters2',
          })
        }
      }
    })
  },

  onShow: function() {

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
    var that = this
    wx.showLoading({
      title: '数据更新中',
    })
    app.getUserInfo(
      function(userInfo) {
        that.getUserState(userInfo)
        console.log(userInfo)
        console.log('下拉')
      }
    )
    setTimeout(function() {
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }, 1200)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },


  navigatetopage: function(e) {
    let that = this
    let url = e.currentTarget.dataset.url
    let navtype = e.currentTarget.dataset.type
    if (navtype == 'tel') {
      wx.makePhoneCall({
        phoneNumber: app.globalData.kefuinfo.phone,
      })
    } else if (navtype == 'tab') {
      wx.switchTab({
        url: url
      })
    } else if (navtype == 'poster') {
      let blacklist = that.data.blacklist
      let level = that.data.level
      // if (res.data.level != '0') {
      //   that.handleinit()
      // }
      if (level == '0') {
        wx.showModal({
          title: '提示',
          content: '当前未开启分销功能,海报推广暂不能使用',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {}
          }
        })
        return false
      }
      if (blacklist == '0') {
        wx.showModal({
          title: '提示',
          content: '当前账号状态为禁用，如有疑问请联系平台管理员',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {}
          }
        })
      } else {
        wx.navigateTo({
          url: url,
        })
      }
    } else if (!url) {
      return false;
    } else {
      // if(){poster
      //   blacklist
      // }
      wx.navigateTo({
        url: url,
      })
    }
  },
  // 跳转审核页面
  navigatetoshenhe: function(e) {
    let url = e.currentTarget.dataset.url
    wx.showModal({
      title: '提示',
      content: '认证未通过,是否重新提交认证',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: url,
          })
        }
      }
    })
  },

  //显示客服
  showButton: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  handleCoverTap: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  makephone: function () {
    wx.makePhoneCall({
      phoneNumber: app.globalData.kefuinfo.phone,
    })
  },
})