import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

/**
 * Récupère tous les contacts, avec une option de recherche par nom.
 * @param {string} query - Chaîne de recherche pour filtrer les contacts.
 * @returns {Promise<Array>} - Liste triée de contacts.
 */
export async function getContacts(query) {
	await fakeNetwork(`getContacts:${query}`);
	let contacts = await localforage.getItem("contacts");
	if (!contacts) contacts = [];

	if (query) {
		contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
	}

	return contacts.sort(sortBy("last", "createdAt"));
}

/**
 * Crée un nouveau contact avec un ID unique.
 * @returns {Promise<Object>} - Nouveau contact créé.
 */
export async function createContact() {
	await fakeNetwork();
	let id = Math.random().toString(36).substring(2, 9);
	let contact = { id, createdAt: Date.now() };

	let contacts = await getContacts();
	contacts.unshift(contact);
	await setContacts(contacts);

	return contact;
}

/**
 * Récupère un contact spécifique par son ID.
 * @param {string} id - ID du contact à récupérer.
 * @returns {Promise<Object|null>} - Le contact trouvé ou `null`.
 */
export async function getContact(id) {
	await fakeNetwork(`contact:${id}`);
	let contacts = await localforage.getItem("contacts");
	let contact = contacts?.find((contact) => contact.id === id);
	return contact ?? null;
}

/**
 * Met à jour un contact existant avec de nouvelles données.
 * @param {string} id - ID du contact à mettre à jour.
 * @param {Object} updates - Données à mettre à jour.
 * @returns {Promise<Object>} - Contact mis à jour.
 * @throws {Error} - Si aucun contact n'est trouvé pour l'ID donné.
 */
export async function updateContact(id, updates) {
	await fakeNetwork();
	let contacts = await localforage.getItem("contacts");
	let contact = contacts?.find((contact) => contact.id === id);

	if (!contact) throw new Error(`No contact found for ID: ${id}`);

	Object.assign(contact, updates);
	await setContacts(contacts);

	return contact;
}

/**
 * Supprime un contact par son ID.
 * @param {string} id - ID du contact à supprimer.
 * @returns {Promise<boolean>} - `true` si le contact a été supprimé, sinon `false`.
 */
export async function deleteContact(id) {
	let contacts = await localforage.getItem("contacts");
	let index = contacts?.findIndex((contact) => contact.id === id);

	if (index > -1) {
		contacts.splice(index, 1);
		await setContacts(contacts);
		return true;
	}

	return false;
}

/**
 * Met à jour la liste des contacts dans le stockage local.
 * @param {Array} contacts - Liste des contacts à sauvegarder.
 * @returns {Promise} - Résultat de la mise à jour.
 */
function setContacts(contacts) {
	return localforage.setItem("contacts", contacts);
}

/**
 * Simule une latence réseau pour tester le comportement asynchrone.
 * @param {string} [key] - Clé pour éviter de ralentir des requêtes répétées.
 * @returns {Promise} - Résolution après un délai aléatoire.
 */
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
