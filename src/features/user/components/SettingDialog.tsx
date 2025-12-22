"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Languages,
  LogOut,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { PRIVACY_POLICY } from "@/constants/privacy-policy";
import { TERMS_OF_SERVICE } from "@/constants/terms-of-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

async function signOut() {
  await fetch("/api/auth/sign-out", { method: "POST" });
  window.location.href = "/sign-in";
}

const SettingDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"settings" | "privacy">(
    "settings"
  );

  const changeLanguage = () => {
    toast.info("Language change feature coming soon!", {
      // description: "We're working on adding multi-language support.",
      duration: 3000,
    });
  };

  const handlePrivacyAndSecurity = () => {
    setCurrentView("privacy");
  };

  const handleBackToSettings = () => {
    setCurrentView("settings");
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // Reset to settings view when dialog closes
      setTimeout(() => setCurrentView("settings"), 200);
    }
  };

  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <button className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-800 text-[#1a110f] dark:text-[#f2eae8] font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm flex items-center gap-2">
            <Settings className="size-4" />
            Settings
          </button>
        </DialogTrigger>
        <DialogContent
          className={
            currentView === "privacy" ? "max-w-3xl max-h-[80vh]" : "max-w-md"
          }
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentView === "privacy" && (
                <button
                  onClick={handleBackToSettings}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors"
                >
                  <ArrowLeft className="size-5" />
                </button>
              )}
              {currentView === "settings"
                ? "Profile Settings"
                : "Privacy & Security"}
            </DialogTitle>
          </DialogHeader>

          {currentView === "settings" ? (
            <div className="flex flex-col gap-2 py-4">
              {/* <button className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center gap-3">
              <span className="material-symbols-outlined text-xl text-gray-600 dark:text-gray-400">
                edit
              </span>
              <div>
                <p className="font-medium text-sm text-[#1a110f] dark:text-[#f2eae8]">
                  Edit Profile
                </p>
                <p className="text-xs text-[#926154] dark:text-[#d6c1bd]">
                  Update your information
                </p>
              </div>
            </button> */}

              {/* <button className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center gap-3">
              <span className="material-symbols-outlined text-xl text-gray-600 dark:text-gray-400">
                notifications
              </span>
              <div>
                <p className="font-medium text-sm text-[#1a110f] dark:text-[#f2eae8]">
                  Notifications
                </p>
                <p className="text-xs text-[#926154] dark:text-[#d6c1bd]">
                  Manage your notifications
                </p>
              </div>
            </button> */}

              <button
                onClick={handlePrivacyAndSecurity}
                className="w-full px-4 py-3 text-left rounded-lg border-2 border-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-xl text-gray-600 dark:text-gray-400">
                  <ShieldCheck />
                </span>
                <div>
                  <p className="font-medium text-sm text-[#1a110f] dark:text-[#f2eae8]">
                    Privacy & Security
                  </p>
                  <p className="text-xs text-[#926154] dark:text-[#d6c1bd]">
                    Control your privacy
                  </p>
                </div>
              </button>

              <button
                onClick={changeLanguage}
                className="w-full px-4 py-3 text-left rounded-lg border-2 border-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-xl text-gray-600 dark:text-gray-400">
                  <Languages />
                </span>
                <div>
                  <p className="font-medium text-sm text-[#1a110f] dark:text-[#f2eae8]">
                    Language
                  </p>
                  <p className="text-xs text-[#926154] dark:text-[#d6c1bd]">
                    English
                  </p>
                </div>
              </button>

              <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

              <button
                onClick={signOut}
                className="w-full px-4 py-3 text-left rounded-lg border-2 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-3 text-red-600 dark:text-red-400"
              >
                <span className="material-symbols-outlined text-xl">
                  <LogOut />
                </span>
                <div>
                  <p className="font-medium text-sm">Sign Out</p>
                  <p className="text-xs opacity-70">Sign out of your account</p>
                </div>
              </button>
            </div>
          ) : (
            <Tabs defaultValue="privacy" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
                <TabsTrigger value="terms">Terms of Service</TabsTrigger>
              </TabsList>

              <TabsContent value="privacy" className="mt-4">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {PRIVACY_POLICY.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Last Updated: {PRIVACY_POLICY.lastUpdated}
                      </p>
                    </div>
                    {PRIVACY_POLICY.sections.map((section, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-semibold text-base">
                          {section.title}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="terms" className="mt-4">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {TERMS_OF_SERVICE.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Last Updated: {TERMS_OF_SERVICE.lastUpdated}
                      </p>
                    </div>
                    {TERMS_OF_SERVICE.sections.map((section, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-semibold text-base">
                          {section.title}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingDialog;
