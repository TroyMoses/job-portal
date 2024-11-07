"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  salaryScale: z.string().min(1).max(200),
  reportsTo: z.string().min(1).max(200),
  purpose: z.string().min(1).max(900),
  keyFunctions: z.array(
    z.object({ function: z.string().min(1, "Key function is required") })
  ),
  qualifications: z.array(
    z.object({ qualification: z.string().min(1, "Qualification is required") })
  ),
  experiences: z.array(
    z.object({ experience: z.string().min(1, "Experience is required") })
  ),
  competences: z.array(
    z.object({ competence: z.string().min(1, "Competence is required") })
  ),
});

export default function EditJob({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  const jobId = params.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      salaryScale: "",
      reportsTo: "",
      purpose: "",
      keyFunctions: [{ function: "" }],
      qualifications: [{ qualification: "" }],
      experiences: [{ experience: "" }],
      competences: [{ competence: "" }],
    },
  });

  const jobData = useQuery(
    api.jobs.getJobById,
    // @ts-ignore
    { jobId }
  );
  const updateJob = useMutation(api.jobs.updateJob);

  useEffect(() => {
    if (jobData) {
      form.reset({
        title: jobData.title,
        salaryScale: jobData.salaryScale,
        reportsTo: jobData.reportsTo,
        purpose: jobData.purpose,
        keyFunctions: jobData.keyFunctions,
        qualifications: jobData.qualifications,
        experiences: jobData.experiences,
        competences: jobData.competences,
      });
    }
  }, [jobData, form]);

  const {
    fields: keyFunctionFields,
    append: appendKeyFunction,
    remove: removeKeyFunction,
  } = useFieldArray({ control: form.control, name: "keyFunctions" });

  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({ control: form.control, name: "qualifications" });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({ control: form.control, name: "experiences" });

  const {
    fields: competenceFields,
    append: appendCompetence,
    remove: removeCompetence,
  } = useFieldArray({ control: form.control, name: "competences" });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateJob(
        // @ts-ignore
        { jobId, ...values }
      );
      toast({
        variant: "success",
        title: "Job Updated",
        description: "The job has been updated successfully",
      });
      router.push(`/dashboard/jobs`);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "The job could not be updated",
      });
    }
  }

  if (!userLoaded || !jobData) return <Loader2 className="animate-spin" />;

  return (
    <div className="mx-auto p-10 w-[80%]">
      <h1 className="mb-8 text-3xl font-semibold">Edit Job</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

          {keyFunctionFields.map((field, index) => (
            <div key={field.id} className="space-y-4 border p-4">
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
                className="text-sm"
              >
                Remove Function
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => appendKeyFunction({ function: "" })}
            className="text-sm"
          >
            Add Another Function
          </Button>

          {qualificationFields.map((field, index) => (
            <div key={field.id} className="space-y-4 border p-4">

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

              {/* Remove qualification entry button */}
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

          {/* Button to add another qualification */}
          <Button
            type="button"
            onClick={() => appendQualification({ qualification: "" })}
            className="text-sm px-2 py-1"
          >
            Add Another Qualification
          </Button>

          {experienceFields.map((field, index) => (
            <div key={field.id} className="space-y-4 border p-4">

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

              {/* Remove experience entry button */}
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

          {/* Button to add another experience */}
          <Button
            type="button"
            onClick={() => appendExperience({ experience: "" })}
            className="text-sm px-2 py-1"
          >
            Add Another Experience
          </Button>

          {competenceFields.map((field, index) => (
            <div key={field.id} className="space-y-4 border p-4">

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

              {/* Remove competence entry button */}
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

          {/* Button to add another competence */}
          <Button
            type="button"
            onClick={() => appendCompetence({ competence: "" })}
            className="text-sm px-2 py-1"
          >
            Add Another Competence
          </Button>

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
