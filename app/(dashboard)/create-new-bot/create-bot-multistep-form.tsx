"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { Check, Upload } from "lucide-react";
import { toast } from "sonner";

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
  currentStep,
}: {
  currentStep: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    language: "en-gb",
    greeting: "\uD83D\uDC4B Hello, how can I help you?",
    avatar: "",
    dataFiles: [] as { file: File; name: string; description: string }[],
    brandFile: null as File | null,
    tone: "",
    instructions: "",
    name: "",
  });

  const updateStep = (step: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", step.toString());
    router.push(`/create-new-bot?${params.toString()}`);
  };

  const handleNext = () => {
    if (currentStep === 4) {
      if (formData.dataFiles.length === 0) {
        toast.error("Please upload at least one data file");
        return;
      }
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

  const handleDataFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((file) => ({
        file,
        name: file.name,
        description: "",
      }));
      setFormData((prev) => ({
        ...prev,
        dataFiles: [...prev.dataFiles, ...newFiles],
      }));
    }
  };

  const handleDataFileChange = (
    index: number,
    field: "name" | "description",
    value: string
  ) => {
    setFormData((prev) => {
      const updatedFiles = [...prev.dataFiles];
      updatedFiles[index] = { ...updatedFiles[index], [field]: value };
      return { ...prev, dataFiles: updatedFiles };
    });
  };

  const handleRemoveDataFile = (index: number) => {
    setFormData((prev) => {
      const updatedFiles = [...prev.dataFiles];
      updatedFiles.splice(index, 1);
      return { ...prev, dataFiles: updatedFiles };
    });
  };

  const handleFileUpload =
    (field: "brandFile") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFormData((prev) => ({ ...prev, [field]: file }));
      }
    };

  const handleCreateBot = () => {
    console.log("Bot Creation Data:", {
      name: formData.name,
      language: formData.language,
      greeting: formData.greeting,
      avatar: formData.avatar,
      dataFiles: formData.dataFiles,
      brandFile: formData.brandFile,
      tone: formData.tone,
      instructions: formData.instructions,
    });
    toast.success("Bot created successfully");
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
                />
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
                  <SelectTrigger>
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
                  className="h-20 resize-none"
                />
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
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, avatar: value }))
              }
            >
              <div className="space-y-2">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className="flex items-center space-x-2 border rounded p-2"
                  >
                    <RadioGroupItem value={avatar.id} id={avatar.id} />
                    <Label htmlFor={avatar.id} className="text-sm">
                      {avatar.name}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Upload Data</h2>
            <div className="border border-dashed rounded p-6 text-center">
              <Upload className="mx-auto size-8 text-muted-foreground mb-2" />
              <p className="text-sm mb-2">Upload your data files</p>
              <Input
                type="file"
                onChange={handleDataFilesUpload}
                className="max-w-xs mx-auto"
                accept=".pdf,.doc,.docx,.txt"
                multiple
              />
              <div className="mt-4 space-y-4">
                {formData.dataFiles.length > 0 &&
                  formData.dataFiles.map((data, idx) => (
                    <div
                      key={idx}
                      className="border rounded p-3 mb-2 bg-muted text-left"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          File: {data.file.name}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveDataFile(idx)}
                          aria-label="Remove file"
                        >
                          &times;
                        </Button>
                      </div>
                      <div className="mb-2">
                        <Label
                          htmlFor={`datafile-name-${idx}`}
                          className="text-xs"
                        >
                          File Name
                        </Label>
                        <Input
                          id={`datafile-name-${idx}`}
                          value={data.name}
                          onChange={(e) =>
                            handleDataFileChange(idx, "name", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`datafile-desc-${idx}`}
                          className="text-xs"
                        >
                          Description (optional)
                        </Label>
                        <Textarea
                          id={`datafile-desc-${idx}`}
                          value={data.description}
                          onChange={(e) =>
                            handleDataFileChange(
                              idx,
                              "description",
                              e.target.value
                            )
                          }
                          className="mt-1 h-16 resize-none"
                          placeholder="Add a description for this file (optional)"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Upload Brand Guideline</h2>
            <div className="border border-dashed rounded p-6 text-center">
              <Upload className="mx-auto size-8 text-muted-foreground mb-2" />
              <p className="text-sm mb-2">Upload brand guidelines</p>
              <Input
                type="file"
                onChange={handleFileUpload("brandFile")}
                className="max-w-xs mx-auto"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
              {formData.brandFile && (
                <p className="mt-2 text-xs text-success-foreground">
                  {formData.brandFile.name}
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
                        className="flex items-center space-x-2 border rounded p-2"
                      >
                        <RadioGroupItem value={tone.id} id={tone.id} />
                        <Label htmlFor={tone.id} className="text-sm">
                          {tone.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
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
                  className="h-20 resize-none"
                  placeholder="Add specific instructions..."
                />
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
                    <span>Data:</span>
                    {formData.dataFiles.length > 0 ? (
                      <ul className="ml-4 list-disc">
                        {formData.dataFiles.map((data, idx) => (
                          <li key={idx}>
                            <span className="font-medium">{data.name}</span>
                            {data.description && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({data.description})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="ml-4">Not uploaded</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span>Brand:</span>
                    <span>{formData.brandFile?.name || "Not uploaded"}</span>
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
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  // Determine if the Next button should be disabled
  const isNextDisabled = () => {
    if (currentStep === 4) {
      if (formData.dataFiles.length === 0) {
        return true;
      }
    }
    return false;
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
                disabled={isNextDisabled()}
                size="lg"
                className="w-32"
              >
                {currentStep === steps.length ? "Create Bot" : "Next"}
              </Button>
              {isNextDisabled() && (
                <p className="text-sm text-red-500">
                  Please upload at least one data file
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
