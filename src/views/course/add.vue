<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px" text-align="left" label-position="top">
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="form.detail" type="textarea" />
      </el-form-item>

      <el-form-item label="商品主图(必传，支持jpg/jpeg/png文件，且不超过150kb)">
        <div style="display: flex;height: 130px;width: 100px;">
          <div v-for="(item, i) in uploadFiles" class="goodpic">
            <div style="display:flex;width:100px;height:100px;overflow:hidden;">
              <img :src="item.url" style="width:98px;height:100px;"/>
            </div>
            <el-button size="small" type="text" @click="deleteHandle(i)" style="width:100px;height:30px;text-align: center;">删除</el-button>
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


    <el-form-item label="销售属性" v-show="skuAttribute.length > 0">
      <span slot="label">
        销售属性
        <el-button size="medium" type="text" icon="el-icon-circle-plus-outline" @click="onFinishAttribute()">完成</el-button>
      </span>
      <div style="display: flex;">
        <div v-for="(item, i) in skuAttribute" class="attribute" :key="i">
          <span slot="label">
            {{item.name}}
            <el-button size="medium" type="text" icon="el-icon-circle-plus-outline" @click="onAddAttribute(item)">添加属性值</el-button>
          </span>
          <el-table
            :show-header="false"
            v-loading="listLoading"
            :data="item.values"
            element-loading-text="Loading"
            fit
            highlight-current-row
            v-show='item.values != null && item.values != undefined && item.values.length > 0'
          >
            <el-table-column align="center" label="ID" width="200">
              <template slot-scope="scope">
                <el-input v-model="scope.row.v"></el-input>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div v-for="(data, j) in item.values" :key="j">
            <el-input @input="onEidtAttibuteValue($event, data)" v-bind="data.v"></el-input>
          </div> -->
        </div>
      </div>
    </el-form-item>

    <el-form-item label="价格库存">
      <el-table
        :show-header="true"
        v-loading="listLoading"
        :data="skuDTOList"
        element-loading-text="Loading"
        fit
        highlight-current-row
        v-show='skuDTOList.length > 0'
      >
        <template v-for="(item,index) in skuHeads">
          <!-- <el-table-column :prop="item.id" :label="item.name" width="200"></el-table-column> -->
          <el-table-column :label="item.name" width="200" :prop="item.key" :key="item.key">
            <!-- <template slot-scope="scope">
              {{ scope.row[attribute.id] }}
            </template> -->
          </el-table-column>
        </template>
        <template>
          <el-table-column label="价格" width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row['price']"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="库存" width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row['quantity']"></el-input>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-form-item>

    

      



      <!-- <el-form-item label="Activity zone">
        <el-select v-model="form.region" placeholder="please select your zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker v-model="form.date1" type="date" placeholder="Pick a date" style="width: 100%;" />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="Pick a time" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="Instant delivery">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item> -->
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
import { addCourse, getCourseList, getCourseCate} from '@/api/course'

export default {
  data() {
    return {
      form: {
        title: '',
        detail: '',
        images: [],
        specList: [],
        skuDTOList: [],
        hasSku : true,
      },
      uploadFiles:[],
      skuAttribute:[],
      skuDTOList:[],
      skuHeads:[]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {

    fetchData() {
      this.listLoading = true
      getCourseCate().then(response => {
        this.skuAttribute = response.data.skuAttributeList
      }).finally(
        this.listLoading = false
      )
    },

    // onEidtAttibuteValue(event, value){
    //   console.log(event)
    //   console.log(value)
    //   value.v = event
    //   this.skuAttribute = this.skuAttribute.slice(0)
    // },

    onAddAttribute(item){
      if (item.values === null || item.values === undefined){
        item.values = [];
      }
      item.values.push({
      })
      this.skuAttribute = this.skuAttribute.slice(0)
    },

    onFinishAttribute(){
      this.updateSku();
    },

    updateSku(){
      let skuAvailable = true;
      for (var attribute of this.skuAttribute){
        if (attribute.values === null || attribute.values === undefined){
          skuAvailable = false;
        }
        attribute.values = attribute.values.filter(s => {return s.v && s.v.trim()})
        if (attribute.values.length <= 0){
          skuAvailable = false;
        }
      }
      this.skuAttribute = this.skuAttribute.slice(0)

      this.skuHeads = [];
      if (skuAvailable){
        this.skuDTOList = this.generateSkuByAttribute(this.skuAttribute)
        for (var attribute of this.skuAttribute){
          this.skuHeads.push({
            key:attribute.id.toString(),
            name:attribute.name
          })
        }
        // this.skuHeads.push('price')
        // this.skuHeads.push('quantity')
      }else{
        this.skuDTOList = [];
      }
    },

    generateSkuByAttribute(attributeList){
      if (attributeList.length === 1){
        let attrId = attributeList[0].id;
        let attrKey = attrId.toString();
        let attrValues = attributeList[0].values;
        let skuItems = []
        console.log(attrValues)
        for (var value of attrValues){
          let spec = {
            attrId:attrId,
            attrValue:value.v
          }
          let skuItem = {
            specList : [],
          }
          skuItem[attrKey] = value.v
          skuItem.specList.push(spec)
          skuItems.push(skuItem)
        }
        return skuItems;
      }
    },

    async onSubmit() {
      this.$message('submit!')

      this.form.images = this.uploadFiles.map(item=>{
        return {url:item.fileName}
      });
      this.form.skuDTOList = this.skuDTOList

      const res = await addCourse(this.form).catch(e =>{
        return this.$message.error(ex)
      })
    },

    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },

    async uploadOss(params){
      let file = params.file;
      let size = file.size / 1024;
      if (size >= 150){
          this.$message.error("图片大小不能超过150kb");
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
      this.handleFileSuccess(key, ossUrlRes.data.publicUrl)
    },
      
    handleFileSuccess(fileName, url){
      let length = this.uploadFiles.length;
      console.log(length)
      this.uploadFiles.push({
          fileName:fileName,
          url:url,
          pos:length
      })
    },
    handleSuccess(response){
        // const picinfo={pic:response.data.tmp_path}
        // this.addform.pics.push(picinfo)
    },
    //移除图片
    handleRemove(file){
        // const filepath=file.response.data.tmp_path
        // const i= this.addform.pics.findIndex(x=>x.pic===filepath)
        // this.addform.pics.splice(i,1)
    },
    handlePreview(file){
        // this.prepath=file.response.data.url
        // this.preVisible=true
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

