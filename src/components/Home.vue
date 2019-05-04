<!--
@Author: 魏巍
@Date:   2018-07-08T15:25:57+08:00
@Email:  524314430@qq.com
@Filename: Home.vue
@Last modified by:   魏巍
@Last modified time: 2019-05-05T00:15:08+08:00
@Copyright: free
-->

<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <v-tags></v-tags>
      <div class="content">
        <el-scrollbar class="scrollbar">
          <router-view></router-view>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from './Header.vue'
import vSidebar from './Sidebar.vue'
import vTags from './Tags.vue'
import bus from './bus'
export default {
  data () {
    return {
      collapse: false
    }
  },
  components: {
    vHead,
    vSidebar,
    vTags
  },
  created () {
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  }
}
</script>
