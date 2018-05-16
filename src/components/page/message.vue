/*
 * File: d:\works\admin.jswei.cn\src\components\page\message.vue
 * Created Date: 2018-05-16 10:17:17
 * Author: 魏巍
 * -----
 * Last Modified: 魏巍
 * Modified By: 2018-05-16 4:35:08
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
                <el-breadcrumb-item><i class="el-icon-message"></i> 消息管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
               <div class="pull-left">
                    <el-button type="primary" class="handle-del"><i class="iconfont icon-shanchu"></i> 批量删除</el-button>
                    <el-button type="danger" @click="add"><i class="iconfont icon-tianjia"></i> 发布消息</el-button>
               </div>
               <div class="pull-right">
                    <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input"></el-input>
                    <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                    <el-select v-model="select_type" placeholder="状态" class="handle-select">
                        <el-option key="" label="全部" value=""></el-option>
                        <el-option key="1" label="正常" value="0"></el-option>
                        <el-option key="2" label="禁用" value="1"></el-option>
                    </el-select>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
               </div>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" 
              @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="content" label="内容" >
                    <template slot-scope="scope">
                        <a class="pointer" @click="see(scope.$index,scope.row)">{{scope.row.content|sub_string(20,true)}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="tag" label="标签" width="100">
                  <template slot-scope="scope">
                    <el-tag
                      :type="scope.row.status === '禁用' ? 'primary' : 'success'" disable-transitions>
                      {{scope.row.status}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="update_time" label="操作时间" sortable>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totals"
                :page-size="per_page"
                class="mt-10"
                @current-change="currentChange">
            </el-pagination>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="消息管理" :visible.sync="editVisible" width="50%" :show-close="false">
            <el-form :model="form" :rules="rules" ref="form" label-width="50px" class="form" auto-complete="off">
                <el-form-item label="标题" prop="title">
                    <el-input  v-model="form.title" height="120"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item label="用户" prop="userList">
                    <el-transfer  :titles="['可选用户', '已选用户']"
                    v-model="selectUser" :data="userList"  @change="handleChange"></el-transfer>
                </el-form-item>
                <el-form-item label="类型">
                  <el-radio-group v-model="form.type">                    
                    <el-radio label="系统" value="1"></el-radio>
                    <el-radio label="降价" value="2"></el-radio>
                    <el-radio label="优惠" value="3"></el-radio>
                    <el-radio label="其他" value="4"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="启用">
                  <el-radio-group v-model="form.sta">
                    <el-radio label="是" value="0"></el-radio>
                    <el-radio label="否" value="1"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item class="mt-20">
                    <el-button type="primary" @click="saveEdit('form')">提交</el-button>
                    <el-button @click="cancel('form')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            :title="detail.title"
            :visible.sync="detailVisible"
            width="30%">
            <span>{{detail.content}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="detailVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    var validateUser = (rule, value, callback) => {
      if (!this.selectUser.length && this.editVisible) {
        callback(new Error("请选择用户"));
        return;
      }
      callback();
    };
    return {
      tableData: [],
      editVisible: false,
      delVisible: false,
      detailVisible: false,
      select_word: "",
      select_type: "",
      select_date: "",
      current_page: 0,
      per_page: 5,
      totals: 0,
      is_search: false,
      delList: [],
      dateRange: "",
      detail: [],
      form: {
        mid: "",
        title: "",
        content: "",
        type: "系统",
        sta: "是"
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        userList: [{ validator: validateUser, trigger: "change" }]
      },
      userList: [
        {
          key: 0,
          label: "所有用户",
          disabled: false
        }
      ],
      selectUser: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    search() {
      this.getData();
    },
    currentChange(value) {
      this.current_page = value;
      this.getData(value);
    },
    handleChange(value, direction, movedKeys) {
      if (!this.selectUser) {
        this.rules.userList;
      }
    },
    handleSelectionChange(val) {
      val.forEach(item => {
        this.delList.push(item.id);
      });
    },
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        }
        this.editVisible = false;
        this.form.status = this.form.sta == "是" ? 0 : 1;
        this.form.mid = this.selectUser.join(",");
        this.$store.commit("SHOW_LOADING");
        this.axios.post("/message", this.form).then(res => {
          res = res.data;
          this.$store.commit("HIDE_LOADING");
          if (!res.status) {
            this.$message.error(res.msg);
          }
          this.$refs[formName].resetFields();
          this.$message.success(res.msg);
        });
      });
    },
    add() {
      this.form.type = "系统";
      this.form.sta = "是";
      this.selectUser = [];
      this.editVisible = true;
    },
    see(index, scope) {
      this.axios.get(`/message/${scope.id}`).then(res => {
        res = res.data;
        if (!res.status) {
          return;
        }
        this.detail = res.result;
        this.detailVisible = true;
      });
    },
    cancel(formName) {
      this.$refs[formName].resetFields();
      this.form.sta = "是";
      this.selectUser = [];
      this.editVisible = false;
    },
    getData(p) {
      p = p || 1;
      this.axios
        .get("/message", {
          params: {
            p: p,
            where: [
              { field: "title", op: "like", value: this.select_word },
              { field: "status", op: "eq", value: this.select_type },
              { field: "date", op: "between", value: this.select_date }
            ]
          }
        })
        .then(res => {
          res = res.data;
          if (res.status) {
            res = res.result;
            this.tableData = res.data;
            this.current_page = res.current_page;
            this.totals = res.total;
          }
        });
    }
  }
};
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
</style>

