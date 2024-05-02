import { QueryClient, useQuery } from "@tanstack/react-query";

const queryClient = new QueryClient();

type ViewCountProps = {
  url: string;
  className: string;
};

const ViewCount = ({ url, className }: ViewCountProps) => {
  const { data, isLoading } = useQuery(
    {
      queryKey: ["viewCount", url],
      queryFn: async () => {
        const response = await fetch(`/api/view-count?url=${url}`);
        const data = await response.json();
        return data;
      },
    },
    queryClient,
  );
  return (
    <div className={className}>
      View count:{" "}
      {isLoading ? (
        <span className="animate-loading h-[19.5px] inline-block w-12 rounded-sm" />
      ) : (
        <span className="font-bold">{data.count}</span>
      )}
    </div>
  );
};

export default ViewCount;
