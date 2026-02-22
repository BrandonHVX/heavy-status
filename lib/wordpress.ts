const GRAPHQL_URL = process.env.WORDPRESS_GRAPHQL_URL || 'https://heavy-status.com/graphql';

export interface WPPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content?: string;
  featuredImage: { sourceUrl: string; altText?: string } | null;
  categories: { name: string; slug: string }[];
  tags: { name: string; slug: string }[];
  author?: { name: string; avatar?: string };
}

export interface WPCategory {
  name: string;
  slug: string;
  count: number;
}

export interface WPTag {
  name: string;
  slug: string;
  count: number;
}

export interface SearchResult {
  posts: WPPost[];
  categories: WPCategory[];
  tags: WPTag[];
}

interface GraphQLResponse {
  data: any;
  errors?: any[];
}

async function graphqlRequest(query: string, variables?: Record<string, any>): Promise<any> {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const json: GraphQLResponse = await response.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message || 'GraphQL error');
  }

  return json.data;
}

function transformPost(node: any): WPPost {
  return {
    id: node.databaseId?.toString() || node.id || '',
    title: node.title || '',
    slug: node.slug || '',
    date: node.date || '',
    excerpt: node.excerpt || '',
    content: node.content || '',
    featuredImage: node.featuredImage?.node ? {
      sourceUrl: node.featuredImage.node.sourceUrl || '',
      altText: node.featuredImage.node.altText || '',
    } : null,
    categories: node.categories?.nodes?.map((c: any) => ({ name: c.name, slug: c.slug })) || [],
    tags: node.tags?.nodes?.map((t: any) => ({ name: t.name, slug: t.slug })) || [],
    author: node.author?.node ? {
      name: node.author.node.name || '',
      avatar: node.author.node.avatar?.url || '',
    } : undefined,
  };
}

const POST_FIELDS = `
  databaseId
  title
  slug
  date
  excerpt
  content
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
  categories {
    nodes {
      name
      slug
    }
  }
  tags {
    nodes {
      name
      slug
    }
  }
  author {
    node {
      name
      avatar {
        url
      }
    }
  }
`;

export async function getPosts(type: string, count: number = 6): Promise<WPPost[]> {
  let categorySlug: string | undefined;

  switch (type) {
    case 'featured':
      categorySlug = 'breaking-news';
      break;
    case 'highlights':
      categorySlug = 'highlights';
      break;
    case 'live':
      categorySlug = 'community-news';
      break;
    case 'explore':
      break;
    default:
      break;
  }

  let query: string;
  let variables: Record<string, any> = { count };

  if (categorySlug) {
    query = `
      query GetCategoryPosts($count: Int!, $category: String!) {
        posts(first: $count, where: { categoryName: $category }) {
          nodes { ${POST_FIELDS} }
        }
      }
    `;
    variables.category = categorySlug;
  } else {
    query = `
      query GetPosts($count: Int!) {
        posts(first: $count) {
          nodes { ${POST_FIELDS} }
        }
      }
    `;
  }

  const data = await graphqlRequest(query, variables);
  return data.posts.nodes.map(transformPost);
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const query = `
    query GetPost($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        ${POST_FIELDS}
      }
    }
  `;

  const data = await graphqlRequest(query, { slug });
  return data.post ? transformPost(data.post) : null;
}

export async function getPostsByCategory(categorySlug: string, count: number = 20): Promise<WPPost[]> {
  const query = `
    query GetCategoryPosts($count: Int!, $category: String!) {
      posts(first: $count, where: { categoryName: $category }) {
        nodes { ${POST_FIELDS} }
      }
    }
  `;

  const data = await graphqlRequest(query, { count, category: categorySlug });
  return data.posts.nodes.map(transformPost);
}

export async function getCategories(): Promise<WPCategory[]> {
  const query = `
    query GetCategories {
      categories(first: 20) {
        nodes {
          name
          slug
          count
        }
      }
    }
  `;

  const data = await graphqlRequest(query);
  return data.categories.nodes.filter((c: any) => c.count > 0);
}

export async function searchContent(searchTerm: string): Promise<SearchResult> {
  const query = `
    query SearchContent($search: String!) {
      posts(first: 10, where: { search: $search }) {
        nodes { ${POST_FIELDS} }
      }
      categories(first: 10, where: { search: $search }) {
        nodes {
          name
          slug
          count
        }
      }
      tags(first: 10, where: { search: $search }) {
        nodes {
          name
          slug
          count
        }
      }
    }
  `;

  const data = await graphqlRequest(query, { search: searchTerm });
  return {
    posts: data.posts.nodes.map(transformPost),
    categories: data.categories.nodes,
    tags: data.tags.nodes,
  };
}

export async function getAllPostsForSitemap() {
  const query = `
    query GetAllPosts {
      posts(first: 100) {
        nodes {
          slug
          date
          title
        }
      }
    }
  `;

  const data = await graphqlRequest(query);
  return data.posts.nodes;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&hellip;/g, '...').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').trim();
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function readingTime(content: string): string {
  const words = stripHtml(content).split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

export function getImageUrl(post: WPPost): string {
  return post.featuredImage?.sourceUrl || '/images/placeholder.svg';
}
