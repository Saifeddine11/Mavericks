import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useCinematic } from '../context/CinematicContext';

const SECTIONS = [
  { key: 'architecture', index: 1, labelKey: 'cinematic.indicator.architecture' },
  { key: 'concept', index: 2, labelKey: 'cinematic.concept.eyebrow' },
];

export default function SectionIndicator({ visible }) {
  const { t } = useTranslation();
  const { activeSection } = useCinematic();

  return (
    <div
      className={clsx(
        'pointer-events-none fixed inset-0 z-40 hidden xl:block transition-opacity duration-500',
        visible ? 'opacity-100' : 'opacity-0',
      )}
      aria-hidden={!visible}
    >
      <div className="absolute bottom-8 left-8">
        <p className="font-label text-[11px] uppercase tracking-[0.18em] text-stone-brand/72 [writing-mode:vertical-lr] rotate-180">
          <span className="mb-2 inline-block text-champagne">
            0
            <span className="relative inline-block h-[1em] w-[1ch]">
              {SECTIONS.map(({ index }) => (
                <span
                  key={index}
                  className={clsx(
                    'absolute top-0 transition-all duration-500 ease-editorial',
                    activeSection === index - 1
                      ? 'translate-x-0 text-champagne opacity-100'
                      : '-translate-x-full opacity-0',
                  )}
                >
                  {index}
                </span>
              ))}
            </span>
          </span>
          <span className="relative inline-block text-stone-brand/85">
            <span className="invisible opacity-0">{t('cinematic.indicator.architecture')}</span>
            {SECTIONS.map(({ key, index, labelKey }) => (
              <span
                key={key}
                className={clsx(
                  'absolute top-0 transition-all duration-500 ease-editorial',
                  activeSection === index - 1
                    ? 'translate-x-0 text-champagne opacity-100'
                    : '-translate-x-full text-stone-brand/55 opacity-0',
                )}
              >
                {t(labelKey)}
              </span>
            ))}
          </span>
        </p>
      </div>
    </div>
  );
}
