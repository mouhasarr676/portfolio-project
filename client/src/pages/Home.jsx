import { PortfolioDataProvider, usePortfolioContext } from '../context/PortfolioDataContext';
import { LightboxProvider } from '../context/LightboxContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Stats from '../components/sections/Stats';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Certifications from '../components/sections/Certifications';
import Timeline from '../components/sections/Timeline';
import Contact from '../components/sections/Contact';

function HomeContent() {
  const { loading } = usePortfolioContext();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-slate-200">
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Skills />
      <Projects />
      <Certifications />
      <Timeline />
      <Contact />
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <PortfolioDataProvider>
      <LightboxProvider>
        <HomeContent />
      </LightboxProvider>
    </PortfolioDataProvider>
  );
}