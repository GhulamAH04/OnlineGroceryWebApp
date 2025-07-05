import AccountSettings from "@/components/profile/settings/account";
import BillingAddressSettings from "@/components/profile/settings/address";

export default function SettingsPage() {
    return (
      <div className="flex-1 flex flex-col gap-8">
        <AccountSettings />
        <BillingAddressSettings />
      </div>
    );
}