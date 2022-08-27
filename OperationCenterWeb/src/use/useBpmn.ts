import BpmnModeler from "bpmn-js/lib/Modeler";
// 工具栏相关
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
// import propertiesPanelModule from 'bpmn-js-properties-panel';
import flowableModdle from "@/components/bpmn/flowable.json";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";

export default function useBpmn(
  canvas: any,
  zhcnTransform?: any
  // templateStr: any,
  // propertiesDom?: string,
  // bpmnElement?:any
) {
  const bpmn = {
    modeler: undefined,
    operElement: undefined,
    beforeCallBack: (): any => {},
    eventCallBack: (event) => {
      console.log("event", event);
    },
  };
  const store = useStore();
  //流程根节点
  let baseElement: any = undefined;

  function init(str) {
    // 将汉化包装成一个模块
    const customTranslateModule = zhcnTransform && {
      translate: ["value", zhcnTransform],
    };
    const options: any = {};
    // 设置bpmn的绘图容器为上门获取的画布 element
    options.container = canvas.value;
    // 加入工具栏支持
    // propertiesDom && (options.propertiesPanel = { parent: propertiesDom });
    options.additionalModules = [
      // 工具栏模块
      // propertiesProviderModule,
      // propertiesPanelModule,
      // 汉化模块
      customTranslateModule,
    ];
    options.moddleExtensions = { flowable: flowableModdle };
    bpmn.modeler = new BpmnModeler(options);

    //查看所有支持绑定的事件
    // let eventBus = bpmn.modeler?.get('eventBus')
    // console.log('eventBus', eventBus);

    // 事件定义
    bindNodeEvent();
    openModel(str);
  }

  /**
   * 下载bpmn
   * @param {Element} downEl
   */
  function downloadBpmn(downEl: Element) {
    bpmn.modeler?.saveXML({ format: true }).then((res) => {
      const { xml } = res;
      // 获取文件名
      const name = `${getFilename(xml)}.bpmn`;
      // 将文件名以及数据交给下载方法
      download(name, xml, downEl);
    });
  }

  // 获取打开模型前的模型key、模型名称、模型描述
  const getDetail = () => {
    if (!bpmn.operElement) return;
    const documentations = baseElement.businessObject.documentation;
    const key = baseElement?.id;
    const name = baseElement?.businessObject.name;
    const text =
      documentations && documentations.length > 0 ? documentations[0].text : "";
    return {
      documentations: text,
      key,
      name,
    };
  };

  /**
   * 打开BPMN文件
   * @param {*} file
   * @return {*}  {boolean}
   */
  function openBpmn(file: any): boolean {
    const reader = new FileReader();
    // 读取File对象中的文本信息，编码格式为UTF-8
    reader.readAsText(file, "utf-8");

    reader.onload = () => {
      //获取原有的模型key、模型名称、模型描述
      const obj = getDetail();
      /**
       *用已有的模型key等信息替换导入的信息
       */
      //ts报错解除
      if (typeof reader.result !== "string") return;
      //判断是否没有填写描述信息
      const flag = /<bpmn2:documentation \/>/.test(reader.result);
      let tempStr = "";
      if (flag) {
        tempStr = reader.result?.replace(
          /(.+<bpmn2:process id=").*?(" name=").*?(".+)(<bpmn2:documentation \/>)(.+)/s,
          `$1${obj?.key}$2${obj?.name}$3<bpmn2:documentation>${
            obj?.documentations ?? ""
          }</bpmn2:documentation>$5`
        );
      } else {
        tempStr = reader.result?.replace(
          /(.+<bpmn2:process id=").*?(" name=").*?(".+<bpmn2:documentation>).*(<\/bpmn2:documentation>.+)/s,
          `$1${obj?.key}$2${obj?.name}$3${obj?.documentations ?? ""}$4`
        );
      }
      //读取完毕后将文本信息导入到Bpmn建模器
      openModel(<string>tempStr);
    };
    return false;
  }

  /**
   * 打开模型
   */
  function openModel(template?: string) {
    try {
      bpmn.modeler?.importXML(template);
    } catch (e) {
      ElMessage({
        type: "error",
        showClose: true,
        message: "打开模型出错,请确认该模型符合Bpmn2.0规范",
        duration: 1500,
      });
    }
  }

  /**
   * 获取流程配置
   */
  function getBpmnData(): Promise<any> {
    // console.log(bpmn.modeler);
    return bpmn.modeler?.saveXML({ format: true });
  }

  function getFilename(xml: string): string {
    let start = xml.indexOf("process");
    let filename = xml.substr(start, xml.indexOf(">"));
    filename = filename.substr(filename.indexOf("id") + 4);
    filename = filename.substr(0, filename.indexOf('"'));
    return filename;
  }

  function getProcess() {
    const element = bpmn.modeler?.getDefinitions().rootElements[0];
    return {
      id: element.id,
      name: element.name,
      category: element.$parent.targetNamespace,
      description: element.documentation ? element.documentation[0].text : "",
    };
  }

  function download(name: string = "diagram.bpmn", data: string, downEl: any) {
    // 把数据转换为URI，下载要用到的
    const encodedData = encodeURIComponent(data);
    if (data) {
      // 将数据给到链接
      downEl.href = "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
      // 设置文件名
      downEl.download = name;
      // 触发点击事件开始下载
      downEl.click();
    }
  }

  // 绑定节点事件
  function bindNodeEvent() {
    // console.log('bpmn.modeler', bpmn.modeler);
    //节点添加
    bpmn.modeler?.on("root.added", (e) => {
      if (e.element.type === "bpmn:Process") {
        bpmn.operElement = e.element;
        baseElement = e.element;
      }
      bpmn.eventCallBack.call(e, e.element);
    });
    //点击背景显示流程内容
    bpmn.modeler?.on("element.click", (e) => {
      let res = bpmn.beforeCallBack.call(e);
      if (!res) {
        ElMessage.error("请确认输入的值符合规范");
        return;
      }
      if (e.element.type === "bpmn:Process") {
        baseElement = e.element;
      }
      bpmn.operElement = e.element;
      bpmn.eventCallBack.call(e, e.element);
    });
    //变更选中节点解决新增事件工具栏不变化问题
    bpmn.modeler?.on("selection.changed", (e) => {
      if (!bpmn.operElement) return;
      let res = bpmn.beforeCallBack.call(e);
      if (!res) return;
      // hack 同类型面板不刷新
      bpmn.operElement = undefined;
      const el = e.newSelection[0];
      if (el) {
        bpmn.operElement = el;
      }
      bpmn.eventCallBack.call(e, el);
    });
    //元素双击编辑
    bpmn.modeler?.on("element.dblclick", (e) => {
      let res = bpmn.beforeCallBack.call(e);
      if (!res) {
        ElMessage.error("请确认输入的值符合规范");
        return;
      }
      if (e.element.type !== "bpmn:Process") {
        bpmn.operElement = e.element;
        bpmn.eventCallBack.call(e, e.element);
      }
    });
    //删除元素的时候选中流程
    bpmn.modeler?.on("shape.removed", (e) => {
      // let res = bpmn.beforeCallBack.call(e);
      // if (!res) {
      //   return
      // }
      bpmn.operElement = baseElement;
      bpmn.eventCallBack.call(e, baseElement);
    });
    //节点移动
    bpmn.modeler?.on("shape.move.end", (e) => {
      store.commit("flowable/setEditStatus", true);
      let res = bpmn.beforeCallBack.call(e);
      if (!res) {
        return;
      }
      bpmn.operElement = e.shape;
      bpmn.eventCallBack.call(e, e.shape);
    });
    //流程线改变
    bpmn.modeler?.on("connection.changed", (e) => {
      // let res = bpmn.beforeCallBack.call(e);
      // if (!res) {
      //   return
      // }
      // bpmn.operElement = e.element;
      // bpmn.eventCallBack.call(e,  e.element);
    });
  }

  return {
    bpmn,
    init,
    downloadBpmn,
    openBpmn,
    getBpmnData,
    getProcess,
  };
}
