var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    list:[],
    next:'',
    currentpage:'1',
    pagesize:'10'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid: options.openid,
    })
    this.getUserState(options)
    console.log(this.data.openid)
  },
  //获取列表
  getUserState: function (options) {
    let that = this
    // 初始化列表
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        m: 'jc_jingjiren',
        r: 'fr-task/all-task',
        openid: options.openid,
        page: that.data.currentpage,
        psize: that.data.pagesize,
      },
      success(res) {
        let current = res.data.pager.current
        let next = res.data.pager.next
        if (current == next) {
          that.setData({
            nomoredata: true,
            stopRefresh: true
          })
        }
        console.log(res)
        that.setData({
          list: res.data.list,
          next: res.data.pager.next,
        })
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
    var that = this
    let list = that.data.list
    let stopRefresh = that.data.stopRefresh
    console.log("触底2")
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
          r: 'fr-task/all-task',
          openid: that.data.openid,
          page: that.data.next,
          psize: that.data.pagesize,
        },
        success(res) {
          let current = res.data.pager.current
          let next = res.data.pager.next
          if (current == next) {
            that.setData({
              nomoredata: true,
              stopRefresh: true
            })
          }
          console.log(res)
          that.setData({
            list: list.concat(res.data.list),
            next: res.data.pager.next,
          })
          wx.showToast({
            title: '更新' + res.data.list.length + '条数据',
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 搜索框相关
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    console.log(e.detail.value)
    // this.getlist(e.detail.value)
  },

  //搜索
  makesearchinfo: function (search) {
    let that = this
    if (search) {
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        m: 'jc_jingjiren',
        r: 'fr-task/all-task',
        openid: that.data.openid,
        state: that.data.state,
        page: that.data.currentpage,
        psize: that.data.pagesize,
      },
      success(res) {
        let current = res.data.pager.current
        let next = res.data.pager.next
        if (current == next) {
          that.setData({
            nomoredata: true,
            stopRefresh: true
          })
        }
        console.log(res)
        that.setData({
          list: res.data.list,
          next: res.data.pager.next,
        })
      }
    })
    }else{
      app.util.request({
        'url': 'entry/wxapp/index',
        'data': {
          m: 'jc_jingjiren',
          r: 'fr-task/all-task',
          openid: that.data.openid,
          state: that.data.state,
          page: that.data.currentpage,
          psize: that.data.pagesize,
          search: search,
        },
        success(res) {
          let current = res.data.pager.current
          let next = res.data.pager.next
          if (current == next) {
            that.setData({
              nomoredata: true,
              stopRefresh: true
            })
          }
          console.log(res)
          that.setData({
            list: res.data.list,
            next: res.data.pager.next,
          })
        }
      })
    }
  },
  navigatetopage: function (e) {
    let state = e.currentTarget.dataset.state
    let id = e.currentTarget.dataset.id
    let url = ''
    if (!state) {
      url = e.currentTarget.dataset.url + '?id=' + id
    } else {
      url = e.currentTarget.dataset.url + '?state=' + state
    }
    // let url = e.currentTarget.dataset.url 
    wx.navigateTo({
      url: url,
    })
  }
})