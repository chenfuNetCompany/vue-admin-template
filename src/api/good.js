import request from '@/utils/request'


export function addGood(data) {
  return request({
    url: '/good/add',
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