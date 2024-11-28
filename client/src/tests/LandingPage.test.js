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

    it('renders the footer with copyright text', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );
        expect(screen.getByText(/©/)).toBeInTheDocument();
    });
});
