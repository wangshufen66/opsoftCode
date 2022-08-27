<template>
  <id-select
    v-bind="$attrs"
    v-on="$listeners"
    v-loading="idSelectLoading"
    :options="options"
    :multiple="multiple"
    filterable
    remote
    :remote-method="requestData"
    @focus="focus"
    @change="change"
  >
    <template v-slot:options="{ item }">
      <div class="flex-row-justify-space-evenly">
        <span v-if="item.number">{{ item.number }}</span>
        <span>{{ item.label }}</span>
      </div>
    </template>
    <template v-if="isPage" slot="page">
      <div class="flex-row-justify-space-evenly">
        <el-pagination
          hide-on-single-page
          small
          layout="prev, pager, next,total"
          :total="optionsTotal"
          @current-change="optionsCurrentPageChange"
        >
        </el-pagination>
      </div>
    </template>
  </id-select>
</template>
<style lang="less" scoped>
.flex-row-justify-space-evenly {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>
<script>
import IdSelect from "./IdSelect";
import authority from "../authority";
// import axios from "@/libs/api.request";

export default {
  name: "id-select-expand",
  components: { IdSelect },
  data() {
    return {
      options: [], //下拉的数据 即总数据
      optionsTotal: 0, //分页总数据的长度
      page: 1, //分页页数
      idSelectLoading: false, //是否是加载状态
      selectItems: "", //当前选中值
      isPage: true, //是否分页
    };
  },
  props: {
    multiple: {
      type: Boolean,
      default() {
        return false;
      },
    },
    getList: {
      type: Function,
      default() {
        // return axios.request({
        //   url: "/person/getList",
        //   method: "get",
        //   params: {
        //     current_page: this.page,
        //     page_size: 10,
        //     orgId: this.$store.state.user.userInfo.orgId,
        //     showAll: this.showAll,
        //     auditStatus: 1,
        //     isDisable: false,
        //   },
        // });
        return "";
      },
    },
  },
  created() {
    this.selectItems = this.multiple ? [] : "";
  },
  methods: {
    //选择项修改时记录的是目前选中值
    change(val) {
      if (val instanceof Array) {
        //新增的ID就添加
        for (const id of val) {
          if (this.selectItems.findIndex((item) => item.value === id) < 0)
            this.selectItems.push(
              this.options[this.options.findIndex((item) => item.value === id)]
            );
        }
        //拷贝数组
        const orginalItems = [...this.selectItems];
        //已经去除的ID就删除
        for (const item in orginalItems) {
          if (val.findIndex((id) => id === orginalItems[item].value) < 0) {
            this.selectItems.splice(item, 1);
          }
        }
      } else {
        //此处直接写else会有一定问题
        this.selectItems = this.options[
          this.options.findIndex((item) => item.value === val)
        ];
      }
      this.$emit("querySelectItems", this.selectItems);
    },
    //页码变更重新请求数据
    optionsCurrentPageChange(val) {
      if (this.isPage) {
        this.page = val;
        this.requestData();
      }
    },
    //页码变更重新请求数据
    focus() {
      if (this.options.length === 0 && this.isPage) this.requestData();
    },
    //数据请求方法
    requestData(val) {
      this.idSelectLoading = true;
      this.$emit("beforeQueryData", val);
      let promiseArray = [this.getList()];
      Promise.all(promiseArray)
        .then((response) => {
          // console.log(JSON.stringify(response))
          let [dataResponse] = response;
          // console.log(dataResponse.data.data);
          if (dataResponse.data.data instanceof Array) {
            this.options = dataResponse.data.data.map((item) => ({
              label: item.name,
              number: item.number ? item.number : "",
              value: item.id,
              authority: new authority(),
            }));
            this.isPage = false;
          } else {
            this.options = dataResponse.data.data.records.map((item) => ({
              label: item.name,
              number: item.number ? item.number : "",
              value: item.id,
              authority: new authority(),
            }));
            this.isPage = true;
            this.optionsTotal = dataResponse.data.data.total;
          }
        })
        .catch((response) => {
          const errorMsg = "异常信息：" + response;
          console.log(errorMsg);
          this.$notify.error({
            title: "失败",
            message: errorMsg,
          });
        })
        .finally(() => {
          this.idSelectLoading = false;
        });
    },
  },
};
</script>
