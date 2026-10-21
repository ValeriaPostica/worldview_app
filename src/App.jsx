import { useState } from 'react';
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
import { getPersonalizedRecommendations, isGeminiConfigured } from './services/gemini';

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
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleChoice = (qId, option) => {
    setChoices((prev) => ({ ...prev, [qId]: option }));
  };

  const continueToQuestions = async () => {
    setStep(2);
    if (!isGeminiConfigured || (!media.books && !media.movies && !media.quote)) return;
    setAiLoading(true);
    setAiError('');
    try {
      setAiRecommendations(await getPersonalizedRecommendations(media));
    } catch (error) {
      setAiError(error.message);
    } finally {
      setAiLoading(false);
    }
  };

  const calculateWorldview = () => {
    setStep(3);

    setTimeout(() => {
      const existentialSignals = ['existentialism', 'agency', 'metaphysics']
        .filter((id) => choices[id] === worldviewData.questions.find((question) => question.id === id)?.a).length;
      const computedResult = existentialSignals >= 2
        ? worldviewData.archetypes.existential_absurdist
        : worldviewData.archetypes.stoic_rationalist;

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
          <p>Five questions. One philosophical mirror. Follow your curiosities and leave with a worldview worth questioning.</p>
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
                  aiRecommendations={aiRecommendations}
                  aiLoading={aiLoading}
                  aiError={aiError}
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
      {step === 4 && result && <GeminiChat result={result} media={media} />}

      <Footer />
    </div>
  );
}