import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { CONTACTS_PATH } from '../../constant/constants';

const BackToDirectoryLink = () => (
  <Link
    to={CONTACTS_PATH}
    className="mb-4 inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
  >
    <ChevronLeft className="h-4 w-4" />
    Back to directory
  </Link>
);

export default BackToDirectoryLink;
