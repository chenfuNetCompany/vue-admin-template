import request from '@/utils/request'


export function addActivity(data) {
  return request({
    url: '/good/add',
    method: 'post',
    data
  })
}

export function getActivityList(params) {
  return request({
    url: '/good/list',
    method: 'get',
    params
  })
}

export function getActivityCate(params) {
  return request({
    url: '/good/category',
    method: 'get',
    params
  })
}