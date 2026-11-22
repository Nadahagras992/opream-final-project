import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './Login.css'
import {
  CapIcon, ShieldCheckIcon, AlertIcon, IdIcon,
  EyeIcon, LockIcon, CheckIcon, ArrowLeftIcon,
} from './Icons.jsx'
import { login } from '../../api.js'

const ROLES = ['college-admin', 'company-admin', 'mentor', 'student']

// Shown when no provisioned email is supplied through the activation link.
const FALLBACK_PROVISIONED_ID = 'std-2024-91048@university.edu'

const text = {
  en: {
    brand: 'Opream Web',
    tagline: 'Faculty Internship & Practicum Network',
    institutional: 'Institutional',
    env: 'Authorized Academic Environment',
    errTitle: 'Link Expired or Invalid',
    errBody:
      'Please contact your college placement coordinator for a fresh activation link if this verification token is older than 24 hours.',
    badge: 'Student Account Activation & Password Setup',
    title: 'Set Your Academic Password',
    subtitle: 'Create your new password to activate your college-provisioned account.',
    idLabel: 'Provisioned ID',
    verified: 'Verified',
    newPass: 'New Password',
    newPlaceholder: 'Enter at least 8 characters',
    confirm: 'Confirm Password',
    confirmPlaceholder: 'Re-enter your password',
    reqTitle: 'Password Requirements',
    reqLength: 'At least 8 characters',
    reqUpper: '1 uppercase letter (A-Z)',
    reqNumber: '1 number (0-9)',
    lockNote: '5 consecutive failed attempts lock account for 15 minutes.',
    submit: 'Activate Account & Sign In',
    signing: 'Signing in...',
    back: 'Return to Login',
    mismatch: 'Passwords do not match.',
    required: 'Enter and confirm your password.',
    reqError: 'Your password does not meet the requirements.',
  },
  ar: {
    brand: 'أوبريم ويب',
    tagline: 'شبكة التدريب الميداني لأعضاء هيئة التدريس',
    institutional: 'مؤسسي',
    env: 'بيئة أكاديمية معتمدة',
    errTitle: 'الرابط منتهي أو غير صالح',
    errBody:
      'يرجى التواصل مع منسق التدريب في كليتك للحصول على رابط تفعيل جديد إذا مر على رمز التحقق أكثر من 24 ساعة.',
    badge: 'تفعيل حساب الطالب وإعداد كلمة المرور',
    title: 'عيّن كلمة المرور الأكاديمية',
    subtitle: 'أنشئ كلمة مرور جديدة لتفعيل حسابك المقدم من الكلية.',
    idLabel: 'المعرّف المخصص',
    verified: 'تم التحقق',
    newPass: 'كلمة المرور الجديدة',
    newPlaceholder: 'أدخل 8 أحرف على الأقل',
    confirm: 'تأكيد كلمة المرور',
    confirmPlaceholder: 'أعد إدخال كلمة المرور',
    reqTitle: 'متطلبات كلمة المرور',
    reqLength: '8 أحرف على الأقل',
    reqUpper: 'حرف كبير واحد (A-Z)',
    reqNumber: 'رقم واحد (0-9)',
    lockNote: '5 محاولات فاشلة متتالية تقفل الحساب لمدة 15 دقيقة.',
    submit: 'تفعيل الحساب وتسجيل الدخول',
    signing: 'جارٍ تسجيل الدخول...',
    back: 'العودة لتسجيل الدخول',
    mismatch: 'كلمتا المرور غير متطابقتين.',
    required: 'أدخل كلمة المرور وأكدها.',
    reqError: 'كلمة المرور لا تحقق المتطلبات.',
  },
}

export default function Login({ onSource }) {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const [lang, setLang] = useState(document.documentElement.lang === 'ar' ? 'ar' : 'en')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [showRequirements, setShowRequirements] = useState(false)

  const t = text[lang]

  const token = params.get('token')
  const linkInvalid = !token || token === 'expired'

  const account =
    params.get('email') || params.get('account') || FALLBACK_PROVISIONED_ID

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
  }
  const requirementsMet = checks.length && checks.upper && checks.number

  const changeLang = (next) => {
    setLang(next)
    document.documentElement.lang = next
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password || !confirm) {
      setError(t.required)
      return
    }
    if (password !== confirm) {
      setError(t.mismatch)
      return
    }
    if (!requirementsMet) {
      setShowRequirements(true)
      setError(t.reqError)
      return
    }

    setShowRequirements(false)
    setError('')
    setLoading(true)
    try {
      const data = await login(account, password)
      const role = data.role || data.user?.role
      onSource({ role: ROLES.includes(role) ? role : 'student' })
    } catch (err) {
      // Demo fallback: if the API server isn't running, continue as a student
      // so the Sign In button still opens the Apply page.
      if (err instanceof TypeError || /failed to fetch|network error/i.test(err.message)) {
        onSource({ role: 'student' })
        return
      }
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="activate-page">
      <header className="activate-header">
        <div className="brand">
          <div className="brand-logo"><CapIcon /></div>
          <div>
            <div className="brand-name">
              {t.brand}
              <span className="chip">{t.institutional}</span>
            </div>
            <div className="brand-tagline">{t.tagline}</div>
          </div>
        </div>

        <div className="header-end">
          <span className="env-label"><ShieldCheckIcon size={24} />{t.env}</span>
          <div className="lang-switch">
            <button
              type="button"
              className={lang === 'en' ? 'active' : ''}
              onClick={() => changeLang('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={lang === 'ar' ? 'active' : ''}
              onClick={() => changeLang('ar')}
            >
              العربية
            </button>
          </div>
        </div>
      </header>

      <main className="activate-main">
        {linkInvalid && (
          <div className="alert" role="alert">
            <strong><AlertIcon size={16} />{t.errTitle}</strong>
            <p>{t.errBody}</p>
          </div>
        )}

        <form className="card" onSubmit={handleSubmit}>
          <span className="card-badge"><ShieldCheckIcon size={13} />{t.badge}</span>
          <h1>{t.title}</h1>
          <p className="card-subtitle">{t.subtitle}</p>

          <div className="id-box">
            <IdIcon size={20} />
            <div className="id-text">
              <small>{t.idLabel}</small>
              <div className="id-value">{account}</div>
            </div>
            <span className="verified">{t.verified}</span>
          </div>

          <label htmlFor="new-password">{t.newPass}</label>
          <div className="field">
            <span className="field-icon"><LockIcon size={18} /></span>
            <input
              id="new-password"
              autoComplete="new-password"
              className="has-icon"
              type={showPassword ? 'text' : 'password'}
              placeholder={t.newPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="eye"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="toggle password visibility"
            >
              <EyeIcon off={showPassword} />
            </button>
          </div>

          <label htmlFor="confirm-password">{t.confirm}</label>
          <div className="field">
            <input
              id="confirm-password"
              autoComplete="new-password"
              type={showConfirm ? 'text' : 'password'}
              placeholder={t.confirmPlaceholder}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <button
              type="button"
              className="eye"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label="toggle password visibility"
            >
              <EyeIcon off={showConfirm} />
            </button>
          </div>

          {showRequirements && (
            <div className="requirements">
              <h3>{t.reqTitle}</h3>
              <ul>
                <li className={checks.length ? 'rule met' : 'rule'}>
                  <span className="rule-dot"><CheckIcon /></span>
                  {t.reqLength}
                </li>
                <li className={checks.upper ? 'rule met' : 'rule'}>
                  <span className="rule-dot"><CheckIcon /></span>
                  {t.reqUpper}
                </li>
                <li className={checks.number ? 'rule met' : 'rule'}>
                  <span className="rule-dot"><CheckIcon /></span>
                  {t.reqNumber}
                </li>
              </ul>
            </div>
          )}

          {error && <p className="form-error">{error}</p>}

          <p className="lock-note"><LockIcon />{t.lockNote}</p>

          <button type="submit" className="submit" disabled={loading}>
            {loading ? t.signing : t.submit}
          </button>

          <button type="button" className="back" onClick={() => navigate('/login')}>
            <ArrowLeftIcon />{t.back}
          </button>
        </form>
      </main>
    </div>
  )
}
