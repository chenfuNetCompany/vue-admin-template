<template>
  <div class="app-container">
    <el-button type="primary" @click="clickAddNews">添加新闻</el-button>
    <el-table v-loading="listLoading" :data="list" border fit>
      <el-table-column label="ID" width="95" prop="id"></el-table-column>
      <el-table-column label="新闻主图" width="80" style="align:center">
          <template slot-scope="scope">
              <img :src="scope.row.mainImageUrl" width="60" height="60"/>
          </template>
      </el-table-column>
      <el-table-column label="标题" width="300" prop="title"></el-table-column>
      <el-table-column label="正文" width="300" prop="detail"></el-table-column>
      <el-table-column label="正文图" width="80" style="align:center">
          <template slot-scope="scope">
              <img :src="scope.row.detailImageUrl" width="60" height="60"/>
          </template>
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="editbyrow(scope.row)">编辑</el-button>
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
    <el-dialog title="添加新闻" :visible.sync="dialogAddVisible" width="700px">
      <el-form :model="form" text-align="left" label-position="top">
          <el-form-item label="新闻主图(支持jpg/jpeg/png文件，且不超过250kb)">
            <OssUploader v-bind:file="form.mainImage" v-bind:url="form.mainImageUrl" @valueChanged="mainChanged" > </OssUploader>
          </el-form-item>
          <el-form-item label="新闻标题">
              <el-input placeholder="请输入新闻标题" style="width:580px;" v-model="form.title" clearable/>
          </el-form-item>
          <el-form-item label="新闻正文">
              <el-input style="width:580px;" v-model="form.detail" type="textarea"/>
          </el-form-item>
          <el-form-item label="新闻正文图(支持jpg/jpeg/png文件，且不超过250kb)">
            <OssUploader v-bind:file="form.detailImage" v-bind:url="form.detailImageUrl" @valueChanged="detailChanged" > </OssUploader>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddVisible = false">取 消</el-button>
          <el-button type="primary" @click="onAddNews()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addNews, getNewsList, updateNews, deleteNews } from '@/api/news'
import OssUploader from "@/components/OssUploader"

export default {
  components:{
    OssUploader
  },
  data() {
    return {
      params:{
        page:1,
        pageSize:10,
        cateId:1
      },
      form:{
        mainImage:null,
        mainImageUrl:null,
        detailImage:null,
        detailImageUrl:null,
        title:null,
        detail:null
      },
      list: null,
      listLoading: true,
      total:0,
      dialogAddVisible:false,
      isEdit:false
    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.listLoading = true
      getNewsList(this.params).then(response => {
        this.list = response.data.listData
        this.total = response.data.totalCount
      }).finally(
        this.listLoading = false
      )
    },
    
    handleSizeChange(newsize){
      this.params.pageSize=newsize
      this.fetchData()
    },

    handleCurrentChange(newpage){
      this.params.page=newpage
      this.fetchData()
    },

    mainChanged(data){
      this.form.mainImage = data.file;
      this.form.mainImageUrl = data.url;
    },

    detailChanged(data){
      this.form.detailImage = data.file;
      this.form.detailImageUrl = data.url;
    },

    clickAddNews(){
      this.form = {};
      this.isEdit = false
      this.dialogAddVisible = true;
    },

    editbyrow(row){
      this.form = Object.assign({},row);
      this.isEdit = true
      this.dialogAddVisible = true;
    },

    async onAddNews(){
      if (this.isEdit){
        await updateNews(this.form).catch(e =>{
          this.$message.error(e)
        })

        this.$message.success("成功")
        this.dialogAddVisible = false;
        this.fetchData();
        return;
      }

      await addNews(this.form).catch(e =>{
        return this.$message.error(e)
      })

      this.$message.success("成功")
      this.dialogAddVisible = false;
      this.fetchData();
    },

    async removebyid(newsId){
      const confirmRes = await this.$confirm("是否确定删除？",{type:'warning'}).catch(e=>e)
      if (confirmRes !== 'confirm'){
        return;
      }
      const result = await deleteNews({id:newsId}).catch(e =>{
        this.$message.error(e)
      })

      if (result.success === true){
        this.$message.success("成功")
        this.fetchData();
      }
    },
  }
}
</script>
