"use strict";

const { makeInMemoryStore, fetchLatestBaileysVersion, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs-extra");
const path = require("path");
const conf = require("./set");
const session = conf.session.replace(/LUCKY-MD;;;=>/g, "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZUdCbDViZytqTHJXQXJGZDY3VDF1RUE1SXBYelo2aVprWW41NlUyRWszWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaFhTRndnQWFpYXgvZ1BkWE51ZUpINkhwakFyKzNRK2JYR21Uem5MSHVROD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJLTmI3UzRhT2FxMFJ3SlRFZDVDT3kxRllJVnFEeXQvRkRYamVyTjZad1VFPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJvc1dIMDFuQVU3VDFxNVR1dGV4cTZNRU40MGNnRlNnakxpZ2dpd2NkZ1NrPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlFCWXB4RldYLys4a2ZHN01mUFo1K3NSQ0k4UWIvYWNvZTF2TWVobFBkMnc9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImllVk9qK1h3Y0hDR3o0SXMvSUJid29aUjRCRXF4Yk8xS2Vsdk95Z0MxSFE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib0xpemloNCs5cmx4Q2ZncEFwVm9hOFFqK3l0OWdCRTNoc0FhdytFV0Jubz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiN3VEeEthbSt2SW9QUHdKNStXaUxabHczMXlFUXF4U2ppNjF6NzhaRG5DWT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjR3QmZOc1ladXlTU0hkV3V0MzR0NTI0OXo4bm1wbUFZOHN0Q0UraW40R2QwNUpDTDV3a0laTGhma1Y0endGdFZXeHg2QWtnSDBYcy9iR3YrTWRuRWpBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTM5LCJhZHZTZWNyZXRLZXkiOiJQZEI1N0sxN1UxQS9BTCswVkUzR3lWTEhwTENIa2V0VzNUM0hEQ29RVGFNPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjI1NDc5MDIxNzkyM0BzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJCRkMyQjEwQUE2MDI5RjJERkE3QkU2NEE5Mzk4QzJBOSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzM5MjExOTUyfV0sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJNcHZoa2lDMFRET3luUUI2M3p4U3h3IiwicGhvbmVJZCI6IjcyZjg4NjZlLTRhNDUtNGMxNy1iZDU5LTNlMThiZjEyMDI3OCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIrMkpzTk82QnVReEo2WDFuTllVMDNLeG1rZE09In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOXJ2V1duUCtDVm1mMjF0TUlFV2hveFlXRHBzPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IktMMUwxRDRTIiwibWUiOnsiaWQiOiIyNTQ3OTAyMTc5MjM6MzVAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiSHV5dSBLaWphbmFhIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNQYnUwYUFCRUo2SnFiMEdHQW9nQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJ2cFRUL09FWlFyWWplSXlDajVIS3AwSFZ4Vkd2dGFpTWx5Sko2TytFUFFnPSIsImFjY291bnRTaWduYXR1cmUiOiJXU3JreHJSbEF2cUFNL0tYRUk1Ym9QWWVta3BmMDA0bXNPOElEeDdxMEJYN3ZWS2VSYnNaaWcrcFo5MWtrRlJMRDkxeXBaYU1URmJOaSt5emY5cmxCdz09IiwiZGV2aWNlU2lnbmF0dXJlIjoiRVJ4eHN6N3hidGt6ZVZtR1RQTEtyU0NzK0tPcVA1K3kyQnprYk9xZnFLc2F1MjZuNFFONnpvaUV1dXRRMy9pNFRqcXVoUGJHN3ZJd3U3QUpGSEFLaGc9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyNTQ3OTAyMTc5MjM6MzVAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCYjZVMC96aEdVSzJJM2lNZ28rUnlxZEIxY1ZScjdXb2pKY2lTZWp2aEQwSSJ9fV0sInBsYXRmb3JtIjoic21iYSIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczOTIxMTk0NywibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFMekcifQ==");
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
