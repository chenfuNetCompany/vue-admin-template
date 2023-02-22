<template>
  <div style="display: flex;height: 130px;width: 100px;">
    <div class="goodpic">
      <div v-show='url != null' style="display:flex;width:100px;height:100px;overflow:hidden;">
          <img :src="url" style="width:98px;height:100px;"/>
      </div>
      <el-button v-show='url != null' size="small" type="text" @click="deleteImage()" style="width:100px;height:30px;text-align: center;">删除</el-button>
      <el-upload :on-success="handleSuccess"
        action=""
        accept=".jpg,.jpeg,.png"
        :on-preview="handlePreview"
        :http-request="uploadOss"
        :on-remove="handleRemove" 
        :show-file-list="false"
        list-type="picture"
        class="goodpicadd"
        v-show='url === null || url === undefined '>
        <el-button size="medium" type="text" icon="el-icon-circle-plus-outline" >添加图片</el-button>
      </el-upload>
    </div>
  </div>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { getOssPolicy, generateOssUrl } from '@/api/oss'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

export default {
  name: 'OssUploader',
  props: {
    url: {
      type: String,
    },
    file: {
      type: String,
    },
    index:{
      type:Number,
      default:0
    }
  },
  computed: {

  },
  methods:{
    async uploadOss(params){
      let file = params.file;
      let size = file.size / 1024;
      if (size >= 250){
          this.$message.error("图片大小不能超过250kb");
          return;
      }

      let ossKey = uuidv4() + "_" + file.name;
      
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
      sendData.append('key',ossKey)
      sendData.append('success_action_status', 200) // 指定返回的状态码
      sendData.append('file', file)

      let uploadError = false;
      await axios.post(ossPolicy.host, sendData).then(() => {
          console.log('得到上传到阿里云的图片：' + ossKey)
      }).catch(ex => {
          console.log(ex);
          this.$message.error(ex);
          uploadError = true;
      });

      if (uploadError){
          return;
      }

      //获取预览地址
      const ossUrlRes = await generateOssUrl(ossKey).catch(ex => {
          this.$message.error(ex);
      });
      console.log(ossUrlRes);

      if (ossUrlRes.success == false){
          return this.$message.error('获取发布图片地址失败:'+ res.errorMsg);
      }

      
      this.file = ossKey;
      this.url = ossUrlRes.data.publicUrl;
      this.emitChange();
    },

    handleSuccess(response){
    },
    //移除图片
    handleRemove(file){
    },
    handlePreview(file){
    },

    deleteImage(){
      this.file = null;
      this.url = null;
      this.emitChange();
    },

    emitChange(){
      this.$emit('valueChanged', {
        index:this.index,
        file:this.file,
        url:this.url
      })
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover!important;
  display: inline-block;
}
</style>
