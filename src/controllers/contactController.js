const contactService = require('../services/contactService');

class ContactController {
  async getContacts(req, res) {
    try {
      const contacts = await contactService.getAllContacts();
      return res.status(200).json(contacts);
    } catch (error) {
      return res.status(500).json({ error: 'Error interno al obtener los contactos.' });
    }
  }

  async createContact(req, res) {
    try {
      const { nombre, apellido, telefono } = req.body || {};

      if (!nombre || !apellido || !telefono) {
        return res.status(400).json({
          error: 'Datos incompletos. Debe proporcionar nombre, apellido y telefono.'
        });
      }

      const newContact = await contactService.addContact({ nombre, apellido, telefono });
      return res.status(201).json(newContact);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ContactController();
