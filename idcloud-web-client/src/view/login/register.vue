<template>
  <div class="register">
    <Modal
      v-model="registerObj.show"
      :title="registerObj.title"
      class="register-modal"
      @on-ok="saveRegisterFunc('registerForm')"
      @on-cancel="resetRegisterFunc('registerForm')"
    >
      <!--Modal  有问题-->
      <Form
        ref="registerForm"
        :model="registerData"
        :rules="registerRules"
        :label-width="137"
        class="padding-right-24"
      >
        <FormItem label="登录账号" prop="userName">
          <Input v-model.trim="registerData.userName"></Input>
        </FormItem>
        <FormItem label="登录密码" prop="password">
          <Input type="password" v-model.trim="registerData.password"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="passwordConfirm">
          <Input
            type="password"
            v-model.trim="registerData.passwordConfirm"
          ></Input>
        </FormItem>
        <FormItem label="企业名称" prop="name">
          <Input v-model.trim="registerData.name"></Input>
        </FormItem>
        <FormItem label="社会信用统一代码" prop="creditCode">
          <Input v-model.trim="registerData.creditCode"></Input>
        </FormItem>
        <FormItem label="所属行业" prop="industry">
          <Input v-model.trim="registerData.industry"></Input>
        </FormItem>
        <FormItem label="联系电话" prop="phone">
          <Input v-model.trim="registerData.phone"></Input>
        </FormItem>
        <FormItem label="联系邮箱" prop="email">
          <Input v-model.trim="registerData.email"></Input>
        </FormItem>
        <FormItem
          v-if="verificationCodeExist"
          label="验证码"
          prop="verificationCode"
        >
          <Input
            v-model.trim="registerData.verificationCode"
            style="width:74%;margin-right:10px"
          ></Input>
          <el-button
            type="primary"
            size="small"
            v-loading="verificationCodeLoad"
            @click="getVerificationCode"
            >{{ verificationCodeText }}</el-button
          >
        </FormItem>
        <FormItem label="企业地址" prop="simpleAddress">
          <!--<Input v-model.trim="registerData.simpleAddress"></Input>-->
          <el-cascader
            style="width: 100%"
            placeholder="试试输入县市区"
            v-model.trim="registerData.simpleAddress"
            :options="cdata"
            clearable
            @change="addrChange"
            size="small"
            filterable
          />
        </FormItem>
        <FormItem label="详细地址" prop="detailAddress">
          <!--<Input v-model.trim="registerData.detailAddress"></Input>-->
          <el-autocomplete
            ref="addressDetail"
            class="address-detail"
            style="width: 100%"
            :debounce="1000"
            :clearable="true"
            v-model.trim="registerData.detailAddress"
            :fetch-suggestions="querySearch"
            placeholder="街道-大楼名称-门牌号码"
            size="small"
            :trigger-on-focus="false"
            @select="getAnswer"
          >
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
              <span class="addr">{{ item.district + item.address }}</span>
            </template>
          </el-autocomplete>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { register } from "@/api/auth";
import jsonData from "@/assets/static/data/address";

export default {
  data() {
    return {
      verificationCodeExist: false,
      verificationCodeLoad: false,
      verificationCodeText: "点击获取",
      cdata: [],
      addressData: {
        province: "",
        city: "",
        prefecture: "",
        lng: "",
        lat: ""
      },
      registerRules: {
        userName: [
          {
            required: true,
            message: "登录账号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        passwordConfirm: [
          {
            required: true,
            message: "确认密码不能为空",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "企业名称不能为空",
            trigger: "blur"
          }
        ],
        creditCode: [
          {
            required: true,
            message: "社会信用统一代码不能为空",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              this.CheckSocialCreditCode(rule, value, callback);
            },
            trigger: ["blur"]
          }
        ],
        industry: [
          {
            required: true,
            message: "所属行业不能为空",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            // type: 'tel',
            // message: '请填写正确的联系电话',
            message: "联系电话不能为空",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "请填写正确的邮箱",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              this.checkEmail(rule, value, callback);
            },
            trigger: ["blur"]
          }
        ],
        verificationCode: [
          {
            required: true,
            // type: 'number',
            message: "请填写正确的验证码",
            trigger: "blur"
          }
        ]
      },
      registerData: {
        userName: "", //帐号
        password: "", //密码
        passwordConfirm: "", //密码确认
        name: "", //企业名称
        creditCode: "", //社会信用统一代码
        industry: "", //企业行业
        phone: "", //企业电话
        email: "", //邮箱
        simpleAddress: "", //企业省市区地址
        detailAddress: "", //企业详细地址
        verificationCode: "" //验证码
      }
    };
  },
  watch: {
    "registerData.simpleAddress": {
      handler(newV) {
        this.addressData.province = newV[0];
        this.addressData.city = newV[1];
        this.addressData.prefecture = newV[2];
      }
    }
  },
  props: {
    registerObj: {
      type: Object
    }
  },
  mounted() {
    this.cdata = jsonData;
  },
  methods: {
    fullAddress() {
      return (
        this.addressData.province +
        this.addressData.city +
        this.addressData.prefecture +
        this.registerData.detailAddress
      );
    },
    clearNE() {
      //清除原有经纬度信息
      this.addressData.lng = "";
      this.addressData.lat = "";
    },
    querySearch(str, callback) {
      this.clearNE();
      const url = "https://restapi.amap.com/v3/assistant/inputtips";
      const key = "593a113247c4ba8949221df3acbdc499";
      const addressInfo = str;
      const city = this.addressData.city;
      this.$http
        .get(`${url}?key=${key}&keywords=${addressInfo}&city=${city}`)
        .then(res => {
          let returnArray = res.data.tips
            .filter(
              item => item.district.indexOf(this.addressData.prefecture) > 0
            )
            .map(item => {
              item.key = item.name;
              item.value = item.name;
              item.fullAddress = item.district + item.address;
              item.wholeLink = item.address + " (" + item.name + ")";
              return item;
            });
          callback(returnArray);
        })
        .catch(e => {
          console.log(e);
        });
    },
    getAnswer(item) {
      let regex =
        "(?<province>[^省]+省|.+自治区)(?<city>[^自治州]+自治州|[^市]+市|[^盟]+盟|[^地区]+地区|.+区划)(?<county>[^市]+市|[^县]+县|[^旗]+旗|.+区)?(?<town>[^区]+区|.+镇)?(?<village>.*)";
      let address = item.district;
      let matchArray = address.match(regex);
      // if(this.addressData.addrs.length !== 0) {
      //   this.containerInfosData.addrs[0] = this.addressData.province = matchArray.groups.province
      //   this.containerInfosData.addrs[1] = this.addressData.city = matchArray.groups.city
      //   this.containerInfosData.addrs[2] = this.addressData.prefecture = matchArray.groups.county
      // }
      this.addressData.province = matchArray.groups.province;
      this.addressData.city = matchArray.groups.city;
      this.addressData.prefecture = matchArray.groups.county;
      this.registerData.detailAddress = item.wholeLink;

      let locationArr = item.location.split(",");
      this.addressData.lng = locationArr[0];
      this.addressData.lat = locationArr[1];
    },
    getGeoXY() {
      const url = "https://restapi.amap.com/v3/geocode/geo";
      const key = "593a113247c4ba8949221df3acbdc499";
      this.$http
        .get(`${url}?key=${key}&address=${this.fullAddress()}`)
        .then(res => {
          let locationArr = res.data.geocodes[0].location.split(",");
          this.addressData.lng = locationArr[0];
          this.addressData.lat = locationArr[1];
        });
    },
    addrChange() {
      this.addressData.detailAddress = "";
      this.clearNE();
      this.$refs.addressDetail.$children[0].clear();
    },

    initFunc() {
      this.registerData.userName = "";
      this.registerData.password = "";
    },
    /* 关闭窗口 */
    resetRegisterFunc(data) {
      this.verificationCodeExist = false;
      this.verificationCodeLoad = false;
      this.verificationCodeText = "点击获取";
      this.$refs[data].resetFields();
    },
    /* 注册 - 表单验证 */
    saveRegisterFunc(data) {
      this.$refs[data].validate(valid => {
        if (valid) {
          this.saveRegisterSureFunc(data);
        } else {
          this.$message.error("*为必填项");
        }
      });
    },
    /* 注册 - 确认提交 */
    saveRegisterSureFunc(data) {
      const commitData = {
        userName: this.registerData.userName,
        password: this.registerData.password,
        name: this.registerData.name,
        unifiedSocialCreditCode: this.registerData.creditCode,
        orgId: this.registerData.industry,
        phone: this.registerData.phone,
        email: this.registerData.email,
        province: this.addressData.province,
        city: this.addressData.city,
        district: this.addressData.prefecture,
        address: this.registerData.detailAddress
      };
      register(commitData)
        .then(res => {
          if (res.data.code === 200) {
            this.$Notice.success({
              title: "注册成功"
            });
            this.resetRegisterFunc(data);
          } else {
            this.$Notice.error({
              title: "注册失败",
              desc: res.data.msg
            });
          }
        })
        .catch(err => {
          this.$Notice.error({
            title: "注册接口调用失败",
            desc: err
          });
        });
    },
    //统一社会信用代码校验——JS  百度的
    CheckSocialCreditCode(rule, Code, callback) {
      const patrn = /^[0-9A-Z]+$/;
      //18位校验及大写校验
      if (Code.length != 18 || patrn.test(Code) == false) {
        callback(new Error("不是有效的统一社会信用代码！"));
      } else {
        let Ancode; //统一社会信用代码的每一个值
        let Ancodevalue; //统一社会信用代码每一个值的权重
        let total = 0;
        const weightedfactors = [
          1,
          3,
          9,
          27,
          19,
          26,
          16,
          17,
          20,
          29,
          25,
          13,
          8,
          24,
          10,
          30,
          28
        ]; //加权因子
        const str = "0123456789ABCDEFGHJKLMNPQRTUWXY";
        //不用I、O、S、V、Z
        for (var i = 0; i < Code.length - 1; i++) {
          Ancode = Code.substring(i, i + 1);
          Ancodevalue = str.indexOf(Ancode);
          total = total + Ancodevalue * weightedfactors[i];
          //权重与加权因子相乘之和
        }
        let logiccheckcode = 31 - (total % 31);
        if (logiccheckcode == 31) {
          logiccheckcode = 0;
        }
        const Str =
          "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
        const Array_Str = Str.split(",");
        logiccheckcode = Array_Str[logiccheckcode];
        const checkcode = Code.substring(17, 18);
        if (logiccheckcode != checkcode) {
          callback(new Error("不是有效的统一社会信用代码！"));
        }
      }
      callback();
    },
    //验证码可以输入
    checkEmail(rule, Code, callback) {
      this.verificationCodeExist = true;
      callback();
    },
    //验证码获取
    async getVerificationCode() {
      this.verificationCodeLoad = true;
      this.verificationCodeText = "获取中";
      try {
        await "成功";
        this.verificationCodeCountdown();
      } catch (e) {
        this.$notify.error({
          title: "失败",
          message: e
        });
        this.verificationCodeText = "获取失败";
      } finally {
        this.verificationCodeLoad = false;
      }
    },
    //验证倒计时函数
    verificationCodeCountdown() {
      let that = this;
      let time = 60;
      this.verificationCodeText = time + "s";
      clearInterval(timer);
      const timer = setInterval(function() {
        console.log(time);
        time--;
        if (time == 0) {
          that.verificationCodeText = "点击获取";
          clearInterval(timer);
          return false;
        }
        that.verificationCodeText = time + "s";
      }, 1000);
    }
  }
};
</script>

<style></style>
