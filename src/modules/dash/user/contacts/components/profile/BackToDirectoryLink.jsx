import BackLink from '@/components/layout/BackLink';
import { CONTACTS_PATH } from '../../constant/constants';

const BackToDirectoryLink = () => (
  <BackLink to={CONTACTS_PATH} className="mb-4">
    Back to directory
  </BackLink>
);

export default BackToDirectoryLink;
