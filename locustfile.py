from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 5)  # Tunggu antara 1 hingga 5 detik sebelum request

    # Mendapatkan semua buku
    @task
    def get_books(self):
        self.client.get("/books")

    # Menambahkan buku baru
    @task
    def add_book(self):
        self.client.post("/books", json={"title": "Buku Baru", "author": "Penulis C", "year": 2022})

    # Mendapatkan buku berdasarkan ID
    @task
    def get_book_by_id(self):
        self.client.get("/books/1")

    # Memperbarui buku berdasarkan ID
    @task
    def update_book(self):
        self.client.put("/books/1", json={"title": "Buku Diperbarui", "author": "Penulis A", "year": 2023})

    # Menghapus buku berdasarkan ID
    @task
    def delete_book(self):
        self.client.delete("/books/1")
