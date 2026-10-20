import CheckingState from '../components/states/CheckingState';
import InvalidLinkState from '../components/states/InvalidLinkState';
import CheckErrorState from '../components/states/CheckErrorState';
import DoneState from '../components/states/DoneState';
import ResetPasswordForm from '../components/form/ResetPasswordForm';
import { useResetPassword } from '../hooks/useResetPassword';
import { RESET_STATUS } from '../constant/constants';

const ResetPasswordView = () => {
  const { status, heading, subheading, hasToken, checkMessage, retryCheck, form } =
    useResetPassword();

  return (
    <section className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-[500px]">
        <div className="mb-8 text-center">
          <h1 className="text-[32px] font-bold tracking-[-0.02em] text-deep-blue sm:text-[36px]">
            {heading}
          </h1>
          <p className="mt-1 text-base text-[#64748B]">{subheading}</p>
        </div>

        <div className="rounded-xl bg-white p-6 sm:p-8">
          {status === RESET_STATUS.CHECKING && <CheckingState />}
          {status === RESET_STATUS.INVALID && (
            <InvalidLinkState hasToken={hasToken} message={checkMessage} />
          )}
          {status === RESET_STATUS.ERROR && (
            <CheckErrorState message={checkMessage} onRetry={retryCheck} />
          )}
          {status === RESET_STATUS.DONE && <DoneState />}
          {status === RESET_STATUS.VALID && <ResetPasswordForm {...form} />}
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordView;
