<template>
  <div>
    <h1>{{id?'编辑':'新建'}}管理员</h1>
    <el-form @submit.native.prevent="save">
      <el-form-item label="用户名">
        <el-input type="text" v-model="model.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="text" v-model="model.password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    id: {}
  },
  data() {
    return {
      model: {} // 管理员模型
    };
  },
  created() {
    this.id && this.fetch(); // 仅当id存在获取详情
  },
  methods: {
    async save() {
      let res;
      if (this.id) {
        res = await this.$http.put(`rest/admin_users/${this.id}`, this.model);
      } else {
        res = await this.$http.post("rest/admin_users", this.model);
      }
      this.$router.push("/admin_users/list");
      this.$message({
        type: "success",
        message: "保存成功"
      });
    },
    async fetch() {
      const res = await this.$http(`rest/admin_users/${this.id}`);
      this.model = res.data;
    }
  }
};
</script>