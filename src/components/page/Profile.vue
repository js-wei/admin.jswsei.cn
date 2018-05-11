/*
 * File: d:\works\admin.jswei.cn\src\components\page\Profile.vue
 * Created Date: 2018-05-10 9:58:20
 * Author: 魏巍
 * -----
 * Last Modified: 魏巍
 * Modified By: 2018-05-11 5:07:49
 * -----
 * Copyright (c) 2018 魏巍
 * ------
 * All shall be well and all shall be well and all manner of things shall be well.
 * We're doomed!
 */

<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 账号</el-breadcrumb-item>
                <el-breadcrumb-item>基本设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" 
                    label-width="220px" class="demo-ruleForm">
                    <el-form-item label="账号">
                        <el-input  v-model="ruleForm2.username" auto-complete="off" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pass">
                        <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
                        <el-button @click="resetForm('ruleForm2')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import md5 from "js-md5";
export default {
  data: function() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        username: JSON.parse(sessionStorage.getItem("ms_username")).username,
        pass: "",
        checkPass: "",
        password: ""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          this.$message.error("缺少必要验证");
          return;
        }
        this.ruleForm2.password = md5(this.ruleForm2["pass"]);
        this.$store.commit("SHOW_LOADING");
        this.axios.post("save", this.ruleForm2).then(res => {
          res = res.data;
          if (!res || !res.status) {
            this.$message.error(res.msg || "出错了");
            return;
          }
          this.$message.success(res.msg);
          sessionStorage.removeItem("ms_username");
          setTimeout(() => {
            this.$store.commit("HIDE_LOADING");
            this.$router.push("/login");
          }, 3.5e3);
        });
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>

</style>