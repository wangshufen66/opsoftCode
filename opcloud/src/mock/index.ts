//引入mockjs
import Mock from 'mockjs'

Mock.setup({
  timeout: 1000,
})
Mock.mock('/exec/sql', 'get', {
  code: 200,
  'data|6-10': [{
    name: '@cname',
    'value|21-34': 10,
  }, ],
})