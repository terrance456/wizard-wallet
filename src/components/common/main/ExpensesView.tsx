"use client";
import React from "react";
import { Button } from "../../ui/button";
import { MonthlyDebt } from "@prisma/client";
import SortableExpensesItem from "./SortableExpensesItem";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { nextFetch } from "@/src/apis/fetch";
import { ApiRoutes } from "@/src/apis/routes.enum";
import ConfirmDialog, { ConfirmDialogProps } from "../ConfirmDialog";
import { revalidateNextTags } from "@/src/actions";
import AddExpensesDialog, { AddExpensesSchemaT } from "./AddExpensesDialog";

interface ExpensesViewProps {
  data: Array<MonthlyDebt>;
}

const initialSort = (data: Array<MonthlyDebt>) => {
  return [...data].sort((a, b) => a.positionIndex - b.positionIndex);
};

const ExpensesView: React.FC<ExpensesViewProps> = (props: ExpensesViewProps) => {
  const [list, setList] = React.useState<Array<MonthlyDebt>>(initialSort(props.data));
  const sensors = useSensors(useSensor(PointerSensor));
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = React.useState<Pick<ConfirmDialogProps, "content" | "open"> | null>(null);
  const [currentDeleteDebt, setCurrentDeleteDebt] = React.useState<MonthlyDebt | null>(null);
  const [isLoadingDelete, setIsLoadingDelete] = React.useState<boolean>(false);
  const [showAddExpensesModal, setShowAddExpensesModal] = React.useState<boolean>(false);

  const onClickEdit = () => {
    setIsEdit((prevEdit: boolean) => !prevEdit);
  };

  const onClickAddExpenses = () => {
    setShowAddExpensesModal(true);
  };

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

  const onDelete = () => {
    setIsLoadingDelete(true);
    nextFetch(ApiRoutes.deleteDebt, { method: "DELETE", body: JSON.stringify({ id: currentDeleteDebt?.id }) }, false)
      .then()
      .finally(async () => {
        setIsLoadingDelete(false);
        setConfirmDialog(null);
        setCurrentDeleteDebt(null);
        revalidateNextTags("getMonthDebtList");
      });
  };

  const onAddExpenses = async (info: AddExpensesSchemaT) => {
    return nextFetch(ApiRoutes.addMonthlyDebt, { method: "POST", body: JSON.stringify({ ...info, positionIndex: list.length + 1 }) }, false).then(() => {
      setShowAddExpensesModal(false);
      revalidateNextTags("getMonthDebtList");
    });
  };

  const onCancel = () => {
    setConfirmDialog(null);
    setCurrentDeleteDebt(null);
  };

  const showConfirmModal = (info: MonthlyDebt) => {
    setCurrentDeleteDebt(info);
    setConfirmDialog({ open: true, content: info.title });
  };

  React.useEffect(() => {
    setList(initialSort(props.data));
  }, [props.data]);

  return (
    <>
      <section className="w-full mt-5">
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" className="mr-3" onClick={onClickAddExpenses}>
            Add expenses
          </Button>
          <Button size="sm" onClick={onClickEdit}>
            Edit
          </Button>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-col gap-3 mt-5 xl:w-[55%] md:w-[80%] mb-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={list} strategy={verticalListSortingStrategy}>
                {list.map((item: MonthlyDebt) => (
                  <SortableExpensesItem key={item.id} dragId={item.id} info={item} onMarkAsDone={console.log} isEdit={isEdit} onDelete={showConfirmModal} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </section>
      {showAddExpensesModal && <AddExpensesDialog open onOpenChange={() => setShowAddExpensesModal(false)} onSubmission={onAddExpenses} />}
      {confirmDialog && <ConfirmDialog {...confirmDialog} onOpenChange={() => setConfirmDialog(null)} header="Are you sure?" onConfirm={onDelete} onCancel={onCancel} isLoading={isLoadingDelete} />}
    </>
  );
};

export default ExpensesView;
