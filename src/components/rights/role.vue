<template>
<el-card>
  <!-- 面包屑 -->
  <my-bread level1="权限管理" level2="角色列表"></my-bread>
  <el-row class="addrolebtn">
    <el-col></el-col>
    <el-button type="info">信息按钮</el-button>
  </el-row>
  <!-- 角色列表 -->
  <el-table :data="rolelist" style="width: 100%">
    <el-table-column type="expand" width="180">
      <template slot-scope="scope">
        <el-row v-for="(item1,i) in scope.row.children" :key="i">
          <el-col :span="4">
            <el-tag @close="deleRight(scope.row.id,item1.id,scope.row)" closable type="success">{{item1.authName}}</el-tag>
            <i class="el-icon-arrow-right"></i>
          </el-col>
          <el-col :span="20">
            <el-row v-for="(item2,i) in item1.children" :key="i">
              <el-col :span="4">
                <el-tag @close="deleRight(scope.row.id,item2.id,scope.row)" closable type="info">{{item2.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <el-tag @close="deleRight(scope.row.id,item3.id,scope.row)" closable type="warning" v-for="(item3,i) in item2.children" :key="i">{{item3.authName}}</el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 如果children为零，提示没用分配权限 -->
        <span v-if="scope.row.children.length === 0">未分配权限</span>
      </template>
    </el-table-column>
    <el-table-column type="index" label="#" width="180">
    </el-table-column>
    <el-table-column prop="roleName" label="角色名称" width="180">
    </el-table-column>
    <el-table-column prop="roleDesc" label="角色描述" width="180">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button size="mini" plain type="primary" icon="el-icon-edit" circle @click="showEditUserDia(scope.row)">
        </el-button>
        <el-button size="mini" plain type="danger" icon="el-icon-delete" circle @click="showDeleteUserMsgBox(scope.row.id)"></el-button>
        <el-button @click="showSetRightDia(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 修改权限的对话框 -->
  <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
    <!-- 属性结论 -->
    <div slot="footer" class="dialog-footer">
      <!-- data数据源
      show-checkbox 选择框
      node-key  每个节点的唯一标识，通常data数据源中的id
      default-expanded-keys默认展开的节点
      default-checked-keys默认要选择的节点
      props配置项
      :default-expanded-keys="[2, 3]"
      :default-checked-keys="[5]">
       -->
      <el-tree ref="tree"
        :data="treelist"     
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrcheck"
        :props="defaultProps">
      </el-tree>
      <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
      <el-button type="primary" @click="setRoleRight ()">确 定</el-button>
    </div>
  </el-dialog>
</el-card>
</template>

<script>
import { async } from 'q';
export default {
  created() {
    this.getrolelist();
  },
  data() {
    return {
      rolelist: [],
      dialogFormVisibleRight: false,
      //树形结构的数据
      treelist:[],
      defaultProps:{
        label:'authName',
        children:'children'
      },
      arrexpand:[],
      arrcheck:[],
      currRoleId:'',
    }
  },
  methods: {
    //设置角色的权限a1
    //获取全选的，半选的数组a2
    //arr a1+a2
    async setRoleRight(){
      let arr1 = this.$refs.tree.getCheckedKeys();
      let arr2 = this.$refs.tree.getHalfCheckedKeys();
      let arr = [...arr1,...arr2];
      const res =await this.$http.post(`roles/${this.currRoleId}/rights`,
      {rids:arr.join(',')});
     this.dialogFormVisibleRight = false;
     if(res.data.meta.status === 200){
       this.$message({
         type: 'success',
          message: '修改权限成功!'
       })
     }
      //更新视图
      this.getrolelist();
    },
    //权限列表
    async showSetRightDia(role) {
      this.currRoleId = role.id;
      this.dialogFormVisibleRight = true;
      //获取树形结构的权限数据
      const res = await this.$http.get(`rights/tree`);
      this.treelist = res.data.data;
      //把所有的id放入数组中
      var arrtemp1 = [];
      role.children.forEach(item1=>{
        //arrtemp1.push(item1.id);
        item1.children.forEach(item2=>{
          //arrtemp1.push(item2.id);
          item2.children.forEach(item3=>{
            arrtemp1.push(item3.id); 
          })
        }) 
      })
      this.arrcheck = arrtemp1;

    },
    //取消权限
    async deleRight(roleId, rightId, role) {
      const res = await this.$http.delete(`roles/${roleId}/rights/${rightId}`);
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '权限删除成功!'
        });
      }
      role.children = res.data.data;
    },
    async getrolelist() {
      const res = await this.$http.get(`roles`);
      this.rolelist = res.data.data;
    }
  }
}
</script>

<style scoped>
.addrolebtn {
  margin-top: 20px;
}
</style>
