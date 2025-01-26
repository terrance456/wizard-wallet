import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ExpensesItem, { ExpensesItemProps } from "./ExpensesItem";
import { cn } from "@/lib/utils";
import { MonthlyDebt } from "@prisma/client";

interface SortableExpensesItem extends Omit<ExpensesItemProps, "dragAttrHandler" | "dragListnerHandler"> {
  dragId: string;
  isEdit?: boolean;
  onDelete: (info: MonthlyDebt) => void;
}

const SortableExpensesItem: React.FC<SortableExpensesItem> = (props: SortableExpensesItem) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.dragId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging && "z-[1]")}>
      <ExpensesItem {...props} dragAttrHandler={attributes} dragListnerHandler={listeners} />
    </div>
  );
};

export default SortableExpensesItem;
