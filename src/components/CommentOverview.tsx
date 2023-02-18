import type { Comment } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';

type CommentOverviewProps = {
  commentsWithPost:
    | (Comment & {
        post: {
          url: string;
        };
      })[]
    | undefined;
};

const CommentOverview = ({ commentsWithPost }: CommentOverviewProps) => {
  const upToDateCommentsQuery = useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      const allCommentsInDb = await fetch(`/api/comments`);
      const allCommentsInDbJson = (await allCommentsInDb.json()) as
        | (Comment & {
            post: {
              url: string;
            };
          })[]
        | undefined;
      return allCommentsInDbJson;
    },
    initialData: commentsWithPost,
  });
  const { mutate: deleteComment } = useMutation({
    mutationFn: (id: number) => {
      return fetch('/api/comments', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
    },
    onSettled: () => {
      upToDateCommentsQuery.refetch();
    },
  });

  const commentsReduced = upToDateCommentsQuery?.data?.reduce<{
    [key: string]: typeof upToDateCommentsQuery.data;
  }>(
    (acc, cur) => ({
      ...acc,
      [cur.post.url]: [...(acc[cur.post.url] || []), cur],
    }),
    {}
  );
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {commentsReduced
        ? Object.entries(commentsReduced).map(([key, val]) => {
            return (
              <div key={key}>
                <h2 className="font-bold mb-4 text-xl">{key}</h2>
                <ul className="flex flex-col gap-y-2">
                  {val.map(comment => (
                    <div className="flex gap-x-2" key={comment.id}>
                      <button
                        type="button"
                        onClick={() => {
                          deleteComment(comment.id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="min-w-[1.5rem] h-6 text-red-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                      <li>
                        <span className="font-bold">{comment.author}</span> :{' '}
                        {comment.text}
                      </li>
                    </div>
                  ))}
                </ul>
              </div>
            );
          })
        : null}
    </div>
  );
};

export { CommentOverview };
