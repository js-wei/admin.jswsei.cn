/*
 * File: d:\works\admin.jswei.cn\src\components\page\column.vue
 * Created Date: 2018-05-14 8:33:49
 * Author: 魏巍
 * -----
 * Last Modified: 魏巍
 * Modified By: 2018-05-30 4:50:19
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
                <el-breadcrumb-item><i :class="current.icon"></i>栏目</el-breadcrumb-item>
                <el-breadcrumb-item>{{current.title}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" class="handle-del mr10" 
                @click="delAll"><i class="icon icon-shanchu"></i>批量删除</el-button>
                <el-button type="danger" @click="add"><i class="icon icon-tianjia"></i>添加栏目</el-button>
            </div>
            <vue-scroll>
              <el-table :data="tableData" border style="width:100%" ref="multipleTable" 
                @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column prop="title" label="栏目名称"  width="220">
                    <template slot-scope="scope">
                      <span v-html="scope.row.html"></span>
                      <span>{{scope.row.title}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="栏目标识" width="220">
                  </el-table-column>
                  <el-table-column prop="type" label="栏目类型" width="220">
                  </el-table-column>
                  <el-table-column prop="tag" label="状态" width="120">
                    <template slot-scope="scope">
                      <a @click="changeStatus(scope.row)" class="pointer">
                        <el-tag
                          :type="scope.row.status === '禁用' ? 'primary' : 'success'" disable-transitions>
                          {{scope.row.status}}
                        </el-tag>
                      </a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="sort" label="排序" sortable width="120"></el-table-column>
                  <el-table-column prop="update_time" label="操作时间" sortable width="220">
                  </el-table-column>
                  <el-table-column label="操作" width="320">
                      <template slot-scope="scope">
                          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                      </template>
                  </el-table-column>
              </el-table>
            </vue-scroll>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :title="current.title" :visible.sync="editVisible" width="50%" 
          :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="150px" :rules="rules" 
              style="width:85%;margin:0 auto;" autocomplete="off">
                <el-form-item label="标题" prop="title">
                  <el-input v-model="form.title" placeholder="栏目名称"></el-input>
                </el-form-item>
                <el-form-item label="所属栏目" prop="fid">
                  <el-select v-model="form.fid" placeholder="所属栏目" class="handle-select mr10">
                    <el-option key="0" label="顶级栏目" value="0"></el-option>
                    <el-option :label="item.html+item.title" :value="item.id" 
                      v-for="item in cate_list" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="关键词" style="height:120px;" class="w-80">
                    <el-input type="textarea" v-model="form.keywords" placeholder="关键词"></el-input>
                </el-form-item>
                <el-form-item label="说明" style="height:120px;" class="w-80">
                    <el-input type="textarea" v-model="form.description" placeholder="说明"></el-input>
                </el-form-item>
                <el-form-item label="内容" class="w-100">
                  <quill-editor ref="myTextEditor" v-model="form.content" :options="editorOption" @change="onEditorChange"></quill-editor>
                </el-form-item>
                <el-form-item label="排序">
                  <el-input v-model="form.sort"  placeholder="排序"></el-input>
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
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor, Quill } from "vue-quill-editor";
import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";
Quill.register("modules/ImageExtend", ImageExtend);
const Font = Quill.import("formats/font");
Font.whitelist = ["Arial", "serif", "sans-serif", "宋体", "黑体", "微软雅黑"];
Quill.register(Font, true);
export default {
  data() {
    var validateFid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择所属栏目"));
        return;
      }
      callback();
    };
    const toolbarOptions = [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{font: ["Arial", "serif", "sans-serif", "宋体", "黑体", "微软雅黑"]}],
      [{ align: [] }],
      ["clean"],
      ["image", "video"]
    ];
    return {
      id: this.$route.params.id,
      editorOption: {
        placeholder: "请输入内容",
        modules: {
          ImageExtend: {
            loading: true,
            name: "image",
            action: "http://api.jswei.cn/posts/",
            response: res => {
              return res.path;
            }
          },
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function() {
                QuillWatch.emit(this.quill.id);
              }
            }
          },
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        }
      },
      tableData: [],
      cate_list: [],
      delList: [],
      current: {},
      editVisible: false,
      delVisible: false,
      isDelAll: false,
      isRedirect: false,
      last_url: "",
      type: 1,
      row: [],
      form: {
        id: 0,
        title: "",
        name: "",
        fid: "",
        keywords: "",
        description: "",
        content: "",
        sort: 100,
        status: "正常",
        type: "列表页",
        url: ""
      },
      rules: {
        title: [{ required: true, message: "请输入栏目名称", trigger: "blur" }],
        name: [{ required: true, message: "请输入栏目标识", trigger: "blur" }],
        fid: [{ validator: validateFid, trigger: "change" }]
      }
    };
  },
  components: {
    quillEditor
  },
  created() {
    this.getColumn();
  },
  watch: {
    $route(newValue, oldValue) {
      this.getColumn(newValue.params.id);
    }
  },
  methods: {
    getColumn(id = null) {
      id = id ? id : this.id;
      this.axios.get("/column_one", { params: { name: id } }).then(res => {
        res = res.data;
        if (!res.status) {
          return;
        }
        this.current = res.result;
      });
    },
    onEditorChange({ editor, html, text }) {
      this.form.content = html;
      console.log(html);
    },
    getData() {
      this.axios
        .get("/column", {
          where: [
            { field: "title", op: "eq", value: this.select_word },
            { field: "status", op: "eq", value: this.select_cate },
            { field: "date", op: "between", value: this.select_date }
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
      this.axios.put(`/column/${scope.id}?status=${status}`).then(res => {
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
      this.axios.get(`/column/${row.id}/edit`).then(res => {
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
          fid: data.fid,
          keywords: data.keywords,
          description: data.description,
          sort: data.sort,
          sta: data.status,
          type: data.type,
          url: data.url
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
        this.form.status = this.form.sta == "正常" ? 0 : 1;
        this.form.type = this.type;
        this.$store.commit("SHOW_LOADING");
        this.axios.post("/column", this.form).then(res => {
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
    // 确定删除
    deleteRow() {
      this.$store.commit("SHOW_LOADING");
      if (!this.isDelAll) {
        this.axios.delete(`/column/${this.row.id}`).then(res => {
          this.$store.commit("HIDE_LOADING");
          res = res.data;
          if (!res.status) {
            this.$message.error(res.msg);
          }
          this.tableData.splice(this.idx, 1);
          this.$message.success(res.msg);
        });
      } else {
        this.axios.delete(`/column/${this.delList.join("_")}`).then(res => {
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
      this.getCateList();
      this.form.id = 0;
      this.form.type = "列表页";
      this.form.srot = 100;
      this.editVisible = true;
    },
    cancel(formName) {
      this.$refs[formName].resetFields();
      this.form.keywords = "";
      this.form.description = "";
      this.editVisible = false;
    },
    getCateList() {
      this.axios.get("/column_list").then(res => {
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
.el-radio {
  margin: 0 10px 0 0;
}
</style>
<style>
.el-input,
.el-select {
  width: 225px;
}
.el-textarea__inner {
  height: 120px;
}
.el-input__suffix {
  right: 2px;
}
.el-textarea__inner {
  resize: none;
}
</style>