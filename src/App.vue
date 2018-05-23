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
</style>
<script>
import { mapState } from "vuex";
export default {
  mounted() {
    this.$Progress.finish();
  },
  created() {
    //  [App.vue specific] When App.vue is first loaded start the progress bar
    this.$Progress.start();
    //  hook the progress bar to start before we move router-view
    this.$router.beforeEach((to, from, next) => {
      //  does the page we want to go to have a meta.progress object
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress;
        // parse meta tags
        this.$Progress.parseMeta(meta);
      }
      //  start the progress bar
      this.$Progress.start();
      //  continue to next page
      next();
    });
    //  hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach((to, from) => {
      //  finish the progress bar
      this.$Progress.finish();
    });
  },
  computed: {
    ...mapState({
      loading: state => state.mutations.loading,
      loadingText: state => state.mutations.loadingText
    })
  }
};
</script>