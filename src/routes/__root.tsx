import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { Spinner, Center, Container } from "@chakra-ui/react";
import useAuthStore from "../stores/authStore";
import { useQuery } from "react-query";
import { AuthContext } from "../utils/hooks/useAuth";
import Header from "../components/Header";

type RouterContext = {
	authentication: AuthContext;
};

const RootPage: React.FC = () => {
	const { isAuth, checkAuth } = useAuthStore((state) => state);
	const checkAuthQuery = useQuery("check_auth", checkAuth, {
		enabled: false,
		retry: 1,
	});

	useEffect(() => {
		if (localStorage.getItem("access_token")) {
			checkAuthQuery.refetch();
		}
	}, []);

	if (checkAuthQuery.isLoading) {
		return (
			<Center width="100vw" height="100vh">
				<Spinner size="xl" />
			</Center>
		);
	}

	return (
		<>
			{isAuth && <Header />}
			<Container maxW="100%" width="100%" px="200px" py="16px">
				<Outlet />
			</Container>
		</>
	);
};

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootPage,
});
