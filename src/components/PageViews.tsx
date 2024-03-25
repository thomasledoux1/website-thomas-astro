import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { Fragment, useState } from "react";
import UrlChart from "./UrlChart";
import ViewChart from "./ViewChart";

const PageViewsInner = () => {
  const [mode, setMode] = useState("page-views");
  const [searchLocalState, setSearchLocalState] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState("all-time");
  const { data, isLoading } = useQuery({
    queryKey: ["pageViews", search, mode, page, dateRange],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetch(
        `/api/page-views?mode=${mode}&search=${search}&page=${page}&date-range=${dateRange}`,
      );
      const data = await response.json();
      return data;
    },
  });
  const paginationButtonClasses = "border p-2 rounded-md my-2 border-black";
  const paginationButtonClassesDisabled =
    "border p-2 my-2 rounded-md cursor-not-allowed text-gray-300 border-gray-300";
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  return isLoading ? (
    "loading..."
  ) : (
    <Fragment>
      <p className="mb-2">
        Total views on all pages: <b>{data.totalViews}</b>
      </p>
      <div className="flex mb-4">
        <button
          className={`text-sm py-2 px-4 rounded-l-md font-semibold ${
            mode === "page-views"
              ? "bg-secondary text-white"
              : "border-secondary border-2 text-secondary"
          }`}
          onClick={() => {
            setMode("page-views");
            setSearch("");
          }}
        >
          Page views
        </button>
        <button
          className={`py-2 px-4 rounded-r-md font-semibold text-sm ${
            mode === "per-url"
              ? "bg-secondary text-white"
              : "border-secondary border-2 text-secondary"
          }`}
          onClick={() => setMode("per-url")}
        >
          Per URL
        </button>
      </div>
      <form
        id="date-range-form"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(searchLocalState);
        }}
      >
        {mode === "per-url" ? (
          <>
            <input
              type="search"
              id="search"
              name="search"
              className="p-1 border border-black"
              placeholder="Search for a URL"
              value={searchLocalState}
              onChange={(e) => setSearchLocalState(e.currentTarget.value)}
            />
            <button type="submit">Submit</button>
            <br />
          </>
        ) : null}
        <span>Period:</span>{" "}
        <select
          className="border-black border p-1 my-2"
          name="date-range"
          id="date-range"
          value={dateRange}
          onChange={(e) => setDateRange(e.currentTarget.value)}
        >
          <option value="all-time">All time</option>
          <option value="past-day">Past day</option>
          <option value="past-week">Past week</option>
          <option value="past-month">Past month</option>
          <option value="past-year">Past year</option>
        </select>
      </form>
      {data.viewsPerUrl ? (
        <UrlChart data={data.viewsPerUrl} />
      ) : data.pageViews ? (
        <ViewChart data={data.pageViews.rows} />
      ) : null}
      {data.totalPages && data.totalPages > 1 ? (
        <div className="flex gap-x-4 items-center">
          {offset === 0 ? (
            <>
              <span className={paginationButtonClassesDisabled}>First</span>
              <span className={paginationButtonClassesDisabled}>Previous</span>
            </>
          ) : (
            <>
              <button
                className={paginationButtonClasses}
                onClick={() => setPage(1)}
              >
                First
              </button>
              <button
                className={paginationButtonClasses}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
            </>
          )}
          <span>{page}</span>
          {page === data.totalPages ? (
            <>
              <span className={paginationButtonClassesDisabled}>Next</span>
              <span className={paginationButtonClassesDisabled}>Last</span>
            </>
          ) : (
            <>
              <button
                className={paginationButtonClasses}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
              <a
                className={paginationButtonClasses}
                onClick={() => setPage(data.totalPages)}
              >
                Last
              </a>
            </>
          )}
        </div>
      ) : null}
    </Fragment>
  );
};

const PageViews = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <PageViewsInner />
    </QueryClientProvider>
  );
};

export default PageViews;
