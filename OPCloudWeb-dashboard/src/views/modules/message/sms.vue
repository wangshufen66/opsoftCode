<template>
  <div class="app-main-content">
    <searchbar ref="searchbar" :search-items="searchItems" :pagination="pagination" class="grid-search-bar" @search="getDataList" @resizeSearchbar="resizeSearchbar">
      <template slot="button">
        <el-button size="small" type="primary" @click="configHandle()">配置</el-button>
        <el-button size="small" type="success" @click="sendHandle()">发送短信</el-button>
      </template>
    </searchbar>
    <!--表格渲染-->
    <el-table v-loading="dataListLoading" :data="dataList" :height="tableHeight" border style="width: 100%;">
      <el-table-column prop="mobile" label="手机"/>
      <el-table-column prop="params1" label="参数1"/>
      <el-table-column prop="params2" label="参数2"/>
      <el-table-column prop="params3" label="参数3"/>
      <el-table-column prop="params4" label="参数4"/>
      <el-table-column prop="status" label="状态" sortable="custom" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="small">成功</el-tag>
          <el-tag v-else size="small" type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="发送日期">
      </el-table-column>
    </el-table>
    <div ref="paginationbar" class="pagination-wrapper">
      <el-pagination :page-sizes="[20, 30, 50, 100, 200]" :page-size="pagination.limit" :current-page.sync="pagination.page" :total="pagination.total" style="float:right;" layout="sizes, prev, pager, next, total" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    </div>

    <!-- 弹窗, 短信配置 -->
    <config v-if="configVisible" ref="config"></config>
    <!-- 弹窗, 发送短信 -->
    <send v-if="sendVisible" ref="send" @refreshDataList="getDataList"></send>
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import dataDictionary from '@/mixins/data-dictionary'
    import Searchbar from '@/components/Searchbar'
    import Config from './sms-config'
    import Send from './sms-send'
    import * as API from '@/api/sys/sms'

    export default {
        components: {
            Config,
            Send,
            Searchbar
        },
        mixins: [mixinViewModule, dataDictionary],
        data() {
            return {
                mixinViewModuleOptions: {
                    getListAPI: API.list,
                    delAPI: API.del
                },
                configVisible: false,
                sendVisible: false,
                searchItems: {
                    normal: [
                        { name: '手机号', field: 'mobile', type: 'text', dbfield: 'mobile', dboper: 'cn' }
                    ]
                },
            }
        },
        mounted() {
        },
        methods: {
            // 短信配置
            configHandle () {
                this.configVisible = true
                this.$nextTick(() => {
                    this.$refs.config.init()
                })
            },
            // 发送短信
            sendHandle () {
                this.sendVisible = true
                this.$nextTick(() => {
                    this.$refs.send.init()
                })
            }
        }
    }
</script>
