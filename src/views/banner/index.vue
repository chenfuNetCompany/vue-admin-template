<template>
  <div class="app-container">
    <el-button type="primary" @click="clickAddBanner()">添加Banner</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="位置" width="60" prop="pos" align="center"></el-table-column>
      <el-table-column width="140" label="图片" align="center">
          <template slot-scope="scope">
              <img :src="scope.row.imageUrl" width="120" height="60"/>
          </template>
      </el-table-column>
      <el-table-column label="跳转类型" width="80" prop="actionType"></el-table-column>
      <el-table-column label="跳转参数" width="300" prop="actionInfo"></el-table-column>
      <el-table-column label="状态" width="80" align="center">
        <template slot-scope="scope">{{statusFilter(scope.row.status)}}</template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="editbyrow(scope.row)" >编辑</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="removebyid(scope.row.id)">删除</el-button>
          <el-button v-show="scope.row.status === 1" type="text" icon="el-icon-delete" size="mini" @click="offlinebyid(scope.row.id)">下架</el-button>
          <el-button v-show="scope.row.status === 2" type="text" icon="el-icon-delete" size="mini" @click="onilnebyid(scope.row.id)">上架</el-button>
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
    <el-dialog title="添加Banner" :visible.sync="dialogAddVisible" width="500px">
      <el-form :model="form" text-align="left" label-position="top">
          <el-form-item label="头像(支持jpg/jpeg/png文件，且不超过250kb)">
            <OssUploader v-bind:file="form.image" v-bind:url="form.imageUrl" @valueChanged="imageChanged" ></OssUploader>
          </el-form-item>

          <el-form-item label="位置">
            <el-input v-model="form.pos"/>
          </el-form-item>

          <el-form-item label="跳转类型">
            <el-select v-model="form.actionTypeId" placeholder="请选择" @change="actionChanged($event)" clearable>
              <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="跳转参数" v-show="form.actionParams != null && form.actionParams.length > 0">
            <div style="display: flex;">
              <div v-for="(item, i) in form.actionParams" :key="i">
                <div>{{item.name}}</div>
                <el-input v-model="item.value"></el-input>
              </div>
            </div>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddVisible = false">取 消</el-button>
          <el-button type="primary" @click="onAddBanner()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addBanner, getBannerList,offlineBanner, onlineBanner, updateBanner, deleteBanner } from '@/api/banner'
import { bannerStatusFilter} from '@/utils/filter'
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
      },
      list: null,
      listLoading: true,
      dialogAddVisible:false,
      total:null,
      isEdit:false,
      form: {
        image: null,
        imageUrl: null,
        pos:null,
        actionInfo: null,
        actionParams:[],
        actionType:null,
        actionTypeId:null,
      },
      actionOptions:[
        {value:1,label:'新闻'},
        {value:2,label:'产品'},
        {value:3,label:'网页'}
      ],
      actionParamOptions:{
        1:[
          {name:'新闻ID',key:"id",value:null}
        ],
        2:[
          {name:'产品ID',key:"id",value:null}
        ],
        3:[
          {name:'新闻地址',key:"url",value:null}
        ]
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getBannerList(this.params).then(response => {
        this.list = response.data.listData
        this.total = response.data.totalCount
        this.listLoading = false
        this.list.forEach(element => {
          element.actionJson = JSON.parse(element.actionInfo);

          var action = this.getActionByid(element.actionJson.type)
          element.actionType = action.label;
          element.actionTypeId = action.value;
        });
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

    async onilnebyid(goodid){
      const result = await onlineBanner({id:goodid}).catch(e=>{
        this.$message.error(e)
      })
      this.commonhandlerresult(result)
    },

    async offlinebyid(goodid){
      const result = await offlineBanner({id:goodid}).catch(e=>{
        this.$message.error(e)
      })
      this.commonhandlerresult(result)
    },

    async removebyid(coachId){
      const confirmRes = await this.$confirm("是否确定删除？",{type:'warning'}).catch(e=>e)
      if (confirmRes !== 'confirm'){
        return;
      }

      const result = await deleteBanner({id:coachId}).catch(e =>{
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

    editbyrow(row){
      this.form = Object.assign({},row);
      this.form.actionParams = this.actionParamOptions[this.form.actionTypeId];
      this.form.actionParams.forEach(o=>{
        o.value = row.actionJson[o.key];
      })

      this.isEdit = true
      this.dialogAddVisible = true;
    },

    clickAddBanner(){
      this.form = {};
      this.isEdit = false
      this.dialogAddVisible = true;
    },

    actionChanged(obj){
      this.form.actionParams = this.actionParamOptions[obj]
    },

    imageChanged(data){
      this.form.image = data.file;
      this.form.imageUrl = data.url;
    },

    async onAddBanner(){
      let actionInfo = {type:this.form.actionTypeId}
      this.form.actionParams.forEach(obj=>{
        actionInfo[obj.key]=obj.value
      })
      this.form.actionInfo = JSON.stringify(actionInfo);

      if (this.isEdit){
        await updateBanner(this.form).catch(e =>{
          return this.$message.error(e)
        })

        this.$message.success("成功")
        this.dialogAddVisible = false;
        this.fetchData();
        return;
      }

      await addBanner(this.form).catch(e =>{
        return this.$message.error(e)
      })

      this.$message.success("成功")
      this.dialogAddVisible = false;
      this.fetchData();
    },

    commonhandlerresult(result){
      if (result.success === true){
        this.$message.success("成功")
        this.fetchData();
      }else{
        this.$message.error(result.errorMsg)
      }
    },

    statusFilter(status){
      return bannerStatusFilter(status)
    },

    getActionByid(type){
      for (var i = 0; i < this.actionOptions.length; i++){
        var action = this.actionOptions[i];
        if (action.value === type){
          return action;
        }
      }
    }
  }
}
</script>
