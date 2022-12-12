import axios from "axios";
import { ApiKey, Blacklist, ErrorResponse, ErrorResponseExtra, SeraphResponse } from "./SeraphTypes";

export type ClientOptions = {
	/**
	 *  Seraph API Key
	 */
	apiKey: string;
	/**
	 *  Set a custom user agent when making calls to the Seraph API
	 */
	userAgent?: string;
	/**
	 * Set a timeout. Default is 5 seconds ( 5000 ms )
	 */
	timeout?: number;
};

export class SeraphApi {
	private apiKey;
	private readonly axiosInstance;

	constructor(options: ClientOptions) {
		this.apiKey = options.apiKey;
		this.axiosInstance = axios.create({
			headers: {
				"run-api-key": options.apiKey,
				"User-Agent": options?.userAgent ?? "seraph-library",
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			baseURL: "https://api.seraph.si/",
			timeout: options?.timeout ?? 5000,
			timeoutErrorMessage: JSON.stringify({
				success: false,
				cause: `I have timed out. Response took longer than ${options?.timeout ?? 5000} milliseconds.`,
				code: 500,
				extra: [
					{
						name: "Timeout",
						code: 500,
						reason: "The library has timed out.",
						developer_reason: `Please check you're connected to the internet and the Seraph API is up. If the API is down, Contact us via discord immedietly.`,
					},
				],
				documentation: "https://api.seraph.si",
				msTime: Date.now(),
			}),
			validateStatus: () => true,
		});
	}

	public async isKeyValid(): SeraphResponse<ApiKey> {
		const { data } = await this.axiosInstance.get<ApiKey>("/key");
		return data;
	}

	public async getPlayerBlacklist(uuid: string): SeraphResponse<Blacklist> {
		if (this.validateUuid(uuid)) {
			const { data } = await this.axiosInstance.get<Blacklist>(`/blacklist?uuid=${uuid}`);
			return data;
		} else {
			return this.validateErrorFromMethod(`The UUID provided didn't match`);
		}
	}

	private validateUuid(uuid: string) {
		return uuid.match(/^[0-9a-f]{32}$/);
	}

	private validateErrorFromMethod(cause: string): ErrorResponse {
		const extra: Array<ErrorResponseExtra> = [
			{
				name: "Invalid Request",
				code: 400,
				reason: cause,
			},
		];
		return {
			success: false,
			code: 400,
			cause,
			extra,
			documentation: "https://api.seraph.si",
			msTime: Date.now(),
		};
	}
}
