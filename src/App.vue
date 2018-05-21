<template>
    <div id="app">
      <router-view v-loading="loading" 
        element-loading-spinner="el-icon-loading"
        :element-loading-text="loadingText"
        element-loading-background="rgba(0, 0, 0, 0.8)">
      </router-view>
    </div>
</template>
<style>
@import "../static/css/main.css";
@import "../static/css/color-dark.css"; /*深色主题*/
/*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
.el-dialog__header{
  border-bottom: 1px solid #e2e2e2;
}
</style>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      loading: state => state.mutations.loading,
      loadingText: state => state.mutations.loadingText
    })
  }
};
</script>