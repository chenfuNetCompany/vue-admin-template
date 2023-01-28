<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px" text-align="left" label-position="top">
      <el-form-item label="标题">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="金额">
        <el-input v-model="form.val" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <!-- <el-button @click="onCancel">Cancel</el-button> -->
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { getOssPolicy, generateOssUrl } from '@/api/oss'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { promotionlist, distCoupon, couponMemberList, addCoupon} from '@/api/promotion'

export default {
  data() {
    return {
      form: {
        name: '',
        val: '',
      }
    }
  },
  created() {
  },
  methods: {
    async onSubmit() {
      const res = await addCoupon(this.form).catch(e =>{
        return this.$message.error(ex)
      })

      if (res.success === false){
        this.$message.error("优惠券创建失败")
      }
      this.$message.success("优惠券创建成功")
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

