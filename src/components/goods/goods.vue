<template>
<el-card class="card">
  <!-- 面包屑 -->
  <my-bread level1="商品管理" level2="商品列表"></my-bread>

  <!-- 搜索区域 -->
    <el-row :gutter="20" class="searchRow">
      <el-col :span="8">
        <el-input clearable placeholder="请输入内容" class="inputSearch" v-model="queryinfo.query" >
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button 
        type="success" 
        @click="$router.push({name:'goodsadd'})"
        plain
        >添加商品</el-button>
      </el-col>
    </el-row>

    <!-- table 表格区域 -->
    <el-table :data="goodslist" border stripe >
      <el-table-column type="index"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格(元)" prop="goods_price" width="95"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="70"></el-table-column>
      <el-table-column label="创建时间" width="140">
        <template slot-scope="scope">
          {{scope.row.add_time | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryinfo.pagenum" :page-sizes="[10, 15, 20, 30]" :page-size="queryinfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
</el-card>
</template>

<script>
import { async } from 'q'
export default {
   data() {
    return {
      // 查询参数
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表数据，默认为空
      goodslist: [],
      // 总数据条数
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods:{
   // 根据查询参数获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryinfo })

      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败！')
      this.goodslist = res.data.goods
      this.total = res.data.total
      // console.log(res)
    },
    // 监听 pageSize 的变化，并立即获取最新的数据
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听 pageNum 的变化，并立即获取最新的数据
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage
      this.getGoodsList()
    },
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
  margin-bottom: 20px;
}
</style>
