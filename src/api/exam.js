import request from '@/utils/request'


export function addSubject(data) {
  return request({
    url: '/exam/subject/add',
    method: 'post',
    data
  })
}

export function getSubjectList(params) {
  return request({
    url: '/exam/subject/list',
    method: 'get',
    params
  })
}

export function addIndex(data) {
  return request({
    url: '/exam/index/add',
    method: 'post',
    data
  })
}

export function getIndexList(params) {
  return request({
    url: '/exam/index/list',
    method: 'get',
    params
  })
}

export function addCate(data) {
  return request({
    url: '/exam/cate/add',
    method: 'post',
    data
  })
}

export function getCateList(params) {
  return request({
    url: '/exam/cate/list',
    method: 'get',
    params
  })
}