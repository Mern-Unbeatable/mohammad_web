import LegalDocument from '../components/LegalDocument';
import { TERMS_OF_SERVICE, TERMS_SECTIONS } from '../content/termsOfService';

const TermsOfServiceView = () => <LegalDocument {...TERMS_OF_SERVICE} sections={TERMS_SECTIONS} />;

export default TermsOfServiceView;
