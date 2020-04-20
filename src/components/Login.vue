<template>
  <div class="login">
    <div class="left">
      <img src="../assets/Snipaste_2020-02-17_10-01-02.png" alt="logo">
    </div>
    <div class="right">
        <div class="top">
          <img src="../assets/登录界面logo.png" alt=""> <span></span> <p>自动监测化平台</p>
        </div>
      <div class="bottom">
        <el-form ref="form" status-icon :model="form" :rules="rules" label-width="80px">
          <p class="user">账号</p>
      <el-form-item prop="username">
        <el-input @keyup.enter.native="login" v-model="form.username"  placeholder="请输入用户名"></el-input>
      </el-form-item>
       <p class="user">密码</p>
      <el-form-item prop="password">
        <el-input @keyup.enter.native="login" v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <p class="user">验证码</p>
      <el-form-item prop="seccode" class="inputbar">
            <el-input
              class="log-input"
              v-model="form.seccode"
              placeholder="请输入验证码"
              prefix-icon="icon-login_auth"
              @keydown.enter.native="login('form')"
            ></el-input>
            <span class="checkCode stybd" @click="createCode">{{checkCode}}</span>
          </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">立即登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      form: {
        Account: 'test',
        password: 'test'
      },
      checkCode: '',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '密码长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        seccode: [
          { required: true, message: '请输验证码', trigger: ['blur', 'change'] },
          { min: 4, max: 4, message: '验证码输入有误', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  mounted () {
    this.createCode()
  },
  methods: {
    ...mapMutations(['setToken']),
    async login () {
      try {
        await this.$refs.form.validate()
        // 校验成功, 发送ajax
        const res = await this.$axios.post(`/HHLogin/Login`, this.form)
        // 把token存储起来
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('UsersID', res.data.data.UsersID)
        // 编程式导航
        this.$router.push(`/index`)
        this.ErrMmsg('登陆成功')
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    resetForm () {
      // 通过 ref 拿到 el-form 组件, 调用重置方法
      this.$refs.form.resetFields()
    },
    createCode () {
      var code = ''
      const codeLength = 4 // 验证码的长度
      var randarr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
      var random = new Array(...randarr) // 随机数
      for (let i = 0; i < codeLength; i++) {
        // 循环操作
        let index = Math.floor(Math.random() * 62)
        // 取得随机数的索引（0~35）
        // console.log(index, 1)
        code += random[index] // 根据索引取得随机数加到code上
      }
      this.checkCode = code // 把code值赋给验证码
    }
  }
}
</script>

<style lang="less" scoped>
.stybd{
    background: rgb(176, 195, 230);
    display: block;
    width: 20%;
    text-align: center;
    float: right;
    position: absolute;
    right: 0;
    top: 0px;
}
.login {
  width: 100%;
  height: 100%;
  list-style: none;
  background: #fff;
  overflow: hidden;
     .left {
       float: left;
       width: 30%;
       height: 100%;
      // background-color: red;
       img {
         width: 100%;
         height: 100%
       }
     }
     .right {
       float: right;
       width: 70%;
       height: 100%;
      //  background-color: green;
      .top {
        width: 550px;
        height: 150px;
        // border: 1px solid #ccc;
        margin: 100px auto;
        img {
          width: 200px;
          // height: 120px;
          line-height: 88px;
        }
        span {
          display: inline-block;
          width: 2px;
          height: 80px;
          margin-left: 30px;
          background-color: #d7d7d7;
        }
        p {
          display: inline-block;
          text-align: center;
          font-size: 35px;
          margin-left: 30px;
          height: 120px;
          line-height: 120px;
          position: relative;
          top: -20%;
        }
      }
     }
    .bottom {
      padding-top: 10px;
      width: 800px;
      margin: auto;
      // border: 1px solid #000;
      position: relative;
      top: -10%;
      .el-form {
      width: 600px;
      background-color: #fff;
      position: relative;
      left: 5%;
      .user {
        padding-bottom: 8px;
        margin-left: 15%;
      }
   }
    }
}
</style>
