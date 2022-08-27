<template>
  <div class="template-main">
    <!-- 设计面板 -->
    <div id="hiprint-printTemplate" class="hiprint-printTemplate"></div>
    <div class="hinnn-layout-sider">
      <div id="printElementOptionSetting"></div>
    </div>
    <div class="params_wrap" id="params_content"></div>
    <!-- <el-drawer
      class="params_drawer"
      :modal="true"
      :wrapperClosable="true"
      @opened="onParamsOpened"
      v-model="paramsDrawerStatus"
      direction="rtl"
      :size="450"
    >
      <template v-slot:title>
        <dialog-title title="参数设置"></dialog-title>
      </template>
      <div id="params_content" v-show="paramsDrawerStatus"></div>
    </el-drawer>-->
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, inject } from 'vue';
import '@/plugins/hiprint/css/hiprint.css';
import '@/plugins/hiprint/css/print-lock.css';
import '@/plugins/hiprint/plugins/jquery.minicolors.min.js';
import { hiprint } from '@/plugins/hiprint/hiprint.bundle.js';
// import '@/plugins/hiprint/plugins/qrcode.js';
import '@/plugins/hiprint/plugins/JsBarcode.all.min.js';
import { defaultElementTypeProvider } from '@/plugins/hiprint/etypes/default-etype-provider.js'
import { customPrintJson } from '@/plugins/hiprint/custom_test/custom-print-json.js';
import useEmitter from "@/use/useEitter";
import { messageAlert } from '@/utils/utils';
import { PaperType } from './type';
import type { Rect } from './type';

// 事件定义
useEmitter([
  { key: 'set-print-template-papersize', value: setPaper },
  { key: 'set-print-template-rotatepape', value: rotatePaper },
  { key: 'clear-print-template', value: clearTemplate },
  { key: 'on-test-print', value: onTestPrint }
])

const parent: any = inject('print-template', {});

let hiprintTemplate: any = undefined;

const paperMap = {
  [PaperType.A3]: {
    width: 420,
    height: 296.6
  },
  [PaperType.A4]: {
    width: 210,
    height: 296.6
  },
  [PaperType.A5]: {
    width: 210,
    height: 147.6
  },
  [PaperType.B3]: {
    width: 500,
    height: 352.6
  },
  [PaperType.B4]: {
    width: 250,
    height: 352.6
  },
  [PaperType.B5]: {
    width: 250,
    height: 175.6
  }
}

const previewDialogStatus = ref<boolean>(false);

const paramsDrawerStatus = ref<boolean>(false);

const currentPaper = reactive<Rect>({
  width: undefined,
  height: undefined
})


function setPaper({ type, rect }) {
  let width, height;
  try {
    if (type === PaperType.CUSTOM) {
      width = rect.width;
      height = rect.height;
      if (rect.width && rect.height) {
        hiprintTemplate.setPaper(width, height);
        setCurrentPaper({ width, height })
      }
    } else {
      const range = paperMap[type];
      width = range.width;
      height = range.height;
      hiprintTemplate.setPaper(width, height);
      setCurrentPaper(paperMap[type])
    }
    parent.currentPaperType.value = type;
  } catch (error) {
    messageAlert('error', '操作失败:' + error)
  }
}

function setCurrentPaper(rect: Rect) {
  currentPaper.width = rect.width;
  currentPaper.height = rect.height
}

function rotatePaper() {
  try {
    hiprintTemplate.rotatePaper();
  } catch (error) {
    messageAlert('error', '操作失败:' + error)
  }
}
/**清空 */
function clearTemplate() {
  try {
    hiprintTemplate.clear();
  } catch (error) {
    messageAlert('error', '操作失败:' + error)
  }
}

function onParamsOpened() {
  $('#params_content').append($('#printElementOptionSetting'))
}

function handlePreviewOpened() {
  hiprintTemplate && hiprintTemplate.print({
    name: 'luhuiming',
    age: 30
  });
}

// function printTemplate(printData: any) {
//   hiprintTemplate && hiprintTemplate.print(printData);
// }

function elementAddEventListen() {
  window.hinnn.event.on(hiprintTemplate.getPrintElementSelectEventKey(), (t) => {
    paramsDrawerStatus.value = true
  })
}

function onTestPrint() {
  const list: any = [];
  for (let i = 1; i < 100; i++) {
    list.push({ id: i, name: 'name', age: 28 })
  }
  hiprintTemplate.print([{
    name: 'luhuiming',
    age: 30,
    logo: 'http://192.168.0.202:7000/default/69dff8b6-df6c-4d57-b0b9-a4f2797c5982.png',
    tableList: list
  }, {
    name: 'luhuiming2',
    age: 300,
    logo: 'http://192.168.0.202:7000/default/69dff8b6-df6c-4d57-b0b9-a4f2797c5982.png',
    tableList: list
  }])
}

onMounted(() => {
  //初始化打印插件
  hiprint && hiprint.init({
    providers: [defaultElementTypeProvider()]
  });
  //设置左侧拖拽事件
  hiprint && hiprint.PrintElementTypeManager.buildByHtml($('.ep-draggable-item'));
  hiprintTemplate = new hiprint.PrintTemplate({
    template: customPrintJson,
    settingContainer: '#printElementOptionSetting',
  });
  //打印设计
  hiprintTemplate && hiprintTemplate.design('#hiprint-printTemplate');
  // 清楚默认模板
  hiprintTemplate.clear();
  setCurrentPaper(paperMap[PaperType.A4]);
  elementAddEventListen();

  hiprintTemplate.setFields([
    { field: 'name', text: '名字' },
    { field: 'age', text: '年龄' },
    { field: 'logo', text: 'LOGO' },
    { field: 'tableList', text: '员工数据' }
  ])
})

</script>

<style lang="scss" scoped>
@import "@/styles/modules/printTemplate/main.scss";
</style>