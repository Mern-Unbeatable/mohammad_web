import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { makePhotoId, revokeIfBlob, screenPhotoFiles } from '../utils/listingPhotos';

/** Photo list with blob previews for new files; previews are revoked on removal and unmount. */
export const useListingPhotos = ({ disabled }) => {
  const [photos, setPhotos] = useState([]);
  const photosRef = useRef([]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => revokeIfBlob(photo.previewUrl));
    };
  }, []);

  const pickPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length || disabled) return;

    const { accepted, errors, limitNotice } = screenPhotoFiles(files, photos.length);
    errors.forEach((message) => toast.error(message));
    if (limitNotice) toast(limitNotice);
    if (!accepted.length) return;

    setPhotos((prev) => [
      ...prev,
      ...accepted.map((file) => ({
        id: makePhotoId(),
        file,
        url: null,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
      })),
    ]);
  };

  const removePhoto = (id) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      revokeIfBlob(target?.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  return { photos, setPhotos, pickPhotos, removePhoto };
};
