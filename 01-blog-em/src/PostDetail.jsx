import { useQuery, useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'

async function fetchComments(postId) {
  const response = await fetch(
    // `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
    `https://dummyjson.com/posts/${postId}/comments`
  )
  const jsonResponse = await response.json()
  return jsonResponse.comments
}

async function deletePost(postId) {
  // const response = await fetch(`https://jsonplaceholder.typicode.com/postId/${postId}`, {
  const response = await fetch(`https://dummyjson.com/posts/${postId}`, {
    method: 'DELETE'
  })
  return response.json()
}

async function updatePost(postId) {
  // const response = await fetch(`https://jsonplaceholder.typicode.com/postId/${postId}`, {
  const response = await fetch(`https://dummyjson.com/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: 'REACT QUERY FOREVER!!!!' })
  })
  return response.json()
}

export function PostDetail({ post }) {

  useEffect(() => {
    deleteMutation.reset()
    updateMutation.reset()
    // can't include updateMutation and deleteMutation in the dependencies
    // because the function updates them -- so there would be an infinite loop!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id])
  

  // replace with useQuery
  const {
    data,
    error: commentsError,
    isError: isCommentsError,
    isLoading: isCommentsLoading
  } = useQuery(['comments', post.id], () => fetchComments(post.id))

  const deleteMutation = useMutation((postId) => deletePost(postId))
  const updateMutation = useMutation((postId) => updatePost(postId))

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>

      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isError && <p style={{ color: 'red' }}>Error deleting the post</p>}
      {deleteMutation.isLoading && <p style={{ color: 'purple' }}>Deleting the post</p>}
      {deleteMutation.isSuccess && <p style={{ color: 'green' }}>Post has (not) been deleted</p>}
      
      <button onClick={() => updateMutation.mutate(post.id)}>Update title</button>
      {updateMutation.isError && <p style={{ color: 'red' }}>Error updating the post</p>}
      {updateMutation.isLoading && <p style={{ color: 'purple' }}>Updating the post</p>}
      {updateMutation.isSuccess && <p style={{ color: 'green' }}>Post has (not) been updated</p>}
      
      <p>{post.body}</p>
      
      <h4>Comments</h4>
      {isCommentsLoading && <h3>Loading comments...</h3>}
      {isCommentsError && (
        <>
          <h3>There was an error getting the comments</h3>
          <p>{commentsError.toString()}</p>
        </>
      )}
      {!isCommentsLoading &&
        !isCommentsError &&
        data.map((comment) => (
          <li key={comment.id}>
            {comment.user.username}: {comment.body}
          </li>
        ))}
    </>
  )
}
