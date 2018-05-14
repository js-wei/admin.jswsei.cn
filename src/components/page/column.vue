/*
 * File: d:\works\admin.jswei.cn\src\components\page\column.vue
 * Created Date: 2018-05-14 8:33:49
 * Author: 魏巍
 * -----
 * Last Modified: 魏巍
 * Modified By: 2018-05-14 3:16:07
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
                <el-breadcrumb-item><i class="el-icon-date"></i>栏目</el-breadcrumb-item>
                <el-breadcrumb-item>栏目列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" 
                @click="delAll">批量删除</el-button>
                <el-select v-model="select_cate" placeholder="状态" class="handle-select mr10">
                    <el-option key="0" label="正常" value="0"></el-option>
                    <el-option key="1" label="禁用" value="1"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="danger" class="add" @click="add"><i class="iconfont icon-tianjia"></i>添加</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" 
              @selection-change="handleSelectionChange">
                <el-table-column type="id" width="55"></el-table-column>
                <el-table-column prop="title" label="栏目名称" sortable width="150">
                </el-table-column>
                <el-table-column prop="name" label="栏目标识" width="120">
                </el-table-column>
                <el-table-column prop="status" label="状态" :formatter="formatter"></el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagination">
                <el-pagination 
                @current-change="handleCurrentChange" 
                layout="prev, pager, next" :total="total"
                background
                :page-size="10">
                </el-pagination>
            </div> -->
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="栏目管理" :visible.sync="editVisible" width="30%" :show-close="false">
            <el-form ref="form" :model="form" label-width="90px" 
              :rules="rules" style="width:85%;margin:0 auto;" autocomplete="off">
                <el-form-item label="栏目名" prop="title">
                  <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="栏目标识" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="所属栏目" prop="fid">
                  <el-select v-model="form.fid" placeholder="栏目" class="handle-select mr10">
                    <el-option key="0" label="顶级栏目" value="0"></el-option>
                    <el-option :label="item.title" :value="item.id" v-for="(item,index) in cate_list" :key="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="关键词">
                    <el-input type="textarea"  v-model="form.keywords"></el-input>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item label="启用">
                  <el-radio-group v-model="form.status">
                    <el-radio label="是" value="0"></el-radio>
                    <el-radio label="否" value="1"></el-radio>
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
    return {
      tableData: [],
      cur_page: 1,
      total: 100,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      select_date: "", //'2017-8-12 and 2018-8-12'
      cate_list: [],
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      form: {
        title: "",
        name: "",
        fid: "",
        keywords: "",
        description: "",
        status: "是"
      },
      rules: {
        title: [{ required: true, message: "请输入栏目名称", trigger: "blur" }],
        name: [{ required: true, message: "请输入栏目标识", trigger: "blur" }],
        fid: [{ required: true, message: "请选择栏归属", trigger: "change" }]
      },
      idx: -1
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.getData(val);
    },
    getData(page) {
      page = page || this.cur_page;
      this.axios
        .post("/column", {
          p: page,
          where: [
            { field: "title", op: "eq", value: this.select_word },
            { field: "status", op: "eq", value: this.select_cate },
            { field: "date", op: "between", value: this.select_date }
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
    search() {
      this.getData();
    },
    formatter(row, column) {
      return row.status?'禁用':'正常';
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        name: item.name,
        date: item.date,
        address: item.address
      };
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
    },
    delAll() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 保存编辑
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        }
      });
    },
    // 确定删除
    deleteRow() {
      this.tableData.splice(this.idx, 1);
      this.$message.success("删除成功");
      this.delVisible = false;
    },
    add() {
      this.axios.get("/column_list").then(res => {
        res = res.data;
        if (!res.status) {
          return;
        }
        this.cate_list = res.result;
      });
      this.editVisible = true;
    },
    cancel(formName) {
      this.$refs[formName].resetFields();
      this.editVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
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
  .add {
    height: 35px;
    float: right;
  }
}
</style>