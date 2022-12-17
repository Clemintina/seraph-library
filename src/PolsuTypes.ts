export type ServiceStatus = {
	api: boolean;
	polsu: boolean;
	croustillant: boolean;
	launch: number;
};

export type ServiceStats = {
	polsu: {
		servers: number;
		channels: number;
		users: number;
		accounts: number;
		commands: number;
		linked: number;
		players: number;
		sessions: number;
	};
	api: {
		accounts: number;
		endpoints: number;
	};
};

export type ApiKey = {
	key: string;
	discord: {
		id: string;
	};
	total_requests: number;
};

export type AccountInformation = {
	badges: {
		blacklisted: boolean;
		premium: boolean;
		designer: boolean;
		vip: boolean;
		staff: boolean;
		developer: boolean;
		owner: boolean;
	};

	account: {
		created: number;
		commands: number;
	};

	minecraft: {
		uuid: string;
		queries: number;
		since: number;
	};
};

export type BedwarsMap = {
	name: string;
	mode: string;
	playstyle: string;
	gen: string;
	description: string;
	added: number;
	builders: string;
	new: boolean;
	preview: string;
};

export type BedwarsMaps = {
	maps: Array<string>;
};

export type Session = {
	uuid: string;
	session: number;
	started: number;
	stars: number;
	experience: number;
	games: {
		total: number;
		solos: number;
		doubles: number;
		threes: number;
		fours: number;
		fvf: number;
	};
	resources: {
		iron: number;
		gold: number;
		emeralds: number;
		diamonds: number;
	};
	purchased: {
		permanent: number;
		nonpermanent: number;
	};
	stats: {
		wins: number;
		losses: number;
		kills: number;
		deaths: number;
		fkills: number;
		fdeaths: number;
		bbroken: number;
		blost: number;
	};
	new: boolean;
};

export type BedwarsDreams = {
	2022: {
		DECEMBER: Array<BedwarsDreamsObject>;
	};
	2023: {
		JANUARY: Array<BedwarsDreamsObject>;
		FEBURARY: Array<BedwarsDreamsObject>;
		MARCH: Array<BedwarsDreamsObject>;
		APRIL: Array<BedwarsDreamsObject>;
		MAY: Array<BedwarsDreamsObject>;
		JUNE: Array<BedwarsDreamsObject>;
		JULY: Array<BedwarsDreamsObject>;
		AUGUST: Array<BedwarsDreamsObject>;
		SEPTEMBER: Array<BedwarsDreamsObject>;
		OCTOBER: Array<BedwarsDreamsObject>;
		NOVEMBER: Array<BedwarsDreamsObject>;
		DECEMBER: Array<BedwarsDreamsObject>;
	};
};

export type MinecraftAPI = {
	url: string;
	ping: Array<number>;
	time: Array<number>;
};

export type MinecraftServer = {
	ip: string;
	ping: Array<number>;
	players: Array<number>;
	time: Array<number>;
};

// Bedwars Dreams Utils
type BedwarsDreamsObject = { date: number; mode: string };

// Polsu Common
export type PolsuResponse<T> = Promise<{ success: true; data: T; code: 200 } | ErrorResponse>;

export type ErrorResponse = {
	success: false;
	code: 400 | 403 | 404 | 429 | 500;
	cause: string;
} & PolsuDefaultStructure;

type PolsuDefaultStructure = { code: 200 | 400 | 401 | 404 | 429 | 503 };

export type KnownBedwarsMaps =
	| "acropolis"
	| "airshow"
	| "amazon"
	| "apollo"
	| "aqil"
	| "ashfire"
	| "babylon"
	| "bio hazard"
	| "cascade"
	| "casita"
	| "cliffside"
	| "crogorm"
	| "crypt"
	| "deadwood"
	| "dragonstar"
	| "dockyard"
	| "gateway"
	| "glacier"
	| "harvest"
	| "hollow"
	| "ironclad"
	| "lighthouse"
	| "lightstone"
	| "lotus"
	| "lucky rush"
	| "meso"
	| "mirage"
	| "orbit"
	| "orchestra"
	| "pavilion"
	| "pernicious"
	| "playground"
	| "polygon"
	| "rooftop"
	| "rooted"
	| "scorched sands"
	| "serenity"
	| "siege"
	| "sky rise"
	| "solace"
	| "speedway"
	| "steampunk"
	| "toro"
	| "waterfall"
	| "yue"
	| "zarzul"
	| "aquarium"
	| "archway"
	| "artemis"
	| "ashore"
	| "boletum"
	| "build site"
	| "carapace"
	| "catalyst"
	| "chained"
	| "daolong"
	| "deposit"
	| "dreamgrove"
	| "eastwood"
	| "enchanted"
	| "extinction"
	| "fang outpost"
	| "fort doon"
	| "frogiton"
	| "graveship"
	| "holmgang"
	| "horizon"
	| "invasion"
	| "jurassic"
	| "katsu"
	| "kubo"
	| "lectus"
	| "obelisk"
	| "paladin"
	| "paradox"
	| "pharoah"
	| "planet 98"
	| "pool party"
	| "relic"
	| "rise"
	| "stilted"
	| "stonekeep"
	| "sky festival"
	| "swashbuckle"
	| "temple"
	| "tigris"
	| "terminal"
	| "treenan"
	| "unturned"
	| "zen plaza"
	| "cryptic"
	| "frost"
	| "gardens"
	| "lions temple"
	| "picnic"
	| "ruins"
	| "castle"
	| "sandcastle";
