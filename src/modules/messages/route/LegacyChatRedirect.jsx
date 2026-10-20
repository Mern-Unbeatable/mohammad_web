import { Navigate, useLocation } from 'react-router';

/** Old inbox URLs (`/messages?conversation=…`) → the chat base, keeping the query. */
const LegacyChatRedirect = ({ to }) => {
  const { search } = useLocation();
  return <Navigate to={`${to}${search}`} replace />;
};

export default LegacyChatRedirect;
