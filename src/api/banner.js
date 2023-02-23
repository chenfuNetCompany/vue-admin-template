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

export function onlineBanner(data) {
  return request({
    url: '/market/banner/online',
    method: 'post',
    data
  })
}

export function offlineBanner(data) {
  return request({
    url: '/market/banner/offline',
    method: 'post',
    data
  })
}

export function updateBanner(data) {
  return request({
    url: '/market/banner/update',
    method: 'post',
    data
  })
}

export function deleteBanner(data) {
  return request({
    url: '/market/banner/delete',
    method: 'post',
    data
  })
}