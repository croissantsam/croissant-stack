import type { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      onAuthCallback: (callback: (url: string) => void) => () => void;
      openExternal: (url: string) => Promise<void>;
    };
  }
}
