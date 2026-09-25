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
  EXTENSION_UNZIP_ZIP_HREF,
  EXTENSION_UNZIP_ZIP_NAME,
  EXTENSION_VERSION,
  EXTENSION_ZIP_HREF,
  EXTENSION_ZIP_NAME,
} from "@/lib/lock-extension";

const STEPS = [
  `Download the zip (${EXTENSION_ZIP_NAME}). A second copy is named ${EXTENSION_UNZIP_ZIP_NAME} — same files inside.`,
  "Unzip / Extract it. You must get a folder named extension. Open that folder and confirm it contains manifest.json.",
  "In Chrome, open chrome://extensions",
  "Turn on Developer mode (top right).",
  "Click Load unpacked. Select the extension folder — the one that contains manifest.json. Never select the .zip. Never select Downloads itself.",
  "Come back to this Catalyst tab so lock hours and unlocks can sync. Refresh if it still says not connected.",
  `Click the Catalyst Lock toolbar icon for ON / OFF. After downloading ${EXTENSION_VERSION}, open chrome://extensions and press Reload on Catalyst Lock so Chrome drops the old Off-stuck build.`,
] as const;

function downloadHref(href: string, filename: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function downloadZip() {
  downloadHref(EXTENSION_ZIP_HREF, EXTENSION_ZIP_NAME);
}

function downloadNamedZip() {
  downloadHref(EXTENSION_UNZIP_ZIP_HREF, EXTENSION_UNZIP_ZIP_NAME);
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
        Current version <span className="font-mono">{EXTENSION_VERSION}</span>.
        Chrome will not install this from the site. Download the zip, unzip it
        so you have a folder named <span className="font-mono">extension</span>,
        then Load unpacked and pick that folder — never the .zip. After every
        new zip, Chrome keeps the old code until you open chrome://extensions
        and press Reload on Catalyst Lock. If the toolbar still says Off during
        lock hours, you are on an older zip — download {EXTENSION_VERSION} and
        Reload. Lock hours always force the toolbar On and install block
        rules, even if you left it Off last night.
      </p>

      {connected ? (
        <p className="mt-4 rounded-2xl bg-primary/15 px-4 py-3 text-sm text-foreground ring-1 ring-primary/40">
          Extension connected. Policy syncs while this tab is open.
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Not connected yet. Unzip first, then Load unpacked on the{" "}
          <span className="font-mono">extension</span> folder.
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
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-full px-6"
          onClick={() => {
            downloadNamedZip();
            setOpen(true);
          }}
        >
          Download unzip-me zip
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
          className="mx-auto max-h-[min(92dvh,44rem)] w-full max-w-lg gap-0 overflow-y-auto rounded-t-3xl border-x border-t bg-[#121218] text-[#F4F4F5]"
        >
          <SheetHeader className="px-6 pt-6">
            <SheetTitle className="text-lg text-[#F4F4F5]">
              Unzip, then pick the extension folder
            </SheetTitle>
            <SheetDescription className="text-[#A1A1AA]">
              Chrome Load unpacked only accepts a folder. The zip is
              downloading. Extract it first.
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
          <p className="mx-6 mt-1 rounded-2xl bg-primary/10 px-4 py-3 text-sm leading-6 text-[#F4F4F5] ring-1 ring-primary/30">
            If you only see a zip in the picker, cancel and unzip first. Select
            the <span className="font-mono text-[#5EEAD4]">extension</span>{" "}
            folder (it must contain{" "}
            <span className="font-mono text-[#5EEAD4]">manifest.json</span>).
            Never pick the .zip. Never pick Downloads.
          </p>
          <div className="flex flex-wrap gap-2 px-6 py-6">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full px-5"
              onClick={downloadZip}
            >
              Download zip
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full px-5"
              onClick={downloadNamedZip}
            >
              Download unzip-me zip
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
