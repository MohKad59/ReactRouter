import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

export async function action({ params }) {
	try {
		await deleteContact(params.contactId);
		return redirect("/");
	} catch (error) {
		console.error("Failed to delete contact:", error);
		throw new Response("Failed to delete the contact.", {
			status: 500,
			statusText: "Internal Server Error",
		});
	}
}
