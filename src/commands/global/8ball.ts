import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { nicknameCheck } from "../../util/nicknameCheck";
import responses from "../../data/8ball.json";
import { colour } from "../../config/config.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask Nira for advice to all of your life's woes.")
    .addStringOption((option) =>
      option.setName("query").setDescription("What do you want to ask Nira?").setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    let query: string = interaction.options.getString("query")!;

    const avatar = nicknameCheck(interaction).avatar;
    const nickname = nicknameCheck(interaction).nickname;

    if (!query.endsWith("?")) {
      query = query.concat("?");
    }

    const embed = new EmbedBuilder()
      .setColor(colour)
      .setAuthor({ name: `${nickname} asked...`, iconURL: avatar })
      .setDescription(
        `> **${query}**\n\n${interaction.client.user!.username}'s magic 8-ball responds: **${
          responses[Math.floor(Math.random() * responses.length)]
        }**`,
      );

    return interaction.reply({ embeds: [embed] });
  },
};
