import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "@tanstack/react-query";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isError, error } = useInfiniteQuery(
    ['sw-species'],
    ({pageParam = initialUrl}) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined
    }
  )

  if (isLoading) return <div className='loading'>Loading...</div>
  if (isError) return <div>Error! {error.toString()}</div>
  console.log(data)
  return (
    <>
      <InfiniteScroll
        loadMore={fetchNextPage}
        hasMore={hasNextPage}
      >
        {data.pages.map(pageData => {
          return pageData.results.map(specie => (
            <Species
              key={specie.name}
              averageLifespan={specie.average_lifespan}
              language={specie.language}
              name={specie.name}
            />
          ))
        })}
      </InfiniteScroll>
    </>
  )
}
