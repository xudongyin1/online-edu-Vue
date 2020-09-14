import request from '@/utils/request'

export default{
  //获取章节和小节集合
  getChapterVideoList(id) {
    return request({
      url: '/eduservice/chapter/getChapterList/'+id,
      method: 'get'
    })
  },
  //添加章节
  addChapter(chapter){
    return request({
      url: '/eduservice/chapter/addChapter',
      method: 'post',
      data:chapter
    })
  },
  //修改章节
  updateChapter(chapter){
    return request({
      url: '/eduservice/chapter/updateChapter',
      method: 'post',
      data:chapter
    })
  },
  //根据id查询章节
  getChapterInfo(chapterId){
    return request({
      url: '/eduservice/chapter/getChapterInfo/'+chapterId,
      method: 'get'
    })
  },
  //根据id删除章节
  deleteChapter(chapterId){
    return request({
      url: '/eduservice/chapter/'+chapterId,
      method: 'delete'
    })
  },
}
