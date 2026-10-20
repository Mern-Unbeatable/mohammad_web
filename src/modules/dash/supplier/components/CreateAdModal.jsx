import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock,
  GraduationCap,
  ImageIcon,
  Info,
  Microscope,
  RefreshCw,
  Settings2,
  Tag,
  Video,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';
import RichTextArea from '@/components/forms/RichTextArea/RichTextArea';
import AdDetailCard from '@/modules/dash/supplier/components/AdDetailCard';
import { AD_CATEGORIES, getCategoryById } from '@/modules/dash/supplier/data/advertisements';
import {
  createSupplierAd,
  updateSupplierAd,
  fetchSupplierAdPricing,
  formToCreatePayload,
  adToForm,
  toDurationTiers,
  defaultDurationId,
} from '@/features/supplier/advertisements';
import { panelPrimaryBtn, panelSecondaryBtn } from '@/shared/layout/PanelLayout/panelPageTheme';

const STEPPER_STEPS_INITIAL = [
  { id: 'type', label: 'Type' },
  { id: 'details', label: 'Details' },
  { id: 'media', label: 'Media' },
  { id: 'duration', label: 'Duration' },
];

const STEPPER_STEPS_FULL = [
  { id: 'type', label: 'Type' },
  { id: 'details', label: 'Details' },
  { id: 'media', label: 'Media' },
  { id: 'duration', label: 'Duration' },
  { id: 'preview', label: 'Preview' },
  { id: 'payment', label: 'Payment' },
];

const STEP_ORDER = ['type', 'details', 'media', 'duration', 'preview', 'payment'];

const WEBINAR_DEFAULTS = {
  title: 'Advanced Mass Spectrometry Webinar 2026',
  location: 'Online (Zoom) / Dublin Convention Centre',
  organizer: 'BioLab Corp',
  description:
    'Describe your advertisement in detail. Explain the key benefits and features of your webinar or event.',
};

const CATEGORY_ICONS = {
  product: Microscope,
  service: Settings2,
  promo: Tag,
  webinar: GraduationCap,
};

const fieldClass =
  'w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10 sm:text-[15px]';

const labelClass = 'mb-1.5 block text-[13px] font-semibold text-deep-blue sm:text-[14px]';

const defaultForm = {
  categoryId: 'product',
  title: '',
  description: '',
  price: '',
  contact: '',
  eventDate: '',
  eventTime: '',
  location: '',
  organizer: '',
  durationId: '',
  imageName: '',
  videoName: '',
};

const CreateAdModal = ({ open, onClose, onCreated, editAdId = null, initialAd = null }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { saving, pricing, pricingLoading, pricingError } = useSelector(
    (state) => state.supplierAds
  );
  const dialogRef = useRef(null);
  const [step, setStep] = useState('type');
  const [form, setForm] = useState(() =>
    initialAd ? { ...defaultForm, ...adToForm(initialAd) } : defaultForm
  );
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [estimateFrom] = useState(() => new Date());

  useEffect(() => {
    if (open) dispatch(fetchSupplierAdPricing());
  }, [open, dispatch]);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const category = getCategoryById(form.categoryId);
  const tiers = useMemo(() => toDurationTiers(pricing, estimateFrom), [pricing, estimateFrom]);
  const selectedDurationId = tiers.some((tier) => tier.id === form.durationId)
    ? form.durationId
    : defaultDurationId(pricing);
  const duration = tiers.find((tier) => tier.id === selectedDurationId) || null;
  const pricingUnavailable = pricingError
    ? `${pricingError}. Please retry.`
    : 'Advertisement pricing is still loading. Please wait a moment.';

  const previewAd = useMemo(
    () => ({
      company: 'Meridian Lab Instruments',
      companyInitials: 'ML',
      category: category?.label || 'Product Showcase',
      location: form.location || 'Stuttgart, Germany',
      title: form.title || 'ProSpec Elite Series Spectrophotometer',
      description:
        form.description ||
        'High-precision UV-Vis spectrophotometer for routine QC and research applications.',
      image:
        form.imageUrl ||
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop',
      startDate: duration ? `${duration.startDate} (est.)` : '—',
      expiryDate: duration ? `${duration.endDate} (est.)` : '—',
      price: form.price ? `€${form.price}` : 'Contact for pricing',
      stats: null,
    }),
    [category, duration, form]
  );

  const setField = (key, value) => {
    setError('');
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateStep = () => {
    if (step === 'details') {
      if (!form.title.trim()) {
        setError('Please enter an advertisement title.');
        return false;
      }
      if (form.categoryId === 'webinar') {
        if (!form.eventDate) {
          setError('Please select an event date.');
          return false;
        }
        if (!form.eventTime) {
          setError('Please select an event time.');
          return false;
        }
      }
      if (!form.description.trim()) {
        setError('Please enter a description.');
        return false;
      }
    }
    if (step === 'duration' && !duration) {
      setError(pricingUnavailable);
      return false;
    }
    setError('');
    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    const index = STEP_ORDER.indexOf(step);
    if (index < STEP_ORDER.length - 1) setStep(STEP_ORDER[index + 1]);
  };

  const goBack = () => {
    setError('');
    const index = STEP_ORDER.indexOf(step);
    if (index > 0) setStep(STEP_ORDER[index - 1]);
  };

  const goToStep = (targetStep) => {
    const currentIndex = STEP_ORDER.indexOf(step);
    const targetIndex = STEP_ORDER.indexOf(targetStep);
    if (targetIndex <= currentIndex) {
      setError('');
      setStep(targetStep);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setError('');
    setForm((prev) => {
      if (categoryId === 'webinar') {
        return {
          ...prev,
          categoryId,
          title: prev.title || WEBINAR_DEFAULTS.title,
          location: prev.location || WEBINAR_DEFAULTS.location,
          organizer: prev.organizer || WEBINAR_DEFAULTS.organizer,
          description: prev.description || WEBINAR_DEFAULTS.description,
        };
      }
      return { ...prev, categoryId };
    });
  };

  const stepperSteps = step === 'type' ? STEPPER_STEPS_INITIAL : STEPPER_STEPS_FULL;
  const stepperCurrent = step;

  const handlePay = async () => {
    if (saving) return;
    if (!duration) {
      setError(pricingUnavailable);
      return;
    }
    const payload = formToCreatePayload({ ...form, durationId: duration.id });
    if (!payload.title || !payload.description) {
      setError('Please complete the advertisement details before submitting.');
      return;
    }

    const result = editAdId
      ? await dispatch(updateSupplierAd({ adId: editAdId, payload }))
      : await dispatch(createSupplierAd(payload));

    const matched = editAdId
      ? updateSupplierAd.fulfilled.match(result)
      : createSupplierAd.fulfilled.match(result);

    if (matched) {
      setSuccess(true);
      onCreated?.(result.payload);
      return;
    }

    const message =
      result.payload ||
      (editAdId
        ? 'Failed to resubmit advertisement'
        : 'Failed to create advertisement');
    setError(message);
    toast.error(message);
  };

  const handleFinish = () => {
    onClose();
    navigate('/supplier/ads');
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="flex max-h-[92dvh] w-full max-w-[640px] flex-col rounded-t-2xl bg-white shadow-xl sm:max-h-[90vh] sm:rounded-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-ad-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 px-4 pb-2 pt-4 sm:px-6 sm:pt-5">
          <div className="min-w-0 pr-2">
            <h2 id="create-ad-title" className="text-[18px] font-bold text-deep-blue sm:text-[20px]">
              {editAdId ? 'Resubmit Advertisement' : 'Create Advertisement'}
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-[#64748B] sm:text-[14px]">
              Promote your products and services to laboratory professionals on Lab Unity.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[#64748B] hover:bg-[#E4E7EC]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {success ? (
          <SuccessStep
            ad={previewAd}
            category={category?.label}
            duration={duration}
            onFinish={handleFinish}
          />
        ) : (
          <>
            <Stepper steps={stepperSteps} current={stepperCurrent} onStepClick={goToStep} />

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              {step === 'type' ? (
                <TypeStep categoryId={form.categoryId} onSelect={handleCategorySelect} />
              ) : null}
              {step === 'details' ? (
                <DetailsStep categoryId={form.categoryId} form={form} onChange={setField} />
              ) : null}
              {step === 'media' ? (
                <MediaStep
                  imageName={form.imageName}
                  videoName={form.videoName}
                  onImageSelect={(name) => setField('imageName', name)}
                  onVideoSelect={(name) => setField('videoName', name)}
                />
              ) : null}
              {step === 'duration' ? (
                <DurationStep
                  tiers={tiers}
                  selected={duration}
                  loading={pricingLoading && !pricing}
                  error={pricing ? null : pricingError}
                  onRetry={() => dispatch(fetchSupplierAdPricing())}
                  onSelect={(id) => setField('durationId', id)}
                />
              ) : null}
              {step === 'preview' ? (
                <div className="space-y-3">
                  <p className="text-[14px] font-semibold text-deep-blue sm:text-[15px]">
                    Preview your advertisement
                  </p>
                  <AdDetailCard ad={previewAd} showSocial={false} />
                </div>
              ) : null}
              {step === 'payment' ? <PaymentStep total={duration?.priceLabel || '—'} /> : null}

              {error ? (
                <p className="mt-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[13px] text-[#DC2626]">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 border-t border-[#E4E7EC] px-4 py-4 sm:px-6">
              {step === 'type' ? (
                <button type="button" onClick={goNext} className={`${panelPrimaryBtn} w-full py-3`}>
                  Continue
                </button>
              ) : (
                <div className="flex w-full items-center gap-3">
                  <button type="button" onClick={goBack} className={`${panelSecondaryBtn} shrink-0`}>
                    <ChevronLeft className="mr-1 inline h-4 w-4" />
                    Back
                  </button>

                  {step === 'payment' ? (
                    <button
                      type="button"
                      onClick={handlePay}
                      disabled={saving || !duration}
                      className={`${panelPrimaryBtn} min-w-0 flex-1 disabled:opacity-60`}
                    >
                      {saving ? 'Submitting…' : duration ? `Pay ${duration.priceLabel}` : 'Pay'}
                    </button>
                  ) : (
                    <button type="button" onClick={goNext} className={`${panelPrimaryBtn} min-w-0 flex-1`}>
                      {step === 'details'
                        ? 'Continue to Media'
                        : step === 'media'
                          ? 'Continue to Duration'
                          : step === 'duration'
                            ? 'Continue to Preview'
                            : step === 'preview'
                              ? 'Continue to payment'
                              : 'Continue'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

const Stepper = ({ steps, current, onStepClick }) => {
  const currentIndex = steps.findIndex((s) => s.id === current);

  return (
    <div
      className={`grid shrink-0 border-b border-[#E4E7EC] px-4 sm:px-6`}
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {steps.map((item, index) => {
        const active = item.id === current;
        const passed = index < currentIndex;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => (passed || active ? onStepClick(item.id) : undefined)}
            disabled={!passed && !active}
            className={`border-b-2 py-3 text-center text-[12px] font-semibold transition-colors sm:text-[13px] ${
              active
                ? 'border-primary text-primary'
                : passed
                  ? 'border-green-primary text-green-primary hover:opacity-80'
                  : 'cursor-default border-transparent text-[#98A2B3]'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

const CategoryBadge = ({ categoryId }) => {
  const category = getCategoryById(categoryId);
  const Icon = CATEGORY_ICONS[categoryId] || Tag;

  return (
    <span className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-[13px] font-semibold text-primary sm:text-[14px]">
      <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
      {category?.label}
    </span>
  );
};

const TypeStep = ({ categoryId, onSelect }) => (
  <div className="space-y-4">
    <h3 className="text-[15px] font-bold text-deep-blue sm:text-[16px]">Advertisement Category</h3>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {AD_CATEGORIES.map((item) => {
        const Icon = CATEGORY_ICONS[item.id] || Tag;
        const selected = categoryId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`rounded-xl border p-4 text-left transition-colors ${
              selected
                ? 'border-primary bg-secondary/60'
                : 'border-[#E4E7EC] bg-white hover:border-[#D0D5DD]'
            }`}
          >
            <Icon
              className={`mb-3 h-6 w-6 ${selected ? 'text-primary' : 'text-[#64748B]'}`}
              strokeWidth={1.8}
            />
            <p
              className={`text-[14px] font-bold sm:text-[15px] ${
                selected ? 'text-primary' : 'text-deep-blue'
              }`}
            >
              {item.label}
            </p>
            <p
              className={`mt-1 text-[12px] leading-relaxed sm:text-[13px] ${
                selected ? 'text-primary/80' : 'text-[#64748B]'
              }`}
            >
              {item.description}
            </p>
          </button>
        );
      })}
    </div>
  </div>
);

const DetailsStep = ({ categoryId, form, onChange }) => {
  const isWebinar = categoryId === 'webinar';

  return (
    <div className="space-y-4">
      <CategoryBadge categoryId={categoryId} />

      <div>
        <label htmlFor="ad-title" className={labelClass}>
          Advertisement Title <span className="text-pink-light">*</span>
        </label>
        <input
          id="ad-title"
          type="text"
          value={form.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder={
            isWebinar
              ? 'Advanced Mass Spectrometry Webinar 2026'
              : 'e.g. ProSpec Elite Series Spectrophotometer'
          }
          className={fieldClass}
        />
      </div>

      {isWebinar ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="event-date" className={labelClass}>
                Event Date <span className="text-pink-light">*</span>
              </label>
              <input
                id="event-date"
                type="date"
                value={form.eventDate}
                onChange={(e) => onChange('eventDate', e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="event-time" className={labelClass}>
                Event Time <span className="text-pink-light">*</span>
              </label>
              <input
                id="event-time"
                type="time"
                value={form.eventTime}
                onChange={(e) => onChange('eventTime', e.target.value)}
                className={fieldClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="location" className={labelClass}>
              Location / Online
            </label>
            <input
              id="location"
              type="text"
              value={form.location}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="Online (Zoom) / Dublin Convention Centre"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="price" className={labelClass}>
              Price
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] font-medium text-[#64748B]">
                $
              </span>
              <input
                id="price"
                type="text"
                value={form.price}
                onChange={(e) => onChange('price', e.target.value)}
                placeholder="60"
                className={`${fieldClass} pl-8`}
              />
            </div>
          </div>
          <div>
            <label htmlFor="organizer" className={labelClass}>
              Organizer
            </label>
            <input
              id="organizer"
              type="text"
              value={form.organizer}
              onChange={(e) => onChange('organizer', e.target.value)}
              placeholder="BioLab Corp"
              className={fieldClass}
            />
          </div>
        </>
      ) : null}

      {categoryId === 'service' ? (
        <div>
          <label htmlFor="contact" className={labelClass}>
            Contact Information
          </label>
          <input
            id="contact"
            type="text"
            value={form.contact}
            onChange={(e) => onChange('contact', e.target.value)}
            placeholder="email@company.com / +353 1 234 5678"
            className={fieldClass}
          />
        </div>
      ) : null}

      {(categoryId === 'product' || categoryId === 'promo') && (
        <div>
          <label htmlFor="price" className={labelClass}>
            {categoryId === 'promo' ? 'Offer Price' : 'Price (€)'}
          </label>
          <input
            id="price"
            type="text"
            value={form.price}
            onChange={(e) => onChange('price', e.target.value)}
            placeholder={categoryId === 'product' ? '8200 per unit' : '60'}
            className={fieldClass}
          />
        </div>
      )}

      <div>
        <label htmlFor="description" className={labelClass}>
          Description <span className="text-pink-light">*</span>
        </label>
        <RichTextArea
          id="description"
          value={form.description}
          onChange={(next) => onChange('description', next)}
          rows={5}
          maxLength={5000}
          placeholder={
            isWebinar
              ? 'Describe your advertisement in detail. Explain the key benefits and features of your webinar or event.'
              : 'Describe your product, service, or event...'
          }
        />
      </div>
    </div>
  );
};

const MediaStep = ({ imageName, videoName, onImageSelect, onVideoSelect }) => (
  <div className="space-y-5">
    <div>
      <h3 className="text-[15px] font-bold text-deep-blue sm:text-[16px]">Upload Media</h3>
      <p className="mt-1 text-[13px] text-[#64748B] sm:text-[14px]">
        Add images and an optional video to make your advertisement stand out.
      </p>
    </div>

    <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-10 text-center hover:border-primary hover:bg-secondary/20">
      <ImageIcon className="h-8 w-8 text-[#98A2B3]" />
      <span className="text-[14px] font-semibold text-deep-blue sm:text-[15px]">
        {imageName || 'Drop images here or click to upload'}
      </span>
      <span className="text-[12px] text-[#98A2B3] sm:text-[13px]">
        PNG, JPG, WEBP up to 10MB · Recommended: 1200×628px
      </span>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => onImageSelect(event.target.files?.[0]?.name || '')}
      />
    </label>

    <div>
      <p className={`${labelClass} mb-2`}>Video (Optional)</p>
      <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#E4E7EC] bg-white px-4 py-4 hover:border-primary hover:bg-secondary/10">
        <Video className="h-5 w-5 shrink-0 text-[#98A2B3]" />
        <div className="min-w-0 text-left">
          <p className="text-[14px] font-semibold text-deep-blue sm:text-[15px]">
            {videoName || 'Add a product demo video'}
          </p>
          <p className="text-[12px] text-[#98A2B3] sm:text-[13px]">MP4, MOV up to 100MB</p>
        </div>
        <input
          type="file"
          accept="video/mp4,video/quicktime"
          className="sr-only"
          onChange={(event) => onVideoSelect(event.target.files?.[0]?.name || '')}
        />
      </label>
    </div>
  </div>
);

const DurationStep = ({ tiers, selected, loading, error, onRetry, onSelect }) => {
  const header = (
    <div>
      <h3 className="text-[15px] font-bold text-deep-blue sm:text-[16px] lg:text-[17px]">
        Select Advertisement Duration
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[#64748B] sm:text-[14px] lg:text-[15px]">
        Choose how long your advertisement will run. Payment is required to submit for review.
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-5" aria-busy="true">
        {header}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-[168px] animate-pulse rounded-xl bg-[#F3F4F6]" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !tiers.length) {
    return (
      <div className="space-y-5">
        {header}
        <div className="flex flex-col items-center gap-3 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-6 text-center">
          <p className="text-[13px] text-[#DC2626] sm:text-[14px]">
            {error || 'No advertisement durations are available right now.'}
          </p>
          <button type="button" onClick={onRetry} className={panelSecondaryBtn}>
            <RefreshCw className="mr-1.5 inline h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {header}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tiers.map((tier) => {
          const active = selected?.id === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelect(tier.id)}
              className={`relative rounded-xl border px-3 pb-4 pt-5 text-center transition-colors sm:px-4 sm:pb-5 sm:pt-6 ${
                active
                  ? 'border-2 border-green-primary bg-green-secondary/40'
                  : 'border border-[#E4E7EC] bg-white hover:border-[#D0D5DD]'
              }`}
            >
              {tier.popular ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-green-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white sm:text-[11px]">
                  Most Popular
                </span>
              ) : null}

              <p
                className={`text-[28px] font-bold leading-none sm:text-[32px] lg:text-[36px] ${
                  active ? 'text-green-primary' : 'text-deep-blue'
                }`}
              >
                {tier.days}
              </p>
              <p
                className={`mt-1 text-[13px] font-medium sm:text-[14px] lg:text-[15px] ${
                  active ? 'text-green-primary' : 'text-[#64748B]'
                }`}
              >
                days
              </p>
              <p
                className={`mt-3 text-[20px] font-bold sm:text-[22px] lg:text-[24px] ${
                  active ? 'text-green-primary' : 'text-deep-blue'
                }`}
              >
                {tier.priceLabel}
              </p>
              <p
                className={`mt-3 text-[11px] leading-snug sm:text-[12px] lg:text-[13px] ${
                  active ? 'text-green-primary/80' : 'text-[#98A2B3]'
                }`}
              >
                Est. {tier.startDate} — {tier.endDate}
              </p>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="rounded-xl border border-pink-secondary/60 bg-pink-secondary/25 px-4 py-4 sm:px-5">
          <p className="text-[14px] font-bold text-pink-light sm:text-[15px]">Selected Duration Summary</p>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <DurationSummaryItem label="Duration" value={selected.label} />
            <DurationSummaryItem label="Est. Start Date" value={selected.startDate} />
            <DurationSummaryItem label="Est. End Date" value={selected.endDate} />
            <DurationSummaryItem label="Total Price" value={selected.priceLabel} />
          </div>
          <EstimateNote days={selected.days} />
        </div>
      ) : null}
    </div>
  );
};

const EstimateNote = ({ days, className = 'mt-3 text-pink-light/80' }) => (
  <p className={`flex items-start gap-1.5 text-[12px] leading-relaxed sm:text-[13px] ${className}`}>
    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    Dates are estimates. Your advertisement goes live once an administrator approves it and
    runs for {days} days from approval.
  </p>
);

const DurationSummaryItem = ({ label, value }) => (
  <div>
    <p className="text-[12px] font-medium text-pink-light/80 sm:text-[13px]">{label}</p>
    <p className="mt-0.5 text-[14px] font-bold text-pink-light sm:text-[15px] lg:text-[16px]">{value}</p>
  </div>
);

const PaymentStep = ({ total }) => (
  <div className="space-y-4">
    <p className="text-[14px] text-[#64748B] sm:text-[15px]">
      Complete payment to submit your advertisement for administrator review.
    </p>
    <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-4">
      <p className="text-[13px] text-[#64748B]">Total due</p>
      <p className="text-[24px] font-bold text-deep-blue">{total}</p>
    </div>
    <div>
      <label htmlFor="card-number" className={labelClass}>
        Card Number
      </label>
      <input id="card-number" type="text" placeholder="4242 4242 4242 4242" className={fieldClass} />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label htmlFor="expiry" className={labelClass}>
          Expiry
        </label>
        <input id="expiry" type="text" placeholder="MM/YY" className={fieldClass} />
      </div>
      <div>
        <label htmlFor="cvc" className={labelClass}>
          CVC
        </label>
        <input id="cvc" type="text" placeholder="123" className={fieldClass} />
      </div>
    </div>
  </div>
);

const SuccessStep = ({ ad, category, duration, onFinish }) => (
  <>
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-secondary text-green-primary">
          <CheckCircle2 className="h-9 w-9" strokeWidth={2} />
        </div>
        <h3 className="mt-4 text-[20px] font-bold text-deep-blue sm:text-[22px]">Payment Successful</h3>
        <p className="mt-2 text-[14px] text-[#64748B] sm:text-[15px]">
          Your advertisement has been submitted for administrator review.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-[#E4E7EC] bg-[#F9FAFB]">
        <div className="flex items-start justify-between gap-3 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-deep-blue sm:text-[16px]">{ad.title}</p>
            <p className="mt-0.5 text-[13px] text-[#64748B] sm:text-[14px]">{category}</p>
          </div>
          <StatusBadge status="Pending" label="Pending Review" />
        </div>
        <div className="grid grid-cols-3 gap-3 border-t border-[#E4E7EC] px-4 py-4 sm:px-5">
          <SuccessDetailItem label="Duration" value={duration?.label} />
          <SuccessDetailItem label="Est. Start" value={duration?.startDate} />
          <SuccessDetailItem label="Est. End" value={duration?.endDate} />
        </div>
        {duration ? (
          <div className="border-t border-[#E4E7EC] px-4 py-3 sm:px-5">
            <EstimateNote days={duration.days} className="text-[#64748B]" />
          </div>
        ) : null}
      </div>

      <div className="mt-5 space-y-2">
        <StatusRow icon={Check} label="Payment confirmed" done />
        <StatusRow icon={Clock} label="Pending administrator review" active />
        <StatusRow label="Advertisement approved & goes live" />
      </div>

      <p className="mt-5 text-center text-[12px] leading-relaxed text-[#64748B] sm:text-[13px]">
        You will receive a notification when your advertisement is reviewed. Typically within 1–2
        business days.
      </p>
    </div>

    <div className="shrink-0 border-t border-[#E4E7EC] px-4 py-4 sm:px-6">
      <button type="button" onClick={onFinish} className={`${panelPrimaryBtn} w-full py-3`}>
        Go to My Advertisements
      </button>
    </div>
  </>
);

const SuccessDetailItem = ({ label, value }) => (
  <div>
    <p className="text-[11px] font-medium uppercase tracking-wide text-[#98A2B3] sm:text-[12px]">
      {label}
    </p>
    <p className="mt-1 text-[14px] font-bold text-deep-blue sm:text-[15px]">{value}</p>
  </div>
);

const StatusRow = ({ icon: Icon, label, done = false, active = false }) => (
  <div
    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${
      done ? 'bg-green-secondary/40' : active ? 'bg-secondary/40' : 'bg-[#F9FAFB]'
    }`}
  >
    <div
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
        done ? 'bg-green-primary text-white' : active ? 'bg-primary text-white' : 'border border-[#E4E7EC] bg-white'
      }`}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
    </div>
    <span className="text-[13px] font-medium text-deep-blue sm:text-[14px]">{label}</span>
  </div>
);

export default CreateAdModal;
