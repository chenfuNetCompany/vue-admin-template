import request from '@/utils/request'

export function orderList(params) {
  return request({
    url: '/trade/order/list',
    method: 'get',
    params
  })
}

export function refundList(params) {
  return request({
    url: '/trade/refund/list',
    method: 'get',
    params
  })
}

export function approvalRefund(params) {
  return request({
    url: '/trade/refund/approval',
    method: 'get',
    params
  })
}

export function refuseRefund(params) {
  return request({
    url: '/trade/refund/refuse',
    method: 'get',
    params
  })
}

export function doRefund(params) {
  return request({
    url: '/trade/refund/do',
    method: 'get',
    params
  })
}


