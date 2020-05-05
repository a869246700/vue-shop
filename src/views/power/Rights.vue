<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!--列表部分 -->
      <el-table :data="currentRightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.level === '0'">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页部分 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pagesize"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  created() {
    // 获取所有权限
    this.getRightsList()
  },
  data() {
    return {
      // 权限列表
      rightsList: [{}],
      // 权限的列表总数
      total: 0,
      // 当前页码
      currentPage: 1,
      // 当前页显示多少项
      pagesize: 8
    }
  },
  methods: {
    // 获取所有权限
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败!')
      }
      this.rightsList = res.data
      this.total = this.rightsList.length
      // 获取当前页面显示数据
      //   this.getCurrentRightsList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      // 点击修改当前页码
      this.currentPage = newPage
    }
  },
  computed: {
    // 当前显示的权限列表
    currentRightsList() {
      return this.rightsList.slice(
        (this.currentPage - 1) * this.pagesize,
        this.currentPage * this.pagesize
      )
    }
  }
}
</script>

<style lang="less" scoped>
</style>
