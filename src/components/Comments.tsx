import type { Comment } from '@prisma/client';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { trpcReact } from '../client';
const Comments = ({
  blogUrl,
  initialComments,
}: {
  blogUrl: string;
  initialComments?: Comment[] | undefined;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<'idle' | 'loading'>('idle');
  const upToDateCommentsQuery = trpcReact.getCommentsForBlog.useQuery(blogUrl, {
    initialData: initialComments,
  });
  const { mutate: addComment } = trpcReact.createCommentForBlog.useMutation({
    onMutate: () => {
      setFormState('loading');
    },
    onError: () => {
      toast.error('Error adding comment');
    },
    onSuccess: res => {
      if (res.status === 'success') {
        toast.success('Succesfully added comment');
      } else {
        toast.error('Error adding comment');
      }
    },
    onSettled: () => {
      upToDateCommentsQuery.refetch();
      setFormState('idle');
    },
  });
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (e.currentTarget) {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      addComment({
        author: formData.get('author') as string,
        comment: formData.get('comment') as string,
        blogUrl,
      });
    }
  };
  return (
    <>
      <h2 className="text-xl lg:text-2xl mb-4 font-bold">Add a comment</h2>
      <form
        onSubmit={onSubmit}
        ref={formRef}
        className="flex flex-col lg:w-[50%] items-start"
      >
        <label className="flex flex-col mb-2 font-semibold" htmlFor="author">
          Author
        </label>
        <input
          className="py-2 px-4 bg-white border-secondary border-2 rounded-lg w-full"
          placeholder="Author"
          name="author"
          required
        />
        <label
          className="flex flex-col mb-2 mt-4 font-semibold"
          htmlFor="comment"
        >
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

      <h2 className="text-xl lg:text-2xl mb-4 font-bold mt-4">Comments</h2>
      {upToDateCommentsQuery?.data && upToDateCommentsQuery?.data.length > 0 ? (
        <div className="flex flex-col gap-y-4">
          {upToDateCommentsQuery?.data?.map(comment => (
            <div key={comment.id} className="flex flex-col">
              <div className="flex items-center gap-x-2">
                <h3 className="font-bold !my-0">{comment.author}</h3>
                <span>|</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString('en-BE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
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

export default Comments;
