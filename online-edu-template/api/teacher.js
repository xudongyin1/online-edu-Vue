import request from '@/util/request'
export default {
  //获取讲师列表
  getTeacherPageList(page,limit){
    return request({
      url:'/eduservice/frontTeacher/'+page+'/'+limit,
      method:'get'
    })
  },
  //获取讲师信息包括所讲课程
  getTeacherInfoById(id){
    return request({
      url:'/eduservice/frontTeacher/'+id,
      method:'get'
    })
  }

}
