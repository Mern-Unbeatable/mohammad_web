import LegalDocument from '../components/LegalDocument';
import { PRIVACY_POLICY, PRIVACY_SECTIONS } from '../content/privacyPolicy';

const PrivacyPolicyView = () => <LegalDocument {...PRIVACY_POLICY} sections={PRIVACY_SECTIONS} />;

export default PrivacyPolicyView;
