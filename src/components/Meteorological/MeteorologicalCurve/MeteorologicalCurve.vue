<template>
  <div class="subside">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>气象曲线</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 级联选择器 -->

      <el-cascader
    v-model="value"
    :options="optionsdata"
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

     <div class="container">
      <div id="myCharts" ref="myCharts" :style="{width: '100%', height: '500px'}"></div>
     </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      query: '',
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
      optionsdata: [],
      options: '',
      TemperaTuredata: [],
      Humiditydata: [],
      AtmosphericPressuredata: [],
      UploadTimedata: []
    }
  },
  created () {
    this.getPart()
  },
  mounted () {
  //  初始化
    this.chartFn()
  },
  methods: {
    chartFn () {
      const that = this
      let myCharts = this.$echarts.init(this.$refs.myCharts)
      // 默认色板
      var colors = ['#5793f3', '#d14a61', '#675bba']
      this.options = {
        color: colors,
        // 提示框
        tooltip: {
          trigger: 'none',
          axisPointer: {
            type: 'cross'
          }
        },
        // 图例
        legend: {
        // 数据
          data: ['温度', '湿度', '大气压']
        },
        // 网格
        grid: {
          top: 50,
          bottom: 50
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[1]
              }
            },
            axisPointer: {
              label: {
                formatter: function (params) {
                  return '湿度  ' + params.value +
                            (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                }
              }
            },
            data: []
          },
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[0]
              }
            },
            axisPointer: {
              label: {
                formatter: function (params) {
                  return '湿度 ' + params.value +
                            (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                }
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            boundaryGap: true
          }
        ],
        series: [
          {
            name: '温度',
            type: 'line',
            xAxisIndex: 1,
            smooth: true,
            data: that.TemperaTuredata
          },
          {
            name: '湿度',
            type: 'line',
            smooth: true,
            data: that.Humiditydata
          },
          {
            name: '大气压',
            type: 'line',
            smooth: true,
            data: that.AtmosphericPressuredata
          }
        ]
      }
      myCharts.setOption(this.options)
    },
    handleChange (value) {
      this.$axios.post(`/HHMeteorologicalRawData/GetHHMeteorologicalRawDataFigure`, {
        SensorID: value[1],
        token: localStorage.getItem('token'),
        UsersID: localStorage.getItem('UsersID')
      })
        .then(res => {
          this.TemperaTuredata = res.data.resultList && res.data.resultList.map(item => {
            return item.TemperaTure
          })
          this.Humiditydata = res.data.resultList && res.data.resultList.map(item => {
            return item.Humidity
          })
          this.AtmosphericPressuredata = res.data.resultList && res.data.resultList.map(item => {
            return item.AtmosphericPressure
          })
          this.UploadTimedata = res.data.resultList && res.data.resultList.map(item => {
            return item.UploadTime
          })
          this.options.series[0].data = this.TemperaTuredata
          this.options.series[1].data = this.Humiditydata
          this.options.series[2].data = this.AtmosphericPressuredata
          this.options.xAxis[0].data = this.UploadTimedata
          let myCharts = this.$echarts.init(this.$refs.myCharts)
          myCharts.setOption(this.options)
        }).catch(e => {
          console.log(e)
        })
    },
    getPart () {
      this.$axios.post(`/HHDTU/GetDTUAndSensorColumn`, { UsersID: localStorage.getItem('UsersID')
      })
        .then(res => {
          this.optionsdata = res.data.query.map(item => {
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
        }).then(e => {
          // console.log(e)
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
  .el-date-picker {
    margin-left: 20px;
  }
  .container {
    margin-top: 30px;
    width: 100%;
    height: 500px;
  }
</style>
