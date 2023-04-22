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

export function getRecordList(params) {
  return request({
    url: '/exam/record/list',
    method: 'get',
    params
  })
}

//获取测试模板列表
export function getProjectList() {
  return request({
    url: '/exam/project/one',
    method: 'get'
  })
}

//添加测试模板
export function addProject(data) {
  return request({
    url: '/exam/project/add',
    method: 'post',
    data
  })
}

//更新测试工程
export function updateProject(data) {
  return request({
    url: '/exam/project/update',
    method: 'post',
    data
  })
}