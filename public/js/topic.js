// Get topic ID from URL
const topicId = window.location.pathname.split('/').pop();

let currentTopic = null;

// Load topic and its posts
async function loadTopic() {
    try {
        const response = await fetch(`${API_URL}/topics/${topicId}`);
        
        if (!response.ok) {
            throw new Error('Topic not found');
        }

        currentTopic = await response.json();

        // Update page elements
        document.getElementById('topic-name').textContent = currentTopic.title;
        document.getElementById('topic-title').textContent = currentTopic.title;
        document.title = `${currentTopic.title} - Forum`;

        // Update breadcrumb
        const categoryLink = document.getElementById('category-link');
        categoryLink.textContent = currentTopic.category_name;
        categoryLink.href = `/category/${currentTopic.category_id}`;

        // Update topic meta
        document.getElementById('topic-author').textContent = `By ${currentTopic.username}`;
        document.getElementById('topic-created').textContent = new Date(currentTopic.created_at).toLocaleString();
        document.getElementById('topic-views').textContent = `${currentTopic.view_count} views`;

        // Display posts
        const container = document.getElementById('posts-container');
        
        if (currentTopic.posts.length === 0) {
            container.innerHTML = '<p>No posts yet.</p>';
            return;
        }

        container.innerHTML = currentTopic.posts.map((post, index) => {
            const isFirstPost = index === 0;
            const roleBadge = post.role !== 'user' ? `<span class="role-badge">${post.role}</span>` : '';

            return `
                <div class="post" data-post-id="${post.id}">
                    <div class="post-header">
                        <div>
                            <span class="post-author">${post.username}${roleBadge}</span>
                        </div>
                        <span class="post-date">${new Date(post.created_at).toLocaleString()}</span>
                    </div>
                    <div class="post-content">${post.content}</div>
                    ${canEditPost(post) ? `
                        <div class="post-actions">
                            <button onclick="editPost(${post.id})">Edit</button>
                            ${!isFirstPost ? `<button onclick="deletePost(${post.id})">Delete</button>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        // Update topic actions for moderators
        updateTopicActions();
    } catch (error) {
        console.error('Error loading topic:', error);
        document.getElementById('posts-container').innerHTML = '<p>Error loading topic</p>';
    }
}

function canEditPost(post) {
    const user = getUser();
    if (!user) return false;
    return user.id === post.user_id || user.role === 'moderator' || user.role === 'admin';
}

function updateTopicActions() {
    const user = getUser();
    if (!user || (user.role !== 'moderator' && user.role !== 'admin')) return;

    const pinBtn = document.getElementById('pin-topic-btn');
    const lockBtn = document.getElementById('lock-topic-btn');

    if (pinBtn) {
        pinBtn.textContent = currentTopic.is_pinned ? 'Unpin' : 'Pin';
    }
    if (lockBtn) {
        lockBtn.textContent = currentTopic.is_locked ? 'Unlock' : 'Lock';
    }
}

// Reply form
document.getElementById('reply-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const content = document.getElementById('reply-content').value;

    try {
        const response = await fetchWithAuth(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                topic_id: parseInt(topicId), 
                content 
            })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('reply-content').value = '';
            loadTopic(); // Reload to show new post
        } else {
            if (data.errors) {
                alert(data.errors.map(e => e.msg).join(', '));
            } else {
                alert(data.error || 'Failed to create reply');
            }
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
});

// Pin/Unpin topic
document.getElementById('pin-topic-btn')?.addEventListener('click', async () => {
    try {
        const response = await fetchWithAuth(`${API_URL}/topics/${topicId}/pin`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_pinned: !currentTopic.is_pinned })
        });

        if (response.ok) {
            loadTopic(); // Reload topic
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to update topic');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
});

// Lock/Unlock topic
document.getElementById('lock-topic-btn')?.addEventListener('click', async () => {
    try {
        const response = await fetchWithAuth(`${API_URL}/topics/${topicId}/lock`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_locked: !currentTopic.is_locked })
        });

        if (response.ok) {
            loadTopic(); // Reload topic
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to update topic');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
});

// Delete topic
document.getElementById('delete-topic-btn')?.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to delete this topic? This cannot be undone.')) {
        return;
    }

    try {
        const response = await fetchWithAuth(`${API_URL}/topics/${topicId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Topic deleted');
            window.location.href = `/category/${currentTopic.category_id}`;
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to delete topic');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
});

// Edit post
async function editPost(postId) {
    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    const contentElement = postElement.querySelector('.post-content');
    const currentContent = contentElement.textContent;

    const newContent = prompt('Edit post:', currentContent);
    if (!newContent || newContent === currentContent) return;

    try {
        const response = await fetchWithAuth(`${API_URL}/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: newContent })
        });

        if (response.ok) {
            loadTopic(); // Reload to show updated post
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to edit post');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
}

// Delete post
async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
        const response = await fetchWithAuth(`${API_URL}/posts/${postId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadTopic(); // Reload to remove deleted post
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to delete post');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
}

// Load topic on page load
document.addEventListener('DOMContentLoaded', loadTopic);
