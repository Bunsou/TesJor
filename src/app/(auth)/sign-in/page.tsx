"use client";

import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function SignInPage() {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-background to-secondary-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo/Brand */}
        <div>
          <Image
            src={"/logo.png"}
            alt="TesJor Logo"
            width={124}
            height={124}
            className="mx-auto mb-4"
          />
          <h1 className="text-6xl font-bold text-primary">TesJor</h1>
          <p className="text-xl text-foreground-muted mt-2">
            Discover Hidden Cambodia
          </p>
        </div>

        {/* Hero Text */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-foreground">
            Your Journey Beyond Angkor Wat
          </h2>
          <p className="text-lg text-foreground-muted">
            Explore authentic villages, local cuisine, and cultural treasures.
            Collect experiences and unlock the real Cambodia.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 py-6">
          <div className="space-y-2">
            <div className="text-4xl">🗺️</div>
            <p className="text-sm text-foreground-muted">Hidden Gems</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl">🍜</div>
            <p className="text-sm text-foreground-muted">Local Cuisine</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl">✨</div>
            <p className="text-sm text-foreground-muted">Gamified</p>
          </div>
        </div>

        {/* Sign In Button */}
        <div className="pt-4">
          <Button
            size="lg"
            className="w-full bg-primary hover:bg-primary-600 text-white"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Chrome className="mr-2 h-5 w-5" />
            {isLoading ? "Signing in..." : "Continue with Google"}
          </Button>
          <p className="text-xs text-foreground-muted mt-3">
            No app download required. Use directly in your browser.
          </p>
        </div>

        {/* Trust Badge */}
        <div className="pt-6 border-t border-border">
          <p className="text-sm text-foreground-muted">
            Join travelers discovering authentic Cambodia 🇰🇭
          </p>
        </div>
      </div>
    </div>
  );
}
