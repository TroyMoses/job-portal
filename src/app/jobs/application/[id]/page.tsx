"use client";

import JobCard from "../../../../components/helpers/JobCard";
import { JobData } from "../../../../jobs/data";
import React from "react";
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
import { api } from "../../../../../convex/_generated/api";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Doc } from "../../../../../convex/_generated/dataModel";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  post: z.string().min(1).max(200),
  name: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`),
  dateOfBirth: z.string().min(1).max(200),
  yesNoChoice: z.enum(["yes", "no"], {
    required_error: "Yes or No choice is required",
  }),
  email: z.string().min(1).max(200),
  telephone: z.string().min(1).max(200),
  postalAddress: z.string().min(1).max(500),
  nationality: z.string().min(1).max(200),
  homeDistrict: z.string().min(1).max(200),
  subcounty: z.string().min(1).max(200),
  village: z.string().min(1).max(200),
  presentministry: z.string().min(1).max(500),
  presentpost: z.string().min(1).max(500),
  presentsalary: z.string().min(1).max(300),
  termsofemployment: z.string().min(1).max(100),
  maritalstatus: z.string().min(1).max(100),
  children: z.string().min(1).max(100),
  schools: z.array(
    z.object({
      year: z
        .string()
        .min(4, "Enter a valid year")
        .max(4, "Enter a valid year"),
      schoolName: z.string().min(1, "School name is required"),
      award: z.string().min(1, "Award is required"),
    })
  ),
  employmentrecord: z.array(
    z.object({
      year: z
        .string()
        .min(4, "Enter a valid year")
        .max(4, "Enter a valid year"),
      position: z.string().min(1, "Position is required"),
      employer: z.string().min(1, "Employer details are required"),
    })
  ),
  uceyear: z.string().min(1).max(100),
});

const JobApplication = ({ params }: { params: { id: string } }) => {
  const singleJob = JobData.find((job) => job.id.toString() == params.id);

  const { toast } = useToast();
  const organization = useOrganization();
  const user = useUser();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      post: "",
      name: "",
      file: undefined,
      dateOfBirth: "",
      yesNoChoice: "yes",
      email: "",
      telephone: "",
      postalAddress: "",
      nationality: "",
      homeDistrict: "",
      subcounty: "",
      village: "",
      presentministry: "",
      presentpost: "",
      presentsalary: "",
      termsofemployment: "",
      maritalstatus: "",
      children: "",
      schools: [{ year: "", schoolName: "", award: "" }],
      employmentrecord: [{ year: "", position: "", employer: "" }],
      uceyear: "",
    },
  });

  // Manage the "schools" array
  const {
    fields: schoolFields,
    append: appendSchool,
    remove: removeSchool,
  } = useFieldArray({
    control: form.control,
    name: "schools",
  });

  // Manage the "employmentrecord" array
  const {
    fields: employmentFields,
    append: appendEmployment,
    remove: removeEmployment,
  } = useFieldArray({
    control: form.control,
    name: "employmentrecord",
  });

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) return;

    const postUrl = await generateUploadUrl();

    const fileType = values.file[0].type;

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": fileType },
      body: values.file[0],
    });
    const { storageId } = await result.json();

    const types = {
      "image/png": "image",
      "application/pdf": "pdf",
      "text/csv": "csv",
      "application/vnd.ms-powerpoint": "ppt",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        "pptx",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "docx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "xlsx",
    } as Record<string, Doc<"files">["type"]>;

    try {
      await createFile({
        post: values.post,
        name: values.name,
        fileId: storageId,
        orgId,
        type: types[fileType],
        dateOfBirth: values.dateOfBirth,
        yesNoChoice: values.yesNoChoice,
        email: values.email,
        telephone: values.telephone,
        postalAddress: values.postalAddress,
        nationality: values.nationality,
        homeDistrict: values.homeDistrict,
        subcounty: values.subcounty,
        village: values.village,
        presentministry: values.presentministry,
        presentpost: values.presentpost,
        presentsalary: values.presentsalary,
        termsofemployment: values.termsofemployment,
        maritalstatus: values.maritalstatus,
        children: values.children,
        schools: values.schools,
        employmentrecord: values.employmentrecord,
        uceyear: values.uceyear,
      });

      form.reset();

      setIsFileDialogOpen(false);

      toast({
        variant: "success",
        title: "File Uploaded",
        description: "Now everyone can view your file",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Your file could not be uploaded, try again later",
      });
    }
  }

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const createFile = useMutation(api.files.createFile);

  return (
    <div className="mt-20 mb-12">
      <div className="block sm:flex items-center justify-between w-[80%] mx-auto">
        <div className="flex-[0.7]">
          <JobCard job={singleJob!} />
        </div>
      </div>
      <div className="mt-16 w-[80%] mx-auto">
        <h1 className="text-[20px] font-semibold">Job Description</h1>
        <p className="mt-4 text-black text-opacity-70">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus
          neque consequuntur vero beatae accusantium cupiditate excepturi ex
          optio, architecto unde fugit maiores eaque deserunt porro dolorem
          omnis nobis earum. Cumque.
        </p>
        <h1 className="text-[20px] mt-8 font-semibold">Key Responsibilities</h1>
        <p className="mt-4 text-black text-opacity-70">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus
          neque consequuntur vero beatae accusantium cupiditate excepturi ex
          optio, architecto unde fugit maiores eaque deserunt porro dolorem
          omnis nobis earum. Cumque. Possimus neque consequuntur vero beatae
          accusantium cupiditate excepturi ex optio, architecto unde fugit
          maiores eaque deserunt porro dolorem omnis nobis earum. Cumque.
        </p>
        <h1 className="text-[20px] mt-8 mb-2 font-semibold">
          APPLICATION FOR APPOINTMENT TO THE UGANDA PUBLIC SERVICE
        </h1>
        <p className="font-semibold italic">
          Note: Please study the form carefully before completing it.
        </p>
        <div className="mt-4">
          <ol className="flex flex-col gap-2 list-decimal list-inside">
            <li>
              In the case of serving officers to be completed in triplicate{" "}
              {"("}original in own handwriting{"("} and submitted through their
              Permanent Secretary/Responsible Officer.
            </li>

            <li>
              In the case of others, the form should be completed in triplicate{" "}
              {"("}the original in own handwriting{"("}
              and submitted direct to the relevant Service Commission.
            </li>
          </ol>

          <div className="mt-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="post"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Post applied for and Reference Number
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between w-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Full name {"("}Surname first in capital letters{")"}
                        </FormLabel>
                        <FormControl>
                          <Input className="w-[500px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date of Birth Field */}
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input className="w-[500px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between w-full">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input className="w-[500px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date of Birth Field */}
                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telephone Number</FormLabel>
                        <FormControl>
                          <Input className="w-[500px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="post"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between w-full">
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality</FormLabel>
                        <FormControl>
                          <Input className="w-[500px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date of Birth Field */}
                  <FormField
                    control={form.control}
                    name="homeDistrict"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home District</FormLabel>
                        <FormControl>
                          <Input className="w-[500px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between w-full">
                  <FormField
                    control={form.control}
                    name="subcounty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub-county</FormLabel>
                        <FormControl>
                          <Input className="w-[500px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date of Birth Field */}
                  <FormField
                    control={form.control}
                    name="village"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Village</FormLabel>
                        <FormControl>
                          <Input className="w-[500px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="yesNoChoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Are you a temporary or permanent resident in Uganda?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-row space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="temporary" />
                            <label className="text-sm">Temporary</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="permanent" />
                            <label className="text-sm">Permanent</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="presentministry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Present Ministry/Local Government/ Department/Any other
                        Employer
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="presentpost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Present post and date appointment to it
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="presentsalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Present Salary and Scale {"("}if applicable{")"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="termsofemployment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Terms of Employment {"("}Tick as appropriate{")"}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-row space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="temporary" />
                            <label className="text-sm">Temporary</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="contract" />
                            <label className="text-sm">Contract</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="probation" />
                            <label className="text-sm">Probation</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="permanent" />
                            <label className="text-sm">Permanent</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maritalstatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Marital Status {"("}Tick as appropriate{")"}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-row space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="married" />
                            <label className="text-sm">Married</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="single" />
                            <label className="text-sm">Single</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="widowed" />
                            <label className="text-sm">Widowed</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="divorced" />
                            <label className="text-sm">Divorced</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="separated" />
                            <label className="text-sm">Separated</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="children"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number and age of Children</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {schoolFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 border p-4">
                    <h2>Details of Schools/Institutions attended:</h2>
                    <FormField
                      control={form.control}
                      name={`schools.${index}.year`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year/Period</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Year" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`schools.${index}.schoolName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School/Institution</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="School or Institution Name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`schools.${index}.award`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Award/Qualifications attained</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Award" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Remove school entry button */}
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeSchool(index)}
                      className="text-sm px-2 py-1"
                    >
                      Remove School
                    </Button>
                  </div>
                ))}

                {/* Button to add another school */}
                <Button
                  type="button"
                  onClick={() =>
                    appendSchool({ year: "", schoolName: "", award: "" })
                  }
                  className="text-sm px-2 py-1"
                >
                  Add Another School
                </Button>

                {schoolFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 border p-4">
                    <h2>Employment Record:</h2>
                    <FormField
                      control={form.control}
                      name={`employmentrecord.${index}.year`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year/Period</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Year" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`employmentrecord.${index}.position`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position held/Designation</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Position held/Designation"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`employmentrecord.${index}.employer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employer i.e. Name and Address</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Employer record" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Remove record entry button */}
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeEmployment(index)}
                      className="text-sm px-2 py-1"
                    >
                      Remove Record
                    </Button>
                  </div>
                ))}

                {/* Button to add another record */}
                <Button
                  type="button"
                  onClick={() =>
                    appendEmployment({ year: "", position: "", employer: "" })
                  }
                  className="text-sm px-2 py-1"
                >
                  Add Another Record
                </Button>

                <FormField
                  control={form.control}
                  name="uceyear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Have you passed Uganda Certificate of Education Exams{" "}
                        {"["}UCE{"]"}? Indicate the year, subject and level of
                        passes.
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input type="file" {...fileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex gap-1 text-lg"
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Submit Form
                </Button>
              </form>
            </Form>
          </div>

          <p className="font-semibold italic mt-10">
            N.B: Conviction for a criminal offence will not necessarily prevent
            an applicant from being employed in the Public Service but giving of
            false information in that context is an offence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;