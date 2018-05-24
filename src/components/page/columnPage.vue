/*
 * File: d:\works\admin.jswei.cn\src\components\page\columnPage.vue
 * Created Date: 2018-05-21 11:53:30
 * Author: 魏巍
 * -----
 * Last Modified: 魏巍
 * Modified By: 2018-05-24 1:40:17
 * -----
 * Copyright (c) 2018 魏巍
 * ------
 * All shall be well and all shall be well and all manner of things shall be well.
 * We're doomed!
 */

<template>
    <div>
        {{id}}
    </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      route: null
    };
  },
  created() {
  },
  methods: {
    
  },
  watch: {
    $route(newValue, oldValue) {
      this.id = newValue.params.id;
    },
    id(newValue, oldValue) {
      //this.getOne(newValue);
    }
  }
};
</script>

<style scoped>
</style>