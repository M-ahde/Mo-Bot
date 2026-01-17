
const cooldowns = new Map();

export default {
    name: "messageCreate",
    async execute(message,_client_) {

        const db = _client_.db;
        const config = _client_.config
        if (message.author.bot) return;
        if (message.content.length > config.points.maxMessageLength) return;

        const userId = message.author.id;
        const now = Date.now();

        const lastTime = cooldowns.get(userId) || 0;
        if (now - lastTime < config.points.chatCooldown * 1000) return;

        cooldowns.set(userId, now);

        const prevPoints = await db.get(`points_${userId}`) || 0;
        await db.set(`points_${userId}`, prevPoints + config.points.chatPoints);

    }
};
