import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import Card from '@/components/ui/Card';
import MarketplacePage from './components/layout/MarketplacePage';
import ListingForm from './components/form/ListingForm';
import ListingFormLoading from './components/form/ListingFormLoading';
import { useListingForm } from './hooks/useListingForm';
import { MY_LISTINGS_PATH } from './constant/constants';

const CreateListingView = () => {
  const listingForm = useListingForm();
  const { isEdit } = listingForm;

  if (listingForm.loadingListing) {
    return (
      <MarketplacePage containerClassName="max-w-[760px]">
        <ListingFormLoading />
      </MarketplacePage>
    );
  }

  return (
    <MarketplacePage containerClassName="max-w-[760px]">
      <Link
        to={MY_LISTINGS_PATH}
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to my listings
      </Link>

      <Card>
        <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
          <h1 className="text-[22px] font-bold text-deep-blue sm:text-[24px]">
            {isEdit ? 'Edit listing' : 'Create a listing'}
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Sell or exchange second-hand laboratory equipment.
          </p>
        </div>

        <ListingForm
          form={listingForm.form}
          update={listingForm.update}
          onSubmit={listingForm.submit}
          busy={listingForm.busy}
          saving={listingForm.saving}
          uploading={listingForm.uploading}
          isEdit={isEdit}
          seller={listingForm.seller}
          photos={listingForm.photos}
          onPickPhotos={listingForm.pickPhotos}
          onRemovePhoto={listingForm.removePhoto}
        />
      </Card>
    </MarketplacePage>
  );
};

export default CreateListingView;
