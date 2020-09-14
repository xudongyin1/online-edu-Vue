import request from '@/util/request'
export default {
  //根据token获取用户信息
  getUserInfo(token){
    return request({
       url:'/ucservice/member/getInfo/'+token,
       method:'get'
    })
  },
  //根据手机号码发送短信
  getMobile(mobile) {
    return request({
      url: `/ucservice/api/msm/send/${mobile}`,
      method: 'get'
    })
  },
  //登录
  submitLogin(userInfo) {
    return request({
      url: `/ucservice/member/login`,
      method: 'post',
      data: userInfo
    })
  },
  //注册账号
  submitRegister(formItem) {
    return request({
      url: `/ucservice/member/register`,
      method: 'post',
      data: formItem
    })
  },

}
