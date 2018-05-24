/*
 * File: d:\works\admin.jswei.cn\src\components\page\group.vue
 * Created Date: 2018-05-22 11:06:28
 * Author: 魏巍
 * -----
 * Last Modified: 魏巍
 * Modified By: 2018-05-24 4:35:18
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
                <el-button type="primary" class="handle-del mr10" 
                @click="delAll"><i class="icon icon-shanchu"></i>批量删除</el-button>
                <el-button type="danger" @click="add"><i class="icon icon-tianjia"></i>添加{{metaTitle}}</el-button>
            </div>
            <vue-scroll>
              <el-table :data="tableData" border style="width: 100%" ref="multipleTable" 
                @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="50"></el-table-column>
                  <el-table-column prop="title" :label="metaTitle+'名称'" width="220">
                    <template slot-scope="scope">
                      <span v-html="scope.row.html"></span>
                      <span>{{scope.row.title}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" :label="metaTitle+'标识'" width="220">
                  </el-table-column>
                  <el-table-column prop="power" :label="metaTitle+'标识'"  width="220">
                    <template slot-scope="scope">
                      <a class="pointer" @click.stop="checkPower(scope.$index,scope.row.power)">查看权限</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="tag" label="状态" width="200">
                    <template slot-scope="scope">
                      <a @click="changeStatus(scope.row)" class="pointer">
                        <el-tag
                          :type="scope.row.status === '禁用' ? 'primary' : 'success'" disable-transitions>
                          {{scope.row.status}}
                        </el-tag>
                      </a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="create_time" label="添加时间" sortable width="250">
                  </el-table-column>
                  <el-table-column label="操作" width="350">
                      <template slot-scope="scope">
                          <el-button size="small" @click="handleEdit(scope.$index, scope.row)" 
                            class="ml-0 mb-1">编辑</el-button>
                          <el-button type="primary" @click="setPower(scope.$index, scope.row)"
                            class="ml-0 mb-1">配置权限</el-button>                        
                          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)" 
                            class="ml-0">删除</el-button>
                      </template>
                  </el-table-column>
              </el-table>
            </vue-scroll>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :title="metaTitle+'管理'" :visible.sync="editVisible" width="30%" :show-close="false">
            <el-form ref="form" :model="form" label-width="100px" :rules="rules" style="width:85%;margin:0 auto;" autocomplete="off">
                <el-form-item :label="metaTitle+'名称'" prop="title">
                  <el-input v-model="form.title" :placeholder="metaTitle+'名称'"></el-input>
                </el-form-item>
                <el-form-item :label="metaTitle+'标识'" prop="name">
                  <el-input v-model="form.name" :placeholder="metaTitle+'标识'"></el-input>
                </el-form-item>
                <el-form-item label="启用">
                  <el-radio-group v-model="form.status">
                    <el-radio label="正常" value="1"></el-radio>
                    <el-radio label="禁用" value="2"></el-radio>
                  </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="cancel('form')">取 消</el-button>
              <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 配置权限 -->
        <el-dialog :title="metaTitle+'配置'" :visible.sync="powerVisible" width="40%" :show-close="false">
            <el-form ref="form1" :model="form1" label-width="100px" :rules="rules1" style="margin-left:50px;" autocomplete="off">
                <el-form-item label="权限配置" prop="power">
                   <el-transfer  :titles="['可选', '已选']"
                    v-model="selectedList" :data="selectModule"  @change="handleChange"></el-transfer>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="powerVisible=false;selectedList=[];form1.id=0;">取 消</el-button>
              <el-button type="primary" @click="savePower('form1')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 查看权限 -->
        <el-dialog :title="metaTitle+'查看'" :visible.sync="isCheck" width="25%" :show-close="false">
            <el-tag type="danger" v-for="(item,index) in powerList" :key="index" class="mr-10">{{item.title}}</el-tag>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="isCheck=false;">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false;">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    var validate = (rule, value, callback) => {
      if (!this.selectedList.length && this.powerVisible) {
        callback(new Error("请选择可操作模块"));
        return;
      }
      callback();
    };
    return {
      tableData: [],
      delList: [],
      editVisible: false,
      delVisible: false,
      isDelAll: false,
      powerVisible: false,
      selectModule: [],
      selectedList: [],
      powerList: [],
      isCheck: false,
      row: [],
      form: {
        id: 0,
        title: "",
        name: "",
        status: "正常"
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入权限组名称",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入权限组标识",
            trigger: "blur"
          }
        ]
      },
      form1: {
        id: 0,
        title: "",
        power: ""
      },
      rules1: {
        power: [
          {
            validator: validate,
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getData();
  },
  computed: {
    metaTitle() {
      return this.$route.meta.title;
    },
    metaIcon() {
      return "icon " + this.$route.meta.icon;
    }
  },
  methods: {
    getData() {
      this.axios
        .get("/group", {
          where: [
            { field: "title", op: "eq", value: this.select_word },
            { field: "status", op: "eq", value: this.select_cate },
            { field: "create_time", op: "between", value: this.select_date }
          ]
        })
        .then(res => {
          res = res.data;
          if (res.status) {
            res = res.result;
            this.tableData = res.data;
            this.cur_page = res.current_page;
            this.totals = res.last_page;
          }
        });
    },
    changeStatus(scope) {
      let status = scope.status == "正常" ? 2 : 1;
      this.axios.put(`/group/${scope.id}?status=${status}`).then(res => {
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
      this.axios.get(`/group/${row.id}/edit`).then(res => {
        res = res.data;
        if (!res.status) {
          this.$message.error(res.msg);
        }
        let data = res.result;
        if (data.type == 6) {
          this.isRedirect = true;
          this.last_url = data.url;
        }
        this.form = {
          id: data.id,
          title: data.title,
          name: data.name,
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
        this.axios.post("/group", this.form).then(res => {
          res = res.data;
          this.$store.commit("HIDE_LOADING");
          if (!res.status) {
            this.$message.error(res.msg);
          }
          this.$refs[formName].resetFields();
          this.form.keywords = "";
          this.form.description = "";
          this.getData();
          this.$message.success(res.msg);
        });
      });
    },
    savePower(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        }
        this.axios
          .post(`/power`, {
            id: this.form1.id,
            power: this.selectedList.join(",")
          })
          .then(res => {
            res = res.data;
            if (!res.status) {
              this.$message.error(res.msg);
              return;
            }
            this.powerVisible = false;
            this.$message.success(res.msg);
            this.form1.id = 0;
            this.selectedList = [];
            this.getData();
          });
      });
    },
    // 确定删除
    deleteRow() {
      this.$store.commit("SHOW_LOADING");
      if (!this.isDelAll) {
        this.axios.delete(`/group/${this.row.id}`).then(res => {
          this.$store.commit("HIDE_LOADING");
          res = res.data;
          if (!res.status) {
            this.$message.error(res.msg);
          }
          this.tableData.splice(this.idx, 1);
          this.$message.success(res.msg);
        });
      } else {
        this.axios.delete(`/group/${this.delList.join("_")}`).then(res => {
          res = res.data;
          this.$store.commit("HIDE_LOADING");
          if (!res.status) {
            this.$message.error(res.msg);
          }
          this.delList = [];
          this.getData();
          this.$message.success(res.msg);
        });
      }
      this.delVisible = false;
    },
    add() {
      this.form.id = 0;
      this.editVisible = true;
    },
    cancel(formName) {
      this.$refs[formName].resetFields();
      this.form.id = 0;
      this.editVisible = false;
    },
    checkPower(index, scope) {
      if (!scope) {
        this.$message.error("没有配置权限");
        return;
      }
      this.axios.get(`/check?id=${scope}`).then(res => {
        res = res.data;
        if (!res.status) {
          return;
        }
        this.powerList = res.result;
        this.isCheck = true;
      });
    },
    setPower(index, scope) {
      this.form1.id = scope.id;
      this.form1.title = scope.title;
      this.getModuleList();
      this.getGroupPower();
      this.powerVisible = true;
    },
    handleChange(value, direction, movedKeys) {
      if (!this.selectedList) {
        this.rules.selectedList;
      }
    },
    getModuleList() {
      this.axios.get(`/modules`).then(res => {
        res = res.data;
        if (!res.status) {
          return;
        }
        this.selectModule = res.result;
      });
    },
    getGroupPower() {
      this.axios.get(`/powers?id=${this.form1.id}`).then(res => {
        res = res.data;
        if (!res.status) {
          return;
        }
        this.selectedList = res.result;
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
<style>
.el-input__suffix {
  right: 10px;
}
</style>