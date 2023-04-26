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
        :title="dialogTitle"
        :visible.sync="projectEditDialogVisible"
        width="50%">
        <!-- 内层对话框 -->
        <el-dialog title="类目选择" :visible.sync="innerDialogVisible" width="30%" append-to-body>
            <el-tree :props="defaultProps" :load="loadNode1" ref="tree" show-checkbox lazy></el-tree>
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
          <el-button type="primary" size="mini" @click="addCateSubject">新增</el-button>
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
      dialogTitle: "编辑模板",
      newProject: false,//是否新建
      //编辑
      project_name: null,
      projectEditDialogVisible: false,
      editRowList: [],
      //树
      innerDialogVisible: false,
      defaultProps: {
          children: 'indexList',
          label: 'name',
          isLeaf: 'leaf'
      },
      editChanged: false
    }
  },
  created() {
    this.fetchData()
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
      this.newProject = true
      this.dialogTitle = "新建模板"
      this.editRowList = []
      this.projectEditDialogVisible = true
    },
    //编辑
    editProject(row) {
      this.newProject = false
      this.dialogTitle = "编辑模板"
      let rowList = []
      row.list.filter(item => {
        let rItem = item
        rItem["keys"] = item.cateName+","+item.subjectName+","+item.indexName
        rItem["ids"] = item.examCateId+","+item.examSubjectId+","+item.examItemId
        rowList.push(rItem)
        return true
      })
      this.editRowList = rowList
      this.projectEditDialogVisible = true
    },
    addCateSubject() {
      this.innerDialogVisible = true
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
    async outerDialogSubmit() {
      if (this.project_name == this.projectData.name && !this.editChanged) {
        this.$message.success("无变更")
        return
      }
      let body = {
        name: this.project_name,
        examItems: this.editRowList
      }
      if (!this.newProject) {
        body["id"] = this.projectData.id
      }
      console.log("submit------")
      console.log(body)
      let result = null
      if (this.newProject) {
        result = await addProject(body).catch(e=>{
            this.$message.error(e)
        })
      } else {
        result = await updateProject(body).catch(e=>{
            this.$message.error(e)
        })
      }
      if (result.success) {
        result = result.data
        if (result) {
          this.$message.success("提交成功")
          this.fetchData()
          this.projectEditDialogVisible = false
        } else {
          this.$message.error("提交失败")
        }
      } else {
        this.$message.error("提交失败")
      }
    },
    //树
    loadNode1(node, resolve) {
      if (node.level == 0) {
        getCateList().then(response => {
          let listData = response.data
          if (listData.length > 0) {
            let cateList = listData.map(item => {
              let rItem = item
              rItem["keys"] = item.name
              rItem["ids"] = item.id
              return rItem
            })
            return resolve(cateList);
          } else {
            return resolve([])
          }
        }).catch(e=>{
          return resolve([])
        })
      } else if (node.level == 1) {
        getSubjectList({
          cateId: node.data.id,
          page: 1,
          pageSize: 100
        }).then(response => {
          let listData = response.data.listData
          listData = listData.map(item => {
            let rItem = item
            rItem["keys"] = node.data.keys+","+item.name
            rItem["ids"] = node.data.ids+","+item.id
            return rItem
          })
          return resolve(listData);
        }).catch(e=>{
          return resolve([])
        })
      } else {
        if (node.data.indexList && node.data.indexList.length > 0) {
          let listData = node.data.indexList.map(item =>{
            let rItem = item
            rItem["keys"] = node.data.keys+","+item.name
            rItem["ids"] = node.data.ids+","+item.id
            rItem["leaf"] = true
            return rItem
          })
          return resolve(listData)
        } else {
          return resolve([])
        }
      }
    },
    innerDialogSubmit() {
      let nodes = this.$refs.tree.getCheckedNodes(true)
      for (const node of nodes) {
        if(!this.findNodeInEditRowList(node)) {
          this.editChanged = true
          let keysArr = node.keys.split(",");
          let idsArr = node.ids.split(",");
          let obj = {
            examCateId: idsArr[0],
            examSubjectId: idsArr[1],
            examItemId: idsArr[2],
            cateName: keysArr[0],
            subjectName: keysArr[1],
            indexName: keysArr[2]
          }
          let res = Object.assign(obj, node)
          this.editRowList.push(obj)
        }
      }
      this.innerDialogVisible = false
    },
    findNodeInEditRowList(node) {
      let obj = this.editRowList.find(obj => {
          return (obj.keys == node.keys)
      })
      if (obj) {
        return true
      }
      return false
    }
  }
}
</script>
