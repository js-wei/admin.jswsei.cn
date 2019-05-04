<!--
@Author: 魏巍
@Date:   2018-07-08T15:25:57+08:00
@Email:  524314430@qq.com
@Filename: App.vue
@Last modified by:   魏巍
@Last modified time: 2019-05-05T00:09:17+08:00
@Copyright: free
-->

<template>
    <div id="app">
      <router-view
        v-loading="loading"
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
</style>
<script>
import { mapState } from 'vuex'
export default {
  name: 'async',
  metaInfo () {
    return {
      title: this.metaTile
    }
  },
  data () {
    return {
      metaTile: ''
    }
  },
  mounted () {
    this.$Progress.finish()
    this.axios.get('/setting').then(res => {
      if (res.status) {
        this.metaTile = res.result.title
      }
    })
  },
  created () {
    this.progress()
  },
  computed: {
    ...mapState({
      loading: state => state.mutations.loading,
      loadingText: state => state.mutations.loadingText
    })
  },
  methods: {
    progress () {
      this.$Progress.start()
      this.$router.beforeEach((to, from, next) => {
        if (to.meta.progress !== undefined) {
          let meta = to.meta.progress
          this.$Progress.parseMeta(meta)
        }
        this.$Progress.start()
        next()
      })
      this.$router.afterEach((to, from) => {
        this.$Progress.finish()
      })
    }
  }
}
</script>
