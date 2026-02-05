# GxE Diagnostics

## Overview
GxE Diagnostics is a React-based web application designed to help consultants and teams analyze client opportunities across various industries. The app provides a streamlined interface for creating, managing, and reviewing diagnostic projects tailored to client needs.

## Features
- **Project Dashboard:** View and manage a list of client projects, each with industry context and last modified details.
- **Create Project Modal:** Easily add new projects with client name, project name, and select applicable contexts (e.g., Technology Modernization, Digital Transformation, Cloud Migration, etc.).
- **Responsive UI:** Modern, Figma-inspired design with gradient backgrounds, clear typography, and intuitive layout.
- **Confidentiality:** All data is proprietary and confidential, with security best practices (no secrets committed to git).

## Usage
1. **Homepage:**
   - Displays your current projects in a grid layout.
   - Click "Create a New Project" to open the modal and start a new diagnostic.
   - Each project card allows you to view details and manage client opportunities.
2. **Create Project:**
   - Fill in the project name, client name, and select the relevant context.
   - Validate required fields before creating a project.
   - Newly created projects appear at the top of your dashboard.

## Technologies
- React (TypeScript)
- Custom CSS & Tailwind (Figma-inspired)
- Node.js & npm for package management

## Security
- Secrets (e.g., API tokens) are stored in `.env.local` and excluded from git via `.gitignore`.
- Do not commit sensitive information to the repository.

## License
2026 Slalom. All Rights Reserved. Proprietary and Confidential.