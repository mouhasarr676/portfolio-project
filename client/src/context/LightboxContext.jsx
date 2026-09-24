import { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

const LightboxContext = createContext(null);

/**
 * Fournit une fonction openLightbox(src, alt) utilisable depuis n'importe
 * quel composant pour afficher une image en plein écran (clic pour fermer).
 */
export function LightboxProvider({ children }) {
  const [image, setImage] = useState(null);

  const openLightbox = useCallback((src, alt = '') => setImage({ src, alt }), []);
  const closeLightbox = useCallback(() => setImage(null), []);

  return (
    <LightboxContext.Provider value={{ openLightbox }}>
      {children}

      {image && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            style={{ top: 'calc(env(safe-area-inset-top, 0px) + 16px)', right: '16px' }}
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
          <img
            src={image.src}
            alt={image.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox doit être utilisé à l'intérieur de LightboxProvider");
  return ctx;
}