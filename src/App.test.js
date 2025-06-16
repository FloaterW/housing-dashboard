import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders housing dashboard header', async () => {
  render(<App />);

  // Wait for the header to render
  await waitFor(() => {
    expect(screen.getByText('Housing Market Dashboard')).toBeInTheDocument();
  });

  // Check for navigation elements
  expect(screen.getByText('Select Region')).toBeInTheDocument();
  expect(screen.getByText('Housing Type')).toBeInTheDocument();
});
