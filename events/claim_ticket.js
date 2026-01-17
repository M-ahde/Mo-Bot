import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default {
  name: "interactionCreate",
  async execute(interaction, _client_) {
    const db = _client_.db;
    const config = _client_.config;

    if (!interaction.isButton()) return;
    if (interaction.customId !== "claim_ticket") return;

    const member = interaction.member;

    const hasRole = member.roles.cache.some((role) =>
      config.ticket.allowedRoles.includes(role.id),
    );
    if (!hasRole) {
      return interaction.reply({
        content: "❌ أنت غير مخوّل لتسلم هذه التذكرة.",
        ephemeral: true,
      });
    }

    if (!_client_.processingTickets) _client_.processingTickets = new Set();
    if (_client_.processingTickets.has(interaction.channel.id)) {
      return interaction.reply({
        content: "⏳ التذكرة قيد المعالجة، انتظر لحظة...",
        ephemeral: true,
      });
    }

    _client_.processingTickets.add(interaction.channel.id);

    try {
      const ticketClaimed = await db.get(
        `ticket_claimed_${interaction.channel.id}`,
      );
      if (ticketClaimed) {
        return interaction.reply({
          content: `❌ هذه التذكرة تم استلامها مسبقًا بواسطة <@${ticketClaimed}>.`,
          ephemeral: true,
        });
      }

      const prevPoints = (await db.get(`points_${member.id}`)) || 0;
      await db.set(
        `points_${member.id}`,
        prevPoints + config.ticket.rewardPoints,
      );

      await db.set(`ticket_claimed_${interaction.channel.id}`, member.id);

      const newRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("claim_ticket")
          .setLabel(`🛡 مستلم من ${member.user.username}`)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
      );

      if (interaction.message.editable) {
        await interaction.message.edit({ components: [newRow] });
      }

      await interaction.reply({
        content: `✅ لقد استلمت التذكرة بنجاح!`,
        ephemeral: true,
      });
    } catch (err) {
      console.error("Error in claim_ticket interaction:", err);
      if (interaction.replied || interaction.deferred) {
        interaction.followUp({
          content: "❌ حدث خطأ أثناء استلام التذكرة.",
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: "❌ حدث خطأ أثناء استلام التذكرة.",
          ephemeral: true,
        });
      }
    } finally {
      _client_.processingTickets.delete(interaction.channel.id);
    }
  },
};
