// pages/user/renzheng-idc/renzheng-idc.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.siteInfo.siteroot,
    openid: app.globalData.openid,

    idc_front: '',
    idc_front_id: '',
    idc_back: '',
    idc_back_id: '',
    name:'',
    idcard: ''
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

  setName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  setIdcard: function (e) {
    this.setData({
      idcard: e.detail.value
    })
  },
  /**
   * 上传身份证
   */
  makeupdatafile_idc: function (e) {
    var that = this;
    let idctype = e.currentTarget.dataset.type
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 1,
      success: function (res) {
        console.log(res)
        if (idctype == "front"){
          that.setData({
            idc_front: res.tempFilePaths[0]
          });
        }else{
          that.setData({
            idc_back: res.tempFilePaths[0]
          });
        }
        that.updataImage(e, idctype, res.tempFilePaths[0])
      }
    })

  },
  // 图片上传
  updataImage: function (e, ctype, tempFilePaths) {
    var that = this
    //启动上传等待中...
    wx.showToast({
      title: '正在上传...',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
    wx.uploadFile({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-member/upload',
      filePath: tempFilePaths,
      name: 'backcardimg',
      formData: {},
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: function (res) {
        console.log(res.data)
        let typename = ctype == 'front' ? 'idc_front_id' :'idc_back_id'
        that.setData({
          [typename]: res.data
        });
        wx.hideToast();
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          mask: true,
          duration: 1000
        })
      },
      fail: function (res) {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '上传图片失败',
          showCancel: false,
          success: function (res) {
          }
        })
      }
    }); 
  },
  /**
   * 跳转页面
   */
  navigateTopage: function (e) {
    // console.log(e.currentTarget.dataset)
    // let url = e.currentTarget.dataset.url
    // wx.navigateTo({
    //   url: url,
    // })
  },
  //提交
  handlesubmit: function (e) {
    let that = this
    let parmas = {}
    if (that.data.name == '' || that.data.name == null){
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if (that.data.idcard == '' || that.data.idcard == null){
      wx.showToast({
        title: '身份证不能为空',
        icon: 'none',
        duration: 1000
      })
      return false
    }else if (that.data.idc_front_id == '' || that.data.idc_front_id == null ) {
      wx.showToast({
        title: '请上传身份证正面照',
        icon: 'none',
        duration:1000
      })
      return false
    } else if (that.data.idc_back_id == '' || that.data.idc_back_id == null ){
      wx.showToast({
        title: '请上传身份证背面照',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    parmas.openid = app.globalData.openid
    parmas.name = that.data.name
    parmas.idcard = that.data.idcard
    parmas.img = that.data.idc_front_id + ',' + that.data.idc_back_id
    console.log(parmas)
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=base/sendcheck',
      method: 'post',
      data: parmas,
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        if(res.data.status.state == 'success'){
          wx.showModal({
            title: '提示',
            content: '提交成功，等待管理员完成审核',
            cancelText: '返回首页',
            confirmText: '查看进度',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../renzheng-progress/renzheng-progress',
                })
              } else if (res.cancel) {
                let url = e.currentTarget.dataset.url
                wx.switchTab({
                  url: '../main/main'
                })
              }
            }
          })
         
        }else{
          wx.showToast({
            title: '提交失败，请稍后重试',
            icon: 'none'
          })
        }
      },
    })
  }
})