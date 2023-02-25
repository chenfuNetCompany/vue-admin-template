import request from '@/utils/request'


export function getBookingList(params) {
  return request({
    url: '/booking/list/all',
    method: 'get',
    params
  })
}