<template>
  <div>
    <h1>{{id?'编辑':'新建'}}广告</h1>
    <el-form label-width="80px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="model.items.push({})">
          <i class="el-icon-plus"></i>
          添加广告
        </el-button>
      </el-form-item>
      <el-row type="flex" style="flex-wrap: wrap">
        <el-col :md="12" v-for="(item,index) in model.items" :key="index">
          <el-form-item label="广告链接">
            <el-input v-model="item.url" />
          </el-form-item>
          <el-form-item label="广告图片">
            <br />
            <el-upload
              class="avatar-uploader"
              :action="uploadImgUrl"
              :show-file-list="false"
              :on-success="res=>$set(item, 'image', res.url)"
            >
              <img v-if="item.image" :src="item.image" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item style="margin-top: 1rem">
            <el-button type="danger" @click="model.items.splice(index,1)">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
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
      model: {
        items: []
      } // 分类模型
    };
  },
  created() {
    this.id && this.fetch(); // 仅当id存在获取详情
  },
  methods: {
    async save() {
      let res;
      if (this.id) {
        res = await this.$http.put(`rest/ads/${this.id}`, this.model);
      } else {
        res = await this.$http.post("rest/ads", this.model);
      }
      this.$router.push("/ads/list");
      this.$message({
        type: "success",
        message: "保存成功"
      });
    },
    async fetch() {
      const res = await this.$http(`rest/ads/${this.id}`);
      this.model = res.data;
    }
  }
};
</script>
