// pages/user/main/main.js
var app = getApp()
const menulist = [
  // {
  //   icon: 'icon-xiangmuguanli',
  //   title: '项目管理',
  //   url: '../../xiangmu/guanli/guanli',
  //   badge: 10,
  //   navtype: 'tab'
  // },
       {
    icon: 'icon-xiaji',
    title: '我的团队',
    url: '../main-menu/main-team/main-team',
    badge: 0,
    navtype: 'nav'
  },
       {
    icon: 'icon-shouru',
    title: '我的收入',
    badge: 0,
    navtype: 'nav',
    url: '../main-menu/main-shouru/main-shouru',
  },
  {
    icon: 'icon-shoucang1',
    title: '我的收藏',
    badge: 0,
    url: '../main-menu/main-collection/main-collection',
    navtype: 'nav'
  },
  {
    icon: 'icon-kefu',
    title: '联系客服',
    badge: 0,
    navtype:'tel'
  },
  {
    icon: 'icon-yijianfankui',
    title: '意见与反馈',
    badge: 0,
    url: '../main-menu/main-opinion/main-opinion',
    navtype: 'nav'
  }
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.globalData.baseUrlData,
    openid: app.globalData.openid,

    identityState: app.globalData.identity,
    nopasscase: '',
    menulist: menulist,
    collectnumber: '', // 收藏数
    yu_money:'',  // 余额
    onlyid:'',    // 推广码
    blacklist:'', //黑名单状态
    level: '' //分销等级
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getUserState()
    // 获取用户收藏列表
    that.getMoneyDetail()
    // that.getauthorize()
  },
  //  获取账户余额 + 收藏数量
  getMoneyDetail: function () {
    let that = this
    // 获取收藏数
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-member/mlike',
      method: 'get',
      data: {
        openid: app.globalData.openid,
      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        that.setData({
          collectnumber: res.data.page.data_total
        })
      }
    })
    // 获取佣金余额
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-wallert',
      method: 'get',
      data: {
        openid: app.globalData.openid,
      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        that.setData({
          yu_money: res.data.yu_money,
          onlyid: res.data.onlyid
        })
      }
    }) 
    // 获取分销设置
    wx.request({
      url: app.siteInfo.siteroot + '?i='+ app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-distribution',
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
          level: res.data.level
        })
      },
    }) 
  },
   //获取用户审核状态
  getUserState: function () {
    let that = this
    wx.request({
      url: app.siteInfo.siteroot + '?i='+ app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-member/member',
      method: 'post',
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        app.globalData.identity = res.data.member.is_sender
        that.setData({
          identityState: res.data.member.is_sender,
          nopasscase: res.data.member.sender_remark,
          blacklist: res.data.member.blacklist
        })
      },
    })
  },
  //获取用户授权状态  
  getauthorize: function () {
    console.log("获取授权状态")
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
             
            }
          })
        } else {
          
        }
      }
    })
  },
  // 授权1 获取用户信息 点击授权 + 提交保存用户信息 + 跳转修改信息
  getUserInfo: function (e) {
    console.log(e.detail.userInfo)
    let that = this
    let userinfo = e.detail.userInfo
    // 提交用户信息
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-member/editone',
      method: 'post',
      data: {
        openid: app.globalData.openid,
        image: userinfo.avatarUrl,
        sex: userinfo.gender,
        nick_name: userinfo.nickName
      
      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        wx.navigateTo({
          url: '../main-editor/main-editor',
        })
       
      }
    })   
  },
  // 授权2 获取用户信息 点击授权 + 提交保存用户信息 + 跳转海报
  getUserInfoPoster: function (e) {
    console.log(e.detail.userInfo)
    let that = this
    let userinfo = e.detail.userInfo
    // 提交用户信息
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-member/editone',
      method: 'post',
      data: {
        openid: app.globalData.openid,
        image: userinfo.avatarUrl,
        sex: userinfo.gender,
        nick_name: userinfo.nickName

      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        let blacklist = that.data.blacklist
        let level = that.data.level
        if (level == '0') {
          wx.showModal({
            title: '提示',
            content: '当前未开启分销功能,海报推广暂不能使用',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              }
            }
          })
          return false
        }
        if (blacklist == '0') {
          wx.showModal({
            title: '提示',
            content: '当前账号状态为禁用，如有疑问请联系平台管理员',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              }
            }
          })
        } else{
          wx.navigateTo({
            url: '../main-menu/main-posters2/main-posters2',
          })
        }
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
    var that = this
    wx.showLoading({
      title: '数据更新中',
    })
    that.getUserState() // 更新审核状态
    that.getMoneyDetail() // 更新账户余额
    setTimeout(function () {
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }, 1200)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },


  navigatetopage: function (e) {
    let that = this
    let url = e.currentTarget.dataset.url
    let navtype = e.currentTarget.dataset.type
    if (navtype == 'tel'){
      wx.makePhoneCall({
        phoneNumber: app.globalData.kefuinfo.phone,
      })
    } else if (navtype == 'tab'){
      wx.switchTab({
        url: url
      })
    } else if (navtype == 'poster') {
      let blacklist = that.data.blacklist
      let level = that.data.level
      // if (res.data.level != '0') {
        //   that.handleinit()
        // }
      if (level == '0'){
        wx.showModal({
          title: '提示',
          content: '当前未开启分销功能,海报推广暂不能使用',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            }
          }
        })
        return false
      }
      if (blacklist == '0') {
        wx.showModal({
          title: '提示',
          content: '当前账号状态为禁用，如有疑问请联系平台管理员',
          showCancel:false,
          success:function(res){
            if(res.confirm){
            }
          }
        })
      }else{
        wx.navigateTo({
          url: url,
        })
      }
    }else if(!url){
      return false;
    }else{
      // if(){poster
      //   blacklist
      // }
      wx.navigateTo({
        url: url,
      })
    }
  },
  // 跳转审核页面
  navigatetoshenhe: function (e) {
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
  }
})