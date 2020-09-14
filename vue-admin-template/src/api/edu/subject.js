import request from '@/utils/request'

export default{
  getNestedTreeList(){
    return request({
      url:"/eduservice/subject/list",
      method:"get"
    })
  },
  deleteById(id) {
    return request({
      url:"/eduservice/subject/"+id,
      method:"delete"
    })
  },
  saveOneLevel(subject) {
    return request({
      url:"/eduservice/subject/saveOne",
      method:"post",
      data:subject
    })
  },
  saveTwoLevel(subject) {
    return request({
      url:"/eduservice/subject/saveTwo",
      method:"post",
      data:subject
    })
  }

}
