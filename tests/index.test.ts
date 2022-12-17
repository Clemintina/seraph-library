import { PolsuApi, SeraphApi } from "../src";
import { expect, test } from "@jest/globals";

const PLAYER_UUID = "b9aa26ec20b447a59a4ad10cc08a46fe"; // Arman
const API_KEY = "public"; // Public Seraph key
const LOCKED_API_KEY = "cb6d0a30-695a-4b97-9490-48c8e0ae194e"; // Permanently locked key -- For testing purposes
const POLSU_API_KEY = ""; // Set this as your own. You can generate it using the discord bot at https://discord.gg/polsu

test("[Seraph] Validate key & blacklist", async () => {
	const publicSeraphApi = new SeraphApi({
		apiKey: API_KEY,
	});

	const keyResponse = await publicSeraphApi.isKeyValid();
	expect(keyResponse.success).toBe(true);

	const blacklistResponse = await publicSeraphApi.getPlayerBlacklist(PLAYER_UUID);
	expect(blacklistResponse.success).toBe(true);
});

test("[Seraph] Fail key & blacklist", async () => {
	const failingSeraphApi = new SeraphApi({ apiKey: "" });

	const failedKeyResponse = await failingSeraphApi.isKeyValid();
	expect(failedKeyResponse.success).toBe(false);

	const failedBlacklistResponse = await failingSeraphApi.getPlayerBlacklist(PLAYER_UUID);
	expect(failedBlacklistResponse.success).toBe(false);
});

test("[Seraph] Testing the lunar api", async () => {
	// No API key is needed as the API is available to everyone
	const seraphApi = new SeraphApi({ apiKey: "" });
	const lunarResponse = await seraphApi.getPlayerLunar(PLAYER_UUID);
	expect(lunarResponse.success).toBe(true);
});

test("[Seraph] Testing player finder api", async () => {
	const seraphApi = new SeraphApi({ apiKey: API_KEY });
	const response = await seraphApi.getPlayerFinder();
	expect(response.success).toBe(true);
});

test("[Seraph] Handle security alert", async () => {
	const seraphApi = new SeraphApi({ apiKey: LOCKED_API_KEY }); // Permanently locked key
	const response = await seraphApi.isKeyValid();
	expect(response.success).toBe(false);
	if (response.code == 200) {
		expect(response.success).toBeDefined();
		expect(response.key.valid).toBeDefined();
	} else {
		expect(response.success).toBeDefined();
		expect(response.key.valid).toBe(false);
		expect(response.key.error).toBe("Your key has a security alert. Please open a support ticket!");
	}
});

if (POLSU_API_KEY.length == 36) {
	test("[POLSU] Test Polsu API Key validation", async () => {
		const polsuApi = new PolsuApi({ apiKey: POLSU_API_KEY });

		const keyResponse = await polsuApi.getKeyInformation();
		expect(keyResponse.success).toBe(true);

		if (keyResponse.code == 200) {
			expect(keyResponse.data.key).toBeDefined();
			expect(keyResponse.data.discord.id).toBeDefined();
			expect(keyResponse.data.total_requests).toBeDefined();
		}
	});

	test("[POLSU] Test Polsu Player response", async () => {
		const polsuApi = new PolsuApi({ apiKey: POLSU_API_KEY });

		const playerSessionResponse = await polsuApi.getBedwarsSession(PLAYER_UUID);
		expect(playerSessionResponse.success).toBe(true);

		if (playerSessionResponse.code == 200) {
			expect(playerSessionResponse.data.session).toBeDefined();
			expect(playerSessionResponse.data.games.total).toBeDefined();
			expect(playerSessionResponse.data.started).toBeDefined();
		}
	});

	test("[POLSU] Test Polsu Minecraft Status", async () => {
		const polsuApi = new PolsuApi({ apiKey: POLSU_API_KEY });
		const hypixelStatus = await polsuApi.getMinecraftAPIStatus("polsu");
		expect(hypixelStatus.success).toBe(true);

		if (hypixelStatus.code == 200) {
			expect(hypixelStatus.data.ping).toBeDefined();
			expect(hypixelStatus.data.url).toBeDefined();
			expect(hypixelStatus.data.time).toBeDefined();
		}
	});
}
