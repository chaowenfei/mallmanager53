<template>
  <div class="login-wrap">
    <el-form 
    class="login-form"
    label-position="top"  
    label-width="80px" 
    :model="formdata">
    <h2>用户登陆</h2>
    <el-form-item label="用户名">
    <el-input v-model="formdata.username">
    </el-input>
    </el-form-item>
    <el-form-item label="密码">
    <el-input v-model="formdata.password">
    </el-input>
    <el-button type="primary" class="login-btn"
    @click.prevent="handlerLogin"
    >登陆</el-button>
    </el-form-item>
</el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods:{
   async handlerLogin(){
    const res = await this.$http.post('login',this.formdata)
        const{
          data,
          meta:{msg,status}
        } = res.data;
        //成功
        if(status === 200){
          localStorage.setItem('token',data.token);
          this.$message.success(msg);
          this.$router.push({name:'home'});
        }else{
          this.$message.warning(msg);
        }
      
    }
  }
}
</script>
<style scoped>
  .login-wrap{
    height: 100%;
    background-color: #324152;
    display: flex; 
    justify-content: center;
    align-items: center;
  }
  .login-wrap .login-form{
    width:400px;
    background-color:#fff;
    border-radius: 5px;
    padding: 30px;
  }
  .login-wrap .login-btn{
    margin-top: 25px;
    width: 100%;
  }
</style>
