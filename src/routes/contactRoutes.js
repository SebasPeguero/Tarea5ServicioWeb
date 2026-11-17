const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.get('/agenda.php', (req, res) => contactController.getContacts(req, res));
router.post('/agenda.php', (req, res) => contactController.createContact(req, res));

router.get('/api/contactos', (req, res) => contactController.getContacts(req, res));
router.post('/api/contactos', (req, res) => contactController.createContact(req, res));

module.exports = router;
