const express = require("express");
const router = express.Router();

const {getContacts, getContact, createContact, editContact, deleteContact, getUsers} = require('../controllers/contactController');

router.route('/').get(getContacts).post(createContact)
router.route('/:id').get(getContact).put(editContact).delete(deleteContact)

router.route('/users').get(getUsers);


module.exports = router;