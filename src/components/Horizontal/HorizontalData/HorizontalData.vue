<template>
  <div class="subside">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>位移数据</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 级联选择器 -->
     <!-- 级联选择器 -->
    <el-cascader
    v-model="value"
    :options="options"
    @change="handleChange"
    ></el-cascader>
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

    <!-- 表格组件 -->
    <el-table
      :data="dataList"
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
        prop="TheX"
        label="X本次位移"
        >
      </el-table-column>
      <el-table-column
        prop="TotalX"
        label="X累计位移"
        >
      </el-table-column>
      <el-table-column
        prop="TheY"
        label="Y本次位移"
        >
      </el-table-column>
      <el-table-column
        prop="TotalY"
        label="Y累计位移"
        >
      </el-table-column>
      <el-table-column
        prop="TheZ"
        label="Z本次位移"
        >
      </el-table-column>
      <el-table-column
        prop="TotalZ"
        label="Z累计位移"
        >
      </el-table-column>
      <el-table-column
        prop="CollectionTime"
        label="创建时间"
        >
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <!--
      size-change 修改每页条数触发
      current-change 修改当前页触发
      current-page: 当前页
      page-size: 每页的条数
      total: 总条数
      page-sizes
     -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageindex"
      :page-size="pagesize"
      :total="total"
      :page-sizes="[2, 4, 6, 8]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // ususreid,
      query: '',
      // 总条数
      total: 0,
      // 当前页
      pageindex: 1,
      // 每页条数
      pagesize: 4,
      dataList: [],
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
      value: '',
      options: [{
      }]
    }
  },
  created () {
    this.getPart()
  },
  methods: {
    handleChange (value) {
      if (this.SensorID === '') {
        this.SensorID = value[1]
      }
      this.$axios.post(`/HHHorizontalData/GetHHHorizontalDataList
`, {
        SensorID: this.SensorID,
        token: localStorage.getItem('token'),
        UsersID: localStorage.getItem('UsersID'),
        pageSize: this.pagesize,
        pageIndex: this.pageindex
      })
        .then(res => {
          this.dataList = res.data.resultList
          this.total = res.data.total
        })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.handleChange()
    },
    handleCurrentChange (val) {
      // 更新当前页
      this.pageindex = val
      // 重新发送请求
      this.handleChange()
    },
    getPart () {
      this.$axios.post(`/HHDTU/GetDTUAndSensorColumn`, { UsersID: localStorage.getItem('UsersID')
      })
        .then(res => {
          this.options = res.data.query.map(item => {
            return {
              value: item.DTUID,
              label: item.DTUNum,
              UsersID: item.UsersID,
              children: item.query2 && item.query2.map(its => {
                return {
                  value: its.SensorID,
                  label: its.SensorNumber
                }
              })
            }
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
 .el-breadcrumb {
   margin-bottom: 15px;
 }
  .el-cascader {
    width: 300px;
    margin-bottom: 10px;
    margin-right: 20px;
  }
  .el-pagination {
    margin-top: 10px;
  }
  .el-date-picker {
    margin-left: 20px;
  }
</style>
