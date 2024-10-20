"use client";

import JobCard from "../../../../components/helpers/JobCard";
import React from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs"; // Only use useUser now
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  post: z.string().min(1).max(200),
  name: z.string().min(1).max(200),
  ucefile: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `UCE document is required`),
  uacefile: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `UACE document is required`),
  dateOfBirth: z.string().min(1).max(200),
  email: z.string().min(1).max(200),
  telephone: z.string().min(1).max(200),
  postalAddress: z.string().min(1).max(500),
  nationality: z.string().min(1).max(200),
  homeDistrict: z.string().min(1).max(200),
  subcounty: z.string().min(1).max(200),
  village: z.string().min(1).max(200),
  residence: z.enum(["temporary", "permanent"], {
    required_error: "Residence is required",
  }),
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
  ucerecord: z.array(
    z.object({
      subject: z.string().min(1, "Subject name is required"),
      grade: z.string().min(1, "Grade is required"),
    })
  ),
  uaceyear: z.string().min(1).max(100),
  uacerecord: z.array(
    z.object({
      subject: z.string().min(1, "Subject name is required"),
      grade: z.string().min(1, "Grade is required"),
    })
  ),
  conviction: z.string().min(1).max(300),
  available: z.string().min(1).max(500),
  referencerecord: z.array(
    z.object({
      name: z.string().min(1, "Reference name is required"),
      address: z.string().min(1, "Address is required"),
    })
  ),
  officerrecord: z.array(
    z.object({
      name: z.string().min(1, "Subject name is required"),
      title: z.string().min(1, "Title is required"),
      contact: z.string().min(1, "Contact is required"),
    })
  ),
  consentment: z.enum(["yes", "no"], {
    required_error: "Consentment is required",
  }),
});

const JobApplication = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const user = useUser(); // Only use user now, no organization

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      post: "",
      name: "",
      ucefile: undefined,
      uacefile: undefined,
      dateOfBirth: "",
      email: "",
      telephone: "",
      postalAddress: "",
      nationality: "",
      homeDistrict: "",
      subcounty: "",
      village: "",
      residence: "temporary",
      presentministry: "",
      presentpost: "",
      presentsalary: "",
      termsofemployment: "",
      maritalstatus: "",
      children: "",
      schools: [{ year: "", schoolName: "", award: "" }],
      employmentrecord: [{ year: "", position: "", employer: "" }],
      uceyear: "",
      ucerecord: [{ subject: "", grade: "" }],
      uaceyear: "",
      uacerecord: [{ subject: "", grade: "" }],
      conviction: "",
      available: "",
      referencerecord: [{ name: "", address: "" }],
      officerrecord: [{ name: "", title: "", contact: "" }],
      consentment: "yes",
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

  // Manage the other arrays as before...

  const ucefileRef = form.register("ucefile");
  const uacefileRef = form.register("uacefile");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user.isSignedIn) {
      // If user is not signed in, stop here
      toast({
        variant: "destructive",
        title: "Not signed in",
        description: "You must sign in to apply for the job",
      });
      return;
    }

    // Upload UCE file
    const ucePostUrl = await generateUploadUrl();
    const uceFileType = values.ucefile[0].type;
    const uceResult = await fetch(ucePostUrl, {
      method: "POST",
      headers: { "Content-Type": uceFileType },
      body: values.ucefile[0],
    });
    const { storageId: uceStorageId } = await uceResult.json();

    // Upload UACE file
    const uacePostUrl = await generateUploadUrl();
    const uaceFileType = values.uacefile[0].type;
    const uaceResult = await fetch(uacePostUrl, {
      method: "POST",
      headers: { "Content-Type": uaceFileType },
      body: values.uacefile[0],
    });
    const { storageId: uaceStorageId } = await uaceResult.json();

    const types = {
      "image/png": "image",
      "application/pdf": "pdf",
      "text/csv": "csv",
      "application/vnd.ms-powerpoint": "ppt",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    } as Record<string, Doc<"files">["type"]>;

    try {
      await createFile({
        post: values.post,
        name: values.name,
        ucefileId: uceStorageId,
        uacefileId: uaceStorageId,
        userId: user.user.id, // Use user ID instead of orgId
        type: types[uceFileType],
        dateOfBirth: values.dateOfBirth,
        email: values.email,
        telephone: values.telephone,
        postalAddress: values.postalAddress,
        nationality: values.nationality,
        homeDistrict: values.homeDistrict,
        subcounty: values.subcounty,
        village: values.village,
        residence: values.residence,
        presentministry: values.presentministry,
        presentpost: values.presentpost,
        presentsalary: values.presentsalary,
        termsofemployment: values.termsofemployment,
        maritalstatus: values.maritalstatus,
        children: values.children,
        schools: values.schools,
        employmentrecord: values.employmentrecord,
        uceyear: values.uceyear,
        ucerecord: values.ucerecord,
        uaceyear: values.uaceyear,
        uacerecord: values.uacerecord,
        conviction: values.conviction,
        available: values.available,
        referencerecord: values.referencerecord,
        officerrecord: values.officerrecord,
        consentment: values.consentment,
      });

      form.reset();

      toast({
        variant: "success",
        title: "Application Submitted",
        description: "Your application has been submitted successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Your application could not be submitted, try again later",
      });
    }
  }

  const createFile = useMutation(api.files.createFile);

  const singleJob = useQuery(
    api.jobs.getJobById,
    //@ts-ignore
    { jobId: params.id }
  );

  const isLoading = singleJob === undefined;

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <div className="mt-20 mb-12">
      <div className="block sm:flex items-center justify-between w-[80%] mx-auto">
        <div className="flex-[0.7]">
          <JobCard
            //@ts-ignore
            job={singleJob!}
          />
        </div>
      </div>
      <div className="mt-4 w-[80%] mx-auto">
    
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
                  name="postalAddress"
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
                  name="residence"
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

                {employmentFields.map((field, index) => (
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

                {uceFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 border p-4">
                    <FormField
                      control={form.control}
                      name={`ucerecord.${index}.subject`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Subject" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`ucerecord.${index}.grade`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Grade" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Remove record entry button */}
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeUceRecord(index)}
                      className="text-sm px-2 py-1"
                    >
                      Remove Record
                    </Button>
                  </div>
                ))}

                {/* Button to add another record */}
                <Button
                  type="button"
                  onClick={() => appendUceRecord({ subject: "", grade: "" })}
                  className="text-sm px-2 py-1"
                >
                  Add Another Record
                </Button>

                <FormField
                  control={form.control}
                  name="ucefile"
                  render={() => (
                    <FormItem>
                      <FormLabel>UCE Certificate/Document</FormLabel>
                      <FormControl>
                        <Input type="file" {...ucefileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="uaceyear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Have you passed Uganda Certificate of Education Exams{" "}
                        {"["}UACE{"]"}? Indicate the year, subject and level of
                        passes.
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {uaceFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 border p-4">
                    <FormField
                      control={form.control}
                      name={`uacerecord.${index}.subject`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Subject" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`uacerecord.${index}.grade`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Grade" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Remove record entry button */}
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeUaceRecord(index)}
                      className="text-sm px-2 py-1"
                    >
                      Remove Record
                    </Button>
                  </div>
                ))}

                {/* Button to add another record */}
                <Button
                  type="button"
                  onClick={() => appendUaceRecord({ subject: "", grade: "" })}
                  className="text-sm px-2 py-1"
                >
                  Add Another Record
                </Button>

                <FormField
                  control={form.control}
                  name="uacefile"
                  render={() => (
                    <FormItem>
                      <FormLabel>UACE Certificate/Document</FormLabel>
                      <FormControl>
                        <Input type="file" {...uacefileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="conviction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Have you ever been convicted on a criminal charge? If
                        so, give brief details including sentence imposed
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                      <p className="font-semibold italic mt-3">
                        N.B: Conviction for a criminal offence will not
                        necessarily prevent an applicant from being employed in
                        the Public Service but giving of false information in
                        that context is an offence.{" "}
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        How soon would you be available for appointment if
                        selected? State the minimum salary expectation
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {referenceFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 border p-4">
                    <h2>
                      In the case of applicants not already in Government
                      Service, the names and addresses of two responsible
                      persons{"("}not relatives{")"} to whom reference can be
                      made as regards character and ability and should be given
                      here.
                    </h2>
                    <FormField
                      control={form.control}
                      name={`referencerecord.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`referencerecord.${index}.address`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Remove record entry button */}
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeReferenceRecord(index)}
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
                    appendReferenceRecord({ name: "", address: "" })
                  }
                  className="text-sm px-2 py-1"
                >
                  Add Another Record
                </Button>

                {officerFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 border p-4">
                    <h2>
                      In the case of applicants already in Government Service,
                      the comments and recommendation as to the suitability for
                      the post applied for of the Permanent
                      Secretary/Responsible Officer be given here.
                    </h2>
                    <FormField
                      control={form.control}
                      name={`officerrecord.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`officerrecord.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title/Designation</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Title/Designation" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`officerrecord.${index}.contact`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Contact</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Phone Contact" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Remove record entry button */}
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeOfficerRecord(index)}
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
                    appendOfficerRecord({ name: "", title: "", contact: "" })
                  }
                  className="text-sm px-2 py-1"
                >
                  Add Another Record
                </Button>

                <FormField
                  control={form.control}
                  name="consentment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        I hereby certify that to the best of my knowledge and
                        belief, the particulars given in this form are true and
                        complete in all respects.
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-row space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" />
                            <label className="text-sm">I agree</label>
                          </div>
                        </RadioGroup>
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
