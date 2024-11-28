import Link from 'next/link';
import { fetchDiscussions } from '@/utils/strapi';

export default async function DiscussionsPage() {
  try {
    const { data: discussions } = await fetchDiscussions();

    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Discussions</h1>
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <div 
              key={discussion.id} 
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">
                {discussion.title}
              </h2>
              <div className="text-sm text-gray-600 mb-3">
              AUTHOR: {discussion.users_permissions_user?.data?.attributes.username || 'Anonymous'} on{' '}
              Posted on{' '}
              {new Date(discussion.createdAt).toLocaleDateString()}
              |
              Last commented on {' '}
              {new Date(discussion.updatedAt).toLocaleDateString()}
              </div>
              <p className="text-gray-700 mb-4">
                {discussion.content[0].children[0].text.substring(0, 1000)}...
              </p>
              <div className="flex justify-between items-center">
                <Link 
                  href={`/discussions/${discussion.slug}`}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  JOIN
                </Link>
                <span className="text-sm text-gray-500">
                  {discussion.replies?.length || 0} replies
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in DiscussionsPage:', error);
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Discussions</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Sorry, we couldn't load the discussions. Please try again later.</p>
        </div>
      </div>
    );
  }
}