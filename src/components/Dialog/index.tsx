import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useToast } from "../ui/use-toast";
import { Id } from "../../../convex/_generated/dataModel";

export function AddScoreDialog({
  applicantId,
  commissionerField,
  onClose,
}: {
  applicantId: Id<"results">;
  commissionerField: string;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [score, setScore] = useState("");
  const [error, setError] = useState<string | null>(null);
  const updateInterviewScore = useMutation(api.results.updateInterviewScore);

  const handleSubmit = async () => {
    const parsedScore = Number(score);

    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      setError("Please enter a valid score between 0 and 100.");
      return;
    }

    setError(null); // Clear previous errors
    await updateInterviewScore({
      applicantId,
      score: parsedScore,
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
    <Dialog
      open
      //@ts-ignore
      onClose={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Interview Score</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Enter Score (0-100)"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="mb-4"
        />
        {error && <p className="text-red-600">{error}</p>}
        <Button onClick={handleSubmit}>Submit Score</Button>
      </DialogContent>
    </Dialog>
  );
}
