import request from '@/utils/request'


export function addRoom(data) {
  return request({
    url: '/room/add',
    method: 'post',
    data
  })
}

export function updateRoom(data) {
  return request({
    url: '/room/update',
    method: 'post',
    data
  })
}

export function deleteRoom(data) {
  return request({
    url: '/room/delete',
    method: 'post',
    data
  })
}

export function getRoomList(params) {
  return request({
    url: '/room/list',
    method: 'get',
    params
  })
}