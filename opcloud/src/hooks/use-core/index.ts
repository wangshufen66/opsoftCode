import { useStore } from "vuex";
import { Fn } from "@/shared/type";

interface UseCoreReturn {
  /**
   * 清除缓存
   */
  clearSystemCache: Fn;
}

/**
 * store
 * @returns
 */
export default function useCore(): UseCoreReturn {
  const store = useStore();
  /**
   * 清除缓存
   */
  function clearSystemCache(): void {
    store.commit("comm/setAppInitComplete", false);
    store.commit("comm/setAppMenuInit", false);
  }

  return {
    clearSystemCache,
  };
}
