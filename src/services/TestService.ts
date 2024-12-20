import $api from "../api";
import { AxiosResponse } from "axios";
import { Answer, Test } from "../models/Test";
import {
	CreateTestResponse,
	TestsResponse,
	GetTestResponse,
	ResultsResponse,
} from "../models/response/TestResponse";

export default class TestService {
	static async create(
		test: Test
	): Promise<AxiosResponse<CreateTestResponse>> {
		return $api.post("api/test", { test });
	}

	static async get(testId: string): Promise<AxiosResponse<GetTestResponse>> {
		return $api.get(`api/test/${testId}`);
	}

	static async submit(
		testId: string,
		answers: Answer[]
	): Promise<AxiosResponse<ResultsResponse>> {
		return $api.post(`api/test/${testId}`, answers);
	}

	static async getTests(): Promise<AxiosResponse<TestsResponse>> {
		return $api.get("api/test");
	}

	static async deleteTest(testId: string) {
		return $api.delete(`api/test/${testId}`);
	}

	static async updateTest(
		test: Test
	): Promise<AxiosResponse<CreateTestResponse>> {
		return $api.put("api/test", test);
	}

	static async setIsOpen(testId: string, isOpen: boolean) {
		return $api.post(`api/test/${testId}/set_is_open`, { isOpen });
	}
}
