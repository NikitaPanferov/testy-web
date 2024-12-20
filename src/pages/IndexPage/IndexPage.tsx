import { useQuery } from "react-query";
import TestService from "../../services/TestService";
import TestList from "../../components/TestList";

export const IndexPage = () => {
	const testsQuery = useQuery("tests", TestService.getTests, {
		select: (data) => data.data,
	});

	return (
		<TestList
			tests={testsQuery.data || []}
			invalidateTests={testsQuery.refetch}
		/>
	);
};
