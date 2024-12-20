import { createLazyFileRoute } from "@tanstack/react-router";
import { TestCreatePage } from "../../../pages/TestCreatePage/TestCreatePage";

export const Route = createLazyFileRoute("/_authenticated/test/")({
	component: TestCreatePage,
});
