import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { nicknameCheck } from "../../util/nicknameCheck";
import { colour } from "../../config/config.json";
import riddles from "../../data/riddles.json";

module.exports = {
  data: new SlashCommandBuilder().setName("riddle").setDescription("Really lousy riddles."),

  async execute(interaction: ChatInputCommandInteraction) {
    const avatar = nicknameCheck(interaction).avatar;
    const nickname = nicknameCheck(interaction).nickname;

    const i = Math.floor(Math.random() * riddles.length);

    const embed = new EmbedBuilder()
      .setColor(colour)
      .setAuthor({ name: nickname, iconURL: avatar })
      .setDescription(riddles[i].riddle)
      .addFields({
        name: "Answer",
        value: `||${riddles[i].answer}||`,
      });

    return interaction.reply({ embeds: [embed] });
  },
};
