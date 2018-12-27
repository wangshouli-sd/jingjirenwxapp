var app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.siteInfo.siteroot,
    openid: app.globalData.openid,
    
    collectList:[],
    // 列表上拉刷新相关
    psize: 4,
    next: 1,
    stopRefresh: false,
    nomoredata: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 初始化列表
      app.util.request({
        'url': 'entry/wxapp/index',
        'data': {
          m: 'jc_jingjiren',
          r: 'fr-member/mlike',
          openid: app.globalData.openid,
          page: 1,
          psize: that.data.psize
        },
      success: function (res) {
        console.log(res.data)

        let current = res.data.page.current
        let next = res.data.page.next
        if (current == next) {
          that.setData({
            nomoredata: true,
            stopRefresh: true
          })
        }
        that.setData({
          next: res.data.page.next,
          collectList: res.data.list
        })

       
      },
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
    var that = this
    let collectList = that.data.collectList
    let stopRefresh = that.data.stopRefresh
    if (stopRefresh) {
      return wx.showToast({
        title: '暂无更多数据',
        icon: 'none',
        duration: 1000
      })
    } else {
        app.util.request({
          'url': 'entry/wxapp/index',
          'data': {
            m: 'jc_jingjiren',
            r: 'fr-member/mlike',
            openid: app.globalData.openid,
            psize: that.data.psize,
            page: that.data.next
          },
        success: function (res) {
          console.log(res.data)
          let current = res.data.page.current
          let next = res.data.page.next
          if (current == next) {
            that.setData({
              nomoredata: true,
              stopRefresh: true
            })
          }
          that.setData({
            collectList: collectList.concat(res.data.list),
            next: res.data.page.next,
          })
          wx.showToast({
            title: '更新' + res.data.list.length + '条数据',
            icon: 'none',
            duration: 1000
          })
        },
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 取消收藏
  makeCancelCollect: function (e) {
    var that = this
    let collectList = that.data.collectList
    let index       = e.currentTarget.dataset.index
    let id          = e.currentTarget.dataset.id
    // console.log(e.currentTarget.dataset.index)
    wx.showModal({
      title: '提示',
      content: '是否确认取消收藏',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          
          // 删除收藏链接
            app.util.request({
              'url': 'entry/wxapp/index',
              'data': {
                m: 'jc_jingjiren',
                r: 'fr-member/likes',
                openid: app.globalData.openid,
                project_id: id
              },
            success: function (res) {
              console.log(res.data)
            },
          })

          // 删除成功返回数据后
          
          collectList.splice(index, 1)
          that.setData({
            collectList: collectList
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
  ,
  /**
  *跳转详情页 
  **/
  navigateToDetail: function (e) {
    let url = e.currentTarget.dataset.url + '?id=' + e.currentTarget.dataset.id
    wx.navigateTo({
      url: url,
    })
  }
})