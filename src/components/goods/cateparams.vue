<template>
<el-card>
  <my-bread level1="商品管理" level2="分类参数"></my-bread>
  <el-alert class="alert" title="只允许为第三级分类设置参数" type="error">
  </el-alert>

  <el-form label-position="left" label-width="80px" class="formdata">
    <!-- 级联选择器 -->
    <el-form-item label="商品分类">
      <el-cascader :show-all-levels="false" clearable expand-trigger="hover" v-model="selectedOptions" :options="options" :props="defaultProp" @change="handleChange"></el-cascader>
    </el-form-item>
  </el-form>

  <el-tabs v-model="active" type="card" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="1">
      <el-button type="danger">设置动态参数</el-button>
      <el-table :data="arrDyparams" style="width: 100%">
        <el-table-column type="expand" label="#">
          <template slot-scope="scope">
            <el-tag 
            :key="tag" 
            v-for="tag in scope.row.attr_vals" 
            closable 
            :disable-transitions="false" 
            @close="handleClose(scope.row.attr_vals,tag)">
              {{tag}}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row.attr_vals)" @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </template>
        </el-table-column>
        <el-table-column label="属性名称" prop="attr_name">
        </el-table-column>
        <el-table-column label="操作" prop="xx">
          <template slot-scope="">
            <el-button size="mini" plain type="primary" icon="el-icon-edit" circle @click="showEditUserDia(scope.row)">
            </el-button>
            <el-button size="mini" plain type="danger" icon="el-icon-delete" circle @click="showDeleteUserMsgBox(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态参数" name="2">配置管理</el-tab-pane>
  </el-tabs>
</el-card>
</template>

<script>
export default {
  data() {
    return {
      //级联选择器要绑定的数据 
      selectedOptions: [],
      options: [],
      defaultProp: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      arrDyparams: [],
      active: '1',
       inputVisible: false,
        inputValue: ''
    }
  },
  methods: {
    //点击x按钮
    handleClose(attr_vals,tag) {
        attr_vals.splice(attr_vals.indexOf(tag), 1);
      },
      //点击newTag+按钮
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //回车键 or 失去焦点
      handleInputConfirm(attr_vals) {
        let inputValue = this.inputValue;
        if (inputValue) {
          attr_vals.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
    handleClick() {

    },
    async handleChange() {
      if (this.selectedOptions.length === 3) {
        //获取动态参数
        const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
        this.arrDyparams = res.data.data;
        this.arrDyparams.forEach(item => {
          item.attr_vals.length === 0 ? [] : item.attr_vals = item.attr_vals.trim().split(',');
        });
      }
    },
    async getGoodCate() {
      const res = await this.$http.get(`categories?type=3`);
      this.options = res.data.data;
    },
  },
  created() {
    this.getGoodCate();
  }
}
</script>

<style scoped>
.alert {
  margin-top: 20px;
}

.formdata {
  margin-top: 20px;
}
</style>
