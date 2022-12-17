import axios from "axios";
import { ApiKey, Blacklist, ErrorResponse, ErrorResponseExtra, LunarAPIResponse, PlayerFinderResponse, SeraphResponse } from "./SeraphTypes";
import { AccountInformation, ApiKey as PolsuApiKey, BedwarsDreams, BedwarsMap, BedwarsMaps, KnownBedwarsMaps, MinecraftAPI, MinecraftServer, PolsuResponse, ServiceStats, ServiceStatus, Session } from "./PolsuTypes";

/**
 * Options which can modify the behaviour of the client
 */
export type ClientOptions = {
	/**
	 *  Service API Key
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

/**
 * Validates a player's UUID as un-dashed
 * @param uuid - The player's un-dashed UUID
 * @return boolean
 * @private
 */
const validateUuid = (uuid: string) => {
	return uuid.match(/^[0-9a-f]{32}$/);
};

/**
 * Constructs the Seraph API Instance. You will need to use either 'public' or a Seraph Key provided to access the API. For more information, Visit our documentation at https://antisniper.seraph.si
 */
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
		if (validateUuid(uuid)) {
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
		if (validateUuid(uuid)) {
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

/**
 * Constructs the Polsu API instance. You will need an API key from Polsu which you can generate using /apikey. Join their discord https://discord.gg/polsu if the bot is not in your server.
 */
export class PolsuApi {
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
				"API-Key": options.apiKey,
				"User-Agent": options?.userAgent ?? "seraph-library",
				"Content-Type": "application/json",
				"Accept-Encoding": "gzip,deflate,compress",
				Accept: "application/json",
			},
			baseURL: "https://api.polsu.xyz/",
			timeout: options?.timeout ?? 5000,
			timeoutErrorMessage: JSON.stringify({
				success: false,
				cause: `I have timed out. Response took longer than ${options?.timeout ?? 5000} milliseconds.`,
				code: 500,
			}),
			validateStatus: () => true,
		});
	}

	/**
	 * Gets the Service Status of Polsu, Polsu API, Croustillant, and the Launch time of the API.
	 */
	public async getServiceStatus(): PolsuResponse<ServiceStatus> {
		const { data, status } = await this.axiosInstance.get<PolsuResponse<ServiceStatus>>(`/services/status`);
		return {
			...data,
			code: status,
		};
	}

	/**
	 * Gets the Service Statistics of Polsu such as User count, Player count and other metrics
	 */
	public async getServiceStatistics(): PolsuResponse<ServiceStats> {
		const { data, status } = await this.axiosInstance.get<PolsuResponse<ServiceStats>>(`/services/stats`);
		return {
			...data,
			code: status,
		};
	}

	/**
	 * Gets information about the API key provided
	 * @return PolsuApiKey
	 */
	public async getKeyInformation(): PolsuResponse<PolsuApiKey> {
		const { data, status } = await this.axiosInstance.get<PolsuResponse<PolsuApiKey>>(`/api/key`);
		return {
			...data,
			code: status,
		};
	}

	/**
	 * Gets information about a Discord account linked to Polsu
	 * @param discordSnowflake
	 * @return AccountInformation
	 */
	public async getAccountInformation(discordSnowflake: string): PolsuResponse<AccountInformation> {
		const { data, status } = await this.axiosInstance.get<PolsuResponse<AccountInformation>>(`/polsu/account?id=${discordSnowflake}`);
		return {
			...data,
			code: status,
		};
	}

	/**
	 * Gets information about a map
	 * @param map - The map you'd like information about
	 * @return BedwarsMap
	 */
	public async getBedwarsMapInformation(map: KnownBedwarsMaps): PolsuResponse<BedwarsMap> {
		const { data, status } = await this.axiosInstance.get<PolsuResponse<BedwarsMap>>(`/polsu/bedwars/map?map=${map}`);
		return {
			...data,
			code: status,
		};
	}

	/**
	 * Gets a array of all known Bedwars maps. If there is a map missing, Please join the official discord, https://discord.gg/polsu
	 * @return BedwarsMaps
	 */
	public async getAllBedwarsMaps(): PolsuResponse<BedwarsMaps> {
		const { data, status } = await this.axiosInstance.get<PolsuResponse<BedwarsMaps>>(`/polsu/bedwars/maps`);
		return {
			...data,
			code: status,
		};
	}

	/**
	 * Gets information about this player's Polsu session
	 * @param uuid - The player's undashed uuid
	 * @return Session
	 */
	public async getBedwarsSession(uuid: string): PolsuResponse<Session> {
		const { data, status } = await this.axiosInstance.get<PolsuResponse<Session>>(`/polsu/bedwars/sessions?uuid=${uuid}`);
		return {
			...data,
			code: status,
		};
	}

	/**
	 * Gets an object of months which provide an array of known rotations.
	 * @return BedwarsDreams
	 */
	public async getBedwarsDreams(): PolsuResponse<BedwarsDreams> {
		const { data, status } = await this.axiosInstance.get<PolsuResponse<BedwarsDreams>>(`/polsu/bedwars/dream`);
		return {
			...data,
			code: status,
		};
	}

	/**
	 * Gets API Status information about a specific Minecraft API such as Hypixel or Polsu
	 * @param service - The service to get information about.
	 * @return MinecraftAPI
	 */
	public async getMinecraftAPIStatus(service: "hypixel" | "mojang" | "antisniper" | "seraph" | "cubelify" | "polsu"): PolsuResponse<MinecraftAPI> {
		const { data, status } = await this.axiosInstance.get<PolsuResponse<MinecraftAPI>>(`/polsu/minecraft/api?name=${service}`);
		return {
			...data,
			code: status,
		};
	}

	/**
	 * Gets information about a Minecraft server which is public provided by Polsu.
	 * @param serverIp - A server URL or IP to get information about
	 * @return MinecraftServer
	 */
	public async getMinecraftServer(serverIp: string): PolsuResponse<MinecraftServer> {
		const { data, status } = await this.axiosInstance.get<PolsuResponse<MinecraftServer>>(`/polsu/minecraft/server?ip=${serverIp}`);
		return {
			...data,
			code: status,
		};
	}
}
