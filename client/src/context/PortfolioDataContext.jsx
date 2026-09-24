import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { portfolioService } from '../services/portfolio.service';

const PortfolioDataContext = createContext(null);

export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState({
    profile: null, skills: [], projects: [], certifications: [],
    experiences: [], education: [], socialLinks: [], languages: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profile, skills, projects, certifications, experiences, education, socialLinks, languages] =
        await Promise.all([
          portfolioService.getProfile(),
          portfolioService.getSkills(),
          portfolioService.getProjects(),
          portfolioService.getCertifications(),
          portfolioService.getExperiences(),
          portfolioService.getEducation(),
          portfolioService.getSocialLinks(),
          portfolioService.getLanguages(),
        ]);
      setData({ profile, skills, projects, certifications, experiences, education, socialLinks, languages });
    } catch (err) {
      setError(err.message || 'Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <PortfolioDataContext.Provider value={{ ...data, loading, error, refetch: load }}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioContext() {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) throw new Error("usePortfolioContext doit être utilisé à l'intérieur de PortfolioDataProvider");
  return ctx;
}