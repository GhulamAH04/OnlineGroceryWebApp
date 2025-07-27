"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/features2/ui/dialog";
import { Button } from "@/components/features2/ui/button";

export interface ConfirmModalProps {
  open: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  open,
  onCancel,
  onConfirm,
  title = "Konfirmasi",
  description = "Apakah kamu yakin ingin melanjutkan tindakan ini?",
  confirmText = "Ya",
  cancelText = "Batal",
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-500">{description}</p>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
