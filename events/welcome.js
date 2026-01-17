export default {
  name: "guildMemberAdd",
  async execute(member, _client_) {
    try {
      const { welcome } = _client_.config;
      const channel = member.guild.channels.cache.get(welcome.channelId);

      if (!channel || !channel.isTextBased()) return;

      const message =
        welcome.message?.replace("{user}", member.id)?.trim() || null;
      const image = welcome.image?.trim() || null;

      if (message && image) {
        channel.send({ content: message, files: [image] });
      } else if (message) {
        channel.send(message);
      } else if (image) {
        channel.send({ files: [image], content: `<@${member.id}>` });
      }
    } catch (error) {
      console.error("Error welcoming new member:", error);
    }
  },
};
