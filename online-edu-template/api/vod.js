import request from '@/util/request'
export default {
  //获取视频播放凭证
  getVideoAuth(vid){
    return request({
      url:'/vidservice/getAuth/'+vid,
      method:'get'
    })
  }
}
