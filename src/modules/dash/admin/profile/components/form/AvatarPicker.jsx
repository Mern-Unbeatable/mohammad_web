import { useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { DEFAULT_INITIALS, IMAGE_ACCEPT } from "../../constant/constants";

/** Round avatar that opens a file picker; read-only without `onPick`. */
const AvatarPicker = ({ src, initials, alt, onPick, uploading }) => {
  const inputRef = useRef(null);
  const disabled = uploading || !onPick;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
      aria-label="Change profile photo"
      title="JPG, PNG or WebP · 400×400px"
      className="group relative shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed"
    >
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onPick?.(file);
        }}
      />
      <Avatar src={src || null} alt={alt} initials={initials || DEFAULT_INITIALS} size="lg" />
      {uploading ? (
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-deep-blue/50">
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        </span>
      ) : onPick ? (
        <>
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-deep-blue/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="h-5 w-5 text-white" />
          </span>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-primary text-white">
            <Camera className="h-3 w-3" />
          </span>
        </>
      ) : null}
    </button>
  );
};

export default AvatarPicker;
