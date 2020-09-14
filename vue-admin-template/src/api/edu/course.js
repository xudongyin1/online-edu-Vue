import request from '@/utils/request'

export default {
  addCourseInfo(courseInfo) {
    return request({
      url: '/eduservice/course/info',
      method: 'post',
      data: courseInfo
    })
  },
  getTeacherList() {
    return request({
      url: '/eduservice/teacher',
      method: 'get'
    })
  },
  getCourseInfoById(id) {
    return request({
      url: '/eduservice/course/getInfo/' + id,
      method: 'get'
    })
  },
  updateCourseInfoById(id,courseInfo) {
    return request({
      url: '/eduservice/course/updateInfo/' + id,
      method: 'post',
      data:courseInfo
    })
  },
  //带分页查询所有课程信息
  getPageList(page,limit,searchObj){
    return request({
      url: '/eduservice/course/list/' + page + '/' + limit,
      method: 'post',
      data:searchObj
    })
  },
  //根据id删除课程
  deleteCourseById(id){
    return request({
      url: '/eduservice/course/deleteCourse/' + id,
      method: 'delete'
    })
  },
  //通过课程id查询课程所有信息
  getCourseInfoAllById(id) {
    return request({
      url: '/eduservice/course/getCourseInfoAll/' + id,
      method: 'get'
    })
  },
  //发布课程，修改课程status属性
  publishCourseById(id){
    return request({
      url: '/eduservice/course/publishCourse/' + id,
      method: 'get'
    })
  }
}
