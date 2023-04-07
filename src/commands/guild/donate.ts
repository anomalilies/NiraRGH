import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { nicknameCheck } from "../../util/nicknameCheck";
import { colour } from "../../config/config.json";

module.exports = {
  data: new SlashCommandBuilder().setName("donate").setDescription("Find out how to donate to ZUTOMAYO ZONE!"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute(interaction: ChatInputCommandInteraction) {
    const avatar = nicknameCheck(interaction).avatar;
    const nickname = nicknameCheck(interaction).nickname;

    const embed = new EmbedBuilder()
      .setColor(colour)
      .setAuthor({ name: nickname, iconURL: avatar })
      .setTitle("Donate")
      .setDescription(
        `If you'd like to support the ZONE by finanically funding giveaways, **check out our __[Ko-fi](https://ko-fi.com/uniguri)__**!`,
      );

    return interaction.reply({ embeds: [embed] });
  },
};
