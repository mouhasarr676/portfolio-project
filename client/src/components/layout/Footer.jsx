import { usePortfolioData } from '../../hooks/usePortfolioData';
import { portfolioService } from '../../services/portfolio.service';

export default function Footer() {
  const { data: profile } = usePortfolioData(portfolioService.getProfile);

  return (
    <footer
      className="border-t border-white/10 py-7 text-center text-xs text-slate-600"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      © {new Date().getFullYear()} {profile?.full_name || 'Portfolio'}
    </footer>
  );
}