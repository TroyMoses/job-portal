import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

interface RejectionReasonDialogProps {
  onSubmit: (reason: string) => void;
  onClose: () => void;
}

export function RejectionReasonDialog({
  onSubmit,
  onClose,
}: RejectionReasonDialogProps) {
  const [reason, setReason] = useState("");

  return (
    <Dialog
      open
      //@ts-ignore
      onClose={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejection Reason</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Enter reason for not shortlisting"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mb-4"
        />
        <div className="flex gap-4">
          <Button onClick={() => onSubmit(reason)} disabled={!reason}>
            Submit
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
