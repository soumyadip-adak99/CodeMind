"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { GitHubIcon } from "@/components/icons/github-icon";
import { BrandMark } from "@/components/layout/app-shell";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // TanStack Query mutation for handling the login transition
  const loginMutation = useMutation({
    mutationFn: async () => {
      // For OAuth, we typically redirect to the backend endpoint
      // Simulate a small delay for the spinner before navigation
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Update this URL to match your Spring Boot backend's OAuth2 authorization endpoint
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      window.location.href = `${backendUrl}/oauth2/authorization/github`;
    },
  });

  return (
    <div className="flex flex-col space-y-6 w-full max-w-md mx-auto relative z-10">
      <div className="flex flex-col space-y-2 text-center items-center">
        <BrandMark className="h-12 w-12 mb-2 text-primary" />
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <Card className="border-border shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign In</CardTitle>
          <CardDescription>
            Use your GitHub account to authenticate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>
                {error === "access_denied"
                  ? "You denied access to your GitHub account."
                  : "An error occurred during authentication. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          <button
            type="button"
            onClick={() => loginMutation.mutate()}
            disabled={loginMutation.isPending}
            className={cn(
              buttonVariants({ variant: "default" }),
              "w-full flex items-center justify-center h-11 transition-all duration-300"
            )}
          >
            {loginMutation.isPending ? (
              <>
                <Spinner className="mr-2 h-4 w-4 text-primary-foreground" />
                Connecting to GitHub...
              </>
            ) : (
              <>
                <GitHubIcon className="mr-2 h-5 w-5" />
                Sign in with GitHub
              </>
            )}
          </button>
        </CardContent>
      </Card>
      
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Spinner className="h-8 w-8 text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">Loading login...</p>
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}
