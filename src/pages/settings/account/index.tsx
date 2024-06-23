import { Separator } from "~/components/ui/separator";
import { AccountForm } from "./account-form";
import SettingsLayout from "~/components/SettingsLayout";

export default function SettingsAccountPage() {
  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Account</h3>
          <p className="text-muted-foreground text-sm">
            Update your account settings. Set your preferred language and
            timezone.
          </p>
        </div>
        <Separator />
        <AccountForm />
      </div>
    </SettingsLayout>
  );
}
