<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;"/>

    <el-button type="text" @click="dialogFormVisible = true">添加一级分类</el-button>
    <el-tree
      ref="subjectTree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      class="filter-tree"
      default-expand-all
      node-key="id">
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <!-- 使用Chrome的Vue插件调试 -->
          <el-button
            v-if="node.level == 1"
            type="text"
            size="mini"
            @click="() => append(data)">添加二级分类</el-button>
          <el-button
            v-if="node.level == 2||node.level == 1"
            type="text"
            size="mini"
            @click="() => remove(node, data)">删除</el-button>
        </span>
      </span>
    </el-tree>
    <!--弹窗-->
    <el-dialog :visible.sync="dialogFormVisible" title="添加分类">
      <el-form :model="subject" label-width="120px">
        <el-form-item label="分类标题">
          <el-input v-model="subject.title"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="appendLevel()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import subject from '@/api/edu/subject'

  export default {
    data() {
      return {
        dialogFormVisible:false,
        subject:{
          title:'',
          parentId:''
        },
        filterText: '',
        subjectList: [],
        defaultProps: {
          children: 'children',
          label: 'title'
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.subjectTree.filter(val)
      }
    },
    created() {
      this.getListNode()
    },
    methods: {
      //判断添加的是一级分类还是二级分类
      appendLevel(){
        // console.log(this.subject.parentId)
        if (this.subject.parentId) {
          this.appendLevelTwo()
        } else {
          this.appendLevelOne()
        }

      },
      //添加二级分类按钮点击事件
      append(data){
        this.dialogFormVisible=true
        this.subject.parentId=data.id
        // console.log(this.subject.parentId)
      },
      //添加二级分类
      appendLevelTwo(){
        subject.saveTwoLevel(this.subject)
          .then(()=>{
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.dialogFormVisible=false
            this.getListNode() //刷新列表
            this.subject.title=''
            this.subject.parentId=''
          })
          .catch((response)=>{
            this.$message({
              type: 'error',
              message:  response.message
            })
          })

      },
      //添加一级分类
      appendLevelOne(){
        subject.saveOneLevel(this.subject)
          .then(()=>{
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.dialogFormVisible=false
            this.getListNode() //刷新列表
            this.subject.title=''
            this.subject.parentId=''
          })
        .catch((response)=>{
          this.$message({
            type: 'error',
            message:  response.message
          })
        })

      },
      //删除分类节点
      remove(node, data) {
        // console.log(node)
        // console.log(data)

        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return subject.deleteById(data.id)
        }).then(() => {
          // this.getListNode() //刷新树
          this.$refs.subjectTree.remove(node)  //直接删除节点效率高
          this.$message({
            type: 'success',
            message: '删除成功'
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
              message:  response.message
            })
          }
        })
      },
      getListNode() {
        subject.getNestedTreeList()
          .then((response) => {
            if (response.success == true) {
              this.subjectList = response.data.items
            }
          }).catch()
      },
      filterNode(value, data) {
        if (!value) return true
        // return data.title.indexOf(value) !== -1
        return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      }

    }
  }
</script>

<style scoped>

</style>
