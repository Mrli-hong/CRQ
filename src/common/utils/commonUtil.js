/**
 * 数据库类型对象转驼峰型对象
 * @param obj 数据库类型对象
 * @param item 驼峰类型对象
 * @param type 转换类型（参数存在代表驼峰转成字段）
 * @param transStr 是否将value转换为字符串，默认为true
 * @return
 */
export function covertObj(obj, item, type = false, transStr = true) {
  let newObj = {}
  // eslint-disable-next-line no-unused-vars
  // let isOpenXss = window.LOCAL_CONFIG.isOpenXss + ''
  for (let key in obj) {
    let fieldName = columnName2FieldName(key)
    if (type) {
      fieldName = fieldName2ColumnName(key)
    }

    let val = (obj[key] !== undefined && obj[key] !== null) ? obj[key] : ''
    if (!transStr && val !== null && typeof val === 'object') {
      if (Array.isArray(val)) {
        val = val.map(v => {
          if (typeof v !== 'object') return v
          let tempObj = {}
          covertObj(v, tempObj, type, transStr)
          return tempObj
        })
      } else {
        let tempObj = {}
        covertObj(val, tempObj, type, transStr)
        val = tempObj
      }
    }
    // eval("newObj."+fieldName+"='"+val+"'")
    // 由于输入'会导致eval失败，转为代码直接赋值
    // if (isOpenXss !== 'false' && (transStr || typeof val === 'string')) {
    //   if (key != 'content') {
    //     val = covertHtml(val)
    //   }
    // }
    newObj[fieldName] = transStr ? val + '' : val
  }
  Object.assign(item, newObj)
}

/**
 * 数据库列名转属性(下划线转驼峰)
 * @param columnName 数据库列名
 * @return
 */
export function columnName2FieldName(columnName) {
  let result = ''
  let upCaseFlag = false
  if (!columnName || columnName === '') return columnName
  for (let i = 0; i < columnName.length; i++) {
    let ch = columnName[i]
    if (ch === '_') {
      upCaseFlag = true
    } else if (upCaseFlag) {
      result += ('' + ch).toUpperCase()
      upCaseFlag = false
    } else {
      result += ch
      upCaseFlag = false
    }
  }
  return result
}

/**
 * 属性转数据库列名(驼峰传下划线)
 * @param str 属性名
 * @return
 */
export function fieldName2ColumnName(columnName) {
  let result = ''
  // eslint-disable-next-line no-unused-vars
  if (!columnName || columnName === '') return columnName
  for (let i = 0; i < columnName.length; i++) {
    const ch = columnName[i]
    if (allCaps(ch)) {
      result += ('_' + ch).toLowerCase()
    } else {
      result += ch
    }
  }
  return result
}
