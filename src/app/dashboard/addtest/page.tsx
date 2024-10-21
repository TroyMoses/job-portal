"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";

import { useMutation } from "convex/react";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { api } from "../../../../convex/_generated/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  aptitudeTest: z.array(
    z.object({
      question: z.string().min(5, "Question is required"),
      answer: z.string().min(5, "Answer is required"),
    })
  ),
});

export default function AddTest() {
  const { toast } = useToast();
  const user = useUser();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aptitudeTest: [{ question: "", answer: "" }],
    },
  });

  // Manage the "aptitudeTest" array
  const {
    fields: aptitudeTestFields,
    append: appendAptitudeTest,
    remove: removeAptitudeTest,
  } = useFieldArray({
    control: form.control,
    name: "aptitudeTest",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createTest({
        aptitudeTest: values.aptitudeTest,
      });

      form.reset();

      toast({
        variant: "success",
        title: "Test Uploaded",
        description: "Now the shortlisted applicants can view and attempt the test",
      });
      router.push(`/dashboard/aptitude-test`);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "The test could not be uploaded, try again later",
      });
    }
  }

  const createTest = useMutation(api.aptitude.createTest);

  return (
    <div className="mx-auto p-10 w-[80%]">
      <h1 className="mb-8 text-3xl font-semibold">Create An Aptitude Test Here</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {aptitudeTestFields.map((field, index) => (
            <div key={index} className="space-y-4 border p-4">
              <FormField
                control={form.control}
                name={`aptitudeTest.${index}.question`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`aptitudeTest.${index}.answer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Answer to the question"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Remove question entry button */}
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeAptitudeTest(index)}
                className="text-sm px-2 py-1"
              >
                Remove Question
              </Button>
            </div>
          ))}

          {/* Button to add question function */}
          <Button
            type="button"
            onClick={() => appendAptitudeTest({ question: "", answer: "" })}
            className="text-sm px-2 py-1"
          >
            Add Another Question
          </Button>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="flex gap-1"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Create Test
          </Button>
        </form>
      </Form>
    </div>
  );
}
