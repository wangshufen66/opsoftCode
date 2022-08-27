import axios from '@/libs/api.request'

export const getSolutions = (params) => {
  return axios.request({
    url: '/esop_solution/getSolutions',
    method: 'get',
    params: params
  })
}

export const addSolution = (data) => {
  return axios.request({
    url: '/esop_solution/addSolution',
    method: 'post',
    data: data
  })
}

export const delSolution = (data) => {
  return axios.request({
    url: '/esop_solution/delSolution',
    method: 'post',
    data: data
  })
}

export const batchDelSolutionClient = (data) => {
  return axios.request({
    url: '/esop_solution/batchDelSolutionClient',
    method: 'post',
    data: data
  })
}

export const renameSolution = (data) => {
  return axios.request({
    url: '/esop_solution/renameSolution',
    method: 'post',
    data: data
  })
}

export const getSolutionClients = (params) => {
  return axios.request({
    url: '/esop_solution/getSolutionClients',
    method: 'get',
    params: params
  })
}

export const fileList = (params) => {
  return axios.request({
    url: '/esop_solution/fileList',
    method: 'get',
    params: params
  })
}

export const clientList = (params) => {
  return axios.request({
    url: '/esop_solution/clientList',
    method: 'get',
    params: params
  })
}

export const editSolution = (data) => {
  return axios.request({
    url: '/esop_solution/editSolution',
    method: 'post',
    data: data
  })
}

export const activeSolution = (data) => {
  return axios.request({
    url: '/esop_solution/activeSolution',
    method: 'post',
    data: data
  })
}

export const antiActiveSolution = (data) => {
  return axios.request({
    url: '/esop_solution/antiActiveSolution',
    method: 'post',
    data: data
  })
}

export const viewSolution = (params) => {
  return axios.request({
    url: `/esop_solution/viewSolution`,
    method: 'get',
    params: params
  })
}
//新旧api分割线——————————————————————————————————————————————————————————————————————————————————————
// export const getSolutionClientDetail = (id) => {
//   return axios.request({
//     url: `/esop_solution/getSolutionClientDetail/${id}`,
//     method: 'get',
//   })
// }
//
//

// export const updateSolutionClient = (data) => {
//   return axios.request({
//     url: '/esop_solution/updateSolutionClient',
//     method: 'post',
//     data: data
//   })
// }
//
// export const addSolutionClient = (data) => {
//   return axios.request({
//     url: '/esop_solution/addSolutionClient',
//     method: 'post',
//     data: data
//   })
// }
//
// export const delSolutionClient = (data) => {
//   return axios.request({
//     url: '/esop_solution/delSolutionClient',
//     method: 'post',
//     data: data
//   })
// }

