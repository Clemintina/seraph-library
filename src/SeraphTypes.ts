export type Blacklist = {
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
	};
} & SeraphDefaultStructure;

export type ApiKey = {
	key: {
		key: string;
		valid: boolean;
		code: number;
		isDev: boolean;
	};
} & SeraphDefaultStructure;

export type LunarCosmetic = {
	id: number;
	name: string;
	url: string;
};

export type LunarAPIResponse = {
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

export type SeraphResponse<T> = Promise<T | ErrorResponse>;

export type ErrorResponse = {
	success: false;
	code: number;
	msTime: number;
	cause: string;
	extra: Array<ErrorResponseExtra>;
	documentation: string;
};

export type ErrorResponseExtra = {
	name: string;
	reason: string;
	developer_reason?: string;
	code?: number;
};

type SeraphDefaultStructure =
	| ({
			code: number;
			msTime: number;
	  } & {
			success: true;
	  })
	| ErrorResponse;
