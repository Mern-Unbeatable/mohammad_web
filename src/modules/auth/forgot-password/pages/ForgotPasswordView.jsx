import ForgotPasswordForm from '../components/ForgotPasswordForm';
import LinkSentState from '../components/LinkSentState';
import { useForgotPassword } from '../hooks/useForgotPassword';

const ForgotPasswordView = () => {
  const { heading, subheading, sentTo, form, sent } = useForgotPassword();

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
          {sentTo ? <LinkSentState {...sent} /> : <ForgotPasswordForm {...form} />}
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordView;
