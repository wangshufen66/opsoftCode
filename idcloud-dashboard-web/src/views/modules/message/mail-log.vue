<template>
  <div class="app-main-content">
    <searchbar ref="searchbar" :search-items="searchItems" :pagination="pagination" class="grid-search-bar"
               @search="getDataList" @resizeSearchbar="resizeSearchbar">
    </searchbar>
    <el-table v-loading="dataListLoading" :data="dataList" :height="tableHeight" border style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="templateId" label="模板id" sortable="custom" header-align="center"
                       align="center"></el-table-column>
      <el-table-column prop="mailFrom" label="发送人" header-align="center" align="center"></el-table-column>
      <el-table-column prop="mailTo" label="收件人" header-align="center" align="center"></el-table-column>
      <el-table-column prop="mailCc" label="抄送人" header-align="center" align="center"></el-table-column>
      <el-table-column prop="subject" label="主题" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" sortable="custom" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="small">成功</el-tag>
          <el-tag v-else size="small" type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="发送时间" sortable="custom" header-align="center" align="center"
                       width="180"></el-table-column>
    </el-table>
    <div ref="paginationbar" class="pagination-wrapper">
      <el-pagination :page-sizes="[20, 30, 50, 100, 200]" :page-size="pagination.limit"
                     :current-page.sync="pagination.page" :total="pagination.total" style="float:right;"
                     layout="sizes, prev, pager, next, total" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"/>
    </div>
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Searchbar from '@/components/Searchbar'
    import * as API from '@/api/sys/mail'

    export default {
        components: {
            Searchbar
        },
        mixins: [mixinViewModule],
        data() {
            return {
                mixinViewModuleOptions: {
                    getListAPI: API.maillogList,
                },
                searchItems: {
                    normal: [
                        {name: '模板id', field: 'templateId', type: 'text', dbfield: 'template_id', dboper: 'cn'}
                    ]
                },
            }
        }
    }
</script>
