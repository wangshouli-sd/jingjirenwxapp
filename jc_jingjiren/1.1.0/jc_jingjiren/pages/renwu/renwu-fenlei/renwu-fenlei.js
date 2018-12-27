var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.siteInfo.siteroot,
    // tab参数
    tabs: ["热门任务", "最新任务"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    // 类别lebal
    catagory: [],
    classification: [],
    classifiactive: -1,
    // 列表上拉刷新相关
    renwuList: [],
    psize: 4,
    next: 1,
    stopRefresh: false,
    nomoredata: false,
    // 搜索内容
    searchvalue: '',
    searchid: '',
    searchmethod: '' // 搜索方式  类class 值 value
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    //获取类别列表
    that.getCategory()
    console.log(options)
    let cateid = options.cateid
    let name = options.name 
    // 初始化列表数据  有url 为查询  无为展示全部
    if(cateid != ''){
      that.setData({
        searchid: cateid,
        searchmethod: 'class'
      })
      that.makeSearch()
    }else{
      let rwtype = that.data.activeIndex == 1 ? '1' : '2'
      let url = app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-project&type=' + rwtype
      wx.request({
        url: url,
        method: 'get',
        data: {
          page: that.data.next,
          psize: that.data.psize
        },
        header: {
          'content-type': 'application/json' // 
        },
        success: function (res) {
          console.log(res.data)
          let current = res.data.pager.current
          let next = res.data.pager.next
          if (current == next) {
            that.setData({
              nomoredata: true,
              stopRefresh: true
            })
          }
          that.setData({
            next: res.data.pager.next,
            renwuList: res.data.list
          })
        },
      })
    }
  },
  //获取类别
  getCategory: function () {
    let that = this
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-category',
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        let catagory = res.data.length > 6 ? res.data.slice(0, 6):res.data
        let catagoryArr = []
        for (var i = 0; i < catagory.length;i++ ){
          catagoryArr.push(catagory[i].title)
          if (catagory[i].id === that.data.searchid){
            that.setData({
              classifiactive: i
            })
          }
        }
        that.setData({
          classification: catagoryArr,
          catagory: res.data
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
    let list = that.data.renwuList
    let stopRefresh = that.data.stopRefresh
    let rwtype = that.data.activeIndex == 1 ? '1' : '2'
    let url = app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-project&type=' + rwtype
    console.log("触底")
    if (stopRefresh) {

      return wx.showToast({
        title: '暂无更多数据',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.request({
        url: url,
        method: 'get',
        data: {
          psize: that.data.psize,
          page: that.data.next
        },
        header: {
          'content-type': 'application/json' // 
        },
        success: function (res) {
          console.log(res.data)
          let current = res.data.pager.current
          let next = res.data.pager.next
          if (current == next) {
            that.setData({
              nomoredata: true,
              stopRefresh: true
            })
          }
          that.setData({
            renwuList: list.concat(res.data.list),
            next: res.data.pager.next,
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
    return {
      path: '/pages/renwu/renwu-fenlei/renwu-fenlei?scene=' + app.globalData.onlyid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /**
  * tab切换
  */
  tabClick: function (e) {
    var that = this
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      classifiactive: -1
    });

    let rwtype = that.data.activeIndex == 1 ? '1' : '2'
    let url = app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-project&type=' + rwtype
    // 初始化列表数据
    wx.request({
      url: url,
      method: 'get',
      data: {
        page: 1,
        psize: that.data.psize
      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        console.log(res.data)
        let current = res.data.pager.current
        let next = res.data.pager.next
        
        that.setData({
          next: res.data.pager.next,
          renwuList: res.data.list,
        })
        if (current == next) {
          that.setData({
            nomoredata: true,
            stopRefresh: true
          })
        }else{
          that.setData({
            nomoredata: false,
            stopRefresh: false,
            
          })
        }
      },
    })

  },

  /**
   *跳转详情页 
   **/
  navigateToDetail: function (e) {
    let url = e.currentTarget.dataset.url + '?id=' + e.currentTarget.dataset.id
    wx.navigateTo({
      url: url,
    })
  },
   /**
  * 输入框搜索
  */
  makesearchinfo: function (e) {
    var that = this
    let searchvalue = e.detail.value
    that.setData({
      searchmethod: 'value',
      searchvalue: searchvalue,
      classifiactive: -1
    })
    this.makeSearch(e)
  },
  /* 
    点击lebal搜索
  */ 
  makeSearchClass: function (e) {
    console.log(e.currentTarget.dataset.index)
    let value = e.currentTarget.dataset.value
    let index = e.currentTarget.dataset.index
    let searchid = e.currentTarget.dataset.id
    this.setData({
      classifiactive: index,
      searchid: searchid,
      searchmethod: 'class',
    })
    this.makeSearch(e)
  },
  makeSearch: function (e) {
    var that = this
    let url = app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-project&psize=12'
    let searchmethod = that.data.searchmethod
    let parmas = {}
    if (searchmethod == 'class'){
      parmas.cate = that.data.searchid  // 按分类id搜索
    }else{
      parmas.name = that.data.searchvalue // 按输入框值搜索
    }
    wx.request({
      url: url,
      method: 'get',
      data: parmas,
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        console.log(res.data)
        let current = res.data.pager.current
        let next = res.data.pager.next
        if(res.data.list.length == 0){
          wx.showToast({
            title: '暂无对应数据',
            icon: 'none',
            duration: 1000
          })
        } 
        that.setData({
          next: res.data.pager.next,
          renwuList: res.data.list,
        })
        if (current == next) {
          that.setData({
            nomoredata: true,
            stopRefresh: true
          })
        } else {
          that.setData({
            nomoredata: false,
            stopRefresh: false,

          })
        }
      },
    })
  }
})