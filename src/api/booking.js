import request from '@/utils/request'


export function getBookingList(params) {
  return request({
    url: '/booking/list/all',
    method: 'get',
    params
  })
}

export function bookingSystemCourse(data) {
  return request({
    url: '/booking/batchBook',
    method: 'post',
    data
  })
}

export function deleteBookingSystemCourse(data) {
  return request({
    url: '/booking/deleteBook',
    method: 'post',
    data
  })
}

export function updateBookingSystemCourse(data) {
  return request({
    url: '/booking/updateBook',
    method: 'post',
    data
  })
}