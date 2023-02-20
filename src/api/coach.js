import request from '@/utils/request'


export function addCoach(data) {
  return request({
    url: '/coach/add',
    method: 'post',
    data
  })
}

export function updateCoach(data) {
  return request({
    url: '/coach/update',
    method: 'post',
    data
  })
}

export function deleteCoach(data) {
  return request({
    url: '/coach/delete',
    method: 'post',
    data
  })
}

export function getCoachList(params) {
  return request({
    url: '/coach/list',
    method: 'get',
    params
  })
}

export function getCoachAccountList(params) {
  return request({
    url: '/coach/list/account',
    method: 'get',
    params
  })
}