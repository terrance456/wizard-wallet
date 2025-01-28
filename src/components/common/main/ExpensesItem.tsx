import React from "react";
import { Button } from "../../ui/button";
import { type useSortable } from "@dnd-kit/sortable";
import { CheckIcon, DragHandleDots2Icon, TimerIcon, TrashIcon } from "@radix-ui/react-icons";
import { MonthlyDebt } from "@prisma/client";

type AttributesDnDT = ReturnType<typeof useSortable>["attributes"];

type ListnersDnDT = ReturnType<typeof useSortable>["listeners"];

export interface ExpensesItemProps {
  info: MonthlyDebt;
  dragAttrHandler: AttributesDnDT;
  dragListnerHandler: ListnersDnDT;
  isEdit?: boolean;
  onMarkAsPaid: () => void;
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
            <div className="ml-auto">
              <Button variant="outline" size="sm" className="text-xs h-6 mt-2" onClick={props.onMarkAsPaid}>
                {props.info.pending ? (
                  <span className="flex ">
                    unpaid <TimerIcon className="ms-1 text-yellow-600" />
                  </span>
                ) : (
                  <span className="flex ">
                    paid <CheckIcon className="ms-1 text-green-700" />
                  </span>
                )}
              </Button>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">{props.info.subTitle}</div>
        </div>
        <div className="flex w-full justify-between gap-2">
          <span className="line-clamp-2 text-2xl font-bold">RM {props.info.amount}</span>
          <div className="flex flex-col"></div>
        </div>
        {props.isEdit && (
          <Button size="sm" className="text-xs h-6" variant="destructive" onClick={() => props.onDelete(props.info)}>
            Remove <TrashIcon className="ms-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExpensesItem;
