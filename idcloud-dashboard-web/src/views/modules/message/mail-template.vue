<template>
  <div class="app-main-content">
    <searchbar ref="searchbar" :search-items="searchItems" :pagination="pagination" class="grid-search-bar" @search="getDataList" @resizeSearchbar="resizeSearchbar">
      <template slot="button">
        <el-button size="small" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button size="small" type="success" @click="configHandle()">配置</el-button>
      </template>
    </searchbar>
    <!--表格渲染-->
    <el-table v-loading="dataListLoading" :data="dataList" :height="tableHeight" border style="width: 100%;">
      <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="subject" label="主题" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createTime" label="发送日期" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">更新</el-button>
          <el-button type="text" size="small" @click="sendHandle(scope.row.id)">发送</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div ref="paginationbar" class="pagination-wrapper">
      <el-pagination :page-sizes="[20, 30, 50, 100, 200]" :page-size="pagination.limit" :current-page.sync="pagination.page" :total="pagination.total" style="float:right;" layout="sizes, prev, pager, next, total" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 邮件配置 -->
    <config v-if="configVisible" ref="config"></config>
    <!-- 弹窗, 发送邮件 -->
    <send v-if="sendVisible" ref="send" @refreshDataList="getDataList"></send>
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Searchbar from '@/components/Searchbar'
    import Config from './mail-template-config'
    import Send from './mail-template-send'
    import AddOrUpdate from './mail-template-add-or-update'
    import * as API from '@/api/sys/mailtemplate'

    export default {
        components: {
            AddOrUpdate,
            Config,
            Send,
            Searchbar
        },
        mixins: [mixinViewModule],
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
                        { name: '名称', field: 'name', type: 'text', dbfield: 'name', dboper: 'cn' }
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
            sendHandle (id) {
                this.sendVisible = true
                this.$nextTick(() => {
                    this.$refs.send.init(id)
                })
            }
        }
    }
</script>

