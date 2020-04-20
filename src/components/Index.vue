<template>
  <el-container class="index">
    <el-header>
      <div class="left">
        <img src="../assets/系统界面LOGO.png" alt />
        <span></span> <p>自动监测化平台</p>
      </div>
      <!-- <div class="right">
        <div class="logout">
        <a href="javascript:;" @click="logout">退出</a>
        </div>
      </div> -->
      <div class="main"></div>

    </el-header>
    <el-container>
      <el-aside width="150px">
    <el-menu
      router
      unique-opened
      :default-active="defaultActive"
      background-color="#fff"
      text-color="#000"
      @select="handleSelect"
      active-text-color="#ffd04b">
       <div v-for="(item, index) in asidetable" :key="index">
      <el-submenu :index="item.MenuUrl" >
        <template slot="title">
          <i class="el-icon-office-building"></i>
          <span>{{item.MenuName}}</span>
        </template>
        <el-menu-item-group v-if="item.list">
          <div v-for="(lis,inde) in item.list" :key="inde">
           <el-menu-item :index="lis.MenuUrl" @click="getMenuNames(lis.MenuName)">{{lis.MenuName}}</el-menu-item>
          </div>
        </el-menu-item-group>
      </el-submenu>
       </div>
    </el-menu>

      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      asidetable: [],
      activeIndex: '1',
      activeIndex2: '1',
      // isCollapse: true
      nowUrl: ''
    }
  },
  computed: {
    defaultActive () {
      return this.$route.path.slice(0).split('-')[0]
    }
  },
  created () {
    this.asidefn()
  },
  methods: {
    asidefn () {
      this.$axios
        .post('/HHUsersAuthority/GetHHUsersAuthority', {
          token: localStorage.getItem('token'), // 登录接口返回参数
          UsersID: localStorage.getItem('UsersID')
        })
        .then(res => {
          // console.log(res)
          this.asidetable = res.data.query
        })
        .catch((e) => {
          console.log(e)
        })
    },
    logout () {
      this.$confirm('亲, 你确认要退出系统吗?', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除 token
          localStorage.removeItem('token')
          this.$router.push('/login')
          this.$message.success('退出成功')
        })
        .catch(() => {
          this.$message('退出已取消')
        })
    },
    handleSelect (key, keyPath) {
      this.nowUrl = key
    },
    getMenuNames (name) {
      if (name === '退出登录' && this.nowUrl === this.$route.path) {
        this.$confirm('亲, 你确认要退出系统吗?', '温馨提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
          // 删除 token
            localStorage.removeItem('token')
            this.$router.push('/login')
            this.$message.success('退出成功')
          })
          .catch(() => {
            this.$message('退出已取消')
          })
      }
    }
  }
}
</script>

<style lang="less" scoped>
/* 当我们给 style 标签添加 scoped 属性, 表示样式只在当前组件生效
   原理:
    1. 给当前组件上所有的元素, 都生成了一个随机的自定义属性
    2. 给当前组件上 style 中所有样式的选择器也添加了一个 属性选择器
*/
.index {
  height: 100%;
  .el-header {
    background-image: linear-gradient(to right, #2199ac , #16a39f , #0aae92);
    width: 100%;
    height: 60px;
    // display: flex;
    padding: 0;

    .left {
      float: left;
      width: 500px;
      height: 60px;
      // background-color: #2199ac;
      img {
        padding-top: 10px;
        margin-left: 20px;
        width: 180px;
        height: 40px;
        line-height: 40px;
        color: #fff;
      }
      span {
          display: inline-block;
          width: 2px;
          height: 35px;
          margin-left: 20px;
          background-color: #d7d7d7;
        }
        p {
          display: inline-block;
          text-align: center;
          font-size: 20px;
          margin-left: 20px;
          height: 35px;
          line-height: 35px;
          position: relative;
          top: -18%;
          color: #fff;
        }
    }
    .right {
      width: 200px;
      height: 60px;
      float: right;
      background-color: #0aae92;
    }
    .main {
      // background-color: #16a39f;
      height: 60px;
      overflow: hidden;
    }
    .title {
      flex: 1;
      text-align: center;

      h1 {
        font-size: 24px;
        height: 60px;
        line-height: 60px;
        color: #59b8c0;
      }
    }
    .logout {
      // margin-right: 30px;
      color: #ecf0f1;
      width: 200px;
      font-weight: 700;
      text-align: right;
      // padding: 10px 0 10px 10px;
      padding-top: 10px;
      line-height: 40px;
      a {
        color: #ccc;
        text-decoration: none
      }
    }
  }

  .el-aside {
    background-color: #f8f9fb;
    .el-menu {
      background-color: #fff;
    }
  }

  .el-main {
    background-color: #ffffff;
  }
}
</style>
