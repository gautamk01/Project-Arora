import { EditorBtns } from "@/lib/constants";
import { EditorAction } from "./editor-action";
import {
  addAnElement,
  deleteAnElement,
  updateAnElement,
} from "./editor-reduer-function";

export type DeviceType = "Desktop" | "Mobile" | "Tablet";

// example :- Container inside a Container can be an editor element
export type EditorElement = {
  id: string;
  style: React.CSSProperties;
  name: string;
  type: EditorBtns;
  content: EditorElement[] | {}; //we have 2 content one is static "{}", another is recursive EditorELement[]
};

export type Editor = {
  liveMode: boolean; //Live or not live
  elements: EditorElement[]; //all the Editor Element
  selectedElement: EditorElement; //selected element from the EditorElements to edit
  device: DeviceType; //Type of Device
  previewMode: boolean; //Preview the website
  funnelPageId: string; //Funnelpageid
};

export type HistoryState = {
  history: Editor[]; //it is a collection of editor
  currentIndex: number; // currentIndex is the position number to track the change
};

export type EditorState = {
  editor: Editor; //
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
      //perform logic to update the element in the state
      const updatedElements = updateAnElement(state.editor.elements, action);
      const UpdatedElementIsSelected =
        state.editor.selectedElement.id === action.payload.elementDetails.id;
      //if that element is selected  then show that element is updated
      const updateEditorStateWithUpdate = {
        ...state.editor,
        elements: updatedElements,
        selectedElement: UpdatedElementIsSelected
          ? action.payload.elementDetails
          : {
              id: "",
              content: [],
              name: "",
              style: {},
              type: null,
            },
      };

      const updateHistoryWithUpdate = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updateEditorStateWithUpdate }, //Save a copy of the updated state
      ];

      const updatedEditor = {
        ...state,
        editor: updateEditorStateWithUpdate,
        history: {
          ...state.history,
          history: updateHistoryWithUpdate,
          currentIndex: updateHistoryWithUpdate.length - 1,
        },
      };
      return updatedEditor;

    case "DELETE_ELEMENT":
      const updatedElementsAfterDelete = deleteAnElement(
        state.editor.elements,
        action
      );
      const updatedEditorStateAfterDelete = {
        ...state.editor,
        elements: updatedElementsAfterDelete,
      };
      const updateHistoryAfterDelete = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateAfterDelete },
      ];

      const deletedState = {
        ...state,
        editor: updatedEditorStateAfterDelete,
        history: {
          ...state.history,
          history: updateHistoryAfterDelete,
          currentIndex: updateHistoryAfterDelete.length - 1,
        },
      };

      return deletedState;
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
