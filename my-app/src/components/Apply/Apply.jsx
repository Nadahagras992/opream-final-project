import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Apply.css'
import { apiUpload } from '../../api.js'

const MAX_CV = 5 * 1024 * 1024
const MAX_MOTIVATION = 1000

const opportunity = {
  title: 'Frontend Development Internship',
  company: 'ITI',
  term: 'Summer 2025',
  location: 'Cairo · Smart Village / Hybrid',
  period: 'Jul 1 – Sep 30, 2025 · Sun–Thu, 4 h/day',
  deadline: 'May 31, 2025',
  daysLeft: 12,
}

const student = {
  name: 'Alaa Magdy',
  id: 'STD-2024-91048',
  gpa: '3.62 / 4.0',
  college: 'Faculty of Computer & Information Sciences',
  department: 'Computer Science · Level 4',
}

const tracks = ['Web Development Track', 'Mobile Development Track', 'Data Science Track', 'Cyber Security Track']

const navItems = ['Opportunities', 'My Applications', 'My Exams', 'Interviews', 'Offers', 'My Training', 'Certificate', 'Notifications', 'Profile']

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const BriefcaseIcon = () => (
  <svg {...iconProps}>
    <rect x="2.5" y="7" width="19" height="13" rx="2.5" />
    <path d="M9 7V5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V7" />
  </svg>
)

const FileIcon = () => (
  <svg {...iconProps}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6M9 17h4" />
  </svg>
)

const ClipboardIcon = () => (
  <svg {...iconProps}>
    <rect x="5" y="5" width="14" height="16" rx="2" />
    <path d="M9 5V3h6v2" />
    <path d="M9 10h6M9 14h6M9 18h4" />
  </svg>
)

const BellIcon = () => (
  <svg {...iconProps}>
    <path d="M18 8.5a6 6 0 0 0-12 0c0 6.5-2.5 7.5-2.5 7.5h17S18 15 18 8.5Z" />
    <path d="M10.3 20a2 2 0 0 0 3.4 0" />
  </svg>
)

const UserIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
  </svg>
)

const HelpIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.6 9.2a2.5 2.5 0 1 1 3.9 2.1c-.9.6-1.5 1.2-1.5 2.2" />
    <path d="M12 17.6v.01" />
  </svg>
)

const navIcons = {
  Opportunities: BriefcaseIcon,
  'My Applications': FileIcon,
  'My Exams': ClipboardIcon,
  Interviews: FileIcon,
  Offers: FileIcon,
  'My Training': FileIcon,
  Certificate: FileIcon,
  Notifications: BellIcon,
  Profile: UserIcon,
}

const text = {
  en: {
    brand: 'Opream Portal', sub: 'Academic Placement', crumbs: 'Opportunities', apply: 'Apply',
    back: 'Back to Opportunity Details', partner: 'Verified Partner', term: 'Term',
    applying: 'Applying for', at: 'at', deadline: 'Deadline', remaining: 'days remaining',
    record: 'Student Academic Record', synced: 'SIS Synced',
    recordNote: 'This information is retrieved directly from your university registrar profile and will accompany your credential file.',
    name: 'Student Name', acId: 'Academic ID', gpa: 'Current GPA', college: 'College', dept: 'Department / Level',
    submissions: 'Candidate Submissions', cv: 'CV (PDF)', upload: 'Upload your CV',
    cvHint: 'PDF only · max 5 MB · required for your first application, reused automatically after that',
    track: 'Academic Track Preference', trackHint: 'Select the specialization track aligned with your department graduation requirement.',
    motivation: 'Motivation (optional)', chars: 'characters',
    placeholder: "Summarize your interest in ITI's frontend engineering program, highlight relevant projects, and clarify your technical goals...",
    screened: 'Your application is screened by ITI. Your college can follow its status.',
    certify: 'I certify my academic eligibility and agree to take the required entrance exam if shortlisted.',
    cancel: 'Cancel / Return', submit: 'Submit Application', submitting: 'Submitting...',
    help: 'Help & Support', student: 'Student',
    errCvType: 'CV must be a PDF file.', errCvSize: 'CV must be 5 MB or smaller.',
    errCv: 'Please upload your CV.', errCertify: 'Please certify your eligibility.',
    done: 'Application submitted successfully.',
  },
  ar: {
    brand: 'بوابة أوبريم', sub: 'التنسيق الأكاديمي', crumbs: 'الفرص', apply: 'تقديم',
    back: 'العودة إلى تفاصيل الفرصة', partner: 'شريك موثّق', term: 'الفصل',
    applying: 'التقديم على', at: 'في', deadline: 'آخر موعد', remaining: 'يوم متبقٍ',
    record: 'السجل الأكاديمي للطالب', synced: 'تمت المزامنة مع النظام',
    recordNote: 'يتم استرجاع هذه المعلومات مباشرة من ملفك لدى مسجل الجامعة وسترافق ملف أوراقك.',
    name: 'اسم الطالب', acId: 'الرقم الأكاديمي', gpa: 'المعدل التراكمي', college: 'الكلية', dept: 'القسم / المستوى',
    submissions: 'مستندات المتقدم', cv: 'السيرة الذاتية (PDF)', upload: 'ارفع سيرتك الذاتية',
    cvHint: 'PDF فقط · حتى 5 ميجابايت · مطلوبة عند أول تقديم ويُعاد استخدامها تلقائياً بعد ذلك',
    track: 'المسار الأكاديمي المفضل', trackHint: 'اختر مسار التخصص المتوافق مع متطلبات تخرج قسمك.',
    motivation: 'الدافع (اختياري)', chars: 'حرف',
    placeholder: 'لخّص اهتمامك ببرنامج هندسة الواجهات في ITI، وأبرز مشاريعك ذات الصلة، ووضّح أهدافك التقنية...',
    screened: 'سيتم فرز طلبك بواسطة ITI. يمكن لكليتك متابعة حالته.',
    certify: 'أقرّ بأهليتي الأكاديمية وأوافق على أداء اختبار القبول المطلوب في حال الترشيح.',
    cancel: 'إلغاء / رجوع', submit: 'تقديم الطلب', submitting: 'جارٍ التقديم...',
    help: 'المساعدة والدعم', student: 'طالب',
    errCvType: 'يجب أن تكون السيرة الذاتية بصيغة PDF.', errCvSize: 'يجب ألا يتجاوز حجم الملف 5 ميجابايت.',
    errCv: 'يرجى رفع سيرتك الذاتية.', errCertify: 'يرجى الإقرار بأهليتك.',
    done: 'تم تقديم الطلب بنجاح.',
  },
}

export default function Apply() {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [lang, setLang] = useState(document.documentElement.lang === 'ar' ? 'ar' : 'en')
  const [cv, setCv] = useState(null)
  const [track, setTrack] = useState(tracks[0])
  const [motivation, setMotivation] = useState('')
  const [certified, setCertified] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const t = text[lang]

  const changeLang = (next) => {
    setLang(next)
    document.documentElement.lang = next
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
  }

  const pickFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') return setError(t.errCvType)
    if (file.size > MAX_CV) return setError(t.errCvSize)
    setError('')
    setCv(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!cv) return setError(t.errCv)
    if (!certified) return setError(t.errCertify)

    const body = new FormData()
    body.append('cv', cv)
    body.append('track', track)
    body.append('motivation', motivation)

    setError('')
    setLoading(true)
    try {
      await apiUpload('/api/applications', body)
      setSuccess(t.done)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="apply-layout">
      <aside className="apply-sidebar">
        <div className="apply-brand">
          <div className="apply-brand-logo">🎓</div>
          <div>
            <div className="apply-brand-name">{t.brand}</div>
            <small>{t.sub}</small>
          </div>
        </div>
        <nav>
          {navItems.map((item, i) => {
            const Icon = navIcons[item]
            return (
              <a
                key={item}
                className={i === 0 ? 'active' : ''}
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                <Icon />
                <span>{item}</span>
              </a>
            )
          })}
        </nav>
        <a className="apply-help" href="#" onClick={(e) => e.preventDefault()}>
          <HelpIcon />
          {t.help}
        </a>
      </aside>

      <div className="apply-body">
        <header className="apply-topbar">
          <div className="apply-crumbs">
            <span>{t.crumbs}</span> › <strong>{opportunity.title}</strong> › <strong className="current">{t.apply}</strong>
          </div>
          <div className="apply-topbar-end">
            <div className="apply-lang">
              <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => changeLang('en')}>EN</button>
              <button type="button" className={lang === 'ar' ? 'active' : ''} onClick={() => changeLang('ar')}>العربية</button>
            </div>
            <span className="apply-avatar">AM</span>
            <strong>{t.student}</strong>
          </div>
        </header>

        <main className="apply-main">
          <button type="button" className="apply-back" onClick={() => navigate(-1)}>← {t.back}</button>

          <section className="apply-card apply-summary">
            <div className="apply-summary-icon">&gt;_</div>
            <div className="apply-summary-info">
              <div className="apply-summary-top">
                <span className="apply-pill">{t.partner}</span>
                <span>{t.term}: {opportunity.term}</span>
              </div>
              <h2>{t.applying} {opportunity.title} {t.at} {opportunity.company}</h2>
              <div className="apply-meta"><span>📍 {opportunity.location}</span><span>🕒 {opportunity.period}</span></div>
            </div>
            <div className="apply-deadline">
              <small>{t.deadline}</small>
              <strong>{opportunity.deadline}</strong>
              <span>{opportunity.daysLeft} {t.remaining}</span>
            </div>
          </section>

          <section className="apply-card">
            <div className="apply-card-head">
              <h2>🎓 {t.record}</h2>
              <span className="apply-pill">{t.synced}</span>
            </div>
            <p className="apply-note">{t.recordNote}</p>
            <div className="apply-grid">
              <div><label>{t.name}</label><div className="apply-readonly">{student.name}</div></div>
              <div><label>{t.acId}</label><div className="apply-readonly">{student.id}</div></div>
              <div><label>{t.gpa}</label><div className="apply-readonly">{student.gpa}</div></div>
              <div className="span-2"><label>{t.college}</label><div className="apply-readonly">{student.college}</div></div>
              <div><label>{t.dept}</label><div className="apply-readonly">{student.department}</div></div>
            </div>
          </section>

          <form className="apply-card" onSubmit={handleSubmit}>
            <div className="apply-card-head"><h2>📝 {t.submissions}</h2></div>

            <label className="apply-label">{t.cv} *</label>
            <input ref={fileRef} type="file" accept="application/pdf" hidden onChange={pickFile} />
            <button type="button" className="apply-upload" onClick={() => fileRef.current.click()}>
              <span>⇧</span>
              <span>
                <strong>{cv ? cv.name : t.upload}</strong>
                <small>{t.cvHint}</small>
              </span>
            </button>

            <label className="apply-label" htmlFor="track">{t.track} <span className="req">*</span></label>
            <select id="track" value={track} onChange={(e) => setTrack(e.target.value)}>
              {tracks.map((x) => <option key={x}>{x}</option>)}
            </select>
            <p className="apply-note">{t.trackHint}</p>

            <div className="apply-row">
              <label className="apply-label" htmlFor="motivation">{t.motivation}</label>
              <span>{motivation.length} / {MAX_MOTIVATION} {t.chars}</span>
            </div>
            <textarea
              id="motivation"
              rows={6}
              maxLength={MAX_MOTIVATION}
              placeholder={t.placeholder}
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
            />

            <p className="apply-note">ⓘ {t.screened}</p>
            <label className="apply-check">
              <input type="checkbox" checked={certified} onChange={(e) => setCertified(e.target.checked)} />
              {t.certify}
            </label>

            {error && <p className="apply-error" role="alert">{error}</p>}
            {success && <p className="apply-success" role="status">{success}</p>}

            <div className="apply-actions">
              <button type="button" className="apply-cancel" onClick={() => navigate(-1)}>{t.cancel}</button>
              <button type="submit" className="apply-submit" disabled={loading}>
                {loading ? t.submitting : <>{t.submit} →</>}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
