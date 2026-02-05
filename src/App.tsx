import React, { useState } from 'react';
import ReportScreen from './components/ReportScreen';
import { Home as HomePage } from './pages/Home';
import './App.css';

export interface ProjectData {
  projectName: string;
  clientName: string;
  context: string;
}

type AppView = 'home' | 'report-screen';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  const handleProjectCreated = (data: ProjectData) => {
    setProjectData(data);
    setCurrentView('report-screen');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setProjectData(null);
  };

  return (
    <div className="App">
      {currentView === 'home' ? (
        <HomePage onProjectCreated={handleProjectCreated} />
      ) : projectData ? (
        <ReportScreen
          projectName={projectData.projectName}
          clientName={projectData.clientName}
          context={projectData.context}
          onBack={handleBackToHome}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default App;
