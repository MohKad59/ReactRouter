import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

// Action pour supprimer un contact
export async function action({ params }) {
	try {
		// Suppression du contact
		await deleteContact(params.contactId);

		// Redirection vers la page d'accueil après suppression
		return redirect("/");
	} catch (error) {
		// Gestion des erreurs (par exemple, si le contact n'existe pas ou si une erreur réseau survient)
		console.error("Failed to delete contact:", error);
		throw new Response("Failed to delete the contact.", {
			status: 500,
			statusText: "Internal Server Error",
		});
	}
}
