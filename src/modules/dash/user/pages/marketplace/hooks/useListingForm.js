import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { createListing, updateListing, marketplaceApi } from '@/features/user/marketplace';
import { useAuth } from '@/shared/auth/useAuth';
import {
  emptyListingForm,
  listingImageUrls,
  listingSeller,
  listingToForm,
  validateListingForm,
} from '../utils/listingForm';
import { existingPhoto, splitPhotos } from '../utils/listingPhotos';
import { MY_LISTINGS_PATH } from '../constant/constants';
import { useListingPhotos } from './useListingPhotos';

/** Create / edit listing: loads the listing for edit, validates, uploads photos and saves. */
export const useListingForm = () => {
  const { listingId } = useParams();
  const isEdit = Boolean(listingId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { saving } = useSelector((state) => state.userMarketplace);
  const profileUser = useSelector((state) => state.userProfile.user);
  const { user: authUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [loadingListing, setLoadingListing] = useState(isEdit);
  const [form, setForm] = useState(emptyListingForm);

  const busy = saving || uploading || loadingListing;
  const { photos, setPhotos, pickPhotos, removePhoto } = useListingPhotos({ disabled: busy });
  const seller = listingSeller(profileUser || authUser);

  useEffect(() => {
    if (!isEdit) return undefined;

    let cancelled = false;
    setLoadingListing(true);

    (async () => {
      try {
        const listing = await marketplaceApi.getListingById(listingId);
        if (cancelled || !listing) return;
        setForm(listingToForm(listing));
        setPhotos(listingImageUrls(listing).map(existingPhoto));
      } catch (err) {
        if (!cancelled) {
          toast.error(marketplaceApi.getApiErrorMessage(err, 'Failed to load listing'));
          navigate(MY_LISTINGS_PATH);
        }
      } finally {
        if (!cancelled) setLoadingListing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isEdit, listingId, navigate, setPhotos]);

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;

    const { error, values } = validateListingForm(form);
    if (error) {
      toast.error(error);
      return;
    }

    setUploading(true);
    try {
      const { existingUrls, newFiles } = splitPhotos(photos);

      let uploadedUrls = [];
      if (newFiles.length) {
        const uploaded = await marketplaceApi.uploadFiles(newFiles);
        uploadedUrls = uploaded.map((row) => row.url).filter(Boolean);
        if (uploadedUrls.length !== newFiles.length) {
          throw new Error('Some photos failed to upload');
        }
      }

      const payload = {
        ...values,
        images: [...existingUrls, ...uploadedUrls],
        ...(seller.location ? { location: String(seller.location).trim() } : {}),
      };

      const result = isEdit
        ? await dispatch(updateListing({ listingId, payload }))
        : await dispatch(createListing(payload));

      const matched = isEdit
        ? updateListing.fulfilled.match(result)
        : createListing.fulfilled.match(result);

      if (matched) {
        toast.success(isEdit ? 'Listing updated' : 'Listing published');
        navigate(MY_LISTINGS_PATH);
        return;
      }
      toast.error(
        result.payload || (isEdit ? 'Failed to update listing' : 'Failed to create listing'),
      );
    } catch (err) {
      toast.error(marketplaceApi.getApiErrorMessage(err, 'Failed to upload photos'));
    } finally {
      setUploading(false);
    }
  };

  return {
    isEdit,
    form,
    update,
    submit,
    busy,
    saving,
    uploading,
    loadingListing,
    seller,
    photos,
    pickPhotos,
    removePhoto,
  };
};
