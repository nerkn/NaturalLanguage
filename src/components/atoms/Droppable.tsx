import { useDroppable } from "@dnd-kit/core";
import { DroppableProps } from "../../lib/types"; 

export const Droppable: React.FC<DroppableProps> = ({ id, children }) => {
    const { setNodeRef } = useDroppable({ id });  
    return (
      <div ref={setNodeRef}  className="Droppable">
        {children}
      </div>
    );
  };