import request from '@/utils/request'


export function addAccount(data) {
  return request({
    url: '/account/create',
    method: 'post',
    data
  })
}

export function getAccountList(params) {
  return request({
    url: '/account/list',
    method: 'get',
    params
  })
}

export function getRoleList(params) {
  return request({
    url: '/account/role/list',
    method: 'get',
    params
  })
}
