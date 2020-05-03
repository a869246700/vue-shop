<template>
  <div class="home">
    <el-button type="before" @click="handleLogout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    handleLogout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
