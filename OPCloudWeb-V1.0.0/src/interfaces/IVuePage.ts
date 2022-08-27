export interface IvuePage {
  // 模板代码
  templateNode: IVuePageTemplate;
  // script代码层
  scriptNode: IVuePageScript;
  // style 代码层
  styleNode: IVueStype;
}

export interface IVuePageTemplate {
  Template: string;
}

export interface IVuePageScript {
  Import?: string;
  PropsNode?: string;
  ComponentNode?: string;
  EmitsNode?: string;
  SetupNode?: string;
}

export interface IVueStype {
  scoped?: boolean;
  styleContent?: string;
}

export interface IVueSetupNode {
  refCode?: string;
  reactiveCode?: string;
  constCode?: string;
  watchCode?: string;
  computedCode?: string;
  functionCode?: string;
  returnCode: string;
}
