<template>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column style="align:center" label="ID" width="95" prop="id"></el-table-column>
        <el-table-column width="120" label="名称" style="align:center" prop="name"></el-table-column>
        <el-table-column width="120" label="金额" prop="val"></el-table-column>
        <el-table-column width="120" label="总数" prop="totalCount"></el-table-column>
        <el-table-column width="120" label="领取数量" prop="receiveCount"></el-table-column>
        <el-table-column width="120" label="使用数量" prop="usedCount"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="mini" @click="editbyid(scope.row.id)" >编辑</el-button>
            <el-button type="text" icon="el-icon-delete" size="mini" @click="distbyid(scope.row.id)">发放</el-button>
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

      <el-dialog :title="发放优惠券" :visible.sync="dialogOrderVisible" width="500px">
		    <el-form :model="selectCoupon">
		        <el-form-item label="用户" :label-width="200">
		            <el-input placeholder="请输入用户ID" style="width:280px;" v-model="distForm.userId" clearable/>
		        </el-form-item>
		        <el-form-item label="数量" :label-width="200">
		            <el-input placeholder="请输入数量" style="width:280px;" v-model="distForm.count" clearable/>
		        </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button @click="dialogOrderVisible = false">取 消</el-button>
		        <el-button type="primary" @click="distCoupon()">确 定</el-button>
		    </div>
		</el-dialog>
    </div>
  </template>
  
  <script>
  import { promotionlist , distCoupon} from '@/api/promotion'
  
  export default {
    // filters: {
    //   statusFilter(status) {
    //     const statusMap = {
    //       0: '正常',
    //     }
    //     return statusMap[status]
    //   }
    // },
    data() {
      return {
        params:{
          page:1,
          pageSize:10
        },
        list: null,
        listLoading: true,
        total:0,
        dialogOrderVisible:false,
        distForm:{
          couponId:null,
          userId:null,
          count:null
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        promotionlist(this.params).then(response => {
          this.list = response.data.listData
          this.total = response.data.totalCount
          this.listLoading = false
          this.list.forEach(element => {
            if (element.countType === 1){
              element.totalCount = '无限'
            }
          });
        })
      },

      editbyid(couponId){
      },

      distbyid(couponId){
        this.distForm = {
          couponId:couponId
        };
        this.dialogOrderVisible = true;
      },

      async distCoupon(){
        console.log(11111)
        const res = await distCoupon(this.distForm).catch(ex =>{
          this.$$message.error(ex)
        })

        console.log(res)
        if (res.success === false){
          this.$message.error("优惠券发放失败")
        }
        this.$message.success("优惠券发放成功")
        this.dialogOrderVisible = false;
        this.distForm = {};
      },
      
      handleSizeChange(newsize){
        this.params.pageSize=newsize
        this.fetchData()
      },
  
      handleCurrentChange(newpage){
        this.params.page=newpage
        this.fetchData()
      },

      statusFilter(status) {
        const statusMap = {
          0: '正常',
        }
        return statusMap[status]
      }
    }
  }
  </script>
  