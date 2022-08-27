<template>
  <div class="template-main">
    <div class="header">
      <el-button-group>
        <el-button
          :type="currentPaperType === PaperType.A3 ? 'primary' : 'info'"
          @click="setPaper(PaperType.A3)"
        >A3</el-button>
        <el-button
          :type="currentPaperType === PaperType.A4 ? 'primary' : 'info'"
          @click="setPaper(PaperType.A4)"
        >A4</el-button>
        <el-button
          :type="currentPaperType === PaperType.A5 ? 'primary' : 'info'"
          @click="setPaper(PaperType.A5)"
        >A5</el-button>
        <el-button
          :type="currentPaperType === PaperType.B3 ? 'primary' : 'info'"
          @click="setPaper(PaperType.B3)"
        >B3</el-button>
        <el-button
          :type="currentPaperType === PaperType.B4 ? 'primary' : 'info'"
          @click="setPaper(PaperType.B4)"
        >B4</el-button>
        <el-button
          :type="currentPaperType === PaperType.B5 ? 'primary' : 'info'"
          @click="setPaper(PaperType.B5)"
        >B5</el-button>
      </el-button-group>
      <el-popover placement="bottom" title="请输入自定义纸张宽高" trigger="click" width="400px">
        <el-form ref="otherPaperForm" label-position="left" :model="otherPaper" label-width="30px">
          <el-row>
            <el-col :span="16">
              <el-form-item label="宽">
                <el-input v-model="otherPaper.width">
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="高">
                <el-input v-model="otherPaper.height">
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="setPaper(PaperType.CUSTOM)">确定</el-button>
            <el-button @click="clearPaper(PaperType.CUSTOM)">清空</el-button>
          </el-form-item>
        </el-form>
        <template #reference>
          <el-button
            slot="reference"
            :type="currentPaperType === PaperType.CUSTOM ? 'primary' : 'info'"
          >自定义纸张</el-button>
        </template>
      </el-popover>
      <el-button-group>
        <el-button type="info" icon="el-icon-refresh-right" @click="rotatePaper">旋转</el-button>
        <el-button type="info" icon="el-icon-delete" @click="clearTemplate">清空</el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="info" icon="el-icon-printer" @click="printTemplate(printData)">打印</el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="info" icon="el-icon-view" @click="previewTemplate">预览</el-button>
        <el-button type="info" icon="el-icon-save" @click="saveConfig">保存</el-button>
      </el-button-group>
    </div>
    <!-- 设计面板 -->
    <div id="hiprint-printTemplate" class="hiprint-printTemplate"></div>
    <div class="hinnn-layout-sider">
      <div id="PrintElementOptionSetting"></div>
    </div>
    <div class="fixedDialog">
      <el-drawer
        class="params_drawer"
        :modal="true"
        :wrapperClosable="true"
        @opened="handleParamsOpened"
        v-model="paramsDrawerStatus"
        direction="rtl"
        :size="450"
      >
        <template v-slot:title>
          <dialog-title :title="`${paramsTitle}-参数设置`"></dialog-title>
        </template>
        <div id="params_content"></div>
      </el-drawer>
    </div>
    <el-dialog
      :modelValue="previewDialogStatus"
      title="预览"
      @opened="handlePreviewOpened(printData)"
      width="70%"
    >
      <div id="preview_content"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewDialogStatus = false">取 消</el-button>
        <el-button type="primary" @click="previewDialogStatus = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import '@/plugins/hiprint/css/hiprint.css';
import '@/plugins/hiprint/css/print-lock.css';
import '@/plugins/hiprint/polyfill.min.js';
import '@/plugins/hiprint/plugins/jquery.minicolors.min.js';
import { hiprint } from '@/plugins/hiprint/hiprint.bundle.js';
import '@/plugins/hiprint/plugins/jquery.hiwprint.js';
// import '@/plugins/hiprint/plugins/qrcode.js';
import '@/plugins/hiprint/plugins/JsBarcode.all.min.js';
import { defaultElementTypeProvider } from '@/plugins/hiprint/etypes/default-etype-provider.js'
import { printData } from '@/plugins/hiprint/custom_test/print-data.js';
import { customPrintJson } from '@/plugins/hiprint/custom_test/custom-print-json.js';
import { messageAlert } from '@/utils/utils';


/**打印纸张类型 */
enum PaperType {
  A3 = 1,
  A4 = 2,
  A5 = 3,
  B3 = 4,
  B4 = 5,
  B5 = 6,
  /**自定义 */
  CUSTOM = 99
}

type Rect = {
  width?: string | number,
  height?: string | number
}

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

const currentPaperType = ref<PaperType>(PaperType.A4);

const previewDialogStatus = ref<boolean>(false);

const paramsTitle = ref<string>('');

const paramsDrawerStatus = ref<boolean>(false);

const currentPaper = reactive<Rect>({
  width: undefined,
  height: undefined
})

const otherPaper = reactive<Rect>({
  width: undefined,
  height: undefined
})


function setPaper(type: PaperType) {
  try {
    if (type === PaperType.CUSTOM) {
      if (otherPaper.width && otherPaper.height) {
        const { width, height } = otherPaper
        hiprintTemplate.setPaper(width, height);
        setCurrentPaper({ width: width, height: height })
      }
    } else {
      hiprintTemplate.setPaper(type, null);
      setCurrentPaper(paperMap[type])
      otherPaper.width = undefined;
      otherPaper.height = undefined
    }
  } catch (error) {
    messageAlert('error', '操作失败:' + error)
  }
}

function clearPaper(type: PaperType) {
  otherPaper.width = undefined;
  otherPaper.height = undefined
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

function previewTemplate() {
  previewDialogStatus.value = true;
}

function handleParamsOpened() {
  $('#params_content').append($('#PrintElementOptionSetting'))
}

function handlePreviewOpened() {

}

function printTemplate(printData: any) {
  hiprintTemplate && hiprintTemplate.print(printData);
}

function elementAddEventListen() {
  window.hinnn.event.on(hiprintTemplate.getPrintElementSelectEventKey(), (t) => {
    paramsTitle.value = t.printElement.printElementType.title
    paramsDrawerStatus.value = true
  })
}

function saveConfig() {

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
    settingContainer: '#PrintElementOptionSetting',
    paginationContainer: '.hiprint-printPagination'
  });
  //打印设计
  hiprintTemplate && hiprintTemplate.design('#hiprint-printTemplate');
  setCurrentPaper(paperMap[PaperType.A4]);
  elementAddEventListen();
})

</script>

<style lang="scss" scoped>
@import "@/styles/modules/printTemplate/main.scss";
</style>