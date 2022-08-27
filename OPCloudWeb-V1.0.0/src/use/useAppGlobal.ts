import { nextTick, reactive } from "vue";
import { useStore } from "vuex";
import { getStorage, getToken, setStorage } from "@/utils/utils";
import { refreshToken } from "@/api/userApi/index";
import { getByOrgId } from "@/api/system";
import { createWaterMark } from "@/utils/watermark";

/**
 * 全局处理
 * @param Router
 * @export
 */
export function useAppGlobal() {
  const store = useStore();

  const waterMark = {
    orgId: "",
    title: "",
    color: "",
    content: "",
    isHidden: 1, //是否隐藏
    id: undefined,
  };

  /**
   * 接口地址设置
   * @type {*}
   */
  const apiAddress = reactive({
    dialogVisible: false,
    address: "",
  });

  /**
   * 设置API地址
   */
  function setApiAddress() {
    apiAddress.dialogVisible = true;
    nextTick(() => {
      apiAddress.address = getStorage("api-address");
    });
  }

  /**
   * 设置API地址
   */
  function onSubmitApiAddress() {
    setStorage("api-address", apiAddress.address);
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
    let accessTokenObj = undefined;
    if (getToken("accessToken")) {
      accessTokenObj = getStorage("accessToken");
    }
    const userInfo = getToken("user");
    const refresh = async () => {
      const res = await refreshToken({
        grant_type: "refresh_token",
        refresh_token: userInfo.refresh_token,
        client_id: "opcloud",
        client_secret: 1,
      });
      if (res.code == 200) {
      }
    };
    if (accessTokenObj) {
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
  }

  /**
   * 生成页面水印
   */
  async function drawSystemWater() {
    const res = await getByOrgId();
    if (res.code === 200) {
      const { id, orgId, title, content, color, isHidden } = res.data;
      if (res.data) {
        waterMark.id = id;
        waterMark.orgId = orgId;
        waterMark.title = title;
        waterMark.content = content;
        waterMark.color = color;
        waterMark.isHidden = isHidden;
        store.commit("comm/setWaterMark", { ...waterMark });
        if (res.data.isHidden) {
          createWaterMark(undefined, "", "", "");
        } else {
          createWaterMark(
            undefined,
            waterMark.title,
            waterMark.content,
            waterMark.color
          );
        }
      } else {
        store.commit("comm/setWaterMark", undefined);
        createWaterMark(undefined, "", "", "");
      }
    }
  }

  // onMounted(() => {
  //   // refreshUserToken();
  //   window.addEventListener("onSetApiAddress", setApiAddress, false);
  //   document.onkeydown = (e) => keydownHandler(e);
  // });

  // onUnmounted(() => {
  //   window.removeEventListener("onSetApiAddress", setApiAddress, false);
  // });

  return {
    apiAddress,
    onSubmitApiAddress,
    refreshUserToken,
    drawSystemWater,
  };
}
