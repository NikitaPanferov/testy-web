import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";

import { routeTree } from "./routeTree.gen";
import useAuthStore from "./stores/authStore";

const router = createRouter({
	routeTree,
	context: { authentication: undefined! },
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const queryClient = new QueryClient();

const App = () => {
	return (
		<RouterProvider
			router={router}
			context={{ authentication: useAuthStore((state) => state) }}
		/>
	);
};

const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
	const root = createRoot(rootElement);
	root.render(
		<StrictMode>
			<ChakraProvider>
				<QueryClientProvider client={queryClient}>
					<App />
				</QueryClientProvider>
			</ChakraProvider>
		</StrictMode>
	);
}
