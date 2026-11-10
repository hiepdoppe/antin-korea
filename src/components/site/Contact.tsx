import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ASSETS } from '@/constants/assets'
import { telHref } from '@/lib/utils'
import { useContent } from '@/hooks/useContent'
import { useLeadsStore } from '@/store/leadsStore'
import type { UiContent } from '@/data/initialContent'
import { toast } from '@/store/toastStore'
import { useUniversitiesStore } from '@/store/universitiesStore'
import { Button } from '../ui/Button'
import { Field, inputClass } from '../ui/Field'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

interface FormState {
  name: string
  phone: string
  birthYear: string
  gpa: string
  targetSchool: string
  program: string
  note: string
  website: string // honeypot – người thật không thấy
}

const empty: FormState = {
  name: '',
  phone: '',
  birthYear: '',
  gpa: '',
  targetSchool: '',
  program: '',
  note: '',
  website: '',
}

type Errors = Partial<Record<keyof FormState, string>>

function validate(f: FormState, t: UiContent['contact']): Errors {
  const e: Errors = {}
  if (f.name.trim().length < 2) e.name = t.errName
  const phone = f.phone.replace(/[\s.\-]/g, '')
  if (!phone) e.phone = t.errPhone
  else if (!/^(0|\+?84)\d{9}$/.test(phone)) e.phone = t.errPhoneFormat
  if (f.birthYear) {
    const y = Number(f.birthYear)
    if (!/^\d{4}$/.test(f.birthYear) || y < 1960 || y > new Date().getFullYear()) e.birthYear = t.errBirth
  }
  if (f.gpa) {
    const g = Number(f.gpa.replace(',', '.'))
    if (Number.isNaN(g) || g < 0 || g > 10) e.gpa = t.errGpa
  }
  return e
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wider text-gold-700">{label}</dt>
      <dd className="text-sm leading-relaxed text-navy-800">{children}</dd>
    </div>
  )
}

export function Contact({ h1 }: { h1?: boolean }) {
  const { sections, brand, contact, programs, ui } = useContent()
  const t = ui.contact
  const [params] = useSearchParams()
  const universities = useUniversitiesStore((s) => s.items)
  const addLead = useLeadsStore((s) => s.add)

  const programOptions = programs.items.map((p) => ({ id: p.id, label: p.title }))
  // /lien-he?program=d4-1 → chọn sẵn chương trình (từ nút "Đăng ký tư vấn chương trình này")
  const preset = params.get('program') ?? ''
  const [form, setForm] = useState<FormState>({ ...empty, program: programOptions.some((p) => p.id === preset) ? preset : '' })
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')

  const schools = useMemo(() => [...universities].map((u) => u.nameEn).sort((a, b) => a.localeCompare(b)), [universities])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (state === 'sending' || form.website) return
    const errs = validate(form, t)
    setErrors(errs)
    const first = (Object.keys(errs) as (keyof FormState)[]).find((k) => errs[k])
    if (first) {
      toast.error(t.errCheck, errs[first])
      document.getElementById(`f-${first}`)?.focus()
      return
    }
    setState('sending')
    window.setTimeout(() => {
      addLead({
        name: form.name.trim(),
        phone: form.phone.trim(),
        birthYear: form.birthYear.trim(),
        gpa: form.gpa.trim(),
        targetSchool: form.targetSchool,
        program: form.program,
        note: form.note.trim(),
      })
      toast.success(t.okTitle, t.okText)
      setForm({ ...empty })
      setState('done')
      window.setTimeout(() => setState('idle'), 1800)
    }, 500)
  }

  return (
    <Section id="contact" h1={h1} eyebrow={t.eyebrow} title={sections.contact} tone="ivory">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
        <Reveal>
          <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
            <img src={ASSETS.logo.mark} alt="" className="mb-4 h-14 w-14 object-contain" />
            <h3 className="font-display text-xl leading-snug text-navy-900">{brand.nameVi}</h3>
            <p className="mt-1 text-xs font-semibold tracking-wide text-navy-500">{brand.nameEn}</p>
            <p className="mt-3 font-display text-lg text-gold-700">“{brand.slogan}”</p>

            <dl className="mt-6 space-y-4 border-t border-navy-100 pt-6">
              <InfoRow label={ui.common.hqVn}>{contact.address}</InfoRow>
              <InfoRow label={ui.common.hqKr}>{contact.koreaBranch}</InfoRow>
              <InfoRow label={ui.common.hotline}>
                <a href={telHref(contact.hotline)} className="text-base font-bold text-navy-900 transition-colors hover:text-gold-700">
                  {contact.hotline}
                </a>
              </InfoRow>
              <InfoRow label={ui.common.email}>
                <a href={`mailto:${contact.email}`} className="font-semibold text-navy-900 transition-colors hover:text-gold-700">
                  {contact.email}
                </a>
              </InfoRow>
              <InfoRow label={ui.common.taxCode}>{brand.taxCode}</InfoRow>
              <InfoRow label={ui.common.legalRep}>
                {brand.legalRep} - {brand.legalRepTitle}
              </InfoRow>
            </dl>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <figure className="overflow-hidden rounded-2xl border border-navy-100">
                <img src={ASSETS.offices.vietnam} alt={t.officeVnAlt} loading="lazy" className="aspect-[3/4] w-full object-cover" />
                <figcaption className="bg-navy-50 px-3 py-2 text-center text-[11px] font-semibold text-navy-700">{ui.common.hqVn}</figcaption>
              </figure>
              <figure className="overflow-hidden rounded-2xl border border-navy-100">
                <img src={ASSETS.offices.korea} alt={t.officeKrAlt} loading="lazy" className="aspect-[3/4] w-full object-cover" />
                <figcaption className="bg-navy-50 px-3 py-2 text-center text-[11px] font-semibold text-navy-700">{ui.common.hqKr}</figcaption>
              </figure>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <form
            onSubmit={submit}
            noValidate
            className="rounded-3xl border border-gold-200 bg-gradient-to-b from-white to-gold-50 p-6 shadow-lift sm:p-8"
          >
            <h3 className="font-display text-2xl text-navy-900">{t.formTitle}</h3>
            <p className="mt-1.5 text-sm text-navy-600">{t.formIntro}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label={t.name} htmlFor="f-name" error={errors.name} required className="sm:col-span-2">
                <input
                  id="f-name"
                  className={inputClass(errors.name)}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  autoComplete="name"
                  placeholder={t.namePh}
                />
              </Field>
              <Field label={t.phone} htmlFor="f-phone" error={errors.phone} required>
                <input
                  id="f-phone"
                  className={inputClass(errors.phone)}
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0988 574 395"
                />
              </Field>
              <Field label={t.birthYear} htmlFor="f-birthYear" error={errors.birthYear}>
                <input
                  id="f-birthYear"
                  className={inputClass(errors.birthYear)}
                  value={form.birthYear}
                  onChange={(e) => set('birthYear', e.target.value)}
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="2006"
                />
              </Field>
              <Field label={t.gpa} htmlFor="f-gpa" error={errors.gpa} hint={t.gpaHint}>
                <input
                  id="f-gpa"
                  className={inputClass(errors.gpa)}
                  value={form.gpa}
                  onChange={(e) => set('gpa', e.target.value)}
                  inputMode="decimal"
                  placeholder="7.5"
                />
              </Field>
              <Field label={t.school} htmlFor="f-targetSchool">
                <select
                  id="f-targetSchool"
                  className={inputClass()}
                  value={form.targetSchool}
                  onChange={(e) => set('targetSchool', e.target.value)}
                >
                  <option value="">{t.noSchool}</option>
                  {schools.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t.program} htmlFor="f-program" className="sm:col-span-2">
                <select id="f-program" className={inputClass()} value={form.program} onChange={(e) => set('program', e.target.value)}>
                  <option value="">{t.noProgram}</option>
                  {programOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t.note} htmlFor="f-note" className="sm:col-span-2">
                <textarea
                  id="f-note"
                  rows={3}
                  className={inputClass()}
                  value={form.note}
                  onChange={(e) => set('note', e.target.value)}
                  placeholder={t.notePh}
                />
              </Field>
              {/* honeypot */}
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} />
                </label>
              </div>
            </div>

            <Button type="submit" size="lg" disabled={state === 'sending'} className="mt-6 w-full">
              {state === 'sending' ? t.sending : state === 'done' ? t.sent : t.send}
            </Button>
          </form>
        </Reveal>
      </div>
    </Section>
  )
}
