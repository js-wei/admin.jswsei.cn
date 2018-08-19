<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <v-tags></v-tags>
      <div class="content">
        <transition name="move" mode="out-in">
          <keep-alive>
            <el-scrollbar class="scrollbars">
              <router-view></router-view>
            </el-scrollbar>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from './Header.vue'
import vSidebar from './Sidebar.vue'
import vTags from './Tags.vue'
import bus from '../common/bus'
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

<style lang="scss">
.scrollbars{
  height: 100%;
  .el-scrollbar__wrap{
    overflow-x: hidden;
  }
}
</style>
