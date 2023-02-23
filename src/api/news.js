import request from '@/utils/request'


export function addNews(data) {
  return request({
    url: '/news/add',
    method: 'post',
    data
  })
}

export function updateNews(data) {
  return request({
    url: '/news/update',
    method: 'post',
    data
  })
}

export function deleteNews(data) {
  return request({
    url: '/news/delete',
    method: 'post',
    data
  })
}

export function getNewsList(params) {
  return request({
    url: '/news/list',
    method: 'get',
    params
  })
}