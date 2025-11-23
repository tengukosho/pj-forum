// Get category ID from URL
const categoryId = window.location.pathname.split('/').pop();

// Load category and its topics
async function loadCategory() {
    try {
        const response = await fetch(`${API_URL}/categories/${categoryId}`);
        
        if (!response.ok) {
            throw new Error('Category not found');
        }

        const category = await response.json();

        // Update page title and header
        document.getElementById('category-name').textContent = category.name;
        document.getElementById('category-title').textContent = category.name;
        document.getElementById('category-description').textContent = category.description || '';
        document.title = `${category.name} - Forum`;

        // Display topics
        const container = document.getElementById('topics-container');
        
        if (category.topics.length === 0) {
            container.innerHTML = '<p>No topics yet. Be the first to create one!</p>';
            return;
        }

        container.innerHTML = category.topics.map(topic => {
            const badges = [];
            if (topic.is_pinned) badges.push('<span class="pinned-badge">📌 Pinned</span>');
            if (topic.is_locked) badges.push('<span class="locked-badge">🔒 Locked</span>');

            return `
                <div class="topic-item">
                    <h3>
                        ${badges.join('')}
                        <a href="/topic/${topic.id}">${topic.title}</a>
                    </h3>
                    <div class="topic-meta">
                        <span>👤 ${topic.username}</span>
                        <span>💬 ${topic.reply_count || 0} replies</span>
                        <span>👁️ ${topic.view_count || 0} views</span>
                        <span>🕒 ${new Date(topic.created_at).toLocaleString()}</span>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading category:', error);
        document.getElementById('topics-container').innerHTML = '<p>Error loading category</p>';
    }
}

// Topic modal
const modal = document.getElementById('topic-modal');
const createTopicBtn = document.getElementById('create-topic-btn');
const closeBtn = document.querySelector('.close');

if (createTopicBtn) {
    createTopicBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Create topic form
document.getElementById('topic-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('topic-title').value;
    const content = document.getElementById('topic-content').value;

    try {
        const response = await fetchWithAuth(`${API_URL}/topics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                title, 
                content, 
                category_id: parseInt(categoryId) 
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Topic created successfully!');
            window.location.href = `/topic/${data.topicId}`;
        } else {
            if (data.errors) {
                alert(data.errors.map(e => e.msg).join(', '));
            } else {
                alert(data.error || 'Failed to create topic');
            }
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
});

// Load category on page load
document.addEventListener('DOMContentLoaded', loadCategory);
