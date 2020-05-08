<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 2. 为 Echarts 准备一个大小的Dom -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1. 导入 echarts
import echarts from 'echarts'
import _ from 'lodash'

export default {
  name: 'Report',
  data() {
    return {
      // 需要合并的对象
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  methods: {},
  // 3. 此时页面上的元素已经被渲染到 View
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取时间折线图数据失败')
    }

    // 4. 准备配置项
    const newOptions = _.merge(res.data, this.options)
    console.log(newOptions)
    // 5. 展示数据
    myChart.setOption(newOptions)
  }
}
</script>

<style lang="less" scoped>
</style>
