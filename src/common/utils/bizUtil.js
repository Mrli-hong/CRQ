/**
   * 将Date转换成20200303格式
   * @param {*} date
   */
export function formatDate(date) {
  if (Object.prototype.toString.call(date) == '[object Date]' && date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    return String(String(year) + month) + day;
  } else if (date) {
    return date.replace(/-/g, '');
  } else {
    return date;
  }
}

/**
 * 乘法函数
 * @param {*} num1
 * @param {*} num2
 * @returns
 */
export function accMulti(num1, num2) {
  let m = 0, s1 = num1.toString(), s2 = num2.toString();
  try { m += s1.split('.')[1].length; } catch (e) { };
  try { m += s2.split('.')[1].length; } catch (e) { };
  const num = Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
  return deleteSurplusZero(num);
}

export function deleteSurplusZero(value) {
  if (!value && value !== 0) {
    return '';
  }
  value = value.toString();
  const regexp = /(?:\.0*|(\.\d+?)0+)$/;
  return String(value.replace(regexp, '$1'));
}

/**
 * 20200101 => 2020-01-01
 * @param {*} p
 */
export function numberToDateStr(p) {
  const num = String(p);
  return num.substr(0, 4) + '-' + num.substr(4, 2) + '-' + num.substr(6, 2);
}

/**
 * 2020-01-01  =>  Date
 * @param {String} dateStr
 */
export function strToDate(dateStr) {
  // 转换日期
  const dateArr = dateStr.split('-');
  const year = parseInt(dateArr[0]);
  let month;
  // 处理月份为04这样的情况
  if (dateArr[1].indexOf('0') == 0) {
    month = parseInt(dateArr[1].substring(1));
  } else {
    month = parseInt(dateArr[1]);
  }
  const day = parseInt(dateArr[2]);
  const date = new Date(year, month - 1, day);
  return date;
}

/**
 * 两个数相加 */
export function accAdd(arg1, arg2) {
  let r1, r2, m;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return deleteSurplusZero((arg1 * m + arg2 * m) / m);
}

/**
 * 除法
 * @param {*} num1
 * @param {*} num2
 * @returns
 */
export function accDiv(num1, num2) {
  let t1, t2, r1, r2;
  try {
    t1 = num1.toString().split('.')[1].length;
  } catch (e) {
    t1 = 0;
  }
  try {
    t2 = num2.toString().split('.')[1].length;
  } catch (e) {
    t2 = 0;
  }
  r1 = Number(num1.toString().replace('.', ''));
  r2 = Number(num2.toString().replace('.', ''));
  if (t2 - t1 < 0) {
    return deleteSurplusZero(r1 / (r2 / Math.pow(10, t2 - t1)));
  } else {
    return deleteSurplusZero((r1 / r2) * Math.pow(10, t2 - t1));
  }
}

/**
 * 验证是否存在重复元素
 * @param {数组} arr
 */
export function isRepeat(arr) {
  if (arr && arr.length > 0) {
    const hash = {};
    for (const i in arr) {
      if (hash[arr[i]]) {
        return true;
      }
      hash[arr[i]] = true;
    }
    return false;
  } else {
    return false;
  }
}

/**
 * 数组去重
 * @param {*} arr
 */
export function arrUnique(arr) {
  const x = new Set(arr);
  return [...x];
}

/**
 * list是否为空
 * @param {} list
 */
export function listEmpty(list) {
  if (Object.prototype.toString.call(list) != '[object Array]') {
    throw '不是数组';
  }

  if (list && list.length > 0) {
    return false;
  }
  return true;
}
