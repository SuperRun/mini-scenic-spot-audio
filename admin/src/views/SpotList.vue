<template>
  <div>
    <h1>景区列表</h1>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="_id" label="ID" width="220"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">{{scope.row.type === 1?'景区':'博物馆'}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [] // 分类列表
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("rest/spots");
      this.tableData = res.data;
    },
    edit(item) {
      this.$router.push(`/spots/edit/${item._id}`);
    },
    async remove(row) {
      this.$confirm(`是否删除该景区"${row.name}"?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.$http.delete(`rest/spots/${row._id}`);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        // 重新获取数据
        this.fetch();
      });
    }
  }
};
</script>