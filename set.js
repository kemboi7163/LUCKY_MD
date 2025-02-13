const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT0ZuaUZ1UmQzYW9OZVp4bDFBbFFnQnVQOTVrV2JzUzZqTGs4RHV6VXUwST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibVRJOWVlMEpWbFZDcFUyS25XTkNhY2ovZ1dhaEpXVldlNTc4czNTYkJ4ND0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJxSk1IWXplNXhqOUplZ0JMcTA1TnY2UFBxNlpZL0c2Y24wMFJNc0FmQkVrPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJkK3VyMEpjdzRlSVE1eEVKbExFcXV4NURtU0pHbzJqWEtVNmcrVCt6dWdVPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImVQc2hxVi9lMXNWd0RDbWJubGdTa3hoczh2UlExZ0E4RlJHaHFmMXA1bEU9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Iksvb3pCSlRoaXl6Z3lialVIeWlVWDRLMkh2WUluakRQVWU1ZTJ4dDFRUjg9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVURiWUdSOHZDWmxtTVM5d21UVThoUjVvZ1FmNnpnUlB4TGRKS044ZUVtdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTHdCTWFpdjRsb2U3Vk01Tm0xaWlPS1ljYitGbk53K1RCSlZIRERSU2x5Zz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkN0RWl1VVJxVisxQWhZVVhHRGdmenBrMTl4eUgzWUVyaUFLci95WmlhOHhpR3J5cEpNaDhiQ2FiQ1MxdmE3cSs5bUxHTzdVSjNidzJaNVNiekdZSUJRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTk2LCJhZHZTZWNyZXRLZXkiOiIyK3MzYmNQSlQ2bi8yZnd0SUEzc3NtVkVuOGF6NTUvSWhoTjV0LzNRa1VvPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJWeXI1dy1IelFsbTFJeU1HT2l4VS1RIiwicGhvbmVJZCI6IjA2NThjNmU1LTM4OGMtNDUxNi1hMDNiLWQ4Njc0Y2ZiOTczZSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJHT05SbmQ3czE3VjR5NkxDbmYrbVlYUG9vQlk9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRWN2bFUrY0xucHo5dGk2R2E5bGZLay8xYmNrPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjJQNkYxMlZMIiwibWUiOnsiaWQiOiIyNTQ3OTAyMTc5MjM6MzhAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiSHV5dSBLaWphbmFhIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNQZnUwYUFCRUpML3RiMEdHQUVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJ2cFRUL09FWlFyWWplSXlDajVIS3AwSFZ4Vkd2dGFpTWx5Sko2TytFUFFnPSIsImFjY291bnRTaWduYXR1cmUiOiI0YkxxaTB0WE5iSHhIblF0WmtmMUFmbVlhaGpXd2lQWnVsZklJeTdoN3VxZmUrK1c3dTVoeWRmZ2VVaXBYdUFWV0NtMVdHM0NqUnQySDArNkRXbjZEQT09IiwiZGV2aWNlU2lnbmF0dXJlIjoibDJPUTl1YlVGNWthNEhSRlY4SlUvZXJQTkJGSjJ3ajhFN2tkRUMwSkcxT0FUQWRLMytqMTNLakIyUjNESVdKUndWRjNKdEd2a3hYZzkvblNlYmRHQkE9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyNTQ3OTAyMTc5MjM6MzhAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCYjZVMC96aEdVSzJJM2lNZ28rUnlxZEIxY1ZScjdXb2pKY2lTZWp2aEQwSSJ9fV0sInBsYXRmb3JtIjoic21iYSIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczOTQyMzY0OX0=',
    PREFIXE: process.env.PREFIX || ".",
    GITHUB : process.env.GITHUB|| 'https://github.com/Fred1e/LUCKY_MD',
    OWNER_NAME : process.env.OWNER_NAME || "Huyu_Kijanaa",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "254790217923",  
              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    AUTO_REACT: process.env.AUTO_REACTION || "non",  
     AUTO_SAVE_CONTACTS : process.env.AUTO_SAVE_CONTACTS || 'no',
    URL: process.env.URL || "https://files.catbox.moe/7irwqn.jpeg",  
    AUTO_REACT_STATUS: process.env.AUTO_REACT_STATUS || 'yes',              
    CHAT_BOT: process.env.CHAT_BOT || "off",              
    AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "no",
    AUTO_BLOCK: process.env.AUTO_BLOCK || 'no', 
    GCF: process.env.GROUP_HANDLE || 'no', 
    AUTO_REPLY : process.env.AUTO_REPLY || "no", 
    AUTO_STATUS_TEXT: process.env.AUTO_STATUS_TEXT || 'viewed by Huyu kijanaa',   
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || 'no',
    AUTO_BIO: process.env.AUTO_BIO || 'yes',       
    ANTI_CALL_TEXT : process.env.ANTI_CALL_TEXT || 'Huyu kijanaa is not available at the moment',             
    GURL: process.env.GURL  || "https://whatsapp.com/channel/0029VaihcQv84Om8LP59fO3f",
    WEBSITE :process.env.GURL || "https://whatsapp.com/channel/0029VaihcQv84Om8LP59fO3f",
    CAPTION : process.env.CAPTION || "✧⁠LUCKY_MD✧",
    BOT : process.env.BOT_NAME || '✧⁠LUCKY_MD✧⁠',
    MODE: process.env.PUBLIC_MODE || "no",              
    TIMEZONE: process.env.TIMEZONE || "Africa/Dodoma", 
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME || null,
    HEROKU_API_KEY : process.env.HEROKU_API_KEY || null,
    WARN_COUNT : process.env.WARN_COUNT || '5' ,
    ETAT : process.env.PRESENCE || '1',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ANTI_DELETE_MESSAGE : process.env.ANTI_DELETE_MESSAGE || 'no',
    ANTI_CALL: process.env.ANTI_CALL || 'yes', 
    AUDIO_REPLY : process.env.AUDIO_REPLY || 'yes',             
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

