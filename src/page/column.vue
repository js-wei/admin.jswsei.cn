<!--
@Author: 魏巍
@Date:   2018-07-08T15:25:57+08:00
@Email:  524314430@qq.com
@Filename: column.vue
@Last modified by:   魏巍
@Last modified time: 2019-05-05T00:17:26+08:00
@Copyright: free
-->

<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i>栏目</el-breadcrumb-item>
        <el-breadcrumb-item>栏目列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" class="handle-del mr10"
        @click="delAll"><i class="icon icon-shanchu"></i>批量删除</el-button>
        <el-button type="danger" @click="add"><i class="icon icon-tianjia"></i>添加栏目</el-button>
      </div>
      <el-table :data="tableData" border ref="multipleTable"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="title" label="栏目名称">
          <template slot-scope="scope">
            <span v-html="scope.row.html"></span>
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="栏目标识"></el-table-column>
        <el-table-column prop="type" label="栏目类型"></el-table-column>
        <el-table-column prop="sort" label="排序" sortable width="80"></el-table-column>
        <el-table-column prop="tag" label="状态" width="70">
          <template slot-scope="scope">
            <a @click="changeStatus(scope.row)" class="pointer">
              <el-tag
                :type="scope.row.status === '禁用' ? 'primary' : 'success'" disable-transitions>
                {{scope.row.status}}
              </el-tag>
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="操作时间" sortable width="150">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog title="栏目管理" :visible.sync="editVisible" width="45%"
      :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="90px" :rules="rules" style="width:85%;margin:0 auto;" autocomplete="off">
        <el-form-item label="栏目名称" prop="title">
          <el-input v-model="form.title" placeholder="栏目名称"></el-input>
        </el-form-item>
        <el-form-item label="栏目标识" prop="name">
          <el-input v-model="form.name" placeholder="栏目标识"></el-input>
        </el-form-item>
        <el-form-item label="所属栏目" prop="fid">
          <el-select v-model="form.fid" placeholder="所属栏目" class="handle-select mr10">
            <el-option key="0" label="顶级栏目" value="0"></el-option>
            <el-option :label="item.html+item.title" :value="item.id"
              v-for="item in cate_list" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词" class="small">
          <el-input type="textarea" v-model="form.keywords" placeholder="关键词"></el-input>
        </el-form-item>
        <el-form-item label="说明" class="small">
          <el-input type="textarea" v-model="form.description" placeholder="说明"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.type">
            <el-radio label="列表页" value="1"></el-radio>
            <el-radio label="下载页" value="2"></el-radio>
            <el-radio label="单页面" value="3"></el-radio>
            <el-radio label="封面页" value="4"></el-radio>
            <el-radio label="表单页" value="5"></el-radio>
            <el-radio label="跳转页" value="6"></el-radio>
          </el-radio-group>
          <el-input v-model="form.url" v-if="isRedirect" placeholder="跳转地址(http://baidu.com)" class="mt-10"></el-input>
        </el-form-item>
        <el-form-item label="栏目排序">
          <el-input v-model="form.sort" placeholder="栏目排序"></el-input>
        </el-form-item>
        <el-form-item label="启用">
          <el-radio-group v-model="form.sta">
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
    var validateFid = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择所属栏目'))
        return
      }
      callback()
    }
    return {
      tableData: [],
      cate_list: [],
      delList: [],
      editVisible: false,
      delVisible: false,
      isDelAll: false,
      isRedirect: false,
      last_url: '',
      type: 1,
      row: [],
      form: {
        id: 0,
        title: '',
        name: '',
        fid: '',
        keywords: '',
        description: '',
        sort: 100,
        sta: '正常',
        type: '列表页',
        url: ''
      },
      rules: {
        title: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
        name: [{ required: true, message: '请输入栏目标识', trigger: 'blur' }],
        fid: [{ validator: validateFid, trigger: 'change' }]
      }
    }
  },
  created () {
    this.getData()
  },
  watch: {
    'form.type' (newValue, oldValue) {
      this.isRedirect = false
      switch (newValue) {
        case '下载页':
          this.type = 2
          break
        case '单页面':
          this.type = 3
          break
        case '封面页':
          this.type = 4
          break
        case '表单页':
          this.type = 5
          break
        case '跳转页':
          this.type = 6
          this.isRedirect = true
          break
        default:
          this.type = 1
      }
    }
  },
  methods: {
    getData () {
      this.axios
        .get('/column', {
          where: [
            { field: 'title', op: 'eq', value: this.select_word },
            { field: 'status', op: 'eq', value: this.select_cate },
            { field: 'date', op: 'between', value: this.select_date }
          ]
        })
        .then(res => {
          if (res.status) {
            this.tableData = res.result
            this.cur_page = res.current_page
            this.totals = res.last_page
          }
        })
      this.axios.get('/navbar?tree=1&status=1').then(res => {
        if (!res.status) {
          return
        }
        let data = res.result
        this.$store.commit('SET_NAVBAR', data)
      })
    },
    changeStatus (scope) {
      let status = scope.status === '正常' ? 1 : 0
      this.axios.put(`/column/${scope.id}?status=${status}`).then(res => {
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
    handleEdit (index, row) {
      this.getCateList()
      this.axios.get(`/column/${row.id}/edit`).then(res => {
        if (!res.status) {
          this.$message.error(res.msg)
        }
        let data = res.result
        if (data.type === 6) {
          this.isRedirect = true
          this.last_url = data.url
        }
        this.form = {
          id: data.id,
          title: data.title,
          name: data.name,
          fid: data.fid,
          keywords: data.keywords,
          description: data.description,
          sort: data.sort,
          sta: data.status,
          type: data.type,
          url: data.url
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
    saveEdit (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        this.editVisible = false
        this.form.status = this.form.sta === '正常' ? 0 : 1
        this.form.type = this.type
        this.$store.commit('SHOW_LOADING')
        this.axios.post('/column', this.form).then(res => {
          this.$store.commit('HIDE_LOADING')
          if (!res.status) {
            this.$message.error(res.msg)
            return
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
        this.axios.delete(`/column/${this.row.id}`).then(res => {
          this.$store.commit('HIDE_LOADING')

          if (!res.status) {
            this.$message.error(res.msg)
          }
          this.tableData.splice(this.idx, 1)
          this.$message.success(res.msg)
        })
      } else {
        this.axios.delete(`/column/${this.delList.join('_')}`).then(res => {
          this.$store.commit('HIDE_LOADING')
          if (!res.status) {
            this.$message.error(res.msg)
          }
          this.delList = []
          this.getData()
          this.$message.success(res.msg)
        })
      }
      this.delVisible = false
    },
    add () {
      this.getCateList()
      this.form.id = 0
      this.form.type = '列表页'
      this.form.srot = 100
      this.editVisible = true
    },
    cancel (formName) {
      this.$refs[formName].resetFields()
      this.form.keywords = ''
      this.form.description = ''
      this.editVisible = false
    },
    getCateList () {
      this.axios.get('/column_list').then(res => {
        if (!res.status) {
          return
        }
        this.cate_list = res.result
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/base";
.el-icon-date {
  padding-right: 4px;
}
.handle-box {
  margin-bottom: 20px;
  .handle-select {
    width: 120px;
  }
  .handle-input {
    width: 300px;
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
.el-radio {
  margin: 10px 20px 0 0;
}
</style>
