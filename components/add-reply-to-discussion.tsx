'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface ReplyFormProps {
//   discussionId: number;
  discussionSlug: string;
}

export default function ReplyForm({ discussionSlug }: ReplyFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {

        // First, get the discussion by slug
        const discussionResponse = await axios.get(`http://127.0.0.1:1337/api/discussions?filters[slug][$eq]=${discussionSlug}`);
        console.log('Discussion Response:', discussionResponse.data);

        const discussionId = discussionResponse.data.data[0].id;
        console.log('Found Discussion ID:', discussionId);
        
        // Then create the reply with the found discussion ID
        const payload = {
            data: {
            content: [{
                type: "paragraph",
                children: [{ type: "text", text: content }]
            }],
            publishedAt: new Date().toISOString(),
            discussion: { set: [discussionId] }  // New relationship format

            }
        };
        console.log('Sending payload:', payload);

        const response = await axios.post('http://127.0.0.1:1337/api/replies', payload);
        console.log('Response:', response.data);

        setContent('');
        //router.refresh();
        window.location.reload();
      
    } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error response:', error.response?.data);
          setError(error.response?.data?.error?.message || 'Failed to add reply. Please try again.');
        } else {
          setError('Failed to add reply. Please try again.');
        }
        console.error('Error adding reply:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <form onSubmit={handleSubmit} className="my-8">
      <div className="space-y-4">
        <div>
          <label htmlFor="reply-content" className="block text-2xl">
            Start a discussion
          </label>
          <textarea
            id="reply-content"
            rows={4}
            className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Write your reply here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            inline-flex justify-center rounded-md border border-transparent 
            px-4 py-2 text-sm font-medium text-white shadow-sm
            ${isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }
          `}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}