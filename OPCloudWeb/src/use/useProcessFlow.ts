import { ref } from "vue";
import {
  select as d3Select,
  zoom as d3Zoom,
  zoomIdentity as d3ZoomIdentity,
} from "d3";
import { graphlib, render as dagreRender } from "dagre-d3";

/**节点结构 */
export type FlowNode = {
  /**节点 */
  nodes: any[];
  /**节点连接结构 */
  edges: Array<Record<string, string | number>>;
};

export default function useProcessFlow() {
  /**节点数据 */
  const flowNode: FlowNode = {
    nodes: [],
    edges: [],
  };

  /**绘制对象 */
  let g: any;
  /**图表SVG对象 */
  let svg: any;

  /**初始化绘制实例 */
  function initGraph() {
    g = new graphlib.Graph().setGraph({
      // 排列方向
      rankdir: "LR",
      align: "UL",
      marginx: 50,
      marginy: 50,
    });
  }
  /**
   * 设置节点属性
   * @param nodeStatus 节点状态集合
   * @param idKey ID属性
   * @param labelKey label属性
   */
  function setNodes(
    nodeStatus: any[],
    idKey: string,
    labelKey: string,
    statusKey: string
  ) {
    for (let i = 0; i < flowNode.nodes.length; i++) {
      const node = flowNode.nodes[i];
      // 设置节点属性
      const status = nodeStatus.find((f) => f.value == node[statusKey]);
      const nodeProps: Record<string, any> = {
        id: node[idKey],
        label: node[labelKey] || "未命名",
        height: 32,
        width: 120,
        rx: 4,
        ry: 4,
        style: `fill:${(status && status.color) || "#42c986"};stroke:#333;`,
        //   节点文本颜色
        labelStyle: `fill:#fff`,
      };
      g.setNode(node.id, nodeProps);
    }
  }

  /**
   * 设置节点连线
   */
  function setEdges() {
    for (let i = 0; i < flowNode.edges.length; i++) {
      const edge = flowNode.edges[i];
      // 设置节点属性
      const edgeProps: Record<string, any> = {
        // 连线的颜色
        style: "stroke: #666; fill: none;",
        // 箭头颜色
        arrowheadStyle: "fill: #666;stroke: #666;",
        // 箭头形状（vee表示箭头是尖的，默认是平的）
        arrowhead: "vee",
      };
      g.setEdge(edge.preId, edge.currentId, edgeProps);
    }
  }

  /**
   * 绘制流程图
   * @param container 容器ID
   * @param idKey 节点ID值
   */
  function draw(container: string, idKey: string) {
    svg = d3Select(container)
      .append("svg")
      .attr("width", 2000)
      .attr("height", 1000);
    const inner = svg.append("g");
    // 缩放
    const zoom = d3Zoom().on("zoom", (e) => {
      inner.attr("transform", e.transform);
    });
    svg.call(zoom);
    let render = new dagreRender();
    render(inner, g);
    inner.selectAll("g.node").on("click", (e) => {
      //点击事件
      // let currentNode = g.node(e)
      let node: any = flowNode.nodes.filter((item) => {
        return item[idKey] === e;
      });
    });
    // 初始化缩放比例
    let initialScale: number = 1;
    // 设置宽高
    svg.call(
      zoom.transform,
      d3ZoomIdentity
        .translate((svg.attr("width") - g.graph().width * initialScale) / 2, 20)
        .scale(initialScale)
    );
    svg.attr("height", g.graph().height * initialScale + 40);
  }

  /**
   * 绘制
   */
  function drawFlow(
    nodes: any[],
    edges: any[],
    nodeStatus: any[],
    container: string,
    idKey: string = "id",
    labelKey: string = "label",
    statusKey: string = "status"
  ) {
    flowNode.nodes = nodes;
    flowNode.edges = edges;
    initGraph();
    setNodes(nodeStatus, idKey, labelKey, statusKey);
    setEdges();
    draw(`#${container}`, idKey);
  }

  return {
    drawFlow,
  };
}
