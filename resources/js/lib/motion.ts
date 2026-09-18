import { useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

export const easeOutSoft = [0.22, 1, 0.36, 1] as const;

export const viewportOnce = { once: true, amount: 0.18, margin: '0px 0px -6% 0px' };

export function useMotionPrefs() {
    const reduce = useReducedMotion();
    const [compact, setCompact] = useState(false);

    useEffect(() => {
        const media = window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)');
        const sync = () => setCompact(media.matches);
        sync();
        media.addEventListener('change', sync);
        return () => media.removeEventListener('change', sync);
    }, []);

    const skip = Boolean(reduce) || compact;

    return {
        reduce: skip,
        fadeUp: skip
            ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
            : {
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: easeOutSoft } },
              },
        stagger: skip
            ? { hidden: {}, show: {} }
            : {
                  hidden: {},
                  show: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
              },
    };
}
