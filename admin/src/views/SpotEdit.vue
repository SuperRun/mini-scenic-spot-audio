<template>
  <div>
    <h1>{{id?'编辑':'新建'}}景区</h1>
    <el-form :label-position="'left'" label-width="100px" @submit.native.prevent="save">
      <el-tabs type="border-card">
        <el-tab-pane label="基础信息">
          <el-form-item label="景区名称">
            <el-select
              v-model="spot"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
              @change="chooseSpot"
            >
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.title"
                :value="item.title"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="经纬度">
            <el-input v-model="location" disabled />
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="model.address" disabled />
          </el-form-item>
          <el-form-item label="景区类型">
            <el-select v-model="model.type">
              <el-option label="景区" value="1"></el-option>
              <el-option label="博物馆" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="model.price" />
          </el-form-item>
          <el-form-item label="封面图片">
            <el-upload
              class="avatar-uploader"
              :action="uploadImgUrl"
              :show-file-list="false"
              :headers="getAuthorization()"
              :on-success="res=>$set(model, 'image', res.url)"
            >
              <img v-if="model.image" :src="model.image" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="推荐指数">
            <el-rate style="margin-top:0.6rem" v-model="model.rating"></el-rate>
          </el-form-item>
          <el-form-item label="景区简介音频">
            <el-select v-model="model.intorAudio">
              <el-option
                v-for="audio in introAudios"
                :key="audio._id"
                :label="audio.name"
                :value="audio._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="景区介绍">
            <el-input type="textarea" v-model="model.introduction" />
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="参观指引">
          <el-form-item label="营业时间">
            <el-input v-model="model.guidance.openTime" />
          </el-form-item>
          <el-form-item label="门票">
            <el-input v-model="model.guidance.ticket" />
          </el-form-item>
          <el-form-item label="建议游玩时间">
            <el-input v-model="model.guidance.betterVisitTime" />
          </el-form-item>
          <el-form-item label="交通">
            <el-input type="textarea" v-model="model.guidance.traffic" />
          </el-form-item>
          <el-form-item label="小贴士">
            <el-input v-model="model.guidance.tip" />
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="讲解点管理">
          <el-form-item>
            <el-button size="small" @click="model.points.push({})">
              <i class="el-icon-plus"></i>
              添加讲解点
            </el-button>
            <el-row type="flex" :gutter="80" style="flex-wrap: wrap;margin-top:2rem">
              <el-col :md="12" v-for="(point,index) in model.points" :key="index">
                <el-form-item label="名称">
                  <el-input v-model="point.name" />
                </el-form-item>
                <el-form-item label="试听音频">
                  <el-switch v-model="point.isFree"></el-switch>
                </el-form-item>
                <!-- <el-form-item label="位置">
                  <el-input v-model="point.location" disabled />
                </el-form-item>-->
                <el-form-item label="讲解音频">
                  <el-select v-model="point.audio">
                    <el-option
                      v-for="audio in spotsAudios"
                      :key="audio._id"
                      :label="audio.name"
                      :value="audio._id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="讲解点图片">
                  <el-upload
                    class="uploader"
                    :action="uploadImgUrl"
                    :show-file-list="false"
                    :headers="getAuthorization()"
                    :on-success="res=>$set(point, 'image', res.url)"
                  >
                    <img v-if="point.image" :src="point.image" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item style="margin-top: 1rem">
                  <el-button type="danger" @click="model.points.splice(index,1)">删除</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <el-form-item>
        <el-button style="margin-top: 1rem" type="primary" native-type="submit">保存</el-button>
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
      spot: "",
      loading: false,
      options: [],
      // 景区模型
      model: {
        location: {}, // 坐标
        guidance: {}, // 参观指引
        points: [] // 讲解点
      },
      introAudios: [], // 景区简介音频
      spotsAudios: [] // 景区讲解音频
    };
  },
  computed: {
    location() {
      return Object.keys(this.model.location).length != 0
        ? this.model.location.lng + "," + this.model.location.lat
        : "";
    }
  },
  created() {
    this.fetchAudios();
    this.id && this.fetch(); // 仅当id存在获取详情
  },
  methods: {
    async save() {
      let res;
      if (this.id) {
        res = await this.$http.put(`rest/spots/${this.id}`, this.model);
      } else {
        res = await this.$http.post("rest/spots", this.model);
      }
      this.$router.push("/spots/list");
      this.$message({
        type: "success",
        message: "保存成功"
      });
    },
    async fetch() {
      const res = await this.$http(`rest/spots/${this.id}`);
      this.model = Object.assign({}, this.model, res.data);
      console.log(this.model);
      this.spot = this.model.name;
      // this.model = res.data;
    },
    async fetchAudios() {
      let res;
      res = await this.$http.get("rest/audios", { params: { type: "1" } });
      this.introAudios = res.data;
      res = await this.$http.get("rest/audios", { params: { type: "2" } });
      this.spotsAudios = res.data;
    },
    async getLocation(keyword) {
      if (!keyword) {
        this.$message({
          type: "info",
          message: "请先输入景点名称"
        });
      }
      const res = await this.$http.get("/search", {
        baseURL: "https://apis.map.qq.com/ws/place/v1",
        params: {
          keyword,
          key: "W5KBZ-X2RCW-N6LRT-RVJTP-5JBR2-PSFTM",
          boundary: "nearby(39.908491,116.374328,1000)"
        }
      });
      console.log(res);
    },
    async remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        // const res = await this.$http.get("/suggestion", {
        //   baseURL: "https://apis.map.qq.com/ws/place/v1",
        //   params: {
        //     keyword: query,
        //     key: "W5KBZ-X2RCW-N6LRT-RVJTP-5JBR2-PSFTM"
        //   }
        // });
        const res = await this.$jsonp(
          "https://apis.map.qq.com/ws/place/v1/suggestion",
          {
            keyword: query,
            key: "W5KBZ-X2RCW-N6LRT-RVJTP-5JBR2-PSFTM",
            output: "jsonp",
            oversea: 1
          }
        );
        this.options = res.data;
        this.loading = false;
      } else {
        this.options = [];
      }
    },
    chooseSpot(val) {
      const spot = this.options.find(option => option.title == val);
      this.model.name = spot.title;
      this.model.address = spot.address;
      this.model.location = spot.location;
    }
  }
};
</script>
<style lang="scss" scoped>
.uploader {
  margin-top: 2rem;
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 15rem;
    height: 15rem;
    text-align: center;
    line-height: 15rem !important;
  }
  .avatar {
    min-width: 15rem;
    height: 15rem;
    display: block;
  }
}
</style>