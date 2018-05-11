<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="pass">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.pass" 
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
import md5 from "js-md5";
export default {
  data: function() {
    return {
      ruleForm: {
        username: "524314430@qq.com",
        pass: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        pass: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      const self = this;
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return;
        }
        this.ruleForm.password = md5(this.ruleForm.pass);
        this.$store.commit('SHOW_LOADING');
        this.$store.commit('STE_LOADING_TEXT','正在登陆中...');
        this.axios.post("/user", this.ruleForm).then(res => {
          if (res.status !== 200) {
            this.$message.error("服务器错误");
          }
          res = res.data;
          if (!res.status) {
            this.$message.error(res.msg);
          }
          this.$store.commit("SET_LOGIN", res.result);
          setTimeout(() => {
            this.$store.commit('STE_LOADING_TEXT',null);
            this.$store.commit('HIDE_LOADING');
            this.$message.success(res.msg);
            sessionStorage.setItem("ms_username", JSON.stringify(res.result));
            self.$router.push("/");
          }, 3.5e3);
        });
      });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
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
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 160px;
  margin: -150px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
  background: #fff;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
}
</style>