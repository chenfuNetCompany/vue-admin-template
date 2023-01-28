import request from '@/utils/request'

export function promotionlist(params) {
  return request({
    // url: '/vue-admin-template/user/login',
    url: '/promotion/coupon/list',
    method: 'get',
    params
  })
}

export function distCoupon(data) {
  return request({
    url: '/promotion/coupon/dist',
    method: 'post',
    data
  })
}

export function couponMemberList(params) {
  return request({
    url: '/promotion/coupon/member/list',
    method: 'get',
    params
  })
}

export function addCoupon(data) {
  return request({
    url: '/promotion/coupon/add',
    method: 'post',
    data
  })
}


