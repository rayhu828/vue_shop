<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
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
      <!-- 表格区域 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        :border="true"
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-if="scope.row.cat_deleted === true" style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCateById(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加分类的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClose"
      >
        <!-- 内容主体区域 -->
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              :clearable="true"
              :change-on-select="true"
              @change="parentCateChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      cateList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        // 父级分类的id
        cat_pid: 0,
        // 将要添加分类的名称
        cat_name: '',
        // 分类的等级，默认添加1级分类
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      editCateDialogVisible: false,
      editCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      editCateForm: {
        cat_name: ''
      },
      editCateId: ''
    }
  },
  methods: {
    getCateList: async function() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange: function(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange: function(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog: function() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    getParentCateList: async function() {
      let queryObj = {
        type: 2
      }
      const { data: res } = await this.$http.get('categories', {
        params: queryObj
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.parentCateList = res.data
    },
    parentCateChange: function() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    addCate: function() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('添加分类成功')
        this.addCateDialogVisible = false
        this.getCateList()
      })
    },
    addCateDialogClose: function() {
      this.$refs.addCateFormRef.resetFields()
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.selectedKeys = []
    },
    showEditCateDialog: async function(cateId) {
      this.editCateDialogVisible = true
      const { data: res } = await this.$http.get(`categories/${cateId}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editCateForm.cat_name = res.data.cat_name
      this.editCateId = res.data.cat_id
    },
    editCate: function() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(
          `categories/${this.editCateId}`,
          this.editCateForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('修改分类成功')
        this.editCateDialogVisible = false
        this.getCateList()
      })
    },
    editCateDialogClose: function() {
      this.$refs.editCateFormRef.resetFields()
    },
    deleteCateById: async function(cateId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(error => {
        return error
      })
      // 如果用户确认删除，返回值是字符串'confirm'
      // 如果用户点击取消，返回值是字符串'cancel'
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete(`categories/${cateId}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      let totalPage = Math.ceil((this.total - 1) / this.queryInfo.pagesize) 
      let currentPage = this.queryInfo.pagenum > totalPage ? totalPage : this.queryInfo.pagenum
      this.queryInfo.pagenum = currentPage < 1 ? 1 : currentPage
      this.$message.success('分类删除成功')
      this.getCateList()
    }
  },
  created: function() {
    this.getCateList()
  }
}
</script>
<style scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>