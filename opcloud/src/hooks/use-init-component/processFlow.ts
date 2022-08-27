import { ProcessFlowComponent } from "@/components/designComponent/trade/processFlow/IConfig";
// import useProcessFlow from "@/hooks/use-processFlow";
// import { getOrderProcessList } from "@/api/homeApi";

/**
 * 工序流程初始化
 * @param NOId 工单ID
 */
export async function processFlowInit(
  component: ProcessFlowComponent,
  NOId: string,
  pageId: string | number
) {
  // const { drawFlow } = useProcessFlow();
  // const res = await getOrderProcessList({ orderNumber: NOId, pageId });
  // if (res.code == 200) {
  //   const resData = res.data;
  //   if (resData.length === 0) return;
  //   const firstId = "0000";
  //   const endId = "9999";
  //   const nodes: any[] = [
  //     {
  //       id: firstId,
  //       FProcessName: "开始",
  //     },
  //   ];
  //   const edges: Record<string, any>[] = [];
  //   const lastPoint: string[] = [];
  //   // 生成节点数据
  //   for (let i = 0; i < resData.length; i++) {
  //     const node = resData[i];
  //     nodes.push(node);
  //     // 添加连线数据
  //     if (node["PreId"]) {
  //       const preIds: string[] = node["PreId"].split(",");
  //       preIds.forEach((item) => {
  //         edges.push({ preId: item, currentId: node["id"] });
  //       });
  //     } else {
  //       edges.push({ preId: firstId, currentId: node["id"] });
  //     }
  //     // 如果是最后一道工序
  //     if (node.isEndPoint) {
  //       lastPoint.push(node["id"]);
  //     }
  //   }
  //   nodes.push({
  //     id: endId,
  //     FProcessName: "结束",
  //   });
  //   lastPoint.forEach((item) => {
  //     edges.push({ preId: item, currentId: endId });
  //   });
  //   component.nodeList = nodes;
  //   drawFlow(
  //     nodes,
  //     edges,
  //     component.__nodeStatus__,
  //     <string>component.__config__.target,
  //     "id",
  //     "FProcessName",
  //     "FCompletionStatus"
  //   );
  // }
}
