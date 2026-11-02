import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Loader2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/shared/hooks/useAuth";
import { getSafeRedirectPath } from "@/shared/router/utils/safeRedirect";
import { PRIVACY_PATH, TERMS_PATH } from "@/modules/public/legal";
import { CONTACT_PATH } from "@/modules/public/contact";
import {
  PasswordField,
  PasswordStrength,
} from "@/modules/auth/components/AuthFormFields";
import SelectField from "../components/SelectField";
import { COUNTRIES, PROFILE_OPTIONS } from "../constant/constants";
import {
  Checkbox,
  FormLabel,
  Input,
  Textarea,
} from "@/components/form-controls";
import { DEFAULT_TRIAL_DAYS } from "@/components/navigation/constant/constants";

const FormSection = ({ title, children }) => (
  <section className="space-y-5 border-t border-[#EAECF0] pt-6 first:border-t-0 first:pt-0">
    <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#98A2B3]">
      {title}
    </h2>
    {children}
  </section>
);

const RegisterView = () => {
  const navigate = useNavigate();
  const { register, loading, homePath } = useAuth();

  const [profileType, setProfileType] = useState("laboratory");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Germany");
  const [city, setCity] = useState("");
  const [professionalInfo, setProfessionalInfo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileType) {
      toast.error("Please select what best describes you.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      toast.error("You must accept the Terms of Service and Privacy Policy.");
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      profileType,
      jobTitle,
      company,
      country,
      city,
      phone,
      professionalInfo,
      acceptedTerms,
    };

    const result = await register(payload);

    if (!result.ok) {
      toast.error(result.error || "Registration failed");
      return;
    }

    toast.success("Account created successfully!");
    navigate(getSafeRedirectPath(result.redirectTo, homePath || "/feed"), {
      replace: true,
    });
  };

  return (
    <section className="px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto w-full max-w-[680px]">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-primary">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
            {DEFAULT_TRIAL_DAYS}-day free trial
          </span>
          <h1 className="mt-4 text-[32px] font-bold tracking-[-0.02em] text-deep-blue sm:text-[36px]">
            Join Lab Unity
          </h1>
          <p className="mx-auto mt-2 max-w-[540px] text-[15px] leading-[1.6] text-[#64748B]">
            Get full access for {DEFAULT_TRIAL_DAYS} days, free. No payment
            details required to register.
          </p>
        </div>

        <div className="rounded-2xl border border-[#EAECF0] bg-white p-6 shadow-[0_1px_3px_rgba(16,24,40,0.06)] sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormSection title="About you">
              <SelectField
                id="profileType"
                label="What best describes you?"
                value={profileType}
                onChange={(e) => setProfileType(e.target.value)}
                disabled={loading}
              >
                {PROFILE_OPTIONS.map(({ value, label }) => (
                  <option
                    key={value || "default"}
                    value={value}
                    disabled={!value}
                  >
                    {label}
                  </option>
                ))}
              </SelectField>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <FormLabel variant="auth" htmlFor="firstName">
                    First Name
                  </FormLabel>
                  <Input
                    variant="auth"
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <FormLabel variant="auth" htmlFor="lastName">
                    Last Name
                  </FormLabel>
                  <Input
                    variant="auth"
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <FormLabel variant="auth" htmlFor="jobTitle">
                    Job Title / Position
                  </FormLabel>
                  <Input
                    variant="auth"
                    id="jobTitle"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Lab Manager"
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <FormLabel variant="auth" htmlFor="company">
                    Company or Laboratory Name
                  </FormLabel>
                  <Input
                    variant="auth"
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Labs"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div>
                <FormLabel variant="auth" htmlFor="professionalInfo">
                  Professional Information
                </FormLabel>
                <Textarea
                  variant="auth"
                  id="professionalInfo"
                  rows={4}
                  value={professionalInfo}
                  onChange={(e) => setProfessionalInfo(e.target.value)}
                  placeholder="Write professional information about yourself..."
                  className="resize-none"
                  disabled={loading}
                />
              </div>
            </FormSection>

            <FormSection title="Contact details">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <FormLabel variant="auth" htmlFor="email">
                    Email Address
                  </FormLabel>
                  <Input
                    variant="auth"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@laboratory.com"
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <FormLabel variant="auth" htmlFor="phone">
                    Phone Number
                  </FormLabel>
                  <Input
                    variant="auth"
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+49123456789"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <SelectField
                  id="country"
                  label="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={loading}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </SelectField>
                <div>
                  <FormLabel variant="auth" htmlFor="city">
                    City
                  </FormLabel>
                  <Input
                    variant="auth"
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    maxLength={80}
                    placeholder="e.g. Brussels"
                    autoComplete="address-level2"
                    disabled={loading}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title="Secure your account">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <PasswordField
                  id="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  visible={showPassword}
                  onToggle={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                />
                <PasswordField
                  id="confirmPassword"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  visible={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword((prev) => !prev)}
                  disabled={loading}
                />
              </div>

              <PasswordStrength password={password} />
            </FormSection>

            <div className="space-y-5 border-t border-[#EAECF0] pt-6">
              <label className="flex cursor-pointer items-start gap-2.5">
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  disabled={loading}
                  className="mt-0.5"
                />
                <span className="text-[14px] leading-[1.6] text-[#475467]">
                  I accept the Lab Unity{" "}
                  <Link
                    to={TERMS_PATH}
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to={PRIVACY_PATH}
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  , and agree to be listed in the professional contacts
                  directory.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-md bg-primary py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  `Start ${DEFAULT_TRIAL_DAYS}-day free trial`
                )}
              </button>

              <p className="flex items-center justify-center gap-2 text-[13px] text-[#64748B]">
                <ShieldCheck
                  className="h-4 w-4 text-[#98A2B3]"
                  strokeWidth={2}
                />
                No payment details required during the trial
              </p>
            </div>
          </form>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-[14px] text-[#64748B]">
          <Mail className="h-4 w-4 text-[#98A2B3]" strokeWidth={2.2} aria-hidden="true" />
          Questions before joining?
          <Link to={CONTACT_PATH} className="font-medium text-primary hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterView;
