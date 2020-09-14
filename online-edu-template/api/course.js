import request from '@/util/request'

export default {
  //获取课程列表
  getCoursePageList(page, limit) {
    return request({
      url: '/eduservice/frontCourse/' + page + '/' + limit,
      method: 'get'
    })
  },
  //通过课程id获取课程详细信息，包括其他表的信息
  getCourseInfo(id){
    return request({
      url: '/eduservice/frontCourse/' + id,
      method: 'get'
    })
  }
}
