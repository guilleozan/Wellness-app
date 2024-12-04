import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./../ui/Card";
import { Button } from "./../ui/Button";
import { Input } from "./../ui/Input";
import { Label } from "./../ui/Label";
import { Switch } from "./../ui/Switch";
import { Alert, AlertDescription, AlertTitle } from "./../ui/Alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Timer, Play, Pause, RotateCcw, Bell, BarChart2, Settings } from 'lucide-react';




// Storage wrapper
const storage = {
  get: async (defaultValues) => {
    try {
      if (window.chrome?.storage?.local) {
        return new Promise((resolve) => {
          window.chrome.storage.local.get(defaultValues, (result) => {
            resolve(result || defaultValues);
          });
        });
      }
      return defaultValues;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValues;
    }
  },
  
  set: async (values) => {
    try {
      if (window.chrome?.storage?.local) {
        return new Promise((resolve) => {
          window.chrome.storage.local.set(values, resolve);
        });
      }
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }
};

// Time formatter
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const WellnessTracker = () => {
  // State management
  const [view, setView] = useState('timer');
  const [sessions, setSessions] = useState([]);
  const [settings, setSettings] = useState({
    focusDuration: 25 * 60,
    breakDuration: 5 * 60,
    notifications: true
  });
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(settings.focusDuration);
  const [timerType, setTimerType] = useState('focus');
  const [showAlert, setShowAlert] = useState(false);

  // Session handling
  const handleSessionComplete = useCallback(() => {
    setIsRunning(false);
    setShowAlert(true);
    const newSession = {
      timestamp: new Date().getTime(),
      type: timerType,
      duration: timerType === 'focus' ? settings.focusDuration : settings.breakDuration
    };
    setSessions(prev => [...prev, newSession]);
    storage.set({ sessions: [...sessions, newSession] });
  }, [timerType, settings, sessions]);

  // Timer controls
  const handleStartStop = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(timerType === 'focus' ? settings.focusDuration : settings.breakDuration);
  };

  const handleTimerTypeChange = (type) => {
    setTimerType(type);
    setTimeRemaining(type === 'focus' ? settings.focusDuration : settings.breakDuration);
    setIsRunning(false);
  };

  // Load saved data
  useEffect(() => {
    const loadData = async () => {
      const data = await storage.get({
        sessions: [],
        settings: {
          focusDuration: 25 * 60,
          breakDuration: 5 * 60,
          notifications: true
        }
      });
      setSessions(data.sessions || []);
      setSettings(data.settings);
      setTimeRemaining(data.settings.focusDuration);
    };
    loadData();
  }, []);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return timerType === 'focus' ? settings.focusDuration : settings.breakDuration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerType, settings, handleSessionComplete]);

  // Chart data calculation
  const getChartData = useCallback(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.getTime();
    }).reverse();

    return last7Days.map(timestamp => {
      const daysSessions = sessions.filter(s => {
        const sessionDate = new Date(s.timestamp);
        const compareDate = new Date(timestamp);
        return sessionDate.toDateString() === compareDate.toDateString();
      });

      const focusMinutes = daysSessions
        .filter(s => s.type === 'focus')
        .reduce((acc, s) => acc + (s.duration / 60), 0);

      return {
        date: new Date(timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
        minutes: Math.round(focusMinutes)
      };
    });
  }, [sessions]);

  // Settings handlers
  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    storage.set({ settings: newSettings });
  };

  // Render methods
  const renderTimer = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="w-6 h-6" />
          {timerType === 'focus' ? 'Focus Timer' : 'Break Timer'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-4xl font-mono text-center py-4 font-bold text-primary">
          {formatTime(timeRemaining)}
        </div>
        
        <div className="flex justify-center gap-2">
          <Button
            onClick={handleStartStop}
            className={`w-32 ${isRunning ? 'bg-destructive hover:bg-destructive/90' : ''}`}
          >
            {isRunning ? (
              <><Pause className="w-4 h-4 mr-2" /> Pause</>
            ) : (
              <><Play className="w-4 h-4 mr-2" /> Start</>
            )}
          </Button>
          <Button 
            variant="outline" 
            className="w-32"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        <div className="flex justify-center gap-2">
          <Button
            variant={timerType === 'focus' ? 'default' : 'outline'}
            onClick={() => handleTimerTypeChange('focus')}
          >
            Focus
          </Button>
          <Button
            variant={timerType === 'break' ? 'default' : 'outline'}
            onClick={() => handleTimerTypeChange('break')}
          >
            Break
          </Button>
        </div>

        {showAlert && (
          <Alert>
            <Bell className="w-4 h-4" />
            <AlertTitle>Timer Complete!</AlertTitle>
            <AlertDescription>
              {timerType === 'focus' 
                ? "Great work! Take a break."
                : "Break's over! Ready to focus?"}
              <Button 
                className="mt-2 w-full"
                onClick={() => setShowAlert(false)}
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderStats = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="w-6 h-6" />
          Productivity Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="minutes" stroke="#3498db" name="Focus Minutes" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Focus Duration (minutes)</Label>
          <Input 
            type="number" 
            value={settings.focusDuration / 60}
            onChange={(e) => handleSettingChange('focusDuration', Math.max(1, parseInt(e.target.value) || 0) * 60)}
          />
        </div>
        <div className="space-y-2">
          <Label>Break Duration (minutes)</Label>
          <Input 
            type="number" 
            value={settings.breakDuration / 60}
            onChange={(e) => handleSettingChange('breakDuration', Math.max(1, parseInt(e.target.value) || 0) * 60)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Notifications</Label>
          <Switch 
            checked={settings.notifications}
            onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (view) {
      case 'stats':
        return renderStats();
      case 'settings':
        return renderSettings();
      default:
        return renderTimer();
    }
  };

  return (
    <div className="w-96 p-4 bg-background">
      <div className="flex justify-between mb-4">
        <Button variant={view === 'timer' ? 'default' : 'outline'} onClick={() => setView('timer')}>
          <Timer className="w-4 h-4 mr-2" /> Timer
        </Button>
        <Button variant={view === 'stats' ? 'default' : 'outline'} onClick={() => setView('stats')}>
          <BarChart2 className="w-4 h-4 mr-2" /> Stats
        </Button>
        <Button variant={view === 'settings' ? 'default' : 'outline'} onClick={() => setView('settings')}>
          <Settings className="w-4 h-4 mr-2" /> Settings
        </Button>
      </div>
      {renderContent()}
    </div>
  );
};

export default WellnessTracker;







