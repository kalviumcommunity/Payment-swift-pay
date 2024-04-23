import React, { useState, useEffect } from 'react';
import { db,storage} from '../../Firebase/Fire.config';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);

    // Load posts from Firestore
    useEffect(() => {
        const loadPosts = async () => {
            const postsCollection = collection(db, 'posts');
            const postsSnapshot = await getDocs(postsCollection);
            const postsList = postsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(postsList);
        };
        loadPosts();
    }, []);

    // Handle creating a new blog post
    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = '';
            if (imageFile) {
                // Upload image to Firebase Storage
                const storageRef = ref(storage, `images/${imageFile.name}`);
                const uploadTask = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }

            // Add new post to Firestore
            const postsCollection = collection(db, 'posts');
            const newPost = {
                title,
                content,
                imageUrl,
                createdAt: new Date(),
            };
            await addDoc(postsCollection, newPost);

            // Clear input fields and reload posts
            setTitle('');
            setContent('');
            setImageFile(null);
            const postsSnapshot = await getDocs(postsCollection);
            const postsList = postsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(postsList);
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post');
        }
    };

    return (
        <div>
            <h1>Blog</h1>
            <form onSubmit={handleCreatePost}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                />
                <button type="submit">Create Post</button>
            </form>

            <div>
                <h2>Posts</h2>
                {posts.map((post) => (
                    <div key={post.id}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        {post.imageUrl && <img src={post.imageUrl} alt={post.title} style={{ width: '100%' }} />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blog;
