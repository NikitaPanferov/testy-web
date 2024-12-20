import { Box, Heading } from "@chakra-ui/react";
import { TestCreator } from "../../components/TestCreator";

export const TestCreatePage = () => {
	return (
		<>
			<Heading mb={5}>Создание новой формы</Heading>
			<Box background="white" p={5} borderRadius="md" boxShadow="base">
				<TestCreator />
			</Box>
		</>
	);
};
