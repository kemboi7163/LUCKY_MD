"use strict";

const { makeInMemoryStore, fetchLatestBaileysVersion, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs-extra");
const path = require("path");
const conf = require("./set");
const session = conf.session.replace(/LUCKY-MD;;;=>/g, "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT0ZuaUZ1UmQzYW9OZVp4bDFBbFFnQnVQOTVrV2JzUzZqTGs4RHV6VXUwST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibVRJOWVlMEpWbFZDcFUyS25XTkNhY2ovZ1dhaEpXVldlNTc4czNTYkJ4ND0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJxSk1IWXplNXhqOUplZ0JMcTA1TnY2UFBxNlpZL0c2Y24wMFJNc0FmQkVrPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJkK3VyMEpjdzRlSVE1eEVKbExFcXV4NURtU0pHbzJqWEtVNmcrVCt6dWdVPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImVQc2hxVi9lMXNWd0RDbWJubGdTa3hoczh2UlExZ0E4RlJHaHFmMXA1bEU9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Iksvb3pCSlRoaXl6Z3lialVIeWlVWDRLMkh2WUluakRQVWU1ZTJ4dDFRUjg9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVURiWUdSOHZDWmxtTVM5d21UVThoUjVvZ1FmNnpnUlB4TGRKS044ZUVtdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTHdCTWFpdjRsb2U3Vk01Tm0xaWlPS1ljYitGbk53K1RCSlZIRERSU2x5Zz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkN0RWl1VVJxVisxQWhZVVhHRGdmenBrMTl4eUgzWUVyaUFLci95WmlhOHhpR3J5cEpNaDhiQ2FiQ1MxdmE3cSs5bUxHTzdVSjNidzJaNVNiekdZSUJRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTk2LCJhZHZTZWNyZXRLZXkiOiIyK3MzYmNQSlQ2bi8yZnd0SUEzc3NtVkVuOGF6NTUvSWhoTjV0LzNRa1VvPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJWeXI1dy1IelFsbTFJeU1HT2l4VS1RIiwicGhvbmVJZCI6IjA2NThjNmU1LTM4OGMtNDUxNi1hMDNiLWQ4Njc0Y2ZiOTczZSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJHT05SbmQ3czE3VjR5NkxDbmYrbVlYUG9vQlk9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRWN2bFUrY0xucHo5dGk2R2E5bGZLay8xYmNrPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjJQNkYxMlZMIiwibWUiOnsiaWQiOiIyNTQ3OTAyMTc5MjM6MzhAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiSHV5dSBLaWphbmFhIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNQZnUwYUFCRUpML3RiMEdHQUVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJ2cFRUL09FWlFyWWplSXlDajVIS3AwSFZ4Vkd2dGFpTWx5Sko2TytFUFFnPSIsImFjY291bnRTaWduYXR1cmUiOiI0YkxxaTB0WE5iSHhIblF0WmtmMUFmbVlhaGpXd2lQWnVsZklJeTdoN3VxZmUrK1c3dTVoeWRmZ2VVaXBYdUFWV0NtMVdHM0NqUnQySDArNkRXbjZEQT09IiwiZGV2aWNlU2lnbmF0dXJlIjoibDJPUTl1YlVGNWthNEhSRlY4SlUvZXJQTkJGSjJ3ajhFN2tkRUMwSkcxT0FUQWRLMytqMTNLakIyUjNESVdKUndWRjNKdEd2a3hYZzkvblNlYmRHQkE9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyNTQ3OTAyMTc5MjM6MzhAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCYjZVMC96aEdVSzJJM2lNZ28rUnlxZEIxY1ZScjdXb2pKY2lTZWp2aEQwSSJ9fV0sInBsYXRmb3JtIjoic21iYSIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczOTQyMzY0OX0=");
require("dotenv").config({ path: "./config.env" });

let auto_reply_message = "Hello, my owner is unavailable. Kindly leave a message.";

async function authentification() {
  try {
    if (!fs.existsSync(__dirname + "/auth/creds.json")) {
      console.log("Connected successfully...");
      await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
    } else if (fs.existsSync(__dirname + "/auth/creds.json") && session !== "zokk") {
      await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
    }
  } catch (e) {
    console.log("Session Invalid " + e);
  }
}
authentification();

const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" })
});

setTimeout(() => {
  async function main() {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + "/auth");

    const sockOptions = {
      version,
      logger: pino({ level: "silent" }),
      browser: ['LUCKY-MD', "safari", "1.0.0"],
      printQRInTerminal: true,
      fireInitQueries: false,
      shouldSyncHistoryMessage: true,
      downloadHistory: true,
      syncFullHistory: true,
      generateHighQualityLinkPreview: true,
      markOnlineOnConnect: false,
      keepAliveIntervalMs: 30_000,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger)
      },
      getMessage: async (key) => {
        if (store) {
          const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
          return msg.message || undefined;
        }
        return { conversation: 'An Error Occurred, Repeat Command!' };
      }
    };

    const zk = require("@whiskeysockets/baileys")(sockOptions);
    store.bind(zk.ev);
    setInterval(() => {
      store.writeToFile("store.json");
    }, 3000);

    zk.ev.on("call", async (callData) => {
      if (conf.ANTI_CALL === 'yes') {
        const callId = callData[0].id;
        const callerId = callData[0].from;
        await zk.rejectCall(callId, callerId);
        await zk.sendMessage(callerId, {
          text: "❗📵I AM LUCKY MD | I REJECT THIS CALL BECAUSE MY OWNER IS NOT AVAILABLE FOR NOW. KINDLY SEND MESSAGE RIGHT NOW."
        });
      }
    });

    zk.ev.on("messages.upsert", async (m) => {
      const { messages } = m;
      const ms = messages[0];
      if (!ms.message) return;

      const messageKey = ms.key;
      const remoteJid = messageKey.remoteJid;

      if (!store.chats[remoteJid]) {
        store.chats[remoteJid] = [];
      }

      store.chats[remoteJid].push(ms);

      if (ms.message.protocolMessage && ms.message.protocolMessage.type === 0) {
        const deletedKey = ms.message.protocolMessage.key;
        const chatMessages = store.chats[remoteJid];
        const deletedMessage = chatMessages.find(msg => msg.key.id === deletedKey.id);

        if (deletedMessage) {
          const deletedBy = deletedMessage.key.participant || deletedMessage.key.remoteJid;
          let notification = `*🤦LUCKY ANTIDELETE🤦*`;
          notification += `*Time deleted🌹:* ${new Date().toLocaleString()}`;
          notification += `*Deleted by🌺:* @${deletedBy.split('@')[0]}`;

          if (deletedMessage.message.conversation) {
            await zk.sendMessage(remoteJid, {
              text: notification + `*Message:* ${deletedMessage.message.conversation}`,
              mentions: [deletedMessage.key.participant]
            });
          } else if (deletedMessage.message.imageMessage || deletedMessage.message.videoMessage || deletedMessage.message.documentMessage || deletedMessage.message.audioMessage || deletedMessage.message.stickerMessage || deletedMessage.message.voiceMessage) {
            const mediaBuffer = await downloadMedia(deletedMessage.message);
            if (mediaBuffer) {
              const mediaType = deletedMessage.message.imageMessage ? 'image' : deletedMessage.message.videoMessage ? 'video' : deletedMessage.message.documentMessage ? 'document' : deletedMessage.message.audioMessage ? 'audio' : deletedMessage.message.stickerMessage ? 'sticker' : 'audio';
              await zk.sendMessage(remoteJid, {
                [mediaType]: mediaBuffer,
                caption: notification,
                mentions: [deletedMessage.key.participant]
              });
            }
          }
        }
      }
    });

    let repliedContacts = new Set();
    zk.ev.on("messages.upsert", async (m) => {
      const { messages } = m;
      const ms = messages[0];
      if (!ms.message) return;
      const messageText = ms.message.conversation || ms.message.extendedTextMessage?.text || "";
      const remoteJid = ms.key.remoteJid;

      if (messageText.match(/^[^\w\s]/) && ms.key.fromMe) {
        const prefix = messageText[0];
        const command = messageText.slice(1).split(" ")[0];
        const newMessage = messageText.slice(prefix.length + command.length).trim();

        if (command === "setautoreply" && newMessage) {
          auto_reply_message = newMessage;
          await zk.sendMessage(remoteJid, {
            text: `Auto-reply message has been updated to:\n"${auto_reply_message}"`
          });
          return;
        }
      }

      if (conf.AUTO_REPLY === "yes" && !repliedContacts.has(remoteJid) && !ms.key.fromMe && !remoteJid.includes("@g.us")) {
        await zk.sendMessage(remoteJid, {
          text: auto_reply_message,
          mentions: [ms.key.remoteJid]
        });

        repliedContacts.add(remoteJid);
      }
    });

    if (conf.AUTO_REACT === "yes") {
      zk.ev.on("messages.upsert", async (m) => {
        const { messages } = m;
        let emojis = [];
        const emojiFilePath = path.resolve(__dirname, 'luckybase', 'like.json');

        try {
          const data = fs.readFileSync(emojiFilePath, 'utf8');
          emojis = JSON.parse(data);
        } catch (error) {
          console.error('Error reading emojis file:', error);
          return;
        }

        for (const message of messages) {
          if (!message.key.fromMe) {
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            await zk.sendMessage(message.key.remoteJid, {
              react: {
                text: randomEmoji,
                key: message.key
              }
            });
          }
        }
      });
    }

    let lastReactionTime = 0;
    const loveEmojis = ["❤️", "💖", "💘", "💝", "💓", "💌", "💕", "😎", "🔥", "💥", "💯", "✨", "🌟", "🌈", "⚡", "💎", "🌀", "👑", "🎉", "🎊", "🦄", "👽", "🛸", "🚀", "🦋", "💫", "🍀", "🎶", "🎧", "🎸", "🎤", "🏆", "🏅", "🌍", "🌎", "🌏", "🎮", "🎲", "💪", "🏋️", "🥇", "👟", "🏃", "🚴", "🚶", "🏄", "⛷️", "🕶️", "🧳", "🍿", "🥂", "🍻", "🍷", "🍸", "🥃", "🍾", "🎯", "⏳", "🎁", "🎈", "🎨", "🌻", "🌸", "🌺", "🌹", "🌼", "🌞", "🌝", "🌜", "🌙", "🌚", "🍀", "🌱", "🍃", "🍂", "🌾", "🐉", "🐍", "🦓", "🦄", "🦋", "🦧", "🦘", "🦨", "🦡", "🐉", "🐅", "🐆", "🐓", "🐢", "🐊", "🐠", "🐟", "🐡", "🦑", "🐙", "🦀", "🐬", "🦕", "🦖", "🐾", "🐕", "🐈", "🐇", "🐾"];

    if (conf.AUTO_REACT_STATUS === "yes") {
      console.log("AUTO_REACT_STATUS is enabled. Listening for status updates...");
      zk.ev.on("messages.upsert", async (m) => {
        const { messages } = m;
        for (const message of messages) {
          if (message.key && message.key.remoteJid === "status@broadcast") {
            const now = Date.now();
            if (now - lastReactionTime < 5000) {
              continue;
            }

            const keith = zk.user && zk.user.id ? zk.user.id.split(":")[0] + "@s.whatsapp.net" : null;
            if (!keith) continue;

            const randomLoveEmoji = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];
            await zk.sendMessage(message.key.remoteJid, {
              react: {
                key: message.key,
                text: randomLoveEmoji
              }
            });

            lastReactionTime = Date.now();
            console.log(`Successfully reacted to status update by ${message.key.remoteJid} with ${randomLoveEmoji}`);

            await delay(2000); // 2-second delay between reactions
          }
        }
      });
    }
  }

  main();
}, 0);
