<template>
<el-container class="container">
  <el-header class="header">
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <img src="../../assets/images/heima_logo.png" alt="无法显示图片">
        </div>
      </el-col>
      <el-col :span="18" class="middle">
        <h3>电商后台管理系统</h3>
      </el-col>
      <el-col :span="2">
        <div class="grid-content bg-purple">
          <a href="#" class="loginout" @click.prevent="handlerSignout">退出</a>
        </div>
      </el-col>
    </el-row>
  </el-header>
  <el-container>
    <el-aside class="aside" width="200px">
      <!-- 侧边栏导航 -->
      <el-menu
      :unique-opened ="true"
      :router="true"
      >
        <!-- 1 -->
        <el-submenu :index="item1.order" v-for="(item1,index) in menus" :key="index">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{item1.authName}}</span>
          </template>
          <!-- <template slot="title">分组一</template> -->
          <el-menu-item :index="item2.path" v-for="(item2,index) in item1.children" :key="index">
            <i class="el-icon-user"></i>
            <span>{{item2.authName}}</span>
          </el-menu-item>
        </el-submenu>
       
      </el-menu>
    </el-aside>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  beforeCreate(){
    //获取token
    // const token = localStorage.getItem('token');
    // if(!token){
    //   this.$router.push({name:'login'});
    // }
  },
  created(){
    this.getMenus();
  },
  data(){
    return{
      menus:[],
    }
  },
  methods:{
    //获取导航的数据
    async getMenus(){
      const res = await this.$http.get(`menus`);
      console.log(res);
      this.menus = res.data.data;
    },
    handlerSignout(){
      //清除token
      localStorage.clear();
      //提示
      this.$message.success('退出成功');
      //路由跳转
      this.$router.push({name:'login'});
    }
  }
}
</script>

<style scoped>
.container {
  height: 100%
}

.header {
  background-color: #b3c0d1;
}

.aside {
  background-color: #d3dce6;
}

.main {
  background-color: #e9eef3;
}

.middle {
  text-align: center;
}

.loginout {
  text-decoration: none;
  line-height: 60px;
}
</style>
