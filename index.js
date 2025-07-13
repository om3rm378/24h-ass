const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');

// إعدادات السكربت
const settings = {
  token: "Your_Acc_Token", // ⚠️ استبدل هذا بتوكنك الجديد
  serverId: "Server_ID",
  voiceChannelId: "Voice_Channel_ID",
};

const client = new Client({
  checkUpdate: false,
  syncStatus: false
});

async function joinVoice() {
  try {
    const guild = client.guilds.cache.get(settings.serverId);
    const channel = guild.channels.cache.get(settings.voiceChannelId);

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false
    });

    console.log(`✅ تم الدخول إلى ${channel.name} بنجاح`);

    connection.on('stateChange', (oldState, newState) => {
      if (newState.status === VoiceConnectionStatus.Disconnected) {
        console.log('🔄 محاولة إعادة الاتصال...');
        setTimeout(joinVoice, 5000);
      }
    });

  } catch (error) {
    console.error('❌ خطأ:', error.message);
    setTimeout(joinVoice, 10000);
  }
}

client.on('ready', () => {
  console.log(`🎮 ${client.user.tag} يعمل الآن`);
  joinVoice();
});

client.on('error', console.error);
client.on('warn', console.warn);

// التحقق من صحة التوكن قبل التشغيل
if (!settings.token || settings.token.length < 50) {
  console.log('❌ التوكن غير صالح! الرجاء التأكد من:');
  console.log('1. أنك تستخدم توكن حساب شخصي صحيح');
  console.log('2. أن التوكن مكتوب بشكل صحيح بدون أخطاء');
  console.log('3. أن التوكن غير منتهي الصلاحية');
  process.exit(1);
}

client.login(settings.token).catch(err => {
  console.error('❌ فشل تسجيل الدخول:', err.message);
  console.log('الخطأ الشائع: التوكن غير صالح أو منتهي الصلاحية');
  process.exit(1);
});