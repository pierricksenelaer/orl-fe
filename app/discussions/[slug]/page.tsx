import { fetchDiscussion } from '@/utils/strapi';
import Link from 'next/link';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function DiscussionPage({ params }: PageProps) {
  try {
    const { data } = await fetchDiscussion(params.slug);
    
    if (!data || data.length === 0) {
      throw new Error('Discussion not found');
    }

    const discussionData = data[0];
    const replies = discussionData.replies || []; // Handle empty replies
    
    return (
      <div className="max-w-4xl mx-auto p-4">
        {/* Back button */}
        <Link 
          href="/discussions"
          className="text-blue-500 hover:text-blue-600 mb-6 inline-block"
        >
          ← Back to Discussions
        </Link>

        {/* Discussion */}
        <div className="border rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {discussionData.title}
          </h1>
          
          <div className="text-sm text-gray-600 mb-4">
          Posted by {discussionData.users_permissions_user?.data?.attributes.username || 'Anonymous'} on{' '}
            Posted on{' '}
            {new Date(discussionData.createdAt).toLocaleDateString()}
          </div>
          <div className="prose max-w-none">
            {discussionData.content.map((node, index) => (
              <p key={index}>
                {node.children[0].text}
              </p>
            ))}
          </div>
        </div>

        {/* Replies */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">
            Replies ({replies.length || 0})
          </h2>
          {replies.length === 0 ? (
            <p className="text-gray-600">No replies yet.</p>
          ) : (
            <div className="space-y-4">
              {replies.map((reply) => (
                <div 
                  key={reply.id} 
                  className="border rounded-lg p-4"
                >
                  <div className="text-sm text-gray-600 mb-2">
                    Posted on{' '}
                    {new Date(reply.createdAt).toLocaleDateString()}
                  </div>
                  <div className="prose max-w-none">
                  {reply.content.map((node, index) => (
              <p key={index}>
                {node.children[0].text}
              </p>
            ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in DiscussionPage:', error);
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Sorry, we couldn't load this discussion. Please try again later.</p>
        </div>
      </div>
    );
  }
}