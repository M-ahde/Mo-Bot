import { PermissionFlagsBits } from "discord.js";
import config from "../config.js";

export default {
  name: "interactionCreate",
  async execute(interaction, _client_) {
    if (!interaction.isStringSelectMenu()) return;
    if (!interaction.customId.startsWith("specialrole_select")) return;

    const userId = interaction.customId.split(":")[1];
    const member = interaction.guild.members.cache.get(userId);
    if (!member) return;
    const db = _client_.db;

    const hasSpecialRole = await db.get(`specialRole-${userId}`);

    if (hasSpecialRole) {
      return interaction.reply({
        content: "⚠️ هذا العضو لديه رتبة خاصة بالفعل.",
        ephemeral: true,
      });
    }
    const botMember = interaction.guild.members.me;

    if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({
        content: "❌ ليس لدي صلاحية **Manage Roles**.",
        ephemeral: true,
      });
    }

    const baseRole = interaction.guild.roles.cache.get(
      config.specialRole.positionBelowRoleId,
    );

    if (!baseRole) {
      return interaction.reply({
        content: "❌ الرتبة المرجعية غير موجودة في الإعدادات.",
        ephemeral: true,
      });
    }

    if (botMember.roles.highest.position <= baseRole.position) {
      return interaction.reply({
        content: "❌ يجب أن تكون رتبة البوت أعلى من الرتبة المحددة في الكونفج.",
        ephemeral: true,
      });
    }

    if (member.roles.highest.position >= botMember.roles.highest.position) {
      return interaction.reply({
        content: "❌ لا يمكنني إعطاء رتبة لعضو رتبته أعلى أو مساوية لرتبتي.",
        ephemeral: true,
      });
    }
    const permissions = interaction.values.map((p) => PermissionFlagsBits[p]);

    const role = await interaction.guild.roles.create({
      name: member.user.username,
      color: config.specialRole.color,
      permissions,
    });
    db.set(`specialRole-${userId}`, {
      roleId: role.id,
      giverId: interaction.user.id,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      otherUsers: [],
    });

    const below = interaction.guild.roles.cache.get(
      config.specialRole.positionBelowRoleId,
    );
    if (below) await role.setPosition(below.position - 1);

    await member.roles.add(role);

    await interaction.update({
      content: `✅ تم إنشاء رتبة خاصة لـ <@${member.id}>`,
      embeds: [],
      components: [],
    });
  },
};
