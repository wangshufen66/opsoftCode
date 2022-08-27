import { computed } from 'vue';
export default (bpmn, descriptor?) => {
  //更新bpmn结点上的属性
  const updateProperties = (properties) => {
    const modeling = bpmn.modeler?.get('modeling');
    modeling.updateProperties(bpmn.operElement, properties);
  };

  const updateProperty = (propertyName, val, hasDescriptor?) => {
    if (val === '') {
      val = undefined;
    }
    let properties = {};
    if (hasDescriptor) {
      propertyName = descriptorPrefix.value + propertyName;
    }
    properties[propertyName] = val;
    const modeling = bpmn.modeler?.get('modeling');
    modeling.updateProperties(bpmn.operElement, properties);
  };

  const getDocumentation = () => {
    if (!bpmn.operElement) return;
    const documentations = bpmn.operElement.businessObject.documentation;
    const text =
      documentations && documentations.length > 0 ? documentations[0].text : '';
    return text;
  };

  //获取结点前缀
  const descriptorPrefix = computed(() => {
    return descriptor + ':';
  });

  return {
    updateProperties,
    updateProperty,
    getDocumentation,
    descriptorPrefix,
  };
};
