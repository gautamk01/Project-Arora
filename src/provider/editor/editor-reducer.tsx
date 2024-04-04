import { EditorBtns } from "@/lib/constants";
import { EditorAction } from "./editor-action";
import {
  addAnElement,
  deleteAnElement,
  updateAnElement,
} from "./editor-reduer-function";
import { createContext, Dispatch } from "react";
import { FunnelPage } from "@prisma/client";

export type DeviceType = "Desktop" | "Mobile" | "Tablet";

// example :- Container inside a Container can be an editor element
export type EditorElement = {
  id: string;
  style: React.CSSProperties;
  name: string;
  type: EditorBtns;
  content: EditorElement[] | { href?: string }; //we have 2 content one is static "{}", another is recursive EditorELement[]
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

export const initalState: EditorState = {
  editor: initialEditorState,
  history: initalHistoryState,
};

//Creating the Reducer
export const editorReducer = (
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
      const clickedState: EditorState = {
        ...state,
        editor: {
          ...state.editor,
          //here the selected element will be payload
          selectedElement: action.payload.elementDetails || {
            id: "",
            content: [],
            name: "",
            style: {},
            type: null,
          },
        },

        history: {
          ...state.history,
          history: [
            ...state.history.history.slice(0, state.history.currentIndex + 1),
            { ...state.editor }, //save a copy of the current editor state
          ],
          currentIndex: state.history.currentIndex + 1,
        },
      };
      return clickedState;

    case "CHANGE_DEVICE":
      const changedDeviceState: EditorState = {
        ...state,
        editor: {
          ...state.editor,
          device: action.payload.device,
        },
      };
      return changedDeviceState;

    case "TOGGLE_PREVIEW_MODE":
      const toggleState: EditorState = {
        ...state,
        editor: {
          ...state.editor,
          previewMode: !state.editor.previewMode,
        },
      };

      return toggleState;
    case "TOGGLE_LIVE_MODE":
      const toggleLiveMode: EditorState = {
        ...state,
        editor: {
          ...state.editor,
          liveMode: action.payload
            ? action.payload.value
            : !state.editor.liveMode,
        },
      };
      return toggleLiveMode;
    case "REDO":
      //if there existe a something ahead we can forword
      if (state.history.currentIndex < state.history.history.length - 1) {
        const nextIndex = state.history.currentIndex + 1;
        const nextEditorState = { ...state.history.history[nextIndex] }; // now we change the history

        //Redostate
        const redoState: EditorState = {
          ...state,
          editor: nextEditorState, // passing the Redo state to the editor
          history: {
            ...state.history,
            currentIndex: nextIndex, //changeing the index to the new position
          },
        };

        return redoState;
      }
      return state;
    case "UNDO":
      //there is something to undo
      if (state.history.currentIndex > 0) {
        const previouseIndex = state.history.currentIndex - 1;
        const previouseEdiotor = { ...state.history.history[previouseIndex] };

        //undo State
        const undoState: EditorState = {
          ...state,
          editor: previouseEdiotor,
          history: {
            ...state.history,
            currentIndex: previouseIndex,
          },
        };
        return undoState;
      }
      return state;
    case "LOAD_DATA":
      // we are going to load some new data when are trying to access a domain or a page
      return {
        ...initalState, //everything in inital state
        editor: {
          ...initalState.editor,
          elements: action.payload.elements || initialEditorState.elements, //elements from the dispatch
          liveMode: !!action.payload.withLive, // live mode from dispatch
          // when we have to pass live mode when it is in production
        },
      };
    case "SET_FUNNELPAGE_ID":
      const { funnelPageId } = action.payload;
      const updatedEditorStatewithFunnelpageId = {
        ...state.editor,
        funnelPageId,
      };
      const updatedHistoryWithFunnelPageId = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStatewithFunnelpageId },
      ];

      const funnelPageIdState: EditorState = {
        ...state,
        editor: updatedEditorStatewithFunnelpageId,
        history: {
          ...state.history,
          history: updatedHistoryWithFunnelPageId,
          currentIndex: updatedHistoryWithFunnelPageId.length - 1,
        },
      };

      return funnelPageIdState;
    default:
      return state;
  }
};
