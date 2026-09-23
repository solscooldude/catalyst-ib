const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function makeFriendCode() {
  let code = "CAT-";
  for (let i = 0; i < 6; i += 1) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export function normalizeUsername(raw?: string | null) {
  const next = (raw ?? "").trim().replace(/\s+/g, " ");
  if (next.length < 2) return "";
  return next.slice(0, 20);
}

export function normalizeAvatar(raw?: string | null) {
  if (!raw || typeof raw !== "string") return null;
  if (!raw.startsWith("data:image/")) return null;
  if (raw.length > 80_000) return null;
  return raw;
}

export function normalizeAvatarUrl(raw?: string | null) {
  if (!raw || typeof raw !== "string") return null;
  const next = raw.trim();
  if (!/^https:\/\//i.test(next)) return null;
  if (next.length > 500) return null;
  return next;
}

export function displayAvatar(
  dataUrl?: string | null,
  remoteUrl?: string | null,
) {
  return normalizeAvatar(dataUrl) ?? normalizeAvatarUrl(remoteUrl);
}

export function readImageAsAvatar(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const src = typeof reader.result === "string" ? reader.result : "";
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 96;
        canvas.height = 96;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        const side = Math.min(image.width, image.height);
        const sx = (image.width - side) / 2;
        const sy = (image.height - side) / 2;
        ctx.drawImage(image, sx, sy, side, side, 0, 0, 96, 96);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      image.onerror = () => resolve(null);
      image.src = src;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}
