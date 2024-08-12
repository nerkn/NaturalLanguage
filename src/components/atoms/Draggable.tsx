import { useDraggable } from "@dnd-kit/core";
import { DraggableProps } from "../../lib/types";

export const Draggable: React.FC<DraggableProps> = ({ id, children, used }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`
  };

  return (
    <div className={"Draggable" + (used ? " used" : "")} ref={setNodeRef} style={style} {...listeners} {...attributes} >
      {children}
    </div>
  );
};

