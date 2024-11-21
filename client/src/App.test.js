import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Existing test
test('renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});

// New test for the homepage
test('renders the homepage without errors', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <App />
        </MemoryRouter>
    );
    const homepageElement = await screen.findByText(/Learn React/i);
    expect(homepageElement).toBeInTheDocument();
});
