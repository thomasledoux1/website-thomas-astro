import type { Comment } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
const CommentsUpvotes = ({ blogUrl }: { blogUrl: string }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<'idle' | 'loading'>('idle');
  const upToDateCommentsQuery = useQuery({
    queryKey: [`comments-${blogUrl}`],
    queryFn: async () => {
      const allCommentsInDb = await fetch(
        `/api/comments/list?blogUrl=${blogUrl}`
      );
      const allCommentsInDbJson = await allCommentsInDb.json();
      return allCommentsInDbJson as Comment[];
    },
  });
  const onSubmit = async (e: React.FormEvent) => {
    setFormState('loading');
    e.preventDefault();
    if (e.currentTarget) {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      await fetch('/api/comments/create', {
        method: 'POST',
        body: JSON.stringify({
          author: formData.get('author'),
          comment: formData.get('comment'),
          blogUrl,
        }),
      });
      formRef.current?.reset();
      upToDateCommentsQuery.refetch();
    }
    setFormState('idle');
  };
  return (
    <>
      <h2 className="text-xl lg:text-2xl mb-4 font-bold">Add a comment</h2>
      <form
        onSubmit={onSubmit}
        ref={formRef}
        className="flex flex-col lg:w-[50%] items-start"
      >
        <label className="flex flex-col mb-2" htmlFor="author">
          Author
        </label>
        <input
          className="py-2 px-4 bg-white border-secondary border-2 rounded-lg w-full"
          placeholder="Author"
          name="author"
          required
        />
        <label className="flex flex-col mb-2 mt-4" htmlFor="comment">
          Comment
        </label>
        <textarea
          className="py-2 px-4 bg-white border-secondary border-2 rounded-lg w-full"
          placeholder="Comment"
          required
          rows={4}
          name="comment"
        ></textarea>
        <button
          disabled={formState === 'loading'}
          className="px-8 mt-4 py-4 bg-secondary text-white rounded-lg lg:hover:scale-[1.04] transition-transform disabled:opacity-50 "
          type="submit"
        >
          {formState === 'loading' ? 'Submitting' : 'Submit comment'}
        </button>
      </form>

      <h2 className="text-xl lg:text-2xl mb-4 font-bold">Comments</h2>
      {upToDateCommentsQuery?.data && upToDateCommentsQuery?.data.length > 0 ? (
        <div className="flex flex-col gap-y-4">
          {upToDateCommentsQuery?.data?.map(comment => (
            <div key={comment.id} className="flex flex-col">
              <h3 className="font-bold">{comment.author}</h3>
              <div>{comment.text}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4">No comments yet. Be the first to add one!</div>
      )}
    </>
  );
};

export default CommentsUpvotes;
