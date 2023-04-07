import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import { emojis } from "../../config/config.json";

module.exports = {
  data: new SlashCommandBuilder().setName("stabstabstab").setDescription(emojis.fencing),
  async execute(interaction: ChatInputCommandInteraction) {
    return interaction.reply({ content: `pokepokepoke ${emojis.fencing}`, ephemeral: true });
  },
};
