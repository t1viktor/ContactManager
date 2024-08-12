document.addEventListener('DOMContentLoaded', () => {
  const addContactButton = document.getElementById('add-contact');
  const searchInput = document.getElementById('search');
  const contactList = document.getElementById('contact-list');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  const cancelButton = document.getElementById('cancel-button');
  const saveButton = document.getElementById('save-button');
  let currentRow = null;

  addContactButton.addEventListener('click', () => {
    let inputValue = searchInput.value.trim();
    if (!inputValue) return;

    let name = '';
    let phone = '';
    let email = '';

    if (inputValue.includes('@')) {
      email = inputValue;
    } else if (/^\d+$/.test(inputValue)) {
      phone = inputValue;
    } else {
      name = inputValue;
    }

    let row = document.createElement('tr');
    row.classList.add('contact-item');
    row.setAttribute('draggable', 'true');

    let nameCell = document.createElement('td');
    nameCell.classList.add('contact-info');
    nameCell.textContent = name;

    let phoneCell = document.createElement('td');
    phoneCell.classList.add('contact-info');
    phoneCell.textContent = phone;

    let emailCell = document.createElement('td');
    emailCell.classList.add('contact-info');
    emailCell.textContent = email;

    let detailsCell = document.createElement('td');
    detailsCell.classList.add('contact-details');

    let editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.classList.add('editBtn');
    editButton.addEventListener('click', (event) => {
      event.stopPropagation();
      openModal(row);
    });

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.classList.add('deleteBtn');
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      row.remove();
      saveContacts();
    });

    detailsCell.appendChild(editButton);
    detailsCell.appendChild(deleteButton);

    row.appendChild(nameCell);
    row.appendChild(phoneCell);
    row.appendChild(emailCell);
    row.appendChild(detailsCell);

    contactList.appendChild(row);
    searchInput.value = '';
    filterContacts('');
  });

  searchInput.addEventListener('input', () => {
    let query = searchInput.value.trim().toLowerCase();
    filterContacts(query);
  });

  function openModal(row) {
    currentRow = row;
    let cells = row.querySelectorAll('td.contact-info');
    nameInput.value = cells[0].textContent;
    phoneInput.value = cells[1].textContent;
    emailInput.value = cells[2].textContent;
    modal.classList.remove('hidden');
    modalTitle.textContent = 'Editar Contato';
  }

  function closeModal() {
    modal.classList.add('hidden');
  }

  cancelButton.addEventListener('click', closeModal);

  saveButton.addEventListener('click', () => {
    if (currentRow) {
      let cells = currentRow.querySelectorAll('td.contact-info');
      cells[0].textContent = nameInput.value;
      cells[1].textContent = phoneInput.value;
      cells[2].textContent = emailInput.value;
      saveContacts();
      closeModal();
    }
  });

  function saveContacts() {
    const rows = Array.from(contactList.querySelectorAll('tr.contact-item'));
    const contacts = rows.map(row => {
      const cells = row.querySelectorAll('td.contact-info');
      return {
        name: cells[0].textContent,
        phone: cells[1].textContent,
        email: cells[2].textContent
      };
    });
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }

  function loadContacts() {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contacts.forEach(contact => {
      let row = document.createElement('tr');
      row.classList.add('contact-item');
      row.setAttribute('draggable', 'true');

      let nameCell = document.createElement('td');
      nameCell.classList.add('contact-info');
      nameCell.textContent = contact.name;

      let phoneCell = document.createElement('td');
      phoneCell.classList.add('contact-info');
      phoneCell.textContent = contact.phone;

      let emailCell = document.createElement('td');
      emailCell.classList.add('contact-info');
      emailCell.textContent = contact.email;

      let detailsCell = document.createElement('td');
      detailsCell.classList.add('contact-details');

      let editButton = document.createElement('button');
      editButton.textContent = 'Editar';
      editButton.classList.add('editBtn');
      editButton.addEventListener('click', (event) => {
        event.stopPropagation();
        openModal(row);
      });

      let deleteButton = document.createElement('button');
      deleteButton.textContent = 'Excluir';
      deleteButton.classList.add('deleteBtn');
      deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        row.remove();
        saveContacts();
      });

      detailsCell.appendChild(editButton);
      detailsCell.appendChild(deleteButton);

      row.appendChild(nameCell);
      row.appendChild(phoneCell);
      row.appendChild(emailCell);
      row.appendChild(detailsCell);

      contactList.appendChild(row);
    });
  }

  function filterContacts(query) {
    let rows = document.querySelectorAll('#contact-list tr.contact-item');
    rows.forEach(row => {
      let cells = row.querySelectorAll('td.contact-info');
      let match = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(query));

      if (match) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  contactList.addEventListener('click', (event) => {
    if (window.innerWidth <= 750) {
      const contactItem = event.target.closest('.contact-item');
      if (contactItem) {
        contactItem.classList.toggle('active');
      }
    }
  });

  loadContacts();
});
