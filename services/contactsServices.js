import Contact from "../models/Contact.js";

export const listContacts = () => Contact.find({}, "-createdAt -updatedAt");

export async function getContactById(id) {
  return Contact.findById(id);
}

export async function removeContact(id) {
  return Contact.findByIdAndDelete(id);
}

export async function addContact(data) {
  return Contact.create(data);
}

export async function updateContact(id, data) {
  return Contact.findByIdAndUpdate(id, data);
}

export async function updateStatusContact(id, data) {
  return Contact.findByIdAndUpdate(id, data);
}
