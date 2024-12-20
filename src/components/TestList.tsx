import { useState } from "react";
import {
	HStack,
	VStack,
	Text,
	Button,
	Tooltip,
	useToast,
	Heading,
	LinkBox,
	LinkOverlay,
} from "@chakra-ui/react";
import { CheckIcon, CopyIcon, DeleteIcon, ViewOffIcon } from "@chakra-ui/icons";
import { copyTestAdress } from "../utils/utils";
import { Link } from "@tanstack/react-router";
import { useMutation } from "react-query";
import TestService from "../services/TestService";
import { TestsResponse } from "../models/response/TestResponse";

type TestListProps = {
	tests: TestsResponse;
	invalidateTests: () => void;
};

const TestList: React.FC<TestListProps> = ({ tests, invalidateTests }) => {
	const toast = useToast();
	const [deletedTest, setDeletedTest] = useState<string | null>(null);

	const deleteTestMutation = useMutation(
		({ testId }: { testId: string }) => {
			return TestService.deleteTest(testId);
		},
		{
			onSuccess: () => {
				invalidateTests();
				toast({
					title: `Тест успешно удален`,
					status: "success",
					isClosable: true,
					duration: 1000,
				});
				setDeletedTest(null);
			},
			onError: () => {
				toast({
					title: "Ошибка",
					description: "Не получилось удалить форму",
					status: "error",
					isClosable: true,
				});
				setDeletedTest(null);
			},
		}
	);

	const toggleMutation = useMutation(
		({ testId, isOpen }: { testId: string; isOpen: boolean }) =>
			TestService.setIsOpen(testId, !isOpen),
		{
			onSuccess: () => {
				invalidateTests();
			},
		}
	);

	const deleteTest = (testId: string) => {
		setDeletedTest(testId);
		deleteTestMutation.mutate({ testId });
	};

	return (
		<VStack width="100%">
			{tests.map((test) => (
				<LinkBox
					position="relative"
					p={2}
					shadow="md"
					borderRadius="10px"
					width="100%"
					key={test.id}
				>
					<HStack width="100%" justify={"space-between"} p={2}>
						<VStack justify="flex-start" align="flex-start">
							<LinkOverlay
								as={Link}
								to="test/$testId/edit"
								params={{ testId: test.id || "" }}
							>
								<Heading fontSize="1.5rem">
									{test.title}
								</Heading>
							</LinkOverlay>
							<Text>
								Количество вопросов: {test.questions.length}
							</Text>
						</VStack>
						<HStack>
							<Tooltip label="Изменить видимость">
								<Button
									onClick={() => {
										toggleMutation.mutate({
											testId: test.id!,
											isOpen: test.isOpen,
										});
									}}
									isLoading={toggleMutation.isLoading}
									color={test.isOpen ? "green" : "red"}
								>
									{test.isOpen ? (
										<CheckIcon />
									) : (
										<ViewOffIcon />
									)}
								</Button>
							</Tooltip>
							<Tooltip label="Скопировать ссылку">
								<Button
									onClick={() =>
										copyTestAdress(test.id || "")
									}
								>
									<CopyIcon />
								</Button>
							</Tooltip>
							<Tooltip label="Удалить тест">
								<Button
									colorScheme="red"
									isLoading={deletedTest == test.id}
									onClick={() => deleteTest(test.id || "")}
								>
									<DeleteIcon />
								</Button>
							</Tooltip>
						</HStack>
					</HStack>
				</LinkBox>
			))}
		</VStack>
	);
};

export default TestList;
