import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { DialogHeader, DialogFooter } from "../ui/dialog";
import { Loader2 } from "lucide-react";

export interface ConfirmDialogProps {
  header: string;
  content: string;
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ header, content, onCancel, onConfirm, isLoading, ...props }: ConfirmDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent
        onInteractOutside={
          isLoading
            ? (e) => {
                e.preventDefault();
              }
            : undefined
        }
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle className="mb-2">{header}</DialogTitle>
          <DialogDescription>{content}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onCancel} disabled={isLoading} size="sm" variant="outline">
            Cancel
          </Button>
          <Button onClick={onConfirm} size="sm" variant="destructive" disabled={isLoading}>
            Delete
            {isLoading && <Loader2 className="animate-spin ml-1 h-3 w-3" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
