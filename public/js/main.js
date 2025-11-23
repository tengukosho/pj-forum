// Load categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const categories = await response.json();

        const container = document.getElementById('categories-container');
        
        if (categories.length === 0) {
            container.innerHTML = '<p>No categories yet. Admin can create one!</p>';
            return;
        }

        container.innerHTML = categories.map(category => `
            <div class="category-item">
                <h3><a href="/category/${category.id}">${category.name}</a></h3>
                <p>${category.description || 'No description'}</p>
                <div class="category-stats">
                    <span>📝 ${category.topic_count || 0} topics</span>
                    <span>💬 ${category.post_count || 0} posts</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading categories:', error);
        document.getElementById('categories-container').innerHTML = '<p>Error loading categories</p>';
    }
}

// Category modal
const modal = document.getElementById('category-modal');
const createCategoryBtn = document.getElementById('create-category-btn');
const closeBtn = document.querySelector('.close');

if (createCategoryBtn) {
    createCategoryBtn.addEventListener('click', () => {
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

// Create category form
document.getElementById('category-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('category-name').value;
    const description = document.getElementById('category-description').value;
    const display_order = document.getElementById('category-order').value;

    try {
        const response = await fetchWithAuth(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, display_order })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Category created successfully!');
            modal.style.display = 'none';
            document.getElementById('category-form').reset();
            loadCategories();
        } else {
            alert(data.error || 'Failed to create category');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
});

// Load categories on page load
document.addEventListener('DOMContentLoaded', loadCategories);
