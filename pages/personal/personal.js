var e = [{
  icon: "https://bmob-cdn-24471.bmobcloud.com/2019/07/11/e2c738a74048b4fa801ccf82800a8c8e.png",
  title: "我的成绩",
  msg: "",
  showRight: 1
},{
  icon: "http://picture.eclicks.cn/kaojiazhao/public/wx_xcx/center/icon/icon_center_tj.png",
  title: "分享好友",
  msg: "",
  showRight: 1
}, {
  icon: "http://picture.eclicks.cn/kaojiazhao/public/wx_xcx/center/icon/icon_center_msg.png",
  title: "意见反馈",
  msg: "",
  showRight: 1
}, {
  icon: "http://picture.eclicks.cn/kaojiazhao/public/wx_xcx/center/icon/icon_center_download.png",
  title: "关于我们",
  msg: "",
  showRight: 1
}];
const app = getApp()

Page({
  data: {
    cellList: e,
    userInfo: {},
  },
  onLoad: function (e) {
  },
  onShow: function () {
    // console.log(app.globalData.uid)
    // if(app.globalData.uid == 1){
    //   wx.navigateTo({
    //     url: '../start/start',
    //   })
    // }
    var a = this;
    wx.getUserInfo({
      success: function (t) {
        a.setData({
          userInfo: {
            nickName: t.userInfo.nickName,
            avatarUrl: t.userInfo.avatarUrl || "https://picture.eclicks.cn/kaojiazhao/public/wx_xcx/default/gungun.png"
          }
        })
      }
    });
  },
  go_view: function (e) {
    switch (1 * e.currentTarget.dataset.viewind) {
      case 0:
        if(app.globalData.uid == 1){
          this.showWindows()
        }else{
          wx.navigateTo({
            url: '../grade/grade',
          })
        }        
        break;
      case 1:
        break;
      case 2:
        if(app.globalData.uid == 1){
          this.showWindows()
        }else{
          wx.navigateTo({
            url: '../feedback/feedback',
          })
        }           
        break;
      case 3:
        this.about()
        break;
    }
  },
  about() {
    wx.showModal({
      title: '关于我们',
      content: '题库陆续更新中，敬请关注！',
      showCancel: false
    })
  },
  onShareAppMessage: function () {
    return {
      title: "易答题，考试助手 ！",
      path: "pages/start/start"
    };
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
});