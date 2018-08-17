/*
 * File: d:\works\admin.jswei.cn\src\components\page\setting.vue
 * Created Date: 2018-05-29 11:26:31
 * Author: 魏巍
 * -----
 * Last Modified: 魏巍
 * Modified By: 2018-05-30 11:11:49
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
        <el-breadcrumb-item><i :class="current.icon"></i>{{current.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" 
        label-width="100px" class="ruleForm">
        <h2 class="conact-title">网站基本信息</h2>
        <hr class="mb-10">
        <el-form-item label="网站名称" prop="title" class="w-60">
          <el-input v-model="ruleForm.title" placeholder="网站名称"></el-input>
        </el-form-item>
        <el-form-item label="网站LOGO" prop="logo">
          <el-upload
            action="http://api.jswei.cn/posts/"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
            list-type="picture"
            :multiple="false"
            name="image">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="网站域名" prop="url" class="w-80">
          <el-input v-model="ruleForm.url" placeholder="网站域名(eg:https://baidu.com)"></el-input>
        </el-form-item>
        <el-form-item label="网站关键词" class="textarea">
          <el-input type="textarea" v-model="ruleForm.keywords" placeholder="网站关键词"></el-input>
        </el-form-item>
        <el-form-item label="网站说明" class="textarea">
          <el-input type="textarea" v-model="ruleForm.description" 
            placeholder="网站说明"></el-input>
        </el-form-item>
        <el-form-item label="关闭网站">
          <el-switch v-model="ruleForm.status"></el-switch>
        </el-form-item>
        <el-form-item label="备案号" class="w-60">
          <el-input v-model="ruleForm.icp" placeholder="备案号"></el-input>
        </el-form-item>
        <el-form-item label="版权信息" class="w-60">
          <el-input v-model="ruleForm.copyright" placeholder="版权信息"></el-input>
        </el-form-item>
        <el-form-item label="分享代码" class="textarea">
          <el-input type="textarea" v-model="ruleForm.shard" placeholder="分享代码"></el-input>
        </el-form-item>
        <el-form-item label="统计代码" class="textarea">
          <el-input type="textarea" v-model="ruleForm.code" placeholder="统计代码"></el-input>
        </el-form-item>
        <h2 class="conact-title">网站联系人信息</h2>
        <hr class="mb-10">
        <el-form-item label="联系人" class="w-60">
          <el-input v-model="ruleForm.conact" placeholder="联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" class="w-60">
          <el-input v-model="ruleForm.tel" placeholder="联系方式(手机或固话)"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" class="w-60">
          <el-input v-model="ruleForm.company" placeholder="公司名称"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" class="w-60">
          <el-input v-model="ruleForm.address" placeholder="公司地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="goback">返回</el-button>
      </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    let validateUrl = (rule, value, callback) => {
      let strRegex =
        '^((https|http|ftp|rtsp|mms)://)?[a-z0-9A-Z]{3}.[a-z0-9A-Z][a-z0-9A-Z]{0,61}?[a-z0-9A-Z].com|net|cn|cc (:s[0-9]{1-4})?/$'
      let re = new RegExp(strRegex)
      if (!value) {
        callback(new Error('请填写地址'))
        return
      }
      if (!re.test(value)) {
        callback(new Error('请填写正确的地址'))
        return
      }
      callback()
    }
    let validateImage = (rule, value, callback) => {
      if (!this.ruleForm.logo) {
        callback(new Error('请上传图片'))
        return
      }
      callback()
    }
    return {
      fileList: [],
      ruleForm: {
        id: 0,
        title: '',
        url: '',
        logo: '',
        delivery: false,
        keywords: '',
        description: '',
        company: '',
        address: '',
        conact: '',
        icp: '',
        copyright: '',
        shard: '',
        code: '',
        status: false
      },
      rules: {
        title: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
        url: [
          {
            validator: validateUrl,
            trigger: 'blur'
          }
        ],
        checklogo: [
          {
            validator: validateImage,
            trigger: 'change'
          }
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  computed: {
    ...mapState({
      current: state => state.mutations.activeBar
    })
  },
  methods: {
    getData () {
      this.axios.get('/setting').then(res => {
        this.fileList = []
        res = res.data
        if (res.status) {
          this.ruleForm = res.result
          if (res.result.logo) {
            this.fileList.push({
              title: 'logo',
              url: res.result.logo
            })
          }
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        this.$store.commit('SHOW_LOADING')
        this.ruleForm.status = (this.ruleForm.status === true) ? 1 : 0
        this.axios.post('/settings', this.ruleForm).then(res => {
          res = res.data
          this.$store.commit('HIDE_LOADING')
          if (!res.status) {
            this.$message.error(res.msg)
            return
          }
          this.$refs[formName].resetFields()
          this.getData()
          this.$message.success(res.msg)
        })
      })
    },
    goback (formName) {
      this.$router.back()
    },
    beforeAvatarUpload (file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpeg/jpg/png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleRemove (file) {
      if (file.response) {
        let path = file.response.path
        this.deleteImage(path)
      } else {
        this.deleteImage(file.path)
      }
    },
    handleSuccess (file) {
      if (!file.status) return
      this.ruleForm.logo = file.path
    },
    deleteImage (path) {
      this.axios.delete(`../posts`, { params: { path: path } }).then(res => {
        res = res.data
        if (!res.status) {
          this.$message.error(res.msg)
          return
        }
        this.$message.success(res.msg)
        this.ruleForm.logo = ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/base";
.ruleForm {
  width: 50%;
  margin-left: 50px;
  .textarea {
    height: 120px;
  }
  .conact-title {
    color: #606266;
    padding-bottom: 10px;
  }
}
</style>
<style>
.el-textarea__inner {
  height: 120px;
  resize: none;
}
</style>