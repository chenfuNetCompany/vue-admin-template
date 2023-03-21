<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px" text-align="left" label-position="top">
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="form.detail" type="textarea" />
      </el-form-item>

      <el-form-item label="商品主图(必传，最多6张，支持jpg/jpeg/png文件，且不超过150kb)">
        <div style="display: flex; height: 130;">
          <div v-for="(item,index) in uploadFiles">
            <OssUploader 
              :file="item.file"
              :url="item.url"
              :index="index"
              @valueChanged="imageChanged" >
            </OssUploader>
          </div>
        </div>
    </el-form-item>

    <el-form-item label="商品详情图(非必传，支持jpg/jpeg/png文件，且不超过150kb)">
      <OssUploader :file="form.detailImage" :url="form.detailImageUrl" @valueChanged="detailImageChanged" ></OssUploader>
    </el-form-item>

    <el-form-item label="商品属性" v-show="goodAttribute.length > 0">
      <div style="display: flex;">
        <div v-for="(item, i) in goodAttribute" :key="i">
          <div>{{item.name}}</div>
          <!-- <div v-if="item.valueType === 3">
            <el-select v-model="item.value" placeholder="请选择">
              <el-option v-for="row in boolOptions" :key="row.value" :label="row.name" :value="row.value"></el-option>
            </el-select>
          </div>
          <div v-else> -->
            <el-select
              v-model="item.value"
              allow-create
              filterable 
              :multiple="item.valueType === 5"
              collapse-tags
              default-first-option
              placeholder="请选择">
              <el-option
                v-for="row in item.values"
                :key="row.value"
                :label="row.name"
                :value="row.value">
              </el-option>
            </el-select>
          <!-- </div> -->
        </div>
      </div>
    </el-form-item>

    <!-- <el-form-item label="开售时间">
      <el-date-picker 
        v-model="form.useTimeRange"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>

    <el-form-item label="使用时间">
      
    </el-form-item> -->


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
            :data="item.values"
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
        </div>
      </div>
    </el-form-item>

    <el-form-item label="价格" v-show="form.hasSku === false">
      <el-input v-model="form.price" />
    </el-form-item>
    <el-form-item label="库存" v-show="form.hasSku === false">
      <el-input v-model="form.quantity" />
    </el-form-item>

    <el-form-item label="价格库存" v-show="form.hasSku === true">
      <el-table
        :show-header="true"
        :data="skuList"
        fit
        highlight-current-row
        v-show='skuList.length > 0'
      >
        <template v-for="(item,index) in skuHeads">
          <el-table-column :label="item.name" width="200" :prop="item.key" :key="item.key">
          </el-table-column>
        </template>
        <el-table-column label="价格" width="200">
          <template slot-scope="scope">
            <input v-model="scope.row.price"/>
          </template>
        </el-table-column>
        <el-table-column label="库存" width="200">
          <template slot-scope="scope">
            <input v-model="scope.row.quantity"/>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">{{isEdit ? "更新":"发布"}}</el-button>
    </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addGood, updateGood, getGoodCate, getGoodDetail } from '@/api/good'
import OssUploader from "@/components/OssUploader"
import {validObj, validString} from "@/utils/validate"
import {formatDate} from "@/utils/date"


export default {
  components:{
    OssUploader
  },
  data() {
    return {
      form: {
        title: '',
        detail: '',
        images: [],
        specList: [],
        skuDTOList: [],
        hasSku : true,
        categoryId : null,
        id:null,
        detailImage:null,
        detailImageUrl:null,
        saleStartAt:null,
        saleEndAt:null,
        saleTimeRange:null,
        useStartAt:null,
        useEndAt:null,
        useTimeRange:null,
      },
      uploadFiles:[
      ],
      skuAttribute:[],
      goodAttribute:[],
      skuList:[],
      skuHeads:[],
      maxFile:6,
      isEdit:false,
      boolOptions:[
        {name:"是",value:true},
        {name:"否",value:false},
      ]
    }
  },
  
  created() {
    let params = this.$route.query;
    if (validObj(params) ){
      if (validObj(params.goodId)){
        this.form.id = params.goodId;
        this.isEdit = true;
      }else if (validObj(params.cateId)){
        this.form.categoryId = params.cateId
      }else{
        this.$message.error("路径参数错误")
        return;
      }
    }else{
      this.$message.error("路径参数缺失")
      return;
    }
    
    this.initData()
  },

  methods: {
    async initData() {
      for (var i = 0; i < this.maxFile; i ++ ){
        this.uploadFiles.push({index:i,file:null,url:null})
      }

      let goodDetail = null;
      if (this.isEdit){
        const goodRes = await getGoodDetail({goodId:this.form.id});
        if (goodRes.success){
          goodDetail = goodRes.data;
          this.form.categoryId = goodDetail.categoryId;
        }else{
          this.$message.error("产品信息请求失败:" + goodDetail.errorMsg)
          return;
        }
      }

      const cateRes = await getGoodCate({cateId:this.form.categoryId}).catch(e => {
        this.$message.error(e)
      });

      if (cateRes.success){
        this.skuAttribute = cateRes.data.skuAttributeList
        this.goodAttribute = cateRes.data.goodAttributeList.filter(s => {return s.display})
        this.form.hasSku = this.skuAttribute.length > 0;
      }else{
        this.$message.error("类目信息请求失败:" + cateRes.errorMsg)
      }

      if (this.isEdit){
        this.form.title = goodDetail.title;
        this.form.detail = goodDetail.detail;
        this.form.detailImage = goodDetail.detailImage;
        this.form.detailImageUrl = goodDetail.detailImageUrl;
        this.form.price = goodDetail.price;
        this.form.quantity = goodDetail.quantity;

        for (var i = 0; i < Math.min(goodDetail.images.length, this.uploadFiles.length); i++){
          this.uploadFiles[i]["url"] = goodDetail.images[i].url;
          this.uploadFiles[i]["file"] = goodDetail.images[i].file;
        }

        if (validObj(this.goodAttribute)){
          this.goodAttribute.forEach(o=>{
            o.value = this.getGoodAttrValueById(goodDetail.specs, o.id);
          })
        }

        if (validObj(this.skuAttribute)){
          this.skuAttribute.forEach(o=>{
            o.values = this.getSkuAttrValuesById(goodDetail.skuAttrs, o.id)
          })
        }
        
        this.updateSku();
        if (validObj(this.skuList)){
          this.skuList.forEach(o=>{
            this.updateLocalSkuByGoodSku(goodDetail.skus, o)
          })
          this.skuList = this.skuList.slice(0)
        }
      }
    },

    updateLocalSkuByGoodSku(goodSkuList, localSku){
      for (var i = 0; i < goodSkuList.length; i++){
        var goodSku = goodSkuList[i];
        // console.log("goodsku:" + JSON.stringify(goodSku.specs))
        // console.log("localSku:" + JSON.stringify(localSku.specList))
        if (JSON.stringify(goodSku.specs) === JSON.stringify(localSku.specList)){
          localSku.price = goodSku.price;
          localSku.quantity = goodSku.quantity;
        }
      }
    },

    getGoodAttrValueById(specList, attrId){
      for (var i = 0; i < specList.length; i++){
        var spec = specList[i];
        if (spec.attrId === attrId){
          return JSON.parse(spec.attrValue)
        }
      }
      return null;
    },
    
    getSkuAttrValuesById(skuAttrList, attrId){
      for (var i = 0; i < skuAttrList.length; i++){
        var skuAttr = skuAttrList[i];
        if (skuAttr.id === attrId){
          console.log(skuAttr.attrValues)
          return skuAttr.attrValues.map(o=>{return {v:o.value}})
        }
      }
      return null;
    },

    onAddAttribute(item){
      if (item.values === null || item.values === undefined){
        item.values = [];
      }
      item.values.push({})
      this.skuAttribute = this.skuAttribute.slice(0)
    },

    onFinishAttribute(){
      this.updateSku();
    },

    // 根据设置sku属性值，生成笛卡儿积的sku列表
    updateSku(){
      //筛选出有效的sku属性值
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


      //生成新的sku属性头，以及完整的sku列表
      this.skuHeads = [];
      if (skuAvailable){
        for (var attribute of this.skuAttribute){
          this.skuHeads.push({
            key:attribute.id.toString(),
            name:attribute.name
          })
        }
        this.skuList = this.generateSkuByAttribute(this.skuAttribute)
      }else{
        this.skuList = [];
      }
    },

    // 根据设置sku属性值，生成笛卡儿积的sku列表
    generateSkuByAttribute(attributeList){
      if (attributeList.length === 1){
        let attrId = attributeList[0].id;
        let attrKey = attrId.toString();
        let attrValues = attributeList[0].values;
        let skuItems = []
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
      return [];
    },

    imageChanged(data){
      console.log("data:", this.uploadFiles)
      let uploadFile = this.uploadFiles[data.index];
      uploadFile.file = data.file;
      uploadFile.url = data.url;
      console.log(this.uploadFiles)
    },

    detailImageChanged(data){
      this.form.detailImage = data.file;
      this.form.detailImageUrl = data.url;
    },

    async onSubmit() {
      // console.log("useTimeRange:", this.form.useTimeRange);
      // console.log("localtime", formatDate(this.form.useTimeRange[0]))
      // return;
      let uploadFileList = this.uploadFiles.filter(s => {return s.file && s.file.trim()})
      this.form.images = uploadFileList.map(item=>{
        return {url:item.url,file:item.file}
      });

      this.form.skuDTOList = this.skuList
      this.form.specList = this.goodAttribute.map(item=>{
        return {attrId:item.id,attrValue:JSON.stringify(item.value)}
      })

      console.log("sumbit:", this.form);
      var res;
      if (this.isEdit){
        res = await updateGood(this.form)
      }else{
        res = await addGood(this.form);
      }

      if (res.success){
        this.$message.success("发布成功")
        if (this.form.categoryId === 1){
          this.$router.push({path:'/product/course'})
        }else if (this.form.categoryId === 2){
          this.$router.push({path:'/product/ticket'})
        }else if (this.form.categoryId === 3){
          this.$router.push({path:'/product/activity'})
        }
      }else{
        this.$message.error("发布失败:"+res.errorMsg)
      }
    },

    inputchange(){
      this.$forceUpdate();
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

