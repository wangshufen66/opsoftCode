// const template = `
//           <?xml version="1.0" encoding="UTF-8"?>
//           <definitions 
//               xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" 
//               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
//               xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
//               xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" 
//               xmlns:camunda="http://camunda.org/schema/1.0/bpmn" 
//               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
//               xmlns:activiti="http://activiti.org/bpmn" 
//               id="m1577635100724" 
//               name="" 
//               targetNamespace="http://www.activiti.org/testm1577635100724"
//             >
//             <process id="process" processType="None" isClosed="false" isExecutable="true">
//               <extensionElements>
//                 <camunda:properties>
//                   <camunda:property name="a" value="1" />
//                 </camunda:properties>
//               </extensionElements>
//               <startEvent id="_2" name="start" />
//             </process>
//             <bpmndi:BPMNDiagram id="BPMNDiagram_leave">
//               <bpmndi:BPMNPlane id="BPMNPlane_leave" bpmnElement="leave">
//                 <bpmndi:BPMNShape id="BPMNShape__2" bpmnElement="_2">
//                   <omgdc:Bounds x="144" y="368" width="32" height="32" />
//                   <bpmndi:BPMNLabel>
//                     <omgdc:Bounds x="149" y="400" width="23" height="14" />
//                   </bpmndi:BPMNLabel>
//                 </bpmndi:BPMNShape>
//               </bpmndi:BPMNPlane>
//             </bpmndi:BPMNDiagram>
//           </definitions>
//       `;
// export default template;

export default function <T>(processId:string, processName:string, category:string, description:string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" targetNamespace="${category}">
<bpmn2:process id="${processId}" name="${processName}" isExecutable="true">
  <bpmn2:documentation>${description}</bpmn2:documentation>
  <bpmn2:startEvent id="StartEvent_1"/>
</bpmn2:process>
<bpmndi:BPMNDiagram id="BPMNDiagram_1">
  <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
    <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
      <dc:Bounds height="36.0" width="36.0" x="160.0" y="160.0"/>
    </bpmndi:BPMNShape>
  </bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
</bpmn2:definitions>
`
}
