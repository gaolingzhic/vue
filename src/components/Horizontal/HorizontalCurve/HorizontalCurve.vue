<template>
  <div class="subside">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>位移曲线</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 级联选择器 -->
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
      // 总条数
      total: 0,
      TheXdata: [],
      TheYdata: [],
      TheZdata: [],
      TotalXdata: [],
      TotalYdata: [],
      TotalZdata: [],
      CollectionTimedata: [],
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
      options: '',
      optionsdata: []
    }
  },
  created () {
    this.getPart()
  },
  mounted () {
  //  初始化
    this.chartfn()
  },
  methods: {
    chartfn () {
      const that = this
      let myCharts = this.$echarts.init(this.$refs.myCharts)
      // 默认色板
      var colors = ['#5793f3', '#d14a61', '#675bba', '#00FF00', '#ffff01', '#ff5ba5']
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
          data: ['X本次位移', 'X累计位移', 'Y本次位移', 'Y累计位移', 'Z本次位移', 'Z累计位移']
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
                  return '位移  ' + params.value +
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
                  return '位移 ' + params.value +
                            (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                }
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            // 纵坐标自适应
            boundaryGap: true
            // min: -20,
            // max: 20
          }
        ],
        series: [
          {
            name: 'X累计位移',
            type: 'line',
            xAxisIndex: 1,
            smooth: true,
            data: that.TotalXdata
          },
          {
            name: 'X本次位移',
            type: 'line',
            smooth: true,
            data: that.TheXdata
          },
          {
            name: 'Y累计位移',
            type: 'line',
            smooth: true,
            data: that.TotalYdata,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#ffff01'
                }
              }
            }
          },
          {
            name: 'Y本次位移',
            type: 'line',
            smooth: true,
            data: that.TheYdata,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#675bba'
                }
              }
            }
          },
          {
            name: 'Z累计位移',
            type: 'line',
            smooth: true,
            data: that.TotalZdata,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#00FF00'
                }
              }
            }
          },
          {
            name: 'Z本次位移',
            type: 'line',
            smooth: true,
            data: that.TheZdata,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#ff5ba5'
                }
              }
            }
          }
        ]
      }
      myCharts.setOption(this.options)
    },
    handleChange (value) {
      this.$axios.post(`/HHHorizontalData/GetHHHorizontalDataFigure`, {
        SensorID: value[1],
        token: localStorage.getItem('token'),
        UsersID: localStorage.getItem('UsersID')
      }).then(res => {
        this.TheXdata = res.data.resultList && res.data.resultList.map(item => {
          return item.TheX
        })
        this.TheYdata = res.data.resultList && res.data.resultList.map(item => {
          return item.TheY
        })
        this.TheZdata = res.data.resultList && res.data.resultList.map(item => {
          return item.TheZ
        })
        this.TotalXdata = res.data.resultList && res.data.resultList.map(item => {
          return item.TotalX
        })
        this.TotalYdata = res.data.resultList && res.data.resultList.map(item => {
          return item.TotalY
        })
        this.TotalZdata = res.data.resultList && res.data.resultList.map(item => {
          return item.TotalZ
        })
        this.CollectionTimedata = res.data.resultList && res.data.resultList.map(item => {
          return item.CollectionTime
        })
        this.options.series[0].data = this.TheXdata
        this.options.series[1].data = this.TotalXdata
        this.options.series[2].data = this.TheYdata
        this.options.series[3].data = this.TotalYdata
        this.options.series[4].data = this.TheZdata
        this.options.series[5].data = this.TotalZdata
        this.options.xAxis[0].data = this.CollectionTimedata
        let myCharts = this.$echarts.init(this.$refs.myCharts)
        myCharts.setOption(this.options)
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
  .container {
    margin-top: 30px;
    width: 100%;
    height: 500px;
  }
</style>
