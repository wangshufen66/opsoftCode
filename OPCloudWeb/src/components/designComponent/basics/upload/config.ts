import { IComponent } from "../../commonCfg";
import { UploadComponent } from "./IConfig";
/**
 * 上传组件
 */
export class Upload implements IComponent {
  constructor(config?: UploadComponent) {
    config && (this.config = config);
  }

  config: UploadComponent = {
    name: "Upload",
    componentTag: "designUpload",
    __form__: {
      label: "上传文件",
      showLabel: true,
      required: false,
      span: 24,
      regList: [],
    },
    __config__: {
      icon: "upload",
      sqlType: "VARCHAR2",
      inSearch: false,
      inTable: true,
      unique: false,
      maxSize: 5,
      takeToken: true,
      inForm: true,
    },
    __mConfig__: {
      inMobile: false,
      isTitle: false,
      isSecondTitle: false,
      isTime: false,
      isStatus: false,
      isProgress: false,
      isCard: false,
      isSearch: false,
      isTableSort: false,
    },
    __attr__: {
      disabled: false,
      action: "/api/opcloud/file/upload",
      headers: {},
      multiple: false,
      data: {},
      "with-credentials": false,
      "show-file-list": true,
      drag: false,
      "list-type": "text",
      "auto-upload": true,
      limit: 9,
      accept: "",
    },
  };

  verifyConfig(): string {
    const config = this.config;
    let verify = `<strong>${config.__form__?.label || config.__vModel__
      }：</strong><br/>`;
    let message = "";
    const { maxSize } = config.__config__;
    if (maxSize) {
      /^(?!0)\d+(.\d{1,2})?$/g.test(String(maxSize)) &&
        maxSize > 5 &&
        (message += `最大文件大小为5Mb,只能设置数值<br/>`);
    }
    if (config.__attr__.accept?.length === 0) {
      message += `请设置上传文件的允许类型<br/>`;
    }
    message && (message = verify + message);
    return message;
  }
}

// 标准组件初始配置
export const defaultConfig = new Upload();
