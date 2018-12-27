//app.js
App({
  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    let that = this
    this.getUserInfo()
    console.log("本次场景值:", options)
    // console.log(decodeURIComponent(options))
    let scene = options.scene
    if (options.query && options.query.scene) {
    // if (scene == '1047' || scene == '1048' || scene == '1049') {
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
      }, 5000)
    }
  },
  onShow: function (options) {
    let that = this
   
  },
  // code openid
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口  登录code
      wx.login({
        success: function (res) {
          console.log(res.code)
          // 发送code到开发者服务器 后台获取openid session_key 返回用户信息 登录状态，
          if (res.code) {
            //发起网络请求
            wx.request({
              method: 'get',
              url: that.siteInfo.siteroot+'?i=' + that.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-getopenid',
              data: {
                code: res.code
              },
              success: function (re) {
                console.log(re.data)
                getApp().globalData.openid = re.data.openid
                getApp().globalData.onlyid = re.data.onlyid
                that.globalData.user_info = re.data.user_info;
                // wx.setStorage({
                //   key: 'user_info',
                //   data: re.data.user_info,
                //   success: function (res) { },
                //   fail: function (res) { },
                //   complete: function (res) { },
                // })

              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }  
      });
     
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
          console.log(res.data)
          getApp().globalData.identity = res.data.member.is_sender
        }
       
      },
    })
  },
  globalData:{
    userInfo:null,
    openid:"1111111",
    onlyid:"1111111",
    baseUrl: "http://192.168.0.201:88/images/", // 图片的
    baseUrlData: "http://192.168.0.201:8080/",  // 接口的
    identity:'3', // 审核状态   0 未通过 1 审核中 2 审核通过  3 未通过
    kefuinfo: {},
    yongjin:'yongjin'
  },
  util: require('we7/resource/js/util.js'),
  siteInfo: require('siteinfo.js')
})
