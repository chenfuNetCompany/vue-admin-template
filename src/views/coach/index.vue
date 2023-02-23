<template>
  <div class="app-container">
    <el-button type="primary" @click="clickAddCoach()">添加教练</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95" prop="id">
        <!-- <template slot-scope="scope">
          {{ scope.$index }}
        </template> -->
      </el-table-column>
      
      <el-table-column width="120" label="头像" style="align:center">
          <template slot-scope="scope">
              <img :src="scope.row.avatarUrl" width="100" height="100"/>
          </template>
      </el-table-column>

      <el-table-column label="姓名" width="200" prop="name"></el-table-column>
      <el-table-column label="场馆" width="200" prop="roomName"></el-table-column>
      <el-table-column label="关联账号" width="200" prop="account"></el-table-column>
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="editRow(scope.row)" >编辑</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="removebyid(scope.row.id)">删除</el-button>
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
    <el-dialog title="添加教练" :visible.sync="dialogAddVisible" width="500px">
      <el-form :model="form" text-align="left" label-position="top">
          <el-form-item label="name" label-width="200">
              <el-input placeholder="请输入教练名字" style="width:280px;" v-model="form.name" clearable/>
          </el-form-item>
          <el-form-item label="头像(支持jpg/jpeg/png文件，且不超过250kb)">
            <OssUploader 
              v-bind:file="form.avatar"
              v-bind:url="form.avatarUrl"
              @valueChanged="avatorChanged" >
            </OssUploader>
          </el-form-item>
          <el-form-item label="所属场馆">
            <el-select
              v-model="form.roomId"
              allow-create
              filterable 
              collapse-tags
              placeholder="请选择">
              <el-option
                v-for="row in roomOptions"
                :key="row.id"
                :label="row.name"
                :value="row.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联账号">
            <el-select
              v-model="form.accountId"
              allow-create
              filterable 
              collapse-tags
              placeholder="请选择">
              <el-option
                v-for="row in accountOptions"
                :key="row.id"
                :label="row.account"
                :value="row.id">
              </el-option>
            </el-select>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddVisible = false">取 消</el-button>
          <el-button type="primary" @click="onAddCoach()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addCoach, updateCoach, deleteCoach, getCoachList, getCoachAccountList } from '@/api/coach'
import { getRoomList } from '@/api/room'
import OssUploader from "@/components/OssUploader"

export default {
  components:{
    OssUploader
  },
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
      },
      form:{
        roomId:null,
        name:null,
        avatar:null,
        avatarUrl:null,
        accountId:null,
      },
      list: null,
      listLoading: true,
      total:0,
      dialogAddVisible:false,
      isEdit:false,
      roomOptions:[],
      accountOptions:[],
    }
  },
  created() {
    this.initData()
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getCoachList(this.params).then(response => {
        this.list = response.data.listData
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },

    async initData(){
      const roomList = await getRoomList({page:1,pageSize:100}).catch(e =>{
        return this.$message.error(e)
      })
      this.roomOptions = roomList.data.listData

      const accountList = await getCoachAccountList({}).catch(e =>{
        return this.$message.error(e)
      })
      this.accountOptions = accountList.data
    },
    
    handleSizeChange(newsize){
      this.params.pageSize=newsize
      this.fetchData()
    },

    handleCurrentChange(newpage){
      this.params.page=newpage
      this.fetchData()
    },

    clickAddCoach(){
      this.form = {};
      this.isEdit = false
      this.dialogAddVisible = true;
    },

    editRow(row){
      this.form = Object.assign({},row);
      this.isEdit = true
      this.dialogAddVisible = true;
    },

    async onAddCoach(){
      if (this.isEdit){
        await updateCoach(this.form).catch(e =>{
          return this.$message.error(e)
        })

        this.$message.success("成功")
        this.dialogAddVisible = false;
        this.fetchData();
        return;
      }

      await addCoach(this.form).catch(e =>{
        return this.$message.error(e)
      })

      this.$message.success("成功")
      this.dialogAddVisible = false;
      this.fetchData();
    },

    async removebyid(coachId){
      const result = await deleteCoach({id:coachId}).catch(e =>{
        this.$message.error(e)
      })

      if (result.success === true){
        this.$message.success("成功")
        this.fetchData();
      }
    },

    avatorChanged(data){
      console.log(data)
      this.form.avatar = data.file;
      this.form.avatarUrl = data.url;
    },

  }
}
</script>

<style scoped>
.goodpic{
  display:flex;
  flex-direction:column;
  border-color: gray;
  border-width: 0.1px;
  border-style: solid;
  margin-right: 10px;
  height: 130px;
  width: 100px;
}
.goodpicadd{
  display: flex;
  align-content:center;
}
</style>
