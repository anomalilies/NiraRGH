import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { colour, guildId } from "../../config/config.json";

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("List all commands."),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute(interaction: ChatInputCommandInteraction) {
    const commands = new Map();
    (await interaction.client.application!.commands.fetch()).forEach((c) => commands.set(c.name, c.description)); // TO-DO: THESE ARE APPLICATION COMMANDS ONLY

    const array = [];
    for (const [key, value] of commands) {
      array.push("`" + key + "`: " + value);
    }
    const embed = new EmbedBuilder().setColor(colour).setTitle(`${interaction.client.user!.username}'s Commands`);

    if (interaction.guild?.id === guildId) {
      embed.setDescription(`**Global Commands**\n${array.join("\n")}\n\n**Guild-Only Commands**\n`);
    } else {
      embed.setDescription(array.join("\n"));
    }

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
