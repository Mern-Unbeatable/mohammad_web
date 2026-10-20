import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { toggleSaveListing } from '@/features/dash/user/marketplace';

/** Returns `toggleSave(id)`, resolving to true when the save state changed. */
export const useToggleSaveListing = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (id) => {
      const result = await dispatch(toggleSaveListing(id));
      if (toggleSaveListing.rejected.match(result)) {
        toast.error(result.payload || 'Failed to update saved listing');
        return false;
      }
      return true;
    },
    [dispatch],
  );
};
