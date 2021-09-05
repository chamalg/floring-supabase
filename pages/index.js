import { useState, useEffect } from 'react';

import supabase from '../lib/supabase';

export default function Home() {

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [session, setSession] = useState(null)

  const handleLogin = async () => {
    const { error } = await supabase.auth.signIn({ email });
    console.log(error)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  }

  const fetchPosts = async () => {
    let { data: posts, error } = await
      supabase
        .from('posts')
        .select('*')
    setPosts(posts);
  }

  function handleChange(e) {
    setContent(e.target.value);
  }
  function handleEmail(e) {
    setEmail(e.target.value);
  }

  async function handleSubmit() {
    await supabase.from("posts").insert({ content, user_id: session.user.id });
    setContent('');
    fetchPosts();
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])


  return (
    <div>
      <div>
        {session ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <input type="email" value={email} onChange={handleEmail} />
            <button onClick={() => handleLogin()}>Login</button>
          </>
        )}
      </div>
      <h1>Posts by users</h1>
      {session && (
        <>
          <input type="text" value={content} onChange={handleChange} />
          <button onClick={handleSubmit}>Save</button>
        </>
      )}
      {posts.map((post, i) => <div key={post.id}> {post.content}</div>)}
    </div>
  )
}
