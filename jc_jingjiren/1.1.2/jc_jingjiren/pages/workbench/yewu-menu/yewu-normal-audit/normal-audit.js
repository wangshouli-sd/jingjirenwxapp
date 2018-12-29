// pages/workbench/yewu-menu/yewu-defeat-talk/defeat-talk.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state:'',
    list: [{}, {}],
    inputShowed: false,
    inputVal: '',
    openid: '',
    currentpage: '1',
    pagesize: '10',
    searchvalue:'',
    next:'',
    stopRefresh: false,
    nomoredata: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      state: options.state,
      openid: options.openid,
    })
    this.settitle(options.state)
    this.getUserState(options)
  },

  settitle:function(state){
    if (state == '0') {
      wx.setNavigationBarTitle({
        title: '审核未通过业务'
      })
    } else if (state == '1'){
      wx.setNavigationBarTitle({
        title: '洽谈中业务'
      })
    }
    else if (state == '2') {
      wx.setNavigationBarTitle({
        title: '服务中业务'
      })
    } else if (state == '3') {
      wx.setNavigationBarTitle({
        title: '已完成业务'
      })
    }
    else if (state == '4') {
      wx.setNavigationBarTitle({
        title: '已签约待服务业务'
      })
    }
    else if (state == '5') {
      wx.setNavigationBarTitle({
        title: '审核中业务'
      })
    }
    else if (state == '6') {
      wx.setNavigationBarTitle({
        title: '洽谈失败业务'
      })
    }
    else if (state == '7') {
      wx.setNavigationBarTitle({
        title: '服务中止业务'
      })
    }
  },

  //获取用户审核状态
  getUserState: function (options) {
    let that=this
    // 初始化列表
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        m: 'jc_jingjiren',
        r: 'fr-task/mylist',
        openid: options.openid,
        state: options.state,
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
          list: res.data.task,
          currentpage: res.data.pager.next,
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
        r: 'fr-task/mylist',
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
          list: list.concat(res.data.task),
          currentpage: res.data.pager.next,
        })
        wx.showToast({
          title: '更新' + res.data.task.length + '条数据',
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
  showInput: function (e) {
    var that = this
    console.log(e) 
      that.setData({
        inputShowed: true,  
      })
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
  
  },

  //搜索
  makesearchinfo: function (search) {
    let that = this
    console.log(search)
    if (search){
      app.util.request({
        'url': 'entry/wxapp/index',
        'data': {
          m: 'jc_jingjiren',
          r: 'fr-task/mylist',
          openid: that.data.openid,
          state: that.data.state,
          page: that.data.next,
          psize: that.data.pagesize,
          // username: search,
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
        that.setData({
          list: res.data.task,
          next: res.data.pager.next,
        })
      }
    })
    }else{
      app.util.request({
        'url': 'entry/wxapp/index',
        'data': {
          m: 'jc_jingjiren',
          r: 'fr-task/mylist',
          openid: that.data.openid,
          state: that.data.state,
          page: that.data.next,
          psize: that.data.pagesize,
           username: search,
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
          that.setData({
            list: res.data.task,
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

