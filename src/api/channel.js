// 频道请求模块
import request from '@/utils/request'

export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
// 添加用户频道
export const addUserChannel = (channel) => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/users/channels',
    data: { channels: [channel] }
  })
}
// 删除用户指定频道
export const deleteUserChannel = (channelId) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`

  })
}
