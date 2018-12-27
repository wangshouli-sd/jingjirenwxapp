// pages/xiangmu/guanli/guanli.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {

    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.siteInfo.siteroot,
    openid: app.globalData.openid || '1',
    // tabs: ["未通过", "洽谈中", "服务中", "已完成"],
    tabs: ["审核中", "洽谈中","服务中","已完成","已终止"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    
    // list_page
    list_state0_page : 1,   // 0 未通过
    list_state0_size : 5,
    state0_stopRefresh : false,

    list_state1_page: 1,    // 1 洽谈中
    list_state1_size : 5,
    state1_stopRefresh: false,

    list_state2_page : 1,   // 2 服务中
    list_state2_size : 5,
    state2_stopRefresh: false,

    list_state3_page : 1,   // 3 已完成
    list_state3_size : 5,
    state3_stopRefresh: false,

    list_state3_page: 1,    // 4 洽谈中
    list_state3_size: 5,
    state3_stopRefresh: false,


    list_state0:[],//
    list_state1:[],
    list_state2:[],
    list_state3:[],
    list_state4:[],

    state0total: '0',
    state1total: '0',
    state2total: '0',
    state3total: '0',
    state4total: '0',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.geListInit()
  },
  geListInit: function () {
    let that = this
    // 0 未通过  1 洽谈中 2 服务中 3已完成 4 审核中 
    // 初始化列表数据
    for (var i = 0; i < 5; i++) {
      let url = '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-task/mylist&state=' + i
      let list = 'list_state' + i
      let Refresh = 'state' + i + '_stopRefresh'
      let page = 'list_state' + i + '_page'
      let total = 'state' + i + 'total'
      let listdata = i == 0 ? that.data.list_state0 : i == 1 ? that.data.list_state1 : i == 2 ? that.data.list_state2 : that.data.list_state3
      let listpage = i == 0 ? that.data.list_state0_page : i == 1 ? that.data.list_state1_page : i == 2 ? that.data.list_state2_page : that.data.list_state3_page
      let listpsize = i == 0 ? that.data.list_state0_size : i == 1 ? that.data.list_state1_size : i == 2 ? that.data.list_state2_size : that.data.list_state3_size

      wx.request({
        url: app.siteInfo.siteroot + url,
        method: 'get',
        data: {
          // id: id
          page: listpage,
          psize: 5,
          openid: app.globalData.openid
        },
        header: {
          'content-type': 'application/json' // 
        },
        success: function (res) {
          if (res.data.pager.current == res.data.pager.next) {
            that.setData({
              [Refresh]: true
            })
          } else {
            that.setData({
              [page]: res.data.pager.next
            })
          }
          that.setData({
            [list]: res.data.task,
            [total]: res.data.pager.data_total
          })
        },
      })
    }
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
    let that = this
    wx.showLoading({
      title: '数据更新中',
    })
    that.setData({
      list_state0_page: 1,
      list_state0_size: 5,
      state0_stopRefresh: false,

      list_state1_page: 1,
      list_state1_size: 5,
      state1_stopRefresh: false,

      list_state2_page: 1,
      list_state2_size: 5,
      state2_stopRefresh: false,

      list_state3_page: 1,
      list_state3_size: 5,
      state3_stopRefresh: false,

      list_state4_page: 1,
      list_state5_size: 5,
      state3_stopRefresh: false,
    })
    that.geListInit() // 更新列表
    setTimeout(function () {
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }, 1200)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    // 上拉刷新
    var that = this  
    let aindex = that.data.activeIndex
    let activeIndex = ''
    switch (aindex) {
      case '0':
        activeIndex = '4';
        break;
      case '1':
        activeIndex = '1';
        break;
      case '2':
        activeIndex = '2';
        break;
      case '3':
        activeIndex = '3';
        break;
      case '4':
        activeIndex = '0';
        break;
      default:
       break;
    }

    let list = 'list_state' + activeIndex
    let Refresh = 'state' + activeIndex + '_stopRefresh'
    let page = 'list_state' + activeIndex +'_page'

    let listdata = activeIndex == 0 ? that.data.list_state0 : activeIndex == 1 ? that.data.list_state1 : activeIndex == 2 ? that.data.list_state2 : that.data.list_state3
    let listpage = activeIndex == 0 ? that.data.list_state0_page : activeIndex == 1 ? that.data.list_state1_page : activeIndex == 2 ? that.data.list_state2_page : that.data.list_state3_page
    let listpsize = activeIndex == 0 ? that.data.list_state0_size : activeIndex == 1 ? that.data.list_state1_size : activeIndex == 2 ? that.data.list_state2_size : that.data.list_state3_size
    let stopRefresh = activeIndex == 0 ? that.data.state0_stopRefresh : activeIndex == 1 ? that.data.state1_stopRefresh : activeIndex == 2 ? that.data.state2_stopRefresh : that.data.state3_stopRefresh
 
    if (stopRefresh){
      wx.showToast({
        title: '暂无更多数据',
        icon: 'none',
        duration:1000
      })
      return false;
    }else{
      let url = '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-task/mylist&state=' + activeIndex
      let list = 'list_state' + activeIndex
      // console.log(list)
      wx.request({
        url: app.siteInfo.siteroot + url,
        method: 'get',
        data: {
          page: listpage,
          psize: listpsize
        },
        header: {
          'content-type': 'application/json' // 
        },
        success: function (res) {
          console.log(res.data.task)
          // console.log()
          that.setData({
            [list]: listdata.concat(res.data.task),
          })
          if (res.data.pager.current == res.data.pager.next){
            that.setData({
              [Refresh]: true
            })
          }else{
            wx.showToast({
              title: '更新' + res.data.task.length+'条数据',
              icon: 'none',
              duration: 1000
            })
            that.setData({
              [page]: res.data.pager.next
            })
          }


        },
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /**
  * 跳转
  */
  navigatetopage: function (e) {
    let casewhy = e.currentTarget.dataset.case
    let  id     = e.currentTarget.dataset.id
    let url = ''
    if (!casewhy){
      url = e.currentTarget.dataset.url + '?id=' + id
    }else{
      url = e.currentTarget.dataset.url + '?case=' + casewhy
    }
    // let url = e.currentTarget.dataset.url 
    wx.navigateTo({
      url: url,
    })
  }
})