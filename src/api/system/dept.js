import request from '@/utils/request'

export function getDeptList(query) {
  return request({
    url: '/api/deptList',
    method: 'get',
    params: query
  })
}

// 查询部门详细
export function getDept(dept_id) {
  return request({
    url: '/api/dept/' + dept_id,
    method: 'get'
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/api/deptTreeselect',
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/api/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}


// 新增部门
export function addDept(data) {
  return request({
    url: '/api/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/api/dept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(dept_id) {
  return request({
    url: '/api/dept/' + dept_id,
    method: 'delete'
  })
}
