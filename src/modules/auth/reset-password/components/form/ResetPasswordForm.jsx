import { Loader2 } from 'lucide-react';
import { PasswordField, PasswordStrength } from '@/modules/auth/components/AuthFormFields';
import Notice from '../common/Notice';
import BackToSignIn from '@/modules/auth/components/BackToSignIn';
import { PRIMARY_BUTTON_CLASS } from '../../constant/constants';

/** New + confirm password, strength meter, submit and link expiry. */
const ResetPasswordForm = ({
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  formError,
  loading,
  expiry,
  onPasswordChange,
  onConfirmPasswordChange,
  togglePassword,
  toggleConfirmPassword,
  onSubmit,
}) => (
  <form className="space-y-5" onSubmit={onSubmit} noValidate>
    {formError && (
      <Notice>
        <p role="alert">{formError}</p>
      </Notice>
    )}

    <PasswordField
      id="password"
      label="New Password"
      value={password}
      onChange={onPasswordChange}
      visible={showPassword}
      onToggle={togglePassword}
      autoComplete="new-password"
      disabled={loading}
    />
    <PasswordField
      id="confirmPassword"
      label="Confirm New Password"
      value={confirmPassword}
      onChange={onConfirmPasswordChange}
      visible={showConfirmPassword}
      onToggle={toggleConfirmPassword}
      autoComplete="new-password"
      disabled={loading}
    />

    <PasswordStrength password={password} />

    <button type="submit" disabled={loading} className={PRIMARY_BUTTON_CLASS}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Resetting password...
        </>
      ) : (
        'Reset password'
      )}
    </button>

    {expiry && (
      <p className="text-center text-[13px] text-[#98A2B3]">
        This link is valid until {expiry}.
      </p>
    )}

    <BackToSignIn />
  </form>
);

export default ResetPasswordForm;
