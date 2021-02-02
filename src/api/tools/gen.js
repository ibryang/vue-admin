import request from '@/utils/request'

// 查询生成表数据
export function listTable(query) {
  return request({
    url: '/api/sys/tables/page',
    method: 'get',
    params: query
  })
}
// 查询db数据库列表
export function listDbTable(query) {
  return request({
    url: '/api/db/tables/page',
    method: 'get',
    params: query
  })
}

// 查询表详细信息
export function getGenTable(tableId) {
  return request({
    url: '/api/sys/tables/info/' + tableId,
    method: 'get'
  })
}

export function getGenTableInfo(tablename) {
  return request({
    url: '/api/sys/tables?tableName=' + tablename,
    method: 'get'
  })
}

// 修改代码生成信息
export function updateGenTable(data) {
  return request({
    url: '/api/sys/tables/info',
    method: 'put',
    data: data
  })
}

// 导入表
export function importTable(data) {
  return request({
    url: '/api/sys/tables/info',
    method: 'post',
    params: data
  })
}
// 预览生成代码
export function previewTable(tableId) {
  return request({
    url: '/api/gen/preview/' + tableId,
    method: 'get'
  })
}
// 删除表数据
export function delTable(tableId) {
  return request({
    url: '/api/sys/tables/info/' + tableId,
    method: 'delete'
  })
}

// 生成代码到项目
export function toProjectTable(tableId) {
  return request({
    url: '/api/gen/toproject/' + tableId,
    method: 'get'
  })
}

export function toProjectTableCheckRole(tableId, ischeckrole) {
  return request({
    url: '/api/gen/toproject/' + tableId + '?ischeckrole=' + ischeckrole,
    method: 'get'
  })
}

// 生成菜单到数据库
export function toDBTable(tableId) {
  return request({
    url: '/api/gen/todb/' + tableId,
    method: 'get'
  })
}

export function getTableTree() {
  return request({
    url: '/api/gen/tabletree',
    method: 'get'
  })
}
