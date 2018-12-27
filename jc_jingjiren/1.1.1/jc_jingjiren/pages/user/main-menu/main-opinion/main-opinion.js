var app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {

    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.siteInfo.siteroot,

    maxlength: 300,
    realength: 0,

    files: [],    
    updataCachePaths:[], //缓存
    updataImagePaths:[], //返回值
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
  /**
  * 输入字符统计
  */
  bindTextinput: function (e) {  //输入触发
    this.setData({
      realength: e.detail.value.length

    });
  },
   /**
  * 图片上传部分
  */
  // 图片选择
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count:2,
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let FilePathLength = that.data.files.length;
        if (FilePathLength<2){
          that.setData({
            files: that.data.files.concat(res.tempFilePaths),
            updataCachePaths: that.data.files.concat(res.tempFilePaths)
          });
         
        }else{
          wx.showToast({
            title: '最多添加两张图片',
            icon: 'none'
          })
        }
        
      }
    })
  },
  // 图片预览
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  // 图片删除
  delImage : function (e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    let Files = this.data.files
    Files.splice(index, 1)
    console.log(Files)
    this.setData({
      files: Files,
      updataCachePaths: Files
    })

  },
  // 图片上传
  updataImage: function (e) {
    var that = this
    let updataCachePaths = this.data.updataCachePaths
    if (updataCachePaths.length == 0) {
      wx.showToast({
        title: '暂无待上传图片',
        icon: 'none',
        mask: true,
        duration: 1000
      })
      return false;
    }
    let tempFilePaths = this.data.files;

    //启动上传等待中...
    wx.showToast({
      title: '正在上传...',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
    var uploadImgCount = 0;
    var updataImagePaths = [];
    for (var i = 0, h = tempFilePaths.length; i < h; i++) {
      wx.uploadFile({
        url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-member/upload',
        filePath: tempFilePaths[i],
        name: 'slide_img',
        formData: {
          'imgIndex': i
        },
        header: {
          "Content-Type": "multipart/form-data"
        },
        success: function (res) {
          updataImagePaths.push(res.data)
          updataCachePaths.pop()
          console.log(updataImagePaths)
          uploadImgCount++;
          that.setData({
            updataImagePaths: updataImagePaths
          });
          //如果是最后一张,则隐藏等待中
          if (uploadImgCount == tempFilePaths.length) {
            wx.hideToast();
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              mask: true,
              duration: 1000
            })
          }
        },
        fail: function (res) {
          console.log(res)
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
    }
  },

   /**
  * 意见反馈表单提交
  */
  formSubmit: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确认提交',
      success: function (res) {
        if (res.confirm) {
          let parameter = {}
          parameter.problem = e.detail.value.content
          parameter.contact = e.detail.value.tel
          parameter.img = that.data.updataImagePaths.join(",")
          parameter.openid = app.globalData.openid
          console.log(parameter)
          wx.request({
            url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-suggest/create',
            method: 'post',
            data: parameter,
            header: {
              'content-type': 'application/json' // 
            },
            success: function (res) {
              console.log(res.data)
              if (res.data.status.state == "success") {
                wx.showModal({
                  title: '提示',
                  content: '提交成功,点击确认返回',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {

                      wx.navigateBack({
                        delta: 1
                      })

                    }
                  }
                })
              } else if (res.data.status.state == "error") {
                wx.showToast({
                  title: '提交失败，请稍后再试',
                  icon: 'none',
                  duration: 1000
                })
              }
            },
            fail: function (res) {
              wx.showToast({
                title: '提交失败，请稍后再试',
                icon: 'none',
                duration: 1000
              })
            }
          })
        }
      }
    })
  }
})