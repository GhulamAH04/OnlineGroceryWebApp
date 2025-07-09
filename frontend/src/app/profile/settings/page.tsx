"use client"

import AccountSettings from "@/components/profile/settings/account";
import BillingAddressSettings from "@/components/profile/settings/address";
import UpdateProfileModal from "@/components/updateProfile.modal";
import { useState } from "react";

export default function SettingsPage() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="flex-1 flex flex-col gap-8">
      <AccountSettings onChangeImageClick={() => setShowModal(true)} />
      <BillingAddressSettings />
      <UpdateProfileModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
