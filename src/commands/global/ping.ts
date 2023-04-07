import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Check if Nira is alive."),
  async execute(interaction: ChatInputCommandInteraction) {
    return interaction.reply({ content: "Pong! 🏓", ephemeral: true });
  },
};
