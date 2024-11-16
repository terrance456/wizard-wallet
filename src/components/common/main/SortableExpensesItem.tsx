import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ExpensesItem, { ExpensesItemProps } from "./ExpensesItem";

interface SortableExpensesItem extends ExpensesItemProps {
  dragId: string;
}

const SortableExpensesItem: React.FC<SortableExpensesItem> = (props: SortableExpensesItem) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.dragId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ExpensesItem {...props} />
    </div>
  );
};

export default SortableExpensesItem;
