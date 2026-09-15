import React, { useState, useEffect } from 'react';
import { SoundProvider } from './context/SoundContext';
import SparkleCursor from './components/SparkleCursor';
import OpeningSection from './components/OpeningSection';
import NameRevealSection from './components/NameRevealSection';
import PhotoGallerySection from './components/PhotoGallerySection';
import GiftsSection from './components/GiftsSection';
import MiniGameSection from './components/MiniGameSection';
import CakeSection from './components/CakeSection';
import EnvelopeSection from './components/EnvelopeSection';
import FinaleSection from './components/FinaleSection';

const PERSON_NAME = 'Special';
const TOTAL_STEPS = 8;

export default function App() {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  };

  const restart = () => {
    setStep(0);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const renderSection = () => {
    switch (step) {
      case 0:
        return <OpeningSection onNext={nextStep} />;
      case 1:
        return <NameRevealSection name={PERSON_NAME} onNext={nextStep} />;
      case 2:
        return <PhotoGallerySection onNext={nextStep} />;
      case 3:
        return <GiftsSection onNext={nextStep} />;
      case 4:
        return <MiniGameSection onNext={nextStep} />;
      case 5:
        return <CakeSection name={PERSON_NAME} onNext={nextStep} />;
      case 6:
        return <EnvelopeSection name={PERSON_NAME} onNext={nextStep} />;
      case 7:
        return <FinaleSection name={PERSON_NAME} onRestart={restart} />;
      default:
        return <OpeningSection onNext={nextStep} />;
    }
  };

  return (
    <SoundProvider>
      <div className="app-root">
        <SparkleCursor />
        <main style={{ width: '100%', minHeight: '100vh' }}>
          {renderSection()}
        </main>
      </div>
    </SoundProvider>
  );
}
