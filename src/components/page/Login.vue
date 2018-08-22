<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm"
              class="ruleForm" autocomplete="off">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入用户名"
                      autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"
                      @keyup.enter.native="submitForm('ruleForm')" autocomplete="off"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <!-- <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
    </div>
</template>

<script>
import md5 from 'js-md5'
export default {
  data: function () {
    var validPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'))
      }
      callback()
    }
    return {
      ruleForm: {
        username: '524314430@qq.com',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ validator: validPassword, trigger: ['blur', 'change'] }]
      }
    }
  },
  created () {},
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return
        }
        this.ruleForm.pass = md5(this.ruleForm.password)
        delete this.ruleForm.password
        this.$store.commit('STE_LOADING_TEXT', '正在登陆中...')
        this.axios.post('/user', this.ruleForm).then(res => {
          this.$store.commit('HIDE_LOADING')
          this.$message.success(res.msg)
          this.$store.commit('SET_TOKEN', res.result.token)
          setTimeout(() => {
            this.$store.commit('SET_LOGIN', res.result)
            this.$store.commit('STE_LOADING_TEXT', null)
            let redirect = this.$route.query.redirect || '/'
            this.$router.push(redirect)
          }, 2e3)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #324157;
  .ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
  }
  .ms-login {
    left: 50%;
    width: 300px;
    height: 160px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
    position: absolute;
    top: 50%;
    .el-form {
      .login-btn {
        text-align: center;
        button {
          width: 100%;
          height: 36px;
        }
      }
    }
  }
}
</style>
<style>
.el-input--small .el-input__inner {
  width: 100% !important;
}
</style>
