type RelTableSetting = {
  chartFilterFields?: Array<{
    fieldName: string | number | undefined;
    fieldValue: any;
  }>;
  /**数据源主表字段 */
  masterRelatedFieldName?: string;
  masterFieldValue?: any;
  /**数据源主表名称 */
  masterRelatedTableName?: string;
  /**数据源标配置结构 */
  tableEntityList?: any[];
  /**显示文本绑定字典(开窗) */
  textBindField?: string;
  /**值绑定字典(开窗) */
  valueBindField?: string;
};

/**
 * 配置转换
 * @configList 关联配置
 */
export function relTableSettingTransform(configList: any[]): RelTableSetting {
  const params = {
    chartFilterFields: undefined,
    masterFieldValue: undefined,
    masterRelatedFieldName: undefined,
    masterRelatedTableName: undefined,
    tableEntityList: [] as any[],
  };
  for (let i = 0; i < configList.length; i++) {
    const config = configList[i];
    const tableEntity: any = {
      displayedFields: [],
      relatedFieldsConfig: [],
      tableName: undefined,
    };
    config.fields &&
      tableEntity.displayedFields.push(
        ...config.fields
          .filter((f) => f.check === true)
          .map((m) => {
            return {
              fieldName: m.fieldName,
            };
          })
      );
    const rellist = config.rellist;
    rellist &&
      tableEntity.relatedFieldsConfig.push(
        ...rellist.map((m) => {
          return {
            fieldName: m.field,
            foreignTableName: m.fField[0],
            foreignFieldName: m.fField[1],
            relatedType:
              m.reltype === "join" ? 0 : m.reltype === "left join" ? 1 : 2,
          };
        })
      );
    i === 0 && (params.masterRelatedTableName = config.tableName);
    tableEntity.tableName = config.tableName;
    params.tableEntityList.push(tableEntity);
  }
  return params;
}
