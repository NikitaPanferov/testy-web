import { useState } from "react";
import {
	Box,
	Checkbox,
	CheckboxGroup,
	Heading,
	Input,
	Radio,
	RadioGroup,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Test, Answer } from "../../models/Test";
import { useMutation } from "react-query";
import TestService from "../../services/TestService";
import { TestResults } from "./TestResults/TestResults";
import { Button } from "../../UI";

interface TestTakerProps {
	test: Test;
}

export const TestTaker: React.FC<TestTakerProps> = ({ test }) => {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [answers, setAnswers] = useState<Answer[]>(
		test.questions.map((question) => {
			return {
				questionIndex: question.index,
				answers: question.type === "answer" ? [""] : [],
			} as Answer;
		})
	);

	const submitMutation = useMutation(
		({ testId, answers }: { testId: string; answers: Answer[] }) => {
			return TestService.submit(testId, answers);
		}
	);

	const handleAnswerChange = (questionIndex: number, answer: string[]) => {
		setAnswers(
			(prevAnswers) =>
				prevAnswers.map((ans) =>
					ans.questionIndex === questionIndex
						? { ...ans, answers: answer }
						: ans
				) as Answer[]
		);
	};

	const handleSubmit = () => {
		if (test.id) {
			submitMutation.mutate({ testId: test.id, answers });
			setIsSubmitted(true);
		}
	};

	if (isSubmitted && submitMutation.isSuccess) {
		return (
			<TestResults
				title={test.title}
				results={submitMutation.data.data}
				questions={test.questions}
				answers={answers}
			/>
		);
	}

	return (
		<VStack spacing={4} align="stretch">
			<Heading>{test.title}</Heading>
			{test.questions.map((question, qIndex) => (
				<Box key={qIndex} p={5} shadow="md" borderRadius="10px">
					<Text fontSize="lg" mb={4}>
						{question.name}
					</Text>
					{question.description && (
						<Text mb={4}>{question.description}</Text>
					)}
					{question.type === "answer" && (
						<Input
							placeholder="Ваш ответ"
							value={
								answers.find(
									(ans) =>
										ans.questionIndex === question.index
								)?.answers[0] || ""
							}
							onChange={(e) =>
								handleAnswerChange(question.index, [
									e.target.value,
								])
							}
						/>
					)}
					{question.type === "oneChoice" && question.options && (
						<RadioGroup
							onChange={(value) =>
								handleAnswerChange(question.index, [value])
							}
						>
							<Stack>
								{question.options.map((option, optionIndex) => (
									<Radio key={optionIndex} value={option}>
										{option}
									</Radio>
								))}
							</Stack>
						</RadioGroup>
					)}
					{question.type === "multiChoice" && question.options && (
						<CheckboxGroup
							onChange={(value) =>
								handleAnswerChange(
									question.index,
									value as string[]
								)
							}
						>
							<Stack>
								{question.options.map((option, optionIndex) => (
									<Checkbox key={optionIndex} value={option}>
										{option}
									</Checkbox>
								))}
							</Stack>
						</CheckboxGroup>
					)}
				</Box>
			))}
			<Button isLoading={submitMutation.isLoading} onClick={handleSubmit}>
				Отправить ответы
			</Button>
		</VStack>
	);
};
