"use client";

import { Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";

interface SignInPromptProps {
  title?: string;
  description?: string;
}

export function SignInPrompt({
  title = "Sign in Required",
  description = "Please sign in to access this feature and start your journey.",
}: SignInPromptProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Sign in failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 space-y-6 text-center border-border/50 shadow-lg">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Chrome className="h-8 w-8 text-primary" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-foreground-muted">{description}</p>
        </div>

        {/* Sign In Button */}
        <Button
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <Chrome className="mr-2 h-5 w-5" />
          {isLoading ? "Signing in..." : "Continue with Google"}
        </Button>

        {/* Footer */}
        <p className="text-xs text-foreground-muted">
          Join travelers discovering authentic Cambodia 🇰🇭
        </p>
      </Card>
    </div>
  );
}
