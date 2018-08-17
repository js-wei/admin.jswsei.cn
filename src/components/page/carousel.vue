/*
 * File: d:\works\admin.jswei.cn\src\components\page\column.vue
 * Created Date: 2018-05-14 8:33:49
 * Author: 魏巍
 * -----
 * Last Modified: 魏巍
 * Modified By: 2018-08-17 10:29:33
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
          <el-breadcrumb-item><i :class="metaIcon"></i>{{metaTitle}}管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="container">
        <div class="handle-box">
          <div class="pull-left">
            <el-button type="primary" class="handle-del mr10" 
              @click="delAll"><i class="icon icon-shanchu"></i>批量删除</el-button>
            <el-button type="danger" @click="add"><i class="icon icon-tianjia"></i>添加{{metaTitle}}</el-button>
            <el-button type="success" class="handle-del mr10"  disabled v-if="!tableData.length"
              @click="checkPic"><i :class="metaIcon"></i>轮播演示</el-button>
            <el-button type="success" class="handle-del mr10"  v-else
              @click="checkPic"><i :class="metaIcon"></i>轮播演示</el-button>
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
              <el-button type="primary" icon="el-icon-search" @click="search" class="pull-right ml-5">搜索</el-button>
          </div>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable" 
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="title" :label="metaTitle+'名称'">
            <template slot-scope="scope">
              <span v-html="scope.row.html"></span>
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="image" :label="metaTitle+'图片'">
              <template slot-scope="scope">
              <img :src="scope.row.image" :alt="scope.row.title" height="32">
            </template>
          </el-table-column>
          <el-table-column prop="url" :label="metaTitle+'链接'">
            <template slot-scope="scope">
              <span>{{scope.row.url|isDefault('未填写')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="tag" label="状态" width="100">
            <template slot-scope="scope">
              <a @click="changeStatus(scope.row)" class="pointer">
                <el-tag
                  :type="scope.row.status === '禁用' ? 'primary' : 'success'" disable-transitions>
                  {{scope.row.status}}
                </el-tag>
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" sortable width="150"></el-table-column>
          <el-table-column prop="create_time" label="添加时间" sortable width="150">
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
      <el-dialog :title="metaTitle+'管理'" :visible.sync="editVisible" width="40%" :close-on-click-modal="false">
        <el-form ref="form" :model="form" label-width="90px" :rules="rules" 
          style="width:85%;margin:0 auto;" autocomplete="off">
          <el-form-item :label="metaTitle+'名称'" prop="title">
            <el-input v-model="form.title" :placeholder="metaTitle+'名称'"></el-input>
          </el-form-item>
          <el-form-item :label="metaTitle+'名称'" prop="url">
            <el-input v-model="form.url" :placeholder="metaTitle+'链接地址(eg:http://baidu.com)'"></el-input>
          </el-form-item>
          <el-form-item :label="metaTitle+'图片'" prop="image">
            <el-upload
              class="upload-demo"
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
          <el-form-item :label="metaTitle+'说明'">
              <el-input type="textarea" v-model="form.description" :placeholder="metaTitle+'说明'"></el-input>
          </el-form-item>
          <el-form-item :label="metaTitle+'排序'">
            <el-input v-model="form.sort" :placeholder="metaTitle+'排序'"></el-input>
          </el-form-item>
          <el-form-item label="启用">
            <el-radio-group v-model="form.status">
              <el-radio label="正常" value="0"></el-radio>
              <el-radio label="禁用" value="1"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel('form')">取 消</el-button>
          <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 轮播演示 -->
      <el-dialog :title="metaTitle+'演示'" :visible.sync="isCarousel" width="40%" :close-on-click-modal="false">
        <div class="block">
          <el-carousel trigger="click">
            <el-carousel-item v-for="(item,index) in tableData" :key="index">
              <img :src="item.image" :alt="item.title" width="100%">
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-dialog>
      <!-- 删除提示框 -->
      <el-dialog title="提示" :visible.sync="delVisible" width="20%" center>
        <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteRow">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    let validateUrl = (rule, value, callback) => {
      let strRegex =
        '^((https|http|ftp|rtsp|mms)://)?[a-z0-9A-Z]{3}.[a-z0-9A-Z][a-z0-9A-Z]{0,61}?[a-z0-9A-Z].com|net|cn|cc (:s[0-9]{1-4})?/$'
      let re = new RegExp(strRegex)
      if (value !== '' && !re.test(value)) {
        callback(new Error('请填写正确的地址'))
        return
      }
      callback()
    }
    let validateImage = (rule, value, callback) => {
      if (!this.form.image) {
        callback(new Error('请上传图片'))
        return
      }
      callback()
    }
    return {
      fileList: [],
      tableData: [],
      cate_list: [],
      delList: [],
      editVisible: false,
      delVisible: false,
      isDelAll: false,
      isCarousel: false,
      current_page: 1,
      per_page: 5,
      totals: 0,
      select_word: '',
      select_type: '',
      select_date: '',
      row: [],
      form: {
        id: 0,
        title: '',
        url: '',
        description: '',
        image: '',
        sort: 100,
        status: '正常'
      },
      rules: {
        title: [
          {
            required: true,
            message: '请输入模块名称',
            trigger: 'blur'
          }
        ],
        url: [{ validator: validateUrl, trigger: 'blur' }],
        image: [
          {
            validator: validateImage,
            message: '请上传图片',
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
    metaTitle () {
      return this.$route.meta.title
    },
    metaIcon () {
      return `icon ${this.$route.meta.icon}`
    }
  },
  methods: {
    checkPic () {
      this.isCarousel = true
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
        this.deleteImage(file.url)
      }
    },
    handleSuccess (file) {
      if (!file) return
      this.form.image = file.path
    },
    deleteImage (path) {
      this.axios.delete('../posts', { params: { path: path } }).then(res => {
        res = res.data
        if (!res.status) {
          this.$message.error(res.msg)
          return
        }
        this.$message.success(res.msg)
        this.form.image = ''
      })
    },
    getData () {
      this.axios
        .get('/carousel', {
          params: {
            p: this.current_page,
            where: [
              { field: 'title', op: 'like', value: this.select_word },
              { field: 'status', op: 'eq', value: this.select_type },
              { field: 'create_time', op: 'between', value: this.select_date }
            ]
          }
        })
        .then(res => {
          res = res.data
          if (res.status) {
            res = res.result
            this.tableData = res.data
            this.cur_page = res.current_page
            this.totals = res.total
          }
        })
    },
    changeStatus (scope) {
      let status = scope.status === '正常' ? '禁用' : '正常'
      this.axios.put(`/carousel/${scope.id}?status=${status}`).then(res => {
        res = res.data
        if (!res.status) {
          this.$message.error(res.msg)
          return
        }
        this.getData()
      })
    },
    currentChange (value) {
      this.current_page = value
      this.getData(value)
    },
    search () {
      this.getData()
    },
    handleEdit (index, row) {
      this.fileList = []
      this.axios.get(`/carousel/${row.id}/edit`).then(res => {
        res = res.data
        if (!res.status) {
          this.$message.error(res.msg)
        }
        let data = res.result
        if (data.type === 6) {
          this.isRedirect = true
          this.last_url = data.url
        }
        this.fileList.push({
          name: data.title,
          url: data.image
        })
        this.form = {
          id: data.id,
          title: data.title,
          description: data.description,
          image: data.image,
          url: data.url,
          sort: data.sort,
          status: data.status
        }
      })
      this.editVisible = true
    },
    handleDelete (index, row) {
      this.idx = index
      this.row = row
      this.delVisible = true
    },
    delAll () {
      if (!this.delList.length) {
        this.$message.error('至少选择一条数据')
        return
      }
      this.isDelAll = true
      this.delVisible = true
    },
    handleSelectionChange (val) {
      val.forEach(item => {
        this.delList.push(item.id)
      })
    },
    // 保存编辑
    saveEdit (formName = 'form') {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        this.editVisible = false
        this.$store.commit('SHOW_LOADING')
        this.axios.post('/carousel', this.form).then(res => {
          res = res.data
          this.$store.commit('HIDE_LOADING')
          if (!res.status) {
            this.$message.error(res.msg)
          }
          this.$refs[formName].resetFields()
          this.form.keywords = ''
          this.form.description = ''
          this.getData()
          this.$message.success(res.msg)
        })
      })
    },
    // 确定删除
    deleteRow () {
      this.$store.commit('SHOW_LOADING')
      if (!this.isDelAll) {
        this.axios.delete(`/carousel/${this.row.id}`).then(res => {
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
        this.axios.delete(`/carousel/${this.delList.join('_')}`).then(res => {
          res = res.data
          this.$store.commit('HIDE_LOADING')
          if (!res.status) {
            this.$message.error(res.msg)
            return
          }
          this.delList = []
          this.getData()
          this.$message.success(res.msg)
        })
      }
      this.delVisible = false
    },
    add () {
      this.fileList = []
      this.form.id = 0
      this.form.srot = 100
      this.form.description = ''
      this.form.image = ''
      this.editVisible = true
    },
    cancel (formName) {
      this.fileList = []
      this.$refs[formName].resetFields()
      this.form.id = 0
      this.form.description = ''
      this.form.image = ''
      this.editVisible = false
    }
  }
}
</script>
<style>
.el-input__suffix {
  right: 4px;
}
</style>
<style lang="scss" scoped>
@import "../../assets/base";
.el-icon-date {
  padding-right: 4px;
}
.handle-box {
  margin-bottom: 20px;
  .handle-select {
    width: 120px;
  }
  .handle-input {
    width: 263px;
    display: inline-block;
  }
  .del-dialog-cnt {
    font-size: 16px;
    text-align: center;
  }
  button {
    height: 35px;
    float: left;
    margin-bottom: 10px;
    i {
      margin-right: 2px;
    }
  }
}
.iconfont_cell {
  font-size: 1.5rem;
}
</style>