# Seraph

This library is a small package designed to assist people using the [Seraph API](https://antisniper.seraph.si) and the [Polsu API](https://api.polsu.xyz).

To get started,

``pnpm add @clemintina/seraph-library``

```ts
import { SeraphApi, PolsuApi } from '@clemintina/seraph-library';

const seraphApi = new SeraphApi({ apiKey : 'public' });
const polsuApi = new PolsuApi({ apiKey: 'YOUR API KEY' })
```

If you have any issues or would like to contribute, here's our [Github repo](https://github.com/Clemintina/seraph-library)
