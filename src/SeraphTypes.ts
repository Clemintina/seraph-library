export type Blacklist = {
	success: true;
	code: 200;
	data: {
		uuid: string;
		username: string;
		blacklist: {
			tagged: boolean;
			timestamp: number;
			reason: string;
			report_type: string;
		};
		safelist: {
			tagged: boolean;
			timesKilled: number;
			personal: boolean;
			security_level: number;
		};
		customTag: string | null;
		bot: { tagged: boolean; unidentified: boolean; kay: boolean };
		statistics: { encounters: number; threat_level: number };
		migrated: { tagged: boolean };
		annoylist: { tagged: boolean };
		name_change: { last_change: number };
		ranked_bedwars: { elo: number };
	};
} & SeraphDefaultStructure;

export type ApiKey = {
	success: true;
	code: 200 | 400 | 403;
	key: {
		key: string;
		valid: boolean;
		error?: string;
		code: 200 | 400 | 403;
		isDev: boolean;
	};
} & SeraphDefaultStructure;

export type LunarCosmetic = {
	id: number;
	name: string;
	url: string;
};

export type LunarAPIResponse = {
	success: true;
	code: 200;
	player: {
		uuid: string;
		online: boolean;
		status: string;
		cosmetics: { count: number; activeCosmetics: LunarCosmetic[]; cachedCosmetics: LunarCosmetic[] };
		lunarPlus: {
			premium: boolean;
			clothCloak: boolean;
			plusColour: number;
		};
		rank: {
			unknownBooleanB: boolean;
			unknownBooleanC: boolean;
		};
		unknown: {
			unknownBooleanA: boolean;
			unknownBooleanB: boolean;
			unknownBooleanC: boolean;
		};
	};
} & SeraphDefaultStructure;

export type PlayerFinderResponse = {
	success: true;
	code: 200;
	data: {
		players: Array<string>;
		stats: {
			last_updated: number;
			player_count: number;
		};
	};
} & SeraphDefaultStructure;

export type SeraphResponse<T> = Promise<T | ErrorResponse>;

export type ErrorResponse = {
	success: false;
	code: 400 | 401 | 403 | 404 | 429 | 503;
	cause: string;
	extra: Array<ErrorResponseExtra>;
	documentation: string;
} & SeraphDefaultStructure;

export type ErrorResponseExtra = {
	name: string;
	reason: string;
	developer_reason?: string;
	code?: number;
};

type SeraphDefaultStructure = { code: 200 | 400 | 401 | 404 | 429 | 503; msTime: number };
