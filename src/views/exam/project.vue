<template>
  <div class="app-container">
    <el-row :gutter="20">
        <el-col :span="4">
            <el-button v-if="projectList.length == 0" type="primary" @click="addProject">添加模板</el-button>
        </el-col>
    </el-row>
    <div style="height:20px;"/>
    <!-- 模板列表 -->
    <el-table v-loading="listLoading" :data="projectList" element-loading-text="Loading" border fit
            highlight-current-row
            :header-cell-style="{background:'#F3F4F7',color:'#555'}">
      <el-table-column label="模板名称" width="200" prop="name"></el-table-column>
      <el-table-column label="内容(分类-项目-指标)" width="300">
          <template slot-scope="scope">
            <div v-for="item in scope.row.list" :key="item.id">
              <div><span>{{item.desc}}</span></div>
            </div>
          </template>
      </el-table-column>
      <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="mini" @click="editProject(scope.row)" >编辑</el-button>
          </template>
      </el-table-column>
    </el-table>

    <!-- 编辑列表 -->
    <el-dialog :show-close="false"
        title="编辑模板"
        :visible.sync="projectEditDialogVisible"
        width="50%">
        <!-- 内层对话框 -->
        <el-dialog title="类目选择" :visible.sync="innerDialogVisible" width="30%" append-to-body>
            <el-tree :data="cate_show_tree" :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="innerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="innerDialogSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 名称 -->
        <div style="margin-bottom: 20px;">
          名称：
          <div style="height:10px;"/>
          <el-input style="width: 200px;" v-model="project_name"></el-input>
        </div>
        <!-- 类别列表 -->
        <el-table
          :data="editRowList"
          border
          style="width: 100%">
          <el-table-column prop="cateName" label="类目"> </el-table-column>
          <el-table-column prop="subjectName" label="项目"> </el-table-column>
          <el-table-column prop="indexName" label="指标"> </el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-edit" size="mini" @click="deleteCate(scope.row)" >删除</el-button>
              </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px;">
          <el-button type="primary" size="mini" @click="addCateSubject">新增一条</el-button>
        </div>
        
        <span slot="footer" class="dialog-footer">
            <el-button @click="outerDialogCancel">取 消</el-button>
            <el-button type="primary" @click="outerDialogSubmit">保 存</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
import { getProjectList, addProject, updateProject, getCateList, getSubjectList } from '@/api/exam'

export default {
  data() {
    return {
      listLoading: false,
      projectData: null,
      projectList:[],
      //编辑
      project_name: null,
      projectEditDialogVisible: false,
      editRowList: [],
      //树
      innerDialogVisible: false,
      cate_show_tree: [],
      defaultProps: {
          children: 'childCategoryList',
          label: 'name'
      },

    }
  },
  created() {
    this.fetchData()
    this.fetchCateInfo()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getProjectList().then(response => {
        this.projectData = response.data
        let list = response.data.itemList
        if (!list || list.length == 0) {
          return
        }
        list = list.map(item => {
          let rItem = item
          rItem["desc"] = item.cateName+" - "+item.subjectName + " - "+item.indexName
          return rItem
        })
        let resArray = {
          name: this.projectData.name,
          list: list
        }
        this.projectList = [resArray]
        this.project_name = this.projectData.name
      }).finally(
        this.listLoading = false
      )
    },
    addProject() {

    },
    //编辑
    editProject(row) {
      let rowList = []
      row.list.filter(item => {
        rowList.push(item)
        return true
      })
      this.editRowList = rowList
      this.projectEditDialogVisible = true
    },
    addCateSubject() {

    },
    deleteCate(row) {
      let index = this.editRowList.indexOf(row)
      if (index != -1) {
        this.editRowList.splice(index, 1)
      }
    },
    outerDialogCancel() {
      this.projectEditDialogVisible = false
    },
    outerDialogSubmit() {
      this.projectEditDialogVisible = false
    },
    //树
    handleNodeClick() {

    },
    innerDialogSubmit() {

    },
    //数据请求
    async fetchCateInfo() {
      let result = await getCateList().catch(e=>{
        this.$message.error(e)
      })
      if (result.success) {
        result = result.data
        console.log(result)
      }
    }
  }
}
</script>
