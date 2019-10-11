<template>
<el-card>
  <my-bread level1="商品管理" level2="商品列表"></my-bread>
  <el-alert class="alert" title="添加商品成功" type="success" center show-icon>
  </el-alert>
  <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
    <el-step title="基本信息"></el-step>
    <el-step title="商品参数"></el-step>
    <el-step title="商品属性"></el-step>
    <el-step title="商品图片"></el-step>
    <el-step title="商品内容"></el-step>
  </el-steps>

  <el-form label-position="top" label-width="80px" :model="form" style="height:400px;overflow:auto;">
    <el-tabs @tab-click="tabChange" tab-position="left" v-model="active" class="tab">
      <el-tab-pane name="1" label="基本信息">
        <el-form-item label="商品名称">
          <el-input v-model="form.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="form.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="form.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="form.goods_number"></el-input>
        </el-form-item>
      <el-form-item label="商品分类">
        <el-cascader
          clearable
          expand-trigger="hover"
          v-model="selectedOptions"
          :options="options"
          :props="defaultProp"
          @change="handleChange"></el-cascader>
      </el-form-item>  
      </el-tab-pane>
      <el-tab-pane name="2" label="商品参数">
        <!-- 显示的是该三级分类的商品参数 -->
         <el-form-item :label="item1.attr_name"
          v-for="(item1,i) in arrDyparams" :key="i"
         >
        <el-checkbox-group v-model="item1.attr_vals">
            <el-checkbox border :label="item2"
              v-for="(item2,i) in item1.attr_vals" :key="i"
            ></el-checkbox>
          </el-checkbox-group>
      </el-form-item>
      </el-tab-pane>
      <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrStaticparams" :key="i">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
      </el-tab-pane>
      <el-tab-pane name="4" label="商品图片">
        <el-form-item label="">
          <!-- baseUrl axios发的请求 -->
        <el-upload
            action="http://api.xiaomadagege.cn:3001/api/private/v1/upload"
            :on-preview="handlePreview"
            :headers="headers"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane name="5 " label="商品内容">
        <el-form-item label=""> 
          <el-button type="primary"
            @click="addGood()"
          >点我-添加商品</el-button>
          <!-- 富文本 -->
          <quill-editor v-model="form.goods_introduce"></quill-editor>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {quillEditor} from 'vue-quill-editor'

export default {
  components:{
    quillEditor
  },
  data() {
    return {
      active: "1",
      //添加商品的表单数据
      form: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      //级联选择器要绑定的数据
      selectedOptions:[],
      options:[],
      defaultProp:{
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      arrDyparams:[],
      arrStaticparams:[],
      headers:{
        Authorization:localStorage.getItem('token')
      }
    }
  },
  methods:{
    async addGood(){
    this.form.goods_cat = this.selectedOptions.join(',');
    let arr1 = this.arrDyparams.map((item)=>{
      return {attr_id:item.attr_id,attr_value:item.attr_vals};
    })
   
    let arr2 = this.arrDyparams.map((item)=>{
      return {attr_id:item.attr_id,attr_value:item.attr_vals};
    })

     this.form.attrs = [...arr1,...arr2];
     console.log(this.form);
     
    const res =await this.$http.post(`goods`,this.form);
    console.log(res);
    //成功之后回到商品列表的页面
    this.$router.push({name:"goods"});
      
    },
    //图片上传的相关方法
    //file形参是当前操作的文件的相关参数
    handlePreview(file){

    },
    handleRemove(file){
      let index =this.form.pics.findIndex((item)=>{
       return item.pic === file.response.data.tmp_path;
      }); 
        this.form.pics.splice(index,1);
    },
    handleSuccess(file){
      //tmp_uploads/3550a01c5416c28e74babe63cedaa254.txt
      this.form.pics.push({
        pic:file.data.tmp_path
      });
    },
    //级联选择器，change事件
    //级联选择器的数据
    async getGoodCate(){
      const res = await this.$http.get(`categories?type=3`);
      this.options = res.data.data;
      
   },
    //点击不同的tab的时候，触发方法
    async tabChange(){
       //如果点击的是第二个tab同时，三级分类要有值
       if(this.active === '2'){
         if(this.selectedOptions.length !== 3 ){
           //提示
           this.$message.warning("请选选择商品的三级分类");
           return;
         }
         const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`) 
       this.arrDyparams = res.data.data;
       //
       this.arrDyparams.forEach(item => {
         item.attr_vals.length===0?[]:item.attr_vals = item.attr_vals.trim().split(',');
       });
       }else if(this.active === '3'){
         if(this.selectedOptions.length !== 3 ){
           //提示
           this.$message.warning("请选选择商品的三级分类");
           return;
         }
          const res 
          = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`) 
       this.arrStaticparams = res.data.data;
       
       }
       
    }
  },
  created(){
    this.getGoodCate();
  },
}
</script>

<style scoped>
.alert {
  margin-top: 20px;
}
.ql-editor {
  min-height: 300px;
}
</style>
 