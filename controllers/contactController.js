// desc Get alL contacts
// route GET /api/cotacts
// access private

const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModal')

const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts)
})

const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found!");
    }
    else {
        res.status(200).json(contact)
    }
});

const createContact = asyncHandler(async (req, res) => {
    const {name, email, phone } = req.body
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const contact = await Contact.create({
        name, email, phone, user_id: req.user.id
    })
    res.status(201).json(contact)
})
 

const editContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found!");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403).json({message: "User dont have the permission"});
        throw new Error("User dont have the permission");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.status(200).json({data: `contact updated ${req.params.id}`, contact: updatedContact})
})

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found!");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403).json({message: "User dont have the permission"});
        throw new Error("User dont have the permission");
    }
    

    const deletingContact = await Contact.findByIdAndDelete(
        req.params.id,
    )
    res.status(200).json({data: `deleted contact ${req.params.id}`})
})



module.exports = { getContacts, getContact, createContact, editContact, deleteContact };