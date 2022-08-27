import { InputComponent } from "./basics/input/IConfig";
import { NumberComponent } from "./basics/number/IConfig";
import { PasswordComponent } from "./basics/password/IConfig";
import { SelectComponent } from "./basics/select/IConfig";
import { MoreSelectComponent } from "./basics/moreselect/IConfig";
import { TextAreaComponent } from "./basics/textarea/IConfig";
import { CascaderComponent } from "./basics/cascader/IConfig";
import { RadioComponent } from "./basics/radio/IConfig";
import { CheckComponent } from "./basics/checkbox/IConfig";
import { SwitchComponent } from "./basics/switch/IConfig";
import { TimePickerComponent } from "./basics/timepicker/IConfig";
import { SliderComponent } from "./basics/slider/IConfig";
import { DatePickerComponent } from "./basics/datepicker/IConfig";
import { MultiDatePickerComponent } from "./basics/multidatepicker/IConfig";
import { TimeRangePickerComponent } from "./basics/timerangepicker/IConfig";
import { DateRangePickerComponent } from "./basics/daterangepicker/IConfig";
import { ColorPickerComponent } from "./basics/colorpicker/IConfig";
import { UploadComponent } from "./basics/upload/IConfig";
import { LabelComponent } from "./basics/label/IConfig";

import { TabTableComponent } from "./trade/tabTable/IConfig";
import { TreeComponent } from "./trade/tree/IConfig";
import { AutoCodeComponent } from "./trade/autoCode/IConfig";
import { TableComponent } from "./basics/table/IConfig";
import { DialogSelectComponent } from "./trade/dialogSelect/IConfig";
import { DateCriticalityComponent } from "./trade/dateCriticality/IConfig";
import { CalculateComponent } from "./trade/calculate/IConfig";
import { ButtonComponent } from "./basics/button/IConfig";
import { ProgressComponent } from "./trade/progress/IConfig";
import { ProcessFlowComponent } from "./trade/processFlow/IConfig";

export type DesignComponent =
  | InputComponent
  | TextAreaComponent
  | NumberComponent
  | PasswordComponent
  | SelectComponent
  | MoreSelectComponent
  | CascaderComponent
  | RadioComponent
  | CheckComponent
  | SwitchComponent
  | TimePickerComponent
  | SliderComponent
  | DatePickerComponent
  | MultiDatePickerComponent
  | TimeRangePickerComponent
  | DateRangePickerComponent
  | ColorPickerComponent
  | UploadComponent
  | AutoCodeComponent
  | TableComponent
  | DialogSelectComponent
  | TabTableComponent
  | TreeComponent
  | DateCriticalityComponent
  | CalculateComponent
  | ButtonComponent
  | ProgressComponent
  | ProcessFlowComponent
  | LabelComponent;
