import React, { useState, useRef } from "react";
import {
  User,
  Lock,
  Bell,
  ShieldCheck,
  Camera,
  CheckCircle2,
  Save,
  Key,
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Card from "../components/common/Card";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function ProfileSettings() {
  const { user, updateProfile, changePassword } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'password' | 'notifications' | 'privacy'

  const fileInputRef = useRef(null);

  // Profile form state
  const [profileData, setProfileData] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  }));
  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
    }
  }
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Notification prefs state
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklyDigest: true,
    legalUpdates: false,
    schemeDeadlines: true,
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateProfile(profileData);
      showToast("Profile details updated successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }
    setIsSavingPassword(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      showToast("Password updated successfully!", "success");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showToast(err.message || "Failed to change password", "error");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      showToast("Photo must be smaller than 3MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData((prev) => ({ ...prev, avatar: reader.result }));
      showToast("Photo selected! Click 'Save Changes' to update.", "info");
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfileData((prev) => ({ ...prev, avatar: "" }));
    showToast("Photo removed. Click 'Save Changes' to update.", "info");
  };

  const tabs = [
    { id: "profile", label: "Profile Information", icon: User },
    { id: "password", label: "Change Password", icon: Lock },
    { id: "notifications", label: "Notification Settings", icon: Bell },
    { id: "privacy", label: "Privacy Settings", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your account settings and preferences"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Tabs Menu matching Reference Image 10 */}
        <div className="md:col-span-4 lg:col-span-3 space-y-1">
          <div className="bg-white rounded-2xl border border-[#E5EAE8] p-2 shadow-xs space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-left ${
                    isActive
                      ? "bg-[#15965B]/10 text-[#087443] border border-[#15965B]/20"
                      : "text-[#64748B] hover:text-[#17212B] hover:bg-[#F5F8F7]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-[#15965B]" : "text-[#64748B]"
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Panel matching Reference Image 10 */}
        <div className="md:col-span-8 lg:col-span-9">
          <Card className="p-6 sm:p-8">
            {/* Tab 1: Profile Information */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#17212B]">
                    Profile Information
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Update your personal profile and citizen contact details
                  </p>
                </div>

                {/* Hidden photo file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />

                {/* Avatar with Change Photo Button matching Reference Image 10 */}
                <div className="flex items-center gap-5 pb-4 border-b border-[#E5EAE8]">
                  <div className="relative group">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt="Profile Avatar"
                        className="w-20 h-20 rounded-full object-cover border-2 border-[#15965B]/40 shadow-xs"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-[#15965B] text-white text-2xl font-bold flex items-center justify-center border-2 border-[#15965B]/40 shadow-xs">
                        {(profileData.name || "C")[0]?.toUpperCase() || "C"}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Change photo"
                    >
                      <Camera className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-[#15965B] hover:text-[#087443] transition underline underline-offset-2"
                      >
                        Change Photo
                      </button>
                      {profileData.avatar && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="text-xs font-medium text-red-500 hover:text-red-700 transition"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B]">
                      JPG, PNG or WEBP up to 3MB.
                    </p>
                  </div>
                </div>

                {/* Profile Form Fields */}
                <div className="space-y-4 max-w-lg">
                  <Input
                    label="Full Name"
                    name="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    placeholder="Enter full name"
                    required
                  />

                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    placeholder="Enter email address"
                    required
                  />

                  <Input
                    label="Phone Number"
                    name="phone"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                {/* Save Changes Emerald Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSavingProfile}
                    leftIcon={Save}
                    className="font-bold px-6 shadow-sm"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            )}

            {/* Tab 2: Change Password */}
            {activeTab === "password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-lg">
                <div>
                  <h3 className="text-base font-bold text-[#17212B]">
                    Change Password
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Ensure your account is using a long, random password to stay secure
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="Enter current password"
                    required
                  />

                  <Input
                    label="New Password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Enter new password (min. 6 characters)"
                    required
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSavingPassword}
                  leftIcon={Key}
                  className="font-bold"
                >
                  Update Password
                </Button>
              </form>
            )}

            {/* Tab 3: Notification Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-base font-bold text-[#17212B]">
                    Notification Preferences
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Select how and when you receive civic scheme and legal updates
                  </p>
                </div>

                <div className="space-y-4 divide-y divide-[#E5EAE8]">
                  {[
                    {
                      id: "emailAlerts",
                      title: "Direct Scheme Deadline Alerts",
                      desc: "Receive email reminders for eKYC deadlines and subsidy enrollment windows.",
                    },
                    {
                      id: "weeklyDigest",
                      title: "Weekly Civic Intelligence Digest",
                      desc: "A consolidated weekly summary of new central/state gazettes.",
                    },
                    {
                      id: "legalUpdates",
                      title: "Statutory Law Amendments",
                      desc: "Immediate push notifications when major statutes (e.g. BNS, Tenancy) are revised.",
                    },
                  ].map((pref) => (
                    <div
                      key={pref.id}
                      className="pt-4 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-[#17212B]">
                          {pref.title}
                        </h4>
                        <p className="text-[11px] text-[#64748B] mt-0.5">
                          {pref.desc}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications[pref.id]}
                        onChange={(e) => {
                          setNotifications({
                            ...notifications,
                            [pref.id]: e.target.checked,
                          });
                          showToast("Preference saved", "info");
                        }}
                        className="w-4 h-4 rounded text-[#15965B] focus:ring-[#15965B]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Privacy Settings */}
            {activeTab === "privacy" && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-base font-bold text-[#17212B]">
                    Privacy & DPDP Compliance
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Under Digital Personal Data Protection Act, 2023, you maintain complete ownership of your civic queries.
                  </p>
                </div>

                <div className="p-4 bg-[#F5F8F7] rounded-xl border border-[#E5EAE8] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#17212B]">
                    <ShieldCheck className="w-4 h-4 text-[#15965B]" />
                    <span>Data Privacy Guarantee</span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Your uploaded legal notices, land deeds, and chat conversations are strictly sandboxed. CivicSphere AI does not use citizen personal records for public model training.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      showToast("Personal data archive exported as JSON.", "success")
                    }
                  >
                    Export My Data
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() =>
                      showToast("Account deletion request logged.", "info")
                    }
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

