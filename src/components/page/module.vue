/*
 * File: d:\works\admin.jswei.cn\src\components\page\column.vue
 * Created Date: 2018-05-14 8:33:49
 * Author: 魏巍
 * -----
 * Last Modified: 魏巍
 * Modified By: 2018-05-30 1:33:52
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
                <el-breadcrumb-item><i class="el-icon-date"></i>{{metaTitle}}管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" class="handle-del mr10" 
                @click="delAll"><i class="icon icon-shanchu"></i>批量删除</el-button>
                <el-button type="danger" @click="add"><i class="icon icon-tianjia"></i>添加{{metaTitle}}</el-button>
            </div>
            <vue-scroll>
              <el-table :data="tableData" border style="width: 100%" ref="multipleTable" 
                @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column prop="title" :label="metaTitle+'名称'" width="250"> 
                    <template slot-scope="scope">
                      <span v-html="scope.row.html"></span>
                      <span>{{scope.row.title}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" :label="metaTitle+'标识'" width="250">
                  </el-table-column>
                  <el-table-column prop="ico" label="图标" width="150">
                    <template slot-scope="scope">
                      <i :class="'icon icon_cell '+scope.row.ico"></i>
                    </template>
                  </el-table-column>
                  <el-table-column prop="tag" label="状态" width="150">
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
                  <el-table-column prop="create_time" label="添加时间" sortable width="200">
                  </el-table-column>
                  <el-table-column label="操作" width="300">
                      <template slot-scope="scope">
                          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                      </template>
                  </el-table-column>
              </el-table>
            </vue-scroll>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :title="metaTitle+'管理'" :visible.sync="editVisible" width="30%" 
          :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="90px" :rules="rules" style="width:85%;margin:0 auto;" autocomplete="off">
                <el-form-item :label="metaTitle+'名称'" prop="title">
                  <el-input v-model="form.title" :placeholder="metaTitle+'名称'"></el-input>
                </el-form-item>
                <el-form-item :label="metaTitle+'标识'" prop="name">
                  <el-input v-model="form.name" :placeholder="metaTitle+'标识'"></el-input>
                </el-form-item>
                <el-form-item :label="metaTitle+'图标'">
                  <el-input v-model="form.ico" :placeholder="metaTitle+'图标(icon字体图标)'"></el-input>
                </el-form-item>
                <el-form-item :label="'所属'+metaTitle" prop="fid">
                  <el-select v-model="form.fid" :placeholder="'所属'+metaTitle" class="handle-select mr10">
                    <el-option key="0" :label="'顶级'+metaTitle" value="0"></el-option>
                    <el-option :label="item.html+item.title" :value="item.id" 
                      v-for="item in cate_list" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="metaTitle+'说明'">
                    <el-input type="textarea" v-model="form.info" :placeholder="metaTitle+'说明'"></el-input>
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
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
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
  data() {
    var validateFid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择所属栏目"));
        return;
      }
      callback();
    };
    return {
      tableData: [],
      cate_list: [],
      delList: [],
      editVisible: false,
      delVisible: false,
      isDelAll: false,
      isRedirect: false,
      last_url: "",
      row: [],
      form: {
        id: 0,
        title: "",
        name: "",
        fid: "",
        info: "",
        ico: "",
        sort: 100,
        status: "正常"
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入模块名称",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入模块标识",
            trigger: "blur"
          }
        ],
        fid: [{ validator: validateFid, trigger: "change" }]
      }
    };
  },
  created() {
    this.getData();
  },
  computed: {
    metaTitle() {
      return this.$route.meta.title;
    }
  },
  methods: {
    getData() {
      this.axios
        .get("/module", {
          where: [
            { field: "title", op: "eq", value: this.select_word },
            { field: "status", op: "eq", value: this.select_cate },
            { field: "create_time", op: "between", value: this.select_date }
          ]
        })
        .then(res => {
          res = res.data;
          if (res.status) {
            this.tableData = res.result;
            this.cur_page = res.current_page;
            this.totals = res.last_page;
          }
        });
      this.axios.get("/navbar?tree=1&status=1").then(res => {
        res = res.data;
        if (!res.status) {
          return;
        }
        let data = res.result;
        this.$store.commit("SET_NAVBAR", data);
      });
    },
    changeStatus(scope) {
      let status = scope.status == "正常" ? 1 : 0;
      this.axios.put(`/module/${scope.id}?status=${status}`).then(res => {
        res = res.data;
        if (!res.status) {
          this.$message.error(res.msg);
          return;
        }
        this.getData();
      });
    },
    search() {
      this.getData();
    },
    handleEdit(index, row) {
      this.getCateList();
      this.axios.get(`/module/${row.id}/edit`).then(res => {
        res = res.data;
        if (!res.status) {
          this.$message.error(res.msg);
          return;
        }
        let data = res.result;
        if (data.type == 6) {
          this.isRedirect = true;
          this.last_url = data.url;
        }
        this.form = {
          id: data.id,
          fid: data.fid,
          title: data.title,
          name: data.name,
          info: data.info,
          ico: data.ico,
          sort: data.sort,
          status: data.status
        };
      });
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.row = row;
      this.delVisible = true;
    },
    delAll() {
      if (!this.delList.length) {
        this.$message.error("至少选择一条数据");
        return;
      }
      this.isDelAll = true;
      this.delVisible = true;
    },
    handleSelectionChange(val) {
      val.forEach(item => {
        this.delList.push(item.id);
      });
    },
    // 保存编辑
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        }
        this.editVisible = false;
        this.$store.commit("SHOW_LOADING");
        this.axios.post("/module", this.form).then(res => {
          res = res.data;
          this.$store.commit("HIDE_LOADING");
          if (!res.status) {
            this.$message.error(res.msg);
            return;
          }
          this.$refs[formName].resetFields();
          this.form.keywords = "";
          this.form.description = "";
          this.getData();
          this.$message.success(res.msg);
        });
      });
    },
    // 确定删除
    deleteRow() {
      this.$store.commit("SHOW_LOADING");
      if (!this.isDelAll) {
        this.axios.delete(`/module/${this.row.id}`).then(res => {
          this.$store.commit("HIDE_LOADING");
          res = res.data;
          if (!res.status) {
            this.$message.error(res.msg);
            return;
          }
          this.tableData.splice(this.idx, 1);
          this.$message.success(res.msg);
        });
      } else {
        this.axios.delete(`/module/${this.delList.join("_")}`).then(res => {
          res = res.data;
          this.$store.commit("HIDE_LOADING");
          if (!res.status) {
            this.$message.error(res.msg);
            return;
          }
          this.delList = [];
          this.getData();
          this.$message.success(res.msg);
        });
      }
      this.delVisible = false;
    },
    add() {
      this.getCateList();
      this.form.id = 0;
      this.form.srot = 100;
      this.form.info = "";
      this.form.ico = "";
      this.editVisible = true;
    },
    cancel(formName) {
      this.$refs[formName].resetFields();
      this.form.id = 0;
      this.form.info = "";
      this.form.ico = "";
      this.editVisible = false;
    },
    getCateList() {
      this.axios.get("/module_list").then(res => {
        res = res.data;
        if (!res.status) {
          return;
        }
        this.cate_list = res.result;
      });
    }
  }
};
</script>

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
.icon_cell {
  font-size: 1.5rem;
}
</style>