"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useExtensionConnected } from "@/components/extension-sync";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  CHROME_WEB_STORE_URL,
  EXTENSION_ZIP_HREF,
  EXTENSION_ZIP_NAME,
} from "@/lib/lock-extension";

const STEPS = [
  `Unzip ${EXTENSION_ZIP_NAME}. You should see an extension folder.`,
  "In Chrome, open chrome://extensions",
  "Turn on Developer mode (top right).",
  "Click Load unpacked and select that unzipped extension folder.",
  "Come back to this Catalyst tab so lock hours and unlocks can sync. Refresh if it still says not connected.",
] as const;

function downloadZip() {
  const link = document.createElement("a");
  link.href = EXTENSION_ZIP_HREF;
  link.download = EXTENSION_ZIP_NAME;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function LockExtensionSetup() {
  const connected = useExtensionConnected();
  const [open, setOpen] = useState(false);

  function addExtension() {
    downloadZip();
    setOpen(true);
  }

  return (
    <section>
      <h2 className="text-base text-foreground">Chrome lock extension</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Chrome will not install this from the site. Download the zip, then Load
        unpacked. This tab stays the control plane.
      </p>

      {connected ? (
        <p className="mt-4 rounded-2xl bg-primary/15 px-4 py-3 text-sm text-foreground ring-1 ring-primary/40">
          Extension connected. Policy syncs while this tab is open.
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Not connected yet. Add the extension, then return here.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          type="button"
          className="h-11 rounded-full px-6"
          onClick={addExtension}
        >
          Add extension
          <Download className="size-4" />
        </Button>
        {CHROME_WEB_STORE_URL ? (
          <Button asChild variant="outline" className="h-11 rounded-full px-6">
            <a href={CHROME_WEB_STORE_URL}>Chrome Web Store</a>
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full px-6"
            disabled
            title="Store listing later. Load unpacked for now."
          >
            Chrome Web Store
          </Button>
        )}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="mx-auto max-h-[min(88dvh,36rem)] w-full max-w-lg gap-0 rounded-t-3xl border-x border-t bg-[#121218] text-[#F4F4F5]"
        >
          <SheetHeader className="px-6 pt-6">
            <SheetTitle className="text-lg text-[#F4F4F5]">
              Load unpacked
            </SheetTitle>
            <SheetDescription className="text-[#A1A1AA]">
              The zip is downloading. Chrome cannot add it for you.
            </SheetDescription>
          </SheetHeader>
          <ol className="space-y-3 px-6 pb-2 text-sm text-[#F4F4F5]">
            {STEPS.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-[#5EEAD4]">
                  {index + 1}
                </span>
                <span className="leading-6">{step}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2 px-6 pb-6">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full px-5"
              onClick={downloadZip}
            >
              Download again
            </Button>
            <Button
              type="button"
              className="h-11 rounded-full px-5"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
