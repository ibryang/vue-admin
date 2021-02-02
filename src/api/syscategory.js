import request from '@/utils/request'

// 查询SysCategory列表
export function listSysCategory(query) {
  return request({
    url: '/api/syscategory',
    method: 'get',
    params: query
  })
}

// 查询SysCategory详细
export function getSysCategory(ID) {
  return request({
    url: '/api/syscategory/' + ID,
    method: 'get'
  })
}

// 新增SysCategory
export function addSysCategory(data) {
  return request({
    url: '/api/syscategory',
    method: 'post',
    data: data
  })
}

// 修改SysCategory
export function updateSysCategory(data) {
  return request({
    url: '/api/syscategory/' + data.ID,
    method: 'put',
    data: data
  })
}

// 删除SysCategory
export function delSysCategory(data) {
  return request({
    url: '/api/syscategory/',
    method: 'delete',
    data: data
  })
}

