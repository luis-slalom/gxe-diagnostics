import React, { useState } from 'react';
import './CreateProjectModal.css';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (projectData: ProjectFormData) => void;
}

export interface ProjectFormData {
  projectName: string;
  clientName: string;
  context: string;
}

const contextOptions = [
  'Select applicables',
  'Technology Modernization',
  'Digital Transformation',
  'Cloud Migration',
  'Data Analytics',
  'Customer Experience',
  'Operational Excellence',
  'Sustainability',
];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: '',
    clientName: '',
    context: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }
    if (!formData.context || formData.context === 'Select applicables') {
      newErrors.context = 'Please select a context';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProject = () => {
    if (validateForm()) {
      onCreateProject(formData);
      // Reset form
      setFormData({
        projectName: '',
        clientName: '',
        context: '',
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      projectName: '',
      clientName: '',
      context: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h1 className="modal-title">Create a New Project</h1>

        {/* Project Name Field */}
        <div className="form-group">
          <label htmlFor="projectName" className="form-label">
            Project Name
          </label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            placeholder=""
            className={`form-input ${errors.projectName ? 'error' : ''}`}
          />
          {errors.projectName && (
            <span className="form-error">{errors.projectName}</span>
          )}
        </div>

        {/* Client Name Field */}
        <div className="form-group">
          <label htmlFor="clientName" className="form-label">
            Client Name
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            placeholder=""
            className={`form-input ${errors.clientName ? 'error' : ''}`}
          />
          {errors.clientName && (
            <span className="form-error">{errors.clientName}</span>
          )}
        </div>

        {/* Context Field */}
        <div className="form-group">
          <label htmlFor="context" className="form-label">
            Context
          </label>
          <select
            id="context"
            name="context"
            value={formData.context}
            onChange={handleInputChange}
            className={`form-select ${errors.context ? 'error' : ''}`}
          >
            {contextOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.context && (
            <span className="form-error">{errors.context}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button
            onClick={handleCancel}
            className="btn-cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateProject}
            className="btn-create"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
