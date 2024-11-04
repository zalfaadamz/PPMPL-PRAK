from flask import Flask, jsonify, request

app = Flask(__name__)

books = [
    {"id": 1, "title": "Buku Satu", "author": "Penulis A", "year": 2020},
    {"id": 2, "title": "Buku Dua", "author": "Penulis B", "year": 2021},
]

# Mendapatkan semua buku
@app.route('/books', methods=['GET'])
def get_books():
    return jsonify(books)

# Mendapatkan buku berdasarkan ID
@app.route('/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = next((b for b in books if b["id"] == book_id), None)
    if book:
        return jsonify(book)
    return jsonify({"error": "Buku tidak ditemukan"}), 404

# Menambahkan buku baru
@app.route('/books', methods=['POST'])
def add_book():
    new_book = request.json
    new_book["id"] = len(books) + 1
    books.append(new_book)
    return jsonify(new_book), 201

# Memperbarui buku
@app.route('/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    book = next((b for b in books if b["id"] == book_id), None)
    if book:
        data = request.json
        book.update(data)
        return jsonify(book)
    return jsonify({"error": "Buku tidak ditemukan"}), 404

# Menghapus buku
@app.route('/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    global books
    books = [b for b in books if b["id"] != book_id]
    return jsonify({"message": "Buku berhasil dihapus"})

if __name__ == '__main__':
    app.run(debug=True)
