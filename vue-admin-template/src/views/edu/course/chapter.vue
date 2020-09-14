<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>

    <el-form label-width="120px">
      <el-button type="text" @click="openAdd">添加章节</el-button>
      <!-- 章节 -->
      <ul class="chanpterList">
        <li
          v-for="chapter in chapterVideoList"
          :key="chapter.id">
          <p>
            {{ chapter.title }}

            <span class="acts">
                <el-button type="text" @click="openAddVideo(chapter.id)">添加小节</el-button>
                <el-button style="" type="text" @click="getChapter(chapter.id)">编辑</el-button>
                <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
            </span>
          </p>

          <!-- 视频 -->
          <ul class="chanpterList videoList">
            <li
              v-for="video in chapter.children"
              :key="video.id">
              <p>{{ video.title }}
                <span class="acts">
                        <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button>
                        <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
                    </span>
              </p>
            </li>
          </ul>
        </li>
      </ul>
      <div>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </div>
    </el-form>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改小节表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
      <el-form :model="video" label-width="120px">
        <el-form-item label="小节标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="小节排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>

        <!--添加上传视频-->
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/vidservice/upload'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import chapter from '@/api/edu/chapter'
  import video from '@/api/edu/video'

  export default {
    data() {
      return {
        saveBtnDisabled:false,
        courseId: '', // 所属课程
        chapterVideoList: [], // 章节嵌套视频列表
        dialogChapterFormVisible: false, //是否显示章节表单
        dialogVideoFormVisible: false, //是否显示小节表单
        chapter: {
          title: '',
          sort: 0,
          courseId: ''
        },
        video: {
          title: '',
          sort: 0,
          chapterId: '',
          courseId: '',
          videoSourceId:'', //阿里云视频id
          videoOriginalName: ''//阿里云视频名称
        },
        fileList: [],//上传文件列表
        BASE_API: process.env.VUE_APP_BASE_API // 接口API地址
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        if (this.$route.params && this.$route.params.id) {
          //获取路由里的课程id
          this.courseId = this.$route.params.id
          this.getChapterVideoList(this.courseId)
        }
      },
      //成功回调
      handleVodUploadSuccess(response, file, fileList) {
        this.video.videoSourceId = response.data.videoId
        this.video.videoOriginalName=file.name //赋值文件名
      },
      //视图上传多于一个视频
      handleUploadExceed(files, fileList) {
        this.$message.warning('想要重新上传视频，请先删除已上传的视频')
      },
      //删除之前弹窗确认
      beforeVodRemove(file,fileList){
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      //删除视频
      handleVodRemove(file,fileList){
         video.removeAliyunVideo(this.video.videoSourceId)
         .then(Response=>{
          this.$message({
            type: 'success',
            message: '删除视频成功'
          }).catch(Response=>{
            this.$message({
              type: 'error',
              message: '删除视频失败'
          })
        })
      })
      },
      //删除小节
      deleteVideo(videoId){
        this.$confirm('此操作将永久删除该小节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return video.deleteVideo(videoId)
        }).then(() => {
          this.getChapterVideoList(this.courseId)// 刷新列表
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch((response) => { // 失败
          if (response === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
      },
      //判断小节是添加还是修改
      saveOrUpdateVideo() {
        if (!this.video.id){
          this.addVideo()
        }else {
          this.updateVideo()
        }
      },
      //更新小节
      updateVideo(){
        video.updateVideo(this.video)
        .then(response=>{
          this.dialogVideoFormVisible=false
          this.$message({
            type: 'success',
            message: '修改小节成功'
          })
          //刷新列表
          this.getChapterVideoList(this.courseId)
        }).catch(response=>{
          this.$message({
            type: 'error',
            message: '修改小节失败'
          })
        })
      },
      //打开编辑小节窗口,回显小节数据
      openEditVideo(videoId){
        this.dialogVideoFormVisible = true
        video.getVideoInfo(videoId)
        .then(response=>{
          this.video=response.data.eduVideo
          this.fileList = [{'name': this.video.videoOriginalName}]
        })
      },
      //添加小节
      addVideo() {

        video.addVideo(this.video)
        .then(response=>{
          this.dialogVideoFormVisible = false
          this.$message({
            type: 'success',
            message: '添加小节成功'
          })
          //刷新列表
          this.getChapterVideoList(this.courseId)
        }).catch(response=>{
          this.$message({
            type: 'error',
            message: '添加小节失败'
          })
        })
      },
      //添加小节窗口点击事件
      openAddVideo(chapterId) {
        this.dialogVideoFormVisible = true
        this.video.courseId = this.courseId //对小节的课程id进行赋值
        //清空数据
        this.video.sort = ''
        this.video.title = ''
        this.video.id=''
        this.video.chapterId = chapterId
        this.video.videoSourceId='' //清空视频文件
        this.fileList=[]
      },
      //删除章节
      deleteChapter(chapterId) {
        this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return chapter.deleteChapter(chapterId)
        }).then(() => {
          this.getChapterVideoList(this.courseId)// 刷新列表
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch((response) => { // 失败
          if (response === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
      },
      //打开弹窗事件
      openAdd() {
        this.dialogChapterFormVisible = true
        //进行数据清空
        this.chapter.id = ''
        this.chapter.sort = ''
        this.chapter.title = ''
      },
      //点击弹窗确定按钮事件
      saveOrUpdate() {
        if (!this.chapter.id) {
          this.save()
        } else {//不存在id
          this.updateChapter()
        }

      },
      //根据id查询章节
      getChapter(chapterId) {
        chapter.getChapterInfo(chapterId)
          .then(response => {
            this.dialogChapterFormVisible = true
            this.chapter = response.data.eduChapter
          })
      },
      //修改章节
      updateChapter() {
        chapter.updateChapter(this.chapter)
          .then(response => {
            this.dialogChapterFormVisible = false
            this.$message({
              type: 'success',
              message: '修改章节成功'
            })
            //刷新列表
            this.getChapterVideoList(this.courseId)
          }).catch(response => {
          this.$message({
            type: 'error',
            message: '修改章节失败'
          })
        })
      },
      //添加章节
      save() {
        //对章节的courseId进行赋值
        this.chapter.courseId = this.courseId
        chapter.addChapter(this.chapter)
          .then(response => {
            this.dialogChapterFormVisible = false
            this.$message({
              type: 'success',
              message: '添加章节成功'
            })
            this.getChapterVideoList(this.courseId)
          })
          .catch(response => {
            this.$message({
              type: 'error',
              message: '添加章节失败'
            })
          })
      },
      //通过课程id获取章节和小节信息
      getChapterVideoList(id) {
        chapter.getChapterVideoList(id)
          .then(response => {
            this.chapterVideoList = response.data.items
          }).catch(response => {
          this.$message({
            type: 'error',
            message: '获取数据失败!'
          })
        })
      },
      next() {
        this.$router.push({ path: '/course/publish/' + this.courseId })
      },
      previous() {
        this.$router.push({ path: '/course/info/' + this.courseId })
      }
    }

  }
</script>

<style scoped>
  .chanpterList {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .chanpterList li {
    position: relative;
  }

  .chanpterList p {
    float: left;
    font-size: 20px;
    margin: 10px 0;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #DDD;
  }

  .chanpterList .acts {
    float: right;
    font-size: 14px;
  }

  .videoList {
    padding-left: 50px;
  }

  .videoList p {
    float: left;
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    width: 100%;
    border: 1px dotted #DDD;
  }

</style>
