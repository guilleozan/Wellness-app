import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input";
import { Timer, ArrowRight, User, Bell, Settings } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    notifications: true
  });

  const steps = [
    {
      title: "Welcome to Wellness Timer",
      icon: <Timer className="w-12 h-12 text-blue-500 mb-4" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Let's help you stay productive and healthy with regular breaks.
          </p>
          <div className="space-y-2">
            <Input
              placeholder="Enter your name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
            <Input
              type="email"
              placeholder="Enter your email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
          </div>
        </div>
      )
    },
    {
      title: "How It Works",
      icon: <Settings className="w-12 h-12 text-blue-500 mb-4" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Timer className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-medium">Focus Timer</h4>
              <p className="text-sm text-gray-600">Work for 25 minutes, then take a short break.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Bell className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h4 className="font-medium">Break Reminders</h4>
              <p className="text-sm text-gray-600">Get notified when it's time to take a break.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Customize Your Experience",
      icon: <User className="w-12 h-12 text-blue-500 mb-4" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            You can customize your timer settings anytime:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Adjust focus duration</li>
            <li>Change break length</li>
            <li>Toggle notifications</li>
            <li>View productivity stats</li>
          </ul>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (step === steps.length) {
      // Save user data
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('onboardingComplete', 'true');
      onComplete(userData);
    } else {
      setStep(step + 1);
    }
  };

  const currentStep = steps[step - 1];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center">
            {currentStep.icon}
            <CardTitle className="text-center">{currentStep.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {currentStep.content}
            
            <div className="flex justify-between items-center mt-6">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index + 1 === step ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <Button 
                onClick={handleNext}
                disabled={step === 1 && !userData.name}
                className="flex items-center"
              >
                {step === steps.length ? 'Get Started' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;