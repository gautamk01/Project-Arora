import { EditorBtns } from "@/lib/constants";
import { EditorAction } from "./editor-action";
import { addAnElement } from "./editor-reduer-function";

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

//Working on Reducer , setup the inital state for the Editor
const initialEditorState: EditorState["editor"] = {
  //recursive elements
  elements: [
    {
      content: [],
      id: "__body",
      name: "Body",
      style: {},
      type: "__body",
    },
  ],
  //static elements
  selectedElement: {
    id: "",
    content: [],
    name: "",
    style: {},
    type: null,
  },
  device: "Desktop",
  previewMode: false,
  liveMode: false,
  funnelPageId: "",
};

const initalHistoryState: EditorState["history"] = {
  history: [initialEditorState],
  currentIndex: 0,
};

const initalState: EditorState = {
  editor: initialEditorState,
  history: initalHistoryState,
};

//Creating the Reducer
const editorReducer = (
  state: EditorState = initalState,
  action: EditorAction
): EditorState => {
  switch (action.type) {
    case "ADD_ELEMENT":
      //update the Editor State , which mean the placeing of the element
      const updateEditorState = {
        ...state.editor,
        elements: addAnElement(state.editor.elements, action),
      };

      //upadte the history stack to include the entire updated EditorState
      // updateEditorState = ["Hello world"]
      //slice result => ["Hello"]
      //updateEditorState => ["Hello world"]
      //updateHistory = > ["Hello","Hello world"]
      const updateHistory = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updateEditorState }, //Save a copy of the updated state
      ];

      //updating the state
      //...state -> update the state
      //editor -> updatedEditorState
      //history -> updateHistory and currentIndex
      const newEditorState: EditorState = {
        ...state,
        editor: updateEditorState,
        history: {
          ...state.history,
          history: updateHistory,
          currentIndex: updateHistory.length - 1,
        },
      };
      return newEditorState;

    case "UPDATE_ELEMENT":

    case "DELETE_ELEMENT":
    case "CHANGE_CLICKED_ELEMENT":
    case "CHANGE_DEVICE":
    case "TOGGLE_PREVIEW_MODE":
    case "TOGGLE_LIVE_MODE":
    case "REDO":
    case "UNDO":
    case "LOAD_DATA":
    case "SET_FUNNELPAGE_ID":
    default:
      return state;
  }
};
