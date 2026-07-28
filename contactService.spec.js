// contactService.spec.js
// Unit tests for contactService.
// Created: 2026-07-27

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAllContacts,
  getPaginatedContacts,
  getFavoriteContacts,
  toggleFavoriteContact,
  logContactActivity,
  addCustomField,
  removeCustomField,
  detectDuplicateContacts,
  mergeDuplicateContacts,
  setContactReminder,
  clearContactReminder,
  getUpcomingReminders,
  getAnalyticsSummary,
  exportContactsAsVcard,
  importContactsFromJson,
  generateGravatarUrl,
  updateContactAvatar,
  getCategoryStats,
  getContactById,
  addContact,
  addContactNote,
  updateContact,
  deleteContact,
  bulkDeleteContacts,
  exportContactsAsCsv,
  validateContactInput,
  resetContactsStore
} from './contactService.js';

describe('contactService', () => {
  beforeEach(() => {
    resetContactsStore();
  });

  it('retrieves initial list of contacts sorted by name ascending', () => {
    const contacts = getAllContacts('', 'All', 'name', 'asc');
    expect(contacts.length).toBe(3);
    expect(contacts[0].name).toBe('Alex Rivera');
    expect(contacts[1].name).toBe('Elena Rostova');
    expect(contacts[2].name).toBe('Sarah Jenkins');
  });

  it('exports contacts formatted as valid RFC 6350 vCard payload', () => {
    const vcard = exportContactsAsVcard();
    expect(vcard).toContain('BEGIN:VCARD');
    expect(vcard).toContain('VERSION:3.0');
    expect(vcard).toContain('FN:Sarah Jenkins');
    expect(vcard).toContain('EMAIL;TYPE=INTERNET:sarah.jenkins@brandpartners.com');
    expect(vcard).toContain('TEL;TYPE=CELL:+1 (555) 234-5678');
    expect(vcard).toContain('END:VCARD');
  });

  it('calculates comprehensive CRM analytics metrics summary', () => {
    const analytics = getAnalyticsSummary();
    expect(analytics.total).toBe(3);
    expect(analytics.favoritesCount).toBe(2);
    expect(analytics.activeCount).toBe(2);
    expect(analytics.pendingCount).toBe(1);
    expect(analytics.categoryBreakdown.Sponsor).toBe(1);
    expect(analytics.categoryBreakdown.Collaborator).toBe(1);
    expect(analytics.categoryBreakdown.Agency).toBe(1);
    expect(analytics.totalNotes).toBe(2);
    expect(analytics.totalCustomFields).toBe(4);
    expect(analytics.totalActivities).toBe(6);
  });

  it('schedules and clears contact follow-up reminders', () => {
    setContactReminder('cnt_3', '2026-08-01', 'Follow up on agency talent deck');
    let contact = getContactById('cnt_3');
    expect(contact.followUpDate).toBe('2026-08-01');
    expect(contact.reminderNote).toBe('Follow up on agency talent deck');
    expect(contact.activityLog[0].action).toBe('REMINDER_SET');

    clearContactReminder('cnt_3');
    contact = getContactById('cnt_3');
    expect(contact.followUpDate).toBeNull();
    expect(contact.activityLog[0].action).toBe('REMINDER_CLEAR');
  });

  it('retrieves upcoming and overdue follow-up reminders sorted by date', () => {
    const reminders = getUpcomingReminders();
    expect(reminders.length).toBe(2);
    expect(reminders[0].contact.name).toBe('Alex Rivera');
    expect(reminders[0].status).toBe('overdue');
  });

  it('detects duplicate contacts sharing identical email address', () => {
    addContact({ name: 'Sarah Jenkins Duplicate', email: 'sarah.jenkins@brandpartners.com' });
    const duplicates = detectDuplicateContacts();
    expect(duplicates.length).toBe(1);
    expect(duplicates[0].email).toBe('sarah.jenkins@brandpartners.com');
    expect(duplicates[0].contacts.length).toBe(2);
  });

  it('merges duplicate contacts into primary contact profile', () => {
    const dup = addContact({ name: 'Sarah Jenkins Duplicate', email: 'sarah.jenkins@brandpartners.com' });
    addContactNote(dup.id, 'Duplicate note to be merged.');
    
    mergeDuplicateContacts('cnt_1', [dup.id]);

    const target = getContactById('cnt_1');
    expect(getAllContacts().length).toBe(3);
    expect(target.notes.some(n => n.text === 'Duplicate note to be merged.')).toBe(true);
    expect(target.activityLog[0].action).toBe('MERGE');
  });

  it('adds and removes custom metadata key-value fields', () => {
    addCustomField('cnt_1', 'Twitter', '@sarah_j');
    let contact = getContactById('cnt_1');
    expect(contact.customFields.length).toBe(3);
    expect(contact.customFields.find(f => f.key === 'Twitter').value).toBe('@sarah_j');

    removeCustomField('cnt_1', 'Twitter');
    contact = getContactById('cnt_1');
    expect(contact.customFields.length).toBe(2);
  });

  it('throws error when adding custom field without key or value', () => {
    expect(() => addCustomField('cnt_1', '', 'value')).toThrow();
    expect(() => addCustomField('cnt_1', 'key', '')).toThrow();
  });

  it('paginates contact records cleanly', () => {
    const paginated = getPaginatedContacts('', 'All', 'name', 'asc', 1, 2);
    expect(paginated.contacts.length).toBe(2);
    expect(paginated.totalCount).toBe(3);
    expect(paginated.totalPages).toBe(2);
    expect(paginated.page).toBe(1);

    const page2 = getPaginatedContacts('', 'All', 'name', 'asc', 2, 2);
    expect(page2.contacts.length).toBe(1);
    expect(page2.contacts[0].name).toBe('Sarah Jenkins');
  });

  it('sorts contacts by name descending', () => {
    const contacts = getAllContacts('', 'All', 'name', 'desc');
    expect(contacts[0].name).toBe('Sarah Jenkins');
    expect(contacts[2].name).toBe('Alex Rivera');
  });

  it('sorts contacts by email ascending', () => {
    const contacts = getAllContacts('', 'All', 'email', 'asc');
    expect(contacts[0].email).toBe('alex@creatorstudio.io');
  });

  it('imports bulk contacts from JSON array payload', () => {
    const jsonPayload = JSON.stringify([
      { name: 'David Kim', email: 'david@startup.io', category: 'Sponsor' },
      { name: 'Rachel Green', email: 'rachel@fashion.com', category: 'VIP' }
    ]);
    const res = importContactsFromJson(jsonPayload);
    expect(res.importedCount).toBe(2);
    expect(res.errors.length).toBe(0);
    expect(getAllContacts().length).toBe(5);
  });

  it('throws error when importing invalid JSON syntax', () => {
    expect(() => importContactsFromJson('{ invalid-json')).toThrow('Invalid JSON syntax');
  });

  it('logs and tracks contact activity audit entries', () => {
    logContactActivity('cnt_1', 'TEST_ACTION', 'Testing activity logger.');
    const contact = getContactById('cnt_1');
    expect(contact.activityLog.length).toBe(4);
    expect(contact.activityLog[0].action).toBe('TEST_ACTION');
  });

  it('automatically logs activity when contact is updated or starred', () => {
    toggleFavoriteContact('cnt_3');
    const contact = getContactById('cnt_3');
    expect(contact.activityLog[0].action).toBe('STARRED');
  });

  it('generates Gravatar / Identicon URLs correctly', () => {
    const url = generateGravatarUrl('test@example.com');
    expect(url).toContain('dicebear.com');
    expect(url).toContain('test%40example.com');
  });

  it('updates contact custom avatar URL', () => {
    const updated = updateContactAvatar('cnt_1', 'https://example.com/avatar.jpg');
    expect(updated.avatarUrl).toBe('https://example.com/avatar.jpg');
  });

  it('retrieves favorite contacts list', () => {
    const favorites = getFavoriteContacts();
    expect(favorites.length).toBe(2);
    expect(favorites[0].isFavorite).toBe(true);
  });

  it('toggles contact favorite state correctly', () => {
    const updated = toggleFavoriteContact('cnt_3');
    expect(updated.isFavorite).toBe(true);
    expect(getFavoriteContacts().length).toBe(3);
  });

  it('validates email format regex correctly', () => {
    expect(() => validateContactInput({ name: 'Test', email: 'invalid-email' })).toThrow('Invalid email format');
    expect(validateContactInput({ name: 'Test', email: 'valid@example.com' })).toBe(true);
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
    expect(newContact.activityLog.length).toBe(1);
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
