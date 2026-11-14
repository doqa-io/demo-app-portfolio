import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ResourcesPage from '../pages/ResourcesPage';

// La fabrique évite de charger le vrai module axios (ESM) dans Jest.
jest.mock('axios', () => ({ get: jest.fn(), post: jest.fn(), delete: jest.fn() }));

describe('Resources Page', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it('loads and lists the resources from the API', async () => {
        axios.get.mockResolvedValue({ data: [{ id: 1, name: 'First' }, { id: 2, name: 'Second' }] });
        render(<ResourcesPage />);

        expect(await screen.findByText('First')).toBeInTheDocument();
        expect(screen.getByText('Second')).toBeInTheDocument();
        expect(screen.getAllByTestId('resource-item')).toHaveLength(2);
        expect(axios.get).toHaveBeenCalledWith('/api/resources');
    });

    it('shows an error when the resources cannot be loaded', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));
        render(<ResourcesPage />);

        expect(await screen.findByText('Failed to load resources')).toBeInTheDocument();
        expect(screen.queryAllByTestId('resource-item')).toHaveLength(0);
    });

    it('adds a resource, clears the field and appends it to the list', async () => {
        axios.get.mockResolvedValue({ data: [] });
        axios.post.mockResolvedValue({ data: { id: 3, name: 'New one' } });
        render(<ResourcesPage />);
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        const input = screen.getByPlaceholderText('Enter resource name');
        userEvent.type(input, 'New one');
        userEvent.click(screen.getByRole('button', { name: 'Add Resource' }));

        expect(await screen.findByText('New one')).toBeInTheDocument();
        expect(axios.post).toHaveBeenCalledWith('/api/resources', { name: 'New one' });
        expect(input).toHaveValue('');
    });

    it('refuses an empty name without calling the API', async () => {
        axios.get.mockResolvedValue({ data: [] });
        render(<ResourcesPage />);
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        userEvent.click(screen.getByRole('button', { name: 'Add Resource' }));

        expect(await screen.findByText('Resource name cannot be empty')).toBeInTheDocument();
        expect(axios.post).not.toHaveBeenCalled();
    });

    it('shows an error when the API refuses the new resource', async () => {
        axios.get.mockResolvedValue({ data: [] });
        axios.post.mockRejectedValue(new Error('Request failed with status code 400'));
        render(<ResourcesPage />);
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        userEvent.type(screen.getByPlaceholderText('Enter resource name'), 'Rejected');
        userEvent.click(screen.getByRole('button', { name: 'Add Resource' }));

        expect(await screen.findByText('Failed to add resource')).toBeInTheDocument();
        expect(screen.queryAllByTestId('resource-item')).toHaveLength(0);
    });

    it('deletes a resource from the list', async () => {
        axios.get.mockResolvedValue({ data: [{ id: 1, name: 'Keep' }, { id: 2, name: 'Remove' }] });
        axios.delete.mockResolvedValue({ data: { message: 'Resource deleted' } });
        render(<ResourcesPage />);
        await screen.findByText('Remove');

        const item = screen.getByText('Remove').closest('li');
        userEvent.click(item.querySelector('button'));

        await waitFor(() => expect(screen.queryByText('Remove')).not.toBeInTheDocument());
        expect(screen.getByText('Keep')).toBeInTheDocument();
        expect(axios.delete).toHaveBeenCalledWith('/api/resources/2');
    });

    it('keeps the resource and shows an error when the deletion fails', async () => {
        axios.get.mockResolvedValue({ data: [{ id: 1, name: 'Stuck' }] });
        axios.delete.mockRejectedValue(new Error('Network Error'));
        render(<ResourcesPage />);
        await screen.findByText('Stuck');

        userEvent.click(screen.getByRole('button', { name: 'Delete' }));

        expect(await screen.findByText('Failed to delete resource')).toBeInTheDocument();
        expect(screen.getByText('Stuck')).toBeInTheDocument();
    });
});
