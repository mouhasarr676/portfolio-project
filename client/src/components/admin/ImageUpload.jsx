import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { uploadImage } from '../../services/uploadService';

/**
 * Champ d'upload avec aperçu. value = URL actuelle, onChange(url) renvoie la nouvelle URL.
 */
export default function ImageUpload({ label, value, onChange, folder = 'misc' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Merci de choisir une image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image trop lourde (5 Mo max)');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      setError("Échec de l'upload, réessaie");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      {label && <label className="mb-1.5 block text-xs text-slate-500">{label}</label>}

      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-600">
              <ImagePlus size={20} />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Loader2 size={18} className="animate-spin text-gold" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:border-gold/50 disabled:opacity-60"
          >
            {value ? 'Changer la photo' : 'Choisir une photo'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-red-400"
            >
              <X size={12} /> Retirer
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}