// pages/start/start.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    angle: 0,
    status: false, //是否通过审核
    remind: '加载中',
    checkUser: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let uid = wx.getStorageSync('uid');
    if(uid == ''){
      uid = app.globalData.uid
      setTimeout(function () {
        that.setData({
          remind: ''
        });
      }, 1500);
    }else{
      wx.request({
        url: app.globalData.url + '/routine/auth_api/get_user_info',
        method: 'get',
        dataType: 'json',
        data: {
          uid: uid,
        },
        success: function (res) {
          console.log(res)
          that.setData({
            userInfo: res.data.data,
            remind: ''
          });
          app.globalData.uid = res.data.data.uid;
          console.log(app.globalData.uid)
        }
      })
    }
    
    this.setData({
      uid:uid
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
    var that = this;
  },

  //获取用户信息并授权
  bindgetuserinfo:function(e){
    // wx.showLoading({
    //   title: '授权中',
    // })
    var that = this;
    wx.getUserInfo({
      lang: 'zh_CN',
      success: function (res) {
        var userInfo = res.userInfo
        wx.login({
          success: function (res) {
            if (res.code) {
              userInfo.code = res.code;
              userInfo.spid = app.globalData.spid;
              wx.request({
                url: app.globalData.url + '/routine/login/index',
                method: 'post',
                dataType: 'json',
                data: {
                  info: userInfo
                },
                success: function (res) {
                  wx.hideLoading();
                  console.log(res)
                  wx.setStorageSync('uid', res.data.data.uid);
                  app.globalData.uid = res.data.data.uid;
                  app.globalData.openid = res.data.data.routine_openid;
                  that.setData({
                    userInfo:res.data.data
                  });
                }
              })
            }else{
              console.log('登录失败！' + res.errMsg)
              wx.hideLoading();
            }
          }
        });
      }
    })
  },

  goSign:function(){
    var that = this;
    wx.showLoading({
      title: '正在加载',
    });
    var uid = app.globalData.uid;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_setting_value',
      method: 'get',
      dataType: 'json',
      data: {
        uid: uid,
        key: 'checkUser'
      },
      success: function (res) {
        let checkUser = false;
        if (res.data.data.value == "true"){
          checkUser = true
        }else{
          console.log(222)
        }
          
        if (checkUser) {
          let userInfo = that.data.userInfo;
          console.log(userInfo)
          if (userInfo.status == 2) {
            that.startInit();
          } else if (userInfo.status == 1) {
            wx.navigateTo({
              url: '../status/status',
            })
          } else {
            wx.navigateTo({
              url: '../register/register',
            })
          }
          wx.hideLoading()
        } else {
          console.log(1111)
          that.startInit();
          wx.hideLoading();
        }
      }
    })
  },
  startInit(){
    var category = wx.getStorageSync('category');
    if(category)
      wx.switchTab({
        url: "../index/index"
      })
    else
      wx.redirectTo({
        url: '/pages/category/category',
      })
  },
  goIndex:function(){
    wx.switchTab({
      url: '../index/index'
    })
  }

})