/**
 * Created by PanJiaChen on 16/11/18.
 */


export function booleanFilter(value) {
  if (value === true){
    return "是"
  }
  return "否"
}

export function goodStatusFilter(status) {
  const statusMap = {
    1: '上架中',
    2: '已下架',
  }
  return statusMap[status]
}

export function bannerStatusFilter(status) {
  const statusMap = {
    1: '上架中',
    2: '已下架',
  }
  return statusMap[status]
}
