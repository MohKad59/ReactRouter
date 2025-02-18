import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function getContacts(query) {
	await fakeNetwork(`getContacts:${query}`);
	let contacts = await localforage.getItem("contacts");
	if (!contacts) contacts = [];

	if (query) {
		contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
	}

	return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
	await fakeNetwork();
	const id = Math.random().toString(36).substring(2, 9);
	const contact = { id, createdAt: Date.now() };

	const contacts = await getContacts();
	contacts.unshift(contact);
	await setContacts(contacts);

	return contact;
}

export async function getContact(id) {
	await fakeNetwork(`contact:${id}`);
	const contacts = await localforage.getItem("contacts");
	const contact = contacts?.find((contact) => contact.id === id);
	return contact ?? null;
}

export async function updateContact(id, updates) {
	await fakeNetwork();
	const contacts = await localforage.getItem("contacts");
	const contact = contacts?.find((contact) => contact.id === id);

	if (!contact) throw new Error(`No contact found for ID: ${id}`);

	Object.assign(contact, updates);
	await setContacts(contacts);

	return contact;
}

export async function deleteContact(id) {
	const contacts = await localforage.getItem("contacts");
	const index = contacts?.findIndex((contact) => contact.id === id);

	if (index > -1) {
		contacts.splice(index, 1);
		await setContacts(contacts);
		return true;
	}

	return false;
}

function setContacts(contacts) {
	return localforage.setItem("contacts", contacts);
}

let fakeCache = {};

async function fakeNetwork(key) {
	if (!key) {
		fakeCache = {};
	}

	if (fakeCache[key]) {
		return;
	}

	fakeCache[key] = true;
	return new Promise((resolve) => {
		setTimeout(resolve, Math.random() * 800);
	});
}
