<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
    v-show：是否显示上传组件
    :key：类似于id，如果一个页面多个图片上传控件，可以做区分
    :url：后台上传的url地址
    @close：关闭上传组件
    @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduservice/oss/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>

      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Teacher from '@/api/edu/teacher'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  const  defaultData ={
    name: '',
    sort: 0,
    level: '',
    career: '',
    intro: '',
    avatar: ''
  }
  export default {
    //组件
    components:{
      ImageCropper,PanThumb
    },
    data() {
      return {
        teacher:defaultData,
        BASE_API:process.env.VUE_APP_BASE_API,
        imagecropperShow: false, // 是否显示上传组件
        imagecropperKey: 0 // 上传组件id
      }
    },
    watch:{
      $route(to,from){ // to,from 可要可不要
        //只要进行路由跳转就进行 init 方法
        this.init()
      }
    },
    created() {
      this.init()
    },
    methods: {
      close(){
        this.imagecropperShow = false
        // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      },
      cropSuccess(data){
        //这里的data相当于response，是后台上传成功回调数据
          this.imagecropperShow =false
          this.teacher.avatar = data.imgurl
        // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
           this.imagecropperKey = this.imagecropperKey + 1
      },
      init(){
        //在页面加载之前先判断路由里面是否有id值
        //如果有id值，调用方法根据id值进行查询
        //从路由里面获取值
        if (this.$route.params && this.$route.params.id) {
          const id = this.$route.params.id
          //调用方法根据id查询
          this.getTeacherById(id)
        }else {//进行添加
          this.teacher = {...defaultData}
        }
      },
      saveOrUpdate() {
        //添加和修改放在同一个方法
        if (this.teacher.id != null) {
          this.updateTeacher()
        } else {
          this.save()
        }

      },
      save() {
        Teacher.save(this.teacher)
          .then(() => {
            return this.$message({
              type: 'success',
              message: '添加成功!'
            })
          }).then(() => {
          //添加成功后进行路由跳转到列表页面
          this.$router.push({ path: '/teacher/list' })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '添加失败!'
          })
        })
      },
      //根据id查询
      getTeacherById(id) {
        Teacher.getTeacherId(id)
          .then((response) => {
            this.teacher = response.data.teacher
          })
      },
      updateTeacher() {
        Teacher.updateTeacher(this.teacher.id, this.teacher)
          .then(() => {
            return this.$message({
              type: 'success',
              message: '修改成功!'
            })
          }).then(() => {
          this.$router.push({ path: '/teacher/list' })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '修改失败!'
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
