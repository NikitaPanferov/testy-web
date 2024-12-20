import { createFileRoute } from "@tanstack/react-router";
import { TestPage } from "../../../../pages/TestPage/TestPage";

export const Route = createFileRoute("/_authenticated/test/$testId/")({
	component: TestPage,
});
