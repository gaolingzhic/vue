<template>
  <div class="subside">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>DTU列表管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入DTU编号" v-model="DTUNum" class="input-with-select"
    @keyup.enter.native="searchDTU">
      <el-button @click="searchDTU" slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <!-- 添加框 -->
    <el-button class="addBtn" type="success" plain @click="showAddDialog">添加</el-button>
    <!-- 表格组件 -->
    <el-table
      :data="HHDTUList"
      style="width: 100%">
      <el-table-column
        prop="DTUNum"
        label="DTU编号"
        >
      </el-table-column>
      <el-table-column
        prop="RealName"
        label="姓名"
        >
      </el-table-column>
      <el-table-column
        prop="JLSZCollInterval"
        label="静力水准同步时间"
        >
      </el-table-column>
      <el-table-column
        prop="GNSSCollInterval"
        label="GNSS同步时间"
        >
      </el-table-column>
      <el-table-column
        prop="WeatherStationCollInterval"
        label="气象站同步时间"
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
      <el-table-column
        prop="SynchronizationTime"
        label="同步时间"
        >
      </el-table-column>

      <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditDialog(scope.row)" size="small" icon="el-icon-edit" plain type="primary"></el-button>
            <el-button @click="delDTU(scope.row)" size="small" icon="el-icon-delete" plain type="danger"></el-button>
          </template>
      </el-table-column>
    </el-table>

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
          <el-col :span="16">
            <el-input type="DTUNum" v-model="form.DTUNum"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="静力水准采集间隔" prop="JLSZCollInterval">
          <el-col :span="16">
            <el-input type="JLSZCollInterval" v-model="form.JLSZCollInterval"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="气象采集时间间隔" prop="WeatherStationCollInterval">
          <el-col :span="16">
            <el-input v-model="form.WeatherStationCollInterval"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="纬度" prop="LatiTude">
          <el-col :span="16">
            <el-input v-model="form.LatiTude"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="姓名" prop="RealName">
          <el-select label="姓名" prop="RealName" v-model="form.RealName" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.UsersID"
              :label="item.RealName"
              :value="item.UsersID">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="GNSS采集间隔" prop="GNSSCollInterval">
          <el-col :span="16">
             <el-input v-model="form.GNSSCollInterval"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="经度" prop="LongiTude">
          <el-col :span="16">
            <el-input v-model="form.LongiTude"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="海拔" prop="AltiTude">
          <el-col :span="16">
            <el-input v-model="form.AltiTude"></el-input>
          </el-col>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button @click="addDTU" type="primary">确 定</el-button>
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
          <el-col :span="16">
            <el-input type="DTUNum" v-model="editForm.DTUNum"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="静力水准采集间隔" prop="JLSZCollInterval">
          <el-col :span="16">
            <el-input v-model="editForm.JLSZCollInterval"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="气象采集时间间隔" prop="WeatherStationCollInterval">
          <el-col :span="16">
            <el-input v-model="editForm.WeatherStationCollInterval"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="纬度" prop="LatiTude">
          <el-col :span="16">
            <el-input v-model="editForm.LatiTude"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="姓名" prop="RealName">
          <el-select label="姓名" prop="RealName" v-model="editForm.RealName" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.UsersID"
              :label="item.RealName"
              :value="item.UsersID">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="GNSS采集间隔" prop="GNSSCollInterval">
          <el-col :span="16">
            <el-input v-model="editForm.GNSSCollInterval"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="经度" prop="LongiTude">
          <el-col :span="16">
            <el-input v-model="editForm.LongiTude"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="海拔" prop="AltiTude">
          <el-col :span="16">
             <el-input v-model="editForm.AltiTude"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="SynchronizationTime"
        label="同步时间">
          <el-col :span="16">
            <el-input v-model="editForm.SynchronizationTime"></el-input>
          </el-col>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button @click="editDTU" type="primary">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 删除 -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      // ususreid,
      // 搜索条件
      DTUNum: '',
      // 总条数
      total: 0,
      // 当前页
      pageindex: 1,
      // 每页条数
      pagesize: 4,
      HHDTUList: [],
      options: [],
      loptions: [],
      ment: '',
      dialogVisible: false,
      form: {
        DTUNum: '',
        DTUID: '',
        JLSZCollInterval: '',
        WeatherStationCollInterval: '',
        LatiTude: '',
        RealName: '',
        GNSSCollInterval: '',
        SynchronizationTime: '',
        LongiTude: '',
        AltiTude: ''
      },
      rules: {
        DTUnum: [
          { required: true, message: '请输入序号', trigger: ['blur'] },
          { min: 1, max: 12, message: '超出限度，请重新填写', trigger: ['blur'] }
        ],
        JLSZCollInterval: [
          { required: true, message: '请输入静力水准采集间隔', trigger: ['blur'] },
          { pattern: /^\d{1,12}$/, message: '长度超出限制，请重新输入', trigger: ['blur'] }
        ],
        WeatherStationCollInterval: [
          { required: true, message: '请输入气象站采集时间间隔', trigger: ['blur'] },
          { pattern: /^\d{1,12}$/, message: '长度超出限制，请重新输入', trigger: ['blur'] }
        ],
        GNSSCollInterval: [
          { required: true, message: '请输入序号', trigger: ['blur'] },
          { pattern: /^\d{1,12}$/, message: '长度超出限制，请重新输入', trigger: ['blur'] }
        ],
        LongiTude: [
          { required: true, message: '请输入经度', trigger: ['blur'] },
          { pattern: /^\d{1,12}$/, message: '长度超出限制，请重新输入', trigger: ['blur'] }
        ],
        LatiTude: [
          { required: true, message: '请输入纬度', trigger: ['blur'] },
          { pattern: /^\d{1,12}$/, message: '长度超出限制，请重新输入', trigger: ['blur'] }
        ],
        AltiTude: [
          { required: true, message: '请输入海拔', trigger: ['blur'] },
          { pattern: /^\d{1,12}$/, message: '长度超出限制，请重新输入', trigger: ['blur'] }
        ]
      },
      editVisible: false,
      editForm: {
        SynchronizationTime: '',
        UsersID: '',
        DTUNum: '',
        JLSZCollInterval: '',
        WeatherStationCollInterval: '',
        LatiTude: '',
        GNSSCollInterval: '',
        LongiTude: '',
        AltiTude: ''
      }
    }
  },
  created () {
    this.getHHDTUList()
    this.getDep()
    this.getMent()
  },
  methods: {
    getHHDTUList () {
      this.$axios.post(`/HHDTU/GetHHDTUList`, {
        token: localStorage.getItem('token'), // 登录接口返回参数
        UsersID: localStorage.getItem('UsersID'),
        pageSize: this.pagesize,
        pageIndex: this.pageindex,
        DTUNum: this.DTUNum
      })
        .then(res => {
          this.HHDTUList = res.data.resultList
          this.total = res.data.total
        })
        .catch((e) => {
          console.log(e)
        })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getHHDTUList()
    },
    handleCurrentChange (val) {
      // 更新当前页
      this.pageindex = val
      // 重新发送请求
      this.getHHDTUList()
    },
    searchDTU () {
      this.pageindex = 1
      this.getHHDTUList()
    },
    showAddDialog () {
      this.dialogVisible = true
    },
    closeDialog () {
      this.$refs.form.resetFields()
    },
    addDTU () {
      this.$refs.form.validate()
      this.$axios.post(`/HHDTU/AddHHDTU`, {
        token: localStorage.getItem('token'),
        UsersID: localStorage.getItem('UsersID'),
        ...this.form
      })
        .then(res => {
          this.$message.success('添加成功')
          this.dialogVisible = false
          this.total++
          this.pageindex = Math.ceil(this.total / this.pagesize)
          // 重新渲染
          this.getHHDTUList()
        }).catch(e => {
          console.log(e)
        })
    },
    editDTU () {
      this.$axios.post(`/HHDTU/UpHHDTU`, {
        token: localStorage.getItem('token'),
        UsersID: localStorage.getItem('UsersID'),
        ...this.editForm
      })
        .then(res => {
          this.editVisible = false
          console.log(res)
          this.getHHDTUList()
        }).catch(e => {
          console.log(e)
        })
    },
    showEditDialog (row) {
      this.editVisible = true
      this.editForm.DTUID = row.DTUID
      this.editForm.DTUNum = row.DTUNum
      this.editForm.RealName = row.RealName
      this.editForm.UsersID = row.UsersID
      this.editForm.JLSZCollInterval = row.JLSZCollInterval
      this.editForm.GNSSCollInterval = row.GNSSCollInterval
      this.editForm.LongiTude = row.LongiTude
      this.editForm.LatiTude = row.LatiTude
      this.editForm.AltiTude = row.AltiTude
      this.editForm.WeatherStationCollInterval = row.WeatherStationCollInterval
      this.editForm.SynchronizationTime = row.SynchronizationTime
    },
    delDTU (row) {
      this.$confirm('亲, 你确认要删除么?', '温馨提示', {
        type: 'warning'
      }).then(res => {
        this.$axios.post(`/HHDTU/DelHHDTU`, {
          token: localStorage.getItem('token'),
          UsersID: localStorage.getItem('UsersID'),
          DTUID: row.DTUID
        })
          .then(res => {
            this.$message.success('删除成功')
            this.total--
            this.pageindex = Math.floor(this.total / this.pagesize)
            // 重新渲染
            this.getHHDTUList()
          })
      }).catch(e => {
        console.log(e)
      })
    },
    getDep () {
      this.$axios.post(`/HHUsers/GetUsersColumn`, {
        UsersID: localStorage.getItem('UsersID')
      })
        .then(res => {
          this.options = res.data.resultList
        }).catch(e => {
          console.log(e)
        })
    },
    getMent () {
      this.$axios.post(`/HHDTU/GetDTUColumn`, {
        UsersID: localStorage.getItem('UsersID'),
        token: localStorage.getItem('token')
      })
        .then(res => {
          this.loptions = res.data.resultList
        })
        .catch(e => {
          console.log(e)
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
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addBtn {
    margin-left: 10px;
  }
</style>
