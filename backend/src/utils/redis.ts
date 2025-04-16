import redis from "../config/redis.js";

export async function deletarKeys(key: string) {
	const scan = await redis.scan(0, { MATCH: key, COUNT: 100 });
	for (const key of scan.keys) {
		redis.unlink(key);
	}
}
