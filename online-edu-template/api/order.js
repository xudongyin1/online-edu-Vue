import request from '@/util/request'

export default {
  //生成订单
 createOrders(courseId) {
    return request({
      url: '/ucservice/order/createOrder/' + courseId,
      method: 'post'
    })
  },
  //通过订单号获取订单信息
  getOrderInfo(id){
    return request({
      url: '/ucservice/order/getOrderInfo/' + id,
      method: 'get'
    })
  },
  //3、生成微信支付二维码
  createNative(cid) {
    return request({
      url: '/ucservice/log/createNative/'+cid,
      method: 'get'
    })
  },
  //根据订单id获取订单支付状态
  queryPayStatus(cid) {
    return request({
      url: '/ucservice/log/queryPayStatus/'+cid,
      method: 'get'
    })
  }
}
