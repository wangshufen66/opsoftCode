<template>
  <div class="container">
    <el-tabs class="switch-tab" v-model="tabValue" type="card" @tab-click="handleClickTab">
      <el-tab-pane label="公共样式" name="public">
        <div class="title-wrapper-public">
          <span>LOGO图片</span>
          <span>（此处上传企业LOGO，在PC端和APP端统一展示。）</span>
        </div>
        <div class="picture">
          <div
            @mouseover="picMouseOver(0)"
            @mouseout="picMouseOut(0)"
            @click="clickChangePic('edit',publicPic)"
            ref="hintDiv_0"
            class="hint-div"
          >
            <i style="margin-right: 2px" class="el-icon-edit-outline"></i>
            <span>{{publicPic.hintText}}</span>
          </div>
          <el-image
            @mouseover="picMouseOver(0)"
            @mouseout="picMouseOut(0)"
            style="width: 600px; height: 320px; border-radius: 4px;"
            :src="publicPic.url"
            :preview-src-list="[publicPic.url]"
          >
            <div
              style="cursor: pointer;width: 100%; height: 100%; border: #dcdfe6 1px dashed; display: flex; justify-content: center"
              @click="clickChangePic('add',publicPic)"
              slot="error"
              class="image-slot"
            >
              <div
                style="position: relative; bottom: 1rem; display: flex;text-align: center; justify-content: center; flex-direction: column"
              >
                <i
                  style="font-size: 48px; color: #1989FA; margin-bottom: 1rem"
                  class="el-icon-circle-plus"
                ></i>
                <span style="font-size: 14px; color: #4f4f4f">上传图片</span>
                <span style="font-size: 13px">支持JPG/PNG格式</span>
              </div>
            </div>
          </el-image>
        </div>
      </el-tab-pane>
      <el-tab-pane label="PC端样式" name="pc">
        <div class="title-wrapper-public">
          <span>企业图片</span>
          <span>（上传企业公司的图片，在PC端首页展示。）</span>
        </div>
        <div class="picture">
          <div
            @mouseover="picMouseOver(1)"
            @mouseout="picMouseOut(1)"
            @click="clickChangePic('edit', pcPic)"
            ref="hintDiv_1"
            class="hint-div"
          >
            <i style="margin-right: 2px" class="el-icon-edit-outline"></i>
            <span>{{pcPic.hintText}}</span>
          </div>
          <el-image
            @mouseover="picMouseOver(1)"
            @mouseout="picMouseOut(1)"
            style="width: 600px; height: 320px; border-radius: 4px;"
            :src="pcPic.url"
            :preview-src-list="[pcPic.url]"
          >
            <div
              style="cursor: pointer;width: 100%; height: 100%; border: #dcdfe6 1px dashed; display: flex; justify-content: center"
              @click="clickChangePic('add', pcPic)"
              slot="error"
              class="image-slot"
            >
              <div
                style="position: relative; bottom: 1rem; display: flex;text-align: center; justify-content: center; flex-direction: column"
              >
                <i
                  style="font-size: 48px; color: #1989FA; margin-bottom: 1rem"
                  class="el-icon-circle-plus"
                ></i>
                <span style="font-size: 14px; color: #4f4f4f">上传图片</span>
                <span style="font-size: 13px">支持JPG/PNG格式</span>
              </div>
            </div>
          </el-image>
        </div>
      </el-tab-pane>
      <el-tab-pane label="移动端样式" name="mobile">
        <div class="title-wrapper-public">
          <span>企业所属行业</span>
          <span>（可多选所属行业，将在移动端展示相应的功能模块。）</span>
        </div>
        <div class="select-wrapper">
          <div class="select-inner" v-for="item in industry.list" :key="item.id">
            <el-checkbox v-model="item.value"></el-checkbox>
            <span>{{item.title}}</span>
          </div>
        </div>
        <div class="title-wrapper-public">
          <span>首页轮播图</span>
          <span>（可上传3-6张图，在移动端首页轮播展示。）</span>
        </div>
        <div class="picture-2">
          <div class="pics-wrapper" v-show="i.show" v-for="(i,index) in swipePics" :key="appearance">
            <div
              @mouseover="picMouseOver(appearance+2)"
              @mouseout="picMouseOut(appearance+2)"
              :ref="i.ref"
              class="hint-div special-div"
            >
              <div @click="clickChangePic('edit', i)">
                <i style="margin-right: 2px" class="el-icon-edit-outline"></i>
                <span>更改图片</span>
              </div>
              <div @click="deleteMobile(i)">
                <i style="margin-right: 2px" class="el-icon-delete"></i>
                <span>删除</span>
              </div>
            </div>
            <el-image
              @mouseover="picMouseOver(appearance+2)"
              @mouseout="picMouseOut(appearance+2)"
              style="width: 300px; height: 160px; border-radius: 4px;"
              :src="i.url"
              :preview-src-list="[i.url]"
            >
              <div
                style="cursor: pointer;width: 100%; height: 100%; border: #dcdfe6 1px dashed; display: flex; justify-content: center"
                @click="clickChangePic('add', 'uploader')"
                slot="error"
                class="image-slot"
              >
                <div
                  style=" display: flex;text-align: center; justify-content: center; flex-direction: column"
                >
                  <i
                    style="font-size: 36px; color: #1989FA; margin-bottom: 1rem"
                    class="el-icon-circle-plus"
                  ></i>
                  <span style="font-size: 14px; color: #4f4f4f">上传图片</span>
                  <span style="font-size: 13px">支持JPG/PNG格式</span>
                </div>
              </div>
            </el-image>
          </div>
          <div v-if="swipeListLength<6" class="pics-wrapper">
            <div
              @mouseover="picMouseOver(8)"
              @mouseout="picMouseOut(8)"
              @click="clickChangePic('edit', 'uploader')"
              ref="hintDiv_8"
              v-text="publicPic.hintText"
              class="hint-div"
            ></div>
            <el-image
              @mouseover="picMouseOver(8)"
              @mouseout="picMouseOut(8)"
              style="width: 300px; height: 160px; border-radius: 4px;"
              src
            >
              <div
                style="cursor: pointer;width: 100%; height: 100%; border: #dcdfe6 1px dashed; display: flex; justify-content: center"
                @click="clickChangePic('add', 'uploader')"
                slot="error"
                class="image-slot"
              >
                <div
                  style=" display: flex;text-align: center; justify-content: center; flex-direction: column"
                >
                  <i
                    style="font-size: 36px; color: #1989FA; margin-bottom: 1rem"
                    class="el-icon-circle-plus"
                  ></i>
                  <span style="font-size: 14px; color: #4f4f4f">上传图片</span>
                  <span style="font-size: 13px">支持JPG/PNG格式</span>
                </div>
              </div>
            </el-image>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      width="640px"
      :title="changePictureDialog.title"
      :visible.sync="changePictureDialog.v"
    >
      <el-upload
        action
        style="width: 600px; height: 320px;"
        class="avatar-uploader"
        :http-request="getChangePicFile"
        :before-upload="beforeAvatarUpload"
        :show-file-list="false"
      >
        <img
          style="width: 600px; height: 320px;"
          v-if="changePictureDialog.picFile !== ''"
          :src="changePictureDialog.picFile"
          class="avatar"
        />
        <div v-else class="else-spaceholder">
          <div>
            <i style="font-size: 60px" class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="changePictureDialog.v = false, changePictureDialog.picFile = '',changePictureDialog.rawFile = {}"
        >取 消</el-button>
        <el-button type="primary" size="small" @click="postPic">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
::v-deep {
  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    background-color: #1890ff;
    border-radius: 5px 5px 0 0;
    color: white;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
  }

  .el-tabs__nav-wrap .is-top {
    border-bottom: none;
    border-left: none;
    transition: 0ms;
  }

  .el-tabs__header {
    border-bottom: 1px solid #1890ff;
  }

  .el-tabs__item:hover {
    color: #4f4f4f;
  }
}
.picture {
  position: relative;
  height: 320px;
  display: flex;
  justify-content: center;
  margin-top: 10vh;
  .hint-div {
    cursor: pointer;
    position: absolute;
    bottom: 0;
    z-index: 1;
    border-radius: 4px;
    width: 600px;
    height: 0;
    color: #ffffff;
    overflow: hidden;
    text-align: center;
    line-height: 40px;
    background-color: rgba(0, 0, 0, 0.3);
    transition: all 0.25s;
  }
}

.picture-2 {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  .pics-wrapper {
    position: relative;
    margin-right: 1rem;
    height: 160px;
    margin-bottom: 1rem;
  }
  .special-div {
    display: flex;
    div:nth-child(1) {
      width: 50%;
      border-right: rgba(255, 255, 255, 0.274) 1px solid;
      //   background-color: blue;
      //   color: rgba(255, 255, 255, 0.733);
    }
    div:nth-child(2) {
      width: 50%;
      //   background-color: red;
      //   color: rgba(255, 255, 255, 0.733);
    }
  }
  .hint-div {
    cursor: pointer;
    position: absolute;
    bottom: 0;
    z-index: 1;
    border-radius: 4px;
    width: 300px;
    height: 0;
    color: #ffffff;
    overflow: hidden;
    text-align: center;
    line-height: 40px;
    background-color: rgba(0, 0, 0, 0.3);
    transition: all 0.25s;
  }
}
</style>
<style lang="less" scoped>
.switch-tab {
  margin-top: 12px;
}
.title-wrapper-public {
  margin-bottom: 1rem;
  span:nth-child(1) {
    font-size: 24px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    color: #4f4f4f;
  }
  span {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #7f7f7f;
  }
}
.else-spaceholder {
  width: 600px;
  height: 320px;
  display: flex;
  justify-content: center;
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
.select-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .select-inner {
    margin: 0 20px 20px 20px;
    span {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #515a6e;
      margin-left: 0.5rem;
    }
  }
}
</style>

<script>
import {
  uploadPic,
  getAppearanceList,
  saveImg,
  updateImg,
  deleteImg,
} from "@/api/systemConfig/appearance";
import imageConversion from "image-conversion";
export default {
  name: "appearance",
  data() {
    return {
      orgId: this.$store.state.user.userInfo.orgId,
      oList: [
        {
          id: "",
          show: true,
          ref: "hintDiv_2",
          url: "",
        },
        {
          id: "",
          show: false,
          ref: "hintDiv_3",
          url: "",
        },
        {
          id: "",
          show: false,
          ref: "hintDiv_4",
          url: "",
        },
        {
          id: "",
          show: false,
          ref: "hintDiv_5",
          url: "",
        },
        {
          id: "",
          show: false,
          ref: "hintDiv_6",
          url: "",
        },
        {
          id: "",
          show: false,
          ref: "hintDiv_7",
          url: "",
        },
      ],
      swipePics: [
        {
          id: "",
          show: true,
          ref: "hintDiv_2",
          url: "",
        },
        {
          id: "",
          show: false,
          ref: "hintDiv_3",
          url: "",
        },
        {
          id: "",
          show: false,
          ref: "hintDiv_4",
          url: "",
        },
        {
          id: "",
          show: false,
          ref: "hintDiv_5",
          url: "",
        },
        {
          id: "",
          show: false,
          ref: "hintDiv_6",
          url: "",
        },
        {
          id: "",
          show: false,
          ref: "hintDiv_7",
          url: "",
        },
      ],
      industry: {
        list: [
          {
            id: 1,
            title: "光伏行业",
            value: false,
          },
          {
            id: 2,
            title: "光通信行业",
            value: false,
          },
          {
            id: 3,
            title: "汽车行业",
            value: false,
          },
          {
            id: 4,
            title: "铸造行业",
            value: false,
          },
        ],
      },
      tabValue: "public",
      changePictureDialog: {
        title: "上传LOGO",
        v: false,
        picFile: "",
        rawFile: {},
      },
      publicPic: {
        hintText: "更改图片",
        url: "",
        id: "",
      },
      pcPic: {
        hintText: "更改图片",
        url: "",
        id: "",
      },
      uploadIntent: {
        intent: "",
        data: "",
      },
      swipeListLength: 0,
    };
  },
  watch: {
    tabValue(n) {
      switch (n) {
        case "public":
          this.changePictureDialog.title = "上传LOGO";
          break;
        case "pc":
          this.changePictureDialog.title = "上传企业图片";
          break;
        case "mobile":
          this.changePictureDialog.title = "上传轮播图";
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    this.getLogo();
    this.getPC();
    this.getMobile();
  },
  methods: {
    clickChangePic(intent, data) {
      this.uploadIntent = {
        intent: intent,
        data: data,
      };
      this.changePictureDialog.v = true;
    },
    handleClickTab() {},
    async getPic(param) {
      try {
        return await Promise.resolve(getAppearanceList(param));
      } catch (e) {
        console.log(e);
      }
    },
    async getLength() {
      const param = {
        type: 2,
        orgId: this.orgId,
      };
      let res = await this.getPic(param);
      this.swipeListLength = res.data.data.length;
    },
    async getLogo() {
      const param = {
        type: 0,
        orgId: this.orgId,
      };
      let res = await this.getPic(param);
      try {
        this.publicPic.url = res.data.data[0].img;
        this.publicPic.id = res.data.data[0].id;
      } catch (e) {}
    },
    async getPC() {
      const param = {
        type: 1,
        orgId: this.orgId,
      };
      let res = await this.getPic(param);
      try {
        this.pcPic.url = res.data.data[0].img;
        this.pcPic.id = res.data.data[0].id;
      } catch (e) {}
    },
    async getMobile() {
      const param = {
        type: 2,
        orgId: this.orgId,
      };
      let res = await this.getPic(param);
      this.swipeListLength = res.data.data.length;
      res.data.data.forEach((item, index) => {
        this.swipePics[appearance].url = item.img;
        this.swipePics[appearance].id = item.id;
      });
      this.swipePics.forEach((item, index) => {
        if (item.url !== "") {
          item.show = true;
        } else {
          item.show = false;
        }
      });
    },
    async uploadLogo(id) {
      try {
        const param = {
          fdfsId: id,
          orgId: this.orgId,
          type: 0,
        };
        let res = await Promise.resolve(saveImg(param));
        if (res.data.code === 200) {
          this.$notify({
            title: "成功",
            type: "success",
            message: res.data.msg,
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: res.data.msg,
          });
        }

        await this.getLogo();
      } catch (e) {}
    },
    async updateLogo(data) {
      const param = {
        id: data.id,
        fdfsId: data.fdfsId,
        orgId: this.orgId,
        type: 0,
      };
      let res = await Promise.resolve(updateImg(param));
      if (res.data.code === 200) {
        this.$notify({
          title: "成功",
          type: "success",
          message: res.data.msg,
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: res.data.msg,
        });
      }

      await this.getLogo();
    },
    async uploadPC(id) {
      try {
        const param = {
          fdfsId: id,
          orgId: this.orgId,
          type: 1,
        };
        let res = await Promise.resolve(saveImg(param));
        if (res.data.code === 200) {
          this.$notify({
            title: "成功",
            type: "success",
            message: res.data.msg,
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: res.data.msg,
          });
        }
        await this.getPC();
      } catch (e) {}
    },
    async updatePC(data) {
      const param = {
        id: data.id,
        fdfsId: data.fdfsId,
        orgId: this.orgId,
        type: 1,
      };
      let res = await Promise.resolve(updateImg(param));
      if (res.data.code === 200) {
        this.$notify({
          title: "成功",
          type: "success",
          message: res.data.msg,
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: res.data.msg,
        });
      }

      await this.getPC();
    },
    async uploadMobile(id) {
      try {
        const param = {
          fdfsId: id,
          orgId: this.orgId,
          type: 2,
        };
        let res = await Promise.resolve(saveImg(param));
        if (res.data.code === 200) {
          this.$notify({
            title: "成功",
            type: "success",
            message: res.data.msg,
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: res.data.msg,
          });
        }
        await this.getMobile();
      } catch (e) {
        console.log(e);
      }
    },
    async updateMobile(data) {
      const param = {
        id: data.id,
        fdfsId: data.fdfsId,
        orgId: this.orgId,
        type: 2,
      };
      let res = await Promise.resolve(updateImg(param));
      if (res.data.code === 200) {
        this.$notify({
          title: "成功",
          type: "success",
          message: res.data.msg,
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: res.data.msg,
        });
      }
      this.swipePics.forEach((i) => {
        if (i.id === data.id) {
          i.url = data.path;
        }
      });
      await this.getMobile();
    },
    async deleteMobile(data) {
      try {
        const param = {
          orgId: this.orgId,
          id: data.id,
        };
        await Promise.resolve(deleteImg(param));
        this.swipePics.forEach((item) => {
          if (item.id === data.id) {
            item.show = false;
            item.url = "";
            item.id = "";
          }
        });
        this.getLength();
      } catch (e) {}
    },
    async postPic() {
      try {
        let res = await Promise.resolve(
          uploadPic(this.changePictureDialog.rawFile, "picture")
        );
        if (res.data.code === 200) {
          const id = res.data.data.id;
          switch (this.tabValue) {
            case "public":
              if (this.uploadIntent.intent === "add") {
                this.uploadLogo(id);
              } else {
                this.updateLogo({ fdfsId: id, id: this.publicPic.id });
              }
              break;
            case "pc":
              if (this.uploadIntent.intent === "add") {
                this.uploadPC(id);
              } else {
                this.updatePC({ fdfsId: id, id: this.pcPic.id });
              }
              break;
            case "mobile":
              if (this.uploadIntent.intent === "add") {
                this.uploadMobile(id);
              } else {
                this.updateMobile({
                  fdfsId: id,
                  id: this.uploadIntent.data.id,
                  path: res.data.data.path,
                });
              }
              break;
            default:
              break;
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: res.data.msg,
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.changePictureDialog.v = false;
        this.changePictureDialog.picFile = "";
        this.changePictureDialog.rawFile = {};
      }
    },
    getChangePicFile(f) {},
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      //如果图片小于0.5m则上传原图，否则压缩到400k
      const isLt05M = file.size / 1024 / 1024 < 0.5;
      if (!(isJPG || isPNG)) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
        return false;
      } else {
        return new Promise((resolve) => {
          if (isLt05M) {
            this.changePictureDialog.picFile = URL.createObjectURL(file);
            this.changePictureDialog.rawFile = file;
          } else {
            imageConversion.compressAccurately(file, 400).then((res) => {
              const files = new window.File([res], "compressed", {
                type: res.type,
              });
              this.changePictureDialog.picFile = URL.createObjectURL(files);
              this.changePictureDialog.rawFile = files;
            });
          }
        }).catch((e) => {
          console.log(e);
        });
      }
    },
    picMouseOver(n) {
      try {
        this.$refs["hintDiv_" + n].style.height = "40px";
      } catch (e) {
        this.$refs["hintDiv_" + n][0].style.height = "40px";
      }
    },
    picMouseOut(n) {
      try {
        this.$refs["hintDiv_" + n].style.height = "0";
      } catch (e) {
        this.$refs["hintDiv_" + n][0].style.height = "0";
      }
    },
  },
};
</script>
