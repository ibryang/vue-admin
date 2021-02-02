import request from '@/utils/request'
import { data } from 'autoprefixer'

export const sysfiledirList = data => request({
  url: '/api/sysfiledir',
  method: 'GET',
  data
})

export const sysfiledirAcionAdd = data => request({
  url: '/api/sysfiledir',
  method: 'POST',
  data
})

export const sysfiledirAcionEdit = data => request({
  url: '/api/sysfiledir/' + data.ID,
  method: 'PUT',
  data
})

export const sysfiledirAcionDel = data => request({
  url: '/api/sysfiledir/' + data,
  method: 'DELETE'
})

export const sysfileinfoList = data => request({
  url: `/api/sysfileinfo?pId=${data.pId}&page_size=${data.page_size}&page=${data.page}`,
  method: 'GET',
  data
})

export const sysfileinfo = id => request({
  url: '/api/sysfileinfo/' + id,
  method: 'GET'
})

export const sysfileinfoAdd = data => request({
  url: '/api/sysfileinfo',
  method: 'POST',
  data
})

export const sysfileinfoEdit = data => request({
  url: '/api/sysfileinfo/' + data.ID,
  method: 'put',
  data
})

export const sysfileinfoDelete = id => request({
  url: '/api/sysfileinfo/' + id,
  method: 'DELETE',
  data
})
