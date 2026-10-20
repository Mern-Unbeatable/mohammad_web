/** Normalize global search API payload for the UI. */

export function toSearchResultsModel(data) {
  if (!data) {
    return {
      users: [],
      posts: [],
      listings: [],
      jobs: [],
      blogs: [],
      conversations: [],
      raw: data,
    };
  }

  if (Array.isArray(data)) {
    return {
      items: data,
      users: [],
      posts: [],
      listings: [],
      jobs: [],
      blogs: [],
      conversations: [],
      raw: data,
    };
  }

  return {
    users: data.users || data.members || [],
    posts: data.posts || data.feed || [],
    listings: data.listings || data.marketplace || [],
    jobs: data.jobs || data.recruitment || [],
    blogs: data.blogs || data.articles || [],
    conversations: data.conversations || data.messages || [],
    raw: data,
  };
}
