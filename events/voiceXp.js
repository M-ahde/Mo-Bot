const voiceTimers = new Map();

export default {
  name: "ready",
  once: true,
  async execute(client) {
    console.log("✅ Voice points system started!");
    const db = client.db;
    const config = client.config;
    console.log(config);
    setInterval(async () => {
      client.guilds.cache.forEach(async (guild) => {
        guild.channels.cache
          .filter((ch) => ch.isVoiceBased() && ch.members.size > 0)
          .forEach((ch) => {
            ch.members.forEach(async (member) => {
              if (member.user.bot) return;

              const userId = member.id;
              const now = Date.now();
              const lastTime = voiceTimers.get(userId) || 0;

              if (now - lastTime < config?.points?.voiceContinuous * 1000)
                return;

              voiceTimers.set(userId, now);

              const prevPoints = (await db.get(`points_${userId}`)) || 0;
              await db.set(
                `points_${userId}`,
                prevPoints + config.points.voicePoints,
              );
            });
          });
      });
    }, 10 * 1000);
  },
};
