<template>
  <div class="app-container">
    <el-row :gutter="20">
        <!-- <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @click="goodlist">
            <el-button slot="append" icon="el-icon-search" @click="goodlist"></el-button>
            </el-input>
        </el-col> -->
        <el-col :span="4">
            <el-button type="primary" @click="gotoadd">添加商品</el-button>
        </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      border
      highlight-current-row
    >
      <el-table-column label="ID" width="95" prop="id"></el-table-column>
      <el-table-column width="80" label="商品主图" style="align:center">
          <template slot-scope="scope">
              <img :src="scope.row.mainImage" width="60" height="60"/>
          </template>
      </el-table-column>
      <el-table-column label="标题" width="200" prop="title"></el-table-column>
      <el-table-column label="详情" width="200" prop="detail"></el-table-column>
      <el-table-column width="80" label="商品详情图" style="align:center">
          <template slot-scope="scope">
              <img :src="scope.row.detailImageUrl" width="60" height="60"/>
          </template>
      </el-table-column>
      <el-table-column label="库存" width="95" prop="quantity"></el-table-column>
      <el-table-column label="价格" width="120">
        <template slot-scope="scope">
          {{ scope.row.minPrice}} ~ {{ scope.row.maxPrice}}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110">
        <template slot-scope="scope">{{statusFilter(scope.row.status)}}</template>
      </el-table-column>
      <el-table-column label="是否推荐" width="110">
        <template slot-scope="scope">{{recommendFilter(scope.row.recommend)}}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="editbyid(scope.row.id)" >编辑</el-button>
          <!-- <el-button type="text" icon="el-icon-edit" size="mini" @click="removebyid(scope.row.id)" >删除</el-button> -->
          <el-button v-show="scope.row.recommend === false" type="text" icon="el-icon-delete" size="mini" @click="recommendbyid(scope.row.id)">加入推荐</el-button>
          <el-button v-show="scope.row.recommend === true" type="text" icon="el-icon-delete" size="mini" @click="unrecommendbyid(scope.row.id)">取消推荐</el-button>
          <el-button v-show="scope.row.status === 1" type="text" icon="el-icon-delete" size="mini" @click="offlinebyid(scope.row.id)">下架</el-button>
          <el-button v-show="scope.row.status === 2" type="text" icon="el-icon-delete" size="mini" @click="onlinebyid(scope.row.id)">上架</el-button>
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
  </div>
</template>

<script>
import { addGood, getGoodList, getGoodCate, online, offline, recommend, unrecommend } from '@/api/good'
import { booleanFilter, goodStatusFilter} from '@/utils/filter'
import { throwStatement } from '@babel/types';

export default {
  data() {
    return {
      params:{
        page:1,
        pageSize:10,
        cateId:null
      },
      list: null,
      listLoading: true,
      total:0
    }
  },
  created() {
    var path = this.$route.path;
    if (path === "/product/course"){
      this.params.cateId = 1;
    }else if (path === "/product/ticket"){
      this.params.cateId = 2;
    }else if (path === "/product/activity"){
      this.params.cateId = 3;
    }else{
      this.$message.error('页面路径错误')
      return;
    }
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.listLoading = true
      getGoodList(this.params).then(response => {
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

    statusFilter(status){
      return goodStatusFilter(status)
    },

    recommendFilter(status){
      return booleanFilter(status)
    },

    async recommendbyid(goodid){
      const result = await recommend({id:goodid}).catch(e=>{
        this.$message.error(e)
      })
      this.commonhandlerresult(result)
    },

    async unrecommendbyid(goodid){
      const result = await unrecommend({id:goodid}).catch(e=>{
        this.$message.error(e)
      })
      this.commonhandlerresult(result)
    },

    async onilnebyid(goodid){
      const result = await online({id:goodid}).catch(e=>{
        this.$message.error(e)
      })
      this.commonhandlerresult(result)
    },

    async offlinebyid(goodid){
      const result = await offline({id:goodid}).catch(e=>{
        this.$message.error(e)
      })
      this.commonhandlerresult(result)
    },

    commonhandlerresult(result){
      if (result.success === true){
        this.$message.success("成功")
        this.fetchData();
      }else{
        this.$message.error(result.errorMsg)
      }
    },


    gotoadd(){
      this.$router.push({path:'/product/course/add', query:{cateId:this.params.cateId}})
    },

    editbyid(goodid){
      this.$router.push({path:'/product/course/add', query:{goodId:goodid}})
      
    }
  }
}
</script>
