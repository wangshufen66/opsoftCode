export default class IdButtonConfig {
  //原生属性
  type = ""; //类型 primary / success / warning / danger / info / text
  plain = false; //是否朴素按钮
  round = false; //是否圆角按钮
  circle = false; //是否圆形按钮
  loading = false; //是否加载中状态 =》归属到authority中
  disabled = false; //是否禁用状态 =》归属到authority中
  icon = ""; //图标类名   =》beforeClass afterClass 代替
  autofocus = false; //是否默认聚焦

  //改造的属性
  text = ""; //按钮字
  styleOne = false; //启用样式1
  styleTwo = false; //启用样式2
  //权限相关
  idLoad = false;
  idIf = true;
  idDisable = false;
  idShow = true;
  beforeIf = false; //是否存在文字前图标的渲染
  beforeClass = ""; //文字前的图标
  afterIf = false; //是否存在文字后图标的渲染
  afterClass = ""; //文字后的图标
  //基本要素
  tag = "id-button"; //渲染成idbutton
  classKey = ""; //class
  target = ""; //鼠标点击传送的目标值

  constructor(classKey, text, target, rest) {
    this.classKey = classKey;
    this.text = text;
    this.target = target;
    for (let item in rest) {
      this[item] = rest[item];
    }
  }
}
