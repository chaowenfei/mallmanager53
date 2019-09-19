<template>
<el-card class="card">
  <!-- 面包屑 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 搜索框 -->
  <el-row class="searchRow">
    <el-col>
      <el-input @clear="loadUserList" clearable placeholder="请输入内容" v-model="query" class="inputSearch">
        <el-button @click="searchUser" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button @click="showAddUserDia" type="success">添加用户</el-button>
    </el-col>
  </el-row>
  <!-- 表格 -->
  <el-table :data="userlist" style="width: 100%">
    <el-table-column type="index" label="#" width="60">
    </el-table-column>
    <el-table-column prop="username" label="姓名" width="180">
    </el-table-column>
    <el-table-column prop="email" label="邮箱">
    </el-table-column>
    <el-table-column prop="mobile" label="电话">
    </el-table-column>
    <el-table-column label="创建时间">
      <template slot-scope="scope">
        {{scope.row.create_time | fmtdate}}
      </template>
    </el-table-column>
    <el-table-column label="用户状态">
      <template slot-scope="scope">
        <el-switch @change="changeMgState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button size="mini" plain type="primary" icon="el-icon-edit" circle @click="showEditUserDia(scope.row)">
        </el-button>
        <el-button size="mini" plain type="danger" icon="el-icon-delete" circle @click="showDeleteUserMsgBox(scope.row.id)"></el-button>
        <el-button @click="showSetUserRoleDia(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
  </el-pagination>

  <!-- 对话框 -->
  <!-- 添加用户的对话框 -->
  <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
    <el-form :model="form">
      <el-form-item label="用户名" label-width="100px">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="100px">
        <el-input v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" label-width="100px">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话" label-width="100px">
        <el-input v-model="form.mobile" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </div>
  </el-dialog>

  <!-- 编辑用户的对话框 -->
  <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
    <el-form :model="form">
      <el-form-item label="用户名" label-width="100px">
        <el-input disabled v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" label-width="100px">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话" label-width="100px">
        <el-input v-model="form.mobile" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
      <el-button type="primary" @click="editUser()">确 定</el-button>
    </div>
  </el-dialog>

  <!-- 分配角色的对话框 -->
  <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
    <el-form :model="form">
      <el-form-item label="用户名" label-width="100px">
        {{currUsername}}
      </el-form-item>
      <el-form-item label="角色" label-width="100px">
        <el-select v-model="currRoleId">
          <el-option label="请选择" :value="-1"></el-option>
          <el-option :label="item.roleName" :value="item.id" v-for="(item,i) in roles" :key="i">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
      <el-button type="primary" @click="setRole()">确 定</el-button>
    </div>
  </el-dialog>
</el-card>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      userlist: [],
      //分页相关的数据
      pagenum: 1,
      pagesize: 2,
      total: -1,
      //添加对话框的属性
      dialogFormVisibleAdd: false,
      //编辑用户对话框的属性
      dialogFormVisibleEdit: false,
      //分配角色的对话框的属性
      dialogFormVisibleRol: false,
      //添加用户的表单数据
      form: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      currRoleId: -1,
      currUsername: '',
      roles: [],
      currentUserId: ''
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    //设置角色
    async setRole() {
      const res = await this.$http.put(`users/${this.currentUserId}/role`, {
        rid: this.currRoleId
      });
      //关闭对话框
      this.dialogFormVisibleRol = false;
    },
    //分配角色
    async showSetUserRoleDia(user) {
      this.currUsername = user.username;
      this.dialogFormVisibleRol = true;
      this.currentUserId = user.id;
      //获取当前用户的角色ID
      const res = await this.$http.get(`users/${user.id}`);
      //获取当前用户的角色name
      const res1 = await this.$http.get(`roles`);
      this.roles = res1.data.data;
      this.currRoleId = res.data.data.rid
    },
    //修改用户状态
    async changeMgState(user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
    },
    //编辑用户，发送请求
    async editUser() {
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      //关闭对话框
      this.dialogFormVisibleEdit = false;
      //更新视图
      this.getUserList();
    },
    //编辑用户
    showEditUserDia(user) {
      this.dialogFormVisibleEdit = true;
      this.form = user;
    },
    //删除用户
    showDeleteUserMsgBox(userid) {
      this.$confirm('删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        //发送请求 :id 用户id
        //1,data中有没有id    思路一
        //2,调用方法时，把userId用形参的方式传进来  思路二
        const res = await this.$http.delete(`users/${userid}`);

        if (res.data.meta.status === 200) {
          //回到第一页
          this.pagenum = 1;
          //更新视图
          this.getUserList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //提交添加用户的信息
    async addUser() {
      //关闭对话框
      this.dialogFormVisibleAdd = false;
      const res = await this.$http.post(`users`, this.form);
      const {
        meta: {
          status,
          msg
        },
        data
      } = res.data;
      if (status === 201) {
        //提示成功信息
        this.$message.success(msg);
        //更新试图
        this.getUserList();
        //清空文本框
        //this.form = {};
        for (const key in this.form) {
          if (this.form.hasOwnProperty(key)) {
            this.form[key] = '';
          }
        }
      } else {
        this.$message.warning(msg);
      }
    },
    //添加用户
    showAddUserDia() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    //清空input,重新加载列表
    loadUserList() {
      this.getUserList();
    },
    //搜索用户
    searchUser() {
      this.getUserList();
    },
    //获取用户列表的请求
    async getUserList() {
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      const {
        meta: {
          status,
          msg
        },
        data: {
          users,
          total
        }
      } = res.data;
      if (status === 200) {
        //表格赋值
        this.userlist = users;
        //总数赋值
        this.total = total;
        //提示用户获取数据成功
        //this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }

    },
    //分页相关的方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getUserList();
    }
  }
}
</script>

<style scoped>
.card {
  height: 100%;
}

.inputSearch {
  width: 300px;
}

.searchRow {
  margin-top: 20px;
}
</style>
