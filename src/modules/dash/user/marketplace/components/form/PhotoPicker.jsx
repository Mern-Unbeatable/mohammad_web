import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { IMAGE_ACCEPT, MAX_PHOTOS } from '../../constant/constants';
import { FormLabel } from '@/components/form-controls';

const PhotoPicker = ({ photos, onPick, onRemove, disabled }) => {
  const fileInputRef = useRef(null);
  const openPicker = () => fileInputRef.current?.click();

  return (
    <div>
      <FormLabel as="p">
        Photos{' '}
        <span className="font-normal text-[#98A2B3]">
          (optional · up to {MAX_PHOTOS} · JPG, PNG, WebP, GIF)
        </span>
      </FormLabel>

      <input
        ref={fileInputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        multiple
        className="hidden"
        onChange={onPick}
        disabled={disabled}
      />

      {photos.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#E4E7EC] bg-[#F9FAFB]"
            >
              <img src={photo.previewUrl} alt={photo.name} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(photo.id)}
                disabled={disabled}
                aria-label={`Remove ${photo.name}`}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[#475467] shadow-sm hover:text-[#CC1016] disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS ? (
            <button
              type="button"
              onClick={openPicker}
              disabled={disabled}
              className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#D0D5DD] bg-[#F9FAFB] text-[#64748B] transition-colors hover:border-primary hover:bg-secondary/40 disabled:opacity-50"
            >
              <ImagePlus className="h-5 w-5 text-[#98A2B3]" />
              <span className="text-[12px] font-medium">Add more</span>
            </button>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-10 text-[#64748B] transition-colors hover:border-primary hover:bg-secondary/40 disabled:opacity-50"
        >
          <ImagePlus className="h-6 w-6 text-[#98A2B3]" />
          <span className="text-[13px] font-medium">Add product photos</span>
        </button>
      )}
    </div>
  );
};

export default PhotoPicker;
