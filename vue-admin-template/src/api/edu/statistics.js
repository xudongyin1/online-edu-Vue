import request from '@/utils/request'

export default {
  getRegisterNumDaily(day){
    return request({
      url:"/staservice/daily/getRegisterNum/"+day,
      method:"get"
    })
  },
  //获取数据生成图表
  getCountData(searchObj){
    return request({
      url:`/staservice/daily/showChart/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
      method:"get"
    })
  }
}
