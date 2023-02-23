<template>
  <div class="app-container">
    <el-button type="primary" @click="clickAddRoom()">添加场地</el-button>
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
      
      <el-table-column width="80" label="照片" style="align:center">
          <template slot-scope="scope">
              <img :src="scope.row.imageUrl" width="60" height="60"/>
          </template>
      </el-table-column>

      <el-table-column label="名称" width="100" prop="name"></el-table-column>
      <el-table-column label="地址" width="300" prop="address"></el-table-column>
      <el-table-column label="经度" width="100" prop="longitude"></el-table-column>
      <el-table-column label="纬度" width="100" prop="latitude"></el-table-column>
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
    <el-dialog title="添加场馆" :visible.sync="dialogAddVisible" width="500px">
      <el-form :model="form" text-align="left" label-position="top">
          <el-form-item label="照片(支持jpg/jpeg/png文件，且不超过250kb)">
            <OssUploader 
              v-bind:file="form.image"
              v-bind:url="form.imageUrl"
              @valueChanged="imageChanged" >
            </OssUploader>
          </el-form-item>
          <el-form-item label="名称" label-width="200">
              <el-input placeholder="请输入场馆名称" style="width:280px;" v-model="form.name" clearable/>
          </el-form-item>
          <el-form-item label="地址" label-width="200">
              <el-input placeholder="请输入场馆地址" style="width:280px;" v-model="form.address" clearable/>
          </el-form-item>
          <el-form-item label="经度" label-width="200">
              <el-input placeholder="请输入场馆经度" style="width:280px;" v-model="form.longitude" clearable/>
          </el-form-item>
          <el-form-item label="纬度" label-width="200">
              <el-input placeholder="请输入场馆纬度" style="width:280px;" v-model="form.latitude" clearable/>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddVisible = false">取 消</el-button>
          <el-button type="primary" @click="onAddRoom()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addRoom, updateRoom, deleteRoom, getRoomList } from '@/api/room'
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
        id:null,
        name:null,
        image:null,
        imageUrl:null,
        address:null,
        longitude:null,
        latitude:null,
      },
      list: null,
      listLoading: true,
      total:0,
      dialogAddVisible:false,
      isEdit:false,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getRoomList(this.params).then(response => {
        this.list = response.data.listData
        this.total = response.data.totalCount
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

    clickAddRoom(){
      this.form = {};
      this.isEdit = false
      this.dialogAddVisible = true;
    },

    editRow(row){
      this.form = Object.assign({},row);
      this.isEdit = true
      this.dialogAddVisible = true;
    },

    async onAddRoom(){
      if (this.isEdit){
        await updateRoom(this.form).catch(e =>{
          return this.$message.error(e)
        })

        this.$message.success("成功")
        this.dialogAddVisible = false;
        this.fetchData();
        return;
      }

      await addRoom(this.form).catch(e =>{
        return this.$message.error(e)
      })

      this.$message.success("成功")
      this.dialogAddVisible = false;
      this.fetchData();
    },

    async removebyid(coachId){
      const result = await deleteRoom({id:coachId}).catch(e =>{
        this.$message.error(e)
      })

      if (result.success === true){
        this.$message.success("成功")
        this.fetchData();
      }
    },

    imageChanged(data){
      this.form.image = data.file;
      this.form.imageUrl = data.url;
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
