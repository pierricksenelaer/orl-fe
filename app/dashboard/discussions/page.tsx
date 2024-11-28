import Link from 'next/link';
import { fetchDiscussions } from '@/utils/strapi';

export default async function DiscussionsPage() {
  try {
    const { data: discussions } = await fetchDiscussions();

    return (
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">Discussions</h1>
        <div className="text-white">
          {discussions.map((discussion) => (
            <div 
              key={discussion.id} 
              className="border-b mb-10 py-5"
            >
              <h2 className="text-3xl font-semibold mb-2">
                {discussion.title}
              </h2>
              <div className="text-sm mb-3">
                <span>AUTHOR: {discussion.users_permissions_user?.data?.attributes.username || 'Anonymous'} {' '} | </span>
                <span>Posted on{' '} {new Date(discussion.createdAt).toLocaleDateString()}</span>
                {/* <span>Last commented on {' '} {new Date(discussion.updatedAt).toLocaleDateString()}</span>  */}
              </div>
              <p className="mb-4">
                {discussion.content[0].children[0].text.substring(0, 1000)}...
              </p>
              <div className="flex justify-between items-center">
                <Link 
                  href={`/dashboard/discussions/${discussion.slug}`}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  JOIN
                </Link>
                <span className="text-xl text-white font-bold">
                  {discussion.replies?.length || 0} {discussion.replies?.length < 2 ? 'comment' : 'comments'}
                  
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