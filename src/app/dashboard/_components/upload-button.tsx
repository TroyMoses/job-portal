"use client";

import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  salaryScale: z.string().min(1).max(200),
  reportsTo: z.string().min(1).max(200),
  responsibleFor: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
    })
  ),
  purpose: z.string().min(1).max(900),
  keyOutputs: z.array(
    z.object({
      output: z.string().min(1, "Key output is required"),
    })
  ),
  keyFunctions: z.array(
    z.object({
      function: z.string().min(1, "Key functions is required"),
    })
  ),
  qualifications: z.array(
    z.object({
        qualification: z.string().min(1, "Qualification is required"),
    })
  ),
  experiences: z.array(
    z.object({
        experience: z.string().min(1, "Experience is required"),
    })
  ),
  competences: z.array(
    z.object({
        competence: z.string().min(1, "Competence is required"),
    })
  ),
});

export function UploadButton() {
  const { toast } = useToast();
  const organization = useOrganization();
  const user = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      salaryScale: "",
      reportsTo: "",
      responsibleFor: [{ name: "" }],
      purpose: "",
      keyOutputs: [{ output: "" }],
      keyFunctions: [{ function: "" }],
      qualifications: [{ qualification: "" }],
      experiences: [{ experience: "" }],
      competences: [{ competence: "" }],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) return;

    try {
      await createJob({
        title: values.title,
        salaryScale: values.salaryScale,
        reportsTo: values.reportsTo,
        responsibleFor: values.responsibleFor,
        purpose: values.purpose,
        keyOutputs: values.keyOutputs,
        keyFunctions: values.keyFunctions,
        qualifications: values.qualifications,
        experiences: values.experiences,
        competences: values.competences,
        orgId,
      });

      form.reset();

      setIsFileDialogOpen(false);

      toast({
        variant: "success",
        title: "Job Uploaded",
        description: "Now everyone can view the job",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "The job could not be uploaded, try again later",
      });
    }
  }

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const createJob = useMutation(api.jobs.createJob);

  return (
    <Dialog
      open={isFileDialogOpen}
      onOpenChange={(isOpen) => {
        setIsFileDialogOpen(isOpen);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-8">Upload your File Here</DialogTitle>
          <DialogDescription>
            This file will be accessible by anyone in your organization
          </DialogDescription>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex gap-1"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
