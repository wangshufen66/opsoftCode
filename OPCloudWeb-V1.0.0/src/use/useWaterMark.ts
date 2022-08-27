import { onMounted, onUnmounted } from 'vue';
import { createWaterMark, removeWatermark } from './../utils/watermark';
export default function useWaterMark(
  warper: string | null,
  title: string,
  des: string
) {
  onMounted((): void => {
    createWaterMark(warper, title, des);
  });

  onUnmounted((): void => {
    removeWatermark();
  });
}
