<template>
  <div>
    <el-dialog
      v-model="orgSaveObj.show"
      :visible.sync="orgSaveObj.show"
      :title="orgSaveObj.title"
      top="30px"
      @closed="closeFunc('accountRef')"
    >
      <el-form
        ref="accountRef"
        :model="orgSaveObj.data"
        :rules="orgSaveRules"
        label-width="140px"
        size="medium"
        label-position="right"
      >
        <el-form-item label="企业名称" prop="name">
          <el-input
            :disabled="!orgSaveObj.editOrgAuthority"
            v-model.trim="orgSaveObj.data.name"
          />
        </el-form-item>
        <el-form-item v-if="orgSaveObj.data.id" label="企业代码" prop="number">
          <el-input disabled v-model.trim="orgSaveObj.data.number"/>
        </el-form-item>
        <el-form-item label="社会信用统一代码" prop="unifiedSocialCreditCode">
          <el-input
            :disabled="!orgSaveObj.editOrgAuthority"
            v-model.trim="orgSaveObj.data.unifiedSocialCreditCode"
          />
        </el-form-item>
        <el-form-item label="所属行业" prop="businessType">
          <el-select
            :disabled="!orgSaveObj.editOrgAuthority"
            v-model="orgSaveObj.data.businessType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in businessTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="企业状态"
          prop="status"
          v-if="orgSaveObj.data.id || orgSaveObj.editAuthority"
        >
          <el-select
            :disabled="
              !orgSaveObj.editOrgAuthority || !orgSaveObj.editAuthority
            "
            v-model.trim="orgSaveObj.data.status"
            placeholder="请选择"
          >
            <el-option label="试用" value="0"></el-option>
            <el-option label="正常" value="1"></el-option>
            <el-option disabled label="过期" value="2"></el-option>
            <el-option label="禁用" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="contact">
          <el-input
            :disabled="!orgSaveObj.editOrgAuthority"
            v-model.trim="orgSaveObj.data.contact"
          />
        </el-form-item>
        <el-form-item label="联系邮箱" prop="email">
          <el-input
            :disabled="!orgSaveObj.editOrgAuthority"
            v-model.trim="orgSaveObj.data.email"
          />
        </el-form-item>
        <el-form-item label="企业地址" prop="simpleAddress">
          <!--<el-input v-model.trim="orgSaveObj.data.simpleAddress"/>-->
          <el-cascader
            :disabled="!orgSaveObj.editOrgAuthority"
            placeholder="试试输入县市区"
            v-model.trim="orgSaveObj.data.simpleAddress"
            :options="cdata"
            clearable
            @change="addrChange"
            size="small"
            filterable
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <!--<el-input v-model.trim="orgSaveObj.data.address"/>-->
          <el-autocomplete
            :disabled="!orgSaveObj.editOrgAuthority"
            ref="addressDetail"
            class="address-detail"
            :debounce="1000"
            :clearable="true"
            v-model.trim="orgSaveObj.data.address"
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
        </el-form-item>
        <el-form-item
          label="过期时间"
          prop="expireTime"
          v-if="orgSaveObj.data.id || orgSaveObj.editAuthority"
        >
          <!--<el-input v-model.trim="orgSaveObj.data.expireTime" type="datetime"/>-->
          <el-date-picker
            :disabled="!orgSaveObj.editOrgAuthority || !orgSaveObj.editAuthority"
            v-model="orgSaveObj.data.expireTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            default-time="24:00:00"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="userType===99&&orgSaveObj.data.pid===0"
                      label="最大用户数量" prop="maxUser">
          <el-input-number
            :disabled="!orgSaveObj.editOrgAuthority"
            v-model="maxUser"
            :min="0"
            :step="1"
          />
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input
            :disabled="!orgSaveObj.editOrgAuthority"
            v-model.trim="orgSaveObj.data.description"
          />
        </el-form-item>
      </el-form>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{ orgSaveObj.title }}</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button @click="closeFunc('accountRef')">取消</el-button>
        <el-button
          type="primary"
          :disabled="!orgSaveObj.editOrgAuthority"
          @click="saveFunc('accountRef')"
        >确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addOrg,
    editOrg,
    getOrgDetail,
    getTypeList,
  } from "@/api/systemManagement/org";
  import jsonData from "@/assets/static/data/address";

  export default {
    name: "AddOrEditOrg",
    computed: {
      userType() {
        return this.$store.state.user.userInfo.type;
      },
    },
    data() {
      return {
        // options: [{
        //   value: '选项1',
        //   label: '黄金糕'
        // }, {
        //   value: '选项2',
        //   label: '双皮奶'
        // }, {
        // }],
        addressData: {
          province: "",
          city: "",
          prefecture: "",
          lng: "",
          lat: "",
        }, //省市区详细地址保存对象
        cdata: [], //省市区列表
        businessTypeList: [], //行业列表
        orgSaveRules: {
          name: [
            {required: true, message: "企业名称不能为空", trigger: "blur"},
          ],
          unifiedSocialCreditCode: [
            {
              required: true,
              message: "社会信用统一代码不能为空",
              trigger: "blur",
            },
            {
              validator: (rule, value, callback) => {
                this.CheckSocialCreditCode(rule, value, callback);
              },
              trigger: "blur",
            },
          ],
          businessType: [
            {required: true, message: "所属行业不能为空", trigger: "blur"},
          ],
          status: [
            {required: true, message: "企业状态不能为空", trigger: "blur"},
          ],
          contact: [
            {required: true, message: "联系电话不能为空", trigger: "blur"},
          ],
          email: [
            {
              type: "email",
              required: true,
              message: "联系邮件不能为空",
              trigger: "blur",
            },
          ],
          simpleAddress: [
            {required: true, message: "企业地址不能为空", trigger: "blur"},
          ],
          address: [
            {required: true, message: "详细地址不能为空", trigger: "blur"},
          ],
          expireTime: [
            {required: true, message: "过期时间不能为空", trigger: "blur"},
          ],
        },
        maxUser: 50,
      };
    },
    watch: {
      "orgSaveObj.data.simpleAddress": {
        handler(newV) {
          if (newV !== undefined) {
            this.addressData.province = newV[0];
            this.addressData.city = newV[1];
            this.addressData.prefecture = newV[2];
          }
        },
      },
    },
    props: {
      orgSaveObj: {
        editOrgAuthority: false,
        type: Object,
      },
    },
    created() {
      this.cdata = jsonData;
      this.getTypeList();
    },
    methods: {
      querySearch(str, callback) {
        this.clearNE();
        const url = "https://restapi.amap.com/v3/assistant/inputtips";
        const key = "593a113247c4ba8949221df3acbdc499";
        const addressInfo = str;
        const city = this.addressData.city;
        this.$http
          .get(`${url}?key=${key}&keywords=${addressInfo}&city=${city}`)
          .then((res) => {
            let returnArray = res.data.tips
              .filter(
                (item) => item.district.indexOf(this.addressData.prefecture) > 0
              )
              .map((item) => {
                item.key = item.name;
                item.value = item.name;
                item.fullAddress = item.district + item.address;
                item.wholeLink = item.address + " (" + item.name + ")";
                return item;
              });
            callback(returnArray);
          })
          .catch((e) => {
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
        // this.addressData.province = matchArray.groups.province
        // this.addressData.city = matchArray.groups.city
        // this.addressData.prefecture = matchArray.groups.county
        this.orgSaveObj.data.address = item.wholeLink;

        let locationArr = item.location.split(",");
        this.addressData.lng = locationArr[0];
        this.addressData.lat = locationArr[1];
      },
      getGeoXY() {
        const url = "https://restapi.amap.com/v3/geocode/geo";
        const key = "593a113247c4ba8949221df3acbdc499";
        this.$http
          .get(`${url}?key=${key}&address=${this.fullAddress()}`)
          .then((res) => {
            let locationArr = res.data.geocodes[0].location.split(",");
            this.addressData.lng = locationArr[0];
            this.addressData.lat = locationArr[1];
          });
      },
      clearNE() {
        //清除原有经纬度信息
        this.addressData.lng = "";
        this.addressData.lat = "";
      },
      //输入省市区数据时，详细地址和经纬度清空
      addrChange() {
        this.addressData.detailAddress = "";
        this.clearNE();
        this.$refs.addressDetail.$children[0].clear();
      },
      // 关闭窗口
      closeFunc(data) {
        this.orgSaveObj.data = {};
        this.orgSaveObj.show = false;
        this.$refs[data].resetFields();
      },
      // 保存 表单验证
      saveFunc(data) {
        this.$refs[data].validate((valid) => {
          if (valid) {
            this.saveSureFunc(data);
          } else {
            this.$message.error("*为必填项");
          }
        });
      },
      // 保存 提交后台
      async saveSureFunc() {
        if (!this.orgSaveObj.data.id) {
          const param = {
            pid: this.orgSaveObj.data.pid, //父集ID
            name: this.orgSaveObj.data.name, //名称
            contact: this.orgSaveObj.data.contact, //邮件
            email: this.orgSaveObj.data.email, //电话
            status: this.orgSaveObj.data.status, //企业状态[0:试用,1:正常,2:过期]
            province: this.orgSaveObj.data.simpleAddress[0], //省
            city: this.orgSaveObj.data.simpleAddress[1], //市
            district: this.orgSaveObj.data.simpleAddress[2], //区
            address: this.orgSaveObj.data.address, //详细街道地址
            longitude: this.addressData.lng, //经度
            latitude: this.addressData.lat, //纬度
            description: this.orgSaveObj.data.description, //备注
            expireTime: this.orgSaveObj.data.expireTime, //过期时间
            unifiedSocialCreditCode: this.orgSaveObj.data.unifiedSocialCreditCode, //社会信用统一代码
            businessType: this.orgSaveObj.data.businessType, //企业所属行业
            number: this.orgSaveObj.data.orgNumber,
            level: this.orgSaveObj.data.level, //层级 新增参数
            maxUser: (this.userType === 99
              && this.orgSaveObj.data.pid === 0) ? this.maxUser : undefined, //最大用户数量
          };
          await addOrg(param).then((res) => {
            if (res.data.code === 200 && res.status === 200) {
              this.orgSaveObj.data.id = res.data.data.id;
              this.$message.success("提交成功!");
              this.orgSaveObj.show = false;
              this.$emit("findOrgListFunc");
            } else {
              this.$notifyError("提交失败!", res.data.msg);
            }
          }).catch(() => {
            this.$notifyError("网络请求失败!", "");
          });
        } else {
          const param = {
            id: this.orgSaveObj.data.id, //ID
            pid: this.orgSaveObj.data.pid, //父集ID
            name: this.orgSaveObj.data.name, //名称
            contact: this.orgSaveObj.data.contact, //邮件
            email: this.orgSaveObj.data.email, //电话
            status: this.orgSaveObj.data.status, //企业状态[0:试用,1:正常,2:过期]
            province: this.orgSaveObj.data.simpleAddress[0], //省
            city: this.orgSaveObj.data.simpleAddress[1], //市
            district: this.orgSaveObj.data.simpleAddress[2], //区
            address: this.orgSaveObj.data.address, //详细街道地址
            longitude: this.addressData.lng, //经度
            latitude: this.addressData.lat, //纬度
            description: this.orgSaveObj.data.description, //备注
            expireTime: this.orgSaveObj.data.expireTime, //过期时间
            unifiedSocialCreditCode: this.orgSaveObj.data.unifiedSocialCreditCode, //社会信用统一代码
            businessType: this.orgSaveObj.data.businessType, //企业所属行业
            maxUser: (this.userType === 99
              && this.orgSaveObj.data.pid === 0) ? this.maxUser : undefined, //最大用户数量
          };
          await editOrg(param).then((res) => {
            if (res.data.code === 200 && res.status === 200) {
              this.$message.success("提交成功!");
              this.orgSaveObj.show = false;
              this.$emit("findOrgListFunc");
            } else {
              this.$notifyError("提交失败!", res.data.msg);
            }
          }).catch(() => {
            this.$notifyError("网络请求失败!", "");
          });
        }
      },
      //获取行业列表
      getTypeList() {
        getTypeList().then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            for (let type of res.data.data)
              this.businessTypeList.push({value: type.id, label: type.name});
          } else {
            this.$notifyError("获取行业列表失败!", res.data.msg);
          }
        }).catch(() => {
          this.$notifyError("网络请求失败!", "");
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
            28,
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
    },
  };
</script>

<style lang="less" scoped>
  @import "../../styles/diaForm.less";
</style>
