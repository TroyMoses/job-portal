"use client";

import JobCard from "../../../../components/helpers/JobCard";
import React from "react";
import { Button } from "@/components/ui/button";
import { useSession, useUser } from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  post: z.string().min(1).max(200),
  name: z.string().min(1).max(200),
  image: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Applicant photo is required`),
  ucefile: z.custom<FileList>((val) => val instanceof FileList, "Required"),
  uacefile: z.custom<FileList>((val) => val instanceof FileList, "Required"),
  plefile: z.custom<FileList>((val) => val instanceof FileList, "Required"),
  transcriptfile: z.custom<FileList>(
    (val) => val instanceof FileList,
    "Required"
  ),
  universityfile: z.custom<FileList>(
    (val) => val instanceof FileList,
    "Required"
  ),
  prooffileone: z.custom<FileList>(
    (val) => val instanceof FileList,
    "Required"
  ),
  prooffiletwo: z.custom<FileList>(
    (val) => val instanceof FileList,
    "Required"
  ),
  prooffilethree: z.custom<FileList>(
    (val) => val instanceof FileList,
    "Required"
  ),
  prooffilefour: z.custom<FileList>(
    (val) => val instanceof FileList,
    "Required"
  ),
  prooffilefive: z.custom<FileList>(
    (val) => val instanceof FileList,
    "Required"
  ),
  prooffilesix: z.custom<FileList>(
    (val) => val instanceof FileList,
    "Required"
  ),
  dateOfBirth: z.date().refine((date) => !!date, { message: "Date of Birth is required" }),
  email: z.string().min(1).max(200),
  telephone: z.string().min(1).max(200),
  postalAddress: z.string().max(500),
  nationality: z.string().min(1).max(200),
  nin: z.string().min(1).max(200),
  homeDistrict: z.string().min(1).max(200),
  subcounty: z.string().min(1).max(200),
  village: z.string().min(1).max(200),
  residence: z.string().min(1).max(100),
  presentministry: z.string().min(1).max(500),
  registrationnumber: z.string().max(500),
  presentpost: z.string().min(1).max(500),
  presentsalary: z.string().min(1).max(300),
  termsofemployment: z.string().min(1).max(100),
  maritalstatus: z.string().min(1).max(100),
  children: z.string().max(100),
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
      name: z.string().min(1, "Referee name is required"),
      address: z.string().min(1, "Address is required"),
    })
  ),
  officerrecord: z.array(
    z.object({
      name: z.string().min(1, "Recommending officer name is required"),
      title: z.string().min(1, "Title is required"),
      contact: z.string().min(1, "Contact is required"),
    })
  ),
  consentment: z.string().min(1).max(100),
});

const JobApplication = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const user = useUser();
  const session = useSession();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      post: "",
      name: "",
      image: undefined,
      ucefile: undefined,
      uacefile: undefined,
      plefile: undefined,
      transcriptfile: undefined,
      universityfile: undefined,
      prooffileone: undefined,
      prooffiletwo: undefined,
      prooffilethree: undefined,
      prooffilefour: undefined,
      prooffilefive: undefined,
      prooffilesix: undefined,
      dateOfBirth: undefined,
      email: "",
      telephone: "",
      postalAddress: "",
      nationality: "",
      homeDistrict: "",
      subcounty: "",
      village: "",
      residence: "",
      presentministry: "",
      registrationnumber: "",
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
      consentment: "",
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

  // Manage the "ucerecord" array
  const {
    fields: uceFields,
    append: appendUceRecord,
    remove: removeUceRecord,
  } = useFieldArray({
    control: form.control,
    name: "ucerecord",
  });

  // Manage the "uacerecord" array
  const {
    fields: uaceFields,
    append: appendUaceRecord,
    remove: removeUaceRecord,
  } = useFieldArray({
    control: form.control,
    name: "uacerecord",
  });

  // Manage the "referencerecord" array
  const {
    fields: referenceFields,
    append: appendReferenceRecord,
    remove: removeReferenceRecord,
  } = useFieldArray({
    control: form.control,
    name: "referencerecord",
  });

  // Manage the "officerrecord" array
  const {
    fields: officerFields,
    append: appendOfficerRecord,
    remove: removeOfficerRecord,
  } = useFieldArray({
    control: form.control,
    name: "officerrecord",
  });

  const imageRef = form.register("image");
  const ucefileRef = form.register("ucefile");
  const uacefileRef = form.register("uacefile");
  const plefileRef = form.register("plefile");
  const transcriptfileRef = form.register("transcriptfile");
  const universityfileRef = form.register("universityfile");
  const prooffileoneRef = form.register("prooffileone");
  const prooffiletwoRef = form.register("prooffiletwo");
  const prooffilethreeRef = form.register("prooffilethree");
  const prooffilefourRef = form.register("prooffilefour");
  const prooffilefiveRef = form.register("prooffilefive");
  const prooffilesixRef = form.register("prooffilesix");

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

    // Upload Image file
    const imagePostUrl = await generateUploadUrl();
    const imageFileType = values.image[0].type;
    const imageResult = await fetch(imagePostUrl, {
      method: "POST",
      headers: { "Content-Type": imageFileType },
      body: values.image[0],
    });
    const { storageId: imageStorageId } = await imageResult.json();

    // Upload UCE file
    const ucePostUrl = await generateUploadUrl();
    const uceFileType = values.ucefile[0].type;
    const uceResult = await fetch(ucePostUrl, {
      method: "POST",
      headers: { "Content-Type": uceFileType },
      body: values.ucefile[0],
    });
    const { storageId: uceStorageId } = await uceResult.json();

    let uacefileStorageId;
    if (values.uacefile && values.uacefile.length > 0) {
      // Upload uacefile
      const uacefilePostUrl = await generateUploadUrl();
      const uacefileType = values.uacefile[0].type;
      const uacefileResult = await fetch(uacefilePostUrl, {
        method: "POST",
        headers: { "Content-Type": uacefileType },
        body: values.uacefile[0],
      });
      ({ storageId: uacefileStorageId } = await uacefileResult.json());
    }

    let plefileStorageId;
    if (values.plefile && values.plefile.length > 0) {
      // Upload plefile
      const plefilePostUrl = await generateUploadUrl();
      const plefileType = values.plefile[0].type;
      const plefileResult = await fetch(plefilePostUrl, {
        method: "POST",
        headers: { "Content-Type": plefileType },
        body: values.plefile[0],
      });
      ({ storageId: plefileStorageId } = await plefileResult.json());
    }

    let transcriptfileStorageId;
    if (values.transcriptfile && values.transcriptfile.length > 0) {
      // Upload transcriptfile
      const transcriptfilePostUrl = await generateUploadUrl();
      const transcriptfileType = values.transcriptfile[0].type;
      const transcriptfileResult = await fetch(transcriptfilePostUrl, {
        method: "POST",
        headers: { "Content-Type": transcriptfileType },
        body: values.transcriptfile[0],
      });
      ({ storageId: transcriptfileStorageId } =
        await transcriptfileResult.json());
    }

    let universityfileStorageId;
    if (values.universityfile && values.universityfile.length > 0) {
      // Upload universityfile
      const universityfilePostUrl = await generateUploadUrl();
      const universityfileType = values.universityfile[0].type;
      const universityfileResult = await fetch(universityfilePostUrl, {
        method: "POST",
        headers: { "Content-Type": universityfileType },
        body: values.universityfile[0],
      });
      ({ storageId: universityfileStorageId } =
        await universityfileResult.json());
    }

    let prooffileoneStorageId;
    if (values.prooffileone && values.prooffileone.length > 0) {
      // Upload prooffileone
      const prooffileonePostUrl = await generateUploadUrl();
      const prooffileoneType = values.prooffileone[0].type;
      const prooffileoneResult = await fetch(prooffileonePostUrl, {
        method: "POST",
        headers: { "Content-Type": prooffileoneType },
        body: values.prooffileone[0],
      });
      ({ storageId: prooffileoneStorageId } = await prooffileoneResult.json());
    }

    let prooffiletwoStorageId;
    if (values.prooffiletwo && values.prooffiletwo.length > 0) {
      // Upload prooffiletwo
      const prooffiletwoPostUrl = await generateUploadUrl();
      const prooffiletwoType = values.prooffiletwo[0].type;
      const prooffiletwoResult = await fetch(prooffiletwoPostUrl, {
        method: "POST",
        headers: { "Content-Type": prooffiletwoType },
        body: values.prooffiletwo[0],
      });
      ({ storageId: prooffiletwoStorageId } = await prooffiletwoResult.json());
    }

    let prooffilethreeStorageId;
    if (values.prooffilethree && values.prooffilethree.length > 0) {
      // Upload prooffilethree
      const prooffilethreePostUrl = await generateUploadUrl();
      const prooffilethreeType = values.prooffilethree[0].type;
      const prooffilethreeResult = await fetch(prooffilethreePostUrl, {
        method: "POST",
        headers: { "Content-Type": prooffilethreeType },
        body: values.prooffilethree[0],
      });
      ({ storageId: prooffilethreeStorageId } =
        await prooffilethreeResult.json());
    }

    let prooffilefourStorageId;
    if (values.prooffilefour && values.prooffilefour.length > 0) {
      // Upload prooffilefour
      const prooffilefourPostUrl = await generateUploadUrl();
      const prooffilefourType = values.prooffilefour[0].type;
      const prooffilefourResult = await fetch(prooffilefourPostUrl, {
        method: "POST",
        headers: { "Content-Type": prooffilefourType },
        body: values.prooffilefour[0],
      });
      ({ storageId: prooffilefourStorageId } =
        await prooffilefourResult.json());
    }

    let prooffilefiveStorageId;
    if (values.prooffilefive && values.prooffilefive.length > 0) {
      // Upload prooffilefive
      const prooffilefivePostUrl = await generateUploadUrl();
      const prooffilefiveType = values.prooffilefive[0].type;
      const prooffilefiveResult = await fetch(prooffilefivePostUrl, {
        method: "POST",
        headers: { "Content-Type": prooffilefiveType },
        body: values.prooffilefive[0],
      });
      ({ storageId: prooffilefiveStorageId } =
        await prooffilefiveResult.json());
    }

    let prooffilesixStorageId;
    if (values.prooffilesix && values.prooffilesix.length > 0) {
      // Upload prooffilesix
      const prooffilesixPostUrl = await generateUploadUrl();
      const prooffilesixType = values.prooffilesix[0].type;
      const prooffilesixResult = await fetch(prooffilesixPostUrl, {
        method: "POST",
        headers: { "Content-Type": prooffilesixType },
        body: values.prooffilesix[0],
      });
      ({ storageId: prooffilesixStorageId } = await prooffilesixResult.json());
    }

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
        imageId: imageStorageId,
        ucefileId: uceStorageId,
        uacefileId: uacefileStorageId,
        plefileId: plefileStorageId,
        transcriptfileId: transcriptfileStorageId,
        universityfileId: universityfileStorageId,
        prooffileoneId: prooffileoneStorageId,
        prooffiletwoId: prooffiletwoStorageId,
        prooffilethreeId: prooffilethreeStorageId,
        prooffilefourId: prooffilefourStorageId,
        prooffilefiveId: prooffilefiveStorageId,
        prooffilesixId: prooffilesixStorageId,
        userId: user?.user?.id as Id<"users">,
        type: types[imageFileType],
        dateOfBirth: values.dateOfBirth.toISOString(),
        email: values.email,
        telephone: values.telephone,
        postalAddress: values.postalAddress,
        nationality: values.nationality,
        nin: values.nin,
        homeDistrict: values.homeDistrict,
        subcounty: values.subcounty,
        village: values.village,
        residence: values.residence,
        presentministry: values.presentministry,
        registrationnumber: values.registrationnumber,
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
          PUBLIC SERVICE FORM (PSF-3)
        </h1>
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

                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel>Upload your Photo</FormLabel>
                      <FormControl>
                        <Input type="file" {...imageRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between gap-[75px] w-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Full name {"("}Surname first in capital letters{")"}*
                        </FormLabel>
                        <FormControl>
                          <Input className="w-[500px]" {...field} required />
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
                        <FormLabel>Date of Birth*</FormLabel>
                        <FormControl>
                          <Controller
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field: { onChange, value } }) => (
                              <DatePicker
                                selected={value ? new Date(value) : null}
                                onChange={(date) => onChange(date)}
                                dateFormat="yyyy-MM-dd" // Format of the date
                                placeholderText="Select date"
                                className="w-[500px] p-2 border rounded" // Styling to match your form
                                maxDate={new Date()} // Optional: prevent selecting future dates
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={100} // Adjust for reasonable age range
                              />
                            )}
                          />
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
                          <Input className="w-[500px]" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telephone Number</FormLabel>
                        <FormControl>
                          <Input className="w-[500px]" {...field} required />
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
                          <Input className="w-[500px]" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIN Number</FormLabel>
                        <FormControl>
                          <Input className="w-[500px]" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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

                <div className="flex justify-between w-full">
                  <FormField
                    control={form.control}
                    name="subcounty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub-county</FormLabel>
                        <FormControl>
                          <Input className="w-[500px]" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="village"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Village</FormLabel>
                        <FormControl>
                          <Input className="w-[500px]" {...field} required />
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
                        Employer*
                      </FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationnumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Registration Number{"("}Mandatory for teachers and
                        health workers{")"}
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
                        <Input {...field} required />
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
                        <Input
                          {...field}
                          placeholder="If yes, enter the year here..."
                        />
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
                      <FormLabel>UCE Document</FormLabel>
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
                        <Input
                          {...field}
                          placeholder="If yes, enter the year here..."
                        />
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
                          <FormLabel>Referee Name</FormLabel>
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
                          <FormLabel>Referee Address</FormLabel>
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
                      Remove Referee
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
                  Add Another Referee
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
                          <FormLabel>Recommending Officer Name</FormLabel>
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
                      Remove Recommending Officer
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
                  Add Recommending Officer
                </Button>

                <h1 className="font-semibold">
                  Have all your Docements attached here {"["}ACADEMIC DOCUMENTS
                  {"]"}? Upload a maximum of 10 documents{"("}optional{")"}
                </h1>

                <FormField
                  control={form.control}
                  name="uacefile"
                  render={() => (
                    <FormItem>
                      <FormLabel>UACE Certificate</FormLabel>
                      <FormControl>
                        <Input type="file" {...uacefileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="plefile"
                  render={() => (
                    <FormItem>
                      <FormLabel>PLE Result Slip</FormLabel>
                      <FormControl>
                        <Input type="file" {...plefileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transcriptfile"
                  render={() => (
                    <FormItem>
                      <FormLabel>University Transcript</FormLabel>
                      <FormControl>
                        <Input type="file" {...transcriptfileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="universityfile"
                  render={() => (
                    <FormItem>
                      <FormLabel>University Certificate</FormLabel>
                      <FormControl>
                        <Input type="file" {...universityfileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prooffileone"
                  render={() => (
                    <FormItem>
                      <FormLabel>Other Proof Certificate 1</FormLabel>
                      <FormControl>
                        <Input type="file" {...prooffileoneRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prooffiletwo"
                  render={() => (
                    <FormItem>
                      <FormLabel>Other Proof Certificate 2</FormLabel>
                      <FormControl>
                        <Input type="file" {...prooffiletwoRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prooffilethree"
                  render={() => (
                    <FormItem>
                      <FormLabel>Other Proof Certificate 3</FormLabel>
                      <FormControl>
                        <Input type="file" {...prooffilethreeRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prooffilefour"
                  render={() => (
                    <FormItem>
                      <FormLabel>Other Proof Certificate 4</FormLabel>
                      <FormControl>
                        <Input type="file" {...prooffilefourRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prooffilefive"
                  render={() => (
                    <FormItem>
                      <FormLabel>Other Proof Certificate 5</FormLabel>
                      <FormControl>
                        <Input type="file" {...prooffilefiveRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prooffilesix"
                  render={() => (
                    <FormItem>
                      <FormLabel>Other Proof Certificate 6</FormLabel>
                      <FormControl>
                        <Input type="file" {...prooffilesixRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  Submit Application
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;
