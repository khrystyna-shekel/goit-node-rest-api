import Contact from "../models/Contact.js";

export const listContacts = () => Contact.find({}, "-createdAt -updatedAt");

export const getContactById = (id) => {
  return Contact.findById(id);
};

export async function removeContact(contactId) {
  // const contacts = await listContacts();
  // const index = contacts.findIndex((contact) => contactId === contact.id);
  // if (index === -1) {
  //   return null;
  // }
  // const [result] = contacts.splice(index, 1);
  // await updateContacts(contacts);
  // return result;
}

export const addContact = (data) => Contact.create(data);

export const updateContact = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true });
