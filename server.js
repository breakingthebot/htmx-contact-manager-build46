// server.js
// Express Server & HTMX Server-Rendered HTML Fragment Controller for Build 46.
// Created: 2026-07-27

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getAllContacts,
  getFavoriteContacts,
  toggleFavoriteContact,
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
            <span class="fav-avatar" style="background-color: ${f.avatarColor}">${f.name.charAt(0)}</span>
            <span class="fav-name">${f.name}</span>
          </button>
        `).join('')}
      </div>
    </div>
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
          <div class="avatar-circle" style="background-color: ${c.avatarColor}">
            ${c.name.charAt(0).toUpperCase()}
          </div>
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

export function renderContactDrawer(c) {
  return `
    <div class="drawer-backdrop" hx-get="/contacts/clear-drawer" hx-target="#contact-drawer-container"></div>
    <div class="drawer-panel">
      <div class="drawer-header">
        <div class="drawer-user-info">
          <div class="avatar-circle avatar-large" style="background-color: ${c.avatarColor}">
            ${c.name.charAt(0).toUpperCase()}
          </div>
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
    </div>
  `;
}

// HTMX Server Routes

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

// GET /contacts/search - Live HTMX Search & Category Filter
app.get('/contacts/search', (req, res) => {
  const searchQuery = req.query.q || '';
  const category = req.query.category || 'All';
  const contacts = getAllContacts(searchQuery, category);

  if (contacts.length === 0) {
    return res.send(`
      <tr>
        <td colspan="7" class="empty-state">
          🔍 No contacts found matching category "${category}" ${searchQuery ? `and query "${searchQuery}"` : ''}
        </td>
      </tr>
    `);
  }

  const html = contacts.map(renderContactRow).join('');
  res.send(html);
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
      status: req.body.status
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
      status: req.body.status
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
