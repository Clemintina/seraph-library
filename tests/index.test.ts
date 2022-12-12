import { SeraphApi } from "../src";

const apiKey = "public";

test('validate key', async ()=>{
	const testApi = new SeraphApi({
		apiKey
	})

	const keyResponse = await testApi.isKeyValid()
	if ( keyResponse.success ) {
		console.log(keyResponse);
	}

})
