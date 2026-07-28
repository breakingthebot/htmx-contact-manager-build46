// server.js
// Express Server & HTMX Server-Rendered HTML Fragment Controller for Build 46.
// Created: 2026-07-27

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getAllContacts,
  getPaginatedContacts,
  getFavoriteContacts,
  toggleFavoriteContact,
  updateContactAvatar,
  addCustomField,
  removeCustomField,
  importContactsFromJson,
  getCategoryStats,
  getContactById,
  addContact,
  addContactNote,
  updateContact,
  deleteContact,
  bulkDeleteContacts,
  exportContactsAsCsv
} from './contactService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// HTML Fragment Render Helpers
export function renderToastNotification(type, message) {
  const icon = type === 'success' ? '✅' : '⚠️';
  return `
    <div class="toast toast-${type}" onclick="this.remove()">
      <span>${icon} ${message}</span>
      <span class="toast-close">&times;</span>
    </div>
  `;
}

export function renderAvatarImg(c, sizeClass = '') {
  if (c.avatarUrl) {
    return `<img src="${c.avatarUrl}" alt="${c.name}" class="avatar-img ${sizeClass}" style="border-color: ${c.avatarColor}" />`;
  }
  return `
    <div class="avatar-circle ${sizeClass}" style="background-color: ${c.avatarColor}">
      ${c.name.charAt(0).toUpperCase()}
    </div>
  `;
}

export function renderCustomFieldsList(contactId, customFields) {
  if (!customFields || customFields.length === 0) {
    return `<div class="empty-notes">🏷️ No custom attributes added yet.</div>`;
  }

  return customFields.map(f => `
    <div class="custom-field-pill">
      <span class="field-key">${f.key}:</span>
      <span class="field-val">${f.value}</span>
      <button 
        type="button" 
        class="btn-delete-field" 
        hx-delete="/contacts/${contactId}/custom-fields/${encodeURIComponent(f.key)}" 
        hx-target="#drawer-custom-fields-${contactId}" 
        title="Remove attribute"
      >
        &times;
      </button>
    </div>
  `).join('');
}

export function renderFavoritesBar() {
  const favorites = getFavoriteContacts();
  if (favorites.length === 0) {
    return `<div class="empty-favorites">⭐ No starred favorite contacts yet. Click ☆ on any contact row to pin!</div>`;
  }

  return `
    <div class="favorites-bar-inner">
      <span class="favorites-title">⭐ Starred Favorites:</span>
      <div class="favorites-pills">
        ${favorites.map(f => `
          <button 
            type="button" 
            class="fav-pill" 
            hx-get="/contacts/${f.id}/drawer" 
            hx-target="#contact-drawer-container"
          >
            ${renderAvatarImg(f, 'avatar-mini')}
            <span class="fav-name">${f.name}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderPaginationControls(page, totalPages, pageSize, totalCount, category = 'All', query = '', sort = 'name', order = 'asc') {
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  return `
    <div class="pagination-bar">
      <div class="pagination-info">
        Showing ${totalCount > 0 ? (page - 1) * pageSize + 1 : 0}-${Math.min(page * pageSize, totalCount)} of ${totalCount} contacts
      </div>

      <div class="pagination-buttons">
        <button 
          type="button"
          class="btn-page ${page <= 1 ? 'disabled' : ''}"
          ${page > 1 ? `hx-get="/contacts/search?page=${prevPage}&limit=${pageSize}&category=${category}&q=${query}&sort=${sort}&order=${order}" hx-target="#contacts-table-body" hx-swap="innerHTML"` : 'disabled'}
        >
          ⏮️ Previous
        </button>

        <span class="page-indicator">Page <strong>${page}</strong> of <strong>${totalPages}</strong></span>

        <button 
          type="button"
          class="btn-page ${page >= totalPages ? 'disabled' : ''}"
          ${page < totalPages ? `hx-get="/contacts/search?page=${nextPage}&limit=${pageSize}&category=${category}&q=${query}&sort=${sort}&order=${order}" hx-target="#contacts-table-body" hx-swap="innerHTML"` : 'disabled'}
        >
          Next ⏭️
        </button>
      </div>

      <div class="pagination-limit-selector">
        <label>Per Page:</label>
        <select 
          name="limit" 
          class="select-limit"
          hx-get="/contacts/search?page=1&category=${category}&q=${query}&sort=${sort}&order=${order}"
          hx-target="#contacts-table-body"
          hx-swap="innerHTML"
          hx-include="this"
        >
          <option value="5" ${pageSize === 5 ? 'selected' : ''}>5</option>
          <option value="10" ${pageSize === 10 ? 'selected' : ''}>10</option>
          <option value="25" ${pageSize === 25 ? 'selected' : ''}>25</option>
          <option value="50" ${pageSize === 50 ? 'selected' : ''}>50</option>
        </select>
      </div>
    </div>
  `;
}

export function renderTableHeader(currentSort = 'name', currentOrder = 'asc', category = 'All', query = '') {
  const columns = [
    { field: 'name', label: 'Contact Name' },
    { field: 'email', label: 'Email' },
    { field: 'phone', label: 'Phone' },
    { field: 'category', label: 'Category' },
    { field: 'status', label: 'Status' }
  ];

  return `
    <tr>
      <th class="checkbox-cell">
        <input type="checkbox" id="select-all-checkbox" onclick="toggleSelectAll(this)" />
      </th>
      ${columns.map(col => {
        const isSorted = currentSort === col.field;
        const nextOrder = isSorted && currentOrder === 'asc' ? 'desc' : 'asc';
        const arrow = isSorted ? (currentOrder === 'asc' ? ' ▲' : ' ▼') : '';
        return `
          <th 
            class="sortable-header ${isSorted ? 'sorted-active' : ''}"
            hx-get="/contacts/search?sort=${col.field}&order=${nextOrder}&category=${category}&q=${query}"
            hx-target="#contacts-table-body"
            hx-swap="innerHTML"
            title="Click to sort by ${col.label}"
          >
            ${col.label}<span class="sort-arrow">${arrow}</span>
          </th>
        `;
      }).join('')}
      <th>Actions</th>
    </tr>
  `;
}

export function renderContactRow(c) {
  return `
    <tr id="contact-row-${c.id}" class="contact-row ${c.isFavorite ? 'row-favorite' : ''}">
      <td class="checkbox-cell">
        <input type="checkbox" name="ids" value="${c.id}" class="contact-checkbox" />
      </td>
      <td>
        <div class="contact-avatar-name">
          <button 
            type="button"
            class="btn-star ${c.isFavorite ? 'active' : ''}"
            hx-post="/contacts/${c.id}/favorite"
            hx-target="#contact-row-${c.id}"
            hx-swap="outerHTML"
            title="${c.isFavorite ? 'Unstar Contact' : 'Star Contact'}"
          >
            ${c.isFavorite ? '⭐' : '☆'}
          </button>
          ${renderAvatarImg(c)}
          <div>
            <div class="contact-name">${c.name}</div>
            <div class="contact-id">${c.id}</div>
          </div>
        </div>
      </td>
      <td class="contact-email">${c.email}</td>
      <td class="contact-phone">${c.phone}</td>
      <td>
        <span class="category-badge category-${c.category.toLowerCase()}">${c.category}</span>
      </td>
      <td>
        <span class="status-badge status-${c.status.toLowerCase()}">${c.status}</span>
      </td>
      <td class="action-buttons">
        <button 
          type="button"
          class="btn-icon btn-view"
          hx-get="/contacts/${c.id}/drawer"
          hx-target="#contact-drawer-container"
          title="View Contact Details & Notes"
        >
          👁️
        </button>
        <button 
          type="button"
          class="btn-icon btn-edit" 
          hx-get="/contacts/${c.id}/edit" 
          hx-target="#contact-row-${c.id}" 
          hx-swap="outerHTML"
          title="Edit Contact"
        >
          ✏️
        </button>
        <button 
          type="button"
          class="btn-icon btn-delete" 
          hx-delete="/contacts/${c.id}" 
          hx-target="#contact-row-${c.id}" 
          hx-swap="outerHTML swap:0.4s"
          hx-confirm="Are you sure you want to delete ${c.name}?"
          title="Delete Contact"
        >
          🗑️
        </button>
      </td>
    </tr>
  `;
}

export function renderEditRow(c) {
  return `
    <tr id="contact-row-${c.id}" class="edit-row">
      <td colspan="7">
        <form 
          hx-put="/contacts/${c.id}" 
          hx-target="#contact-row-${c.id}" 
          hx-target-error="#toast-container"
          hx-swap="outerHTML"
          class="edit-form-grid"
        >
          <input type="text" name="name" value="${c.name}" required class="input-edit" placeholder="Name" />
          <input type="email" name="email" value="${c.email}" required class="input-edit" placeholder="Email" />
          <input type="text" name="phone" value="${c.phone}" class="input-edit" placeholder="Phone" />
          <select name="category" class="input-edit">
            <option value="Sponsor" ${c.category === 'Sponsor' ? 'selected' : ''}>Sponsor</option>
            <option value="Collaborator" ${c.category === 'Collaborator' ? 'selected' : ''}>Collaborator</option>
            <option value="VIP" ${c.category === 'VIP' ? 'selected' : ''}>VIP</option>
            <option value="Agency" ${c.category === 'Agency' ? 'selected' : ''}>Agency</option>
          </select>
          <select name="status" class="input-edit">
            <option value="Active" ${c.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Pending" ${c.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Archived" ${c.status === 'Archived' ? 'selected' : ''}>Archived</option>
          </select>
          <div class="edit-actions">
            <button type="submit" class="btn-save">💾 Save</button>
            <button 
              type="button" 
              class="btn-cancel" 
              hx-get="/contacts/${c.id}/row" 
              hx-target="#contact-row-${c.id}" 
              hx-swap="outerHTML"
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      </td>
    </tr>
  `;
}

export function renderCategoryPills(activeCategory = 'All') {
  const stats = getCategoryStats();
  const categories = ['All', 'Sponsor', 'Collaborator', 'VIP', 'Agency'];

  return categories.map(cat => {
    const isActive = cat === activeCategory;
    const count = stats[cat] || 0;
    return `
      <button 
        type="button"
        class="category-pill ${isActive ? 'active' : ''} category-pill-${cat.toLowerCase()}"
        hx-get="/contacts/search?category=${cat}"
        hx-target="#contacts-table-body"
        hx-swap="innerHTML"
        onclick="setActiveCategoryPill(this)"
      >
        <span>${cat}</span>
        <span class="pill-count">${count}</span>
      </button>
    `;
  }).join('');
}

export function renderNotesList(notes) {
  if (!notes || notes.length === 0) {
    return `<div class="empty-notes">📝 No interaction notes recorded yet.</div>`;
  }

  return notes.map(n => `
    <div class="note-card">
      <div class="note-header">
        <span class="note-time">⏱️ ${n.createdAt}</span>
      </div>
      <div class="note-text">${n.text}</div>
    </div>
  `).join('');
}

export function renderActivityTimeline(activityLog) {
  if (!activityLog || activityLog.length === 0) {
    return `<div class="empty-notes">📜 No activity history recorded yet.</div>`;
  }

  const actionIcons = {
    CREATE: '✨',
    UPDATE: '✏️',
    NOTE_ADD: '📝',
    STARRED: '⭐',
    UNSTARRED: '☆',
    AVATAR_UPDATE: '🖼️',
    FIELD_UPDATE: '🏷️',
    FIELD_DELETE: '🗑️'
  };

  return activityLog.map(act => `
    <div class="timeline-item">
      <div class="timeline-badge">${actionIcons[act.action] || '📌'}</div>
      <div class="timeline-content">
        <div class="timeline-details">${act.details}</div>
        <div class="timeline-time">⏱️ ${act.timestamp}</div>
      </div>
    </div>
  `).join('');
}

export function renderContactDrawer(c) {
  return `
    <div class="drawer-backdrop" hx-get="/contacts/clear-drawer" hx-target="#contact-drawer-container"></div>
    <div class="drawer-panel">
      <div class="drawer-header">
        <div class="drawer-user-info">
          ${renderAvatarImg(c, 'avatar-large')}
          <div>
            <h3>${c.name} ${c.isFavorite ? '⭐' : ''}</h3>
            <p class="drawer-email">${c.email}</p>
          </div>
        </div>
        <button 
          type="button" 
          class="btn-close-drawer" 
          hx-get="/contacts/clear-drawer" 
          hx-target="#contact-drawer-container"
        >
          ❌
        </button>
      </div>

      <div class="drawer-details">
        <div class="detail-pill">
          <span class="detail-label">Phone:</span>
          <span>${c.phone}</span>
        </div>
        <div class="detail-pill">
          <span class="detail-label">Category:</span>
          <span class="category-badge category-${c.category.toLowerCase()}">${c.category}</span>
        </div>
        <div class="detail-pill">
          <span class="detail-label">Status:</span>
          <span class="status-badge status-${c.status.toLowerCase()}">${c.status}</span>
        </div>
      </div>

      <hr class="drawer-divider" />

      <!-- Custom Key-Value Attributes Section -->
      <div class="drawer-notes-section">
        <h4>🏷️ Custom Key-Value Attributes</h4>
        <form 
          hx-post="/contacts/${c.id}/custom-fields" 
          hx-target="#drawer-custom-fields-${c.id}" 
          hx-on::after-request="if (event.detail.successful) this.reset()"
          class="add-custom-field-form"
        >
          <input type="text" name="key" placeholder="Key (e.g. Instagram)" required class="field-input" />
          <input type="text" name="value" placeholder="Value (e.g. @sarah_creators)" required class="field-input" />
          <button type="submit" class="btn-add-field">➕ Add</button>
        </form>

        <div id="drawer-custom-fields-${c.id}" class="custom-fields-container">
          ${renderCustomFieldsList(c.id, c.customFields)}
        </div>
      </div>

      <hr class="drawer-divider" />

      <div class="drawer-notes-section">
        <h4>📝 Interaction & Communication Notes</h4>
        
        <form 
          hx-post="/contacts/${c.id}/notes" 
          hx-target="#drawer-notes-list" 
          hx-on::after-request="if (event.detail.successful) this.reset()"
          class="add-note-form"
        >
          <input 
            type="text" 
            name="noteText" 
            placeholder="Add interaction note (e.g. Sent rate card PDF)..." 
            required 
            class="note-input" 
          />
          <button type="submit" class="btn-add-note">➕ Add Note</button>
        </form>

        <div id="drawer-notes-list" class="notes-list">
          ${renderNotesList(c.notes)}
        </div>
      </div>

      <hr class="drawer-divider" />

      <div class="drawer-notes-section">
        <h4>📜 Contact Activity Audit Timeline</h4>
        <div class="activity-timeline-container">
          ${renderActivityTimeline(c.activityLog)}
        </div>
      </div>
    </div>
  `;
}

// HTMX Server Routes

// POST /contacts/:id/custom-fields - Add Custom Key-Value Attribute
app.post('/contacts/:id/custom-fields', (req, res) => {
  try {
    const fields = addCustomField(req.params.id, req.body.key, req.body.value);
    res.send(renderCustomFieldsList(req.params.id, fields));
  } catch (err) {
    res.status(400).send(renderToastNotification('error', err.message));
  }
});

// DELETE /contacts/:id/custom-fields/:key - Remove Custom Key-Value Attribute
app.delete('/contacts/:id/custom-fields/:key', (req, res) => {
  try {
    const fields = removeCustomField(req.params.id, req.params.key);
    res.send(renderCustomFieldsList(req.params.id, fields));
  } catch (err) {
    res.status(400).send(renderToastNotification('error', err.message));
  }
});

// POST /contacts/import-json - Bulk JSON Import Vault Endpoint
app.post('/contacts/import-json', (req, res) => {
  try {
    const { importedCount, errors } = importContactsFromJson(req.body.jsonPayload);
    res.setHeader('HX-Trigger', 'contactCreated');
    const msg = `Successfully imported ${importedCount} contact(s).${errors.length > 0 ? ` (${errors.length} skipped)` : ''}`;
    res.send(renderToastNotification('success', msg));
  } catch (err) {
    res.status(400).send(renderToastNotification('error', err.message));
  }
});

// GET /contacts/favorites-bar - Starred Favorites Bar
app.get('/contacts/favorites-bar', (req, res) => {
  res.send(renderFavoritesBar());
});

// POST /contacts/:id/favorite - Toggle Favorite State
app.post('/contacts/:id/favorite', (req, res) => {
  try {
    const contact = toggleFavoriteContact(req.params.id);
    res.setHeader('HX-Trigger', 'favoriteToggled');
    res.send(renderContactRow(contact));
  } catch (err) {
    res.status(400).send(renderToastNotification('error', err.message));
  }
});

// GET /contacts/categories - Category Pills Bar
app.get('/contacts/categories', (req, res) => {
  const activeCat = req.query.active || 'All';
  res.send(renderCategoryPills(activeCat));
});

// GET /contacts/clear-drawer - Close drawer
app.get('/contacts/clear-drawer', (req, res) => {
  res.send('');
});

// GET /contacts/:id/drawer - Render Contact Drawer Fragment
app.get('/contacts/:id/drawer', (req, res) => {
  const contact = getContactById(req.params.id);
  if (!contact) return res.status(404).send('Contact not found');
  res.send(renderContactDrawer(contact));
});

// POST /contacts/:id/notes - Add Interaction Note
app.post('/contacts/:id/notes', (req, res) => {
  try {
    addContactNote(req.params.id, req.body.noteText);
    const contact = getContactById(req.params.id);
    res.send(renderNotesList(contact.notes));
  } catch (err) {
    res.status(400).send(renderToastNotification('error', err.message));
  }
});

// GET /contacts/search - Live HTMX Search, Category Filter, Column Sorting & Server Pagination
app.get('/contacts/search', (req, res) => {
  const searchQuery = req.query.q || '';
  const category = req.query.category || 'All';
  const sortField = req.query.sort || 'name';
  const sortOrder = req.query.order || 'asc';
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.limit, 10) || 10;

  const { contacts, totalCount, totalPages } = getPaginatedContacts(searchQuery, category, sortField, sortOrder, page, pageSize);

  if (contacts.length === 0) {
    return res.send(`
      <tr>
        <td colspan="7" class="empty-state">
          🔍 No contacts found matching category "${category}" ${searchQuery ? `and query "${searchQuery}"` : ''}
        </td>
      </tr>
    `);
  }

  const rowsHtml = contacts.map(renderContactRow).join('');
  const paginationHtml = renderPaginationControls(page, totalPages, pageSize, totalCount, category, searchQuery, sortField, sortOrder);

  // Return rows + OOB (Out of Band) pagination container swap
  res.send(`
    ${rowsHtml}
    <div id="pagination-container" hx-swap-oob="true" class="pagination-wrapper">
      ${paginationHtml}
    </div>
  `);
});

// GET /contacts/export-csv - CSV File Download
app.get('/contacts/export-csv', (req, res) => {
  const csvContent = exportContactsAsCsv();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="contacts_vault.csv"');
  res.status(200).send(csvContent);
});

// POST /contacts/bulk-delete - Bulk HTMX Delete
app.post('/contacts/bulk-delete', (req, res) => {
  let ids = req.body.ids;
  if (!ids) {
    return res.send(getAllContacts().map(renderContactRow).join(''));
  }
  if (typeof ids === 'string') ids = [ids];

  bulkDeleteContacts(ids);
  res.setHeader('HX-Trigger', 'favoriteToggled');
  const remaining = getAllContacts();

  if (remaining.length === 0) {
    return res.send(`
      <tr>
        <td colspan="7" class="empty-state">
          📇 All contacts deleted. Add new contacts above!
        </td>
      </tr>
    `);
  }

  res.send(remaining.map(renderContactRow).join(''));
});

// GET /contacts/:id/edit - Render Inline Edit Form Fragment
app.get('/contacts/:id/edit', (req, res) => {
  const contact = getContactById(req.params.id);
  if (!contact) return res.status(404).send('Contact not found');
  res.send(renderEditRow(contact));
});

// GET /contacts/:id/row - Render Single Contact Row Fragment
app.get('/contacts/:id/row', (req, res) => {
  const contact = getContactById(req.params.id);
  if (!contact) return res.status(404).send('Contact not found');
  res.send(renderContactRow(contact));
});

// POST /contacts - Add New Contact Fragment with Server-Side Validation Toast
app.post('/contacts', (req, res) => {
  try {
    const newContact = addContact({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      category: req.body.category,
      status: req.body.status,
      avatarUrl: req.body.avatarUrl
    });
    res.setHeader('HX-Trigger', 'contactCreated');
    res.send(renderContactRow(newContact));
  } catch (err) {
    res.status(400).send(renderToastNotification('error', err.message));
  }
});

// PUT /contacts/:id - Update Contact Fragment
app.put('/contacts/:id', (req, res) => {
  try {
    const updated = updateContact(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      category: req.body.category,
      status: req.body.status,
      avatarUrl: req.body.avatarUrl
    });
    res.setHeader('HX-Trigger', 'favoriteToggled');
    res.send(renderContactRow(updated));
  } catch (err) {
    res.status(400).send(renderToastNotification('error', err.message));
  }
});

// DELETE /contacts/:id - Delete Contact Fragment
app.delete('/contacts/:id', (req, res) => {
  deleteContact(req.params.id);
  res.setHeader('HX-Trigger', 'favoriteToggled');
  res.send('');
});

// Serve Main Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export app for Vercel Serverless
export default app;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 HTMX Contact Manager Server running at http://localhost:${PORT}`);
  });
}
