<template>
  <div class="users">
    <!-- tabs标签页 -->
     <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
       <el-tab-pane label="首页" name="first"><p class="index">首页</p>
       <!-- 上面 -->
       <div class="center">
         <div class="header">
           <p>统计</p>

           <div class="number">项目数量</div>
           <el-progress :text-inside="true" :stroke-width="26" :percentage="70"></el-progress>

           <div class="number">DTU数量</div>
          <el-progress :text-inside="true" :stroke-width="24" :percentage="100" status="success"></el-progress>

           <div class="number">传感器数量</div>
          <el-progress :text-inside="true" :stroke-width="22" :percentage="80" status="warning"></el-progress>
         </div>

         <div class="header">
           <p>预警信息折线图</p>
           <div ref="echartp1" :style="{width: '100%', height: '230px'}"></div>
         </div>
       </div>

    <!-- 下面 -->
      <div class="bottom">
        <div class="buch">
          <p>昨日预警信息/本日预警信息饼图</p>
          <div ref="echartp2" :style="{width: '100%', height: '200px'}"></div>
        </div>
        <div class="buch">
          <p>DTU正常工作数量/故障数量饼图</p>
          <div ref="echartp3" :style="{width: '100%', height: '200px'}"></div>
        </div>
      </div>
       </el-tab-pane>
       <el-tab-pane label="用户" name="second">
         <!-- 搜索框 -->
    <el-input placeholder="请输入要查询关键字" v-model="RealName" class="input-with-select"
    @keyup.enter.native="searchUser">
      <el-button @click="searchUser" slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <!-- 添加框 -->
    <el-button class="addBtn" type="success" plain @click="showAddDialog">添加</el-button>
         <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="RealName"
        label="姓名">
        <template slot-scope="scope">
           <template v-if="!showedit">{{scope.row.RealName}}</template>
          <template v-else>
            <el-input v-model="scope.row.RealName" size="small"></el-input>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="Account"
        label="账号">
      </el-table-column>
      <el-table-column
        prop="Password"
        label="密码">
        <template slot-scope="scope">
           <template v-if="!showedit">{{scope.row.Password}}</template>
          <template v-else>
            <el-input v-model="scope.row.Password" size="small"></el-input>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="HeadIcon"
        label="头像">
         <template slot-scope="scope">
           <template v-if="!showedit">{{scope.row.HeadIcon}}</template>
          <template v-else>
            <el-input v-model="scope.row.HeadIcon" size="small"></el-input>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="CompanyUnit"
        label="单位">
         <template slot-scope="scope">
          <template v-if="!showedit">{{scope.row.CompanyUnit}}</template>
          <template v-else>
            <el-input v-model="scope.row.CompanyUnit" size="small"></el-input>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="Phone"
        label="电话">
         <template slot-scope="scope">
           <template v-if="!showedit">{{scope.row.Phone}}</template>
          <template v-else>
            <el-input v-model="scope.row.Phone" size="small"></el-input>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="CreationTime"
        label="创建时间">
         <template slot-scope="scope">
           <span>{{scope.row.CreationTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button v-if="!showedit" @click="showEditDialog(scope.row)" size="small" icon="el-icon-edit" plain type="primary"></el-button>
            <el-button @click="delUser(scope.row)" size="small" icon="el-icon-delete" plain type="danger"></el-button>
            <el-button @click="showAssignVisible(scope.row)" type="info" icon="el-icon-plus" size="small" plain></el-button>
          </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限对话框 -->
    <el-dialog title="功能授权" :visible.sync="assignVisible"
    width="25%">
     <!-- 树形控件 -->
     <!-- show-checkbox:节点是否可被选择 default-expand-all:是否默认展开所有节点  node-key:每个树节点用来作为唯一标识的属性，整棵树应该是唯一的  ref:ref 被用来给DOM元素或子组件注册引用信息  props:配置选项 -->
      <el-tree :data="roleList" show-checkbox default-expand-all node-key="id" ref="tree" :props="defaultProps" @check-change="handleCheckChange">
      </el-tree>
     <template v-slot:footer>
       <span class="dialog-footer">
       <el-button @click="assignVisible = false">取 消</el-button>
       <el-button type="primary" @click="assignRights">分配</el-button>
     </span>
     </template>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageindex"
      :page-size="pagesize"
      :total="total"
      :page-sizes="[2, 4, 6, 8, 10]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 添加 -->
    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      @close = "closeDialog"
      width="30%">

      <el-form :rules="rules" ref="form" :model="form" label-width="80px">
        <el-form-item label="账号" prop="Account">
          <el-col :span="16">
            <el-input v-model="form.Account"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="密码" prop="Password">
          <el-col :span="16">
            <el-input v-model="form.Password" type="password"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="姓名" prop="RealName">
          <el-col :span="16">
            <el-input v-model="form.RealName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="单位名称" prop="CompanyUnit">
          <el-col :span="16">
             <el-input v-model="form.CompanyUnit"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="手机号" prop="Phone">
          <el-col :span="16">
            <el-input v-model="form.Phone"></el-input>
          </el-col>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button @click="addUser" type="primary">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog
      title="修改"
      :visible.sync="editVisible"
      width="30%">

      <el-form :rules="rules" ref="editForm" :model="editForm" label-width="80px">
        <el-form-item label="账号" prop="Account">
          <el-col :span="16">
            <el-tag type="info">{{ editForm.Account }}</el-tag>
          </el-col>
        </el-form-item>
        <el-form-item label="密码" prop="Password">
          <el-col :span="16">
            <el-input type="password" v-model="editForm.Password"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="姓名" prop="RealName">
          <el-col :span="16">
            <el-input v-model="editForm.RealName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="单位名称" prop="CompanyUnit">
          <el-col :span="16">
             <el-input v-model="editForm.CompanyUnit"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="手机号" prop="Phone">
          <el-col :span="16">
            <el-input v-model="editForm.Phone"></el-input>
          </el-col>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button @click="editUser" type="primary">确 定</el-button>
        </span>
      </template>
    </el-dialog>
</el-tab-pane>
     </el-tabs>

     </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first',
      userList: [],
      showedit: false,
      assignVisible: false,
      total: 0,
      value: '',
      UsersId: '',
      MenuId: '',
      // 当前页
      pageindex: 1,
      // 每页条数
      pagesize: 4,
      RealName: '',
      dialogVisible: false,
      editVisible: false,
      form: {
        Account: '',
        Password: '',
        CompanyUnit: '',
        RealName: '',
        Phone: '',
        HeadIcon: ''
      },
      editForm: {
        Account: '',
        Password: '',
        CompanyUnit: '',
        RealName: '',
        Phone: '',
        HeadIcon: '',
        UsersID: ''
      },
      roleList: [],
      defaultProps: [{
        id: 'MenuId',
        label: 'label'
      }],
      rules: {
        Account: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        Password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        Phone: [
          { required: false, message: '请输入手机号', trigger: 'blur' },
          { message: '请输入正确的手机号', pattern: /^1\d{10}$/, trigger: 'blur' }
        ],
        CompanyUnit: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
        RealName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ]
      },
      MenuID: '',
      UsersID: ''
    }
  },
  created () {
    this.getUserList()
  },
  mounted () {
    this.zhechart()
    this.bingchart()
    this.bingchart1()
  },
  methods: {
    handleClick (tab, event) {
    },
    zhechart () {
      var chart1 = this.$refs.echartp1
      // 初始化图表
      const zhechart1 = this.$echarts.init(chart1)
      zhechart1.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          areaStyle: {}
        }]
      })
    },
    bingchart () {
      var chart2 = this.$refs.echartp2
      const bingchart2 = this.$echarts.init(chart2)
      bingchart2.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ]
          }
        ]
      })
    },
    bingchart1 () {
      var chart3 = this.$refs.echartp3
      const bingchart3 = this.$echarts.init(chart3)
      bingchart3.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ]
          }
        ]
      })
    },
    getUserList () {
      this.$axios.post(`/HHUsers/SelectUserList`, {
        UsersID: localStorage.getItem('UsersID'),
        pageSize: this.pagesize,
        pageIndex: this.pageindex,
        RealName: this.RealName
      })
        .then(res => {
          this.userList = res.data.resultList
          this.total = res.data.total
        }).catch(e => {
          console.log(e)
        })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      // 更新当前页
      this.pageindex = val
      // 重新发送请求
      this.getUserList()
    },
    // 模态框显示
    showAddDialog () {
      this.dialogVisible = true
    },
    // 用户修改模态框
    showEditDialog (row) {
      this.editVisible = true
      this.editForm.Account = row.Account
      this.editForm.Password = row.Password
      this.editForm.CompanyUnit = row.CompanyUnit
      this.editForm.Phone = row.Phone
      this.editForm.RealName = row.RealName
      this.editForm.UsersID = row.UsersID
    },
    // 用户删除
    delUser (row) {
      // console.log(row.UsersID)// 打印出来看看看哪个id  row.id  发送请求参数 id: row.id  具体参数名 根据文档
      this.$confirm('亲, 你确认要删除么?', '温馨提示', {
        type: 'warning'
      }).then(res => {
        this.$axios.post(`/HHUsers/DelHHUsers`, {
          token: localStorage.getItem('token'),
          UsersID: row.UsersID
        })
          .then(res => {
            this.$message.success('删除成功')
            this.total--
            this.pageindex = Math.floor(this.total / this.pagesize)
            // 重新渲染
            this.getUserList()
          })
      }).catch(e => {
        console.log(e)
      })
    },
    closeDialog () {
      // console.log('关闭了, 触发了方法')
      this.$refs.form.resetFields()
    },
    addUser () {
      this.$refs.form.validate()
      this.$axios.post(`/HHUsers/AddHHUsers`, {
        token: localStorage.getItem('token'),
        UsersId: localStorage.getItem('UsersID'),
        ...this.form
      }
      )
        .then(res => {
          this.$message.success('添加成功')
          this.dialogVisible = false
          this.total++
          this.pageindex = Math.ceil(this.total / this.pagesize)
          // 重新渲染
          this.getUserList()
        }).catch(e => {
          console.log(e)
        })
    },
    editUser () {
      this.$axios.post(`/HHUsers/UpHHUsers`, {
        token: localStorage.getItem('token'),
        ...this.editForm
      })
        .then(res => {
          this.editVisible = false
          this.getUserList()
        }).catch(e => {
          console.log(e)
        })
    },
    searchUser () {
      this.pageindex = 1
      this.getUserList()
    },
    showAssignVisible (row) {
      // console.log(row)
      this.UsersID = row.UsersID
      this.assignVisible = true
      this.$axios.post(`/HHPage/GetHHPageList`)
        .then(res => {
          // console.log(res)
          this.roleList = res.data
          this.roleList = res.data.map(item => {
            return {
              id: item.MenuId,
              label: item.MenuName,
              children: item.resultList && item.resultList.map(its => {
                return {
                  id: its.MenuId,
                  label: its.MenuName
                }
              })
            }
          })
        }).catch(e => {
          console.log(e)
        })
    },
    // 分配权限
    assignRights () {
      // const jsondata = [{
      //   'UsersID': this.UsersID,
      //   'MenuId': this.MenuId
      // }]
      const params = new FormData()
      params.append('UsersID', this.UsersID)
      params.append('MenuId', this.MenuId)
      this.$axios.post(`/HHUsersAuthority/AddHHUsersAuthority`, params)
        .then(res => {
          console.log(res)
        }).catch(e => {
          console.log(e)
        })
    },
    handleCheckChange (e) {
      this.MenuId = e.id
    }
  }
}
</script>

<style lang="less">
 .users {
   height: 100%;
   .index {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  margin-left: 25px;
}
  .center {
    display: flex;
    height: 250px;
    .header {
      flex: 1;
    margin: 6px 6px;
    height: 250px;
    border: 1px solid darkgray;
    p {
      text-align: center;
      height: 40px;
      line-height: 40px;
      background-color: #f6f6f6;
      margin-bottom: 20px;
    }
    .number {
      text-align: center;
    }
    }
  }
  .bottom {
    margin-top: 10px;
    display: flex;
    height: 250px;
    border-bottom: 1px solid #ccc;
    .buch {
      flex: 1;
    margin: 6px 6px;
    height: 250px;
    border: 1px solid darkgray;
    p {
      text-align: center;
      height:  40px;
      line-height: 40px;
      background-color: #f6f6f6;
    }
    }
  }
  .el-pagination {
    margin-top: 15px;
  }
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
   .addBtn {
    margin-left: 10px;
 }
 }
</style>
