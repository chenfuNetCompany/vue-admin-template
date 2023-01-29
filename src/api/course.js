import request from '@/utils/request'


export function addCourse(data) {
  return request({
    url: '/good/add',
    method: 'post',
    data
  })
}

export function getCourseList(params) {
  return request({
    url: '/good/list',
    method: 'get',
    params
  })
}

export function getCourseCate(params) {
  return request({
    url: '/good/category',
    method: 'get',
    params
  })
}