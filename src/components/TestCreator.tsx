import { useState } from "react";
import { Test, Question, QuestionType } from "../models/Test";
import {
	Box,
	Button,
	Checkbox,
	CheckboxGroup,
	CloseButton,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	GridItem,
	HStack,
	Input,
	Select,
	Stack,
	Textarea,
	VStack,
	useToast,
} from "@chakra-ui/react";
import { useMutation } from "react-query";
import TestService from "../services/TestService";
import { useNavigate } from "@tanstack/react-router";
import { copyTestAdress } from "../utils/utils";
import { Button as CustomButton, OutlineButton } from "../UI";

type TestCreatorProps = {
	test?: Test;
};

export const TestCreator: React.FC<TestCreatorProps> = ({ test: inTest }) => {
	const toast = useToast();
	const navigate = useNavigate();
	const [test, setTest] = useState<Test>(
		inTest ?? { title: "", questions: [] }
	);
	const { id: testId } = test ?? {};

	const testMutation = useMutation(
		testId ? TestService.updateTest : TestService.create,
		{
			onSuccess: ({ data }) => {
				const toastId = toast({
					title: `Форма ${data.id} успешно сохранена`,
					description: (
						<Flex justify="center" pt="4px">
							<Button
								onClick={() => {
									copyTestAdress(data.id);
									toast.close(toastId);
								}}
								size="sm"
							>
								Скопировать адресс формы
							</Button>
						</Flex>
					),
					status: "success",
					isClosable: true,
				});
				navigate({
					to: "/",
				});
			},
			onError: (_) => {
				toast({
					title: "Ошибка",
					description: "Не получилось сохранить форму",
					status: "error",
					isClosable: true,
				});
			},
		}
	);

	const addQuestion = () => {
		const newIndex = test.questions.length + 1;
		setTest({
			...test,
			questions: [
				...test.questions,
				{
					index: newIndex,
					type: "answer",
					name: "",
					correctAnswers: [],
				},
			],
		});
	};

	const updateQuestion = (index: number, question: Question) => {
		const newQuestions = [...test.questions];
		newQuestions[index] = question;
		setTest({ ...test, questions: newQuestions });
	};

	const deleteQuestion = (index: number) => {
		const newQuestions = test.questions
			.filter((_, questionIndex) => questionIndex !== index)
			.map((question, newIndex) => ({
				...question,
				order: newIndex + 1,
			}));
		setTest({ ...test, questions: newQuestions });
	};

	const addOption = (index: number) => {
		const question = { ...test.questions[index] };
		if (!question.options) question.options = [];
		question.options.push("");
		updateQuestion(index, question);
	};

	const updateOption = (
		qIndex: number,
		optionIndex: number,
		value: string
	) => {
		const question = { ...test.questions[qIndex] };
		if (!question.options) return;
		question.options[optionIndex] = value;
		updateQuestion(qIndex, question);
	};

	const updateCorrectAnswer = (qIndex: number, value: string | string[]) => {
		const question = { ...test.questions[qIndex] };
		question.correctAnswers = Array.isArray(value) ? value : [value];
		updateQuestion(qIndex, question);
	};

	const deleteOption = (qIndex: number, optionIndex: number) => {
		const question = { ...test.questions[qIndex] };
		if (!question.options) return;
		question.options.splice(optionIndex, 1); // Удаление варианта ответа
		updateQuestion(qIndex, question);
	};

	const saveTest = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.preventDefault();
		if (testId) {
			testMutation.mutate({ ...test, id: testId });
		} else {
			testMutation.mutate(test);
		}
	};

	return (
		<VStack spacing={4} align="stretch">
			<Box p={5} shadow="md" borderRadius="10px">
				<Input
					placeholder="Название формы"
					value={test.title}
					onChange={(e) =>
						setTest({ ...test, title: e.target.value })
					}
				/>
			</Box>
			{test.questions.map((question, index) => (
				<Box key={index} p={5} shadow="md" borderRadius="10px">
					<Select
						placeholder="Выберите тип вопроса"
						value={question.type}
						onChange={(e) =>
							updateQuestion(index, {
								...question,
								type: e.target.value as QuestionType,
								options: [],
								correctAnswers: [],
							})
						}
					>
						<option value="answer">Ответ в свободной форме</option>
						<option value="oneChoice">Один правильный ответ</option>
						<option value="multiChoice">
							Несколько правильных ответов
						</option>
					</Select>
					<Input
						placeholder="Название вопроса"
						value={question.name}
						onChange={(e) =>
							updateQuestion(index, {
								...question,
								name: e.target.value,
							})
						}
						mt={4}
					/>
					<Textarea
						placeholder="Описание"
						value={question.description || ""}
						onChange={(e) =>
							updateQuestion(index, {
								...question,
								description: e.target.value,
							})
						}
						mt={4}
					/>
					{question.type === "answer" && (
						<Input
							placeholder="Правильный ответ"
							value={
								question.correctAnswers
									? question.correctAnswers[0]
									: ""
							}
							onChange={(e) =>
								updateCorrectAnswer(index, e.target.value)
							}
							mt={4}
						/>
					)}
					{(question.type === "oneChoice" ||
						question.type === "multiChoice") && (
						<>
							<Button mt={4} onClick={() => addOption(index)}>
								Добавить вариант ответа
							</Button>
							{question.options?.map((option, optionIndex) => (
								<HStack key={optionIndex} mt={2}>
									<Input
										value={option}
										onChange={(e) =>
											updateOption(
												index,
												optionIndex,
												e.target.value
											)
										}
										placeholder={`Вариант ${optionIndex + 1}`}
									/>
									<CloseButton
										colorScheme="red"
										onClick={() =>
											deleteOption(index, optionIndex)
										}
									/>
								</HStack>
							))}
							<FormControl mt={4}>
								<FormLabel>
									{question.type === "oneChoice"
										? "Выберите правильный ответ"
										: "Выберите правильные ответы"}
								</FormLabel>
								{question.type === "oneChoice" ? (
									<Select
										placeholder="Выберите правильный ответ"
										onChange={(e) =>
											updateCorrectAnswer(
												index,
												e.target.value
											)
										}
									>
										{question.options?.map(
											(option, optionIndex) => (
												<option
													key={optionIndex}
													value={option}
												>
													{option}
												</option>
											)
										)}
									</Select>
								) : (
									<CheckboxGroup
										onChange={(values) =>
											updateCorrectAnswer(
												index,
												values as string[]
											)
										}
									>
										<Stack>
											{question.options?.map(
												(option, optionIndex) => (
													<Checkbox
														key={optionIndex}
														value={option}
													>
														{option}
													</Checkbox>
												)
											)}
										</Stack>
									</CheckboxGroup>
								)}
							</FormControl>
						</>
					)}
					<Button
						mt={4}
						colorScheme="red"
						onClick={() => deleteQuestion(index)}
					>
						Удалить вопрос
					</Button>
				</Box>
			))}
			<Grid
				templateColumns="repeat(3, 1fr)"
				templateRows="repeat(1, 1fr)"
				gap={4}
			>
				<GridItem colSpan={test.questions.length ? 2 : 3}>
					<OutlineButton
						variant="outline"
						width="100%"
						onClick={addQuestion}
					>
						Добавить вопрос
					</OutlineButton>
				</GridItem>
				{!!test.questions.length && (
					<GridItem colSpan={1}>
						<CustomButton
							width="100%"
							onClick={saveTest}
							isLoading={testMutation.isLoading}
						>
							Сохранить форму
						</CustomButton>
					</GridItem>
				)}
			</Grid>
		</VStack>
	);
};
