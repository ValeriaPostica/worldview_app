import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

// Import local JSON data & styles
import worldviewData from './data/worldviewData.json';
import './styles/App.css';

// Import modular components
import Header from './components/Header';
import Footer from './components/Footer';
import Modal from './components/Modal';
import OracleStep1 from './components/OracleStep1';
import OracleStep2 from './components/OracleStep2';
import OracleStep3 from './components/OracleStep3';
import OracleStep4 from './components/OracleStep4';
import Dashboard from './components/Dashboard';
import Library from './components/Library';
import GeminiChat from './components/GeminiChat';
import { getLocalRecommendations, getPersonalizedRecommendations, isGeminiConfigured } from './services/gemini';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function App() {
  const [tab, setTab] = useState('oracle');
  const [step, setStep] = useState(1);
  const [media, setMedia] = useState({ books: '', movies: '', quote: '' });
  const [choices, setChoices] = useState({});
  const [result, setResult] = useState(null);
  const [savedProfiles, setSavedProfiles] = useState(() => {
    try {
      const s = localStorage.getItem('aletheia_local_profiles');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const [savedItems, setSavedItems] = useState(() => {
    try {
      const s = localStorage.getItem('aletheia_local_bookmarks');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const [activeModal, setActiveModal] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState([]);

  useEffect(() => {
    if (step === 4 && result) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [step, result]);

  const handleChoice = (qId, option) => {
    setChoices((prev) => ({ ...prev, [qId]: option }));
  };

  const continueToQuestions = async () => {
    setStep(2);
    if (!media.books && !media.movies && !media.quote) return;
    const localRecommendations = getLocalRecommendations(media);
    setAiRecommendations(localRecommendations);
    if (!isGeminiConfigured) return;
    try {
      const personalizedRecommendations = await getPersonalizedRecommendations(media);
      if (personalizedRecommendations.length > 0) {
        setAiRecommendations(personalizedRecommendations);
      }
    } catch (error) {
      console.warn('Gemini recommendations unavailable; keeping local recommendations.', error);
    }
  };

  const calculateWorldview = () => {
    setStep(3);

    setTimeout(() => {
      const scores = {};
      Object.values(choices).flat().forEach((tag) => {
        const worldviewId = tag === 'nihilism' ? 'existentialism' : tag;
        scores[worldviewId] = (scores[worldviewId] || 0) + 1;
      });
      const totalScore = Object.values(scores).reduce((total, score) => total + score, 0);
      const rawMatches = Object.entries(worldviewData.worldviewProfiles)
        .map(([id, profile], index) => ({
          id,
          index,
          title: profile.title,
          summary: profile.summary,
          personalDescription: profile.personalDescription,
          religion: profile.religion,
          population: profile.population,
          exactPercentage: totalScore ? ((scores[id] || 0) / totalScore) * 100 : 0,
        }))
        .sort((a, b) => b.exactPercentage - a.exactPercentage || a.index - b.index);
      const roundedTotal = rawMatches.reduce((total, match) => total + Math.floor(match.exactPercentage), 0);
      const worldviewMatches = rawMatches.map((match, index) => ({
        ...match,
        percentage: Math.floor(match.exactPercentage) + (index < 100 - roundedTotal ? 1 : 0),
      }));
      const selectedWorldview = worldviewMatches[0].id;
      const profile = worldviewData.worldviewProfiles[selectedWorldview];
      const recommendationSource = ['existentialism', 'nihilism', 'postmodernism'].includes(selectedWorldview)
        ? worldviewData.archetypes.existential_absurdist
        : worldviewData.archetypes.stoic_rationalist;
      const computedResult = {
        ...profile,
        worldviewId: selectedWorldview,
        worldviewMatches,
        archetype_title: profile.title,
        philosophical_thesis: profile.personalDescription,
        radar_scores: profile.scores,
        matching_philosophers: recommendationSource.matching_philosophers,
        recommended_media: recommendationSource.recommended_media
          .filter((item) => ['Book', 'Movie', 'Article'].includes(item.type))
          .slice(0, 3),
      };

      setResult(computedResult);
      setStep(4);

      const newProfile = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        data: computedResult,
        media,
      };
      const updated = [newProfile, ...savedProfiles];
      setSavedProfiles(updated);
      localStorage.setItem('aletheia_local_profiles', JSON.stringify(updated));

      confetti({ particleCount: 75, spread: 70, origin: { y: 0.55 }, colors: ['#d4af37', '#e6c875', '#c5a059'] });
    }, 400);
  };

  const toggleBookmark = (item) => {
    const exists = savedItems.find((i) => i.title === item.title);
    let u = exists ? savedItems.filter((i) => i.title !== item.title) : [...savedItems, item];
    setSavedItems(u);
    localStorage.setItem('aletheia_local_bookmarks', JSON.stringify(u));
  };

  const deleteProfile = (id) => {
    const u = savedProfiles.filter((p) => p.id !== id);
    setSavedProfiles(u);
    localStorage.setItem('aletheia_local_profiles', JSON.stringify(u));
  };

  const exportManuscript = () => {
    const element = document.getElementById('sacred-dossier');
    if (!element) return;
    html2canvas(element, { backgroundColor: '#14100c', scale: 2 }).then((canvas) => {
      const link = document.createElement('a');
      link.download = `Aletheia-Result-${result?.archetype_title?.replace(/\s+/g, '-') || 'Snapshot'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-3 md:p-6 relative bg-[#14100c] text-[#f2e8d5]">
      <div className="golden-border-frame"></div>

      <Header tab={tab} setTab={setTab} />

      <main className="w-full mx-auto my-4 flex-grow relative z-10">
        <div className="app-intro">
          <h1>Understand your <em>patterns.</em></h1>
          <p>Seven simple questions. One philosophical mirror. Find the worldview that best matches your answers.</p>
        </div>
        <div className="parchment-container w-full lg:w-[96%] lg:mx-auto rounded p-5 md:p-10 relative min-h-[600px] text-[#f2e8d5] flex flex-col justify-between">
          
          {tab === 'oracle' && (
            <>
              {step === 1 && <OracleStep1 media={media} setMedia={setMedia} setStep={continueToQuestions} />}
              {step === 2 && (
                <OracleStep2
                  questions={worldviewData.questions}
                  choices={choices}
                  handleChoice={handleChoice}
                  setStep={setStep}
                  calculateWorldview={calculateWorldview}
                />
              )}
              {step === 3 && <OracleStep3 />}
              {step === 4 && result && (
                <OracleStep4
                  result={result}
                  exportManuscript={exportManuscript}
                  toggleBookmark={toggleBookmark}
                  setActiveModal={setActiveModal}
                  setStep={setStep}
                  setResult={setResult}
                  setChoices={setChoices}
                  aiRecommendations={aiRecommendations}
                />
              )}
            </>
          )}

          {tab === 'dashboard' && (
            <Dashboard
              savedProfiles={savedProfiles}
              savedItems={savedItems}
              deleteProfile={deleteProfile}
              setResult={setResult}
              setStep={setStep}
              setTab={setTab}
              setActiveModal={setActiveModal}
            />
          )}

          {tab === 'library' && (
            <Library database={worldviewData.archetypes} setActiveModal={setActiveModal} />
          )}

        </div>
      </main>

      <Modal activeModal={activeModal} setActiveModal={setActiveModal} />
      {step === 4 && result && <GeminiChat result={result} media={media} recommendations={aiRecommendations} />}

      <Footer />
    </div>
  );
}