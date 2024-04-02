import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";

type ViewCountInnerProps = {
  url: string;
};

const ViewCountInner = ({ url }: ViewCountInnerProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["viewCount", url],
    queryFn: async () => {
      const response = await fetch(`/api/view-count?url=${url}`);
      const data = await response.json();
      return data;
    },
  });
  return (
    <>
      View count:{" "}
      {isLoading ? (
        <span className="animate-loading h-[19.5px] inline-block w-12 rounded-sm" />
      ) : (
        <span className="font-bold">{data.count}</span>
      )}
    </>
  );
};

type ViewCountProps = {
  url: string;
  className?: string;
};

const ViewCount = ({ url, className }: ViewCountProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className={className}>
        <ViewCountInner url={url} />
      </div>
    </QueryClientProvider>
  );
};

export default ViewCount;
