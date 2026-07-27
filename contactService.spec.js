// contactService.spec.js
// Unit tests for contactService.
// Created: 2026-07-27

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAllContacts,
  getCategoryStats,
  getContactById,
  addContact,
  addContactNote,
  updateContact,
  deleteContact,
  bulkDeleteContacts,
  exportContactsAsCsv,
  resetContactsStore
} from './contactService.js';

describe('contactService', () => {
  beforeEach(() => {
    resetContactsStore();
  });

  it('retrieves initial list of contacts', () => {
    const contacts = getAllContacts();
    expect(contacts.length).toBe(3);
    expect(contacts[0].name).toBe('Sarah Jenkins');
  });

  it('filters contacts by search query', () => {
    const filtered = getAllContacts('Alex');
    expect(filtered.length).toBe(1);
    expect(filtered[0].email).toBe('alex@creatorstudio.io');
  });

  it('filters contacts by category tag', () => {
    const sponsors = getAllContacts('', 'Sponsor');
    expect(sponsors.length).toBe(1);
    expect(sponsors[0].name).toBe('Sarah Jenkins');
  });

  it('calculates category stats correctly', () => {
    const stats = getCategoryStats();
    expect(stats.All).toBe(3);
    expect(stats.Sponsor).toBe(1);
    expect(stats.Collaborator).toBe(1);
    expect(stats.Agency).toBe(1);
    expect(stats.VIP).toBe(0);
  });

  it('adds a new contact successfully', () => {
    const newContact = addContact({
      name: 'Marcus Vance',
      email: 'marcus@vance.io',
      phone: '+1 (555) 999-1111',
      category: 'Sponsor',
      status: 'Active'
    });

    expect(newContact.id).toBeDefined();
    expect(getAllContacts().length).toBe(4);
  });

  it('adds interaction note to a contact', () => {
    const note = addContactNote('cnt_1', 'Sent brand deck agreement PDF.');
    expect(note.id).toBeDefined();
    const contact = getContactById('cnt_1');
    expect(contact.notes.length).toBe(2);
    expect(contact.notes[0].text).toBe('Sent brand deck agreement PDF.');
  });

  it('throws error when adding empty note text', () => {
    expect(() => addContactNote('cnt_1', '')).toThrow();
  });

  it('throws error when adding contact without name or email', () => {
    expect(() => addContact({ name: '', email: '' })).toThrow();
  });

  it('updates an existing contact', () => {
    const updated = updateContact('cnt_1', { name: 'Sarah Jenkins-Smith' });
    expect(updated.name).toBe('Sarah Jenkins-Smith');
  });

  it('deletes a contact', () => {
    const deleted = deleteContact('cnt_1');
    expect(deleted).toBe(true);
    expect(getAllContacts().length).toBe(2);
  });

  it('deletes multiple contacts in bulk', () => {
    const count = bulkDeleteContacts(['cnt_1', 'cnt_2']);
    expect(count).toBe(2);
    expect(getAllContacts().length).toBe(1);
  });

  it('exports contacts formatted as CSV payload', () => {
    const csv = exportContactsAsCsv();
    expect(csv).toContain('ID,Name,Email,Phone,Category,Status');
    expect(csv).toContain('Sarah Jenkins');
    expect(csv).toContain('alex@creatorstudio.io');
  });
});
