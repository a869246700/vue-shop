<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="treetable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success success" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error error" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation" slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="mini"
            @click="handleShowEditDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="mini"
            @click="handleRemoveCate(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类">
          <!-- options 用来绑定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader
            v-model="selectdKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleCascaderChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类的对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="handleEditDialogClose"
    >
      <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      // 请求参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表
      cateList: [],
      // 总商品分类的条数
      total: 0,
      // 为table指定列的定义
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'operation' }
      ],
      // 控制添加分类对话框的现实与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 分类的等级，默认一级
        cat_level: 0
      },
      // 添加分类表单的规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 选中的父级分类的ID数组
      selectdKeys: [],
      // 控制编辑分类对话框的显示和隐藏
      editDialogVisible: false,
      // 编辑对话框的表单内容
      editCateForm: {},
      // 编辑表单的规则对象
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      }
      // 把数据列表，赋值给cateList
      this.cateList = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 监听 pagesize 变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮，展示添加分类对话框
    showAddCateDialog() {
      // 1. 获取父级分类的数据列表
      this.getParentCateList()
      // 2. 展示对话框
      this.addCateDialogVisible = true
    },
    // 监听添加分类对话框关闭事件
    addCateDialogClose() {
      // 重置表单数据
      this.$refs.addCateFormRef.resetFields()
      this.selectdKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.message.error('获取父级分类数据失败!')
      }
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    handleCascaderChange() {
      // 如果 selectdKeys.length > 0 ，证明选中了父级分类
      // 反之，没有选择任何分类
      if (this.selectdKeys.length > 0) {
        // 父级分类id赋值
        this.addCateForm.cat_pid = this.selectdKeys[this.selectdKeys.length - 1]
        // 分类的等级赋值
        this.addCateForm.cat_level = this.selectdKeys.length
      } else {
        // 父级分类id赋值
        this.addCateForm.cat_pid = 0
        // 分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击添加新的分类
    handleAddCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败!')
        }
        // 提示添加成功，重新获取分类列表，隐藏添加分类对话框
        this.$message.success('添加分类成功!')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 点击删除分类
    async handleRemoveCate(cateId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      // 执行删除
      const { data: res } = await this.$http.remove('categories/' + cateId)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败!')
      }
      // 提示删除成功
      this.$message.success('删除分类成功!')
      this.getCateList()
      // 将添加分类对话框隐藏
      this.addCateDialogVisible = false
    },
    // 展示编辑分类对话框
    async handleShowEditDialog(cateId) {
      // 1. 根据 id 去获取 编辑的对象
      const { data: res } = await this.$http.get('categories/' + cateId)
      // 2. 判断返回的情况
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败!')
      }
      // 3. 将获取到的数据保存
      this.editCateForm = res.data
      // 4. 显示编辑对话框
      this.editDialogVisible = true
    },
    // 修改分类表单提交预校验
    handleEditDialog() {
      this.$refs.editCateFormRef.validate(async valid => {
        // 1. 判断表单验证结果
        if (!valid) return
        // 2. 发送网络请求
        const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id, this.editCateForm)
        // 3. 判断响应结果
        if (res.meta.status !== 200) {
          return this.$message.error('修改分类失败!')
        }
        // 4. 修改成功，重新获取数据
        this.getCateList()
        // 5. 提示修改成功
        this.$message.success('修改分类成功!')
        // 6. 隐藏修改分类对话框
        this.editDialogVisible = false
      })
    },
    // 监听编辑分类对话框的关闭
    handleEditDialogClose() {
      this.$refs.editCateFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.treetable {
  margin-top: 15px;
}

.success {
  color: #0f0;
}

.eroor {
  color: #f00;
}

.el-cascader {
  width: 100%;
}
</style>
