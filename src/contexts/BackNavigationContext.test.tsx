import React, { useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { BackNavigationProvider, useBackDismiss } from './BackNavigationContext';

const LocationLabel = () => {
  const location = useLocation();
  return <span data-testid="pathname">{location.pathname}</span>;
};

const ModalHarness = () => {
  const [isOpen, setIsOpen] = useState(true);
  useBackDismiss(isOpen, () => setIsOpen(false));
  return <span>{isOpen ? 'Modal open' : 'Modal closed'}</span>;
};

const renderProvider = (child?: React.ReactNode) => render(
  <BrowserRouter>
    <BackNavigationProvider>
      <LocationLabel />
      {child}
    </BackNavigationProvider>
  </BrowserRouter>,
);

describe('BackNavigationProvider', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('dismisses the newest open surface before leaving Home', () => {
    window.history.replaceState({}, '', '/');
    renderProvider(<ModalHarness />);

    act(() => {
      window.history.replaceState({}, '', '/');
      fireEvent.popState(window);
    });

    expect(screen.getByText('Modal closed')).toBeInTheDocument();
    expect(screen.getByTestId('pathname')).toHaveTextContent('/');
  });

  it('keeps Back inert on Home when nothing is open', () => {
    window.history.replaceState({}, '', '/');
    renderProvider();

    act(() => {
      window.history.replaceState({}, '', '/');
      fireEvent.popState(window);
    });

    expect(screen.getByTestId('pathname')).toHaveTextContent('/');
    expect(window.location.pathname).toBe('/');
  });

  it('returns a secondary protected page to Home', async () => {
    window.history.replaceState({}, '', '/admin');
    renderProvider();

    act(() => {
      window.history.replaceState({}, '', '/admin');
      fireEvent.popState(window);
    });

    await waitFor(() => expect(screen.getByTestId('pathname')).toHaveTextContent('/'));
  });
});
