import { motion } from 'framer-motion';

/**
 * Enveloppe n'importe quel contenu avec une apparition animée
 * (fade + léger slide vers le haut) au moment où il entre dans l'écran.
 * Réutilisé dans toutes les sections pour l'effet "qui bouge" au scroll.
 */
export default function Reveal({ children, delay = 0, y = 24, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}