import { APIResponse } from "../Models/ApiResponse";

export enum API_PATHS {
	PROJECT = "/project",
	ADMIN = "/admin",
	TAGS = "/tag",
	BASE = "/",
}

export default class API {
	private authToken = "";
	private get defaultBlock(): RequestInit {
		return {
			headers: new Headers({
				"content-type": "application/json",
				"jwt": this.authToken,
			}),
			mode: "cors",
		};
	}
	private get baseUrl(): string {
		return window.location.origin;
	}
	setAuthToken = (authToken: string): void => {
		this.authToken = authToken;
	};
	post = async (
		path: API_PATHS,
		endpoint: string,
		body?: unknown,
		requestInit?: RequestInit
	): Promise<APIResponse> => {
		const init = requestInit ?? this.defaultBlock;
		if (body) {
			init.body = JSON.stringify(body);
		}
		init.method = "POST";
		const response = await fetch(`${this.baseUrl}${path}${endpoint}`, init);
		return await response.json();
	};
	get = async (
		path: API_PATHS,
		endpoint: string,
		requestInit?: RequestInit
	): Promise<APIResponse> => {
		const init = requestInit ?? this.defaultBlock;
		init.method = "GET";
		const response = await fetch(`${this.baseUrl}${path}${endpoint}`, init);
		return await response.json();
	};
	put = async (
		path: API_PATHS,
		endpoint: string,
		body?: unknown,
		requestInit?: RequestInit
	): Promise<APIResponse> => {
		const init = requestInit ?? this.defaultBlock;
		if (body) {
			init.body = JSON.stringify(body);
		}
		init.method = "PUT";
		const response = await fetch(`${this.baseUrl}${path}${endpoint}`, init);
		return await response.json();
	};
	delete = async (
		path: API_PATHS,
		endpoint: string,
		body?: never,
		requestInit?: RequestInit
	): Promise<APIResponse> => {
		const init = requestInit ?? this.defaultBlock;
		if (body) {
			init.body = JSON.stringify(body);
		}
		init.method = "DELETE";
		const response = await fetch(`${this.baseUrl}${path}${endpoint}`, init);
		return await response.json();
	};
}
