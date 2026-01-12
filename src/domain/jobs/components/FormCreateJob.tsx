import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import Decimal from "decimal.js";
import { useMemo, useState } from "react";
import { addDays, format } from "date-fns";

import { useJobSchema } from "@/lib/use-job-schema";
import { JobType } from "@/types/JobType";
import { budgetRangeOptions } from "@/types/FormCreateJobState";
import type { LocalMilestone } from "@/types/Milestone";
import type { UploadedFile } from "@/types/UploadedFile";
import type { Language } from "@/types/Language";
import type { Location } from "@/types/Location";
import type { Category } from "@/types/Category";
import type { UserSkill } from "@/types/Category";
import { LocalMilestoneEditor } from "@/components/LocalMilestoneEditor";
import { SelectLanguages } from "@/components/job-form/SelectLanguages";
import { SelectLocation } from "@/components/job-form/SelectLocation";
import { CategorySelectorForPosting } from "@/components/job-form/CategorySelector";
import { SkillsSelect } from "@/components/job-form/SkillsSelect";
import { DatePickerNew } from "@/components/job-form/DatePicker";
import { JobToggle } from "@/components/job-form/JobToggle";
import { TermsPrivacyCheckBox } from "@/components/job-form/TermsPrivacyCheckBox";
import { SelectUsersFromContactList } from "@/components/job-form/SelectUsersFromContactList";
import { FileUpload } from "@/components/file-upload/FileUpload";
import { Links } from "@/lib/links";
import { formatNumberCurrency } from "@/lib/utils/formatNumberCurrency";
import { useBoolean } from "@/shared/hooks/use-boolean";

interface User {
  id: number;
  name: string;
}

interface FormCreateJobState {
  title: string;
  description: string;
  languages: Language[];
  files: UploadedFile[];
  category?: number;
  subcategories: number[];
  skills: UserSkill[];
  paymentType: JobType;
  budget: string;
  minBudget: number;
  maxBudget: number;
  minRate: number;
  maxRate: number;
  minHours: number;
  maxHours: number;
  inviteOnly: string;
  locations: Location[];
  qtracker: boolean;
  qtrackerScreenshots: boolean;
  qtrackerInterval: number;
  qtrackerComments: boolean;
  proposalsUntil: string;
  startDate: string;
  endDate: string;
  milestones: LocalMilestone[];
  urgent: boolean;
  private: boolean;
  confidential: boolean;
  draft: boolean;
  inviteUsers: User[];
  terms: boolean;
}

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Static text content (replacing translations)
const formText = {
  job_description: "Job Description",
  job_name: "Job Name",
  job_name_placeholder: "Enter job title",
  preferred_languages: "Preferred Languages",
  preferred_locations: "Preferred Locations",
  details: "Details",
  details_placeholder: "Enter job description (minimum 80 characters)",
  required_skills: "Required Skills",
  budget: "Budget",
  type: "Payment Type",
  type_placeholder: "Select payment type",
  type_options: {
    fixed_budget: "Fixed Budget",
    fixed_hourly_rate: "Fixed Hourly Rate",
    hourly_rate_proposals: "Hourly Rate (Negotiable)",
  },
  budget_placeholder: "Select budget range",
  hourly_rate: "Hourly Rate",
  min_hourly_rate: "Minimum Hourly Rate",
  max_hourly_rate: "Maximum Hourly Rate",
  min_hours: "Minimum Hours",
  max_hours: "Maximum Hours",
  estimated_budget: "Estimated Budget",
  q_tracker: "Q Tracker",
  use_q_tracker: "Use Q Tracker",
  screenshots: "Screenshots",
  interval: "Interval",
  interval_placeholder: "Select interval",
  require_comments: "Require Comments",
  timeline: "Timeline",
  accept_proposals_until: "Accept Proposals Until",
  est_starting_date: "Estimated Starting Date",
  est_ending_date: "Estimated Ending Date",
  milestones: "Milestones",
  invite: "Invite",
  choose_bidders: "Choose who can bid on this job",
  everyone: "Everyone",
  invited_users_only: "Invited Users Only",
  invite_users: "Invite Users",
  additional_services: "Additional Services",
  private_job: "Private Job",
  urgent_job: "Urgent Job",
  confidential_job: "Confidential Job",
  included_in_package: "Included in your package",
  will_be_charged: "will be charged",
  limit_reached: "You have reached your job posting limit.",
  upgrade: "Upgrade",
  to_post: "to post.",
  submit: "Publish Job",
  draft: "Save as Draft",
};

// Helper function to check if payment type is hourly
const isHourly = (paymentType: string) => {
  return (
    paymentType === JobType.HOURLY || paymentType === JobType.HOURLY_NEGOTIABLE
  );
};

// Mock API endpoint
const mockApiEndpoint = "/api/jobs/upload";

// Static data - these should be replaced with actual data from your API
const staticLanguages: Language[] = [
  { slug: "en", name: "English" },
  { slug: "es", name: "Spanish" },
  { slug: "fr", name: "French" },
  { slug: "de", name: "German" },
  { slug: "it", name: "Italian" },
  { slug: "pt", name: "Portuguese" },
];

const staticLocations: Location[] = [
  {
    id: 1,
    name: "United States",
    standalone: {
      id: 1,
      name: "United States",
      region: "North America",
      country: "United States",
    },
  },
  {
    id: 2,
    name: "United Kingdom",
    standalone: {
      id: 2,
      name: "United Kingdom",
      region: "Europe",
      country: "United Kingdom",
    },
  },
  {
    id: 3,
    name: "Canada",
    standalone: {
      id: 3,
      name: "Canada",
      region: "North America",
      country: "Canada",
    },
  },
  {
    id: 4,
    name: "Australia",
    standalone: {
      id: 4,
      name: "Australia",
      region: "Oceania",
      country: "Australia",
    },
  },
  {
    id: 5,
    name: "Germany",
    standalone: {
      id: 5,
      name: "Germany",
      region: "Europe",
      country: "Germany",
    },
  },
  {
    id: 6,
    name: "France",
    standalone: {
      id: 6,
      name: "France",
      region: "Europe",
      country: "France",
    },
  },
];

const staticCategories: Category[] = [
  {
    id: 1,
    title: "Web Development",
    children: [
      {
        id: 11,
        title: "Frontend",
        children: [],
        icon: "",
        popularity: 0,
        talent_count: 0,
        job_count: 0,
      },
      {
        id: 12,
        title: "Backend",
        children: [],
        icon: "",
        popularity: 0,
        talent_count: 0,
        job_count: 0,
      },
      {
        id: 13,
        title: "Full Stack",
        children: [],
        icon: "",
        popularity: 0,
        talent_count: 0,
        job_count: 0,
      },
    ],
    icon: "",
    popularity: 0,
    talent_count: 0,
    job_count: 0,
  },
  {
    id: 2,
    title: "Mobile Development",
    children: [
      {
        id: 21,
        title: "iOS",
        children: [],
        icon: "",
        popularity: 0,
        talent_count: 0,
        job_count: 0,
      },
      {
        id: 22,
        title: "Android",
        children: [],
        icon: "",
        popularity: 0,
        talent_count: 0,
        job_count: 0,
      },
      {
        id: 23,
        title: "React Native",
        children: [],
        icon: "",
        popularity: 0,
        talent_count: 0,
        job_count: 0,
      },
    ],
    icon: "",
    popularity: 0,
    talent_count: 0,
    job_count: 0,
  },
  {
    id: 3,
    title: "Design",
    children: [
      {
        id: 31,
        title: "UI/UX",
        children: [],
        icon: "",
        popularity: 0,
        talent_count: 0,
        job_count: 0,
      },
      {
        id: 32,
        title: "Graphic Design",
        children: [],
        icon: "",
        popularity: 0,
        talent_count: 0,
        job_count: 0,
      },
      {
        id: 33,
        title: "Web Design",
        children: [],
        icon: "",
        popularity: 0,
        talent_count: 0,
        job_count: 0,
      },
    ],
    icon: "",
    popularity: 0,
    talent_count: 0,
    job_count: 0,
  },
];

const staticUsers: User[] = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
  { id: 4, name: "Alice Williams" },
  { id: 5, name: "Charlie Brown" },
  { id: 6, name: "Diana Prince" },
];

const staticSkills: UserSkill[] = [
  // Web Development skills
  {
    id: 101,
    name: "React",
    order: 1,
    percent: 100,
    isVisible: true,
    categoryId: 1,
    categoryName: "Web Development",
  },
  {
    id: 102,
    name: "Vue.js",
    order: 2,
    percent: 100,
    isVisible: true,
    categoryId: 1,
    categoryName: "Web Development",
  },
  {
    id: 103,
    name: "Angular",
    order: 3,
    percent: 100,
    isVisible: true,
    categoryId: 1,
    categoryName: "Web Development",
  },
  {
    id: 104,
    name: "Node.js",
    order: 4,
    percent: 100,
    isVisible: true,
    categoryId: 1,
    categoryName: "Web Development",
  },
  {
    id: 105,
    name: "TypeScript",
    order: 5,
    percent: 100,
    isVisible: true,
    categoryId: 1,
    categoryName: "Web Development",
  },
  // Mobile Development skills
  {
    id: 201,
    name: "Swift",
    order: 1,
    percent: 100,
    isVisible: true,
    categoryId: 2,
    categoryName: "Mobile Development",
  },
  {
    id: 202,
    name: "Kotlin",
    order: 2,
    percent: 100,
    isVisible: true,
    categoryId: 2,
    categoryName: "Mobile Development",
  },
  {
    id: 203,
    name: "Flutter",
    order: 3,
    percent: 100,
    isVisible: true,
    categoryId: 2,
    categoryName: "Mobile Development",
  },
  {
    id: 204,
    name: "React Native",
    order: 4,
    percent: 100,
    isVisible: true,
    categoryId: 2,
    categoryName: "Mobile Development",
  },
  // Design skills
  {
    id: 301,
    name: "Figma",
    order: 1,
    percent: 100,
    isVisible: true,
    categoryId: 3,
    categoryName: "Design",
  },
  {
    id: 302,
    name: "Adobe XD",
    order: 2,
    percent: 100,
    isVisible: true,
    categoryId: 3,
    categoryName: "Design",
  },
  {
    id: 303,
    name: "Sketch",
    order: 3,
    percent: 100,
    isVisible: true,
    categoryId: 3,
    categoryName: "Design",
  },
  {
    id: 304,
    name: "Photoshop",
    order: 4,
    percent: 100,
    isVisible: true,
    categoryId: 3,
    categoryName: "Design",
  },
];

export const FormCreateJob = () => {
  const navigate = useNavigate();
  const { createJobSchema } = useJobSchema();
  const { value: milestoneMisalignment, setValue: setMilestoneMisalignment } =
    useBoolean(false);

  const [pricePrivate, setPricePrivate] = useState("extra cost");
  const [priceUrgent, setPriceUrgent] = useState("extra cost");
  const [priceConfidential, setPriceConfidential] = useState("extra cost");

  // Mock limits - assume user has limits
  const limits = useMemo(
    () => ({
      jobs: { allowed: true },
      private: { allowed: false },
      urgent: { allowed: false },
      confidential: { allowed: false },
    }),
    []
  );

  const limitReached = useMemo(
    () => !(limits?.jobs ? limits.jobs.allowed : true),
    [limits]
  );

  const schema = createJobSchema(milestoneMisalignment);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormCreateJobState>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: "",
      description: "",
      languages: [{ slug: "en", name: "English" }],
      files: [],
      category: undefined,
      subcategories: [],
      skills: [],
      paymentType: JobType.FIXED,
      budget: "",
      minBudget: 0,
      maxBudget: 0,
      minRate: 0,
      maxRate: 0,
      minHours: 0,
      maxHours: 0,
      inviteOnly: "false",
      locations: [],
      qtracker: false,
      qtrackerScreenshots: false,
      qtrackerInterval: 10,
      qtrackerComments: false,
      proposalsUntil: format(addDays(new Date(), 3), "yyyy-MM-dd"),
      startDate: "",
      endDate: "",
      milestones: [],
      urgent: false,
      private: false,
      confidential: false,
      draft: false,
      inviteUsers: [],
      terms: false,
    },
    mode: "onChange",
  });

  const paymentType = watch("paymentType");
  const qtracker = watch("qtracker");
  const qtrackerScreenshots = watch("qtrackerScreenshots");
  const minHours = watch("minHours") || 0;
  const maxHours = watch("maxHours") || 0;
  const minRate = watch("minRate") || 0;
  const maxRate = watch("maxRate") || 0;
  const budget = watch("budget");
  const confidential = watch("confidential");
  const inviteOnly = watch("inviteOnly");

  const isFixedBudget = paymentType === JobType.FIXED;
  const isHourlyJob = isHourly(paymentType);
  const showBudgetSelectBox = isFixedBudget;
  const showExpectedHours = isHourlyJob;
  const showHourlyRate = isHourlyJob;
  const showEstimatedBudget = isHourlyJob;
  const showFixedHourlyRate = paymentType === JobType.HOURLY;

  const estimatedBudgetMin = isHourlyJob
    ? minHours * minRate
    : budgetRangeOptions.find((o) => o.label === budget)?.min || 0;

  const estimatedBudgetMax = isHourlyJob
    ? maxHours * (showFixedHourlyRate ? minRate : maxRate)
    : budgetRangeOptions.find((o) => o.label === budget)?.max || 0;

  const estimatedBudget =
    errors.minHours ||
    errors.maxHours ||
    errors.minRate ||
    (!showFixedHourlyRate && errors.maxRate)
      ? ``
      : `${formatNumberCurrency(estimatedBudgetMin)} - ${formatNumberCurrency(
          estimatedBudgetMax
        )}`;

  const allowPublish = useMemo(
    () => !limitReached && isValid,
    [limitReached, isValid]
  );

  const onSubmit = async (values: FormCreateJobState) => {
    let minBudget = values.minBudget;
    let maxBudget = values.maxBudget;

    if (
      !(
        values.paymentType === JobType.FIXED &&
        (budgetRangeOptions.find((o) => o.label === values.budget)
          ?.showCustom ||
          false)
      )
    ) {
      const budgetOption = budgetRangeOptions.find(
        (o) => o.label === values.budget
      );
      minBudget = budgetOption?.min || 0;
      maxBudget = budgetOption?.max || 0;
    }

    if (isHourly(values.paymentType)) {
      const estimatedBudgetMin = (values.minHours || 0) * (values.minRate || 0);
      const estimatedBudgetMax = (values.maxHours || 0) * (values.minRate || 0);
      minBudget = estimatedBudgetMin;
      maxBudget = estimatedBudgetMax;
    }

    const postValues = {
      title: values.title,
      description: values.description,
      languages: values.languages.map((x) => x.slug),
      category: values.category,
      subcategories: values.subcategories,
      skills: values.skills.map((x) => x.id),
      files: values.files.map((x) => x.id),
      paymentType: values.paymentType,
      budget: values.budget,
      minBudget: minBudget,
      maxBudget: maxBudget,
      proposalsUntil: values.proposalsUntil,
      startDate: values.startDate,
      endDate: values.endDate,
      milestones: values.milestones,
      inviteOnly: values.inviteOnly === "true",
      inviteUsers: values.inviteUsers,
      locations: values.locations.map((item) => item.id),
      qtracker: values.qtracker,
      qtrackerScreenshots: values.qtracker && values.qtrackerScreenshots,
      qtrackerInterval: values.qtrackerInterval,
      qtrackerComments:
        values.qtracker &&
        values.qtrackerScreenshots &&
        values.qtrackerComments,
      urgent: values.urgent,
      private: values.private,
      confidential: values.confidential,
      draft: values.draft,
      ...(isHourly(values.paymentType) && {
        minRate: values.minRate,
        minHours: values.minHours,
        maxHours: values.maxHours,
        maxRate:
          values.paymentType === JobType.HOURLY
            ? values.minRate
            : values.maxRate,
      }),
    };

    // Replace API call with console.log
    console.log("Creating job with data:", postValues);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Your job has been created successfully.");
      navigate(Links.myJobsPosted(), { replace: true });
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Failed to create job. Please try again.");
    }
  };

  const handlePaymentTypeChange = (value: string) => {
    setValue("paymentType", value as JobType);

    if (value === JobType.HOURLY || value === JobType.HOURLY_NEGOTIABLE) {
      setValue("qtracker", true);
      setValue("qtrackerScreenshots", true);
      setValue("qtrackerInterval", 10);
      setValue("qtrackerComments", true);
    } else {
      setValue("qtracker", false);
      setValue("qtrackerScreenshots", false);
      setValue("qtrackerInterval", 10);
      setValue("qtrackerComments", false);
    }
  };

  const handleQtrackerChange = (checked: boolean) => {
    setValue("qtracker", checked);
    if (!checked) {
      setValue("qtrackerScreenshots", false);
      setValue("qtrackerInterval", 10);
      setValue("qtrackerComments", false);
    }
  };

  const handlePrivateCheckboxChange = (checked: boolean) => {
    setValue("private", checked);
    if (limits && !limits.private.allowed) {
      // Mock price calculation
      setPricePrivate("$50.00");
    }
  };

  const handleUrgentCheckboxChange = (checked: boolean) => {
    setValue("urgent", checked);
    if (limits && !limits.urgent.allowed) {
      setPriceUrgent("$30.00");
    }
  };

  const handleConfidentialCheckboxChange = (checked: boolean) => {
    setValue("confidential", checked);
    if (checked && inviteOnly === "false") {
      setValue("inviteOnly", "true");
    } else if (!checked && inviteOnly === "true") {
      setValue("inviteOnly", "false");
      setValue("inviteUsers", []);
    }
    if (limits && !limits.confidential.allowed) {
      setPriceConfidential("$40.00");
    }
  };

  return (
    <>
      {limitReached && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {formText.limit_reached}
            <div>
              <Button
                to={Links.userPackages()}
                variant="link"
                className="p-0 h-auto"
              >
                {formText.upgrade}
              </Button>{" "}
              {formText.to_post}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <form
        className="create-job-form space-y-8"
        data-testid="create-job-form"
        onSubmit={handleSubmit(onSubmit as any)}
      >
        <FieldSet>
          <FieldLegend>{formText.job_description}</FieldLegend>

          <Field data-invalid={!!errors.title}>
            <FieldLabel>
              {formText.job_name} <span className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <Input
                id="title"
                data-testid="job-name"
                placeholder={formText.job_name_placeholder}
                {...register("title")}
              />
              <FieldError
                errors={
                  errors.title ? [{ message: errors.title.message }] : undefined
                }
              />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectLanguages
              required
              control={control}
              name="languages"
              languages={staticLanguages}
            />

            <SelectLocation
              control={control}
              name="locations"
              locations={staticLocations}
            />
          </div>

          <Field data-invalid={!!errors.description}>
            <FieldLabel>
              {formText.details} <span className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <Textarea
                id="description"
                data-testid="description"
                placeholder={formText.details_placeholder}
                rows={6}
                {...register("description")}
              />
              <FieldError
                errors={
                  errors.description
                    ? [{ message: errors.description.message }]
                    : undefined
                }
              />
            </FieldContent>
          </Field>

          <FileUpload
            enforceValue
            multiple
            uploadEndpoint={mockApiEndpoint}
            value={watch("files")}
            onChange={(files) => setValue("files", files)}
          />
        </FieldSet>

        <FieldSet>
          {errors.category && (
            <p className="text-destructive text-sm">
              {errors.category.message}
            </p>
          )}
          <FieldLegend>{formText.required_skills}</FieldLegend>

          <CategorySelectorForPosting
            required
            control={control}
            mainCategoryName="category"
            subCategoriesName="subcategories"
            categories={staticCategories}
          />

          <SkillsSelect
            required
            categoryIds={
              watch("subcategories").length > 0
                ? watch("subcategories")
                : watch("category")
                ? [Number(watch("category"))]
                : []
            }
            disabled={!watch("category")}
            control={control}
            name="skills"
            skills={staticSkills}
          />
        </FieldSet>

        <FieldSet>
          <FieldLegend>{formText.budget}</FieldLegend>

          <Field>
            <FieldLabel>
              {formText.type} <span className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <Select
                value={paymentType}
                onValueChange={handlePaymentTypeChange}
              >
                <SelectTrigger data-testid="paymentType" id="create-job-type">
                  <SelectValue placeholder={formText.type_placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={JobType.FIXED}>
                    {formText.type_options.fixed_budget}
                  </SelectItem>
                  <SelectItem value={JobType.HOURLY}>
                    {formText.type_options.fixed_hourly_rate}
                  </SelectItem>
                  <SelectItem value={JobType.HOURLY_NEGOTIABLE}>
                    {formText.type_options.hourly_rate_proposals}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          {showBudgetSelectBox && (
            <Field>
              <FieldLabel>
                Budget Range <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <Select
                  value={budget || ""}
                  onValueChange={(value) => {
                    setValue("budget", value);
                  }}
                >
                  <SelectTrigger id="create-job-budget" data-testid="budget">
                    <SelectValue placeholder={formText.budget_placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRangeOptions.map((option, idx) => (
                      <SelectItem key={idx} value={option.label}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          )}

          {showHourlyRate && (
            <>
              <Field data-invalid={!!errors.minRate}>
                <FieldLabel>
                  {showFixedHourlyRate
                    ? formText.hourly_rate
                    : formText.min_hourly_rate}{" "}
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    data-testid="minRate"
                    id="minRate"
                    {...register("minRate", { valueAsNumber: true })}
                  />
                  <FieldError
                    errors={
                      errors.minRate
                        ? [{ message: errors.minRate.message }]
                        : undefined
                    }
                  />
                </FieldContent>
              </Field>

              {!showFixedHourlyRate && (
                <Field data-invalid={!!errors.maxRate}>
                  <FieldLabel>
                    {formText.max_hourly_rate}{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      id="maxRate"
                      {...register("maxRate", { valueAsNumber: true })}
                      data-testid="maxRate"
                    />
                    <FieldError
                      errors={
                        errors.maxRate
                          ? [{ message: errors.maxRate.message }]
                          : undefined
                      }
                    />
                  </FieldContent>
                </Field>
              )}

              {showExpectedHours && (
                <>
                  <Field data-invalid={!!errors.minHours}>
                    <FieldLabel>
                      {formText.min_hours}{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        type="number"
                        id="minHours"
                        {...register("minHours", { valueAsNumber: true })}
                        data-testid="minHours"
                      />
                      <FieldError
                        errors={
                          errors.minHours
                            ? [{ message: errors.minHours.message }]
                            : undefined
                        }
                      />
                    </FieldContent>
                  </Field>

                  <Field data-invalid={!!errors.maxHours}>
                    <FieldLabel>
                      {formText.max_hours}{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        type="number"
                        id="maxHours"
                        {...register("maxHours", { valueAsNumber: true })}
                        data-testid="maxHours"
                      />
                      <FieldError
                        errors={
                          errors.maxHours
                            ? [{ message: errors.maxHours.message }]
                            : undefined
                        }
                      />
                    </FieldContent>
                  </Field>
                </>
              )}
            </>
          )}

          {showEstimatedBudget && estimatedBudget && (
            <div className="estimated-wrap p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">
                {formText.estimated_budget}
              </h3>
              <span
                data-testid="estimated-budget"
                className="text-lg font-medium"
              >
                {estimatedBudget}
              </span>
            </div>
          )}
        </FieldSet>

        {isHourlyJob && (
          <FieldSet>
            <FieldLegend>{formText.q_tracker}</FieldLegend>

            <JobToggle
              id="job-create-qtracker"
              name="qtracker"
              label={formText.q_tracker}
              title={formText.use_q_tracker}
              checked={qtracker}
              data-testid="qtracker"
              control={control}
              onChange={(e) => handleQtrackerChange(e.target.checked)}
            />

            <JobToggle
              id="job-create-qtracker-screenshots"
              name="qtrackerScreenshots"
              label={formText.screenshots}
              title={formText.use_q_tracker}
              checked={qtrackerScreenshots}
              disabled={!qtracker}
              data-testid="qtracker-screenshots"
              control={control}
              subtitle={
                <div className="interval mt-2">
                  <p className="text-sm mb-1">{formText.interval}</p>
                  <Select
                    value={watch("qtrackerInterval")?.toString()}
                    onValueChange={(value) =>
                      setValue("qtrackerInterval", Number(value))
                    }
                    disabled={!(qtracker && qtrackerScreenshots)}
                  >
                    <SelectTrigger
                      id="job-qtracker-interval"
                      data-testid="qtracker-interval"
                      className="w-32"
                    >
                      <SelectValue
                        placeholder={formText.interval_placeholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 min</SelectItem>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="60">60 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              }
            />

            <JobToggle
              id="job-create-qtracker-comments"
              name="qtrackerComments"
              label={formText.require_comments}
              title={formText.require_comments}
              checked={watch("qtrackerComments")}
              disabled={!(qtracker && qtrackerScreenshots)}
              data-testid="qtracker-comments"
              control={control}
            />
          </FieldSet>
        )}

        <FieldSet>
          <FieldLegend>{formText.timeline}</FieldLegend>

          <DatePickerNew
            required
            id="job-create-proposals-until"
            label={formText.accept_proposals_until}
            name="proposalsUntil"
            testid="proposalsUntil"
            control={control}
            disablePastDays
          />

          <DatePickerNew
            required
            id="job-create-start-date"
            label={formText.est_starting_date}
            name="startDate"
            testid="startDate"
            control={control}
            disablePastDays
            weekMode={isHourlyJob}
          />

          <DatePickerNew
            required
            id="job-create-end-date"
            label={formText.est_ending_date}
            name="endDate"
            testid="endDate"
            control={control}
            disablePastDays
            weekMode={isHourlyJob}
          />
        </FieldSet>

        <FieldSet>
          <FieldLegend>{formText.milestones}</FieldLegend>
          <LocalMilestoneEditor
            canAdd
            canEditAmount
            canEditName
            canEditTimeline
            canRemove
            constraints={{
              maxBudgetOrHours: isHourlyJob
                ? maxHours
                  ? new Decimal(maxHours).toString()
                  : undefined
                : estimatedBudgetMax > 0
                ? new Decimal(estimatedBudgetMax).toString()
                : undefined,
              isHourly: isHourlyJob,
              timeline: {
                startDate: watch("startDate"),
                endDate: watch("endDate"),
              },
            }}
            hourlyRate={
              isHourlyJob
                ? new Decimal(Math.max(minRate, maxRate)).toString()
                : undefined
            }
            value={watch("milestones")}
            onChange={(milestones) => setValue("milestones", milestones)}
            onError={setMilestoneMisalignment}
          />
        </FieldSet>

        <FieldSet>
          <FieldLegend>{formText.invite}</FieldLegend>
          <p className="text-sm text-muted-foreground mb-4">
            {formText.choose_bidders}
          </p>

          <RadioGroup
            value={inviteOnly}
            onValueChange={(value) => {
              setValue("inviteOnly", value);
              if (value === "true") {
                if (confidential) {
                  setValue("confidential", false);
                }
                setValue("inviteUsers", []);
              } else {
                if (confidential) {
                  setValue("confidential", true);
                }
              }
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="false"
                id="invited-only-false"
                data-testid={formText.everyone}
              />
              <Label htmlFor="invited-only-false" className="cursor-pointer">
                {formText.everyone}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="true"
                id="invited-only-true"
                data-testid={formText.invited_users_only}
              />
              <Label htmlFor="invited-only-true" className="cursor-pointer">
                {formText.invited_users_only}
              </Label>
            </div>
          </RadioGroup>

          {inviteOnly === "true" && (
            <SelectUsersFromContactList
              id="inviteUsers"
              label={formText.invite_users}
              control={control}
              name="inviteUsers"
              users={staticUsers}
            />
          )}
        </FieldSet>

        <FieldSet>
          <FieldLegend>{formText.additional_services}</FieldLegend>

          <JobToggle
            id="job-create-private"
            name="private"
            label={formText.private_job}
            checked={watch("private")}
            data-testid="private"
            control={control}
            subtitle={
              limits?.private.allowed
                ? formText.included_in_package
                : `${pricePrivate} ${formText.will_be_charged}`
            }
            onChange={(e) => handlePrivateCheckboxChange(e.target.checked)}
          />

          <JobToggle
            id="job-create-urgent"
            name="urgent"
            label={formText.urgent_job}
            checked={watch("urgent")}
            data-testid="urgent"
            control={control}
            subtitle={
              limits?.urgent.allowed
                ? formText.included_in_package
                : `${priceUrgent} ${formText.will_be_charged}`
            }
            onChange={(e) => handleUrgentCheckboxChange(e.target.checked)}
          />

          <JobToggle
            id="job-create-confidential"
            name="confidential"
            label={formText.confidential_job}
            checked={watch("confidential")}
            data-testid="confidential"
            control={control}
            subtitle={
              limits?.confidential.allowed
                ? formText.included_in_package
                : `${priceConfidential} ${formText.will_be_charged}`
            }
            onChange={(e) => handleConfidentialCheckboxChange(e.target.checked)}
          />
        </FieldSet>

        <TermsPrivacyCheckBox
          control={control}
          name="terms"
          value={watch("terms")}
          handleChange={(checked) => setValue("terms", checked)}
        />

        <div className="btn-wrap flex gap-2">
          <Button
            className="me-2"
            data-testid="submit"
            disabled={!allowPublish || isSubmitting}
            type="submit"
            onClick={() => setValue("draft", false)}
          >
            {formText.submit}
          </Button>
          <Button
            data-testid="draft"
            disabled={!allowPublish || isSubmitting}
            type="button"
            variant="outline-shaded"
            onClick={() => {
              setValue("draft", true);
              handleSubmit(onSubmit as any)();
            }}
          >
            {formText.draft}
          </Button>
        </div>
      </form>
    </>
  );
};
