// pages/home/home.js
const util = require('../../utils/util.js');  // 引入封装的工具

Page({

  data: {
    // 门店数据
    shopid: 0,
    shopList: [],
    nickName: '',
    avatarUrl: ''
  },

  onLoad: function (options) {
    // 1️⃣ 获取本地用户信息（微信头像、昵称）
    const userInfo = wx.getStorageSync("userinfo");
    if (!userInfo) {
      const modelLogo = this.selectComponent("#Models");
      modelLogo && modelLogo.getShow && modelLogo.getShow();
      return;
    }

    this.setData({
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl
    });

    // 2️⃣ 登录逻辑：使用 wx.login 获取 code，再请求后端获取 openid
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: `${util.BASE_URL}/api/seproject/getOpenid?code=${res.code}`,
            method: 'GET',
            success(loginRes) {
              console.log("✅ 登录成功:", loginRes.data);

              // 保存 Cookie（如果后端返回）
              const cookie = loginRes.header ? loginRes.header['set-cookie'] || loginRes.header['Set-Cookie'] : '';
              if (cookie) {
                wx.setStorageSync('set-cookie', cookie);
                console.log("🍪 Cookie 已保存:", cookie);
              }

              // 登录后立即获取门店信息
              wx.request({
                url: `${util.BASE_URL}/api/seproject/getStoreInfo`,
                method: 'GET',
                header: {
                  'cookie': wx.getStorageSync('set-cookie') || ''
                },
                success(res) {
                  console.log("🏪 门店数据:", res.data);
                  if (res.data && res.data.shoplist) {
                    // 更新页面数据
                    wx.setStorageSync('shopList', res.data.shoplist);
                    getCurrentPages()[getCurrentPages().length - 1].setData({
                      shopList: res.data.shoplist
                    });
                  }
                },
                fail(err) {
                  console.error("❌ 获取门店失败:", err);
                }
              });
            },
            fail(err) {
              console.error("❌ 登录接口请求失败:", err);
            }
          });
        } else {
          console.error("❌ wx.login 失败:", res.errMsg);
        }
      }
    });
  },

  /** 点击店铺跳转进入菜单页面 */
  getOpenShop(e) {
    const shopid = e.currentTarget.dataset.item.id;
    this.setData({
      shopid: shopid
    });
    console.log("🛒 当前选择的店铺ID:", shopid);
    wx.navigateTo({
      url: `../food/food?shopid=${shopid}`,
    });
  },

  // 其他生命周期函数（保持默认即可）
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {}
});
