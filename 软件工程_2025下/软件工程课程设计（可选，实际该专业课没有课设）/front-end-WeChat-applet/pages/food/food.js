// pages/food/food.js (最终筛选版本)

Page({
  data: {
    shopBase: {
      shopicon: "../../images/shopicon.png",
      shopAddIcon: "../../images/add-icon.png",
      shopMinuteIcon: "../../images/minute.png"
    },
    goods: [], // 只用来存放【当前要显示的】菜品
    goodsBackup: [], // 用来备份从服务器获取的【所有】菜品
    cutab: 0, // 当前选中的左侧菜单索引
    totalPrice: 0,
    totalCount: 0,
    carArray: [],
    shopid: 0
  },

  // 左侧菜单点击事件
  selectMenu: function (e) {
    var index = e.currentTarget.dataset.itemIndex;
    var selectedCategoryData = this.data.goodsBackup[index];

    this.setData({
      goods: [selectedCategoryData], // 只显示选中的这一个分类
      cutab: index
    });
  },

  // 页面加载
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://127.0.0.1:8000/api/seproject/getDishInfo',
      data: {
        store_id: options.shopid
      },
      header: {
        'cookie': wx.getStorageSync('Set-Cookie')
      },
      success: function (res) {
        if (res.data && res.data.goods && res.data.goods.length > 0) {
          let goodsData = res.data.goods;
          // 初始化购物车数量
          goodsData.forEach(category => {
            category.foods.forEach(food => {
              food.Count = 0;
            });
          });

          // (核心修改！)
          that.setData({
            goods: [goodsData[0]], // (关键!) 初始加载时，只显示第一个分类
            goodsBackup: goodsData, // (关键!) 把所有数据备份起来
            shopid: options.shopid
          });
        }
      }
    });
  },
  
  // ---- 购物车和价格计算等函数 ----
  // (已修正，确保在筛选状态下也能正常工作)
  
  addCart(e) {
    const foodId = e.currentTarget.dataset.id;
    const goodsBackup = this.data.goodsBackup;
    let currentCarArray = this.data.carArray;
    let targetFood = null;
    let mark = '';

    for (let i = 0; i < goodsBackup.length; i++) {
      for (let j = 0; j < goodsBackup[i].foods.length; j++) {
        if (goodsBackup[i].foods[j].id === foodId) {
          targetFood = goodsBackup[i].foods[j];
          if (targetFood.Count >= 99) {
            wx.showModal({ title: '提示', content: '亲，最多选购99件哦！' });
            return;
          }
          targetFood.Count++;
          mark = 'a' + j + 'b' + i;
          break;
        }
      }
      if (targetFood) break;
    }

    if (!targetFood) return;

    const obj = { price: targetFood.price, num: targetFood.Count, mark: mark, icon: targetFood.icon, selected: true, shopname: targetFood.name, shaopdesc: targetFood.description, id: targetFood.id };
    currentCarArray = currentCarArray.filter(item => item.mark !== mark);
    currentCarArray.push(obj);

    this.setData({
      goodsBackup: goodsBackup, // 更新备份数据
      goods: [goodsBackup[this.data.cutab]], // 刷新当前显示的分类
      carArray: currentCarArray
    });
    this.calTotalPrice();
  },

  minueCart(e) {
    const foodId = e.currentTarget.dataset.id;
    const goodsBackup = this.data.goodsBackup;
    let currentCarArray = this.data.carArray;
    let targetFood = null;
    let mark = '';

    for (let i = 0; i < goodsBackup.length; i++) {
      for (let j = 0; j < goodsBackup[i].foods.length; j++) {
        if (goodsBackup[i].foods[j].id === foodId) {
          targetFood = goodsBackup[i].foods[j];
          if (targetFood.Count > 0) {
            targetFood.Count--;
          }
          mark = 'a' + j + 'b' + i;
          break;
        }
      }
      if (targetFood) break;
    }

    if (!targetFood) return;

    const obj = { price: targetFood.price, num: targetFood.Count, mark: mark, icon: targetFood.icon, selected: true, shopname: targetFood.name, shaopdesc: targetFood.description, id: targetFood.id };
    currentCarArray = currentCarArray.filter(item => item.mark !== mark);
    if (targetFood.Count > 0) {
      currentCarArray.push(obj);
    }
    
    this.setData({
      goodsBackup: goodsBackup,
      goods: [goodsBackup[this.data.cutab]],
      carArray: currentCarArray
    });
    this.calTotalPrice();
  },

  calTotalPrice: function () {
    const carArray = this.data.carArray;
    let totalPrice = 0;
    let totalCount = 0;
    for (let i = 0; i < carArray.length; i++) {
      totalPrice += carArray[i].price * carArray[i].num;
      totalCount += carArray[i].num
    }
    this.setData({
      totalPrice: totalPrice.toFixed(2),
      totalCount: totalCount,
    });
  },

  getOpenShop() {
    if (this.data.totalCount <= 0) {
      wx.showToast({ title: '请先选择商品', icon: 'none' });
      return;
    }
    const countArray = JSON.stringify(this.data.carArray);
    const shopid = JSON.stringify(this.data.shopid);
    wx.setStorageSync("countArray", countArray);
    wx.setStorageSync('shopid', shopid);
    wx.navigateTo({
      url: '../order/order',
    });
  },
});