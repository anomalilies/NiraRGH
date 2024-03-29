import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import { emojis } from "../../config/config.json";
import yunyah from "../../data/yunyah.json";

module.exports = {
  data: new SlashCommandBuilder().setName("yunyah").setDescription("is unigory part of zutto mayonaka cinama universe"),
  async execute(interaction: ChatInputCommandInteraction) {
    const channel = (await interaction.client.channels.fetch(interaction.channel!.id)) as TextChannel;
    const webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find((w) => w.token != null);

    if (!webhook) {
      webhook = await channel.createWebhook({
        name: interaction.client.user.username,
        avatar: interaction.client.user!.avatarURL(),
      });
    }

    interaction.reply(emojis.loading);
    interaction.deleteReply().then(
      async () =>
        await await webhook!.send({
          content: yunyah[Math.floor(Math.random() * yunyah.length)],
          username: "yunyah",
          avatarURL: interaction.client.user!.defaultAvatarURL,
        }),
    );
  },
};
