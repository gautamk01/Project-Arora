import { EditorElement } from "@/Provider/editor/editor-reducer";
import React from "react";
import TextComponent from "./funnel-editor-components/text-component";
import Container from "./funnel-editor-components/Container-component";
import VideoComponent from "./funnel-editor-components/vedio-component";
import LinkComponent from "./funnel-editor-components/link-component";
import TwoColumns from "./funnel-editor-components/2col-component";

type Props = {
  element: EditorElement;
};

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;
    case "__body":
      return <Container element={element} />; //Explained Little Deeper inside the component
    case "container":
      return <Container element={element} />;
    case "video":
      return <VideoComponent element={element} />;
    case "link":
      return <LinkComponent element={element} />;
    case "2Col":
      return <TwoColumns element={element} />;
    default:
      return null;
  }
};

export default Recursive;
