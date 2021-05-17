import Tag from '../Tag';
import { fireEvent, render, screen } from '@testing-library/react';

const mockAddFilterTag = jest.fn((tag) => ['one', 'two', tag]);
const mockSearchByTag = jest.fn((tag) => `the query is ${tag}`);
const mockClearFilterTags = jest.fn(() => 'filterTags was cleared!');
const tagText = 'tag-text';

function renderTag (inCard, isSelected) {
  render(<Tag
    tagText={tagText}
    filterHandler={mockAddFilterTag}
    searchHandler={mockSearchByTag}
    clearFilterTags={mockClearFilterTags}
    isInCard={inCard}
    tagIsSelected={isSelected}
  />);
}

test('should render tag text', () => {
  renderTag(true, false);
  screen.getByText(tagText);
});

test('should render add (+) button if not added and in card', () => {
  renderTag(true, false);
  screen.getByRole('button', { name: '+' })
});

test('should render remove (x) button if added and in filter tags list', () => {
  renderTag(false, true);
  screen.getByRole('button', { name: 'x' })
});

test('should add tag when add (+) button is clicked', () => {
  renderTag(true, false);
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  expect(mockAddFilterTag.mock.calls.length).toBe(1);
  expect(mockAddFilterTag.mock.calls[0][0]).toBe(tagText);
});

test('should remove a tag when the remove (x) button is clicked', () => {
  renderTag(false, true);
  const removeButton = screen.getByRole('button', { name: 'x' })
  expect(removeButton).not.toBeNull();
  fireEvent.click(removeButton);
  expect(mockClearFilterTags.mock.calls.length).toBe(1);
})

test('should clear all tags when the tag text is clicked', () => {
  renderTag(true, false);
  fireEvent.click(screen.getByText(tagText));
  expect(mockClearFilterTags.mock.calls.length).toBe(1);
});

test('should change the search query to the tag text when tag text is clicked', () => {
  renderTag(true, false);
  fireEvent.click(screen.getByText(tagText));
  expect(mockSearchByTag.mock.calls.length).toBe(1);
  expect(mockSearchByTag.mock.calls[0][0]).toBe(tagText);
});
