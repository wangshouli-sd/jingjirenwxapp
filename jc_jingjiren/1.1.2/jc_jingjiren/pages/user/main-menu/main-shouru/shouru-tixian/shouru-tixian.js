// pages/user/main-menu/main-shouru/shouru-tixian/shouru-tixian.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlData: app.globalData.baseUrlData,
    openid: app.globalData.openid,

    tixiantype: [
      {
        icon: "../../../../../images/pic/weixin.png",
        name: "weixin",
        title: "微信钱包",
        checked: false,
        value:0,
        isopen: "0"
      },
      {
        icon: "../../../../../images/pic/zhifubao.png",
        name: "zhifubao",
        title: "支付宝",
        checked: false,
        value: 1,
        isopen: "0"
      },
      {
        icon: "../../../../../images/pic/yinhangka.png",
        name: "yinhangka",
        title: "银行卡",
        checked: false,
        value: 2,
        isopen: "0"
      }],
      tixiantypeActive: '',
      txValue:'',
      txValue_total:'',

      txtypeArray: [],
      txtypeindex: 0,

      txinfo: {},
      istixian: false // 是否有提现中的数据 

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 获取佣金余额
      app.util.request({
        'url': 'entry/wxapp/index',
        'data': {
          m: 'jc_jingjiren',
          r: 'fr-wallert',
          openid: app.globalData.openid,
        },
      success: function (res) {
        console.log(res.data)
        that.setData({
          txValue_total: res.data.yu_money
        })
      }
    })  
    // 获取提现方式
    wx.request({
      url: app.siteInfo.siteroot + '?i='+ app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-getmoney/info',
      method: 'get',
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        console.log(res.data)
        let wechat = "tixiantype[0].isopen"
        let alipay = "tixiantype[1].isopen"
        let bank = "tixiantype[2].isopen"
        that.setData({
          [wechat]: res.data.wechat,
          [alipay]: res.data.zhifubao,
          [bank]: res.data.bank,
          txtypeArray: res.data.bankname,
          txinfo: res.data.info
        })
        let banklist = res.data.bankname
        if (res.data.info != null && res.data.info.bank){
          for (var i = 0; i < banklist.length; i++) {
            if (banklist[i].bank_name == res.data.info.bank) {
              that.setData({
                txtypeindex: i
              })
            }
          }
        }
      }
    })
    // 判断是否有提现中的数据
    wx.request({
      url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-getmoney/state',
      method: 'get',
      data: {
        openid: app.globalData.openid,
      },
      header: {
        'content-type': 'application/json' // 
      },
      success: function (res) {
        console.log(res.data)
        if (res.data != "0") {
          that.setData({
            istixian: true
          })
          wx.showModal({
            title: '提示',
            content: '当前有提现未完成的数据,暂不能提现',
            showCancel: false,
            success: function () {
              
            }
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
   /**
 * 
 */
  maketxValueChange: function (e) {
    this.setData({
      txValue: e.detail.value
    })
  },
  truenameChange: function (e) {
    let truename = 'txinfo.truename'
    this.setData({
      [truename]: e.detail.value
    })
  },
  alipayChange: function (e) {
    let code = 'txinfo.alipay'
    this.setData({
      [code]: e.detail.value
    })
  },
  bankChange: function (e) {
    let code = 'txinfo.bank_card'
    this.setData({
      [code]: e.detail.value
    })
  },
  settxValue:function (e) {
    let txValue_total = this.data.txValue_total
    this.setData({
      txValue : txValue_total
    })
  },
  /**
 * 选择提现类型
 */
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    let index = e.detail.value
    var tixiantype = this.data.tixiantype;
    // tixiantype[index].checked = !tixiantype[index].checked
    for (var i = 0, len = tixiantype.length; i < len; ++i) {

      tixiantype[i].checked = tixiantype[i].value == e.detail.value;
    }

    this.setData({
      tixiantype: tixiantype,
      tixiantypeActive: e.detail.value
    });
  },
  formSubmit: function (e) {
    console.log(e.detail.formId);
    console.log('formid_tixian');
    let that =this
    let txValue_total = this.data.txValue_total
    let value = this.data.txValue
    let istixian = that.data.istixian
    if (istixian) {
      wx.showModal({
        title: '提示',
        content: '当前有提现未完成的数据,暂不能提现',
        showCancel: false,
        success: function () {
        }
      })
      return false
    }
    if (value == ''||value == null){
      wx.showToast({
        title: '提现金额不能为空',
        icon: 'none'
      })
    }else if (isNaN(value)){
      wx.showToast({
        title: '请输入正确的数值',
        icon: 'none'
      })
    }else if (parseFloat(value) > parseFloat(txValue_total)){
      wx.showToast({
        title: '本次最多可取现' + txValue_total+'元',
        icon: 'none'
      })
    }else{
      console.log(value)
      let typeActive = that.data.tixiantypeActive
      if (typeActive == '' || typeActive== null){
        wx.showToast({
          title: '请选择提现方式',
          icon: 'none'
        })
        return
      }
      let pamars = {}
      pamars.openid = app.globalData.openid,
      pamars.formid = e.detail.formId,
      pamars.money = value
      pamars.type = typeActive == 0 ? '3' : typeActive == 1 ? '1' : '2'// 支付宝 1 银行卡 2 微信 3
      pamars.truename = that.data.txinfo.truename
      pamars.alipay = that.data.txinfo.alipay
      pamars.bank = that.data.txinfo.bank_name
      pamars.bank_card = that.data.txinfo.bank_card
      console.log(pamars)
      wx.showModal({
        title: '提示',
        content: '是否确认提交提现申请？',
        success: function (res) {
          if (res.confirm) {
            // 提交
            wx.request({
              url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid+'&c=entry&a=wxapp&do=index&m=jc_jingjiren&r=fr-getmoney',
              method: 'post',
              data: pamars,
              header: {
                'content-type': 'application/json' // 
              },
              success: function (res) {
                // console.log(res.data)
                // wx.navigateTo({
                //   url: "../shouru-addcard/shouru-addcard",
                // })
                wx.showModal({
                  title: '提示',
                  content: '提现申请已提交,点击确认返回',
                  showCancel: false,
                  success: function(){
                    // wx.redirectTo({
                    //   url: '../shouru-ketixian/shouru-ketixian',
                    // })
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
               
              }
            })  
            
          } else if (res.cancel) {
            
          }
        }
      })
      
    }
  },
  /**
  * 选择支持银行
  */
  bindTxtypeChange: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let bank = 'txinfo.bank'
    this.setData({
      txtypeindex: e.detail.value,
      [bank]: that.data.txtypeArray[e.detail.value].bank_name
    })
  },
  /**
  * 跳转
  */
  navigatetopage: function (e) {

    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  }
})
