<template>
    <div id="app">
      <router-view v-loading="loading" 
        element-loading-spinner="el-icon-loading"
        :element-loading-text="loadingText"
        element-loading-background="rgba(0, 0, 0, 0.8)">
      </router-view>
      <!-- set progressbar -->
      <vue-progress-bar></vue-progress-bar>
    </div>
</template>
<style>
@import "../static/css/main.css";
@import "../static/css/color-dark.css"; /*深色主题*/
/*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
html {
  font-size: 65.5%;
}
.el-dialog__header {
  border-bottom: 1px solid #e2e2e2;
}
.el-input__suffix {
  right: 21px;
}
.el-input__inner {
  width: 100%;
}
.el-radio + .el-radio {
  padding-left: 0;
}
.icon {
  margin-right: 4px;
}
@media screen and (min-width: 1200) {
  .el-table {
    padding-bottom: 10px;
  }
}
</style>
<style lang="scss">
  .quill-editor {
  /*工具栏内用*/
  .ql-font {
    span[data-value="Arial"]::before {
      content: "Arial" !important;
      font-family: "Arial";
    }
    span[data-value="宋体"]::before {
      content: "宋体" !important;
      font-family: "宋体";
    }
    span[data-value="黑体"]::before {
      content: "黑体" !important;
      font-family: "黑体";
    }
    span[data-value="微软雅黑"]::before {
      content: "微软雅黑" !important;
      font-family: "微软雅黑";
    }
  }
 /*编辑器内容用*/
  .ql-font-Arial {
    font-family: "Arial";
  }
  .ql-font-宋体 {
    font-family: "宋体";
  }
  .ql-font-黑体 {
    font-family: "黑体";
  }
  .ql-font-微软雅黑 {
    font-family: "微软雅黑";
  }
}
</style>
<script>
import { mapState } from "vuex";
export default {
  name: "async",
  metaInfo() {
    return {
      title: this.metaTile
    };
  },
  data() {
    return {
      metaTile:''
    }
  },
  mounted() {
    this.$Progress.finish();
    this.axios.get("/setting").then(res => {
      res = res.data;
      if (res.status) {
        this.metaTile = res.result.title;
      }
    });
  },
  created() {
    this.progress();
  },
  computed: {
    ...mapState({
      loading: state => state.mutations.loading,
      loadingText: state => state.mutations.loadingText
    })
  },
  methods: {
    progress() {
      this.$Progress.start();
      this.$router.beforeEach((to, from, next) => {
        if (to.meta.progress !== undefined) {
          let meta = to.meta.progress;
          this.$Progress.parseMeta(meta);
        }
        this.$Progress.start();
        next();
      });
      this.$router.afterEach((to, from) => {
        this.$Progress.finish();
      });
    }
  }
};
</script>