<template>
  <div>
    <h2>讲师列表</h2>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchObj.name" placeholder="讲师名"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="searchObj.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getTeacherList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80"/>

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历"/>

      <el-table-column prop="gmt_create" label="添加时间" width="160"/>

      <el-table-column prop="sort" label="排序" width="60"/>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getTeacherList"
    />
  </div>

</template>

<script>
  import teacher from '@/api/edu/teacher'

  export default {
    data() {
      return {
        listLoading: true,
        list: null, //当前页数据集合
        total: 0, //查询到数据数量
        page: 1, //当前页
        limit: 10, //每页数据量
        searchObj: {}
      }
    }
    ,
    created() {
      this.getTeacherList()
    },
    methods: {
      getTeacherList(page=1) {
        this.page = page  //如皋没有写页数，默认为1
        this.listLoading = true
        teacher.getTeacherPageList(this.page, this.limit, this.searchObj)
          .then(response => {
            // console.log(response)
            this.list = response.data.records //当前页数据
            this.total = response.data.total  //查询到的数据量
            this.listLoading = false  //加载完就不用转圈了
            // console.log(this.list)
            // console.log(this.total)
          })
          .catch(response => {
            console.log(response)
          })
      },
      resetData() {
        this.searchObj = {}
        this.getTeacherList()
      },
      removeDataById(id) {
        // console.log(id)
        //一般结构
        //  teacher.removeTeacherById(id)
        //  .then((respone)=>{
        //    console.log(respone)
        //  })
        //  .catch(()=>{})
        //删除的给用户提示
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //return 之后的 then 还会执行
          return teacher.removeTeacherById(id)
        }).then(() => {
          this.getTeacherList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch((response) => {
          // 判断是删除失败还是取消
          if (response === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          } else {
            // console.log(response)
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
