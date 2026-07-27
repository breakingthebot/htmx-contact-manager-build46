// server.js
// Express Server & HTMX Server-Rendered HTML Fragment Controller for Build 46.
// Created: 2026-07-27

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact
} from './contactService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// HTML Fragment Render Helpers
export function renderContactRow(c) {
  return `
    <tr id="contact-row-${c.id}" class="contact-row">
      <td>
        <div class="contact-avatar-name">
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
          class="btn-icon btn-edit" 
          hx-get="/contacts/${c.id}/edit" 
          hx-target="#contact-row-${c.id}" 
          hx-swap="outerHTML"
          title="Edit Contact"
        >
          ✏️
        </button>
        <button 
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
      <td colspan="6">
        <form 
          hx-put="/contacts/${c.id}" 
          hx-target="#contact-row-${c.id}" 
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

// HTMX Server Routes

// GET /contacts/search - Live HTMX Search
app.get('/contacts/search', (req, res) => {
  const searchQuery = req.query.q || '';
  const contacts = getAllContacts(searchQuery);

  if (contacts.length === 0) {
    return res.send(`
      <tr>
        <td colspan="6" class="empty-state">
          🔍 No contacts found matching "<strong>${searchQuery}</strong>"
        </td>
      </tr>
    `);
  }

  const html = contacts.map(renderContactRow).join('');
  res.send(html);
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

// POST /contacts - Add New Contact Fragment
app.post('/contacts', (req, res) => {
  try {
    const newContact = addContact({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      category: req.body.category,
      status: req.body.status
    });
    res.send(renderContactRow(newContact));
  } catch (err) {
    res.status(400).send(`<div class="toast-error">⚠️ ${err.message}</div>`);
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
    res.send(renderContactRow(updated));
  } catch (err) {
    res.status(400).send(`Error updating contact: ${err.message}`);
  }
});

// DELETE /contacts/:id - Delete Contact Fragment
app.delete('/contacts/:id', (req, res) => {
  deleteContact(req.params.id);
  res.send(''); // Empty string removes element from DOM with hx-swap="outerHTML"
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
