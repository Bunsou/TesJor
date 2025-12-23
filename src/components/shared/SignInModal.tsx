"use client";

import { Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: string;
}

export function SignInModal({
  isOpen,
  onClose,
  action = "perform this action",
}: SignInModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: window.location.pathname,
      });
    } catch (error) {
      console.error("Sign in failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Chrome className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            Sign in Required
          </DialogTitle>
          <DialogDescription className="text-center">
            Please sign in to {action}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <Button
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Chrome className="mr-2 h-5 w-5" />
            {isLoading ? "Signing in..." : "Continue with Google"}
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={onClose}
            disabled={isLoading}
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
