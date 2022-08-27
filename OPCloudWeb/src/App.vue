<template>
  <router-view />
  <el-dialog title="接口地址设置" v-model="apiAddress.dialogVisible" width="30%">
    <template v-slot:title>
      <dialog-title title="接口地址设置"></dialog-title>
    </template>
    接口地址：
    <el-input v-model="apiAddress.address" placeholder="请输入接口地址" clearable></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="apiAddress.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitApiAddress">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useAppGlobal } from '@/use/useAppGlobal';

const { apiAddress, onSubmitApiAddress } = useAppGlobal();
</script>
