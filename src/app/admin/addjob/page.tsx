"use client";

import * as React from "react";
import { Button } from "../../../components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useToast } from "../../../components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function AddJob() {
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

  // Manage the "responsibleFor" array
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

      toast({
        variant: "success",
        title: "Job Uploaded",
        description: "Now everyone can view the job",
      });
      router.push(`/admin/jobs`);
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

  const createJob = useMutation(api.jobs.createJob);

  return (
    <div className="mx-auto p-10 w-[80%]">
      <h1 className="mb-8 text-3xl font-semibold">Upload Job Here</h1>
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

          {responsibleForFields.map((field, index) => (
            <div key={field.id} className="space-y-4 border p-4">
              <h2>Responsible For</h2>

              <FormField
                control={form.control}
                name={`responsibleFor.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Respnsible For</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remove record entry button */}
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

          {/* Button to add another record */}
          <Button
            type="button"
            onClick={() => appendResponsibleFor({ name: "" })}
            className="text-sm px-2 py-1"
          >
            Add Another Person
          </Button>

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

              {/* Remove output entry button */}
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

          {/* Button to add another output */}
          <Button
            type="button"
            onClick={() => appendKeyOutput({ output: "" })}
            className="text-sm px-2 py-1"
          >
            Add Another Output
          </Button>

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

              {/* Remove function entry button */}
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

          {/* Button to add another function */}
          <Button
            type="button"
            onClick={() => appendKeyFunction({ function: "" })}
            className="text-sm px-2 py-1"
          >
            Add Another Function
          </Button>

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
            className="flex gap-1 text-lg"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Upload Job
          </Button>
        </form>
      </Form>
    </div>
  );
}
