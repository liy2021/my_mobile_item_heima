// 体积小，因为把功能迁出一部分到插件中，不用不加载。

import Vue from 'vue'

import dayjs from 'dayjs'
// 加载中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'
// 配置处理相对时间的插件
dayjs.extend(relativeTime)
// 配置语言为中文
dayjs.locale('zh-cn') // 全局使用
// dayjs（）获取当前最新时间。
// dayjs.format('yyyy-MM-DD')
// 在 `main.js` 中加载初始化
// import './utils/dayjs'

// 定义一个全局过滤器，可以在任何组件的模板中使用，
// 过滤器相当于一个全局可用的方法（仅供模板使用）
// 参数一：过滤器名称，参数二：过滤器函数
// 使用方式：｛｛表达式 | 过滤器名称｝｝
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})

// 输出内容不同
//     dayjs().from(dayjs('1990-01-01')) // 31 年后
// dayjs().from(dayjs('1990-01-01'), true) // 31 年
// dayjs().fromNow()

// dayjs().to(dayjs('1990-01-01')) // 31 年前
// dayjs().toNow()
