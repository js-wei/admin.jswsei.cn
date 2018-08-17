/*
 * File: d:\works\admin.jswei.cn\src\components\page\message.vue
 * Created Date: 2018-05-16 10:17:17
 * Author: 魏巍
 * -----
 * Last Modified: 魏巍
 * Modified By: 2018-08-17 10:18:18
 * -----
 * Copyright (c) 2018 魏巍
 * ------
 * All shall be well and all shall be well and all manner of things shall be well.
 * We're doomed!
 */
<template>
    <div class="message">
      <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i :class="metaIcon"></i> {{metaTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <div class="container">
        <div class="handle-box">
          <div class="pull-left">
            <el-button type="primary" class="handle-del" @click="delAll"><i class="icon icon-shanchu"></i> 批量删除</el-button>
            <el-button type="danger" @click="add"><i class="icon icon-tianjia"></i> 添加会员</el-button>
          </div>
          <div class="pull-right">
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input"></el-input>
            <el-date-picker
              v-model="select_date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :value-format="'yyyy-MM-dd HH:mm:ss'">
            </el-date-picker>
            <el-select v-model="select_type" placeholder="状态" class="handle-select">
              <el-option  label="全部" value=""></el-option>
              <el-option  label="正常" value="1"></el-option>
              <el-option  label="禁用" value="2"></el-option>
            </el-select>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
          </div>
        </div>
        <el-table :data="tableData" border ref="multipleTable" 
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="username" label="会员账号" width="200">
            <template slot-scope="scope">
              <a href="javascript:;" @click.stop="see(scope.$index, scope.row)">{{scope.row.username}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="pass" label="会员密码">
            <template slot-scope="scope">
              <el-button size="small" type="primary" 
                @click="resetPassword(scope.$index, scope.row.id)">重置密码</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="群组">
            <template slot-scope="scope">
              <a class="pointer" @click="checkGroup(scope.row)">
                <el-tag
                  :type="scope.row.gid == -1 ? 'danger' : 'primary'" 
                  disable-transitions>
                  <span v-if="scope.row.gid==-1">超级管理员</span>
                  <span v-else>{{scope.row.gid}}</span>
                </el-tag>
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="tag" label="状态" width="120">
            <template slot-scope="scope">
              <a @click="changeStatus(scope.row)" class="pointer">
                  <el-tag
                    :type="scope.row.status === '禁用' ? 'primary' : 'success'" 
                    disable-transitions>
                  {{scope.row.status}}
                </el-tag>
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="添加时间" sortable width="150">
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="primary" @click="handleAuth(scope.$index, scope.row.id)">配置权限</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="tableData.length"
          background
          layout="prev, pager, next"
          :total="totals"
          :page-size="per_page"
          class="mt-10"
          @current-change="currentChange">
        </el-pagination>
      </div>
      <!-- 编辑弹出框 -->
      <el-dialog :title="metaTitle" :visible.sync="editVisible" width="30%" :close-on-click-modal="false">
          <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form" auto-complete="off">
              <el-form-item label="会员账号" prop="username">
                  <el-input v-model="form.username" height="120"></el-input>
              </el-form-item>
              <el-form-item label="会员密码" prop="pass">
                  <el-input v-model="form.pass"></el-input>
                  <a class="pointer" @click="createPassword">生成密码</a>
              </el-form-item>
              <el-form-item label="状态">
                <el-radio-group v-model="form.status">
                  <el-radio label="正常" value="0"></el-radio>
                  <el-radio label="禁用" value="1"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item class="mt-20">
                  <el-button type="primary" @click="saveEdit('form')">提交</el-button>
                  <el-button @click="cancel('form')">取消</el-button>
              </el-form-item>
          </el-form>
      </el-dialog>
      <!-- 删除提示框 -->
      <el-dialog title="提示" :visible.sync="delVisible" width="20%" center>
          <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
          <span slot="footer" class="dialog-footer">
              <el-button @click="delVisible = false">取 消</el-button>
              <el-button type="primary" @click="deleteRow">确 定</el-button>
          </span>
      </el-dialog>
      <!-- 查看内容 -->
      <el-dialog
        title="查看账号"
        :visible.sync="detailVisible"
        width="30%">
        <div>
          <p>账号:{{detail.username}}</p>
          <p>密码:{{detail.pass}}</p>
          <p>生成方式:{{detail.type}}</p>
          <p>常用地址:{{detail.region}}</p>
          <p>添加时间:{{detail.create_time}}</p>
          <p>最后登录IP:{{detail.last_login_ip}}</p>
          <p>最后登录时间:{{detail.last_login_time|isDefault('未登录')}}</p>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="detailVisible=false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import md5 from 'js-md5'
export default {
  data () {
    return {
      tableData: [],
      editVisible: false,
      delVisible: false,
      detailVisible: false,
      select_word: '',
      select_type: '',
      select_date: '',
      current_page: 1,
      last_page: 0,
      per_page: 5,
      totals: 0,
      row: [],
      is_search: false,
      delList: [],
      detail: [],
      form: {
        id: 0,
        pass: '',
        username: '',
        password: '',
        status: '正常',
        gid: []
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        pass: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] }
        ]
      },
      idx: 0
    }
  },
  created () {
    this.getData()
  },
  computed: {
    metaTitle () {
      return this.$route.meta.title
    },
    metaIcon () {
      return 'icon ' + this.$route.meta.icon
    }
  },
  methods: {
    createPassword () {
      let text = [
        'abcdefghijklmnopqrstuvwxyz',
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        '1234567890'
      ]
      let rand = function (min, max) {
        return Math.floor(Math.max(min, Math.random() * (max + 1)))
      }
      let len = 16
      let pw = ''
      for (let i = 0; i < len; ++i) {
        let strpos = rand(0, 2)
        pw += text[strpos].charAt(rand(0, text[strpos].length))
      }
      this.form.pass = pw
    },
    handleEdit (index, scope) {
      this.axios.get(`/admin/${scope.id}/edit`).then(res => {
        res = res.data
        if (!res.status) {
          this.$message.error(res.msg)
          return
        }
        let data = res.result
        this.form = {
          id: data.id,
          pass: data.pass,
          username: data.username,
          status: data.status,
          gid: data.gid
        }
        this.selectUser = data.mid
        this.editVisible = true
      })
    },
    delAll () {
      if (!this.delList.length) {
        this.$message.error('至少选择一条数据')
        return
      }
      this.isDelAll = true
      this.delVisible = true
    },
    handleDelete (index, scope) {
      this.row = scope
      this.idx = index
      this.delVisible = true
    },
    deleteRow () {
      this.$store.commit('SHOW_LOADING')
      if (!this.isDelAll) {
        this.axios.delete(`/admin/${this.row.id}`).then(res => {
          this.$store.commit('HIDE_LOADING')
          res = res.data
          if (!res.status) {
            this.$message.error(res.msg)
            return
          }
          this.tableData.splice(this.idx, 1)
          this.$message.success(res.msg)
        })
      } else {
        let id = this.delList.join('_')
        this.axios.delete(`/admin/${id}`).then(res => {
          this.$store.commit('HIDE_LOADING')
          res = res.data
          if (!res.status) {
            this.$message.error(res.msg)
            return
          }
          this.delList = []
          this.isDelAll = false
          this.getData()
          this.$message.success(res.msg)
        })
      }
      this.delVisible = false
    },
    changeStatus (scope) {
      let status = scope.status === '正常' ? 1 : 0
      this.axios.put(`/admin/${scope.id}?status=${status}`).then(res => {
        res = res.data
        if (!res.status) {
          this.$message.error(res.msg)
          return
        }
        this.getData()
      })
    },
    search () {
      this.getData()
    },
    currentChange (value) {
      this.current_page = value
      this.getData()
    },
    handleChange (value, direction, movedKeys) {
      if (!this.selectUser) {
        // this.rules.userList
      }
    },
    handleSelectionChange (values) {
      this.delList = []
      values.forEach(item => {
        this.delList.push(item.id)
      })
    },
    saveEdit (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        this.editVisible = false
        this.form.status = this.form.sta === '正常' ? 1 : 2
        this.form.password = md5(this.form.pass)
        this.$store.commit('SHOW_LOADING')
        this.axios.post('/admin', this.form).then(res => {
          res = res.data
          this.$store.commit('HIDE_LOADING')
          if (!res.status) {
            this.$message.error(res.msg)
            return
          }
          this.$refs[formName].resetFields()
          this.$message.success(res.msg)
          this.getData()
        })
      })
    },
    add () {
      this.selectUser = []
      this.editVisible = true
      this.form.id = 0
      this.form.gid = []
      this.form.region = ''
      this.form.username = ''
    },
    see (index, scope) {
      this.axios.get(`/admin/${scope.id}`).then(res => {
        res = res.data
        if (!res.status) {
          return
        }
        this.detail = res.result
        this.detailVisible = true
      })
    },
    cancel (formName) {
      this.$refs[formName].resetFields()
      this.form.sta = '正常'
      this.editVisible = false
      this.form.id = 0
    },
    getData () {
      this.axios
        .get('/admin', {
          params: {
            p: this.current_page,
            where: [
              { field: 'username', op: 'like', value: this.select_word },
              { field: 'status', op: 'eq', value: this.select_type },
              { field: 'update_time', op: 'between', value: this.select_date }
            ]
          }
        })
        .then(res => {
          res = res.data
          if (!res.status) return
          res = res.result
          this.tableData = res.data
          this.current_page = res.current_page
          this.totals = res.total
          this.per_page = res.per_page
          this.last_page = res.last_page
        })
    },
    handleAuth (index, scope) {
      console.log(index, scope)
    },
    resetPassword (index, scope) {},
    checkGroup (scope) {
      console.log(scope)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/base";
.message {
  .form {
    width: 90%;
    margin: 0 auto;
  }
  .handle-box {
    height: auto;
    overflow: hidden;
    padding-bottom: 10px;
    .handle-input {
      width: 150px;
      display: inline-block;
    }
    .handle-select {
      width: 80px;
      .del-dialog-cnt {
        font-size: 16px;
        text-align: center;
      }
    }
  }
}
</style>
<style>
textarea.el-textarea__inner {
  height: 88px;
  resize: none;
}
.el-input--small .el-input__inner {
  width: 90%;
}
.el-cascader--small .el-input__suffix {
  right: 20px;
}
</style>

