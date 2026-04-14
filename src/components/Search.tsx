import React from "react";
// Include only the reset
import "instantsearch.css/themes/reset.css";
// or include the full Satellite theme
import "instantsearch.css/themes/satellite.css";

import { liteClient as algoliasearch, type Hit } from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits, Snippet } from "react-instantsearch";

function isConfigured(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function Hit({ hit }: { hit: Hit }) {
  return (
    <a href={`/${hit.objectID}`} className="hit">
      <p className="hit-title font-semibold text-[length:inherit] leading-snug m-0">
        {hit.title as string}
      </p>
      {/* @ts-expect-error Algolia types seem incorrect */}
      <Snippet attribute="content" hit={hit} />
    </a>
  );
}

function SearchUnavailable() {
  return (
    <div
      className="mx-auto max-w-lg rounded-2xl border border-primary/25 bg-primary/5 p-6 text-fg"
      role="status"
    >
      <p className="text-lg font-semibold">Search isn’t available</p>
      <p className="mt-2 text-sm leading-relaxed text-fg-subtle">
        Site search is not configured for this build. Try again later, or
        contact the site owner if this persists.
      </p>
      {import.meta.env.DEV ? (
        <p className="mt-4 text-sm leading-relaxed text-fg-subtle">
          For local development, set{" "}
          <code className="rounded bg-primary/15 px-1.5 py-0.5 text-fg">
            PUBLIC_ALGOLIA_APP_ID
          </code>
          ,{" "}
          <code className="rounded bg-primary/15 px-1.5 py-0.5 text-fg">
            PUBLIC_ALGOLIA_SEARCH_KEY
          </code>
          , and{" "}
          <code className="rounded bg-primary/15 px-1.5 py-0.5 text-fg">
            PUBLIC_ALGOLIA_INDEX_NAME
          </code>{" "}
          in your environment.
        </p>
      ) : null}
    </div>
  );
}

export default function AlgoliaSearch() {
  const appId = import.meta.env.PUBLIC_ALGOLIA_APP_ID;
  const searchKey = import.meta.env.PUBLIC_ALGOLIA_SEARCH_KEY;
  const indexName = import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME;

  if (
    !isConfigured(appId) ||
    !isConfigured(searchKey) ||
    !isConfigured(indexName)
  ) {
    return <SearchUnavailable />;
  }

  const searchClient = algoliasearch(appId, searchKey);

  return (
    <InstantSearch searchClient={searchClient} indexName={indexName}>
      <SearchBox placeholder="Search through my site" />
      <Hits hitComponent={Hit} />
    </InstantSearch>
  );
}
