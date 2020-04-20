<template>
  <div class="project">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>项目列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height: 500px;">
      <h4 style="text-align: center; font-size: 24px; font-weight: bold">{{model.ProjectName}}</h4>
      <div class="clearfix" style="margin-top: 30px; height: 50px">
        <span style="float: left; margin-left: 15px;">{{model.CreationTime}}</span>
        <span style="float: left; margin-left: 50px;">{{model.ProjectManager}}</span>
      </div>
        <div style="height: 300px">
          <quill-editor v-model="model.ProjectDescription"></quill-editor>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: ''
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$axios.post(`/HHProject/GetHHProject`, {
        UsersID: localStorage.getItem('UsersID'),
        token: localStorage.getItem('token')
      })
        .then(res => {
          // console.log(res)
          this.model = res.data.model
        }).catch(e => {
          console.log(e)
        })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
