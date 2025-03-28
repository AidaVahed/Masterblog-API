from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

POSTS = [
    {"id": 1, "title": "First Post", "content": "This is the first post."},
    {"id": 2, "title": "Second Post", "content": "This is the second post."},
    {"id": 3, "title": "Flask Tutorial", "content": "This is a tutorial on Flask."},
]


@app.route('/api/posts', methods=['GET'])
def get_posts():
    sort_by = request.args.get('sort', None)  # sort field: 'title' or 'content'
    direction = request.args.get('direction', 'asc')  # 'asc' or 'desc'

    # Validate direction
    if direction not in ['asc', 'desc']:
        return jsonify({"error": "Invalid direction, use 'asc' or 'desc'."}), 400

    # Sort posts if sort parameter is provided
    if sort_by:
        if sort_by not in ['title', 'content']:
            return jsonify({"error": "Invalid sort field, use 'title' or 'content'."}), 400

        POSTS.sort(key=lambda post: post[sort_by].lower(), reverse=(direction == 'desc'))

    return jsonify(POSTS)


@app.route('/api/posts', methods=['POST'])
def add_post():
    new_post = request.get_json()

    if not new_post.get("title") or not new_post.get("content"):
        return jsonify({"error": "Title and content are required."}), 400

    new_id = max(post["id"] for post in POSTS) + 1 if POSTS else 1
    post = {
        "id": new_id,
        "title": new_post["title"],
        "content": new_post["content"]
    }
    POSTS.append(post)

    return jsonify(post), 201


@app.route('/api/posts/<int:id>', methods=['DELETE'])
def delete_post(id):
    global POSTS
    post = next((post for post in POSTS if post["id"] == id), None)

    if post is None:
        return jsonify({"error": "Post not found."}), 404

    POSTS = [p for p in POSTS if p["id"] != id]
    return jsonify({"message": f"Post with id {id} has been deleted successfully."}), 200


@app.route('/api/posts/<int:id>', methods=['PUT'])
def update_post(id):
    post = next((post for post in POSTS if post["id"] == id), None)

    if post is None:
        return jsonify({"error": "Post not found."}), 404

    updated_post = request.get_json()

    post["title"] = updated_post.get("title", post["title"])
    post["content"] = updated_post.get("content", post["content"])

    return jsonify(post), 200


@app.route('/api/posts/search', methods=['GET'])
def search_posts():
    title_query = request.args.get('title', '').lower()
    content_query = request.args.get('content', '').lower()

    filtered_posts = [
        post for post in POSTS if
        (title_query in post["title"].lower() if title_query else True) and
        (content_query in post["content"].lower() if content_query else True)
    ]

    return jsonify(filtered_posts)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002, debug=True)
