import React from "react";
import { Button } from "../../ui/button";

export interface ExpensesItemProps {
  title: string;
  subTitle: string;
  content: string;
  date: Date;
  onMarkAsDone: () => void;
}

const ExpensesItem: React.FC<ExpensesItemProps> = (props: ExpensesItemProps) => {
  return (
    <div className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent cursor-pointer">
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{props.title}</div>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">{new Date(props.date).toISOString()}</div>
        </div>
        <div className="text-xs font-medium">{props.subTitle}</div>
      </div>
      <div className="line-clamp-2 text-xs text-muted-foreground">{props.content}</div>
      <div className="flex items-center gap-2">
        <Button size="sm" className="text-xs h-6">
          Mark as done
        </Button>
      </div>
    </div>
  );
};

export default ExpensesItem;
