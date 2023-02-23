<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px" text-align="left" label-position="top">

      <el-form-item label="主图(必传，支持jpg/jpeg/png文件，且不超过250kb)">
        <div style="display: flex;height: 130px;width: 200px;">
          <div class="goodpic">
            <div style="display:flex;width:200px;height:100px;overflow:hidden;">
              <img :src="imageUrl" style="width:200px;height:100px;"/>
            </div>
            <!-- <el-button size="small" type="text" @click="deleteMain()" style="width:100px;height:30px;text-align: center;">删除</el-button> -->
          </div>
          <el-upload :on-success="handleSuccess"
            action=""
            accept=".jpg,.jpeg,.png"
            :on-preview="handlePreview"
            :http-request="uploadOss"
            :on-remove="handleRemove" 
            :show-file-list="false"
            list-type="picture"
            class="goodpicadd">
            <el-button size="medium" type="text" icon="el-icon-circle-plus-outline" >添加图片</el-button>
          </el-upload>
        </div>
    </el-form-item>


    <el-form-item label="位置">
      <el-input v-model="form.pos"/>
    </el-form-item>

    <el-form-item label="跳转类型">
      <el-select 
      v-model="actionType" 
      placeholder="请选择" 
      @change="actionChanged($event)"
      clearable>
        <el-option
          v-for="item in actionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="跳转参数" v-show="actionParams.length > 0">
      <div style="display: flex;">
        <div v-for="(item, i) in actionParams" :key="i">
          <div>{{item.name}}</div>
          <el-input v-model="item.value"></el-input>
        </div>
      </div>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <!-- <el-button @click="onCancel">Cancel</el-button> -->
    </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getOssPolicy, generateOssUrl } from '@/api/oss'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { addBanner,  getBannerList} from '@/api/banner'

export default {
  data() {
    return {
      form: {
        image: '',
        actionInfo: '',
        pos:null
      },
      imageUrl: '',
      actionType:null,
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
      actionParams:[],
    }
  },
  created() {
  },

  methods: {

    async onSubmit() {
      this.$message('submit!')
      let actionInfo = {type:this.actionType}
      this.actionParams.forEach(obj=>{
        actionInfo[obj.key]=obj.value
      })
      this.form.actionInfo = JSON.stringify(actionInfo);
      console.log(this.form)
      const res = await addBanner(this.form).catch(e =>{
        return this.$message.error(ex)
      })
    },

    async uploadOss(params, isMain){
      let file = params.file;
      let size = file.size / 1024;
      if (size >= 250){
          this.$message.error("图片大小不能超过250kb");
          return;
      }

      let key = uuidv4() + "_" + file.name;

      const res = await getOssPolicy().catch(ex => {
          return this.$message.error(ex)
      })
      console.log(res);

      if (res.success === false){
          return this.$message.error('获取发布令牌失败:'+ res.errorMsg);
      }

      //上传图片
      let ossPolicy = res.data;
      let sendData = new FormData();
      sendData.append('OSSAccessKeyId', ossPolicy.accessid);
      sendData.append('policy', ossPolicy.policy);
      sendData.append('Signature', ossPolicy.signature);
      sendData.append('keys', ossPolicy.dir);
      sendData.append('key',key)
      sendData.append('success_action_status', 200) // 指定返回的状态码
      sendData.append('file', file)

      let uploadError = false;
      await axios.post(ossPolicy.host, sendData).then(() => {
          console.log('得到上传到阿里云的图片：' + key)
      }).catch(ex => {
          console.log(ex);
          this.$message.error(ex);
          uploadError = true;
      });

      if (uploadError){
          return;
      }

      //获取预览地址
      const ossUrlRes = await generateOssUrl(key).catch(ex => {
          this.$message.error(ex);
      });
      console.log(ossUrlRes);

      if (ossUrlRes.success == false){
          return this.$message.error('获取发布图片地址失败:'+ res.errorMsg);
      }

      this.form.image = key;
      this.imageUrl = ossUrlRes.data.publicUrl;
      console.log(this.mainImageUrl)
    },

    handleSuccess(response){
    },
    //移除图片
    handleRemove(file){
    },
    handlePreview(file){
    },
    
    actionChanged(obj){
      this.actionParams = this.actionParamOptions[obj]
      console.log(this.actionParams)
    },
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
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

