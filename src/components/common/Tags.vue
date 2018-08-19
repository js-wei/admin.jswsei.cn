<template>
  <div class="tags" v-if="showTags">
    <ul>
      <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
        <router-link :to="item.path" class="tags-li-title">
          {{item.title}}<span v-if="!item.title">管理</span>
        </router-link>
        <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
      </li>
    </ul>
    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="mini" type="primary">
          标签选项<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu size="small" slot="dropdown">
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tagsList: [],
      act: {}
    }
  },
  methods: {
    isActive (path) {
      return path === this.$route.path
    },
    // 关闭单个标签
    closeTags (index) {
      const delItem = this.tagsList.splice(index, 1)[0]
      const item = this.tagsList[index]
        ? this.tagsList[index]
        : this.tagsList[index - 1]
      if (item) {
        delItem.path === this.$route.path && this.$router.push(item.path)
      } else {
        this.$router.push('/')
      }
    },
    // 关闭全部标签
    closeAll () {
      this.tagsList = []
      this.$router.push('/')
    },
    // 关闭其他标签
    closeOther () {
      const curItem = this.tagsList.filter(item => {
        return item.path === this.$route.path
      })
      this.tagsList = curItem
    },
    // 设置标签
    setTags (route) {
      // @todo params
      const isExist = this.tagsList.some(item => {
        return item.path === route.path
      })
      !isExist &&
        this.tagsList.push({
          title: route.meta.title,
          path: route.path
        })
    },
    handleTags (command) {
      command === 'other' ? this.closeOther() : this.closeAll()
    },
    getOne (name, route, column = true) {
      if (column) {
        this.axios.get('column_one', { params: { name: name } }).then(res => {
          res = res.data
          if (res.status) {
            let current = res.result
            if (current.index === route.params.id) {
              route.meta.title = current.title
              route.meta.icon = current.icon
              this.act = {
                title: current.title,
                icon: `icon ${current.icon}`,
                fid: current.fid
              }
              this.$store.commit('SET_ACTIVE_NAVBAR', this.act)
              this.setTags(route)
            }
          }
        })
      } else {
        this.axios.get('module_one', { params: { name: name } }).then(res => {
          res = res.data
          if (res.status) {
            let current = res.result
            if (current.index === route.params.id) {
              route.meta.title = current.title
              route.meta.icon = current.ico
              this.act = {
                title: current.title,
                icon: `icon ${current.ico}`,
                fid: current.fid === '顶级栏目' ? 0 : current.fid
              }
              this.$store.commit('SET_ACTIVE_NAVBAR', this.act)
              this.setTags(route)
            }
          }
        })
      }
    }
  },
  computed: {
    showTags () {
      return this.tagsList.length
    },
    fullPath () {
      return this.$route.fullPath
    }
  },
  watch: {
    $route (newValue, oldValue) {
      let id = newValue.params.id
      if (!id) {
        let module = newValue.path.substring(1)
        this.getOne(module, newValue, false)
      } else {
        this.getOne(id, newValue)
      }
    }
  },
  created () {
    this.setTags(this.$route)
  }
}
</script>

<style>
.tags {
  position: relative;
  padding-top:2px;
  height: 35px;
  overflow: hidden;
  background: #fff;
  padding-right: 120px;
}

.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.tags-li {
  float: left;
  margin: 3px 5px 2px 3px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  line-height: 23px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #fff;
}

.tags-li-title {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #fff;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 4px;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
</style>
