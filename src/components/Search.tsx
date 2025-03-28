import React from "react";
// Include only the reset
import "instantsearch.css/themes/reset.css";
// or include the full Satellite theme
import "instantsearch.css/themes/satellite.css";

import { liteClient as algoliasearch, type Hit } from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits, Snippet } from "react-instantsearch";

const searchClient = algoliasearch(
  import.meta.env.PUBLIC_ALGOLIA_APP_ID,
  import.meta.env.PUBLIC_ALGOLIA_SEARCH_KEY,
);

function Hit({ hit }: { hit: Hit }) {
  return (
    <a href={`/${hit.objectID}`} className="hit">
      <h3>{hit.title as string}</h3>
      {/* @ts-expect-error Algolia types seem incorrect */}
      <Snippet attribute="content" hit={hit} />
    </a>
  );
}

export default function AlgoliaSearch() {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME}
    >
      <SearchBox placeholder="Search through my site" />
      <Hits hitComponent={Hit} />
    </InstantSearch>
  );
}
