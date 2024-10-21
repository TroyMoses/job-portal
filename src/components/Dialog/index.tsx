import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useToast } from "../ui/use-toast";

export function AddScoreDialog({
  applicantId,
  commissionerField,
  onClose,
}: {
  applicantId: string;
  commissionerField: string;
  onClose: () => void;
}) {
    const { toast } = useToast();
  const [score, setScore] = useState("");
  const updateInterviewScore = useMutation(api.results.updateInterviewScore);

  const handleSubmit = async () => {
    if (!score || isNaN(Number(score))) {
      return alert("Please enter a valid score");
    }

    await updateInterviewScore({
      applicantId,
      score: Number(score),
      field: commissionerField,
    });

    onClose();

    toast({
        variant: "success",
        title: "Score Added",
        description: "The interview score has been added successfully!",
      });
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Interview Score</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Enter Score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleSubmit}>Submit Score</Button>
      </DialogContent>
    </Dialog>
  );
}
