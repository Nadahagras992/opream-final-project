
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const CapIcon = ({ size = 27 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="M7 10.5V15c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.5" />
  </svg>
)

export const ShieldCheckIcon = ({ size = 16 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export const AlertIcon = ({ size = 16 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M12 3 2 20h20L12 3Z" />
    <path d="M12 10v4M12 17.5v.01" />
  </svg>
)

export const IdIcon = ({ size = 16 }) => (
  <svg {...base} width={size} height={size}>
    <rect x="3" y="6" width="18" height="14" rx="2" />
    <path d="M9 6V4h6v2M7 12h3M7 15.5h3M14 12h3M14 15.5h3" />
  </svg>
)

export const MailIcon = ({ size = 16 }) => (
  <svg {...base} width={size} height={size}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
  </svg>
)

export const EyeIcon = ({ size = 16, off = false }) => (
  <svg {...base} width={size} height={size}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M4 4l16 16" />}
  </svg>
)

export const LockIcon = ({ size = 14 }) => (
  <svg {...base} width={size} height={size}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)

export const ArrowLeftIcon = ({ size = 14 }) => (
  <svg {...base} width={size} height={size}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)

export const CheckIcon = ({ size = 14 }) => (
  <svg {...base} width={size} height={size} strokeWidth={2.6}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
)
