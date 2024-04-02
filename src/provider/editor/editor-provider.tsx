import { EditorBtns } from "@/lib/constants";

export type DeviceType = "Desktop" | "Mobile" | "Tablet";

export type EditorElement = {
  id: string;
  style: React.CSSProperties;
  name: string;
  type: EditorBtns;
  content: EditorElement[] | {}; //we have 2 content one is static another is recursive
};

export type Editor = {
  liveMode: boolean;
  elements: EditorElement[]; //all the Editor Element
  selectedElement: EditorElement; //editor element
  device: DeviceType;
  previewMode: boolean;
  funnelPageId: string;
};

export type HistoryState = {
  history: Editor[]; //stack
  currentIndex: number;
};

export type EditorState = {
  editor: Editor;
  history: HistoryState;
};
