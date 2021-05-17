import Card from '../Card';
import * as helpers from '../../helpers';
import { fireEvent, render, screen } from '@testing-library/react';
import { feedResponse } from './mocks/feedResponse.mock';

const photo = feedResponse.photos.photo[0];

function renderCard () {
  render(<Card
    title={photo.title}
    authorUrl={`https://www.flickr.com/people/${photo.owner}/`}
    author={photo.ownername}
    photoUrls={{
      s: photo[`url_${helpers.photoSizeCodes.s}`],
      m: photo[`url_${helpers.photoSizeCodes.m}`],
      l: photo[`url_${helpers.photoSizeCodes.l}`],
      xl: photo[`url_${helpers.photoSizeCodes.xl}`],
    }}
    description={photo.description._content}
    tags={photo.tags}
    filterTags={[]}
  />)
}

test('should render small photo and not the large one', () => {
  renderCard();
  screen.getByAltText(`${photo.title} - small`);
});

test('should not render large photo', () => {
  renderCard();
  const largePhoto = screen.queryByAltText(`${photo.title} - large`);
  const mediumPhoto = screen.queryByAltText(`${photo.title} - medium`);
  expect(largePhoto).toBeNull();
  expect(mediumPhoto).toBeNull();
});

test('should render title', () => {
  renderCard();
  screen.getByText(photo.title);
});

test('should render author', () => {
  renderCard();
  screen.getByText(photo.ownername);
});

test('should render description', () => {
  renderCard();
  screen.getByText(photo.description._content);
});

test('should render large photo and close button after clicking on small photo', async () => {
  renderCard();
  const largePhoto = screen.queryByAltText(`${photo.title} - large`);
  expect(largePhoto).toBeNull();
  fireEvent.click(screen.getByAltText(`${photo.title} - small`), { button: 0 });

  screen.getByAltText(`${photo.title} - large`);
  screen.getByRole('button', { name: 'X' });
});

test("clicking 'close-large-view' button should remove the large photo from DOM", async () => {
  renderCard();
  const largePhoto = screen.queryByAltText(`${photo.title} - large`);
  expect(largePhoto).toBeNull();
  fireEvent.click(screen.getByAltText(`${photo.title} - small`), { button: 0 });
  screen.getByAltText(`${photo.title} - large`);
  fireEvent.click(screen.getByRole('button', { name: 'X' }));
  expect(screen.queryByAltText(`${photo.title} - large`)).toBeNull();
});

