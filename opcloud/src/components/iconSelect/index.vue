<template>
  <div class="icon-dialog">
    <el-dialog
      v-model="visible"
      width="980px"
      @open="onOpen"
      :before-close="beforeClose"
      @close="onClose"
    >
      <template #title>
        <el-input
          v-model="state.key"
          :style="{ width: '260px' }"
          placeholder="请输入图标名称"
          prefix-icon="el-icon-search"
          clearable
        />
      </template>
      <ul class="icon-ul">
        <li
          v-for="icon in state.iconList"
          :key="icon"
          :class="state.active === icon ? 'active-item' : ''"
          @click="onSelect(icon)"
        >
          <i :class="icon" />
          <div class="icon-name">{{ icon }}</div>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import iconList from "@/shared/utils/icon.json";
import { reactive, watch } from "vue";

const originList = iconList.map((name) => `el-icon-${name}`);

declare type stateType = {
  iconList: Array<string>;
  active: string | undefined;
  key: string | undefined;
};

const props = defineProps({
  current: String,
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["select", "update:visible"]);

const state: stateType = reactive({
  iconList: originList,
  active: undefined,
  key: "",
});

watch(
  () => state.key,
  (val) => {
    if (val) {
      state.iconList = originList.filter((name) => name.indexOf(val) > -1);
    } else {
      state.iconList = originList;
    }
  }
);

const onOpen = () => {
  state.active = props.current;
  state.key = "";
};

const beforeClose = () => {
  emit("update:visible", false);
};

const onClose = () => {};

const onSelect = (icon: string) => {
  state.active = icon;
  emit("select", icon);
  emit("update:visible", false);
};
</script>
<style lang="scss">
@import "@/styles/modules/design/icondialog.scss";
</style>
