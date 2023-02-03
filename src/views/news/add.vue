<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px" text-align="left" label-position="top">
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>

      <el-form-item label="主图(必传，支持jpg/jpeg/png文件，且不超过250kb)">
        <div style="display: flex;height: 130px;width: 100px;">
          <div class="goodpic">
            <div style="display:flex;width:100px;height:100px;overflow:hidden;">
              <img :src="mainImageUrl" style="width:98px;height:100px;"/>
            </div>
            <!-- <el-button size="small" type="text" @click="deleteMain()" style="width:100px;height:30px;text-align: center;">删除</el-button> -->
          </div>
          <el-upload :on-success="handleSuccess"
            action=""
            accept=".jpg,.jpeg,.png"
            :on-preview="handlePreview"
            :http-request="uploadMain"
            :on-remove="handleRemove" 
            :show-file-list="false"
            list-type="picture"
            class="goodpicadd">
            <el-button size="medium" type="text" icon="el-icon-circle-plus-outline" >添加图片</el-button>
          </el-upload>
        </div>
    </el-form-item>


    <el-form-item label="正文">
      <el-input v-model="form.detail" type="textarea" />
    </el-form-item>

    <el-form-item label="正文图(支持jpg/jpeg/png文件，且不超过250kb)">
      <div style="display: flex;height: 130px;width: 100px;">
        <div class="goodpic">
          <div style="display:flex;width:100px;height:100px;overflow:hidden;">
              <img :src="detailImageUrl" style="width:98px;height:100px;"/>
          </div>
          <el-button size="small" type="text" @click="deleteDetail()" style="width:100px;height:30px;text-align: center;">删除</el-button>
        </div>
        <el-upload :on-success="handleSuccess"
          action=""
          accept=".jpg,.jpeg,.png"
          :on-preview="handlePreview"
          :http-request="uploadDetail"
          :on-remove="handleRemove" 
          :show-file-list="false"
          list-type="picture"
          class="goodpicadd">
          <el-button size="medium" type="text" icon="el-icon-circle-plus-outline" >添加图片</el-button>
        </el-upload>
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
import { addNews } from '@/api/news'

export default {
  data() {
    return {
      form: {
        title: '',
        mainImage: '',
        detail: '',
        detailImage: '',
      },
      mainImageUrl: '',
      detailImageUrl: '',
    }
  },
  created() {
  },

  methods: {

    async onSubmit() {
      this.$message('submit!')
      const res = await addNews(this.form).catch(e =>{
        return this.$message.error(ex)
      })
    },

    uploadDetail(params){
      this.uploadOss(params, false)
    },

    uploadMain(params){
      this.uploadOss(params, true)
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

      if (isMain){
        this.form.mainImage = key;
        this.mainImageUrl = ossUrlRes.data.publicUrl;
      }else{
        this.form.detailImage = key;
        this.detailImageUrl = ossUrlRes.data.publicUrl;
      }
      console.log(this.mainImageUrl)
    },

    handleSuccess(response){
    },
    //移除图片
    handleRemove(file){
    },
    handlePreview(file){
    }
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

