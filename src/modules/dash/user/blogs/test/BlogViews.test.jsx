import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import { userBlogsReducer } from '@/features/dash/user/blogs';
import BlogsView from '../pages/BlogsView';
import BlogDetailView from '../pages/BlogDetailView';

const render = (element, { path = '/blogs', route = '/blogs', userBlogs = {} } = {}) => {
  const store = configureStore({
    reducer: { userBlogs: userBlogsReducer },
    preloadedState: {
      userBlogs: { ...userBlogsReducer(undefined, { type: '@@init' }), ...userBlogs },
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

const blog = (n) => ({ id: `b${n}`, slug: `post-${n}`, title: `Post ${n}`, body: 'Hello' });

describe('BlogsView', () => {
  it('renders the hero, latest and archive sections', () => {
    const html = render(<BlogsView />, {
      userBlogs: { latestBlogs: [blog(1)], blogs: [blog(2)] },
    });
    expect(html).toContain('Lab Unity Knowledge Hub');
    expect(html).toContain('id="latest-hub"');
    expect(html).toContain('Post 1');
    expect(html).toContain('Post 2');
  });

  it('shows empty messages without articles', () => {
    expect(render(<BlogsView />)).toContain('No articles found.');
  });
});

describe('BlogDetailView', () => {
  const renderDetail = (userBlogs) =>
    render(<BlogDetailView />, { path: '/blogs/post-1', route: '/blogs/:slug', userBlogs });

  it('renders the article and popular posts without the current one', () => {
    const html = renderDetail({ selectedBlog: blog(1), latestBlogs: [blog(1), blog(2)] });
    expect(html).toContain('Back to Blogs');
    expect(html).toContain('href="/blogs/post-2"');
    expect(html).not.toContain('href="/blogs/post-1"');
  });

  it('shows the empty sidebar text when there are no other posts', () => {
    expect(renderDetail({ selectedBlog: blog(1), latestBlogs: [] })).toContain(
      'No other articles yet.',
    );
  });
});
