import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '@/hooks/useLang'
import { fmt } from '@/lib/i18n'
import { EASE_OUT } from '@/lib/motion'
import { useContent } from '@/hooks/useContent'
import { selectVisible, useGalleryStore, type GalleryGroup } from '@/store/galleryStore'
import { Button } from '../ui/Button'
import { Lightbox } from '../ui/Lightbox'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { Tabs } from '../ui/Tabs'
import { AR } from '@/constants/dims'

const PREVIEW_COUNT = 8

export function Facilities({ h1 }: { h1?: boolean }) {
  const { sections, facilities, ui } = useContent()
  const lang = useLang()
  const gallery = useGalleryStore((s) => s.items)
  const [group, setGroup] = useState<GalleryGroup>('dorm')
  const [showAll, setShowAll] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const text: Record<GalleryGroup, { title: string; body: string }> = {
    dorm: { title: facilities.dormTitle, body: facilities.dormText },
    study: { title: facilities.studyTitle, body: facilities.studyText },
    social: { title: facilities.socialTitle, body: facilities.socialText },
  }

  const photos = useMemo(() => selectVisible(gallery, group), [gallery, group])
  const shown = showAll ? photos : photos.slice(0, PREVIEW_COUNT)
  const current = text[group]
  const cap = (p: { caption: string; captionKo?: string }) => (lang === 'ko' && p.captionKo?.trim() ? p.captionKo : p.caption)

  const change = (g: GalleryGroup) => {
    setGroup(g)
    setShowAll(false)
    setLightbox(null)
  }

  return (
    <Section id="facilities" h1={h1} eyebrow={ui.facilities.eyebrow} title={sections.facilities} tone="ivory">
      <Reveal className="flex justify-center">
        <Tabs
          ariaLabel={ui.facilities.tabsLabel}
          layoutId="facility-pill"
          tone="gold"
          value={group}
          onChange={change}
          items={[
            { id: 'dorm', label: facilities.dormTitle },
            { id: 'study', label: facilities.studyTitle },
            { id: 'social', label: facilities.socialTitle },
          ]}
        />
      </Reveal>

      <Reveal delay={0.05} className="mt-8">
        <div className="relative">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={group}
              role="tabpanel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
            >
              <div className="mx-auto max-w-3xl text-center">
                <h3 className="font-display text-2xl text-navy-900 sm:text-3xl">{current.title}</h3>
                <p className="mt-3 text-pretty leading-[1.75] text-navy-700">{current.body}</p>
                {group === 'social' && (
                  <p className="mt-4 inline-flex items-center rounded-full border border-gold-300 bg-gold-100 px-4 py-1.5 text-sm font-bold text-gold-800">
                    #{facilities.hashtag.replace(/\s+/g, '')}
                  </p>
                )}
              </div>

              {shown.length === 0 ? (
                <p className="mt-10 text-center text-sm text-navy-500">{ui.facilities.empty}</p>
              ) : (
                <ul className="mt-9 columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
                  {shown.map((p, i) => (
                    <li key={p.id} className="mb-3 break-inside-avoid sm:mb-4">
                      <button
                        type="button"
                        onClick={() => setLightbox(i)}
                        aria-label={`${ui.common.viewPhoto}: ${cap(p)}`}
                        className="group relative block w-full overflow-hidden rounded-2xl bg-navy-100 shadow-card transition-transform duration-200 ease-out active:scale-[0.98]"
                        style={{ aspectRatio: String(p.ar ?? AR[p.src] ?? 4 / 3) }}
                      >
                        <img
                          src={p.src}
                          alt={cap(p)}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/80 to-transparent px-3 pb-2.5 pt-8 text-left text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-sm:opacity-100">
                          {cap(p)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {photos.length > PREVIEW_COUNT && (
                <div className="mt-6 flex justify-center">
                  <Button variant="outline" onClick={() => setShowAll((v) => !v)}>
                    {showAll ? ui.facilities.collapse : fmt(ui.facilities.showAll, { n: photos.length })}
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>

      <Lightbox
        images={shown.map((p) => ({ src: p.src, caption: cap(p) }))}
        labels={{ close: ui.common.close, prev: ui.common.prevPhoto, next: ui.common.nextPhoto, view: ui.common.viewPhoto }}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndex={setLightbox}
      />
    </Section>
  )
}
