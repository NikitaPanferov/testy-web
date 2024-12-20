import { Route } from "../../routes/_authenticated/test/$testId/index.lazy";
import { useQuery } from "react-query";
import TestService from "../../services/TestService";
import { Center, Spinner, useToast } from "@chakra-ui/react";
import { TestTaker } from "../../components/TestTaker/TestTaker";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import useAuthStore from "../../stores/authStore";

export const TestPage: React.FC = () => {
	const toast = useToast();
	const { user } = useAuthStore((state) => state);
	const navigate = useNavigate();
	const { testId } = Route.useParams();
	const [isOpen, setIsOpen] = useState<boolean | null>(null);

	const { data, isLoading } = useQuery(
		testId,
		() => TestService.get(testId),
		{
			select: (data) => data.data,
			onError: (err: any) => {
				console.log(err.response.status);
				if (err.response?.status === 403) {
					setIsOpen(false);
				} else {
					toast({
						title: "Ошибка",
						description: "Не получилось открыть тест",
						status: "error",
						isClosable: true,
						duration: 2000,
					});
					navigate({ to: "/" });
				}
			},
			onSuccess: (data) => {
				if (data.userId === user?.id) {
					navigate({
						to: "/test/$testId/edit",
						params: { testId: testId },
					});
				}
				setIsOpen(true);
			},
			retry: false,
		}
	);

	if (isLoading) {
		return (
			<Center width="100%" height="100vh">
				<Spinner size="xl" />
			</Center>
		);
	}

	if (isOpen === false) {
		return (
			<Center width="100%" height="100vh">
				<p>Тест пока недоступен.</p>
			</Center>
		);
	}

	if (!data) {
		navigate({ to: "/" });
		return;
	}

	return <TestTaker test={data} />;
};
