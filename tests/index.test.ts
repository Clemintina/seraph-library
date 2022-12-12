import { SeraphApi } from "../src";

const PLAYER_UUID  = 'b9aa26ec20b447a59a4ad10cc08a46fe' // Arman
const API_KEY = "public";

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
