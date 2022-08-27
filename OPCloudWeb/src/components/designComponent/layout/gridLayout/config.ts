import { IComponent } from '../../commonCfg';
import { GridLayoutComponent } from './IConfig';

/**
 * 网格布局罪案
 */
export class GridLayout implements IComponent {
  constructor(config?: GridLayoutComponent) {
    config && (this.config = config);
  }

  config: GridLayoutComponent = {
    name: 'GridLayout',
    componentTag: 'designGridLayout',
    __form__: {
      label: '网格布局',
      span: 24,
    },
    __config__: {
      icon: 'el-icon-s-grid',
      isModel: false,
    },
    __attr__: {
      // 行数
      rowCount: 1,
      // 列数
      columnCount: 1,
      // 高度(px)、百分比
      height: '200',
      // 宽度(px)、百分比
      width: '100%',
    },
  };

  verifyConfig(): string {
    return '';
  }
}

// 标准组件初始配置
export const defaultConfig = new GridLayout();
