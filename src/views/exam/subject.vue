<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-button type="primary" @click="clickAddSubject">添加类目</el-button>
        <el-tree
          :data="cateList"
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps">
        </el-tree>
      </el-col>
      <el-divider :span="2" direction="vertical" content-position="center"/>
      <el-col :span="16">
        <el-button type="primary" @click="clickAddSubject">添加项目</el-button>
        <el-table
          v-loading="listLoading"
          :data="subjectList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="项目ID" width="95" prop="id"></el-table-column>
          <el-table-column label="项目名称" width="100" prop="name"></el-table-column>
          <el-table-column label="项目创建人" width="100" prop="creator"></el-table-column>
          <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="mini" @click="editbyid(scope.row.id)" >编辑</el-button>
              <el-button type="text" icon="el-icon-delete" size="mini" @click="removebyid(scope.row.id)">删除</el-button>
              <el-button type="text" icon="el-icon-delete" size="mini" @click="clickAddIndex(scope.row.id)">添加指标</el-button>
            </template>
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table
              class="table-in-table"
              :data="props.row.indexList"
              style="width: 100%;"
              row-key="id"
              border
              stripe
              >
                <el-table-column label="指标ID" width="95" prop="id"></el-table-column>
                <el-table-column label="指标名称" width="100" prop="name"></el-table-column>
                <el-table-column label="指标创建人" width="100" prop="creator"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="mini" @click="editbyid(scope.row.id)" >编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" size="mini" @click="removebyid(scope.row.id)">删除</el-button>
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
          :total="total" background>
        </el-pagination>
      </el-col>
    </el-row>

    <!-- 添加项目 -->
    <el-dialog title='添加项目' :visible.sync="subjectVisible" width="500px">
      <el-form :model="subjectForm">
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

  </div>
</template>

<script>
import { addSubject, getSubjectList, addIndex, getIndexList, addCate, getCateList} from '@/api/exam'

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
        cateId:1
      },
      subjectList: null,
      cateList: [],
      listLoading: true,
      subjectForm:{
        name:"",
      },
      indexForm:{
        name:"",
      },
      subjectVisible:false,
      indexVisible:false,
      cateId:1,
      subjectId:null,
      defaultProps: {
        label: 'name'
      }
    }
  },
  created() {
    this.fetchCateData()
  },
  methods: {
    fetchSubjectData() {
      this.listLoading = true
      getSubjectList(this.params).then(response => {
        this.subjectList = response.data.listData
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },

    fetchCateData() {
      this.listLoading = true
      getCateList().then(response => {
        this.cateList = response.data.listData
        this.listLoading = false
      })
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
      this.subjectForm['cateId']=this.cateId
      addSubject(this.subjectForm).then(response =>{
        this.$message.success('添加成功')
        this.subjectVisible = false;
        this.fetchData();
      })
    },

    clickAddSubject(){
      this.subjectForm = {};
      this.subjectVisible = true;
    },

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
        this.fetchData();
      })
    },
  }
}
</script>
