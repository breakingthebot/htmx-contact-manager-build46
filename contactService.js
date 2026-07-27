// contactService.js
// Enterprise Contact & Creator Network CRM Service Engine.
// Created: 2026-07-27

/**
 * @typedef {Object} ContactNote
 * @property {string} id
 * @property {string} text
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Contact
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {'Sponsor' | 'Collaborator' | 'VIP' | 'Agency'} category
 * @property {'Active' | 'Pending' | 'Archived'} status
 * @property {string} avatarColor
 * @property {boolean} isFavorite
 * @property {ContactNote[]} notes
 */

const AVATAR_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

/** @type {Contact[]} */
const INITIAL_CONTACTS = [
  {
    id: 'cnt_1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@brandpartners.com',
    phone: '+1 (555) 234-5678',
    category: 'Sponsor',
    status: 'Active',
    avatarColor: '#6366f1',
    isFavorite: true,
    notes: [
      { id: 'note_1', text: 'Discussed Q3 YouTube sponsorship package rates.', createdAt: '2026-07-20 14:30' }
    ]
  },
  {
    id: 'cnt_2',
    name: 'Alex Rivera',
    email: 'alex@creatorstudio.io',
    phone: '+1 (555) 876-5432',
    category: 'Collaborator',
    status: 'Active',
    avatarColor: '#10b981',
    isFavorite: true,
    notes: [
      { id: 'note_2', text: 'Confirmed co-hosting collaborative livestream next Tuesday.', createdAt: '2026-07-22 10:15' }
    ]
  },
  {
    id: 'cnt_3',
    name: 'Elena Rostova',
    email: 'elena@talentagency.net',
    phone: '+44 20 7946 0912',
    category: 'Agency',
    status: 'Pending',
    avatarColor: '#f59e0b',
    isFavorite: false,
    notes: []
  }
];

let contactsStore = [...INITIAL_CONTACTS];

export function validateContactInput(data) {
  if (!data.name || !data.name.trim()) {
    throw new Error('Full Name is required');
  }
  if (!data.email || !data.email.trim()) {
    throw new Error('Email address is required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email.trim())) {
    throw new Error('Invalid email format (e.g. name@domain.com)');
  }

  return true;
}

export function getAllContacts(searchQuery = '', categoryFilter = 'All') {
  let result = [...contactsStore];

  if (categoryFilter && categoryFilter !== 'All') {
    result = result.filter(c => c.category === categoryFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }

  return result;
}

export function getFavoriteContacts() {
  return contactsStore.filter(c => c.isFavorite);
}

export function toggleFavoriteContact(id) {
  const contact = getContactById(id);
  if (!contact) {
    throw new Error(`Contact with ID ${id} not found`);
  }

  contact.isFavorite = !contact.isFavorite;
  return contact;
}

export function getCategoryStats() {
  const counts = { All: contactsStore.length, Sponsor: 0, Collaborator: 0, VIP: 0, Agency: 0 };
  contactsStore.forEach(c => {
    if (counts[c.category] !== undefined) {
      counts[c.category] += 1;
    }
  });
  return counts;
}

export function getContactById(id) {
  return contactsStore.find(c => c.id === id);
}

export function addContact(data) {
  validateContactInput(data);

  const newContact = {
    id: `cnt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone ? data.phone.trim() : '+1 (555) 000-0000',
    category: data.category || 'VIP',
    status: data.status || 'Active',
    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    isFavorite: false,
    notes: []
  };

  contactsStore.unshift(newContact);
  return newContact;
}

export function addContactNote(contactId, noteText) {
  const contact = getContactById(contactId);
  if (!contact) {
    throw new Error(`Contact with ID ${contactId} not found`);
  }
  if (!noteText || !noteText.trim()) {
    throw new Error('Note text cannot be empty');
  }

  const newNote = {
    id: `note_${Date.now()}`,
    text: noteText.trim(),
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  contact.notes.unshift(newNote);
  return newNote;
}

export function updateContact(id, updates) {
  const index = contactsStore.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error(`Contact with ID ${id} not found`);
  }

  if (updates.name !== undefined || updates.email !== undefined) {
    validateContactInput({
      name: updates.name ?? contactsStore[index].name,
      email: updates.email ?? contactsStore[index].email
    });
  }

  contactsStore[index] = {
    ...contactsStore[index],
    ...updates,
    name: updates.name ? updates.name.trim() : contactsStore[index].name,
    email: updates.email ? updates.email.trim() : contactsStore[index].email
  };

  return contactsStore[index];
}

export function deleteContact(id) {
  const initialLen = contactsStore.length;
  contactsStore = contactsStore.filter(c => c.id !== id);
  return contactsStore.length < initialLen;
}

export function bulkDeleteContacts(ids = []) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const initialLen = contactsStore.length;
  contactsStore = contactsStore.filter(c => !ids.includes(c.id));
  return initialLen - contactsStore.length;
}

export function exportContactsAsCsv(ids = null) {
  const targetContacts = ids && ids.length > 0 
    ? contactsStore.filter(c => ids.includes(c.id))
    : contactsStore;

  const headers = 'ID,Name,Email,Phone,Category,Status\n';
  const rows = targetContacts.map(c => 
    `"${c.id}","${c.name}","${c.email}","${c.phone}","${c.category}","${c.status}"`
  ).join('\n');

  return headers + rows;
}

export function resetContactsStore() {
  contactsStore = JSON.parse(JSON.stringify(INITIAL_CONTACTS));
}
