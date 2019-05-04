<template>
  <div class="error-page">
      <div class="error-desc"><span class="ku">(:</span> 抱歉不存在的路由:<span class="text-danger">{{current_route}}</span>,请完善以上路由!</div>
      <div class="error-code mt-10">4<span>0</span>4</div>
      <!-- <div class="error-desc mt-10">啊哦~ 你所访问的 页面不存在</div> -->
      <div class="error-handle">
          <router-link to="/">
            <el-button type="primary" size="large">返回首页</el-button>
          </router-link>
          <el-button class="error-btn" type="primary" size="large" @click="goBack">返回上一页</el-button>
      </div>
  </div>
</template>

<script>
export default {
  computed: {
    current_route () {
      return this.$route.redirectedFrom
    }
  },
  methods: {
    goBack () {
      this.$router.back()
    }
  }
}
</script>


<style lang="scss" scoped>
@import "../assets/base";
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f3f3f3;
  box-sizing: border-box;
  .error-code {
    line-height: 1;
    font-size: 250px;
    font-weight: bolder;
    color: #2d8cf0;
    span {
      color: #00a854;
    }
  }
  .error-desc {
    font-size: 30px;
    color: #777;
    .ku{
      font-size:2.5rem;
    }
  }
  .error-handle {
    margin-top: 30px;
    padding-bottom: 200px;
  }
  .error-btn {
    margin-left: 100px;
  }
}
</style>
