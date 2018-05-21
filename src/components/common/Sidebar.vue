<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="'/'+item.index" :key="item.index">
                        <template slot="title">
                            <i class="iconfont" :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item :index="'/'+s.cate_type+'/'+s.index" v-for="(s,i) in item.subs" :key="i">
                           {{ s.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="'/'+item.index" :key="item.index">
                        <i class="iconfont" :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from "../common/bus";
import { mapState } from "vuex";
export default {
  data() {
    return {
      collapse: false,
      isActive: ""
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path;
    },
    ...mapState({
      items: state => state.mutations.navbar
    })
  },
  created() {
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
    this.$nextTick(() => {
      this.axios.get("/navbar?tree=1&status=1").then(res => {
        res = res.data;
        if (!res.status) {
          return;
        }
        let data = res.result;
        this.$store.commit("SET_NAVBAR", data);
      });
    });
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
.iconfont {
  padding-right: 5px;
  font-size: 1.2rem;
}
.iconfont.icon-mokuai {
  font-size: 1.6rem;
  margin-left: -4px;
}
</style>
