import { ChatInputCommandInteraction } from "discord.js";

export const nicknameCheck = (interaction: ChatInputCommandInteraction) => {
  let a: string;
  let n: string;
  if (interaction.inGuild()) {
    const userId = interaction.guild!.members.cache.find((user) => user.id === interaction.user.id)!;
    a = userId.displayAvatarURL();
    n = userId.displayName;
  } else {
    a = interaction.user.avatarURL()!;
    n = interaction.user.username;
  }
  return { avatar: a, nickname: n };
};
