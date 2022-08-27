import { ref } from "vue";
import { messageAlert } from "@/utils/utils";

export default function useSubmit(pageData, BuzApi, tableOption) {
  const addPageRef = ref<any>(null);
  const submit = () => {
    return new Promise((resolve, reject) => {
      addPageRef.value.validate(async (valid: boolean) => {
        if (!valid) {
          return;
        } else if (
          pageData.formData.reportQty < pageData.formData.unqualifiedQty
        ) {
          messageAlert("error", "不良数量之和需小于汇报数量");
          return;
        } else {
          const postParam = { ...pageData.formData };
          delete postParam.couldStartQty;
          var res = await BuzApi.Save(postParam);
          if (res.code == 200) {
            messageAlert("success", "保存成功");
            resolve(true);
          } else {
            messageAlert("error", res.msg);
          }
        }
      });
    });
  };
  return {
    addPageRef,
    submit,
  };
}
