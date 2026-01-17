import cron from "node-cron";

export default (client) => {

cron.schedule("0 */6 * * *", async () => {
            const db = client.db;
        const allRoles = await db.all();

        for (const entry of allRoles) {
            const key = entry.ID;
            const roleData = entry.data;

            if (!key.startsWith("specialRole-")) continue;
            if (!roleData.expiresAt) continue;

            if (Date.now() >= roleData.expiresAt) {
                const guild = client.guilds.cache.get(roleData.guildId);
                if (!guild) {
                    await db.delete(key);
                    continue;
                }

                const role = guild.roles.cache.get(roleData.roleId);
                if (role) {

                    const owner = await guild.members.fetch(roleData.giverId).catch(() => null);
                    if (owner && owner.roles.cache.has(role.id)) {
                        await owner.roles.remove(role).catch(() => null);
                        owner.send(`⚠️ انتهت صلاحية رتبتك الخاصة **${role.name}** وتمت إزالتها.`).catch(() => null);
                    }

                    if (roleData.otherUsers && roleData.otherUsers.length) {
                        for (const userId of roleData.otherUsers) {
                            const member = await guild.members.fetch(userId).catch(() => null);
                            if (member && member.roles.cache.has(role.id)) {
                                await member.roles.remove(role).catch(() => null);
                            }
                        }
                    }

                    await role.delete("انتهت مدة الرتبة الخاصة").catch(() => null);
                }

                await db.delete(key);
                console.log(`✅ تم حذف رتبة منتهية الصلاحية: ${roleData.roleId}`);
            }
        }

        console.log("✅ فحص الرتب الخاصة اكتمل.");
    });
};
