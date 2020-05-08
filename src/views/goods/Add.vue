<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step :title="item" v-for="(item, index) in stepName" :key="index"></el-step>
      </el-steps>

      <!-- 表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tabs栏区域 -->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <!-- 表单项 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price" type="number">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" type="number">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type="number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 选择商品分类的级联选择框 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
                size="mini"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品动态参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item :label="item.attr_name" v-for="item in dynamicParams" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品静态参数 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in staticAttrs" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <!-- 上传图片 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headers"
              :on-success="handleUploadImgsSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>

            <!-- 添加商品按钮 -->
            <el-button type="primary" class="add-goods-btn" @click="handleClickAddGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="prviewVisible" width="50%">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'Add',
  data() {
    return {
      // 步骤的名字信息
      stepName: [
        '基本信息',
        '商品参数',
        '商品属性',
        '商品图片',
        '商品内容',
        '完成'
      ],
      // 步骤条的激活状态
      activeIndex: '0',
      // 添加商品表单的数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片路径
        pics: [],
        // 商品的详情秒速
        goods_introduce: '',
        attrs: []
      },
      // 添加商品表单的规则对象
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类列表
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 动态参数列表
      dynamicParams: [],
      // 静态属性列表
      staticAttrs: [],
      // 上次图片的URL
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片的路径
      previewPath: '',
      // 控制图片预览对话框的显示与隐藏
      prviewVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败!')
      }

      this.cateList = res.data
    },
    // 级联选择器，选择项变化后触发该方法
    handleChange() {
      // 必须选中三级分类
      if (this.addForm.goods_cat.length !== 3) {
        // 清空数组
        this.addForm.goods_cat = []
      }
    },
    // Tab 切换前的钩子函数
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类!')
        // 返回false，则不让tabs切换
        return false
      }
    },
    // 获取商品动态参数
    async getDynamicParams() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: 'many' }
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('请求商品动态参数失败!')
      }

      res.data.forEach(item => {
        item.attr_vals =
          item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
      })

      this.dynamicParams = res.data
    },
    // 获取商品静态属性
    async getStaticAttrs() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: 'only' }
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('请求商品动态参数失败!')
      }
      this.staticAttrs = res.data
    },
    // Tabs 切换时，去获取数据
    tabClicked() {
      // 访问动态参数面板
      if (this.activeIndex === '1') {
        this.getDynamicParams()
      } else if (this.activeIndex === '2') {
        this.getStaticAttrs()
      }
    },
    // 处理图片预览事件
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.prviewVisible = true
    },
    // 处理图片删除事件
    handleRemove(file) {
      // 1. 获取将要删除的图片临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中，移除 属性 pic等于filePath的项
      this.addForm.pics = this.addForm.pics.filter(
        item => item.pic !== filePath
      )
    },
    // 处理图片上传成功回调函数
    handleUploadImgsSuccess(response) {
      // 1. 拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      // 2. 将图片信息对象，添加到pics数组中
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    handleClickAddGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项!')
        }

        // 执行添加的业务逻辑
        // 1. lodash 深拷贝，将 addForm 中的数据深拷贝 lodash.cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        // 2. 将 goods_cat 转化成 , 分割的字符串
        form.goods_cat = form.goods_cat.join(',')
        // 3. 处理 动态参数 和 静态属性
        // 3.1 处理动态参数
        this.dynamicParams.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          form.attrs.push(newInfo)
        })
        // 3.2 处理静态属性
        this.staticAttrs.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          form.attrs.push(newInfo)
        })

        // 4. 发起添加商品请求
        // 商品的名称必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败!')
        }

        // 添加成功
        this.$message.success('添加商品成功!')
        this.$router.push('/goods')
        console.log(form)
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.add-goods-btn {
  margin-top: 15px;
}
</style>
