<template>
  <div class="app-container">
    <el-row :gutter="20">

      <!------------------------------ 测试类目区域 ------------------------------->
      <el-col :span="8">
        <el-button type="primary" @click="clickAddCate">添加类目</el-button>
        <el-table :data="cateList" border fit highlight-current-row>
          <el-table-column label="类目ID" width="100" prop="id"></el-table-column>
          <el-table-column label="类目名称" width="100" prop="name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="mini" @click="detailCateRow(scope.row, 0)" >项目编辑</el-button>
              <el-button type="text" icon="el-icon-edit" size="mini" @click="editbyRow(scope.row, 0)" >修改</el-button>
              <el-button type="text" icon="el-icon-delete" size="mini" @click="removebyid(scope.row.id, 0)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-divider :span="4" direction="vertical" content-position="center"/>

      <!--------------------------- 测试项目区域 ---------------------------->
      <el-col :span="12">
        <el-button type="primary" @click="clickAddSubject" :disabled="params.cateId === null || params.cateId === undefined">添加项目</el-button>
        <el-table :data="subjectList" border fit v-loading="listLoading" default-expand-all>
          <el-table-column align="center" label="项目ID" width="95" prop="id"></el-table-column>
          <el-table-column label="项目名称" width="120" prop="name"></el-table-column>
          <el-table-column label="项目创建人" width="120" prop="creator"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="mini" @click="editbyRow(scope.row, 1)" >修改</el-button>
              <el-button type="text" icon="el-icon-delete" size="mini" @click="removebyid(scope.row.id, 1)">删除</el-button>
              <el-button type="text" icon="el-icon-delete" size="mini" @click="clickAddIndex(scope.row.id)">添加指标</el-button>
            </template>
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table class="table-in-table" :data="props.row.indexList" style="width: 100%;" row-key="id" border stripe>
                <el-table-column label="指标ID" width="95" prop="id"></el-table-column>
                <el-table-column label="指标名称" width="100" prop="name"></el-table-column>
                <el-table-column label="指标创建人" width="100" prop="creator"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="mini" @click="editbyRow(scope.row, 2)" >修改</el-button>
                    <el-button type="text" icon="el-icon-delete" size="mini" @click="removebyid(scope.row.id, 2)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.page"
          :page-size="params.pageSize"
          :page-sizes="[5, 10, 15, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" 
          background>
        </el-pagination>
      </el-col>
    </el-row>

    <!-- 添加类目 -->
    <el-dialog title='添加类目' :visible.sync="cateVisible" width="500px">
      <el-form :model="cateForm">
          <el-form-item label="名称" label-width="200">
              <el-input placeholder="请输入类目名称" style="width:280px;" v-model="cateForm.name"/>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="cateVisible = false">取 消</el-button>
          <el-button type="primary" @click="onAddCate()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加项目 -->
    <el-dialog title='添加项目' :visible.sync="subjectVisible" width="500px">
      <el-form :model="subjectForm">
          <el-form-item label="类目" label-width="200">{{ params.cateName }}</el-form-item>
          <el-form-item label="名称" label-width="200">
              <el-input placeholder="请输入项目名称" style="width:280px;" v-model="subjectForm.name"/>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="subjectVisible = false">取 消</el-button>
          <el-button type="primary" @click="onAddSubject()">确 定</el-button>
      </div>
    </el-dialog>

     <!-- 添加指标 -->
    <el-dialog title='添加指标' :visible.sync="indexVisible" width="500px">
      <el-form :model="indexForm">
          <el-form-item label="名称" label-width="200">
              <el-input placeholder="请输入指标名称" style="width:280px;" v-model="indexForm.name"/>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="indexVisible = false">取 消</el-button>
          <el-button type="primary" @click="onAddIndex()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑-->
    <el-dialog :title='editConfig.title' :show-close="false" :close-on-click-modal="false" :visible.sync="editConfig.editDialogVisible" width="500px">
      <el-form :model="editConfig.editForm">
          <el-form-item label="名称" label-width="200">
              <el-input placeholder="" style="width:280px;" v-model="editConfig.editForm.name"/>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="editConfig.editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogSubmit()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { addSubject, getSubjectList, addIndex, getIndexList, addCate, getCateList} from '@/api/exam'
import { deleteIndex, deleteSubject, deleteCate, updateIndex, updateSubject, updateCate } from '@/api/exam'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      params:{
        page:1,
        pageSize:10,
        cateId:null,
        cateName:null,
      },

      subjectForm:{
        cateId:null,
        name:null,
      },
      indexForm:{
        name:"",
      },
      cateForm:{
        name:""
      },
      subjectList: null,
      cateList: [],
      listLoading: false,
      subjectVisible:false,
      indexVisible:false,
      cateVisible:false,
      subjectId:null,
      defaultProps: {
        label: 'name'
      },
      total:0,
      //编辑
      editConfig: {
        title: "修改类目",
        editDialogVisible: false,
        editForm: {
          name: ""
        },
        type: 0,
        rowData: null
      }
    }
  },
  created() {
    this.fetchCateData()
  },
  methods: {

    //////////类目相关//////////////////////////////
    async fetchCateData() {
      const cateRes = await getCateList();
      if (cateRes.success === true){
        this.cateList = cateRes.data
      }else{
        this.$message.error(cateRes.errorMsg)
      }
    },

    // onCateChange(node){
    //   console.log(node)
    //   this.params.cateId = node.id;
    //   this.params.cateName = node.name;
    //   this.fetchSubjectData();
    // },

    clickAddCate(){
      this.cateForm = {};
      this.cateVisible = true;
    },

    onAddCate(){
      addCate(this.cateForm).then(response =>{
        this.$message.success('添加成功')
        this.cateVisible = false;
        this.fetchCateData();
      })
    },

    //////////项目相关//////////////////////////////
    async fetchSubjectData() {
      this.listLoading = true
      const subjectRes = await getSubjectList(this.params);
      this.listLoading = false

      if (subjectRes.success === true){
        this.subjectList = subjectRes.data.listData
        this.total = subjectRes.data.totalCount
      }else{
        this.$message.error(cateRes.errorMsg)
      }
    },
    
    handleSizeChange(newsize){
      this.params.pageSize=newsize
      this.fetchData()
    },

    handleCurrentChange(newpage){
      this.params.page=newpage
      this.fetchData()
    },

    onAddSubject(){
      this.subjectForm['cateId']= this.params.cateId
      addSubject(this.subjectForm).then(response =>{
        this.$message.success('添加成功')
        this.subjectVisible = false;
        this.fetchSubjectData();
      })
    },

    clickAddSubject(){
      this.subjectForm = {};
      this.subjectVisible = true;
    },

    //////////指标相关//////////////////////////////
    clickAddIndex(subjectId){
      this.subjectId = subjectId;
      this.indexForm = {};
      this.indexVisible = true;
    },

    onAddIndex(){
      this.indexForm['subjectId']=this.subjectId
      addIndex(this.indexForm).then(response =>{
        this.$message.success('添加成功')
        this.indexVisible = false;
        this.fetchSubjectData();
      })
    },
    //操作
    removebyid(id, type) {
      if (type == 2) {
        deleteIndex({
          id: id
        }).then(response =>{
          this.$message.success('删除成功')
          this.fetchSubjectData();
        })
      } else if (type == 1) {
        deleteSubject({
          id: id
        }).then(response =>{
          this.$message.success('删除成功')
          this.fetchSubjectData();
        })
      } else {
        deleteCate({
          id: id
        }).then(response =>{
          this.$message.success('删除成功')
          this.fetchCateData();
          this.subjectList = []
        })
      }
    },
    editbyRow(row, type) {
      if (type == 2) {
        this.editConfig.title = "修改指标"
      } else if (type == 1) {
        this.editConfig.title = "修改项目"
      } else {
        this.editConfig.title = "修改类目"
      }
      this.editConfig.editDialogVisible = true
      this.editConfig.editForm.name = row.name
      this.editConfig.type = type
      this.editConfig.rowData = row
    },
    editDialogSubmit() {
      let type = this.editConfig.type
      this.editConfig.rowData.name = this.editConfig.editForm.name
      if (type == 2) {
        updateIndex(this.editConfig.rowData).then(response =>{
          this.$message.success('修改成功')
          this.editConfig.editDialogVisible = false
          this.fetchSubjectData();
        })
      } else if (type == 1) {
        updateSubject(this.editConfig.rowData).then(response =>{
          this.$message.success('修改成功')
          this.editConfig.editDialogVisible = false
          this.fetchSubjectData();
        })
      } else {
        updateCate(this.editConfig.rowData).then(response =>{
          this.$message.success('修改成功')
          this.editConfig.editDialogVisible = false
          this.fetchCateData();
        })
      }
    },
    detailCateRow(row, type) {
      this.params.cateId = row.id;
      this.params.cateName = row.name;
      this.fetchSubjectData();
    }
  }
}
</script>

<style scoped>
.el-tree-node__label
{
    font-size: 18px;
}
</style>
