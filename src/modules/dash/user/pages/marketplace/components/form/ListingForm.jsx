import { conditions, years } from '@/modules/dash/user/data/marketplace';
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from '../../constant/constants';
import { LISTING_CATEGORY_OPTIONS, listingSubmitLabel } from '../../utils/listingForm';
import { fieldClass, labelClass } from './formStyles';
import PhotoPicker from './PhotoPicker';
import SelectField from './SelectField';

const ListingForm = ({
  form,
  update,
  onSubmit,
  busy,
  saving,
  uploading,
  isEdit,
  seller,
  photos,
  onPickPhotos,
  onRemovePhoto,
}) => (
  <form onSubmit={onSubmit} className="space-y-4 p-5 sm:p-6">
    <div>
      <label htmlFor="title" className={labelClass}>
        Product name
      </label>
      <input
        id="title"
        type="text"
        value={form.title}
        onChange={update('title')}
        placeholder="e.g. Agilent 1260 Infinity II HPLC System"
        className={fieldClass}
        maxLength={TITLE_MAX_LENGTH}
        required
        disabled={busy}
      />
    </div>

    <div>
      <label htmlFor="description" className={labelClass}>
        Description
      </label>
      <textarea
        id="description"
        value={form.description}
        onChange={update('description')}
        rows={4}
        placeholder="Describe condition, accessories, validation status and delivery options..."
        className={`${fieldClass} resize-y`}
        maxLength={DESCRIPTION_MAX_LENGTH}
        required
        disabled={busy}
      />
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <SelectField
        id="category"
        label="Category"
        value={form.category}
        onChange={update('category')}
        options={LISTING_CATEGORY_OPTIONS}
        disabled={busy}
      />
      <SelectField
        id="condition"
        label="Condition"
        value={form.condition}
        onChange={update('condition')}
        options={conditions}
        disabled={busy}
      />
      <SelectField
        id="year"
        label="Year"
        value={form.year}
        onChange={update('year')}
        options={years}
        disabled={busy}
        extraOption={
          !years.includes(String(form.year)) && form.year ? (
            <option value={form.year}>{form.year}</option>
          ) : null
        }
      />
      <div>
        <label htmlFor="price" className={labelClass}>
          Price (€)
        </label>
        <input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={update('price')}
          placeholder="1850"
          className={fieldClass}
          required
          disabled={busy}
        />
      </div>
    </div>

    <PhotoPicker photos={photos} onPick={onPickPhotos} onRemove={onRemovePhoto} disabled={busy} />

    <div className="rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3 text-[13px] text-[#64748B]">
      <span className="font-semibold text-deep-blue">Seller information:</span>{' '}
      {seller.name} · {seller.company} · {seller.location || '—'}
    </div>

    <div className="flex justify-end pt-2">
      <button
        type="submit"
        disabled={busy}
        className="rounded-md bg-primary px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#066BB0] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {listingSubmitLabel({ uploading, saving, isEdit })}
      </button>
    </div>
  </form>
);

export default ListingForm;
