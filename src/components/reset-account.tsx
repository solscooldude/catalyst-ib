"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ROUTES } from "@/lib/routes";
import { claimDailyLogin, resetDemo } from "@/lib/store";

export function ResetAccountDanger() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function confirmReset() {
    resetDemo();
    claimDailyLogin();
    setOpen(false);
    router.push(ROUTES.setup);
  }

  return (
    <section className="flux-card space-y-4 border border-destructive/25 px-6 py-8">
      <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
        Danger zone
      </p>
      <h2 className="text-lg text-foreground">Reset account</h2>
      <p className="text-sm text-muted-foreground">
        Clears tokens, sprite care, lock hours, and shop on this device. Sign-in
        stays. This cannot be undone from here.
      </p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="destructive"
            className="h-11 rounded-full px-6"
          >
            Reset this account
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Reset this account?</DialogTitle>
            <DialogDescription>
              Local Catalyst data on this device will be wiped. You will go back
              to setup. This cannot be undone from here.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-full">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              className="rounded-full"
              onClick={confirmReset}
            >
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
