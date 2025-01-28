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
import { debounce } from "@/src/utils";
import { cn } from "@/lib/utils";
import { Pencil1Icon, PlusIcon } from "@radix-ui/react-icons";
import { useToast } from "@/src/hooks/use-toast";
import BalanceAmount from "./BalanceAmount";

interface ExpensesViewProps {
  data: Array<MonthlyDebt>;
}

const initialSort = (data: Array<MonthlyDebt>) => {
  return [...data].sort((a, b) => {
    return a.positionIndex - b.positionIndex;
  });
};

const ExpensesView: React.FC<ExpensesViewProps> = (props: ExpensesViewProps) => {
  const [list, setList] = React.useState<Array<MonthlyDebt>>(initialSort(props.data));
  const sensors = useSensors(useSensor(PointerSensor));
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = React.useState<Pick<ConfirmDialogProps, "content" | "open"> | null>(null);
  const [currentDeleteDebt, setCurrentDeleteDebt] = React.useState<MonthlyDebt | null>(null);
  const [isLoadingDelete, setIsLoadingDelete] = React.useState<boolean>(false);
  const [showAddExpensesModal, setShowAddExpensesModal] = React.useState<boolean>(false);
  const [addExpensesError, setAddExpensesError] = React.useState<string>("");
  const { toast } = useToast();

  const onClickEdit = () => {
    setIsEdit((prevEdit: boolean) => !prevEdit);
  };

  const onClickAddExpenses = () => {
    setAddExpensesError("");
    setShowAddExpensesModal(true);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = list.findIndex((item) => item.id === active.id);
      const newIndex = list.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(list, oldIndex, newIndex);
      setList(newItems);
      await nextFetch(ApiRoutes.updatePosition, { method: "PATCH", body: JSON.stringify(newItems.map(({ id }, index: number) => ({ id, position: index }))) }, false);
    }
  };

  const onDelete = async () => {
    setIsLoadingDelete(true);
    try {
      await nextFetch(ApiRoutes.deleteDebt, { method: "DELETE", body: JSON.stringify({ id: currentDeleteDebt?.id }) }, false);
      await revalidateNextTags("getMonthDebtList");
    } catch {
      toast({ title: "Uh oh! Something went wrong.", description: "There was a problem with your request.", variant: "destructive" });
    } finally {
      setIsLoadingDelete(false);
      setConfirmDialog(null);
      setCurrentDeleteDebt(null);
    }
  };

  const onAddExpenses = async (info: AddExpensesSchemaT) => {
    setAddExpensesError("");
    try {
      await nextFetch(ApiRoutes.addMonthlyDebt, { method: "POST", body: JSON.stringify({ ...info, positionIndex: list.length + 1 }) }, false);
      await revalidateNextTags("getMonthDebtList");
      setShowAddExpensesModal(false);
    } catch {
      setAddExpensesError("Failed to submit new expenses, please try again");
    }
  };

  const onCancel = () => {
    setConfirmDialog(null);
    setCurrentDeleteDebt(null);
  };

  const showConfirmModal = (info: MonthlyDebt) => {
    setCurrentDeleteDebt(info);
    setConfirmDialog({ open: true, content: info.title });
  };

  const onMarkAsPaid = async (item: MonthlyDebt) => {
    setList((prevList: Array<MonthlyDebt>) => prevList.map((prevItem: MonthlyDebt) => (prevItem.id === item.id ? { ...prevItem, pending: !item.pending } : prevItem)));
    try {
      await nextFetch(ApiRoutes.updatePaidStatus, { method: "PATCH", body: JSON.stringify({ id: item.id, pending: !item.pending }) }, false);
    } catch {
      setList((prevList: Array<MonthlyDebt>) => prevList.map((prevItem: MonthlyDebt) => (prevItem.id === item.id ? { ...prevItem, pending: !item.pending } : prevItem)));
      toast({ title: "Uh oh! Something went wrong.", description: "There was a problem with your request.", variant: "destructive" });
    }
  };

  const debouncedOnMarkAsPaid = debounce(onMarkAsPaid);

  React.useEffect(() => {
    setList(initialSort(props.data));
  }, [props.data]);

  return (
    <>
      <section className="w-full mt-5 pb-5">
        <div className="flex flex-col items-start sm:justify-between sm:flex-row sm:items-center">
          <BalanceAmount data={list} />
          <div className="sm:mt-0 mt-3">
            <Button variant="secondary" size="sm" className="mr-3" onClick={onClickAddExpenses}>
              Add expenses <PlusIcon className="ms-1" />
            </Button>
            <Button size="sm" onClick={onClickEdit}>
              Edit <Pencil1Icon className="ms-1" />
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <div className={cn("flex flex-col gap-3 mt-5 xl:w-[65%] lg:w-[75%] md:w-[90%] w-full mb-3", isEdit && "xl:w-[75%] lg:w-[85%] md:w-[100%]")}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={list} strategy={verticalListSortingStrategy}>
                {list.map((item: MonthlyDebt) => (
                  <SortableExpensesItem key={item.id} dragId={item.id} info={item} onMarkAsPaid={() => debouncedOnMarkAsPaid(item)} isEdit={isEdit} onDelete={showConfirmModal} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </section>
      {showAddExpensesModal && <AddExpensesDialog open onOpenChange={() => setShowAddExpensesModal(false)} onSubmission={onAddExpenses} error={addExpensesError} />}
      {confirmDialog && <ConfirmDialog {...confirmDialog} onOpenChange={() => setConfirmDialog(null)} header="Are you sure?" onConfirm={onDelete} onCancel={onCancel} isLoading={isLoadingDelete} />}
    </>
  );
};

export default ExpensesView;
