<!--
@Author: 魏巍
@Date:   2018-07-08T15:25:57+08:00
@Email:  524314430@qq.com
@Filename: Sidebar.vue
@Last modified by:   魏巍
@Last modified time: 2019-05-05T00:14:07+08:00
@Copyright: free
-->

<template>
    <div class="sidebar">
      <el-scrollbar class="scrollbar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
        text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened :router="true">
        <template v-for="item in items">
            <template v-if="item.subs">
                <el-submenu :index="item.index" :key="item.index">
                    <template slot="title">
                        <i class="icon" :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </template>
                    <el-menu-item :index="`/${item.index}/${s.index}`"
                      v-for="(s,i) in item.subs" :key="i">
                        <i class="icon" :class="s.icon"></i>
                        <span slot="title">{{ s.title }}</span>
                    </el-menu-item>
                </el-submenu>
            </template>
            <template v-else>
                <el-menu-item :index="`/${item.index}`" :key="item.index">
                    <i class="icon" :class="item.icon"></i>
                    <span slot="title">{{ item.title }}</span>
                </el-menu-item>
            </template>
        </template>
      </el-menu>
      </el-scrollbar>
    </div>
</template>

<script>
import bus from './bus'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      collapse: false,
      isActive: ''
    }
  },
  computed: {
    onRoutes () {
      return this.$route.path
    },
    ...mapState({
      items: state => state.mutations.navbar
    })
  },
  created () {
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
    this.axios.get('/navbar?tree=1&status=1').then(res => {
      if (!res.status) {
        return
      }
      let data = res.result
      this.$store.commit('SET_NAVBAR', data)
    })
  }
}
</script>
<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  background-color: rgb(50, 65, 87);
  height: 90%;
  overflow: hidden;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 220px;
}
.sidebar > ul {
  height: 100%;
  overflow: auto;
}
.icon {
  font-size: 1.5rem;
}
.icon-mokuai,
.icon-yibiaopan,
.icon-shezhi {
  font-size: 2.2rem;
  margin-left: -4px;
}
</style>
