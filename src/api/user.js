import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function refreshtoken(data) {
  return request({
    url: '/refreshtoken',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/getinfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}

