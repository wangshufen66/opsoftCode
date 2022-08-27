import { Emitter } from "mitt";
import { getCurrentInstance, onMounted, onUnmounted } from "vue";

interface UseEitterReturn {
  /**
   * 全局事件对象
   */
  emitter: Emitter;
}

type event = { key: string; value: (obj?: any) => void };

export default function useEitter(eventlist?: Array<event>): UseEitterReturn {
  const currentInstance = getCurrentInstance();
  const emitter: Emitter =
    currentInstance?.appContext.config.globalProperties.$emitter;

  onMounted((): void => {
    if (eventlist && eventlist.length > 0) {
      for (let i = 0; i < eventlist.length; i++) {
        emitter.on(eventlist[i].key, eventlist[i].value);
      }
    }
  });

  onUnmounted((): void => {
    if (eventlist && eventlist.length > 0) {
      for (let i = 0; i < eventlist.length; i++) {
        emitter.off(eventlist[i].key, eventlist[i].value);
        // 从map中移除
        emitter.all.delete(eventlist[i].key);
      }
    }
  });

  return {
    emitter,
  };
}
