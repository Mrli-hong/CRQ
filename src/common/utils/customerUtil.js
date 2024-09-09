'use strict'
/**
 * 客户管理工具方法
 */

export default {
  /**
   * 将Date转换成20200303格式
   * @param {*} date
   */
  formatDate(date) {
    if (Object.prototype.toString.call(date) == '[object Date]' && date) {
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      let day = date.getDate()
      if (day < 10) {
        day = '0' + day
      }
      return year + '' + month + '' + day
    } else if (date) {
      return date.replace(/-/g, '')
    } else {
      return date
    }
  },
  /**
   * 验证是否存在重复元素
   * @param {数组} arr
   */
  isRepeat(arr) {
    if (arr && arr.length > 0) {
      let hash = {}
      for (let i in arr) {
        if (hash[arr[i]]) {
          return true
        }
        hash[arr[i]] = true
      }
      return false
    } else {
      return false
    }
  },
  /**
   *将'YYYYMMDDhhmmss'形式的字符串解析成Date
   * @param {String} timeStr 数字形式的字符串
   * @return {Date} Date对象
   */
  formatDateByStr(timeStr) {
    timeStr = timeStr + ''
    if (!timeStr || timeStr == '0') {
      return ''
    }
    const year = timeStr.substr(0, 4)
    const month = timeStr.substr(4, 2)
    const day = timeStr.substr(6, 2)
    if (timeStr.length > 8) {
      const hour = timeStr.substr(8, 2)
      const minute = timeStr.substr(10, 2)
      const second = timeStr.substr(12, 2)
      // 2020-03-27T10:30:00
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
      // return Date.parse(template);
    } else {
      return `${year}-${month}-${day}`
      // return Date.parse(template);
    }
  },
}
