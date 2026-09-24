export default function Button({ children, variant = 'gold', href, onClick, type = 'button', icon: Icon, className = '' }) {
  const base =
    'inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5';
  const variants = {
    gold: 'bg-gold text-[#1A1206] hover:brightness-110',
    ghost: 'border border-white/10 text-white hover:border-gold/50',
  };
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        {Icon && <Icon size={16} />}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
      {Icon && <Icon size={16} />}
    </button>
  );
}