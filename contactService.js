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
 * @typedef {Object} ActivityLog
 * @property {string} id
 * @property {string} action
 * @property {string} details
 * @property {string} timestamp
 */

/**
 * @typedef {Object} CustomField
 * @property {string} key
 * @property {string} value
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
 * @property {string} avatarUrl
 * @property {boolean} isFavorite
 * @property {ContactNote[]} notes
 * @property {ActivityLog[]} activityLog
 * @property {CustomField[]} customFields
 */

const AVATAR_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export function generateGravatarUrl(email) {
  const cleanEmail = (email || '').trim().toLowerCase();
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cleanEmail)}`;
}

function getTimestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 16);
}

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
    avatarUrl: generateGravatarUrl('sarah.jenkins@brandpartners.com'),
    isFavorite: true,
    notes: [
      { id: 'note_1', text: 'Discussed Q3 YouTube sponsorship package rates.', createdAt: '2026-07-20 14:30' }
    ],
    activityLog: [
      { id: 'act_1', action: 'CREATE', details: 'Contact record created.', timestamp: '2026-07-20 12:00' },
      { id: 'act_2', action: 'NOTE_ADD', details: 'Added note: Discussed Q3 YouTube sponsorship package rates.', timestamp: '2026-07-20 14:30' },
      { id: 'act_3', action: 'STARRED', details: 'Starred as favorite contact.', timestamp: '2026-07-21 09:15' }
    ],
    customFields: [
      { key: 'Instagram', value: '@sarah_brand' },
      { key: 'Q3 Budget', value: '$25,000' }
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
    avatarUrl: generateGravatarUrl('alex@creatorstudio.io'),
    isFavorite: true,
    notes: [
      { id: 'note_2', text: 'Confirmed co-hosting collaborative livestream next Tuesday.', createdAt: '2026-07-22 10:15' }
    ],
    activityLog: [
      { id: 'act_4', action: 'CREATE', details: 'Contact record created.', timestamp: '2026-07-22 10:00' },
      { id: 'act_5', action: 'NOTE_ADD', details: 'Added note: Confirmed co-hosting collaborative livestream next Tuesday.', timestamp: '2026-07-22 10:15' }
    ],
    customFields: [
      { key: 'YouTube', value: 'AlexRiveraOfficial' },
      { key: 'Subscribers', value: '450K' }
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
    avatarUrl: generateGravatarUrl('elena@talentagency.net'),
    isFavorite: false,
    notes: [],
    activityLog: [
      { id: 'act_6', action: 'CREATE', details: 'Contact record created.', timestamp: '2026-07-25 16:45' }
    ],
    customFields: []
  }
];

let contactsStore = [...INITIAL_CONTACTS];

export function logContactActivity(contactId, action, details) {
  const contact = getContactById(contactId);
  if (!contact) return null;

  const entry = {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 3)}`,
    action,
    details,
    timestamp: getTimestamp()
  };

  if (!contact.activityLog) contact.activityLog = [];
  contact.activityLog.unshift(entry);
  return entry;
}

export function addCustomField(contactId, key, value) {
  const contact = getContactById(contactId);
  if (!contact) {
    throw new Error(`Contact with ID ${contactId} not found`);
  }
  if (!key || !key.trim()) {
    throw new Error('Attribute Key is required');
  }
  if (!value || !value.trim()) {
    throw new Error('Attribute Value is required');
  }

  if (!contact.customFields) contact.customFields = [];

  const cleanKey = key.trim();
  const cleanVal = value.trim();

  const existingIdx = contact.customFields.findIndex(f => f.key.toLowerCase() === cleanKey.toLowerCase());
  if (existingIdx !== -1) {
    contact.customFields[existingIdx].value = cleanVal;
  } else {
    contact.customFields.push({ key: cleanKey, value: cleanVal });
  }

  logContactActivity(contactId, 'FIELD_UPDATE', `Set custom attribute "${cleanKey}" to "${cleanVal}".`);
  return contact.customFields;
}

export function removeCustomField(contactId, key) {
  const contact = getContactById(contactId);
  if (!contact || !contact.customFields) return [];

  contact.customFields = contact.customFields.filter(f => f.key.toLowerCase() !== key.toLowerCase());
  logContactActivity(contactId, 'FIELD_DELETE', `Removed custom attribute "${key}".`);
  return contact.customFields;
}

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

export function importContactsFromJson(jsonInput) {
  if (!jsonInput || !jsonInput.trim()) {
    throw new Error('JSON payload cannot be empty');
  }

  let items;
  try {
    items = JSON.parse(jsonInput.trim());
  } catch (err) {
    throw new Error(`Invalid JSON syntax: ${err.message}`);
  }

  if (!Array.isArray(items)) {
    throw new Error('JSON payload must be an array of contact objects');
  }

  let importedCount = 0;
  const errors = [];

  items.forEach((item, idx) => {
    try {
      addContact({
        name: item.name,
        email: item.email,
        phone: item.phone,
        category: item.category,
        status: item.status,
        avatarUrl: item.avatarUrl
      });
      importedCount++;
    } catch (err) {
      errors.push(`Item #${idx + 1} (${item.name || 'Unnamed'}): ${err.message}`);
    }
  });

  return { importedCount, errors };
}

export function getAllContacts(searchQuery = '', categoryFilter = 'All', sortField = 'name', sortOrder = 'asc') {
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

  // Dynamic Column Sorting
  if (sortField) {
    result.sort((a, b) => {
      let valA = (a[sortField] || '').toString().toLowerCase();
      let valB = (b[sortField] || '').toString().toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return result;
}

export function getPaginatedContacts(searchQuery = '', categoryFilter = 'All', sortField = 'name', sortOrder = 'asc', page = 1, pageSize = 10) {
  const all = getAllContacts(searchQuery, categoryFilter, sortField, sortOrder);
  const totalCount = all.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, parseInt(page, 10) || 1), totalPages);

  const startIdx = (currentPage - 1) * pageSize;
  const contacts = all.slice(startIdx, startIdx + pageSize);

  return {
    contacts,
    totalCount,
    page: currentPage,
    totalPages,
    pageSize
  };
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
  logContactActivity(id, contact.isFavorite ? 'STARRED' : 'UNSTARRED', contact.isFavorite ? 'Starred as favorite contact.' : 'Unstarred from favorites.');
  return contact;
}

export function updateContactAvatar(id, avatarUrl) {
  const contact = getContactById(id);
  if (!contact) {
    throw new Error(`Contact with ID ${id} not found`);
  }

  contact.avatarUrl = avatarUrl ? avatarUrl.trim() : generateGravatarUrl(contact.email);
  logContactActivity(id, 'AVATAR_UPDATE', 'Updated avatar profile image.');
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

  const cleanEmail = data.email.trim();

  const newContact = {
    id: `cnt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    name: data.name.trim(),
    email: cleanEmail,
    phone: data.phone ? data.phone.trim() : '+1 (555) 000-0000',
    category: data.category || 'VIP',
    status: data.status || 'Active',
    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    avatarUrl: data.avatarUrl ? data.avatarUrl.trim() : generateGravatarUrl(cleanEmail),
    isFavorite: false,
    notes: [],
    activityLog: [
      { id: `act_${Date.now()}`, action: 'CREATE', details: 'Contact record created.', timestamp: getTimestamp() }
    ],
    customFields: []
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

  const cleanText = noteText.trim();
  const newNote = {
    id: `note_${Date.now()}`,
    text: cleanText,
    createdAt: getTimestamp()
  };

  contact.notes.unshift(newNote);
  logContactActivity(contactId, 'NOTE_ADD', `Added note: "${cleanText}"`);
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

  const newEmail = updates.email ? updates.email.trim() : contactsStore[index].email;

  contactsStore[index] = {
    ...contactsStore[index],
    ...updates,
    name: updates.name ? updates.name.trim() : contactsStore[index].name,
    email: newEmail,
    avatarUrl: updates.avatarUrl ? updates.avatarUrl.trim() : (updates.email ? generateGravatarUrl(newEmail) : contactsStore[index].avatarUrl)
  };

  logContactActivity(id, 'UPDATE', `Updated contact details.`);
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

  const headers = 'ID,Name,Email,Phone,Category,Status,AvatarURL\n';
  const rows = targetContacts.map(c => 
    `"${c.id}","${c.name}","${c.email}","${c.phone}","${c.category}","${c.status}","${c.avatarUrl}"`
  ).join('\n');

  return headers + rows;
}

export function resetContactsStore() {
  contactsStore = JSON.parse(JSON.stringify(INITIAL_CONTACTS));
}
