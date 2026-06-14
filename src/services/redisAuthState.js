const { BufferJSON, initAuthCreds, proto } = require("@whiskeysockets/baileys");

const useRedisAuthState = async (redis, sessionId = "main") => {
    const prefix = `wa:auth:${sessionId}`;
    const key = (file) => `${prefix}:${file}`;

    const writeData = async (data, file) => {
        await redis.set(key(file), JSON.stringify(data, BufferJSON.replacer));
    };

    const readData = async (file) => {
        const data = await redis.get(key(file));
        return data ? JSON.parse(data, BufferJSON.reviver) : null;
    };

    const removeData = async (file) => {
        await redis.del(key(file));
    };

    const creds = (await readData("creds")) || initAuthCreds();

    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};

                    await Promise.all(
                        ids.map(async (id) => {
                            let value = await readData(`${type}-${id}`);

                            if (type === "app-state-sync-key" && value) {
                                value = proto.Message.AppStateSyncKeyData.fromObject(value);
                            }

                            data[id] = value;
                        })
                    );

                    return data;
                },

                set: async (data) => {
                    const tasks = [];

                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
                            const file = `${category}-${id}`;

                            tasks.push(value ? writeData(value, file) : removeData(file));
                        }
                    }

                    await Promise.all(tasks);
                },
            },
        },

        saveCreds: async () => {
            await writeData(creds, "creds");
        },
    };
};

const clearRedisAuthState = async (redis, sessionId = "main") => {
    const pattern = `wa:auth:${sessionId}:*`;
    let cursor = "0";
    const keys = [];

    do {
        const [nextCursor, batch] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
        cursor = nextCursor;
        keys.push(...batch);
    } while (cursor !== "0");

    if (keys.length > 0) {
        await redis.del(keys);
    }

    return keys.length;
};

module.exports = {
    useRedisAuthState,
    clearRedisAuthState,
};
