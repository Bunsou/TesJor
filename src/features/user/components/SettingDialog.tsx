import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Languages, LogOut, Settings, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

async function signOut() {
  await fetch("/api/auth/sign-out", { method: "POST" });
  window.location.href = "/sign-in";
}

function changeLanguage() {
  // Comming soon
  toast("Language change feature coming soon!");
}

function handlePrivacyAndSecurity() {
  // implement the modal for privacy and security settings
}

const SettingDialog = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <button className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#2A201D] border border-gray-200 dark:border-gray-800 text-[#1a110f] dark:text-[#f2eae8] font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm flex items-center gap-2">
            <Settings className="size-4" />
            Settings
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingDialog;
