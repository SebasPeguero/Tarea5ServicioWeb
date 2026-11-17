const fs = require('fs/promises');
const path = require('path');
const Contact = require('../models/Contact');

class ContactService {
  constructor() {
    this.filePath = path.join(__dirname, '../data/contacts.json');
    this.memoryContacts = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(data);
      this.memoryContacts = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      this.memoryContacts = [];
    }
    this.initialized = true;
  }

  async getAllContacts() {
    await this.init();
    return this.memoryContacts;
  }

  async addContact(contactData) {
    await this.init();
    const contact = new Contact(contactData.nombre, contactData.apellido, contactData.telefono);

    if (!contact.isValid()) {
      throw new Error('Los campos nombre, apellido y telefono son obligatorios.');
    }

    const contactObj = contact.toJSON();
    this.memoryContacts.push(contactObj);

    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.memoryContacts, null, 2), 'utf-8');
    } catch (error) {
      console.error(error);
    }

    return contactObj;
  }
}

module.exports = new ContactService();
