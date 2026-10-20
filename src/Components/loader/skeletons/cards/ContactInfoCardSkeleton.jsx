import Card from '@/components/ui/Card';
import Skeleton from '@/components/loader/Skeleton';

/** Matches ContactInfoCard (+ optional professional block) */
const ContactInfoCardSkeleton = ({ showProfessional = false }) => (
  <Card className="h-full">
    <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
      <Skeleton className="h-4 w-40" />
    </div>
    <div className="p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="rounded-lg border border-[#E4E7EC] bg-white p-4"
          >
            <Skeleton className="mb-3 h-9 w-9" rounded="lg" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>
        ))}
      </div>
      {showProfessional ? (
        <div className="mt-5 border-t border-[#E4E7EC] pt-5">
          <Skeleton className="mb-3 h-4 w-44" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
          </div>
        </div>
      ) : null}
    </div>
  </Card>
);

export default ContactInfoCardSkeleton;
