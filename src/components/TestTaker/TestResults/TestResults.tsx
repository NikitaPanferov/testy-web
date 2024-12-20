import { Answer, Question, Result } from "../../../models/Test";
import {
	Box,
	Text,
	Badge,
	VStack,
	CircularProgress,
	Flex,
	Heading,
} from "@chakra-ui/react";

type TestResultProps = {
	title: string;
	questions: Question[];
	results: Result[];
	answers: Answer[];
};

export const TestResults: React.FC<TestResultProps> = ({
	title,
	questions,
	results,
	answers,
}) => {
	const rightAnswers = results.filter((result) => result.isRight).length;
	const totalQuestions = questions.length;
	const percentage = Math.round((rightAnswers / totalQuestions) * 100);

	return (
		<VStack spacing={4} align="stretch">
			<Heading>{title}</Heading>
			{results.map((result, index) => {
				const question = questions.find(
					(q) => q.index === result.questionIndex
				);
				const answer = answers.find(
					(a) => a.questionIndex === result.questionIndex
				);
				const userAnswers =
					answer && answer.answers.length > 0 && answer.answers[0] !== ""
						? answer.answers.join(", ")
						: "Нет ответа";

				return (
					<Box
						key={index}
						p={5}
						shadow="md"
						borderRadius="lg"
						overflow="hidden"
					>
						<Text fontSize="lg" fontWeight="bold">
							{question
								? `${result.questionIndex}) ${question.name}`
								: "Вопрос не найден"}
						</Text>
						<Badge
							ml="1"
							fontSize="0.8em"
							colorScheme={result.isRight ? "green" : "red"}
						>
							{result.isRight ? "ВЕРНО" : "НЕВЕРНО"}
						</Badge>
						<Text mt={2} fontSize="md">
							Ваш ответ: {userAnswers}
						</Text>
					</Box>
				);
			})}
			<Flex
				p={5}
				shadow="md"
				borderRadius="lg"
				align="center"
				justify={"space-evenly"}
			>
				<Text fontSize="2xl" fontWeight="bold">
					{rightAnswers} из {totalQuestions}
				</Text>
				<Flex align="center" gap="4">
					<CircularProgress
						size="100px"
						thickness="10px"
						value={percentage}
						color="green.400"
					/>
					<Text fontSize="2xl" fontWeight="bold">
						{percentage}%
					</Text>
				</Flex>
			</Flex>
		</VStack>
	);
};
