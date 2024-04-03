"use client";
import { EditorAction } from "./editor-action";
import { createContext, Dispatch, useContext, useReducer } from "react";
import { FunnelPage } from "@prisma/client";
import { editorReducer, EditorState, initalState } from "./editor-reducer";

//This is mainly for the create Context type
export type EditorContextType = {
  state: EditorState; //calling the state with  type EditorState
  dispatch: Dispatch<EditorAction>; // Now Dispatch to activate the Reducer function type EditorAction
  subaccountId: string;
  funnelId: string;
  pageDetails: FunnelPage | null;
};

//This is the initalEditorContext value for Create Context
const initialEditorContext: EditorContextType = {
  state: initalState,
  dispatch: () => undefined,
  subaccountId: "",
  funnelId: "",
  pageDetails: null,
};

//initialisation of Context
export const EditorContext =
  createContext<EditorContextType>(initialEditorContext);

/************PROVIDER FOR CONTEXT************/
//types for the Provider
type EditorProps = {
  children: React.ReactNode;
  subaccountId: string;
  funnelId: string;
  pageDetails: FunnelPage;
};

//Creating a provider function so that we can use the values for the children inside the provider

const EditorProvider = ({
  children,
  subaccountId,
  funnelId,
  pageDetails,
}: EditorProps) => {
  //calling the useReducer function
  const [state, dispatch] = useReducer(editorReducer, initalState);
  return (
    <EditorContext.Provider
      value={{ state, dispatch, subaccountId, funnelId, pageDetails }}
    >
      {children}
    </EditorContext.Provider>
  );
};

// manily to access the value by the provider
export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor Hool must be used within the editor Provider");
  }
  return context;
};

export default EditorProvider;
