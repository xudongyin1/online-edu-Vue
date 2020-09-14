<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href='OSS_PATH'>点击下载模版</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/eduservice/subject/import'"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            :disabled="importBtnDisabled2"
            @click="submitUpload">{{ fileUploadBtnText }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        BASE_API: process.env.VUE_APP_BASE_API, // 接口API地址
       OSS_PATH: 'https://online-edu-photo.oss-cn-beijing.aliyuncs.com/%E6%96%B0%E5%BB%BA%E5%B7%A5%E4%BD%9C%E8%A1%A8.xls', // 阿里云OSS地址
       //  OSS_PATH: '/static/新建工作表.xls',
        fileUploadBtnText: '上传到服务器', // 按钮文字
        importBtnDisabled: false, // 按钮是否禁用,
        importBtnDisabled2: false, // 按钮是否禁用,
        loading: false
      }
    },
    methods:{
      //表单提交函数
      submitUpload() {
        this.fileUploadBtnText = '正在上传'
        this.importBtnDisabled = true  //提交后禁用提交按钮
        this.loading = true
        this.$refs.upload.submit()  //表单提交
      },
      //成功回调函数
      fileUploadSuccess(response){
        this.importBtnDisabled2 = true
        if (response.success == true) {
          this.fileUploadBtnText = '导入成功'
          this.loading = false
          this.$message({
            type: 'success',
            message: response.message
          })
        } else {
          this.fileUploadBtnText='导入警告'
          this.loading = false
          // console.log(response)
          const messages = response.data.msglist
          // console.log(messages)
          let msgString = '<ul>'
          messages.forEach(msg => {
            msgString += `<li>${msg}</li>`
          })
          msgString += '</ul>'
          this.$alert(msgString, response.message, {
            dangerouslyUseHTMLString: true
          })
        }
      },
      //失败回调函数
      fileUploadError(){
        this.fileUploadBtnText = '导入失败'
        this.loading = false
        this.$message({
          type: 'error',
          message: '导入失败'
        })
      }
    }
  }
</script>

<style scoped>

</style>
