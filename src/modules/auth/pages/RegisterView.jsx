import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { IoIosArrowDown } from "react-icons/io";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/shared/auth/useAuth";
import { getSafeRedirectPath } from "@/shared/routing/safeRedirect";
import { PRIVACY_PATH, TERMS_PATH } from "@/shared/constants/legal";
import {
  inputClass,
  labelClass,
  PasswordField,
  PasswordStrength,
} from "@/modules/auth/components/AuthFormFields";

const selectClass = `${inputClass} appearance-none pr-10`;

const SelectField = ({ id, label, value, onChange, children, disabled }) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={selectClass}
      >
        {children}
      </select>
      <IoIosArrowDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#64748B]"
      />
    </div>
  </div>
);

const profileOptions = [
  { value: "", label: "Select One" },
  {
    value: "laboratory",
    label: "Laboratory — For laboratories and laboratory professionals",
  },
  {
    value: "hospital",
    label: "Hospital — For hospitals and healthcare organizations",
  },
  {
    value: "clinic",
    label: "Clinic — For clinics and healthcare professionals",
  },
  {
    value: "supplier",
    label:
      "Supplier — For laboratory equipment, products, and services suppliers",
  },
  {
    value: "professional",
    label:
      "Professional — For individual professionals in the laboratory industry",
  },
  { value: "other", label: "Other — If none of the above describes you" },
];

const countries = [
  "Belgium",
  "France",
  "Germany",
  "Netherlands",
  "United Kingdom",
  "United States",
];

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
    <section className="px-4 sm:px-6 py-10 lg:py-12">
      <div className="mx-auto w-full max-w-[760px]">
        <div className="mb-8 text-center">
          <h1 className="text-[32px] font-bold tracking-[-0.02em] text-deep-blue sm:text-[36px]">
            Join Lab Unity
          </h1>
          <p className="mt-2 text-[15px] text-[#64748B]">
            Free during the initial trial period. No payment required to
            register.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <SelectField
              id="profileType"
              label="What best describes you?"
              value={profileType}
              onChange={(e) => setProfileType(e.target.value)}
              disabled={loading}
            >
              {profileOptions.map(({ value, label }) => (
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
                <label htmlFor="firstName" className={labelClass}>
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                  placeholder="Jane"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className={labelClass}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                  placeholder="Doe"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="jobTitle" className={labelClass}>
                Job Title / Position
              </label>
              <input
                id="jobTitle"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className={inputClass}
                placeholder="Lab Manager"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="company" className={labelClass}>
                Company or Laboratory Name
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputClass}
                placeholder="Acme Labs"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@laboratory.com"
                className={inputClass}
                disabled={loading}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49123456789"
                  className={inputClass}
                  disabled={loading}
                  required
                />
              </div>
              <SelectField
                id="country"
                label="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={loading}
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </SelectField>
            </div>

            <div>
              <label htmlFor="professionalInfo" className={labelClass}>
                Professional Information
              </label>
              <textarea
                id="professionalInfo"
                rows={4}
                value={professionalInfo}
                onChange={(e) => setProfessionalInfo(e.target.value)}
                placeholder="Write professional information about yourself..."
                className={`${inputClass} resize-none`}
                disabled={loading}
              />
            </div>

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

            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                disabled={loading}
                className="mt-0.5 h-4 w-4 rounded border-[#D0D5DD] text-primary focus:ring-primary/20"
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
                , and agree to be listed in the professional contacts directory.
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
                "Create free account"
              )}
            </button>

            <div className="flex items-center justify-center gap-2 pt-1 text-[13px] text-[#64748B]">
              <ShieldCheck className="h-4 w-4 text-[#98A2B3]" strokeWidth={2} />
              No payment details required during the trial
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegisterView;
