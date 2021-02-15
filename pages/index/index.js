//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    questionnum:0,
    afternum:0,
    ctNum:0
  },
  onLoad: function () {
    
  },
  onShow:function(){
    //this.initStorage();
    this.getCt();
  },
  initStorage:function(t){
    var category = wx.getStorageSync('category');
    var orderList = wx.getStorageSync('orderlist' + category.id);
    if(category.count == undefined || category.count == 0){
      wx.redirectTo({
        url: '/pages/category/category',
      });
      return
    }
    this.setData({
      questionnum: category.count,
      cateName: category.name,
      afternum: orderList.all == undefined ? 0 : orderList.all
    })
  },
  getCt:function(){
    var t = this
    var category = wx.getStorageSync('category');
    wx.getStorage({
      key: 'errorids' + category.id,
      success: function (e) {
        console.log(e)
        for (var a = e.data, i = "", o = 0; o < a.length; o++) a[o][Object.keys(a[o]).toString()].toString() && (i += a[o][Object.keys(a[o]).toString()].toString() + ",");
        console.info("asas", i.slice(0, -1).split(",").length), "" != i ? t.setData({
          ctNum: i.slice(0, -1).split(",").length <= 99 ? i.slice(0, -1).split(",").length : 100
        }) : t.setData({
          ctNum: 0
        });
      },
    })
  },
  getUserInfo: function(e) {
    // console.log(e)
    // app.globalData.userInfo = e.detail.userInfo
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   hasUserInfo: true
    // })
    var that = this;
    wx.getUserInfo({
      lang: 'zh_CN',
      success:function (res){
        var userInfo = res.userInfo
        wx.login({
          success:function (res){
            if(res.code){
              userInfo.code = res.code;
              userInfo.spid = app.globalData.spid;
              wx.request({
                url: app.globalData.url + '/routine/login/index',
                method:'post',
                dataType:'json',
                data:{
                  info:userInfo
                },
                success:function(res){
                  console.log(res)
                }
              })
            }
          }
        });
      }
    })
  },
  myQuestion: function () {
    console.log(app.globalData.uid)
    if(app.globalData.uid == 1){
      this.showWindows()
      return
    }
    wx.navigateTo({
      url: "../category/category?isFirst=0"
    });
  },
  orderGo: function (t) {
    console.log(app.globalData.uid)
    if(app.globalData.uid == 1){
      this.showWindows()
      return
    }
    var that = this;
    var uid = app.globalData.uid;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_setting_value',
      method: 'get',
      dataType: 'json',
      data: {
        uid: uid,
        key: 'useLearn'
      },
      success: function (res) {
        if (res.data.data.value == "true"){
          var e = 1;
          t && t.currentTarget.dataset.mode && (e = 2), setTimeout(function () {
            wx.navigateTo({
              url: '/pages/moni/moni?mode=' + e,
            })
          }, 30)
        }else{
          wx.showToast({
            title: '练习模式未开启',
            icon: 'loading'
          })
        }
      }
    })
    
  },
  defaultGo:function(t){
    console.log(app.globalData.uid)
    if(app.globalData.uid == 1){
      this.showWindows()
      return
    }
    var e = this;
    "0" == t.currentTarget.dataset.ind ? (setTimeout(function () {
      wx.navigateTo({
        url: "../errorpage/errorpage?ids=" + JSON.stringify(e.data.orderids),
      })
    }, 30), getApp().sectionList = JSON.stringify(this.data.orderids)) : setTimeout(function () {
        wx.navigateTo({
          url: "../collecpage/collecpage?ids=" + JSON.stringify(e.data.orderids)
        });
    }, 30)
  },
  examGo: function () {
    console.log(app.globalData.uid)
    if(app.globalData.uid == 1){
      this.showWindows()
      return
    }
    setTimeout(function () {
      wx.navigateTo({
        url: '/pages/examhome/examhome',
      })
    }, 30)
  },
  gradeGo: function () {
    setTimeout(function () {
      wx.navigateTo({
        url: "/pages/grade/grade"
      });
    }, 30);
  },
  headerMenu: function () {
    console.log(app.globalData.uid)
    if(app.globalData.uid == 1){
      this.showWindows()
      return
    }
    setTimeout(function () {
      wx.navigateTo({
        url: "/pages/rank/rank"
      });
    }, 30);
  },
  showWindows: function() {
    wx.showModal({
      title: '提示',
      content: '此功能需要授权才能使用，您确定跳转到授权页面么？',
      success (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../start/start',
          })
        } else if (res.cancel) {
          return
        }
      }
    })
  }
})
