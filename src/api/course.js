import request from '@/utils/request'


export function addCourse(data) {
  return request({
    url: '/course/add',
    method: 'post',
    data
  })
}

export function getCourseList(params) {
  return request({
    url: '/course/list',
    method: 'get',
    params
  })
}

export function getCourseCate() {
  return request({
    url: '/course/category',
    method: 'get'
  })
}