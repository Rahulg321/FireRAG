import React from "react";
import CreateBotMultistepForm from "./create-bot-multistep-form";

export const metadata = {
  title: "Create New Bot",
  description: "Create a new bot",
};

const CreateNewBotPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const currentStep = Number.parseInt((params.step as string) || "1");

  return (
    <div>
      <CreateBotMultistepForm currentStep={currentStep} />
    </div>
  );
};

export default CreateNewBotPage;
