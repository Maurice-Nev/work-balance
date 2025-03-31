// "use server";
import Logo from "@/components/general/logo";
import RegisterForm from "@/features/auth/forms/registerForm";
import { GalleryVerticalEnd } from "lucide-react";

export const dynamic = "force-static";
export const revalidate = 86400;

export default async function RegisterPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className=" flex size-6 items-center justify-center rounded-md">
            <Logo />
          </div>
        </a> */}
        <RegisterForm />
      </div>
    </div>
  );
}
