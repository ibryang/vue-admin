import request from '@/utils/request'

export function list(data) {
  return request({
    url: 'api/schedule/list',
    method: 'get',
    params: data
  })
}

export function add(data) {
  return request({
    url: 'api/schedule/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/schedule/update',
    method: 'put',
    data
  })
}

export function getSchedule(id) {
  return request({
    url: 'api/schedule/query',
    method: 'get',
    params: {
      id
    }
  })
}

export function deleteSchedule(data) {
  return request({
    url: 'api/schedule/delete',
    method: 'delete',
    data
  })
}
