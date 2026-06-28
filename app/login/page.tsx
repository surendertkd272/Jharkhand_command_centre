"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="rounded-card border border-line bg-white px-9 py-10 shadow-soft">
          {/* Lime diamond logo */}
          <div className="flex flex-col items-center text-center">
            <div className="grid h-16 w-16 rotate-45 place-items-center rounded-2xl bg-lime-500 shadow-soft">
              <ShieldCheck className="h-8 w-8 -rotate-45 text-ink-900" strokeWidth={2.25} />
            </div>

            <h1 className="mt-7 text-2xl font-extrabold tracking-tight text-ink-900">
              State Sports Command Center
            </h1>
            <p className="mt-2 text-sm text-muted">
              Government of Jharkhand &middot; Department of Sports
            </p>
          </div>

          {/* Sign-in */}
          <div className="mt-9">
            <Button
              variant="dark"
              size="lg"
              className="w-full"
              onClick={() => router.push("/")}
            >
              Sign in with SSO
              <ArrowRight className="h-4 w-4" />
            </Button>

            <p className="mt-4 text-center text-xs text-muted">
              Secure single sign-on for departmental officials
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-7 text-center text-xs text-muted">
          Authorized personnel only &middot; Demo build
        </p>
      </div>
    </div>
  );
}
