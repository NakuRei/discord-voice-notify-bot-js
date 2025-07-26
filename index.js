const { Client, GatewayIntentBits } = require('discord.js');

console.log(`Using environment: ${process.env.NODE_ENV}`);
const targetVoiceChannelId = process.env.TARGET_VOICE_CHANNEL_ID;
const notifyTextChannelId = process.env.NOTIFY_TEXT_CHANNEL_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('voiceStateUpdate', (oldState, newState) => {
  // ユーザーがボイスチャンネルに入室した場合
  if (!oldState.channel && newState.channel) {
    // 入室を検知したいボイスチャンネルのIDと一致しないならなにもしない
    if (newState.channel.id !== targetVoiceChannelId) {
      return;
    }

    // 入室を検知したボイスチャンネルのIDと一致する場合のみ通知
    const notifyChannel = client.channels.cache.get(notifyTextChannelId);
    if (notifyChannel) {
      notifyChannel.send(
        `🔔 ${newState.member.displayName} が VC「${newState.channel.name}」に参加しました`
      );
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
