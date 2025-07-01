"use client";

import type React from "react";
import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  createBotSchema,
  type CreateBotFormData,
  createBotFormSchema,
  baseSchema,
} from "@/lib/schemas/create-bot-schema";
import { Session } from "next-auth";
import { Loader2, Loader, Upload } from "lucide-react";

const steps = [
  { id: 1, title: "Set a Chatbot Name", completed: false },
  { id: 2, title: "Choose Default Language", completed: false },
  { id: 3, title: "Select Avatar", completed: false },
  { id: 4, title: "Upload Data", completed: false },
  { id: 5, title: "Upload Brand Guideline", completed: false },
  { id: 6, title: "Set Bot Behavior & Tone", completed: false },
  { id: 7, title: "Review & Confirm", completed: false },
];

const languages = [
  { value: "en-gb", label: "British English", flag: "🇬🇧" },
  { value: "en-us", label: "American English", flag: "🇺🇸" },
  { value: "es", label: "Spanish", flag: "🇪🇸" },
  { value: "fr", label: "French", flag: "🇫🇷" },
  { value: "de", label: "German", flag: "🇩🇪" },
  { value: "it", label: "Italian", flag: "🇮🇹" },
];

const avatars = [
  { id: "professional", name: "Professional" },
  { id: "friendly", name: "Friendly" },
  { id: "modern", name: "Modern" },
  { id: "playful", name: "Playful" },
];

const tones = [
  { id: "professional", name: "Professional" },
  { id: "friendly", name: "Friendly" },
  { id: "helpful", name: "Helpful" },
  { id: "casual", name: "Casual" },
];

export default function CreateBotMultistepForm({
  userSession,
  currentStep,
  userId,
}: {
  userSession: Session;
  currentStep: number;
  userId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<CreateBotFormData>({
    language: "en-gb",
    greeting: "\uD83D\uDC4B Hello, how can I help you?",
    avatar: "",
    dataFile: undefined as any,
    dataFileTitle: "",
    dataFileDescription: "",
    brandGuidelines: "",
    url: undefined as any,
    tone: "",
    instructions: "",
    name: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const validateStep = (step: number): boolean => {
    setErrors({});

    try {
      let validationData: Partial<CreateBotFormData> = {};
      let schema;

      switch (step) {
        case 1:
          validationData = { name: formData.name };
          schema = baseSchema.pick({ name: true });
          break;
        case 2:
          validationData = {
            language: formData.language,
            greeting: formData.greeting,
          };
          schema = baseSchema.pick({ language: true, greeting: true });
          break;
        case 3:
          validationData = { avatar: formData.avatar };
          schema = baseSchema.pick({ avatar: true });
          break;
        case 4:
          return validateUploadDataStep();
        case 5:
          return validateBrandGuidelineStep();
        case 6:
          validationData = {
            tone: formData.tone,
            instructions: formData.instructions,
          };
          schema = baseSchema.pick({ tone: true, instructions: true });
          break;
        case 7:
          validationData = formData;
          schema = createBotFormSchema;
          break;
      }

      if (schema) schema.parse(validationData);
      return true;
    } catch (error: any) {
      console.log("Error validating step:", error);
      if (error.errors) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Validate file size
  const validateFileSize = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size must be 5MB or less");
      setErrors((prev) => {
        const newErrors = { ...prev };
        newErrors.general = "File size must be 5MB or less";
        return newErrors;
      });
      return false;
    }
    return true;
  };

  const validateUploadDataStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    const hasDataFile = !!formData.dataFile;

    if (!hasDataFile) {
      newErrors.general = "Data file is required";
    }
    const hasTitle = formData.dataFileTitle?.trim() !== "";

    const hasUrl = formData.url?.trim() !== "";

    if (hasDataFile && !hasTitle) {
      newErrors.dataFileTitle =
        "Data file title is required when a file is uploaded";
    }

    if (hasUrl && !formData.url?.startsWith("https://")) {
      newErrors.url = "Please enter a valid URL starting with https://";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const validateBrandGuidelineStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.brandGuidelines || !formData.brandGuidelines.trim()) {
      newErrors.brandGuidelines = "Please enter your brand guidelines";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const updateStep = (step: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", step.toString());
    router.push(`/create-new-bot?${params.toString()}`);
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (!validateStep(currentStep)) {
      toast.error("Please fix the errors before proceeding");
      return;
    }

    if (currentStep < steps.length) {
      updateStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      updateStep(currentStep - 1);
    }
  };

  const handleDataFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateFileSize(file)) return;
      setFormData((prev) => ({
        ...prev,
        dataFile: file,
      }));
      // Clear general error when file is uploaded
      if (errors.general) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.general;
          return newErrors;
        });
      }
    }
  };

  const handleFileUpload =
    (field: "brandFile") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!validateFileSize(file)) return;
        setFormData((prev) => ({ ...prev, [field]: file }));

        if (errors.general) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.general;
            return newErrors;
          });
        }
      }
    };

  const handleCreateBot = () => {
    startTransition(async () => {
      setIsValidating(true);

      try {
        // Final validation of all data
        const finalData = {
          ...formData,
          url: formData.url?.trim(), // Only one URL, optional
        };

        const validatedData = createBotSchema.parse(finalData);

        console.log("Validated Data:", validatedData);

        const botFormData = new FormData();

        botFormData.append("name", validatedData.name);
        botFormData.append("language", validatedData.language);
        botFormData.append("greeting", validatedData.greeting);
        botFormData.append("avatar", validatedData.avatar);
        botFormData.append("userId", userId);
        botFormData.append("dataFileTitle", validatedData.dataFileTitle || "");
        botFormData.append(
          "dataFileDescription",
          validatedData.dataFileDescription || ""
        );
        botFormData.append("brandGuidelines", validatedData.brandGuidelines);
        botFormData.append("tone", validatedData.tone);
        botFormData.append("instructions", validatedData.instructions);

        // Add URL if provided
        if (validatedData.url) {
          botFormData.append("url", validatedData.url);
        }

        // Add files if they exist
        if (validatedData.dataFile) {
          botFormData.append("dataFile", validatedData.dataFile);
        }

        console.log("botFormData", botFormData);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BOTBEE_SERVER_URL}/create-bot`,
          {
            method: "POST",
            body: botFormData,
            headers: {
              Authorization: `Bearer ${userSession.user.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.error);
          return;
        }

        const data = await response.json();
        console.log("Bot Creation Data:", data);

        toast.success("Bot created successfully");
      } catch (error: any) {
        if (error.errors) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err: any) => {
            newErrors[err.path[0]] = err.message;
          });
          setErrors(newErrors);
          console.log(newErrors);

          const errorSection = document.getElementById("validation-errors");
          if (errorSection) {
            errorSection.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }

          toast.error("Please fix the validation errors below");
        } else {
          toast.error("An error occurred while creating the bot");
        }
      } finally {
        setIsValidating(false);
      }
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Set Chatbot</h2>
            <div className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-sm">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Choose Default Language</h2>
            <div className="space-y-3">
              <div>
                <Label htmlFor="language" className="text-sm">
                  Language
                </Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, language: value }))
                  }
                >
                  <SelectTrigger
                    className={errors.language ? "border-red-500" : ""}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.language && (
                  <p className="text-sm text-red-500 mt-1">{errors.language}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Pick a default language for your customers
                </p>
              </div>
              <div>
                <Label htmlFor="greeting" className="text-sm">
                  Add Greetings
                </Label>
                <Textarea
                  id="greeting"
                  value={formData.greeting}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      greeting: e.target.value,
                    }))
                  }
                  className={`h-20 resize-none ${errors.greeting ? "border-red-500" : ""}`}
                />
                {errors.greeting && (
                  <p className="text-sm text-red-500 mt-1">{errors.greeting}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Select Avatar</h2>
            <RadioGroup
              value={formData.avatar}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, avatar: value }));
                if (errors.avatar) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.avatar;
                    return newErrors;
                  });
                }
              }}
            >
              <div className="space-y-2">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`flex items-center space-x-2 border rounded p-2 ${
                      errors.avatar ? "border-red-500" : ""
                    }`}
                  >
                    <RadioGroupItem value={avatar.id} id={avatar.id} />
                    <Label htmlFor={avatar.id} className="text-sm">
                      {avatar.name}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {errors.avatar && (
              <p className="text-sm text-red-500 mt-1">{errors.avatar}</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-medium">Upload Data</h2>

            {/* General Error Display */}
            {errors.general && (
              <div className="p-3  border border-destructive rounded-md">
                <p className="text-sm text-destructive">{errors.general}</p>
              </div>
            )}

            {/* File Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Upload File</h3>
              <div
                className={`border border-dashed rounded p-6 text-center ${
                  errors.general && !formData.dataFile
                    ? "border-destructive bg-destructive/10"
                    : ""
                }`}
              >
                <Upload className="mx-auto size-8 text-muted-foreground mb-2" />
                <p className="text-sm mb-2">Upload your data file</p>
                <Input
                  type="file"
                  onChange={handleDataFileUpload}
                  className="max-w-xs mx-auto"
                  accept=".pdf,.doc,.docx,.txt"
                />
                {formData.dataFile && (
                  <div className="mt-4 p-4 border rounded bg-muted text-left">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">
                        File: {formData.dataFile.name}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            dataFile: undefined as any,
                            dataFileTitle: "",
                            dataFileDescription: "",
                          }))
                        }
                        aria-label="Remove file"
                      >
                        &times;
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="datafile-title" className="text-xs">
                          Title{" "}
                          {formData.dataFile ? "(required)" : "(optional)"}
                        </Label>
                        <Input
                          id="datafile-title"
                          value={formData.dataFileTitle}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              dataFileTitle: e.target.value,
                            }));
                            // Clear error when user types
                            if (errors.dataFileTitle) {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.dataFileTitle;
                                return newErrors;
                              });
                            }
                          }}
                          className={`mt-1 ${errors.dataFileTitle ? "border-red-500" : ""}`}
                          placeholder="Enter a title for this file"
                        />
                        {errors.dataFileTitle && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.dataFileTitle}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="datafile-description"
                          className="text-xs"
                        >
                          Description (optional)
                        </Label>
                        <Textarea
                          id="datafile-description"
                          value={formData.dataFileDescription}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              dataFileDescription: e.target.value,
                            }))
                          }
                          className="mt-1 h-16 resize-none"
                          placeholder="Add a description for this file"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Add URL Button and Section */}
            <div className="space-y-4 p-4 border border-dashed rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Add URL (optional)</h3>
                {!showUrlInput && (
                  <Button
                    type="button"
                    onClick={() => setShowUrlInput(true)}
                    size="sm"
                  >
                    Add URL
                  </Button>
                )}
              </div>
              {showUrlInput && (
                <div className="space-y-3">
                  <Input
                    type="url"
                    value={formData.url}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, url: e.target.value }));
                      if (errors.url) {
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.url;
                          return newErrors;
                        });
                      }
                      if (errors.general && e.target.value.trim() !== "") {
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.general;
                          return newErrors;
                        });
                      }
                    }}
                    placeholder="https://example.com"
                    className={`flex-1 ${errors.url ? "border-red-500" : ""}`}
                  />
                  {errors.url && (
                    <p className="text-xs text-red-500 ml-1">{errors.url}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Brand Guidelines</h2>
            <div>
              <Label htmlFor="brand-guidelines" className="text-sm">
                Enter your brand guidelines
              </Label>
              <Textarea
                id="brand-guidelines"
                value={formData.brandGuidelines}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    brandGuidelines: e.target.value,
                  }))
                }
                className={`h-32 resize-none ${errors.brandGuidelines ? "border-red-500" : ""}`}
                placeholder="Describe your brand guidelines here..."
              />
              {errors.brandGuidelines && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.brandGuidelines}
                </p>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Set Bot Behavior & Tone</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Conversation Tone</Label>
                <RadioGroup
                  value={formData.tone}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, tone: value }))
                  }
                >
                  <div className="space-y-2 mt-2">
                    {tones.map((tone) => (
                      <div
                        key={tone.id}
                        className={`flex items-center space-x-2 border rounded p-2 ${
                          errors.tone ? "border-red-500" : ""
                        }`}
                      >
                        <RadioGroupItem value={tone.id} id={tone.id} />
                        <Label htmlFor={tone.id} className="text-sm">
                          {tone.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                {errors.tone && (
                  <p className="text-sm text-red-500 mt-1">{errors.tone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="instructions" className="text-sm">
                  Additional Instructions
                </Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      instructions: e.target.value,
                    }))
                  }
                  className={`h-20 resize-none ${errors.instructions ? "border-red-500" : ""}`}
                  placeholder="Add specific instructions..."
                />
                {errors.instructions && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.instructions}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Review and Confirm</h2>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Language:</span>
                    <span>
                      {
                        languages.find((l) => l.value === formData.language)
                          ?.label
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avatar:</span>
                    <span>
                      {avatars.find((a) => a.id === formData.avatar)?.name ||
                        "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tone:</span>
                    <span>
                      {tones.find((t) => t.id === formData.tone)?.name ||
                        "Not selected"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span>Data File:</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formData.dataFile?.name || "Not uploaded"}
                      {formData.dataFileTitle && ` - ${formData.dataFileTitle}`}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span>URL:</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formData.url?.trim() !== ""
                        ? formData.url
                        : "Not provided"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span>Brand Guidelines:</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formData.brandGuidelines || "Not provided"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div>
              <Label className="text-sm">Greeting</Label>
              <p className="text-sm bg-muted p-2 rounded mt-1">
                {formData.greeting}
              </p>
            </div>

            {/* Validation Errors Section */}
            {Object.keys(errors).length > 0 && (
              <div id="validation-errors" className="space-y-4">
                <div className="p-4 border border-destructive rounded-md bg-destructive/10">
                  <h3 className="text-lg font-medium text-destructive mb-3">
                    ⚠️ Please fix the following errors before creating your bot:
                  </h3>
                  <div className="space-y-3">
                    {/* Step 1: Bot Name */}
                    {errors.name && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-destructive min-w-[80px]">
                          Step 1:
                        </span>
                        <div>
                          <p className="text-sm text-destructive font-medium">
                            Bot Name
                          </p>
                          <p className="text-sm text-destructive/80">
                            {errors.name}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Language & Greeting */}
                    {(errors.language || errors.greeting) && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-destructive min-w-[80px]">
                          Step 2:
                        </span>
                        <div className="space-y-1">
                          {errors.language && (
                            <div>
                              <p className="text-sm text-destructive font-medium">
                                Language
                              </p>
                              <p className="text-sm text-destructive/80">
                                {errors.language}
                              </p>
                            </div>
                          )}
                          {errors.greeting && (
                            <div>
                              <p className="text-sm text-destructive font-medium">
                                Greeting
                              </p>
                              <p className="text-sm text-destructive/80">
                                {errors.greeting}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Avatar */}
                    {errors.avatar && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-destructive min-w-[80px]">
                          Step 3:
                        </span>
                        <div>
                          <p className="text-sm text-destructive font-medium">
                            Avatar
                          </p>
                          <p className="text-sm text-destructive/80">
                            {errors.avatar}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Upload Data */}
                    {(errors.general || errors.dataFileTitle || errors.url) && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-destructive min-w-[80px]">
                          Step 4:
                        </span>
                        <div className="space-y-1">
                          {errors.general && (
                            <div>
                              <p className="text-sm text-destructive font-medium">
                                Data Source
                              </p>
                              <p className="text-sm text-destructive/80">
                                {errors.general}
                              </p>
                            </div>
                          )}
                          {errors.dataFileTitle && (
                            <div>
                              <p className="text-sm text-destructive font-medium">
                                Data File Title
                              </p>
                              <p className="text-sm text-destructive/80">
                                {errors.dataFileTitle}
                              </p>
                            </div>
                          )}
                          {errors.url && (
                            <div>
                              <p className="text-sm text-destructive font-medium">
                                URL
                              </p>
                              <p className="text-sm text-destructive/80">
                                {errors.url}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 5: Brand Guidelines */}
                    {errors.brandGuidelines && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-destructive min-w-[80px]">
                          Step 5:
                        </span>
                        <div>
                          <p className="text-sm text-destructive font-medium">
                            Brand Guidelines
                          </p>
                          <p className="text-sm text-destructive/80">
                            {errors.brandGuidelines}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Step 6: Bot Behavior */}
                    {(errors.tone || errors.instructions) && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-destructive min-w-[80px]">
                          Step 6:
                        </span>
                        <div className="space-y-1">
                          {errors.tone && (
                            <div>
                              <p className="text-sm text-destructive font-medium">
                                Conversation Tone
                              </p>
                              <p className="text-sm text-destructive/80">
                                {errors.tone}
                              </p>
                            </div>
                          )}
                          {errors.instructions && (
                            <div>
                              <p className="text-sm text-destructive font-medium">
                                Additional Instructions
                              </p>
                              <p className="text-sm text-destructive/80">
                                {errors.instructions}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-muted border-b lg:border-r lg:border-b-0 shrink-0">
        <div className="p-6 h-full flex flex-col">
          <h1 className="font-semibold text-xl mb-6 tracking-tight">
            Create Bot
          </h1>
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
            {steps.map((step) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep || step.completed;
              return (
                <div
                  key={step.id}
                  className={`px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors duration-150 select-none w-full
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow"
                        : isCompleted
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/60"
                    }
                  `}
                  onClick={() => updateStep(step.id)}
                >
                  <span
                    className={`text-base font-medium ${
                      isActive ? "" : "group-hover:text-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-2 sm:px-4 lg:px-12 py-8 bg-background min-h-screen">
        <div className="w-full max-w-2xl">
          <Card className="shadow-lg border border-border">
            <CardContent className="p-6 lg:p-8">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center gap-4 mt-8 sticky bottom-0 bg-background py-4 z-10 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              size="lg"
              className="w-32"
            >
              Previous
            </Button>
            <div>
              <Button
                onClick={
                  currentStep === steps.length ? handleCreateBot : handleNext
                }
                size="lg"
                className="w-32"
                disabled={isValidating || isPending}
              >
                {isValidating || isPending ? (
                  <Loader className="size-4 animate-spin" />
                ) : currentStep === steps.length ? (
                  "Create Bot"
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
