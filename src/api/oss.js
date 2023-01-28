import request from '@/utils/request'

export function getOssPolicy(params) {
  return request({
    url: '/file/oss/policy',
    method: 'get',
    params
  })
}

export function generateOssUrl(fileName) {
  return request({
    url: '/file/oss/generate',
    method: 'get',
    params : {fileName}
  })
}