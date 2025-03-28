let postsData = []; // Store posts globally to use when sorting

// Function to fetch all the posts from the API and display them on the page
function loadPosts() {
    var baseUrl = document.getElementById('api-base-url').value;
    if (!baseUrl) {
        alert('Please enter the API Base URL.');
        return;
    }
    localStorage.setItem('apiBaseUrl', baseUrl);  // Save the URL to local storage

    fetch(baseUrl + '/posts')
        .then(response => response.json())  // Parse the JSON data from the response
        .then(data => {
            postsData = data; // Save the fetched posts globally
            displayPosts(postsData); // Call displayPosts to show posts on the page
        })
        .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
}

// Function to display posts on the page
function displayPosts(posts) {
    const postContainer = document.getElementById('post-container');
    postContainer.innerHTML = ''; // Clear any previous posts

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.id = 'post-' + post.id;
        postDiv.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <div class="post-buttons">
                <button onclick="editPost(${post.id})">Edit</button>
                <button class="delete-button" onclick="deletePost(${post.id})">Delete</button>
            </div>
        `;
        postContainer.appendChild(postDiv);
    });
}

// Sorting function triggered by the dropdown
function sortPosts() {
    var sortOption = document.getElementById('sort-order').value;

    let sortedPosts = [...postsData]; // Copy of the posts to sort

    if (sortOption === "title") {
        sortedPosts.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title alphabetically
    } else if (sortOption === "content") {
        sortedPosts.sort((a, b) => a.content.localeCompare(b.content)); // Sort by content alphabetically
    }

    // Display sorted posts
    displayPosts(sortedPosts);
}

// Function to send a POST request to the API to add a new post
function addPost() {
    var baseUrl = document.getElementById('api-base-url').value;
    var postTitle = document.getElementById('post-title').value;
    var postContent = document.getElementById('post-content').value;

    fetch(baseUrl + '/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: postTitle, content: postContent })
    })
    .then(response => response.json())
    .then(post => {
        loadPosts(); // Reload the posts after adding a new one
    })
    .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
}

// Function to send a DELETE request to the API to delete a post
function deletePost(postId) {
    var baseUrl = document.getElementById('api-base-url').value;

    fetch(baseUrl + '/posts/' + postId, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        loadPosts(); // Reload the posts after deleting one
    })
    .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
}

// Function to send a PUT request to the API to update a post
function editPost(postId) {
    var baseUrl = document.getElementById('api-base-url').value;

    var newTitle = prompt("Enter the new title for the post:");
    var newContent = prompt("Enter the new content for the post:");

    var updatedPost = {};
    if (newTitle) updatedPost.title = newTitle;
    if (newContent) updatedPost.content = newContent;

    fetch(baseUrl + '/posts/' + postId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost)
    })
    .then(response => response.json())
    .then(post => {
        loadPosts(); // Reload the posts after updating one
    })
    .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
}

// Function to search for posts by title or content
function searchPosts() {
    var baseUrl = document.getElementById('api-base-url').value;
    var titleQuery = document.getElementById('search-title').value;
    var contentQuery = document.getElementById('search-content').value;

    fetch(baseUrl + '/posts/search?title=' + titleQuery + '&content=' + contentQuery)
        .then(response => response.json())
        .then(posts => {
            const postContainer = document.getElementById('post-container');
            postContainer.innerHTML = '';

            posts.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.className = 'post';
                postDiv.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                    <button onclick="editPost(${post.id})">Edit</button>
                    <button class="delete-button" onclick="deletePost(${post.id})">Delete</button>
                `;
                postContainer.appendChild(postDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}
