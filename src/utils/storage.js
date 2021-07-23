// 封装本地存储模块
// 获取模块
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  try {
    return JSON.parse(data) // 如果不是JSON格式的数据，这行代码执行就会报错，被catch捕捉。
  } catch (err) {
    return data
  }
}

// 存储模块
export const setItem = (name, value) => {
  // 将数组、对象格式转为JSON字符串。
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

// 删除模块
export const removeItem = name => {
  window.localStorage.removeItem(name)
}
