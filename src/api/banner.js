import request from '@/utils/request'


export function addBanner(data) {
  return request({
    url: '/market/banner/add',
    method: 'post',
    data
  })
}

export function getBannerList(params) {
  return request({
    url: '/market/banner/list',
    method: 'get',
    params
  })
}