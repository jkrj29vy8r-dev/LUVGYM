/** Up to two initials from a display name, falling back to "?". */
export function getInitials(name: string | null | undefined): string {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return "?";
  const first = parts[0]![0]!;
  const last = parts.length > 1 ? parts[parts.length - 1]![0]! : "";
  return (first + last).toUpperCase();
}

const FALLBACK_GRADIENTS = [
  "linear-gradient(155deg, #FF2A5F 0%, #7A1247 55%, #1A0510 100%)",
  "linear-gradient(155deg, #00F2FE 0%, #0B6B77 55%, #051217 100%)",
  "linear-gradient(155deg, #FF6690 0%, #6A1450 55%, #170512 100%)",
  "linear-gradient(155deg, #33F5FE 0%, #0E5A66 55%, #041014 100%)",
  "linear-gradient(155deg, #FF4D7D 0%, #831038 55%, #190309 100%)",
];

/** A stable gradient chosen from a seed (e.g. user id), for profiles without an uploaded photo. */
export function getFallbackGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % FALLBACK_GRADIENTS.length;
  return FALLBACK_GRADIENTS[index]!;
}
