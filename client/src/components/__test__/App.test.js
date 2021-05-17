import App from '../App';
// import { render } from 'react-dom'
import React from 'react'
import {render, screen} from '@testing-library/react'
// jest.mock('./hooks/useFeed');
// jest.mock('./hooks/useSearch');
// import useFeed from './hooks/useFeed';
// import useSearch from './hooks/useSearch'

// const mockGetFeed = (useFeed = jest.fn('interesting', 1, []))

// const mockFeed = useFeed('interesting', 1, []);

test('renders title', () => {
  render(<App />);

  screen.getByText('Flickr Photo Stream');
  screen.getByPlaceholderText('Search...');
})


test('renders search input', () => {
  render(<App />);

  screen.getByPlaceholderText('Search...');
});

// test('spinner renders while loading', () => {

//   render(<App />);
//   screen.getByPlaceholderText('Search...');
// })
