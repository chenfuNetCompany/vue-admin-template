<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="账号" prop="account">
      <el-input v-model="ruleForm.account"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色选择" v-show="roleList.length > 0" prop="roleIdList">
      <el-select v-model="role.name" @change="handleChange" placeholder="请选择">
        <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

import { getRoleList, addAccount } from '@/api/account'

export default {
  data() {
    var checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号不能为空'))
      }
      else {
        callback()
      }
    }
    var checkRoleIdList = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('角色不能为空'))
      }
      else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      role: {
        id: 0,
        name: ''
      },
      roleList: [],
      ruleForm: {
        password: '',
        checkPass: '',
        account: '',
        roleIdList: []
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        account: [
          { validator: checkAccount, trigger: 'blur' }
        ],
        roleIdList: [
          { validator: checkRoleIdList, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getRoleList().then(response => {
        console.log(JSON.stringify(response))
        this.roleList = response.data
      }).finally(
        this.listLoading = false
      )
    },
    handleChange(roleItem) {
      console.log(JSON.stringify(roleItem))
      this.role.id = roleItem.id
      this.role.name = roleItem.name
      this.ruleForm.roleIdList = [roleItem.id]
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        console.log('validate')
        if (valid) {
          addAccount(this.ruleForm).then(response => {
            console.log(JSON.stringify(response))
            if (response.success){
              alert('创建成功');
            }
          }).finally(
            this.listLoading = false
          )
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.role.id = 0
      this.role.name = ''
    }
  }
}
</script>
