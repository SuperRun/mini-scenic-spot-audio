<template>
  <div>
    <h1>{{id?'编辑':'新建'}}音频</h1>
    <el-form label-width="80px" :model="model" @submit.native.prevent="save">
      <el-form-item label="音频标题">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="音频类型">
        <el-select v-model="model.type">
          <el-option label="简介解说" value="1"></el-option>
          <el-option label="景区解说" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传音频">
        <el-upload
          class="upload-demo"
          :action="uploadAudioUrl"
          :on-success="afterUpload"
          :limit="1"
          :before-remove="beforeRemove"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :headers="getAuthorization()"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
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
      model: {},
      fileList: []
    };
  },
  created() {
    this.id && this.fetch(); // 仅当id存在获取详情
  },
  methods: {
    async save() {
      console.log(this.model);
      let res;
      if (this.id) {
        res = await this.$http.put(`rest/audios/${this.id}`, this.model);
      } else {
        res = await this.$http.post("rest/audios", this.model);
      }
      this.$router.push("/audios/list");
      this.$message({
        type: "success",
        message: "保存成功"
      });
    },
    async fetch() {
      const res = await this.$http.get(`rest/audios/${this.id}`);
      this.model = res.data;
      this.fileList.push({ name: this.model.filename, url: this.model.url });
    },
    handleExceed(files, fileList) {
      this.$message.warning("只能上传一个音频文件");
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    afterUpload(res) {
      console.log(res);
      this.model.url = res.url; // 文件路径
      this.model.filename = res.originalname; // 文件名称
    }
  }
};
</script>

<style>
</style>