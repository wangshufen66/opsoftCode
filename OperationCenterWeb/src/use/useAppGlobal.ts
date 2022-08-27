import { nextTick, onMounted, onUnmounted, reactive } from 'vue';
import { Router } from 'vue-router';
import { getStorage, getToken, setStorage } from '@/utils/utils';
import { refreshToken } from '@/api/system';

/**
 * 全局处理
 * @param Router
 * @export
 */
export function useAppGlobal(router: Router) {

  /**
   * 接口地址设置
   * @type {*}
   */
  const apiAddress = reactive({
    dialogVisible: false,
    address: '',
  });

  function setApiAddress() {
    apiAddress.dialogVisible = true;
    nextTick(() => {
      apiAddress.address = getStorage('api-address');
    });
  }

  function onSubmitApiAddress() {
    setStorage('api-address', apiAddress.address);
    apiAddress.dialogVisible = false;
  }
  /**
   * 按键事件
   * @param e
   */
  function keydownHandler(e) {
    var keyCode = e.keyCode || e.which || e.charCode;
    var altKey = e.altKey;
    if (altKey && keyCode == 80) {
      apiAddress.dialogVisible = true;
    }
  }
  /**
   * 当用户token还有五分钟过期时，执行token刷新
   */
  function refreshUserToken() {
    const newTimestamp = +new Date();
    const accessTokenObj = getStorage('accessToken');
    const userInfo = getToken('user');

    const refresh = async () => {
      const res = await refreshToken({
        grantType: 'password',
        refreshToken: userInfo.value.refresh_token,
      });
      if (res.code == 200) {
      }
    };
    const { expirse } = accessTokenObj;
    if (expirse > newTimestamp) {
      const eff = expirse - newTimestamp;
      if (eff <= 5 * 60 * 1000) {
        refresh();
      } else {
        setTimeout(() => {
          refresh();
        }, eff);
      }
    }
  }

  onMounted(() => {
    window.addEventListener('onSetApiAddress', setApiAddress, false);
    document.onkeydown = (e) => keydownHandler(e);

  });

  onUnmounted(() => {
    window.removeEventListener('onSetApiAddress', setApiAddress, false);
  });

  return {
    apiAddress,
    onSubmitApiAddress,
  };
}
