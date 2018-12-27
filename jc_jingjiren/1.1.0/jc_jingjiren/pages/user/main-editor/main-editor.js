// pages/user/main-editor/main-editor.js
var app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.globalData.baseUrlData,
    openid: app.globalData.openid ,


    user_img:'',
    date: '2012-09',
    genderArray: ['保密','男', '女'],
    genderindex: 0,
    nick_name: '',
    region: ['山东省', '青岛市','城阳区'],
    maxlength: 200,
    realength: 0,
    description: '',
    formatDate: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var timedate = new Date()
    var year = timedate.getFullYear();
    var month = timedate.getMonth() + 1;
    var day = timedate.getDate();
    if (month < 10) {
      month = '0' + month;
    };
    if (day < 10) {
      day = '0' + day;
    };
    var formatDate = year + '-' + month + '-' + day;
    console.log(formatDate)
    this.setData({
      formatDate: formatDate
    })

    this.initUserinfo()
    
  },
  initUserinfo: function () {
    let that = this
    // 初始化用户信息
      app.util.request({
        'url': 'entry/wxapp/index',
        'data': {
          m: 'jc_jingjiren',
          r: 'fr-member/member',
          openid: app.globalData.openid,
        },
      success: function (res) {
        if(res.data.status.state == 'success'){
          console.log(res.data.member)
          that.setData({
            genderindex: res.data.member.sex,
            nick_name: res.data.member.nick_name,
            user_img: res.data.member.image,
            region: res.data.member.city == null ? ['未设置']:res.data.member.city.split(","),
            description: res.data.member.description,
            date: res.data.member.brithday == null ? "00-00" : res.data.member.brithday
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
  chooseImage:function (e) {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths)
        that.setData({
          user_img: tempFilePaths[0]
        })
      }
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindGenderChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      genderindex: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  bindTextinput: function (e) {  //输入触发
    this.setData({
      description: e.detail.value,
      realength: e.detail.value.length

    });
  },


  /**
   * 信息修改提交
   */
  formSubmit: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认提交修改',
      success: function(res){
        if (res.confirm) {
          let parameter = e.detail.value
          parameter.city = parameter.city.join(',')
          parameter.openid = app.globalData.openid
          console.log(parameter)
          // 提交
          wx.request({
            url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-member/editone',
            method: 'post',
            data: parameter,
            header: {
              'content-type': 'application/json' // 
            },
            success: function (res) {
              console.log(res.data)
              wx.showToast({
                title: '设置成功',
                icon: 'success',
                duration: 1000
              })
            }
          })
        }    
      }
    })
    
  }

})