
App({
  onLaunch: function (options) {
    let that = this
    this.getUserInfo()
    let scene = options.scene
    if (options.query && options.query.scene) {
      let scenecode = options.query.scene
      setTimeout(function () {
        wx.request({
          url: that.siteInfo.siteroot +'?i=' + that.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-getopenid/getscene',
          method: 'post',
          data: {
            openid: getApp().globalData.openid,
            scene: scenecode
          },
          header: {
            'content-type': 'application/json' // 
          },
          success: function (res) {
          },
        })
      })
    }
  },
  onShow: function (options) {
    let that = this
  },

  getUserInfo: function (cb) {
    var that = this;
    if (that.globalData.openid != '0') {
      typeof cb == "function" && cb(that.globalData)
    } else {
      new Promise(
        RES => {
          wx.login({
            success: function (res) {
              console.log(res.code)
              // 发送code到开发者服务器 后台获取openid session_key 返回用户信息 登录状态，
              if (res.code) {
                //发起网络请求
                wx.request({
                  method: 'get',
                  url: that.siteInfo.siteroot + '?i=' + that.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-getopenid',
                  data: {
                    code: res.code
                  },
                  success: function (re) {
                    console.log(re.data)
                    getApp().globalData.openid = re.data.openid
                    getApp().globalData.onlyid = re.data.onlyid
                    that.globalData.user_info = re.data.user_info;
                    RES()
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          });
        }
      ).then(() => {
        if (that.globalData.openid != '0') {
          typeof cb == "function" && cb(that.globalData)
        }
      }
      )
      //调用登录接口 登录code
    }
  },
  getUserState:function(){ //获取用户审核状态
    let that=this
    wx.request({
      url: that.siteInfo.siteroot +'?i=' + that.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-member/member',
      method: 'post',
      data: {
        id: this.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        if (res.data.status.state =='success'){

          getApp().globalData.identity = res.data.member.is_sender
        }
       
      },
    })
  },
  globalData:{
    userInfo:null,
    openid:"0",
    onlyid:"0",
    identity:'3', // 审核状态   0 未通过 1 审核中 2 审核通过  3 未通过
    kefuinfo: {},
    yongjin:'yongjin'
  },
  util: require('we7/resource/js/util.js'),
  siteInfo: require('siteinfo.js')
})
