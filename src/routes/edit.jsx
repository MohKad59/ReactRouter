import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

// Loader pour récupérer les détails d'un contact spécifique
export async function loader({ params }) {
	const contact = await getContact(params.contactId);
	if (!contact) {
		throw new Response("", {
			status: 404,
			statusText: "Not Found",
		});
	}
	return { contact };
}

// Action pour mettre à jour un contact
export async function action({ request, params }) {
	const formData = await request.formData();
	const updates = Object.fromEntries(formData);
	await updateContact(params.contactId, updates);
	return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
	const { contact } = useLoaderData();
	const navigate = useNavigate();

	return (
		<Form method="post" id="contact-form">
			<fieldset>
				<legend>Update Contact Information</legend>

				<p>
					<label>
						<span>First Name</span>
						<input
							type="text"
							name="first"
							placeholder="First"
							aria-label="First name"
							defaultValue={contact?.first}
						/>
					</label>
					<label>
						<span>Last Name</span>
						<input
							type="text"
							name="last"
							placeholder="Last"
							aria-label="Last name"
							defaultValue={contact?.last}
						/>
					</label>
				</p>

				<label>
					<span>Twitter Handle</span>
					<input
						type="text"
						name="twitter"
						placeholder="@example"
						defaultValue={contact?.twitter}
					/>
				</label>

				<label>
					<span>Avatar URL</span>
					<input
						type="text"
						name="avatar"
						placeholder="https://example.com/avatar.jpg"
						aria-label="Avatar URL"
						defaultValue={contact?.avatar}
					/>
				</label>

				<label>
					<span>Notes</span>
					<textarea name="notes" rows={6} defaultValue={contact?.notes} />
				</label>

				<p>
					<button type="submit">Save</button>
					<button type="button" onClick={() => navigate(-1)}>
						Cancel
					</button>
				</p>
			</fieldset>
		</Form>
	);
}
