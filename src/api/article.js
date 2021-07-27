//
import request from '@/utils/request'

// 请求获取文章数据
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
    // 请求失败
    // data: params

  })
}
