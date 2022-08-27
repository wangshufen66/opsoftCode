import Vue from 'vue';

declare global {
  interface Window {}

  interface ImportMeta {
    env: Record<string, any>;
    glob<T = unknown>(globPath: string): Record<string, T>;
    globEager<T = unknown>(globPath: string): Record<string, T>;
  }
}
