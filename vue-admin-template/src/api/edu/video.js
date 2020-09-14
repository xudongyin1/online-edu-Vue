import request from '@/utils/request'

export default{
  //添加小节
  addVideo(video){
    return request({
      url: '/eduservice/video/addVideo',
      method: 'post',
      data:video
    })
  },
  //修改小节
  updateVideo(video){
    return request({
      url: '/eduservice/video/updateVideo',
      method: 'post',
      data:video
    })
  },
  //根据id查询小节
  getVideoInfo(videoId){
    return request({
      url: '/eduservice/video/'+videoId,
      method: 'get'
    })
  },
  //根据id删除小节
  deleteVideo(videoId){
    return request({
      url: '/eduservice/video/'+videoId,
      method: 'delete'
    })
  },
  //删除阿里云视频的方法
  removeAliyunVideo(videoSourceId) {
    return request({
      url: '/vidservice/deleteVideo/'+videoSourceId,
      method: 'delete'
    })
  }
}
