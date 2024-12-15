import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';

describe('Landing Page', () => {
    it('renders the header with navigation links', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );
        expect(screen.getByText('doqa.io')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('API')).toBeInTheDocument();
        expect(screen.getByText('Resources')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('renders the hero section with headline and button', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );
        expect(screen.getByText('Showcasing Excellence in QA')).toBeInTheDocument();
        expect(screen.getByText('Explore the API')).toBeInTheDocument();
    });

    it('renders the CRUD Resources section', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );
        expect(screen.getByText('CRUD Resources')).toBeInTheDocument();
        expect(screen.getByText('Manage resources with create, read, update, and delete functionality.')).toBeInTheDocument();
        expect(screen.getByText('Go to CRUD Resources')).toBeInTheDocument();
    });

    it('renders the Why Choose Us section', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );
        expect(screen.getByText('Why Choose Us?')).toBeInTheDocument();
        expect(screen.getByText('We provide top-notch quality assurance services to ensure your web applications are robust and reliable.')).toBeInTheDocument();
        expect(screen.getByText('Automated Testing')).toBeInTheDocument();
        expect(screen.getByText('Manual Testing')).toBeInTheDocument();
        expect(screen.getByText('Performance Testing')).toBeInTheDocument();
    });

    it('renders the footer with copyright text', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );
        expect(screen.getByText(/© 2024 doqa.io. All rights reserved./)).toBeInTheDocument();
    });
});
