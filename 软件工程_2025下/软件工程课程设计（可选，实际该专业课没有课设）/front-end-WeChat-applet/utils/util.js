// utils/util.js

// ✅ 后端服务器地址（FastAPI）
const BASE_URL = "http://127.0.0.1:8000"
//http://10.97.105.30:8000
//http://127.0.0.1:8000
// 时间格式化函数（保留原来的）
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// ✅ 封装请求函数（自动拼接 BASE_URL）
function request(options) {
  wx.request({
    url: BASE_URL + options.url,
    method: options.method || "GET",
    data: options.data || {},
    header: options.header || {
      "Content-Type": "application/json"
    },
    success(res) {
      if (typeof options.success === "function") {
        options.success(res)
      }
    },
    fail(err) {
      console.error("请求失败:", err)
      if (typeof options.fail === "function") {
        options.fail(err)
      }
    }
  })
}

// ✅ 导出模块
module.exports = {
  formatTime,
  request,
  BASE_URL
}
