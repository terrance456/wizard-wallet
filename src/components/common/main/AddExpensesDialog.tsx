import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

const stringValidation = z.string().min(1, { message: "Must be at least 1 character long." }).max(100, { message: "Cannot exceed 100 characters." });

const AddExpensesSchema = z.object({
  title: stringValidation,
  subTitle: stringValidation,
  content: stringValidation,
  amount: z.number({ message: "Required field" }).max(10000000, "Cannot exceed 10000000."),
});

export type AddExpensesSchemaT = z.infer<typeof AddExpensesSchema>;

interface AddExpensesDialogProps {
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmission: (data: AddExpensesSchemaT) => Promise<any>;
}

const AddExpensesDialog: React.FC<AddExpensesDialogProps> = ({ onSubmission, ...props }: AddExpensesDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddExpensesSchemaT>({ resolver: zodResolver(AddExpensesSchema) });
  const [isFormLoading, setIsFormLoading] = React.useState<boolean>(false);

  const onSubmit = async (data: AddExpensesSchemaT) => {
    setIsFormLoading(true);
    await onSubmission(data);
    setIsFormLoading(false);
  };

  return (
    <Dialog {...props}>
      <DialogContent
        disableCloseBtn={isFormLoading}
        className="sm:max-w-[425px]"
        onInteractOutside={
          isFormLoading
            ? (e) => {
                e.preventDefault();
              }
            : undefined
        }
      >
        <DialogHeader>
          <DialogTitle>Add new expenses</DialogTitle>
          <DialogDescription>Add your new expenses, be breif. Click save when re done.</DialogDescription>
        </DialogHeader>
        <form id="add-monthly-debt-form" className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title">Title</Label>
            <Input disabled={isFormLoading} placeholder="Food" id="title" wrapperClassName="col-span-3" {...register("title")} errorMessage={errors.title?.message} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes">Notes</Label>
            <Input disabled={isFormLoading} placeholder="Every month RM 1000" id="notes" wrapperClassName="col-span-3" {...register("subTitle")} errorMessage={errors.subTitle?.message} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content">Content</Label>
            <Input disabled={isFormLoading} placeholder="remaining 5000" id="content" wrapperClassName="col-span-3" {...register("content")} errorMessage={errors.content?.message} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount">Amount</Label>
            <Input type="number" disabled={isFormLoading} placeholder="10000" id="amount" wrapperClassName="col-span-3" {...register("amount", { valueAsNumber: true })} errorMessage={errors.amount?.message} />
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" form="add-monthly-debt-form" disabled={isFormLoading}>
            Save changes
            {isFormLoading && <Loader2 className="animate-spin ml-1 h-3 w-3" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpensesDialog;
