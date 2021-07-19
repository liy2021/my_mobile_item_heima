/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
// 用request接收创建的请求返回值
const request = axios.create({
  baseURL: 'http://toutiao-app.itheima.net/' // 基础路径
})

export default request
