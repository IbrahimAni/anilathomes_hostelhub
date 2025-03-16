import React from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiBookmark,
} from "react-icons/fi";
import { IoSchoolOutline } from "react-icons/io5";
import { ProfileFormProps } from "@/types/profile";
import { useForm } from "react-hook-form";

const ProfileForm: React.FC<ProfileFormProps> = ({
  profileForm,
  handleInputChange,
  handleProfileUpdate,
  saving,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: profileForm,
    mode: "onBlur",
  });

  const onSubmit = (data: any) => {
    handleProfileUpdate(data);
  };

  // Common input styling
  const inputClasses = (error?: any) =>
    `pl-10 w-full rounded-lg py-2.5 border ${
      error
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"
    } focus:ring-1 transition-all duration-200 shadow-sm`;

  const selectClasses = (error?: any) =>
    `w-full rounded-lg py-2.5 pl-3 pr-10 border ${
      error
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"
    } focus:ring-1 transition-all duration-200 shadow-sm appearance-none bg-white`;

  const labelClasses = "block text-sm font-medium text-gray-800 mb-1.5";
  const iconClasses = (error?: any) =>
    error ? "text-red-500" : "text-gray-500";
  const errorClasses = "mt-1.5 text-sm text-red-500 font-medium";

  return (
    <div className="p-6 md:w-2/3 bg-white rounded-xl shadow-sm">
      <h3 className="text-xl font-bold mb-5 text-gray-800">
        Personal Information
      </h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-7"
        data-testid="profile-update-form"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
          <div>
            <label htmlFor="displayName" className={labelClasses}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className={iconClasses(errors.displayName)} />
              </div>
              <input
                type="text"
                id="displayName"
                {...register("displayName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                data-testid="input-displayName"
                className={inputClasses(errors.displayName)}
                placeholder="Enter your full name"
                onChange={handleInputChange}
                value={profileForm.displayName}
              />
            </div>
            {errors.displayName && (
              <p className={errorClasses} data-testid="error-displayName">
                {errors.displayName.message as string}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className={labelClasses}>
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                {...register("email")}
                readOnly
                data-testid="input-email"
                className="pl-10 w-full rounded-lg py-2.5 border border-gray-300 bg-gray-50 cursor-not-allowed shadow-sm"
                placeholder="Your email address"
                value={profileForm.email}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5 italic">
              Email address cannot be changed
            </p>
          </div>

          <div>
            <label htmlFor="phoneNumber" className={labelClasses}>
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className={iconClasses(errors.phoneNumber)} />
              </div>
              <input
                type="tel"
                id="phoneNumber"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9+\-\s]+$/,
                    message: "Please enter a valid phone number",
                  },
                })}
                data-testid="input-phoneNumber"
                className={inputClasses(errors.phoneNumber)}
                placeholder="Enter your phone number"
                onChange={handleInputChange}
                value={profileForm.phoneNumber}
              />
            </div>
            {errors.phoneNumber && (
              <p className={errorClasses} data-testid="error-phoneNumber">
                {errors.phoneNumber.message as string}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="university" className={labelClasses}>
              University <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoSchoolOutline className={iconClasses(errors.university)} />
              </div>
              <select
                id="university"
                {...register("university", {
                  required: "Please select your university",
                })}
                data-testid="select-university"
                className={`pl-12 ${selectClasses(errors.university)}`}
                onChange={handleInputChange}
                value={profileForm.university}
              >
                <option value="">Select your university</option>
                <option value="unilag">University of Lagos</option>
                <option value="kwasu">Kwara State University</option>
                <option value="lasu">Lagos State University</option>
                <option value="ui">University of Ibadan</option>
                <option value="oau">Obafemi Awolowo University</option>
                <option value="uniabuja">University of Abuja</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {errors.university && (
              <p className={errorClasses} data-testid="error-university">
                {errors.university.message as string}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="department" className={labelClasses}>
              Department <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiBookOpen className={iconClasses(errors.department)} />
              </div>
              <input
                type="text"
                id="department"
                {...register("department", {
                  required: "Department is required",
                })}
                data-testid="input-department"
                className={inputClasses(errors.department)}
                placeholder="Enter your department"
                onChange={handleInputChange}
                value={profileForm.department}
              />
            </div>
            {errors.department && (
              <p className={errorClasses} data-testid="error-department">
                {errors.department.message as string}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="level" className={labelClasses}>
              Level <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiBookmark className={iconClasses(errors.level)} />
              </div>
              <select
                id="level"
                {...register("level", { required: "Please select your level" })}
                data-testid="select-level"
                className={`pl-12 ${selectClasses(errors.level)}`}
                onChange={handleInputChange}
                value={profileForm.level}
              >
                <option value="">Select your level</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
                <option value="postgrad">Postgraduate</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {errors.level && (
              <p className={errorClasses} data-testid="error-level">
                {errors.level.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            data-testid="btn-save-profile"
            className={`px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm ${
              saving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {saving ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
