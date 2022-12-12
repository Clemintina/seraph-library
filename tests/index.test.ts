import { SeraphApi } from "../src";

const PLAYER_UUID  = 'b9aa26ec20b447a59a4ad10cc08a46fe' // Arman
const API_KEY = "public"; // Seraph key

test('validate key & blacklist', async ()=>{
	const publicSeraphApi = new SeraphApi({
		apiKey:API_KEY
	})

	const keyResponse = await publicSeraphApi.isKeyValid()
	expect(keyResponse.success).toBe(true)

	const blacklistResponse = await publicSeraphApi.getPlayerBlacklist(PLAYER_UUID)
	expect(blacklistResponse.success).toBe(true)
})

test('Fail key & blacklist', async ()=>{
	const failingSeraphApi = new SeraphApi({ apiKey : ""})

	const failedKeyResponse = await failingSeraphApi.isKeyValid()
	expect(failedKeyResponse.success).toBe(false)

	const failedBlacklistResponse = await failingSeraphApi.getPlayerBlacklist(PLAYER_UUID)
	expect(failedBlacklistResponse.success).toBe(false)
})

test('Testing the lunar api', async ()=>{
	// No API key is needed as the API is available to everyone
	const seraphApi = new SeraphApi({ apiKey : ""})
	const lunarResponse = await seraphApi.getPlayerLunar( PLAYER_UUID );
	expect(lunarResponse.success).toBe(true)
})

test('Testing player finder api', async ()=>{
	const seraphApi = new SeraphApi({ apiKey : API_KEY})
	const response = await seraphApi.getPlayerFinder()
	expect(response.success).toBe(true)
})
