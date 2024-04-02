import { EditorAction } from "./editor-action";
import { EditorElement } from "./editor-provider";

//THis is a recursive function
//using this function we can add any item inside the conatiner
//untile we find the container id this function keeps on looping
export const addAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  // check the type
  if (action.type !== "ADD_ELEMENT")
    throw Error(
      "You sent the wrong action type to the add Element editor state"
    );

  //return a new array
  //When you dispatch the action , using a conatiner  that can have another container inside

  return editorArray.map((item) => {
    // we are going to search for the container here
    if (item.id === action.payload.containerId && Array.isArray(item.content)) {
      // if we find the container id then we set it's content and add the new element in that conatiner
      return {
        ...item,
        content: [...item.content, action.payload.elementDetails],
      };
    }
    //if we don't find that conatiner id
    //so that there is something inside the conatiner
    else if (item.content && Array.isArray(item.content)) {
      // there is something inside the container and item is an array

      //here we starts the recursive function  and call the function again
      return {
        ...item,
        content: addAnElement(item.content, action),
      };
    }
    // return the item
    return item;
  });
};

// export const updateAnElement = (
//   editorArray: EditorElement[],
//   action: EditorAction
// ): EditorElement[] => {
//   //checking the action type
//   if (action.type !== "UPDATE_ELEMENT") {
//     throw Error("you sent the wrong action type to the update ELement State");
//   }

//   return editorArray.map((item) => {
//     //if we found the element that we are going to update
//     if (item.id === action.payload.elementDetails.id) {
//       //add the exsisting item and also new item
//       return { ...item, ...action.payload.elementDetails };
//     }
//     //if we not found the element id
//     else if (item.content && Array.isArray(item.content)) {
//       return {
//         ...item,
//         content: updateAnElement(item.content, action),
//       };
//     }
//     return item;
//   });
// };
