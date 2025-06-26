// DOM Elements
const saveBtn = document.getElementById("SaveBtn");
const ul = document.getElementById("ul");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Load saved contacts when page loads
document.addEventListener("DOMContentLoaded", loadContacts);

// Save contact event
saveBtn.addEventListener("click", () => {
  const CName = document.getElementById("CName").value.trim();
  const CNumber = document.getElementById("CNumber").value.trim();
  
  if (!CName || !CNumber) {
    alert("Please enter both name and number");
    return;
  }

  const contact = {
    name: CName,
    number: CNumber
  };

  saveContact(contact);
  addContactToUI(contact);
  
  // Clear inputs
  document.getElementById("CName").value = "";
  document.getElementById("CNumber").value = "";
});

function addContactToUI(contact) {
  const li = document.createElement("li");
  li.className = "contact-item";
  
  const contactInfo = document.createElement("div");
  contactInfo.className = "contact-info";
  
  const namePara = document.createElement("p");
  namePara.className = "contact-name";
  namePara.textContent = contact.name;
  
  const numberLink = document.createElement("a");
  numberLink.className = "contact-number";
  numberLink.href = `tel:${contact.number}`;
  numberLink.textContent = contact.number;
  
  contactInfo.append(namePara, numberLink);
  
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "contact-actions";
  
  const editBtn = document.createElement("button");
  editBtn.className = "action-btn edit-btn";
  editBtn.innerHTML = '<i class="fas fa-edit"></i>';
  editBtn.title = "Edit";
  editBtn.addEventListener("click", () => editContact(li, contact));
  
  const delBtn = document.createElement("button");
  delBtn.className = "action-btn delete-btn";
  delBtn.innerHTML = '<i class="fas fa-trash"></i>';
  delBtn.title = "Delete";
  delBtn.addEventListener("click", () => {
    deleteContact(contact.number);
    li.remove();
  });
  
  actionsDiv.append(editBtn, delBtn);
  li.append(contactInfo, actionsDiv);
  ul.append(li);
}

function saveContact(contact) {
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts.push(contact);
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function loadContacts() {
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  ul.innerHTML = ""; // Clear current list
  contacts.forEach(contact => {
    addContactToUI(contact);
  });
}

function deleteContact(number) {
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts = contacts.filter(contact => contact.number !== number);
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function editContact(liElement, oldContact) {
  const newName = prompt("Enter new name:", oldContact.name);
  const newNumber = prompt("Enter new number:", oldContact.number);
  
  if (newName && newNumber) {
    // Update in local storage
    deleteContact(oldContact.number);
    saveContact({ name: newName, number: newNumber });
    
    // Update UI
    liElement.querySelector(".contact-name").textContent = newName;
    const link = liElement.querySelector(".contact-number");
    link.href = `tel:${newNumber}`;
    link.textContent = newNumber;
  }
}

// Search functionality
searchBtn.addEventListener("click", searchContacts);
searchInput.addEventListener("keyup", searchContacts);

function searchContacts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const allContacts = JSON.parse(localStorage.getItem("contacts")) || [];
  
  ul.innerHTML = "";
  
  if (!searchTerm) {
    loadContacts();
    return;
  }
  
  const filteredContacts = allContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm) || 
    contact.number.includes(searchTerm)
  );
  
  filteredContacts.forEach(contact => addContactToUI(contact));
}