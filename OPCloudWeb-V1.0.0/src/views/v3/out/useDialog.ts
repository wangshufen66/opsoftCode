import { reactive, ref, onMounted, nextTick } from "vue";

export default function useDialog(param) {
  const { _show, _param, _onConfirm, _hide } = param;

  const reactiveData = reactive({
    visible: false,
    param: _param,
  });

  const _innerRef = ref(null);

  const func = {
    show: (arg) => {
      _show && _show(arg);
      reactiveData.visible = true;
    },
    hide: () => {
      _hide && _hide();
      reactiveData.visible = false;
    },
    onConfirm: (rows) => {
      console.log(rows,'===onConfirm====')
      _onConfirm(rows);
    },
  };

  return {
    reactiveData,
    innerRef: _innerRef,
    ...func,
  };
}
