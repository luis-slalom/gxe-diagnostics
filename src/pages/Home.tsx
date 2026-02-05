import React, { useState } from 'react';
import CreateProjectModal, {
  ProjectFormData,
} from '../components/CreateProjectModal';
import { ProjectData } from '../App';
import './Home.css';

interface Project {
  id: string;
  name: string;
  industry: string;
  lastModified: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Marriott',
    industry: 'Hospitality',
    lastModified: '2 days ago',
  },
  {
    id: '2',
    name: 'Carnival Cruises',
    industry: 'Travel',
    lastModified: '1 week ago',
  },
  {
    id: '3',
    name: 'Hertz',
    industry: 'Transportation',
    lastModified: '2 weeks ago',
  },
  {
    id: '4',
    name: 'Carnival Cruises',
    industry: 'Travel',
    lastModified: '3 weeks ago',
  },
  {
    id: '5',
    name: 'Hertz',
    industry: 'Transportation',
    lastModified: '1 month ago',
  },
  {
    id: '6',
    name: 'NextEra',
    industry: 'Energy',
    lastModified: '1 month ago',
  },
];

export const Home: React.FC<{ onProjectCreated: (data: ProjectData) => void }> = ({
  onProjectCreated,
}) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateProject = (projectData: ProjectFormData) => {
    const newProject: Project = {
      id: String(projects.length + 1),
      name: projectData.projectName,
      industry: projectData.context,
      lastModified: 'just now',
    };
    setProjects([newProject, ...projects]);
    setShowCreateModal(false);
    
    // Call parent callback with full project data to navigate to report screen
    onProjectCreated({
      projectName: projectData.projectName,
      clientName: projectData.clientName,
      context: projectData.context,
    });
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  return (
    <div className="home-container">
      {/* Header Section with Gradient Background */}
      <header className="home-header">
        <h1>GxE Diagnostic</h1>
      </header>

      {/* Main Content Section */}
      <main className="home-main">
        <section className="projects-section">
          {/* Projects Header with Title and Button */}
          <div className="projects-header">
            <h2 className="projects-title">Your Projects</h2>
            <button
              onClick={handleOpenCreateModal}
              className="create-button"
            >
              Create a New Project
            </button>
          </div>

          {/* Projects Description */}
          <p className="projects-description">
            Create new client and start analyzing and finding opportunities that are applicable to them.
          </p>

          {/* Projects Grid - 3 columns */}
          <div className="projects-grid">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="project-card">
                <h3>{project.name}</h3>
                <button
                  onClick={() => handleOpenCreateModal()}
                  className="project-card-button"
                >
                  See Details
                </button>
              </div>
            ))}
          </div>

          {/* Second Row of Projects */}
          <div className="projects-grid">
            {projects.slice(3, 6).map((project) => (
              <div key={project.id} className="project-card">
                <h3>{project.name}</h3>
                <button
                  onClick={() => handleOpenCreateModal()}
                  className="project-card-button"
                >
                  See Details
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="home-footer">
        <p>2026 Slalom. All Rights Reserved. Proprietary and Confidential.</p>
      </footer>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
};

export default Home;
