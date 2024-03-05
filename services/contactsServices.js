import Contact from "../models/Contact.js";

export const listContacts = () => Contact.find({}, "-createdAt -updatedAt");

export const listContactsByFilter = (filter, query = {}) =>
  Contact.find(filter, "-createdAt -updatedAt", query);

export const listContactsCountByFilter = (filter) =>
  Contact.countDocuments(filter);

export function getContactById(id) {
  return Contact.findById(id);
}

export function getContactByFilter(filter) {
  return Contact.findOne(filter);
}

export function removeContact(id) {
  return Contact.findByIdAndDelete(id);
}

export function removeContactByFilter(filter) {
  return Contact.findByOneAndDelete(filter);
}

export function addContact(data) {
  return Contact.create(data);
}

export function updateContact(id, data) {
  return Contact.findByIdAndUpdate(id, data);
}

export function updateContactByFilter(filter, data) {
  return Contact.findByOneAndUpdate(filter, data);
}

export function updateStatusContact(id, data) {
  return Contact.findByIdAndUpdate(id, data);
}

export function updateStatusContactByFilter(filter, data) {
  return Contact.findByOneAndUpdate(filter, data);
}
