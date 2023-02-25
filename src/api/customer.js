import request from '@/utils/request'

export function customerlist(params) {
  return request({
    // url: '/vue-admin-template/user/login',
    url: '/user/list',
    method: 'get',
    params
  })
}

export function customerAssetlist(params) {
  return request({
    // url: '/vue-admin-template/user/login',
    url: '/user/asset/list',
    method: 'get',
    params
  })
}

export function customerAssetFlowlist(params) {
  return request({
    // url: '/vue-admin-template/user/login',
    url: '/user/asset/flow',
    method: 'get',
    params
  })
}


