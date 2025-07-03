import { auth } from "@/app/(main-site)/(auth)/auth";
import { redirect } from "next/navigation";

const UserProfilePage = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return <div>UserProfilePage</div>;
};

export default UserProfilePage;
