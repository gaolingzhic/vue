<template>
  <div class="LogList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>日志列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 下拉框 -->
   <el-select clearable v-model="form.LogType" placeholder="请选择" @change="getLogTypeNum($event, 'form')">
    <el-option
      v-for="item in options"
      :key="item.Id"
      :label="item.LogType"
      :value="item.Id">
    </el-option>
  </el-select>
  <!-- 日期组件 -->
  <el-date-picker
      v-model="value2"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions">
    </el-date-picker>
    <!-- 表格 -->
    <el-table
      :data="LogList"
      style="width: 100%">
      <el-table-column
        prop="RealName"
        label="姓名"
        >
      </el-table-column>
      <el-table-column
        prop="LogType"
        label="日志类型"
        >
      </el-table-column>
      <el-table-column
        prop="LogContent"
        label="日志内容"
        >
      </el-table-column>
      <el-table-column
        prop="CreationTime"
        label="时间"
        >
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageindex"
      :page-size="pagesize"
      :total="total"
      :page-sizes="[2, 4, 6, 8, 10, 12, 14, 16]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      total: 0,
      pageindex: 1,
      pagesize: 8,
      options: [],
      value: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value1: '',
      value2: '',
      LogList: [],
      form: {
        Id: '',
        LogTypeNum: '',
        LogType: ''
      }
    }
  },
  created () {
    this.getLogList()
    this.getLogColumn()
    this.getLogTypeNum()
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.getLogList()
    },
    handleCurrentChange (val) {
      // 更新当前页
      this.pageindex = val
      // 重新发送请求
      this.getLogList()
    },
    getLogList () {
      this.$axios.post(`/HHLogInfo/GetLogList`, {
        UsersID: localStorage.getItem('UsersID'),
        pageIndex: this.pageindex,
        pageSize: this.pagesize,
        LogTypeNum: this.form.LogTypeNum
      })
        .then(res => {
          this.LogList = res.data.resultList
          this.total = res.data.total
        }).catch(e => {
          console.log(e)
        })
    },
    getLogColumn () {
      this.$axios.post(`/HHLogInfo/GetLogTypeColumn`)
        .then(res => {
          // console.log(res)
          this.options = res.data.resultList
        }).catch(e => {
          console.log(e)
        })
    },
    getLogTypeNum (e) {
      // console.log(e)
      this.form.LogTypeNum = e
      this.pageindex = 1
      this.getLogList()
    }
  }
}
</script>
<style lang="less" scoped>
  .LogList {
    .el-breadcrumb {
   margin-bottom: 15px;
 }
    .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .el-select {
    margin-left: 15px;
  }
  .el-range-editor.el-input__inner {
    margin-left: 15px;
  }
  .el-pagination {
    margin-top: 10px;
  }
  }
</style>
