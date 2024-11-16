"use client";
import React from "react";
import { Button } from "../../ui/button";
import { MonthlyDebt } from "@prisma/client";
import SortableExpensesItem from "./SortableExpensesItem";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { nextFetch } from "@/src/apis/fetch";
import { ApiRoutes } from "@/src/apis/routes.enum";

interface ExpensesViewProps {
  data: Array<MonthlyDebt>;
}

const initialSort = (data: Array<MonthlyDebt>) => {
  return [...data].sort((a, b) => a.positionIndex - b.positionIndex);
};

const ExpensesView: React.FC<ExpensesViewProps> = (props: ExpensesViewProps) => {
  const [list, setList] = React.useState<Array<MonthlyDebt>>(initialSort(props.data));
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = list.findIndex((item) => item.id === active.id);
      const newIndex = list.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(list, oldIndex, newIndex);
      setList(newItems);
      nextFetch(ApiRoutes.updatePosition, { method: "PUT", body: JSON.stringify(newItems.map(({ id }, index) => ({ id, position: index }))) }, false).then();
    }
  };

  React.useEffect(() => {
    setList(initialSort(props.data));
  }, [props.data]);

  return (
    <section className="w-full mt-5">
      <div className="flex justify-end">
        <Button variant="secondary" size="sm" className="mr-3">
          Add expenses
        </Button>
        <Button size="sm">Edit</Button>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col gap-3 mt-5 xl:w-[55%] md:w-[80%] mb-3">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={list} strategy={verticalListSortingStrategy}>
              {list.map((item: MonthlyDebt) => (
                <SortableExpensesItem key={item.id} dragId={item.id} content={item.content} title={item.title} subTitle={item.subTitle} date={item.createdAt as any} onMarkAsDone={console.log} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </section>
  );
};

export default ExpensesView;
