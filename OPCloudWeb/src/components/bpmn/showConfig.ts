export default {
  //流程显示菜单
  'bpmn:Process': {
    processCategory: true,
    //候选配置
    candidate: true,
    //可发起者
    candidateStarterUsers: true,
    //可发起组
    candidateStarterGroups: true,
  },
  //开始事件显示菜单
  'bpmn:StartEvent': {
    form: true,
    formKey: true,
    candidate: true,
    initiator: true
  },
  //结束事件显示菜单
  'bpmn:EndEvent': {
  },
  //用户任务显示菜单
  'bpmn:UserTask': {
    // taskCategory: true,
    candidate: true,
    assignee: true,
    candidateUsers: true,
    candidateGroups: true,
    // async: true,
    // priority: true,
    // skipExpression: true,
    // dueDate: true,
    form: true,
    formKey: true,
    buttons: true,
    multiInstance: true,
    taskListener: true
  },
  'bpmn:ServiceTask': {
    // scriptConfig: true,
    // scriptType:true,
    // scriptContent:true
  },
  'bpmn:Task': {
    // async: true,
    // skipExpression: true,
    // isForCompensation: true,
    // triggerable: true,
    // class: true,
    // candidate: true,
    // form: true,
  },
  'bpmn:ScriptTask': {
    scriptConfig: true,
    scriptType: true,
    scriptContent: true
  },
  'bpmn:ManualTask': {
    // async: true,
    // isForCompensation: true,
  },
  'bpmn:ReceiveTask': {
    // async: true,
    // isForCompensation: true,
  },
  'bpmn:SendTask': {
    // async: true,
    // isForCompensation: true
  },
  'bpmn:BusinessRuleTask': {
    // async: true,
    // isForCompensation: true,
    // ruleVariablesInput: true,
    // rules: true,
    // resultVariable: true,
    // exclude: true,
  },
  'bpmn:SubProcess': {
    // async: true,
    // isForCompensation: true,
    // ruleVariablesInput: true,
    // rules: true,
    // resultVariable: true,
    // exclude: true,
    multiInstance: true,
  },
  'bpmn2:intermediateThrowEvent': {
  },
  'bpmn:SequenceFlow': {
    conditionExpression: true
  }
}
