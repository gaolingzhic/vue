<template>
  <div class="LogList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>预警列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框
   <el-input placeholder="请输入要查询关键字" v-model="query" class="input-with-select">
      <el-button @click="searchLog" slot="append" icon="el-icon-search"></el-button>
    </el-input> -->
    <!-- 下拉框 -->
    <el-select clearable v-model="form.TypeName" placeholder="请选择" @change="getAlertTypeNum($event, 'form')">
    <el-option
      v-for="item in options"
      :key="item.AlertTypeNum"
      :label="item.TypeName"
      :value="item.AlertTypeNum">
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
      :data="WarningInfoList"
      style="width: 100%">
      <el-table-column
        prop="DTUNum"
        label="DTU编号"
        >
      </el-table-column>
      <el-table-column
        prop="SensorNumber"
        label="传感器编号"
        >
      </el-table-column>
      <el-table-column
        prop="TypeName"
        label="预警类型"
        >
      </el-table-column>
      <el-table-column
        prop="WarningInfo"
        label="预警内容"
        >
      </el-table-column>
      <el-table-column
        prop="CreateTime"
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
      WarningInfoList: [],
      form: {
        TypeName: '',
        AlertTypeNum: ''
      }
    }
  },
  created () {
    this.getList()
    this.getColumn()
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.getList()
    },
    handleCurrentChange (val) {
      // 更新当前页
      this.pageindex = val
      // 重新发送请求
      this.getList()
    },
    getList () {
      this.$axios.post(`/HHWarningInfo/GetHHWarningInfoList`, {
        UsersID: localStorage.getItem('UsersID'),
        pageIndex: this.pageindex,
        pageSize: this.pagesize,
        AlertTypeNum: this.form.AlertTypeNum
      })
        .then(res => {
          this.WarningInfoList = res.data.resultList
          this.total = res.data.total
        }).catch(e => {
          console.log(e)
        })
    },
    getColumn () {
      this.$axios.post(`/HHWarningInfo/GetAlertTypeColumn`)
        .then(res => {
          this.options = res.data.resultList
        }).catch(e => {
          console.log(e)
        })
    },
    getAlertTypeNum (e) {
      // console.log(e)
      this.form.AlertTypeNum = e
      this.pageindex = 1
      this.getList()
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
