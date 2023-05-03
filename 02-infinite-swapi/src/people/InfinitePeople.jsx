import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroller'

import { Person } from './Person'

const initialUrl = 'https://swapi.dev/api/people/'
const fetchUrl = async (url) => {
  const response = await fetch(url)
  return response.json()
}

export function InfinitePeople() {
  // We're not using is Fetching beacuse isLoading is like a descendant of isFetching
  // This means that, if we check the isFetching, it will always go to the top
  // displaying "Loading..."
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isError, error } = useInfiniteQuery(
    ['sw-people'], // key
    ({ pageParam = initialUrl }) => fetchUrl(pageParam), // Query function
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined // From the json data. Is the url to get the next page. If lastPage.next is falsy, will be undefined (do not execute nothing)
    }
  )

  if (isLoading) return <div className='loading'>Loading...</div>
  if (isError) return <div>Error! {error.toString()}</div>

  return (
    <>
      {isFetching && <div className='loading'>Loading...</div>}
      <InfiniteScroll
        loadMore={fetchNextPage}
        hasMore={hasNextPage} 
      >
        {data.pages.map(pageData => {
          return pageData.results.map(person => (
            <Person
              key={person.name}
              eyeColor={person.eye_color}
              hairColor={person.hair_color}
              name={person.name}
            />
          ))
        })}
      </InfiniteScroll>
    </>
  )
}
