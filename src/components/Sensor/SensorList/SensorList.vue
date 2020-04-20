<template>
  <div class="DTU">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>传感器列表管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-input placeholder="请输入传感器编号" class="input-with-select" v-model="SensorNumber"
    @keyup.enter.native="searchDTUOrder">
      <el-button @click="searchDTUOrder" slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <!-- 下拉框 -->
    <el-select v-model="form.DTUNum" clearable placeholder="请选择" @change="getDTUNum($event, 'form')">
    <el-option
      v-for="item in lloptions"
      :key="item.DTUID"
      :label="item.DTUNum"
      :value="item.DTUID">
    </el-option>
  </el-select>
  <!-- 添加框 -->
    <el-button class="addBtn" type="success" plain @click="showAddDialog">添加</el-button>
    <!-- 表格组件 -->
    <el-table
      :data="SensorList"
      style="width: 100%">
      <el-table-column
        prop="DTUNum"
        label="DTU编号"
        >
      </el-table-column>
      <el-table-column
        prop="SensorType"
        label="传感器类型"
        >
      </el-table-column>
      <el-table-column
        prop="SensorNumber"
        label="传感器编号"
        >
      </el-table-column>
      <el-table-column
        prop="StatusCode"
        label="状态码"
        >
      </el-table-column>
      <el-table-column
        prop="RefSensorID"
        label="基准"
        >
      </el-table-column>
      <el-table-column
        prop="LongiTude"
        label="经度"
        >
      </el-table-column>
      <el-table-column
        prop="LatiTude"
        label="纬度"
        >
      </el-table-column>
      <el-table-column
        prop="AltiTude"
        label="海拔"
        >
      </el-table-column>
      <el-table-column
        prop="CreateTime"
        label="创建时间"
        >
      </el-table-column>
      <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditDialog(scope.row)" size="small" icon="el-icon-edit" plain type="primary"></el-button>
            <el-button @click="delSensor(scope.row)" size="small" icon="el-icon-delete" plain type="danger"></el-button>
          </template>
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

    <!-- 新增 -->
    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      @close = "closeDialog"
      width="30%">

      <el-form :rules="rules" ref="form" :model="form" label-width="80px">
        <el-form-item label="DTU编号" prop="DTUNum">
          <el-select label="DTU编号" prop="DTUNum" v-model="form.DTUID" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.DTUID"
              :label="item.DTUNum"
              :value="item.DTUID">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="传感器类型" prop="SensorType">
          <el-select label="传感器类型" prop="SensorType" v-model="form.SensorType" clearable placeholder="请选择">
            <el-option
              v-for="item in loptions"
              :key="item.SensorTypeID"
              :label="item.SensorType"
              :value="item.SensorTypeID">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="传感器编号" prop="SensorNumber">
          <el-col :span="16">
            <el-input v-model="form.SensorNumber"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="状态码" prop="StatusCode">
          <el-col :span="16">
            <el-input v-model="form.StatusCode"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="基准" prop="RefSensorID">
          <el-col :span="16">
            <el-input v-model="form.RefSensorID"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="经度" prop="LongiTude">
          <el-col :span="16">
            <el-input v-model="form.LongiTude"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="纬度" prop="LatiTude">
          <el-col :span="16">
            <el-input v-model="form.LatiTude"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="海拔" prop="AltiTude">
          <el-col :span="16">
            <el-input v-model="form.AltiTude"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="创建时间" prop="CreateTime">
          <el-col :span="16">
            <el-input v-model="form.CreateTime"></el-input>
          </el-col>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button @click="addSensor" type="primary">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog
      title="修改"
      :visible.sync="editVisible"
      width="30%">
      <el-form :rules="rules" ref="editForm" :model="editForm" label-width="80px">
        <el-form-item label="DTU编号" prop="DTUNum">
          <el-select label="DTU编号" prop="DTUNum" v-model="editForm.DTUID" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.DTUID"
              :label="item.DTUNum"
              :value="item.DTUID">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="传感器类型" prop="SensorType">
          <el-select label="传感器类型" prop="SensorType" v-model="editForm.SensorType" clearable placeholder="请选择">
            <el-option
              v-for="item in loptions"
              :key="item.SensorTypeID"
              :label="item.SensorType"
              :value="item.SensorTypeID">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="传感器编号" prop="SensorNumber">
          <el-col :span="16">
            <el-input v-model="editForm.SensorNumber"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="状态码" prop="StatusCode">
          <el-col :span="16">
            <el-input v-model="editForm.StatusCode"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="基准" prop="RefSensorID">
          <el-col :span="16">
            <el-input v-model="editForm.RefSensorID"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="经度" prop="LongiTude">
          <el-col :span="16">
            <el-input v-model="editForm.LongiTude"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="纬度" prop="LatiTude">
          <el-col :span="16">
            <el-input v-model="editForm.LatiTude"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="海拔" prop="AltiTude">
          <el-col :span="16">
            <el-input v-model="editForm.AltiTude"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="创建时间" prop="CreateTime">
          <el-col :span="16">
            <el-input v-model="editForm.CreateTime"></el-input>
          </el-col>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button @click="editSensor" type="primary">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      SensorNumber: '',
      // 总条数
      total: 0,
      // 当前页
      pageindex: 1,
      // 每页条数
      pagesize: 4,
      SensorList: [],
      dialogVisible: false,
      editVisible: false,
      form: {
        DTUNum: '',
        DTUID: '',
        // SensorID: '',
        SensorType: '',
        SensorNumber: '',
        StatusCode: '',
        RefSensorID: '',
        LatiTude: '',
        LongiTude: '',
        AltiTude: '',
        CreateTime: ''
      },
      editForm: {
        SensorID: '',
        DTUID: '',
        SensorType: '',
        SensorNumber: '',
        StatusCode: '',
        RefSensorID: '',
        LatiTude: '',
        LongiTude: '',
        AltiTude: '',
        CreateTime: ''
      },
      options: [],
      loptions: [],
      lloptions: [],
      rules: {
        SensorNumber: [
          { required: true, message: '请输入传感器编号', trigger: ['blur'] },
          { min: 1, max: 12, message: '超出限度，请重新填写', trigger: ['blur'] }
        ],
        StatusCode: [
          { required: true, message: '请输入状态码', trigger: ['blur'] },
          { min: 1, max: 12, message: '超出限度，请重新填写', trigger: ['blur'] }
        ],
        RefSensorID: [
          { required: true, message: '请输入基准', trigger: ['blur'] },
          { min: 1, max: 12, message: '超出限度，请重新填写', trigger: ['blur'] }
        ],
        LongiTude: [
          { required: true, message: '请输入经度', trigger: ['blur'] },
          { min: 1, max: 12, message: '超出限度，请重新填写', trigger: ['blur'] }
        ],
        AltiTude: [
          { required: true, message: '请输入海拔', trigger: ['blur'] },
          { min: 1, max: 12, message: '超出限度，请重新填写', trigger: ['blur'] }
        ],
        LatiTude: [
          { required: true, message: '请输入纬度', trigger: ['blur'] },
          { min: 1, max: 12, message: '超出限度，请重新填写', trigger: ['blur'] }
        ],
        CreateTime: [
          { required: true, message: '请输入创建时间', trigger: ['blur'] },
          { min: 1, max: 12, message: '超出限度，请重新填写', trigger: ['blur'] }
        ]
      }
    }
  },
  created () {
    this.getSensorList()
    this.getDep()
    this.getCdep()
    this.getMent()
    this.getDTUNum()
  },
  methods: {
    getSensorList () {
      this.$axios.post(`/HHSensor/GetSensorList`, {
        token: localStorage.getItem('token'), // 登录接口返回参数
        UsersID: localStorage.getItem('UsersID'),
        DTUID: this.form.DTUID,
        pageSize: this.pagesize,
        pageIndex: this.pageindex,
        SensorNumber: this.form.SensorNumber,
        DTUNum: this.form.DTUNum
      })
        .then(res => {
          // console.log(res)
          this.SensorList = res.data.resultList
          this.total = res.data.total
        })
        .catch(e => {
          console.log(e)
        })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getSensorList()
    },
    handleCurrentChange (val) {
      // 更新当前页
      this.pageindex = val
      // 重新发送请求
      this.getSensorList()
    },
    searchDTUOrder () {
      // 给input框添加键盘回车事件和点击按钮搜索事件
      this.pageindex = 1
      this.getSensorList()
    },
    showAddDialog () {
      this.dialogVisible = true
    },
    closeDialog () {
      this.$refs.form.resetFields()
    },
    // 添加功能
    addSensor () {
      this.$refs.form.validate()
      // 说明校验成功了
      // 发送添加的 ajax
      this.$axios.post(`/HHSensor/AddHHSensor`, {
        token: localStorage.getItem('token'),
        UsersID: localStorage.getItem('UsersID'),
        ...this.form
      })
        .then(res => {
          console.log(res)
          this.$message.success('添加成功')
          this.dialogVisible = false
          this.total++
          this.pageindex = Math.ceil(this.total / this.pagesize)
          // 重新渲染
          this.getSensorList()
        }).catch(e => {
          console.log(e)
        })
    },
    //  修改
    editSensor () {
      this.$axios.post(`/HHSensor/UpHHSensor`, {
        token: localStorage.getItem('token'),
        UsersID: localStorage.getItem('UsersID'),
        ...this.editForm
      })
        .then(res => {
          this.editVisible = false
          this.getSensorList()
        })
        .catch(e => {
          console.log(e)
        })
    },
    // 展示编辑弹框
    showEditDialog (row) {
      this.editVisible = true
      this.editForm.SensorID = row.SensorID
      this.editForm.SensorNumber = row.SensorNumber
      this.editForm.DTUID = row.DTUID
      this.editForm.StatusCode = row.StatusCode
      this.editForm.SensorTypeID = row.SensorTypeID
      this.editForm.RefSensorID = row.RefSensorID
      this.editForm.LongiTude = row.LongiTude
      this.editForm.LatiTude = row.LatiTude
      this.editForm.AltiTude = row.AltiTude
      this.editForm.CreateTime = row.CreateTime
      this.editForm.DTUNum = row.DTUNum
      this.editForm.SensorType = row.SensorType
    },
    delSensor (row) {
      this.$confirm('你确认要删除本条数据吗?', '温馨提示', {
        type: 'warning'
      }).then(res => {
        this.$axios.post(`/HHSensor/DelSensor`, {
          token: localStorage.getItem('token'),
          UsersID: localStorage.getItem('UseraID'),
          SensorID: row.SensorID
        })
          .then(res => {
            this.$message.success('删除成功')
            this.total--
            this.pageindex = Math.floor(this.total / this.pagesize)
            // 重新渲染
            this.getSensorList()
          })
      }).catch(e => {
        console.log(e)
      })
    },
    getDep () {
      this.$axios.post(`/HHDTU/GetDTUColumn`, {
        UsersID: localStorage.getItem('UsersID')
      })
        .then(res => {
          this.options = res.data.resultList
        })
        .catch(e => {
          console.log(e)
        })
    },
    getMent () {
      this.$axios.post(`/HHDTU/GetDTUColumn`, {
        UsersID: localStorage.getItem('UsersID')
      })
        .then(res => {
          this.lloptions = res.data.resultList
        })
        .catch(e => {
          console.log(e)
        })
    },
    getCdep () {
      this.$axios.post(`/HHSensorType/GetHHSensorTypeColumn`)
        .then(res => {
          this.loptions = res.data.resultList
        })
        .catch(e => {
          console.log(e)
        })
    },
    getDTUNum (e) {
      // e指代当前点击的DTU的编号的id
      // console.log(e)
      this.form.DTUNum = e
      this.pageindex = 1
      this.getSensorList()
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
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addBtn {
    margin-left: 10px;
  }
  .el-select {
    margin-left: 10px;
  }
</style>
