// pages/user/main-menu/main-posters3/main-posters3.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.siteInfo.siteroot,
    openid: app.globalData.openid,

    windowHeight: '',
    windowWidth: '',
    codeimg: '',
    backimg: '',
    username: '',
    avatarUrl: '',
    invitationcode:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          canvasWidth: res.windowWidth,
          canvasHeight: res.windowHeight
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    let that = this
    wx.showToast({
      title: '正在生成海报...',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
    // 获取推广海报设置参数
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-getmoney/poster',
      method: 'get',
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          codeimg: res.data.code,
          backimg: res.data.files,
          avatarUrl: res.data.img,
          username: res.data.username,
          invitationcode: res.data.onlyid
        })
        that.getPosterInfo()
      }
    })  
  },
  getPosterInfo: function (){
    let that = this
    let back = app.siteInfo.siteroot + that.data.backimg
    let code = app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-getopenid/getcode&openid=' + app.globalData.openid
    let avatarUrl = that.data.avatarUrl
    wx.getImageInfo({ //二维码
      src: code,
      success: function (res) {
        console.log(res)
        that.setData({
          codeimg: res.path
        });
        wx.getImageInfo({ //背景图
          src: back,
          success: function (res) {
            console.log(res)
            that.setData({
              backimg: res.path
            });
            // wx.getImageInfo({ //头像
            //   src: avatarUrl,
            //   success: function (res) {
            //     console.log(res)
            //     that.setData({
            //       avatarUrl: res.path
            //     });
            //     that.setcanvas()
            //   }
            // })
            wx.downloadFile({
              url: avatarUrl,
              success(res) {
                if (res.statusCode === 200) {
                  that.setData({
                    avatarUrl: res.tempFilePath
                });
                that.setcanvas()
                }
              }
            })
          }
        })
      }
    })
  },
  setcanvas() {
    var that = this
    let codeimg = that.data.codeimg
    const ctx = wx.createCanvasContext('postercanvas')
    var canvas_width = that.data.windowWidth * 0.8      //这个是画布宽
    var canvas_height = that.data.windowHeight * 0.8;   //这个是高
    // 计算位置 
    var wrapper_width = canvas_width * 0.7          //这个圆角矩形 宽高
    var wrapper_height = canvas_width * 0.7  
    var wrapper_y = canvas_height * 0.2
    var wrapper_x = (canvas_width - wrapper_width) / 2    //左侧距离
    // 放背景图
    ctx.drawImage(that.data.backimg, 0, 0, canvas_width, canvas_height)
    // 放圆角矩形
    ctx.save()
    that.roundRect(ctx, wrapper_x, wrapper_y, wrapper_width, wrapper_height, 10) //绘制圆角矩形
    // 放昵称+描述
    ctx.setFontSize(14)
    ctx.setFillStyle("#000")
    ctx.setTextBaseline('top')
    ctx.setTextAlign('center')
    ctx.fillText(that.data.username, wrapper_x + wrapper_width * 0.5, wrapper_y + wrapper_width*0.20)
    ctx.fillText('邀请码:'+that.data.invitationcode, wrapper_x + wrapper_width * 0.5, wrapper_y + wrapper_width * 0.32)
    // 放二维码
    ctx.drawImage(codeimg, wrapper_x + wrapper_width * 0.27, wrapper_y + wrapper_width*0.46, wrapper_width * 0.46, wrapper_width * 0.46)
    ctx.restore()
    //  ********************图片头像处理 
    // 保存当前环境的状态
    ctx.save();
    ctx.beginPath();
    ctx.arc(wrapper_x + wrapper_width*0.5, wrapper_y, wrapper_width * 0.18, 0, Math.PI * 2);
    ctx.setFillStyle('#EEEEEE')
    ctx.fill()
    // 从原始画布剪切任意形状和尺寸的区域
    ctx.clip();
    // 向画布上绘制图像  *图片圆角处理
    ctx.drawImage(that.data.avatarUrl, wrapper_x + wrapper_width * 0.32, wrapper_y - wrapper_width * 0.18, wrapper_width * 0.36, wrapper_width * 0.36);
    // 返回之前保存过的路径状态和属性
    ctx.restore();
    ctx.draw();
    wx.hideToast();
  },
  roundRect(ctx, x, y, w, h, r) {
    // 开始绘制
    ctx.beginPath()
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    // ctx.setFillStyle('transparent')
    ctx.setFillStyle('rgba(255,255,255,0.6)')
    // ctx.setStrokeStyle('transparent')
    // 绘制左上角圆弧
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

    // 绘制border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    // 绘制右上角圆弧
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

    // 绘制border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    // 绘制右下角圆弧
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

    // 绘制border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    // 绘制左下角圆弧
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

    // 绘制border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)

    ctx.fill()
    // ctx.stroke()
    ctx.closePath()
    // 剪切
    ctx.clip()
  },
  /**
   * 保存到相册
  */
  save: function () {
    var that = this;
    //获取相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.savaImageToPhoto();
            }
          })
        } else {
          that.savaImageToPhoto();
        }
      }
    })
  },
  savaImageToPhoto: function () {
    let that = this;
    wx.showLoading({
      title: '努力生成中...'
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.winWidth,
      height: that.data.winHeight - 70,
      destWidth: that.data.winWidth,
      destHeight: that.data.winHeight - 70,
      canvasId: 'postercanvas',
      success: function (res) {
        wx.hideLoading()
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showModal({
              content: '图片已保存到相册了',
              showCancel: false,
              confirmText: '朕知道啦',
              confirmColor: '#72B9C3',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  that.setData({
                    hidden: true
                  })
                }
              }
            })
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})