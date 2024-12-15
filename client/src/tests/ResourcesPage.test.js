import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ResourcesPage from '../pages/ResourcesPage';

const mock = new MockAdapter(axios);

describe('ResourcesPage', () => {
    beforeEach(() => {
        mock.reset();
    });

    it('renders without crashing', () => {
        render(
            <MemoryRouter>
                <ResourcesPage />
            </MemoryRouter>
        );
        expect(screen.getByText('Resources')).toBeInTheDocument();
    });

    it('fetches and displays resources', async () => {
        // Mock GET response
        mock.onGet('/api/resources').reply(200, [
            { id: 1, name: 'Resource 1' },
            { id: 2, name: 'Resource 2' },
        ]);

        render(
            <MemoryRouter>
                <ResourcesPage />
            </MemoryRouter>
        );

        // Wait for the resources to load
        const resourceItems = await screen.findAllByTestId('resource-item');
        expect(resourceItems.length).toBe(2);
        expect(screen.getByText('Resource 1')).toBeInTheDocument();
        expect(screen.getByText('Resource 2')).toBeInTheDocument();
    });

    it('adds a new resource', async () => {
        // Mock POST and GET responses
        mock.onPost('/api/resources').reply(201, { id: 3, name: 'New Resource' });
        mock.onGet('/api/resources').reply(200, [
            { id: 1, name: 'Resource 1' },
            { id: 3, name: 'New Resource' },
        ]);

        render(
            <MemoryRouter>
                <ResourcesPage />
            </MemoryRouter>
        );

        // Simulate adding a new resource
        const input = screen.getByPlaceholderText('Enter resource name');
        const button = screen.getByText('Add Resource');
        fireEvent.change(input, { target: { value: 'New Resource' } });
        fireEvent.click(button);

        // Wait for the new resource to appear
        const resourceItems = await screen.findAllByTestId('resource-item');
        expect(resourceItems.length).toBe(2);
        expect(screen.getByText('New Resource')).toBeInTheDocument();
    });

    it('deletes a resource', async () => {
        // Mock GET and DELETE responses
        mock.onGet('/api/resources').reply(200, [
            { id: 1, name: 'Resource 1' },
        ]);
        mock.onDelete('/api/resources/1').reply(200);

        render(
            <MemoryRouter>
                <ResourcesPage />
            </MemoryRouter>
        );

        // Simulate deleting a resource
        const deleteButton = await screen.findByText('Delete');
        fireEvent.click(deleteButton);

        // Wait for the resource to be removed
        await waitFor(() => {
            expect(screen.queryByText('Resource 1')).not.toBeInTheDocument();
        });
    });
});
