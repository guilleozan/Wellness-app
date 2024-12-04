import React, { useState, useEffect } from 'react';
import WellnessTracker from './components/Pages/WellnessTracker';
import Onboarding from './components/Onboarding';

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    const savedUserData = localStorage.getItem('userData');
    
    if (onboardingComplete && savedUserData) {
      setShowOnboarding(false);
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  const handleOnboardingComplete = (data) => {
    setUserData(data);
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showOnboarding ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <WellnessTracker userData={userData} />
      )}
    </div>
  );
};

export default App;