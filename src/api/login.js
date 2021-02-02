import request from '@/utils/request'

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/api/getCaptcha',
    method: 'get'
  })
}

// 查询
export function getSetting() {
  return request({
    url: '/api/setting',
    method: 'get'
  })
}

// 修改
export function updateSetting(data) {
  return request({
    url: '/api/setting',
    method: 'post',
    data: data
  })
}
