import { IFormConfig } from './IFormConfig';
import { IDesginComponent } from '@/interfaces/IDesginComponent';

export type formStructure = {
  formCfg: IFormConfig;
  components: IDesginComponent[];
};

export type directionType = 'rtl' | 'btt' | 'ltr' | 'ttb';

export type dialogType = 'dialog' | 'drawer';
