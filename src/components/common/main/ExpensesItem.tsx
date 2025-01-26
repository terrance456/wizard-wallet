import React from "react";
import { Button } from "../../ui/button";
import { type useSortable } from "@dnd-kit/sortable";
import { DragHandleDots2Icon, TrashIcon } from "@radix-ui/react-icons";
import { MonthlyDebt } from "@prisma/client";

type AttributesDnDT = ReturnType<typeof useSortable>["attributes"];

type ListnersDnDT = ReturnType<typeof useSortable>["listeners"];

export interface ExpensesItemProps {
  info: MonthlyDebt;
  dragAttrHandler: AttributesDnDT;
  dragListnerHandler: ListnersDnDT;
  isEdit?: boolean;
  onMarkAsDone: () => void;
  onDelete: (info: MonthlyDebt) => void;
}

const ExpensesItem: React.FC<ExpensesItemProps> = (props: ExpensesItemProps) => {
  return (
    <div className="flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-all dark:bg-slate-900 bg-white">
      {props.isEdit && (
        <div {...props.dragAttrHandler} {...props.dragListnerHandler}>
          <DragHandleDots2Icon className="h-5 w-5 mr-3 cursor-grab" />
        </div>
      )}
      <div className="flex flex-col items-start w-full gap-2">
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{props.info.title}</div>
            </div>
            <div className="ml-auto text-xs text-muted-foreground">{new Date(props.info.createdAt).toISOString()}</div>
          </div>
          <div className="text-xs font-medium">{props.info.subTitle}</div>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground">{props.info.content}</div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="text-xs h-6 mt-3">
            Mark as done
          </Button>
        </div>
      </div>
      {props.isEdit && (
        <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => props.onDelete(props.info)}>
          <TrashIcon className="h-5 w-5 cursor-pointer" />
        </Button>
      )}
    </div>
  );
};

export default ExpensesItem;
