<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model.trim="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="handleSearchOrder"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <div>
              <el-tag type="success" v-if="scope.row.pay_status">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <div>
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showAddressDialog"></el-button>
              <el-button
                type="success"
                icon="el-icon-location"
                size="mini"
                @click="showProgressDialog"
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="handleAddressDialogClose"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1" :props="addressProps"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          :timestamp="item.time"
          placement="top"
          v-for="(item, index) in progressInfo"
          :key="index"
        >
          <el-card>
            <p>{{item.context}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'

export default {
  name: 'Order',
  data() {
    return {
      // 查询对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单总数
      total: 0,
      // 订单列表
      orderList: [],
      // 控制修改地址对话框的显示与隐藏
      addressVisible: false,
      // 表单信息
      addressForm: {
        address1: [],
        address2: ''
      },
      // 表单验证规则对象
      addressFormRules: {
        address1: [
          { required: true, message: '请输入省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 城市列表
      cityData,
      addressProps: {
        expandTrigger: 'hover'
      },
      // 物流对话框的显示与隐藏
      progressVisible: false,
      // 物流信息
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败!')
      }
      // 数据存储
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    // 监听页码大小变换
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听当前页码变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 显示修改地址对话框
    showAddressDialog() {
      this.addressVisible = true
    },
    // 监听地址对话框的关闭
    handleAddressDialogClose() {
      this.$refs.addressFormRef.resetFields()
    },
    // 显示物流信息对话框
    showProgressDialog() {
      this.getCourierInfo()
      this.progressVisible = true
    },
    // 获取快递信息
    async getCourierInfo(id = 1106975712662) {
      const { data: res } = await this.$http.get('/kuaidi/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败!')
      }

      this.progressInfo = res.data
      console.log(this.progressInfo)
    },
    // 点击查询订单
    handleSearchOrder() {
      this.queryInfo.pagenum = 1
      this.getOrderList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
