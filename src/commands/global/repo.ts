import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder().setName("repo").setDescription("Get the link to Nira-chan's GitHub repository."),
  async execute(interaction: ChatInputCommandInteraction) {
    return interaction.reply("https://github.com/anomalilies/Nira-chan");
  },
};
