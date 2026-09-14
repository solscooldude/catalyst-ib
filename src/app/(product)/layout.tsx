import { AuthGate } from "@/components/auth-gate";
import { AppShell } from "@/components/app-shell";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <AppShell>{children}</AppShell>
    </AuthGate>
  );
}
