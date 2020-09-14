import request from '@/utils/request'

export default {
  getTeacherPageList(page, limit, searchObj) {
    return request({
      url: '/eduservice/teacher/ConditionPageList/' + page + '/' + limit,
      method: 'post',
      data: searchObj
    })
  },
  removeTeacherById(id) {
    return request({
      url: '/eduservice/teacher/'+id,
      method: 'delete'
    })
  },
  save(teacher) {
    return request({
      url: '/eduservice/teacher/addTeacher',
      method: 'post',
      data: teacher
    })
  },
  getTeacherId(id) {
    return request({
      url: '/eduservice/teacher/getTeacherInfo/'+id,
      method: 'get'
    })
  },
  updateTeacher(id,teacher){
    return request({
      url: '/eduservice/teacher/updateTeacher/'+id,
      method: 'post',
      data: teacher
    })
  }
}
