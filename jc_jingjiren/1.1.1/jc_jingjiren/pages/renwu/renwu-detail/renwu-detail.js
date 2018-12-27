// pages/renwu/renwu-detail/renwu-detail.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.siteInfo.siteroot,
    openid: '',

    tabs: ["项目简介", "项目流程"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    // 轮播图参数
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 1000,
    circular: true,

    detail: {},
    process: [],
    detailimgArr: [],
    yongjin: app.globalData.yongjin,

    // 客服
    showView: true,
  },

  onLoad: function(options) {
    var that = this;
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
    console.log(options)
    let id = options.id
    // 获取任务详情信息
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        m: 'jc_jingjiren',
        r: 'fr-project/one',
        openid: app.globalData.openid,
        id: id
      },
      success: function(res) {
        console.log(res.data)
        let imgarr = []
        let descpath = res.data.project.description_path
        for (let i = 0; i < descpath.length; i++) {
          imgarr.push(descpath[i].path)
        }
        that.setData({
          category: res.data.category,
          detail: res.data.project,
          process: res.data.process,
          detailimgArr: imgarr,
          id: id
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
  handleshare: function() {
    console.log("分享")
  },
  onShareAppMessage: function() {
    return {
      path: '/pages/renwu/renwu-detail/renwu-detail?id=' + this.data.id + '&scene=' + app.globalData.onlyid,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
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
  // 预览
  makepreviewImage: function(e) {
    let url = e.currentTarget.dataset.url
    let urlsarr = this.data.detailimgArr
    console.log(urlsarr)
    wx.previewImage({
      current: url,
      urls: urlsarr
    })
  },
  // 添加收藏
  makeCollectionChange: function(e) {
    var that = this
    let id = e.currentTarget.dataset.id
    let detail = that.data.detail
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        m: 'jc_jingjiren',
        r: 'fr-member/likes',
        project_id: id,
        openid: app.globalData.openid
      },
      success: function(res) {
        console.log(res.data) // 返回 1 收藏   0 取消收藏
        let like = that.data.detail.like == 1 ? 0 : 1
        let likedata = that.data.detail.like
        let likestate = res.data
        let det_like = 'detail.like'
        that.setData({
          [det_like]: res.data
        })
        if (likedata != res.data && res.data == '1') {
          wx.showToast({
            title: '已加入收藏',
            icon: 'none',
            duration: 1000
          })
        } else if (likedata != res.data && res.data == '0') {
          wx.showToast({
            title: '已取消收藏',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '收藏失败,请稍后重试',
            icon: 'none',
            duration: 1000
          })
        }
      },
    })


  },
  /**
   * 跳转页面  判断经纪人认证情况  通过跳转认证页
   */
  navigateTopage: function(e) {
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
      success: function(res) {

      }
    })
    let that = this
    let url = e.currentTarget.dataset.url + "?id=" + e.currentTarget.dataset.id
    //判断认证状态
    console.log(getApp().globalData.openid)
    // return false       
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        m: 'jc_jingjiren',
        r: 'fr-member/member',
        openid: getApp().globalData.openid
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.status.state == 'success') {
          app.globalData.identity = res.data.member.is_sender
          console.log(app.globalData.identity)
          switch (app.globalData.identity) {
            case '1': // 审核中
              wx.showToast({
                title: '经纪人身份正在审核，暂时不能提交业务',
                icon: 'none'
              })
              break;
            case '2': // 通过
              console.log(url)
              wx.navigateTo({
                url: url,
                // url:'../renwu-submit/renwu-submit/formSubmit'
              })
              break;
            case '3': // 未认证
              wx.showModal({
                content: '暂无提交权限，提交业务信息需先通过经纪人身份认证',
                showCancel: true,
                confirmText: '去认证',
                confirmColor: '#72B9C3',
                success: function(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../../user/renzheng-tel/renzheng-tel',
                    })
                  }
                }
              })
              break;
            case '0': // 未通过
              wx.showModal({
                content: '经纪人身份验证未通过,具体原因请到个人中心查看',
                showCancel: true,
                confirmText: '去查看',
                confirmColor: '#72B9C3',
                success: function(res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '../../user/main/main'
                    })
                  }
                }
              })
              break;
            default:
              break
          }
        }
      },
    })
  },
  navswitchTab: function(e) {
    wx.switchTab({
      url: '../renwu-index/renwu-index'
    })
    // wx.navigateTo({
    //   url: '../renwu-fenlei/renwu-fenlei',
    // })
  },
  // makephone: function() {
  // wx.showModal({
  //   content: '暂无提交权限，提交业务信息需先通过经纪人身份认证',
  //   showCancel: true,
  //   confirmText: '在线客服',
  //   confirmColor: '#72B9C3',
  //   success: function (res) {
  //     if (res.confirm) {
  //       wx.navigateTo({
  //         url: '../../user/renzheng-tel/renzheng-tel',
  //       })
  //     }
  //   }
  // })

  //   wx.showActionSheet({
  //     itemList: ['拨打电话', '在线客服'],
  //     success: function (res) {
  //       console.log(res.tapIndex)
  //       if (res.tapIndex==0){
  //         console.log('dianhau')
  //       } else if (res.tapIndex == 1){
  //         console.log('zaixian')
  //       }
  //     },
  //     fail: function (res) {
  //       console.log(res.errMsg)
  //     }
  //   })
  // }
  makephone: function() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.kefuinfo.phone,
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
  }
})