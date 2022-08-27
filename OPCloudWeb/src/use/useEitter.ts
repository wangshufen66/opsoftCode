/** 事件总线定义 */
import { Emitter } from 'mitt';
import { getCurrentInstance, onMounted, onUnmounted } from 'vue';

declare type event = { key: string; value: (obj?: any) => void };

export default function useEitter(eventlist?: Array<event>) {
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
