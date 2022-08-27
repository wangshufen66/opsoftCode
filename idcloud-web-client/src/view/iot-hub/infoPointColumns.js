const infoPointColumns= [{
  title: '信息点代码',
  key: 'number',
  width: '250',
  type: 'text'
},
  {
    title: '信息点名称',
    key: 'name',
    width: '250',
    type: 'text'
  },
  {
    title: '信息点单位',
    key: 'unitName',
    width: '250',
    type: 'text'
  },
  {
    title: '显示类型',
    key: 'type',
    width: '250',
    type: 'select',
    selectOptions: [{
      value: '0',
      label: '瞬时值'
    },
      {
        value: '1',
        label: '区间值'
      }
    ],
    render: (h, params) => {
      const selectionArray = [{
        value: '0',
        label: '瞬时值'
      },
        {
          value: '1',
          label: '区间值'
        }
      ]
      // 根据设置的选项集合，生成对应的下拉选项
      let optionArray = []
      selectionArray.map(item => {
        optionArray.push(h('Option', {
          props: {
            disabled: false,
            value: item.value,
            label: item.label
          },
          style: {
            width: '80px',
          }
        }))
      })

      return h('Select', {
        props: {
          disabled: false,
          size: 'small',
          placeholder: '',
          value: String(params.row['type'])
        },
        style: {
          width: '80px',
          pointerEvents: 'none',
        }
      }, optionArray)
    }
  },
  {
    title: '备注信息',
    key: 'mark',
    width: '250',
    type: 'text'
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: '250',
    type: 'datetime'
  },
  {
    title: '修改时间',
    key: 'updateTime',
    width: '250',
    type: 'datetime'
  },

];
export default infoPointColumns;
