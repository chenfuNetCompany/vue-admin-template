import request from '@/utils/request'

export function getCourseList(params) {
  return request({
    url: '/course/list',
    method: 'get',
    params
  })
}