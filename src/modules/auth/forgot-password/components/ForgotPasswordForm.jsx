import { Loader2 } from 'lucide-react';
import { FormLabel, Input } from '@/components/form-controls';
import BackToSignIn from '@/modules/auth/components/BackToSignIn';

/** Email field and "Send reset link". */
const ForgotPasswordForm = ({ email, loading, onEmailChange, onSubmit }) => (
  <form className="space-y-5" onSubmit={onSubmit}>
    <div>
      <FormLabel variant="auth" htmlFor="email">
        Email Address
      </FormLabel>
      <Input
        variant="auth"
        id="email"
        type="email"
        value={email}
        onChange={onEmailChange}
        placeholder="Enter Your email"
        autoComplete="email"
        disabled={loading}
        autoFocus
        required
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center rounded-md bg-primary py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending link...
        </>
      ) : (
        'Send reset link'
      )}
    </button>

    <BackToSignIn />
  </form>
);

export default ForgotPasswordForm;
