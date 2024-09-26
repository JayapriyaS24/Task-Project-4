document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('entry-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeInput = document.getElementById('type');
    const entriesList = document.getElementById('entries-list');
    const filterRadios = document.querySelectorAll('input[name="filter"]');

    let entries = JSON.parse(localStorage.getItem('entries')) || [];

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addEntry(descriptionInput.value, amountInput.value, typeInput.value);
        form.reset();
    });

    entriesList.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit')) {
            editEntry(e.target.dataset.id);
        } else if (e.target.classList.contains('delete')) {
            deleteEntry(e.target.dataset.id);
        }
    });

    filterRadios.forEach(radio => {
        radio.addEventListener('change', displayEntries);
    });

    function addEntry(description, amount, type) {
        const entry = {
            id: Date.now(),
            description,
            amount: parseFloat(amount),
            type
        };
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
        displayEntries();
    }

    function editEntry(id) {
        const entry = entries.find(entry => entry.id == id);
        if (entry) {
            descriptionInput.value = entry.description;
            amountInput.value = entry.amount;
            typeInput.value = entry.type;
            entries = entries.filter(entry => entry.id != id);
            localStorage.setItem('entries', JSON.stringify(entries));
        }
    }

    function deleteEntry(id) {
        entries = entries.filter(entry => entry.id != id);
        localStorage.setItem('entries', JSON.stringify(entries));
        displayEntries();
    }

    function displayEntries() {
        const filter = document.querySelector('input[name="filter"]:checked').value;
        entriesList.innerHTML = '';

        const filteredEntries = entries.filter(entry => filter === 'all' || entry.type === filter);

        filteredEntries.forEach(entry => {
            const li = document.createElement('li');
            li.className = entry.type;
            li.innerHTML = `
                <span>${entry.description} - $${entry.amount}</span>
                <div>
                    <button class="edit" data-id="${entry.id}">Edit</button>
                    <button class="delete" data-id="${entry.id}">Delete</button>
                </div>
            `;
            entriesList.appendChild(li);
        });

        updateTotals();
    }

    function updateTotals() {
        const income = entries.filter(entry => entry.type === 'income')
                              .reduce((sum, entry) => sum + entry.amount, 0);
        const expenses = entries.filter(entry => entry.type === 'expense')
                                .reduce((sum, entry) => sum + entry.amount, 0);

        document.getElementById('total-income').textContent = income.toFixed(2);
        document.getElementById('total-expenses').textContent = expenses.toFixed(2);
        document.getElementById('net-balance').textContent = (income - expenses).toFixed(2);
    }

    displayEntries();
});
