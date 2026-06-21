/**
 * Shot 07 — EnquireCard
 *
 * The invitation card. Not a contact-form section — a film card. No
 * boxed inputs; each field is a hairline-underlined line, label below.
 * The form is non-functional in Phase 3 (submitting is a no-op) — wiring
 * is for Phase 5 once the back-end is settled.
 *
 * Layout is two-column on desktop (intro left, form right), stacked on
 * mobile. The submit button uses LuxuryButton ghost variant.
 */

import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import LuxuryButton from '@/components/ui/LuxuryButton';
import { easings, durations } from '@/styles/tokens';

function HairlineField({ id, label, type = 'text', as = 'input', delay = 0 }) {
  const reduce = useReducedMotion();
  const Tag = as === 'textarea' ? 'textarea' : 'input';

  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: reduce ? 0 : durations.reveal,
          delay: reduce ? 0 : delay,
          ease: easings.editorial,
        },
      }}
      viewport={{ once: true, amount: 0.3 }}
      className="group"
    >
      <label
        htmlFor={id}
        className="block text-[11px] uppercase tracking-[0.28em] text-stone"
      >
        {label}
      </label>
      <Tag
        id={id}
        type={type}
        rows={as === 'textarea' ? 4 : undefined}
        className="
          mt-3 block w-full
          border-0 border-b border-navy/20 bg-transparent
          px-0 py-3 text-base text-navy
          outline-none ring-0
          transition-colors duration-400 ease-editorial
          focus:border-gold
          placeholder:text-stone/50
        "
      />
    </motion.div>
  );
}

export default function EnquireCard() {
  const { t } = useTranslation();

  return (
    <section
      data-shot
      id="enquire"
      className="relative bg-limestone py-section-lg"
    >
      <span id="private-access" className="sr-only" tabIndex={-1} />
      <div className="container-editorial">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24">
          {/* Left column — intro */}
          <div className="lg:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.32em] text-stone">
              {t('enquiry.eyebrow')}
            </p>
            <h2
              className="mt-8 font-serif text-display-md leading-tight text-navy"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}
            >
              {t('enquiry.invitation')}
            </h2>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-ink-soft">
              {t('enquiry.intro')}
            </p>
            <p className="mt-12 max-w-xs text-[11px] uppercase tracking-widest text-stone">
              {t('enquiry.consent')}
            </p>
          </div>

          {/* Right column — form */}
          <form
            className="lg:col-span-7 grid grid-cols-1 gap-8 md:grid-cols-2"
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            <HairlineField id="f-name"     label={t('enquiry.fields.name')}     delay={0.0} />
            <HairlineField id="f-email"    label={t('enquiry.fields.email')}    type="email" delay={0.08} />
            <HairlineField id="f-whatsapp" label={t('enquiry.fields.whatsapp')} type="tel"   delay={0.16} />
            <HairlineField id="f-country"  label={t('enquiry.fields.country')}  delay={0.24} />
            <HairlineField id="f-budget"   label={t('enquiry.fields.budget')}   delay={0.32} />
            <HairlineField id="f-type"     label={t('enquiry.fields.propertyType')} delay={0.4} />
            <div className="md:col-span-2">
              <HairlineField id="f-message" label={t('enquiry.fields.message')} as="textarea" delay={0.5} />
            </div>

            <div className="md:col-span-2 mt-4">
              <LuxuryButton as="button" type="submit" variant="filled" size="lg" accent>
                {t('enquiry.submit')}
              </LuxuryButton>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
