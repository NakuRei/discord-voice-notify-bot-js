const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

console.log(`Using environment: ${process.env.NODE_ENV}`);

// 環境変数の検証
function validateEnvironment() {
  const requiredEnvVars = [
    'DISCORD_TOKEN',
    'TARGET_VOICE_CHANNEL_ID',
    'NOTIFY_TEXT_CHANNEL_ID',
  ];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    process.exit(1);
  }
  console.log('✅ Environment validation completed');
}

// 起動時に環境変数を検証
validateEnvironment();

const targetVoiceChannelId = process.env.TARGET_VOICE_CHANNEL_ID;
const notifyTextChannelId = process.env.NOTIFY_TEXT_CHANNEL_ID;

// Discordクライアントの初期化
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

// Discordクライアントの準備完了イベント
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Discord接続エラーの処理
client.on('error', (error) => {
  console.error('❌ Discord client error occurred:', error);
});

// 警告の処理
client.on('warn', (warning) => {
  console.warn('⚠️ Warning:', warning);
});

// 通知メッセージの送信
async function sendNotification(newState, embed) {
  try {
    const notifyChannel = client.channels.cache.get(notifyTextChannelId);

    if (!notifyChannel) {
      console.error('❌ Notification channel not found');
      return;
    }

    await notifyChannel.send({ embeds: [embed] });
    console.log(`Notification sent: ${newState.member.displayName}`);
  } catch (error) {
    console.error('❌ Failed to send notification:', error);
  }
}

// ボイスチャンネルの状態更新イベント
client.on('voiceStateUpdate', (oldState, newState) => {
  // ユーザーがボイスチャンネルに入室した場合
  if (!oldState.channel && newState.channel) {
    // 入室を検知したいボイスチャンネルのIDと一致しないならなにもしない
    if (newState.channel.id !== targetVoiceChannelId) {
      return;
    }

    // 入室を検知したボイスチャンネルのIDと一致する場合のみ通知
    const embed = new EmbedBuilder()
      .setTitle(
        `🔔 ${newState.member.displayName} が ` +
          `VC「${newState.channel.name}」に参加しました`
      )
      .setDescription(`<#${newState.channel.id}>`)
      .setTimestamp()
      .setColor('#486547');
    sendNotification(newState, embed);
  }
});

// Discordにログイン
client
  .login(process.env.DISCORD_TOKEN)
  .then(() => {
    console.log('✅ Bot logged in successfully');
  })
  .catch((error) => {
    console.error('❌ Failed to log in:', error);
    process.exit(1);
  });

// プロセス終了時の処理
process.on('SIGINT', async () => {
  console.log('\n🛑 Bot is shutting down...');
  try {
    await client.destroy();
    console.log('✅ Bot has been shut down gracefully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});
process.on('SIGTERM', async () => {
  console.log('\n🛑 Bot is shutting down...');
  try {
    await client.destroy();
    console.log('✅ Bot has been shut down gracefully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// 未処理の例外や拒否の処理
process.on('uncaughtException', async (error) => {
  console.error('❌ Uncaught exception:', error);
  try {
    await client.destroy();
    console.log('🛑 Client destroyed after uncaught exception');
  } catch (destroyError) {
    console.error('⚠️ Failed to destroy client cleanly:', destroyError);
  } finally {
    process.exit(1);
  }
});
process.on('unhandledRejection', async (reason, promise) => {
  console.error('❌ Unhandled promise rejection:', reason);
  console.error('Promise:', promise);
  try {
    await client.destroy();
    console.log('🛑 Client destroyed after unhandled rejection');
  } catch (destroyError) {
    console.error('⚠️ Failed to destroy client cleanly:', destroyError);
  } finally {
    process.exit(1);
  }
});
