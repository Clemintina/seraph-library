import axios from "axios";
import { ApiKey, Blacklist, ErrorResponse, ErrorResponseExtra, LunarAPIResponse, PlayerFinderResponse, SeraphResponse } from "./SeraphTypes";

/**
 * Options which can modify the behaviour of the client
 */
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

/**
 * The default message for invalid UUIDs which don't match the required format
 */
const UUID_NOT_VALID = "The UUID provided doesn't match the undashed type required";

export class SeraphApi {
	private apiKey;
	/**
	 * The axios client we use to send requests with preconfigured headers and timeouts
	 * @private
	 */
	private readonly axiosInstance;

	constructor(options: ClientOptions) {
		this.apiKey = options.apiKey;
		this.axiosInstance = axios.create({
			headers: {
				"run-api-key": options.apiKey,
				"User-Agent": options?.userAgent ?? "seraph-library",
				"Content-Type": "application/json",
				"Accept-Encoding": "gzip,deflate,compress",
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

	/**
	 * Checks if the key is valid
	 * @return ApiKey
	 */
	public async isKeyValid(): Promise<ApiKey> {
		const { data } = await this.axiosInstance.get<ApiKey>("/key");
		return data;
	}

	/**
	 * Gets the relevant information about the player such as blacklisted, safelisted and encounters
	 * @param uuid The player's un-dashed UUID
	 * @return Blacklist
	 */
	public async getPlayerBlacklist(uuid: string): SeraphResponse<Blacklist> {
		if (this.validateUuid(uuid)) {
			const { data } = await this.axiosInstance.get<Blacklist>(`/blacklist?uuid=${uuid}`);
			return data;
		} else {
			return this.validateErrorFromMethod(UUID_NOT_VALID);
		}
	}

	/**
	 * Gets information about the player such as Online status, Current cosmetics and Lunar plus
	 * @param uuid - The player's un-dashed UUID
	 * @return LunarAPIResponse
	 */
	public async getPlayerLunar(uuid: string): SeraphResponse<LunarAPIResponse> {
		if (this.validateUuid(uuid)) {
			const { data } = await this.axiosInstance.get<LunarAPIResponse>(`/lunar/${uuid}`);
			return data;
		} else {
			return this.validateErrorFromMethod(UUID_NOT_VALID);
		}
	}

	/**
	 * Gets a list of UUIDs generated every 3-5 minutes
	 * @return Array<string>
	 */
	public async getPlayerFinder(): SeraphResponse<PlayerFinderResponse> {
		const { data } = await this.axiosInstance.get<PlayerFinderResponse>(`/playerfinder`);
		return data;
	}

	/**
	 * Validates a player's UUID as un-dashed
	 * @param uuid - The player's un-dashed UUID
	 * @return boolean
	 * @private
	 */
	private validateUuid(uuid: string) {
		return uuid.match(/^[0-9a-f]{32}$/);
	}

	/**
	 * Replicates the Error schema based on the API's format
	 * @param cause - The reason for the error
	 * @param extraErrors - Additional errors if there are multiple
	 * @return ErrorResponse
	 * @private
	 */
	private validateErrorFromMethod(cause: string, extraErrors?: Array<ErrorResponseExtra>): ErrorResponse {
		const extra: Array<ErrorResponseExtra> = [
			{
				name: "Invalid Request",
				code: 400,
				reason: cause,
			},
		];
		if (extraErrors) {
			extraErrors.map((err) => extra.push(err));
		}
		return {
			success: false,
			code: 400,
			cause,
			extra,
			documentation: "https://antisniper.seraph.si",
			msTime: Date.now(),
		};
	}
}
