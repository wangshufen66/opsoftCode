<template>
  <div>
    <el-dropdown placement="bottom-end" @command="handleClick">
      <span>
        {{ userOrgName }} - {{ userAccount }}
        <i class="el-icon-caret-bottom"></i>
      </span>
      <el-dropdown-menu slot="dropdown" class="user-dropdown-menu">
        <el-dropdown-item v-if="userType === 2" command="change">切换组织
        </el-dropdown-item>
        <el-dropdown-item command="reset">修改密码</el-dropdown-item>
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <password :passwordObj="passwordSaveObj"></password>
    <changeOrg :orgChangeObj="orgChangeObj" @confirmChangeOrg="confirmChangeOrg"></changeOrg>
  </div>
</template>
<style lang="less" scoped>
@import './user.less';
</style>
<script>
import { updatePassword } from '@/api/auth';
import { mapActions } from 'vuex';
import password from '@/components/diaForm/editPassword';
import changeOrg from '@/components/diaForm/changeOrg';
import { getUserManagedOrg } from '@/api/systemManagement/org';
import { setToken } from '@/libs/util';

export default {
  name: 'User',
  computed: {
    userType() {
      return this.$store.state.user.userInfo.type;
    },
    userOrgName() {
      return this.$store.state.user.userInfo.orgName;
    },
  },
  components: {
    password,
    changeOrg,
  },
  data() {
    return {
      //切换组织相关
      orgChangeObj: {
        show: false,
        title: '切换组织',
        data: {},
      },
      passwordSaveObj: {
        show: false,
        title: '修改密码',
        data: {},
      },
      editUserObj: {
        show: false,
        title: '修改账号信息',
        data: {},
      },
      user_level: '',
    };
  },
  props: {
    userAvatar: {
      type: String,
      default: '',
    },
    userAccount: {
      type: String,
      default: '',
    },
  },
  created() {
    this.user_level = this.$store.state.user.userInfo.user_level;
  },
  mounted() {},
  methods: {
    ...mapActions(['setUserInfo']),
    async logout() {
      await this.$emit('closeAllOpenedRouter');
      await setToken('');
      await this.$router.push({
        name: 'login',
      });
    },
    handleClick(name) {
      switch (name) {
        case 'logout':
          this.logout();
          break;
        case 'reset':
          this.resetpwFunc();
          break;
        case 'change':
          this.getOrgListFunc();
          break;
      }
    },
    /* 修改密码 */
    resetpwFunc() {
      this.passwordSaveObj.data = {
        id: this.$store.state.user.userInfo.id,
        account: this.$store.state.user.userInfo.account,
        oldPassword: null,
        password: null,
        passwordConfirm: null,
      };
      this.passwordSaveObj.show = true;
    },
    //切换组织  获取企业列表
    async getOrgListFunc() {
      await getUserManagedOrg({
        userId: this.$store.state.user.userInfo.id,
      })
        .then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            res.data.data.forEach((item) => {
              item.label = item.name;
              item.value = item.id;
            });
            this.orgList = res.data.data;
            let data = {
              rawdata: res.data.data,
              children: [],
              parent: [],
              expand: true,
            };
            // data.children
            data.children = this.$utils.toTreeChildrenFunc(res.data.data, 'id');
            // data.parent
            data.parent = this.$utils.toTreeParentFunc(res.data.data, 'pid');
            this.orgChangeObj.data.orgOptions =
              this.$utils.toTreeDataFunc(data);
            let level = 0;
            //此方法很傻逼 哈哈哈哈  应修改为递归
            this.orgChangeObj.data.orgOptions.forEach((item) => {
              if (item.children !== undefined) {
                for (let item2 of item.children) {
                  if (item2.children !== undefined) {
                    for (let item3 of item2.children) {
                      if (item3.children !== undefined) {
                        for (let item4 of item3.children) {
                          if (item4.children !== undefined) {
                            level = 5;
                          } else {
                            if (level < 4) level = 4;
                          }
                        }
                      } else {
                        if (level < 3) level = 3;
                      }
                    }
                  } else {
                    if (level < 2) level = 2;
                  }
                }
              } else {
                if (level < 1) level = 1;
              }
            });
            if (level < 2) level = 2;
            this.orgChangeObj.width = 180 * level + 42 + 'px';
            this.orgChangeObj.data.orgId =
              this.$store.state.user.userInfo.orgId;
          } else {
            // 操作成功回调
            this.$notifyError('获取企业列表失败', res.data.msg);
          }
        })
        .finally(() => {
          this.orgChangeObj.show = true;
        });
    },
    //确认切换组织
    confirmChangeOrg() {
      if (
        this.orgChangeObj.data.orgId === this.$store.state.user.userInfo.orgId
      ) {
        this.orgChangeObj.show = false;
        return;
      }
      this.$store.state.user.userInfo.orgId = this.orgChangeObj.data.orgId;
      this.$store.state.user.userInfo.orgName =
        this.orgList[
          this.orgList.findIndex(
            (item) => item.id === this.$store.state.user.userInfo.orgId
          )
        ].name;
      this.orgName =
        this.orgList[
          this.orgList.findIndex(
            (item) => item.id === this.$store.state.user.userInfo.orgId
          )
        ].name;
      sessionStorage.setItem(
        this.$store.state.user.token + 'changeOrgId',
        this.$store.state.user.userInfo.orgId
      );
      sessionStorage.setItem(
        this.$store.state.user.token + 'changeOrgName',
        this.$store.state.user.userInfo.orgName
      );
      sessionStorage.setItem(
        this.$store.state.user.token + 'changeOrgNumber',
        this.$store.state.user.userInfo.orgNumber
      );
      this.orgChangeObj.show = false;
      this.closeAllOpenedRouter();
      this.$router.go(0); //强制刷新浏览器
    },
  },
};
</script>
