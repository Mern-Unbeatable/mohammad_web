import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth';
import { userGeneralReducer } from '@/features/dash/user/general';
import GeneralView from '../pages/GeneralView';
import MyGeneralPostsView from '../pages/MyGeneralPostsView';
import GeneralPostDetailView from '../pages/GeneralPostDetailView';

const render = (element, { path = '/general', route = '/general', userGeneral = {} } = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer, userGeneral: userGeneralReducer },
    preloadedState: {
      userGeneral: { ...userGeneralReducer(undefined, { type: '@@init' }), ...userGeneral },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={route} element={element} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

const post = (id, type = 'NEWS') => ({ id, type, title: `Post ${id}`, summary: 'Summary text' });

describe('General list views', () => {
  it('renders browse cards linking to the detail page', () => {
    const html = render(<GeneralView />, {
      userGeneral: { posts: [post('p1')], postsLoading: false },
    });
    expect(html).toContain('Post p1');
    expect(html).toContain('href="/general/p1"');
  });

  it('shows the empty state on My posts', () => {
    const html = render(<MyGeneralPostsView />, {
      path: '/general/my-posts',
      route: '/general/my-posts',
      userGeneral: { postsLoading: false },
    });
    expect(html).toContain('No posts yet');
  });
});

describe('GeneralPostDetailView', () => {
  const renderDetail = (selectedPost) =>
    render(<GeneralPostDetailView />, {
      path: '/general/p1',
      route: '/general/:postId',
      userGeneral: { selectedPost },
    });

  it('falls back to the summary and offers Download for documents', () => {
    const html = renderDetail({ ...post('p1', 'DOCUMENT'), documentUrl: 'https://x/doc.pdf' });
    expect(html).toContain('Back to General');
    expect(html).toContain('Summary text');
    expect(html).toContain('href="https://x/doc.pdf"');
  });

  it('has no Download for news', () => {
    expect(renderDetail(post('p1'))).not.toContain('Download');
  });

  it('shows the author details beside the post', () => {
    const html = renderDetail({
      ...post('p1'),
      author: {
        id: 'a1',
        name: 'Ana Lab',
        title: 'Research Scientist',
        company: 'BioCore',
        location: 'Dhaka',
      },
    });
    expect(html).toContain('Posted by');
    expect(html).toContain('Ana Lab');
    expect(html).toContain('Research Scientist · BioCore');
    expect(html).toContain('Dhaka');
    expect(html).toContain('href="/contacts/a1"');
  });
});
