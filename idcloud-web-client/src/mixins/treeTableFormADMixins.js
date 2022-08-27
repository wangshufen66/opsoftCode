import IdButtonConfig from "@/components/id-button/IdButtonConfig";
export default {
  methods:{
    //统一处理弹窗组件问题
    handleInputPopup(classKey, id, number, name) {
      const cIndex = this.tableDetailForm.idForm.component.findIndex(
        (cItem) => cItem.classKey === classKey
      );
      this.tableDetailForm.idForm.component[cIndex].id = id;
      this.tableDetailForm.idForm.component[cIndex].number = number;
      this.tableDetailForm.idForm.component[cIndex].name = name;
    },
    //统一处理获取数据时的组件状态（根据审核\禁用状态）
    handleCompDisable(auditStatus, isDisable) {
      if (auditStatus === '0' && isDisable === 'false') {
        this.tableDetailForm.idForm.component.forEach((cItem) => cItem.idDisable = !!cItem.freeze);
      } else {
        this.tableDetailForm.idForm.component.forEach((cItem) => cItem.idDisable = true);
      }
    },
    //统一处理表单工具条展示问题
    handleBarFormConfig(auditStatus, isDisable) {
      if (this.tableDetailForm.idForm.data.id) {
        this.actionBarFormConfig = [
          new IdButtonConfig("button-add", "提交", "form-commit",
            {
              type: 'primary',
              idDisable: auditStatus === '1' || isDisable === 'true',
            }),
          {
            tag: "id-group-button",
            classKey: "create",
            childButton: [
              {
                text: "新建",
                target: "form-create",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable:false,
              },
              {
                text: "复制",
                target: "form-copy",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable:false,
              },
            ],
          },
          {
            tag: "id-group-button",
            classKey: "sheet",
            childButton: [
              {
                text: "上页",
                target: "form-previous",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable:false,
              },
              {
                text: "下页",
                target: "form-next",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable:false,
              },
            ],
          },
          {
            tag: "id-dropdown",
            text: "审核",
            childButton: [
              {
                text: "审核",
                target: "form-audit",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: auditStatus === '1' || isDisable === 'true',
              },
              {
                text: "反审核",
                target: "form-antiAudit",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: auditStatus === '0' || isDisable === 'true',
              },
            ],
          },
          {
            tag: "id-dropdown",
            text: "禁用",
            childButton: [
              {
                text: "禁用",
                target: "form-disable",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: auditStatus === '0' || isDisable === 'true',
              },
              {
                text: "反禁用",
                target: "form-antiDisable",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: auditStatus === '0' || isDisable === 'false',
              },
            ],
          },
          new IdButtonConfig("button-delete", "删除", "form-delete", {
            styleOne: true,
            idDisable: auditStatus === '1' || isDisable === 'true',
          }),
        ];
      } else {
        this.actionBarFormConfig = [
          new IdButtonConfig("button-add", "提交", "form-commit", {type: 'primary'}),
          new IdButtonConfig("button-create", "重置", "form-create", {styleOne: true}),
        ];
      }
    },
    //统一处理表单的弹窗问题
    beforeLeave() {
      this.tableDetailForm.idForm.component.forEach((cItem) => {
        if (cItem.tag === 'id-input-popup') {
          cItem.controlTooltipShow = false;
        }
      });
      this.$nextTick(() => {
        this.tableDetailForm.idForm.component.forEach((cItem) => {
          if (cItem.tag === 'id-input-popup') {
            cItem.controlTooltipShow = true;
          }
        });
      });
    },
  }
}
