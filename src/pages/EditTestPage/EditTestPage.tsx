import {
	Center,
	Spinner,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useToast,
} from "@chakra-ui/react";
import { Route } from "../../routes/_authenticated/test/$testId/edit.lazy";
import { TestTaker } from "../../components/TestTaker/TestTaker";
import { TestCreator } from "../../components/TestCreator";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "react-query";
import TestService from "../../services/TestService";

export const EditTestPage = () => {
	const { testId } = Route.useParams();
	const toast = useToast();
	const navigate = useNavigate();

	const { isLoading: isTestLoading, data } = useQuery(
		["fetchTest", testId],
		() => TestService.get(testId!),
		{
			select: (data) => data.data,
			onError: (_) => {
				toast({
					title: "Ошибка",
					description: "Не получилось запросить форму",
					status: "error",
					isClosable: true,
				});
				navigate({
					to: "/",
				});
			},
		}
	);

	if (isTestLoading) {
		return (
			<Center>
				<Spinner size="xl" />
			</Center>
		);
	}

	return (
		<Tabs defaultIndex={1}>
			<TabList justifyContent="center">
				<Tab>Пройти</Tab>
				<Tab>Редактировать</Tab>
				{/* <Tab>Отчёт</Tab> */}
			</TabList>
			<TabPanels>
				<TabPanel>
					<TestTaker test={data!} />
				</TabPanel>
				<TabPanel>
					<TestCreator test={data} />
				</TabPanel>
				{/* <TabPanel></TabPanel> */}
			</TabPanels>
		</Tabs>
	);
	// return <testCreator testId={testId} />;
};
