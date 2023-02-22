import request from '@/utils/request'


export function addGood(data) {
  return request({
    url: '/good/add',
    method: 'post',
    data
  })
}

export function updateGood(data) {
  return request({
    url: '/good/update',
    method: 'post',
    data
  })
}

export function getGoodList(params) {
  return request({
    url: '/good/list',
    method: 'get',
    params
  })
}

export function getGoodCate(params) {
  return request({
    url: '/good/category',
    method: 'get',
    params
  })
}

export function getGoodDetail(params) {
  return request({
    url: '/good/detail',
    method: 'get',
    params
  })
}

export function online(data) {
  return request({
    url: '/good/online',
    method: 'post',
    data
  })
}

export function offline(data) {
  return request({
    url: '/good/offline',
    method: 'post',
    data
  })
}

export function recommend(data) {
  return request({
    url: '/good/recommend',
    method: 'post',
    data
  })
}

export function unrecommend(data) {
  return request({
    url: '/good/unrecommend',
    method: 'post',
    data
  })
}