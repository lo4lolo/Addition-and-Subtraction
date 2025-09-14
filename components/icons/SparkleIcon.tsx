
import React from 'react';

export const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C12.195 3.883 19.14 7.234 16.035 12.63c-3.105 5.397-9.593 4.098-9.593-1.055 0-5.152 2.873-5.022 2.873-3.991zM11.23 2.152C14.818-2.148 22.51 2.51 18.51 8.888c-4 6.378-11.43 4.19-11.43-2.175 0-6.365 4.15-5.32 4.15-4.56z"
      clipRule="evenodd"
    />
  </svg>
);
