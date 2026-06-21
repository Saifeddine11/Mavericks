/**
 * PageTransition
 *
 * Wraps route content with a Framer AnimatePresence fade.
 *
 * Used in App.jsx around <Routes>. The `key` prop is essential: AnimatePresence
 * needs a unique key on its direct child to detect mount/unmount and run the
 * exit animation.
 *
 * The transition itself lives in `lib/motion.js` so it stays consistent with
 * the rest of the motion language.
 */

import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      // Force the transitioning subtree above siblings during the fade.
      style={{ position: 'relative' }}
    >
      {children}
    </motion.div>
  );
}
