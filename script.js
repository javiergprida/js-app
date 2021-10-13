 class Libro {
     constructor(titulo, autor, isbn) {
         this.titulo = titulo;
         this.autor = autor;
         this.isbn = isbn;
     }
 }

 // UI Class: Handle UI Tasks
 class UI {
     static displayLibros() {
         const libros = Store.getLibros();

         libros.forEach((libro) => UI.addLibroLista(libro));
     }

     static addLibroLista(libro) {
         const list = document.querySelector('#libro-list');

         const row = document.createElement('tr');

         row.innerHTML = `
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td>${libro.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;

         list.appendChild(row);
     }

     static deleteLibro(el) {
         if (el.classList.contains('delete')) {
             el.parentElement.parentElement.remove();
         }
     }

     static showAlert(message, className) {
         const div = document.createElement('div');
         div.className = `alert alert-${className}`;
         div.appendChild(document.createTextNode(message));
         const container = document.querySelector('.container');
         const form = document.querySelector('#libro-form');
         container.insertBefore(div, form);

         // Vanish in 3 seconds
         setTimeout(() => document.querySelector('.alert').remove(), 3000);
     }

     static clearFields() {
         document.querySelector('#titulo').value = '';
         document.querySelector('#autor').value = '';
         document.querySelector('#isbn').value = '';
     }
 }

 // Store Class: Handles Storage
 class Store {
     static getLibros() {
         let libros;
         if (localStorage.getItem('libros') === null) {
             libros = [];
         } else {
             libros = JSON.parse(localStorage.getItem('libros'));
         }

         return libros;
     }

     static addLibro(libro) {
         const libros = Store.getLibros();
         libros.push(libro);
         localStorage.setItem('libros', JSON.stringify(libros));
     }

     static removelibro(isbn) {
         const libros = Store.getLibros();

         libros.forEach((libro, index) => {
             if (libro.isbn === isbn) {
                 libros.splice(index, 1);
             }
         });

         localStorage.setItem('libros', JSON.stringify(libros));
     }
 }

 // Event: Display Books
 document.addEventListener('DOMContentLoaded', UI.displayLibros);

 // Event: Add a Libro
 document.querySelector('#libro-form').addEventListener('submit', (e) => {
     // Prevent actual submit
     e.preventDefault();

     // Get form values
     const titulo = document.querySelector('#titulo').value;
     const autor = document.querySelector('#autor').value;
     const isbn = document.querySelector('#isbn').value;

     // Validate
     if (titulo === '' || autor === '' || isbn === '') {
         UI.showAlert('Please fill in all fields', 'danger');
     } else {
         // Instatiate libro
         const libro = new Libro(titulo, autor, isbn);

         // Add Libro to UI
         UI.addLibroLista(libro);

         // Add libro to store
         Store.addLibro(libro);

         // Show success message
         UI.showAlert('Libro Added', 'success');

         // Clear fields
         UI.clearFields();
     }
 });

 // Event: Remove a Libro
 document.querySelector('#libro-list').addEventListener('click', (e) => {
     // Remove libro from UI
     UI.deleteLibro(e.target);

     // Remove libro from store
     Store.removelibro(e.target.parentElement.previousElementSibling.textContent);

     // Show success message
     UI.showAlert('Libro Removed', 'success');
 });