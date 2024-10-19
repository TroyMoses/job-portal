"use client";

import * as React from "react";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useToast } from "../../../../components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Doc } from "../../../../../convex/_generated/dataModel";

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

export default function EditJob({ params }: { params: { id: Doc<"jobs"> } }) {
  const jobId = params.id._id;

  const job = useQuery(api.jobs.getJobById, { jobId });

  const { toast } = useToast();
  const organization = useOrganization();
  const user = useUser();
  const router = useRouter();

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

  useEffect(() => {
    if (job) {
      form.reset({
        title: job.title,
        salaryScale: job.salaryScale,
        reportsTo: job.reportsTo,
        responsibleFor: job.responsibleFor,
        purpose: job.purpose,
        keyOutputs: job.keyOutputs,
        keyFunctions: job.keyFunctions,
        qualifications: job.qualifications,
        experiences: job.experiences,
        competences: job.competences,
      });
    }
  }, [job]);

  const {
    fields: responsibleForFields,
    append: appendResponsibleFor,
    remove: removeResponsibleFor,
  } = useFieldArray({
    control: form.control,
    name: "responsibleFor",
  });

  // Manage the "keyOutputs" array
  const {
    fields: keyOutputFields,
    append: appendKeyOutput,
    remove: removeKeyOutput,
  } = useFieldArray({
    control: form.control,
    name: "keyOutputs",
  });

  // Manage the "keyFunctions" array
  const {
    fields: keyFunctionFields,
    append: appendKeyFunction,
    remove: removeKeyFunction,
  } = useFieldArray({
    control: form.control,
    name: "keyFunctions",
  });

  // Manage the "qualifications" array
  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({
    control: form.control,
    name: "qualifications",
  });

  // Manage the "experiences" array
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  // Manage the "competences" array
  const {
    fields: competenceFields,
    append: appendCompetence,
    remove: removeCompetence,
  } = useFieldArray({
    control: form.control,
    name: "competences",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateJob({
        jobId,
        ...values,
      });

      toast({
        variant: "success",
        title: "Job Updated",
        description: "The job has been successfully updated",
      });
      router.push(`/admin/jobs`);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "The job could not be updated, try again later",
      });
    }
  }

  const updateJob = useMutation(api.jobs.updateJob);

  return (
    <div className="mx-auto p-10 w-[80%]">
      <h1 className="mb-8 text-3xl font-semibold">Edit Job</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Job Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Salary Scale */}
          <FormField
            control={form.control}
            name="salaryScale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Scale</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Reports To */}
          <FormField
            control={form.control}
            name="reportsTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reports To</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Responsible For (Array Field) */}
          {responsibleForFields.map((field, index) => (
            <div key={field.id} className="space-y-4 border p-4">
              <h2>Responsible For</h2>
              <FormField
                control={form.control}
                name={`responsibleFor.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsible For</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="destructive"
                onClick={() => removeResponsibleFor(index)}
                className="text-sm px-2 py-1"
              >
                Remove Person
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => appendResponsibleFor({ name: "" })}
            className="text-sm px-2 py-1"
          >
            Add Another Person
          </Button>

          {/* Purpose */}
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purpose of the Job</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Key Outputs (Array Field) */}
          {keyOutputFields.map((field, index) => (
            <div key={field.id} className="space-y-4 border p-4">
              <h2>Key Outputs</h2>
              <FormField
                control={form.control}
                name={`keyOutputs.${index}.output`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Output</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeKeyOutput(index)}
                className="text-sm px-2 py-1"
              >
                Remove Output
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => appendKeyOutput({ output: "" })}
            className="text-sm px-2 py-1"
          >
            Add Another Output
          </Button>

          {/* Key Functions (Array Field) */}
          {keyFunctionFields.map((field, index) => (
            <div key={field.id} className="space-y-4 border p-4">
              <h2>Key Functions of the Job</h2>
              <FormField
                control={form.control}
                name={`keyFunctions.${index}.function`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Function</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeKeyFunction(index)}
                className="text-sm px-2 py-1"
              >
                Remove Function
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => appendKeyFunction({ function: "" })}
            className="text-sm px-2 py-1"
          >
            Add Another Function
          </Button>

          {/* Qualifications (Array Field) */}
          {qualificationFields.map((field, index) => (
            <div key={field.id} className="space-y-4 border p-4">
              <h2>Qualifications For the Job</h2>
              <FormField
                control={form.control}
                name={`qualifications.${index}.qualification`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualification</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeQualification(index)}
                className="text-sm px-2 py-1"
              >
                Remove Qualification
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => appendQualification({ qualification: "" })}
            className="text-sm px-2 py-1"
          >
            Add Another Qualification
          </Button>

          {/* Experiences (Array Field) */}
          {experienceFields.map((field, index) => (
            <div key={field.id} className="space-y-4 border p-4">
              <h2>Experiences Required</h2>
              <FormField
                control={form.control}
                name={`experiences.${index}.experience`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeExperience(index)}
                className="text-sm px-2 py-1"
              >
                Remove Experience
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => appendExperience({ experience: "" })}
            className="text-sm px-2 py-1"
          >
            Add Another Experience
          </Button>

          {/* Competences (Array Field) */}
          {competenceFields.map((field, index) => (
            <div key={field.id} className="space-y-4 border p-4">
              <h2>Competences For the Job</h2>
              <FormField
                control={form.control}
                name={`competences.${index}.competence`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competence</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeCompetence(index)}
                className="text-sm px-2 py-1"
              >
                Remove Competence
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => appendCompetence({ competence: "" })}
            className="text-sm px-2 py-1"
          >
            Add Another Competence
          </Button>

          {/* Update Button */}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="flex gap-1"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Update Job
          </Button>
        </form>
      </Form>
    </div>
  );
}
