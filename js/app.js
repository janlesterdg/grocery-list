// Grocery Class: Represents a Grocery
class Grocery {
	constructor(item, category, quantity) {
		this.item = item;
		this.category = category;
		this.quantity = quantity;
	}
}

// UI Class: Handle UI Tasks
class UI {
	static displayGroceries() {
		const groceries = Store.getGroceries();

		groceries.forEach((grocery) => UI.addGroceryToList(grocery));
	}

	static addGroceryToList(grocery) {
		const list = document.querySelector('#grocery-list');

		const row = document.createElement('tr');

		row.innerHTML = `
        <td>${grocery.item}</td>
        <td>${grocery.category}</td>
        <td>${grocery.quantity}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;

		list.appendChild(row);
	}

	static deleteGrocery(el) {
		if (el.classList.contains('delete')) {
			el.parentElement.parentElement.remove();
		}
	}

	static showAlert(message, className) {
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector('.container');
		const form = document.querySelector('#grocery-form');
		container.insertBefore(div, form);

		// Vanish in 3 seconds
		setTimeout(() => document.querySelector('.alert').remove(), 3000);
	}

	static clearFields() {
		document.querySelector('#item').value = '';
		document.querySelector('#category').value = '';
		document.querySelector('#quantity').value = '';
	}
}

// Store Class: Handles Storage
class Store {
	static getGroceries() {
		let groceries;
		if (localStorage.getItem('groceries') === null) {
			groceries = [];
		} else {
			groceries = JSON.parse(localStorage.getItem('groceries'));
		}

		return groceries;
	}

	static addGrocery(grocery) {
		const groceries = Store.getGroceries();
		groceries.push(grocery);
		localStorage.setItem('groceries', JSON.stringify(groceries));
	}

	static removeGrocery(quantity) {
		const groceries = Store.getGroceries();

		groceries.forEach((grocery, index) => {
			if (grocery.quantity === quantity) {
				groceries.splice(index, 1);
			}
		});

		localStorage.setItem('groceries', JSON.stringify(groceries));
	}
}

// Event: Display Groceries
document.addEventListener('DOMContentLoaded', UI.displayGroceries);

// Event: Add a Grocery
document.querySelector('#grocery-form').addEventListener('submit', (e) => {
	// Prevent actual submit
	e.preventDefault();

	// Get form values
	const item = document.querySelector('#item').value;
	const category = document.querySelector('#category').value;
	const quantity = document.querySelector('#quantity').value;

	// Validate
	if (item === '' || category === '' || quantity === '') {
		UI.showAlert('Please fill in all fields', 'danger');
	} else {
		// Instantiate grocery
		const grocery = new Grocery(item, category, quantity);

		// Add Grocery to UI
		UI.addGroceryToList(grocery);

		// Add Grocery to store
		Store.addGrocery(grocery);

		// Show success message
		UI.showAlert('Grocery Added', 'success');

		// Clear fields
		UI.clearFields();
	}
});

// Event: Remove a Grocery
document.querySelector('#grocery-list').addEventListener('click', (e) => {
	// Remove Grocery from UI
	UI.deleteGrocery(e.target);

	// Remove grocery from store
	Store.removeGrocery(e.target.parentElement.previousElementSibling.textContent);

	// Show success message
	UI.showAlert('Grocery Removed', 'success');
});
