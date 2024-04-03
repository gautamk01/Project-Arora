import { EditorAction } from "./editor-action";
import { createContext, Dispatch, useContext, useReducer } from "react";
import { FunnelPage } from "@prisma/client";
import {
  DeviceType,
  editorReducer,
  EditorState,
  initalState,
} from "./editor-reducer";

export type EditorContextData = {
  device: DeviceType;
  previewMode: boolean;
  setPreviewMode: (previewMode: boolean) => void;
  setDevice: (device: DeviceType) => void;
};

export type EditorContextType = {
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
  subaccountId: string;
  funnelId: string;
  pageDetails: FunnelPage | null;
};

const initialEditorContext: EditorContextType = {
  state: initalState,
  dispatch: () => undefined,
  subaccountId: "",
  funnelId: "",
  pageDetails: null,
};

export const EditorContext =
  createContext<EditorContextType>(initialEditorContext);

type EditorProps = {
  children: React.ReactNode;
  subaccountId: string;
  funnelId: string;
  pageDetails: FunnelPage;
};

const EditorProvider = ({
  children,
  subaccountId,
  funnelId,
  pageDetails,
}: EditorProps) => {
  const [state, dispatch] = useReducer(editorReducer, initalState);
  return (
    <EditorContext.Provider
      value={{ state, dispatch, subaccountId, funnelId, pageDetails }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor Hool must be used within the editor Provider");
  }
  return context;
};

export default EditorProvider;
