import {
    contextBridge,
    ipcRenderer,
    shell,
    desktopCapturer
} from "electron";

contextBridge.exposeInMainWorld(
    "api", {
        ipcRenderer,
        shell,
        isOpen: async () => {
            return await ipcRenderer.invoke('isOpen');
        },
        desktopCapturer
    }
);