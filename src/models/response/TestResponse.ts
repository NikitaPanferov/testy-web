import { Test, Result } from "../Test";

export type CreateTestResponse = {
	id: string;
};

export type GetTestResponse = Test & {
	userId: number;
};

export type ResultsResponse = Result[];

export type TestsResponse = (Test & { isOpen: boolean })[];
