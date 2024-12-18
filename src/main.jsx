import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Import des composants et loaders/actions
import Root, {
	loader as rootLoader,
	action as rootAction,
} from "./routes/root";
import ErrorPage from "./error-page";
import Index from "./routes/index";
import Contact, {
	loader as contactLoader,
	action as contactAction,
} from "./routes/contact";
import EditContact, { action as editAction } from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";

// Définition des routes
const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <ErrorPage />,
		loader: rootLoader,
		action: rootAction,
		children: [
			{ index: true, element: <Index /> },
			{
				path: "contacts/:contactId",
				element: <Contact />,
				loader: contactLoader,
				action: contactAction,
				children: [
					{
						path: "edit",
						element: <EditContact />,
						action: editAction,
					},
				],
			},
			{
				path: "contacts/:contactId/destroy",
				action: destroyAction,
				errorElement: <div>Oops! There was an error.</div>,
			},
		],
	},
]);

// Rendu de l'application
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
