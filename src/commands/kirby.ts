import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { emojis, colour } from "../config/config.json";
import abilities from "../data/copyabilities.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kirby")
    .setDescription("What copy ability will Kirby get when he inhales you?"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute(interaction: CommandInteraction) {
    const total = abilities.reduce((acc, cur) => acc + cur.weight, 0);
    const threshold = Math.random() * total;

    let sum = 0;
    const group = abilities.find((group) => {
      sum += group.weight;
      return sum >= threshold;
    });

    const index = Math.floor(Math.random() * group.abilities.length);
    const ability = group.abilities[index];

    let nickname: string;
    let avatar: string;

    if (interaction.inGuild()) {
      const userId = interaction.guild.members.cache.find((user) => user.id === interaction.user.id);
      nickname = userId.displayName;
      avatar = userId.displayAvatarURL({ dynamic: true });
    } else {
      nickname = interaction.user.username;
      avatar = interaction.user.avatarURL({ dynamic: true });
    }

    const reply = group.format.replace("{ability}", ability).replace("{name}", nickname);

    const embed = new MessageEmbed()
      .setColor(colour)
      .setAuthor({ name: nickname, iconURL: avatar })
      .setDescription(`${emojis.kirbsucc} ${reply}`);

    return interaction.reply({ embeds: [embed] });
  },
};
