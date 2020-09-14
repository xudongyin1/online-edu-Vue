<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>
    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in oneLevelSubject"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in twoLevelSubject"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->

      <el-form-item label="课程简介">
<!--        <el-input v-model="courseInfo.description" placeholder="请填写课程的简介"/>-->
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="courseInfo.description">
        </el-input>
      </el-form-item>



      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduservice/oss/upload?host=cover'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/>
        元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import course from '@/api/edu/course'
  import subject from '@/api/edu/subject'

  const defaultData = {
    title: '',
    subjectId: '',
    teacherId: '',
    lessonNum: 0,
    description: '',
    cover: 'https://online-edu-photo.oss-cn-beijing.aliyuncs.com/5.jpg',
    // cover: '/static/5.jpg',
    subjectParentId: '',
    price: 0
  }
  export default {
    data() {
      return {
        saveBtnDisabled: false, // 保存按钮是否禁用
        teacherList: [],//存储教师集合
        oneLevelSubject: [],//一级分类集合
        twoLevelSubject: [],//二级分流集合
        courseInfo: defaultData,
        BASE_API: process.env.VUE_APP_BASE_API
      }
    },
    created() {
      this.init() //判断路由是否有参数id值

    },
    watch: {
      $route(to, from) {
        this.init()
      }
    },
    methods: {
      //上传图片成功后
      handleAvatarSuccess(res) {
        this.courseInfo.cover = res.data.imgurl
      },
      //上传图片之前
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      init() {
        //判断路由里是否有id
        if (this.$route.params && this.$route.params.id) {
          //获取路由id
          const id = this.$route.params.id
          //根据id查询课程信息，回显
          this.getCourseInfoById(id)

        } else {//添加
          this.courseInfo = { ...defaultData }
          this.getAllTeacher()//获取所有讲师
          this.getAllLevel()//获取分类
        }
      },
      //添加课程信息
      next() {
        //判断id是否为空
        if (this.courseInfo.id) {
          this.updateCourse() //不为空，进行修改
        } else {
          this.addCourse() //为空，进行添加
        }

      },
      //添加课程
      addCourse() {
        course.addCourseInfo(this.courseInfo)
          .then(response => {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.$router.push({ path: '/course/chapter/' + response.data.courseId })
          })
          .catch(response => {
            this.$message({
              type: 'error',
              message: response.message
            })
          })
      },
      //修改课程
      updateCourse() {
        course.updateCourseInfoById(this.courseInfo.id,this.courseInfo)
          .then((response) => {
            // console.log(response)
            this.$message({
              type: 'success',
              message: '修改课程信息成功'
            })
            this.$router.push({ path: '/course/chapter/' + response.data.courseId })
          })
          .catch((response) => {
            this.$message({
              type: 'error',
              message: '修改课程信息失败'
            })
          })
      },
      //获取所有讲师
      getAllTeacher() {
        course.getTeacherList()
          .then((response) => {
            this.teacherList = response.data.items
          })
      },
      //获取所有分类(包括一级和二级子级)
      getAllLevel() {
        subject.getNestedTreeList()
          .then(response => {
            this.oneLevelSubject = response.data.items
          })
      },
      //点击一级分类触发事件
      subjectLevelOneChanged(value) {
        // alert(value)
        //获取选择一级分类的id值
        //根据一级分类id值，获取下面的所有二级分类

        //1 遍历所有一级分类集合
        //2 获取每个一级分类
        //3 判断value值和遍历出来的每个一级分类id值是否一样，
        //如果一样，获取下面二级分类，是children
        for (let i = 0; i < this.oneLevelSubject.length; i++) {
          if (this.oneLevelSubject[i].id === value) {
            this.twoLevelSubject = this.oneLevelSubject[i].children
            this.courseInfo.subjectId = '' //先清空，选择二级分类后就自己确定了
          }
        }
      },
      //根据id查询课程信息
      getCourseInfoById(id) {
        course.getCourseInfoById(id)
          .then(response => {
            this.courseInfo = response.data.courseInfoForm
            // 初始化分类列表
            subject.getNestedTreeList()
              .then(response => {
                this.oneLevelSubject = response.data.items
                for (let i = 0; i < this.oneLevelSubject.length; i++) {
                  if (this.courseInfo.subjectParentId === this.oneLevelSubject[i].id) {
                    this.twoLevelSubject = this.oneLevelSubject[i].children
                  }
                }
              })
            // 获取讲师列表
            this.getAllTeacher()
          }).catch((response) => {
          this.$message({
            type: 'error',
            message: response.message
          })
        })
      }
    }

  }
</script>

<style scoped>

</style>
