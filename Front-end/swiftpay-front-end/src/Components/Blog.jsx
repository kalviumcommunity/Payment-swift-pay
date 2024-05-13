import React, { useState, useEffect } from 'react';
import { db, storage,auth } from '../../Firebase/Fire.config';
import { onAuthStateChanged } from 'firebase/auth';
import { debounce } from 'lodash';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  deleteDoc,
  getDoc,
  query,
  where,
  getDocs,
  setDoc,
  runTransaction
} from 'firebase/firestore' ;
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
console.log(auth)

const BlogApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [subtopics, setSubtopics] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  
  const handleSubtopicChange = (index, field, value) => {
    const updatedSubtopics = [...subtopics];
    updatedSubtopics[index][field] = value;
    setSubtopics(updatedSubtopics);
  };
  const addSubtopic = () => {
    setSubtopics([...subtopics, { title: '', content: '', image: null }]);
  };
  
  // Function to remove a subtopic
  const removeSubtopic = (index) => {
    const updatedSubtopics = subtopics.filter((_, i) => i !== index);
    setSubtopics(updatedSubtopics);
  };
  // Fetch posts on initial load
  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, 'posts');
      onSnapshot(postsCollection, (snapshot) => {
        const postsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsList);
      });
    };

    fetchPosts();
  }, []);

  // Fetch comments for current post
  useEffect(() => {
    if (currentPost) {
      const fetchComments = async () => {
        const commentsCollection = collection(db, 'posts', currentPost.id, 'comments');
        onSnapshot(commentsCollection, (snapshot) => {
          const commentsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setComments(commentsList);
        });
      };

      fetchComments();
    }
  }, [currentPost]);

  // Handle navigation to home page
  const navigateToHomePage = () => {
    setCurrentPage('home');
    setCurrentPost(null);
    setEditingPost(null);
  };

  // Handle navigation to single post page
  const navigateToPostPage = async (postId) => {
    incrementViews(postId);
    const post = posts.find((p) => p.id === postId);
    setCurrentPost(post);
    setCurrentPage('post');
  };

  // Handle navigation to create post page
  const navigateToCreatePostPage = () => {
    setCurrentPage('create');
  };

  // Handle post submission or editing
  const handlePostSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = null;

    // If an image is selected, upload it to Firebase Storage
    if (newPostImage) {
      const storageRef = ref(storage, `posts/${Date.now()}_${newPostImage.name}`);
      await uploadBytes(storageRef, newPostImage);
      imageUrl = await getDownloadURL(storageRef);
    }

    if (editingPost) {
      // Update existing post
      const postDoc = doc(db, 'posts', editingPost.id);
      const updatedPost = {
        title: newPostTitle || editingPost.title,
        content: newPostContent || editingPost.content,
        imageUrl: imageUrl || editingPost.imageUrl,
        ...editingPost
      };
      await updateDoc(postDoc, updatedPost);
      setPosts(posts.map((p) => (p.id === editingPost.id ? updatedPost : p)));
      setEditingPost(null);
      navigateToHomePage();
    } else {
      // Create new post
      const newPost = {
        title: newPostTitle,
        content: newPostContent,
        likes: 0,
        dislikes: 0,
        views: 0,
        createdAt: new Date().toISOString(),
        imageUrl,
      };

      await addDoc(collection(db, 'posts'), newPost);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostImage(null);
      navigateToHomePage();
    }
  };

  // Handle editing a post
  const handleEditPost = (post) => {
    // Check if the current user is the author of the post
    if (currentUser && currentUser.email === post.authorEmail) {
      // If the user is the author, allow editing
      setNewPostTitle(post.title);
      setNewPostContent(post.content);
      setNewPostImage(post.imageUrl);
      setEditingPost(post);
      navigateToCreatePostPage();
    } else {
      // If the user is not the author, display an error message
      toast.warning("You are not authorized to edit this post.");
    }
  };
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  // Handle like and dislike updates
  const handleLike = debounce(async (postId) => {
    const user = auth.currentUser;
    if (!user) {
      console.log("User must be logged in to like a post");
      return;
    }
  
    const interactionsDoc = doc(db, 'postInteractions', postId);
    const likesCollection = collection(interactionsDoc, 'likes');
  
    const userIdentifier = user.displayName || user.email;
  
    // Check if the user has already liked the post
    const likeQuery = query(likesCollection, where('user', '==', userIdentifier));
    const likeSnapshot = await getDocs(likeQuery);
  
    if (!likeSnapshot.empty) {
      // User has already liked the post, so remove the like
      const likeDoc = likeSnapshot.docs[0];
      await deleteDoc(likeDoc.ref);
    } else {
      // User has not liked the post, so add a new like
      await addDoc(likesCollection, {
        user: userIdentifier,
        timestamp: new Date().toISOString(),
      });
    }
  
    // Update the likes count in the posts collection
    const postDoc = doc(db, 'posts', postId);
    const postSnapshot = await getDoc(postDoc);
    if (postSnapshot.exists()) {
      const postData = postSnapshot.data();
      const likesCount = likeSnapshot.empty ? postData.likes + 1 : postData.likes - 1;
      await updateDoc(postDoc, { likes: likesCount });
      // Update the local state
      setPosts(posts.map((p) => (p.id === postId ? { ...p, likes: likesCount } : p)));
    }
  }, 300);
  
  const handleDislike = debounce(async (postId) => {
    const user = auth.currentUser;
    if (!user) {
      console.log("User must be logged in to dislike a post");
      return;
    }
  
    const interactionsDoc = doc(db, 'postInteractions', postId);
    const dislikesCollection = collection(interactionsDoc, 'dislikes');
  
    const userIdentifier = user.displayName || user.email;
  
    // Check if the user has already disliked the post
    const dislikeQuery = query(dislikesCollection, where('user', '==', userIdentifier));
    const dislikeSnapshot = await getDocs(dislikeQuery);
  
    if (!dislikeSnapshot.empty) {
      // User has already disliked the post, so remove the dislike
      const dislikeDoc = dislikeSnapshot.docs[0];
      await deleteDoc(dislikeDoc.ref);
    } else {
      // User has not disliked the post, so add a new dislike
      await addDoc(dislikesCollection, {
        user: userIdentifier,
        timestamp: new Date().toISOString(),
      });
    }
  
    // Update the dislikes count in the posts collection
    const postDoc = doc(db, 'posts', postId);
    const postSnapshot = await getDoc(postDoc);
    if (postSnapshot.exists()) {
      const postData = postSnapshot.data();
      const dislikesCount = dislikeSnapshot.empty ? postData.dislikes + 1 : postData.dislikes - 1;
      await updateDoc(postDoc, { dislikes: dislikesCount });
      // Update the local state
      setPosts(posts.map((p) => (p.id === postId ? { ...p, dislikes: dislikesCount } : p)));
    }
  }, 300);
  
  



// Increment views count
const incrementViews = async (postId) => {
  const user = auth.currentUser;
  if (!user) {
    console.log("User must be logged in to increment views.");
    return;
  }

  // Use username or email for authentication
  const userIdentifier = user.displayName || user.email;

  const viewedPostsCollection = collection(db, 'viewedPosts');
  const viewedPostDoc = doc(viewedPostsCollection, `${userIdentifier}_${postId}`);

  const viewedPostSnapshot = await getDoc(viewedPostDoc);

  if (!viewedPostSnapshot.exists()) {
    // If the user has not viewed the post yet, increment views
    const postDoc = doc(db, 'posts', postId);
    const postSnapshot = await getDoc(postDoc);

    if (postSnapshot.exists()) {
      const postData = postSnapshot.data();
      const updatedViews = postData.views + 1;
      await updateDoc(postDoc, { views: updatedViews });

      // Add the post to the viewedPosts collection to track that the user has viewed it
      await setDoc(viewedPostDoc, { viewed: true });

      // Update the local state
      setPosts(posts.map((p) => (p.id === postId ? { ...p, views: updatedViews } : p)));
    }
  }
};


  // Handle comment submission or editing
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (editingComment) {
      // Update existing comment
      const commentDoc = doc(db, 'posts', currentPost.id, 'comments', editingComment.id);
      await updateDoc(commentDoc, { content: newCommentContent });
      setComments(comments.map((comment) => (comment.id === editingComment.id ? { ...comment, content: newCommentContent } : comment)));
      setEditingComment(null);
      setNewCommentContent('');
    } else {
      // Create new comment
      const newComment = {
        content: newCommentContent,
        createdAt: new Date().toISOString(),
      };
      const commentsCollection = collection(db, 'posts', currentPost.id, 'comments');
      await addDoc(commentsCollection, newComment);
      setNewCommentContent('');
    }
  };

  // Handle editing a comment
  const handleEditComment = (comment) => {
    setNewCommentContent(comment.content);
    setEditingComment(comment);
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    const commentDoc = doc(db, 'posts', currentPost.id, 'comments', commentId);
    await deleteDoc(commentDoc);
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    const user = auth.currentUser;
    if (!user) {
      console.log("User must be logged in to delete a post.");
      return;
    }
  
    // Check if the logged-in user's username or email matches the author's username or email of the post
    const postToDelete = posts.find((post) => post.id === postId);
    if (!postToDelete) {
      console.log("Post not found.");
      return;
    }
  
    if (postToDelete.authorUsername !== user.displayName && postToDelete.authorEmail !== user.email) {
      console.log("Only the author of the post can delete it.");
      return;
    }
  
    // If the logged-in user is the author, proceed with deletion
    const postDoc = doc(db, 'posts', postId);
    await deleteDoc(postDoc);
  
    // Fetch the updated list of posts from the database
    const updatedPostsCollection = collection(db, 'posts');
    const updatedPostsSnapshot = await getDocs(updatedPostsCollection);
    const updatedPostsList = updatedPostsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(updatedPostsList);
  
    if (currentPost && currentPost.id === postId) {
      navigateToHomePage();
    }
  };
  
  
  
  // Handle post sharing
  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href,
      })
      .then(() => console.log('Post shared successfully!'))
      .catch((error) => console.error('Error sharing post:', error));
    } else {
      console.log('Web Share API is not supported in your browser.');
    }
  };

  // Render Home Page
  const renderHomePage = () => (
    <div className="mx-auto px-4">
      <nav className="sticky top-0 bg-white p-4 shadow-md flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-500">Financial Blog</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          onClick={navigateToCreatePostPage}
        >
          Create New Post
        </button>
      </nav>
  
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">All Blogs</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 flex justify-between items-center"
            onClick={() => navigateToPostPage(post.id)}
          >
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.content.split('\n')[0]}</p>
              <div className="flex space-x-4 mb-2">
                <button
                  className="text-green-600 hover:text-green-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(post.id);
                  }}
                >
                  👍 {post.likes}
                </button>
                <button
                  className="text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDislike(post.id);
                  }}
                >
                  👎 {post.dislikes}
                </button>
                <button
                  className="text-blue-600 hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(post);
                  }}
                >
                  Share
                </button>
              </div>
              <div className="text-gray-500">
                <span>Views: {post.views}</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-4">
                  <button
                    className="text-yellow-600 hover:text-yellow-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditPost(post);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePost(post.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            {post.imageUrl && (
              <div className="ml-6">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-32 h-32 rounded-md object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  

  // Render Create Post Page
  const renderCreatePostPage = () => (
    <div className="mx-auto px-4 py-6">
  <nav className="sticky top-0 bg-white shadow-lg p-6 rounded-b-lg flex justify-between items-center mb-8">
    <h1 className="text-2xl font-bold text-blue-600">Financial Blog</h1>
    <button
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition ease-in-out duration-300"
      onClick={navigateToHomePage}
    >
      Cancel
    </button>
  </nav>

  <h2 className="text-4xl font-semibold text-gray-800 mb-8">
    {editingPost ? 'Edit Post' : 'Create New Post'}
  </h2>
  <form onSubmit={handlePostSubmit}>
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postTitle">
        Title:
      </label>
      <input
        type="text"
        id="postTitle"
        value={newPostTitle}
        onChange={(e) => setNewPostTitle(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition ease-in-out duration-300 bg-gray-50 text-gray-900 shadow-sm"
        required
      />
    </div>

    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postContent">
        Content:
      </label>
      <textarea
        id="postContent"
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition ease-in-out duration-300 bg-gray-50 text-gray-900 shadow-sm"
        required
      ></textarea>
    </div>

    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postImage">
        Image:
      </label>
      <input
        type="file"
        id="postImage"
        onChange={(e) => setNewPostImage(e.target.files[0])}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition ease-in-out duration-300 bg-gray-50 text-gray-900 shadow-sm"
        accept="image/*"
      />
    </div>

    <button
      type="submit"
      className="bg-blue-500 text-white font-medium px-5 py-3 rounded-md shadow-md hover:bg-blue-600 transition ease-in-out duration-300 hover:shadow-lg"
    >
      {editingPost ? 'Save Changes' : 'Create Post'}
    </button>
  </form>
</div>

  );

  // Render Single Post Page
  const renderPostPage = () => (
    <div className="mx-auto px-4">
      <nav className="sticky top-0 bg-white p-4 shadow-md flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Financial Blog</h1>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
          onClick={navigateToHomePage}
        >
          Back to Home
        </button>
      </nav>

      <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">{currentPost.title}</h3>
        <p className="text-gray-600 mb-4">{currentPost.content}</p>
        {currentPost.imageUrl && (
          <div className="mb-4">
            <img src={currentPost.imageUrl} alt={currentPost.title} className="w-full rounded-md" />
          </div>
        )}
        <div className="flex space-x-4 mb-2">
          <button
            className="text-green-600 hover:text-green-700"
            onClick={(e) => {
              e.stopPropagation();
              handleLike(currentPost.id);
            }}
          >
            👍 {currentPost.likes}
          </button>
          <button
            className="text-red-600 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              handleDislike(currentPost.id);
            }}
          >
            👎 {currentPost.dislikes}
          </button>
          <button
            className="text-blue-600 hover:text-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              handleShare(currentPost);
            }}
          >
            Share
          </button>
        </div>
        <div className="text-gray-500">
          <span>Views: {currentPost.views}</span>
        </div>
      </div>

      <h4 className="text-xl font-semibold text-gray-800 mt-8">Comments</h4>
      <div className="mt-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
            <div>
              {editingComment && editingComment.id === comment.id ? (
                <div>
                  <textarea
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  ></textarea>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-2"
                    onClick={handleCommentSubmit}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 mt-2 ml-2"
                    onClick={() => {
                      setEditingComment(null);
                      setNewCommentContent('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600">{comment.content}</p>
                  <div className="flex justify-between items-center mt-2">
                    <button
                      className="text-yellow-600 hover:text-yellow-700"
                      onClick={() => handleEditComment(comment)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleCommentSubmit} className="mt-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="commentContent">
            Add a Comment:
          </label>
          <textarea
            id="commentContent"
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            className="w-full px-10 py-10 border rounded-md focus:outline-none focus:border-blue-500"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          {editingComment ? 'Save Changes' : 'Add Comment'}
        </button>
      </form>
    </div>
  );

  // Render based on current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return renderHomePage();
      case 'create':
        return renderCreatePostPage();
      case 'post':
        return renderPostPage();
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto">
      {renderCurrentPage()}
    </div>
  );
};

export default BlogApp;
