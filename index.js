const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, downloadMediaMessage } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
const chalk = require('chalk');
const sharp = require('sharp');
const axios = require('axios');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { Darkjokes } = require('dhn-api');
const request = require('request');

// Fungsi untuk menyimpan sesi
const saveSession = async (sessionId, sessionData) => {
    const sessionDir = './sessions';
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir);
    }
    fs.writeFileSync(`${sessionDir}/${sessionId}.json`, JSON.stringify(sessionData, null, 2));
};

// Fungsi untuk memuat sesi
const loadSession = (sessionId) => {
    const sessionFile = `./sessions/${sessionId}.json`;
    if (fs.existsSync(sessionFile)) {
        return JSON.parse(fs.readFileSync(sessionFile, 'utf-8'));
    }
    return null;
};

// Daftar fitur bot
const fiturBot = {
    images: [
    {
        command: '.cecan',
        deskripsi: 'Mengirim gambar random dari database cecan online'
    },
    {
        command: '.cecan2',
        deskripsi: 'Mengirim gambar random dari database cecan2 online'
    },
    {
        command: '.cecan3',
        deskripsi: 'Mengirim gambar random dari database cecan3 online'
    },
    {
        command: '.cecan4',
        deskripsi: 'Mengirim gambar random dari database cecan4 online'
    },
    {
        command: '.cecan5',
        deskripsi: 'Mengirim gambar random dari database cecan5 online'
    },
    {
        command: '.china',
        deskripsi: 'Mengirim gambar random dari database china online'
    },
    {
        command: '.thailand',
        deskripsi: 'Mengirim gambar random dari database thailand online'
    },
    {
        command: '.vietnam',
        deskripsi: 'Mengirim gambar random dari database vietnam online'
        }
    ],
    anime: [
        { command: '.akira', deskripsi: 'Gambar random karakter Akira' },
        { command: '.akiyama', deskripsi: 'Gambar random karakter Akiyama' },
        { command: '.ana', deskripsi: 'Gambar random karakter Ana' },
        { command: '.asuna', deskripsi: 'Gambar random karakter Asuna' },
        { command: '.ayuzawa', deskripsi: 'Gambar random karakter Ayuzawa' },
        { command: '.boruto', deskripsi: 'Gambar random karakter Boruto' },
        { command: '.chitanda', deskripsi: 'Gambar random karakter Chitanda' },
        { command: '.chitoge', deskripsi: 'Gambar random karakter Chitoge' },
        { command: '.deidara', deskripsi: 'Gambar random karakter Deidara' },
        { command: '.doraemon', deskripsi: 'Gambar random karakter Doraemon' },
        { command: '.elaina', deskripsi: 'Gambar random karakter Elaina' },
        { command: '.emilia', deskripsi: 'Gambar random karakter Emilia' },
        { command: '.erza', deskripsi: 'Gambar random karakter Erza' },
        { command: '.gremory', deskripsi: 'Gambar random karakter Gremory' },
        { command: '.hestia', deskripsi: 'Gambar random karakter Hestia' },
        { command: '.hinata', deskripsi: 'Gambar random karakter Hinata' },
        { command: '.hitogoto', deskripsi: 'Gambar random karakter Hitogoto' },
        { command: '.inor', deskripsi: 'Gambar random karakter Inor' },
        { command: '.isuzu', deskripsi: 'Gambar random karakter Isuzu' },
        { command: '.itachi', deskripsi: 'Gambar random karakter Itachi' },
        { command: '.itach', deskripsi: 'Gambar random karakter Itach' },
        { command: '.itori', deskripsi: 'Gambar random karakter Itori' },
        { command: '.kaga', deskripsi: 'Gambar random karakter Kaga' },
        { command: '.kagura', deskripsi: 'Gambar random karakter Kagura' },
        { command: '.kakashi', deskripsi: 'Gambar random karakter Kakashi' },
        { command: '.kaori', deskripsi: 'Gambar random karakter Kaori' },
        { command: '.keneki', deskripsi: 'Gambar random karakter Keneki' },
        { command: '.kosaki', deskripsi: 'Gambar random karakter Kosaki' },
        { command: '.kotori', deskripsi: 'Gambar random karakter Kotori' },
        { command: '.kuriyama', deskripsi: 'Gambar random karakter Kuriyama' },
        { command: '.kuroha', deskripsi: 'Gambar random karakter Kuroha' },
        { command: '.kurumi', deskripsi: 'Gambar random karakter Kurumi' },
        { command: '.lol', deskripsi: 'Gambar random karakter Lol' },
        { command: '.madara', deskripsi: 'Gambar random karakter Madara' },
        { command: '.megumin', deskripsi: 'Gambar random karakter Megumin' },
        { command: '.mikasa', deskripsi: 'Gambar random karakter Mikasa' },
        { command: '.miku', deskripsi: 'Gambar random karakter Miku' },
        { command: '.minato', deskripsi: 'Gambar random karakter Minato' },
        { command: '.naruto', deskripsi: 'Gambar random karakter Naruto' },
        { command: '.natsukawa', deskripsi: 'Gambar random karakter Natsukawa' },
        { command: '.neko', deskripsi: 'Gambar random karakter Neko' },
        { command: '.nekonime', deskripsi: 'Gambar random karakter Nekonime' },
        { command: '.nezuko', deskripsi: 'Gambar random karakter Nezuko' },
        { command: '.nishimiya', deskripsi: 'Gambar random karakter Nishimiya' },
        { command: '.onepiece', deskripsi: 'Gambar random karakter Onepiece' },
        { command: '.tsunade', deskripsi: 'Gambar random karakter Tsunade' },
        { command: '.waifu', deskripsi: 'Gambar random karakter Waifu' },
        { command: '.waifu2', deskripsi: 'Gambar random karakter Waifu2' },
        { command: '.wallhp2', deskripsi: 'Gambar random karakter Wallhp2' },
        { command: '.yatogami', deskripsi: 'Gambar random karakter Yatogami' },
        { command: '.yuki', deskripsi: 'Gambar random karakter Yuki' },
        { command: '.yuri', deskripsi: 'Gambar random karakter Yuri' },
        { command: '.pokemon', deskripsi: 'Gambar random karakter Pokemon' },
        { command: '.ppcouple', deskripsi: 'Gambar random karakter PPCouple' },
        { command: '.rem', deskripsi: 'Gambar random karakter Rem' },
        { command: '.rize', deskripsi: 'Gambar random karakter Rize' },
        { command: '.sagiri', deskripsi: 'Gambar random karakter Sagiri' },
        { command: '.sakura', deskripsi: 'Gambar random karakter Sakura' },
        { command: '.sasuke', deskripsi: 'Gambar random karakter Sasuke' },
        { command: '.shina', deskripsi: 'Gambar random karakter Shina' },
        { command: '.shinka', deskripsi: 'Gambar random karakter Shinka' },
        { command: '.shizuka', deskripsi: 'Gambar random karakter Shizuka' },
        { command: '.shota', deskripsi: 'Gambar random karakter Shota' },
        { command: '.tomori', deskripsi: 'Gambar random karakter Tomori' },
        { command: '.toukachan', deskripsi: 'Gambar random karakter Toukachan' }
    ],
    asupan: [
        { command: '.asupan', deskripsi: 'Video random asupan' }
    ],
    tools: [
    {
            command: '.stiker',
            deskripsi: 'Membuat stiker dari gambar yang dikirim dengan caption .stiker'
        },
        {
            command: '.menu',
            deskripsi: 'Menampilkan daftar fitur yang tersedia di bot ini'
    },
    {
            command: '.autoread on',
            deskripsi: 'Mengaktifkan fitur autoread (pesan otomatis terbaca)'
        },
        {
            command: '.autoread off',
            deskripsi: 'Menonaktifkan fitur autoread (pesan tidak otomatis terbaca)'
        },
        {
            command: '.gdrive',
            deskripsi: 'Mendownload file dari Google Drive'
        },
        {
            command: '.gitclone',
            deskripsi: 'Mendownload repository dari GitHub'
        },
        {
            command: '.ss <url>',
            deskripsi: 'Mengambil screenshot website via hp'
        },
        {
            command: '.ssweb <url>',
            deskripsi: 'Mengambil screenshot website via tablet'
        },
        {
            command: '.sspc <url>',
            deskripsi: 'Mengambil screenshot website via pc'
        },
        {
            command: '.sslaptop <url>',
            deskripsi: 'Mengambil screenshot website via laptop'
        },
        {
            command: '.sshp <url>',
            deskripsi: 'Mengambil screenshot website via hp'
        },
        {
            command: '.sstablet <url>',
            deskripsi: 'Mengambil screenshot website via tablet'
        },
        {
            command: '.zerogpt <teks>',
            deskripsi: 'Mendeteksi apakah teks dibuat oleh AI'
        }
    ],
    game: [
    {
        command: '.asahotak',
            deskripsi: 'Game asah otak'
    },
    {
        command: '.caklontong',
            deskripsi: 'Game caklontong'
        },
        {
            command: '.family100',
            deskripsi: 'Game Family 100, tebak semua jawaban dari satu soal!'
        }
    ],
    alkitab: [
        {
            command: '.alkitab',
            deskripsi: 'Mencari ayat Alkitab berdasarkan kata kunci'
        }
    ],
    islami: [
        {
            command: '.asmaulhusna',
            deskripsi: 'Menampilkan Asmaul Husna (contoh: .asmaulhusna 1)'
        },
        {
            command: '.alquran',
            deskripsi: 'Mencari ayat Alquran (contoh: .alquran 1 2)'
        },
        {
            command: '.kisahnabi',
            deskripsi: 'Menampilkan kisah nabi (contoh: .kisahnabi adam)'
        },
        {
            command: '.murotal',
            deskripsi: 'Menampilkan link murotal Al-Quran'
        }
    ],
    info: [
        {
            command: '.animeinfo',
            deskripsi: 'Mencari informasi tentang anime'
        },
        {
            command: '.cerpen',
            deskripsi: 'Cerpen random dari dhn-api'
        },
        {
            command: '.kataanime',
            deskripsi: 'Kutipan anime random (indo)'
        },
        {
            command: '.gempa',
            deskripsi: 'Info gempa bumi terbaru dari BMKG'
        },
        {
            command: '.cuaca <kota>',
            deskripsi: 'Cek cuaca dari OpenWeatherMap'
        }
    ],
    quotes: [
        {
            command: '.motivasi',
            deskripsi: 'Kutipan motivasi random'
        }
    ],
    fun: [
        {
            command: '.cekkhodam',
            deskripsi: 'Cek khodam'
        },
        {
            command: '.darkjoke',
            deskripsi: 'Mengirim dark joke dalam bentuk gambar'
        },
        {
            command: '.nsfw <kategori>',
            deskripsi: 'Gambar NSFW random (Fantox-APIs). Contoh: .bikini, .nude, .catgirl, dll'
        }
    ],
    news: [
        {
            command: '.cnn',
            deskripsi: 'Menampilkan berita terbaru dari CNN Indonesia'
        }
    ]
};

// Fungsi untuk menampilkan menu
const showMenu = (sock, sender) => {
    let menuText = '🎮 *MENU BOT* 🎮\n\n';
    menuText += '📸 *Kategori Images*\n';
    fiturBot.images.forEach(fitur => {
        menuText += `• ${fitur.command} - ${fitur.deskripsi}\n`;
    });
    menuText += '\n🗾 *Kategori Anime*\n';
    fiturBot.anime.forEach(fitur => {
        menuText += `• ${fitur.command} - ${fitur.deskripsi}\n`;
    });
    menuText += '\n🎬 *Kategori Asupan*\n';
    fiturBot.asupan.forEach(fitur => {
        menuText += `• ${fitur.command} - ${fitur.deskripsi}\n`;
    });
    menuText += '\n🛠️ *Kategori Tools*\n';
    fiturBot.tools.forEach(fitur => {
        menuText += `• ${fitur.command} - ${fitur.deskripsi}\n`;
    });
    menuText += '\n🎲 *Kategori Game*\n';
    fiturBot.game.forEach(fitur => {
        menuText += `• ${fitur.command} - ${fitur.deskripsi}\n`;
    });
    menuText += '\n📖 *Kategori Alkitab*\n';
    fiturBot.alkitab.forEach(fitur => {
        menuText += `• ${fitur.command} - ${fitur.deskripsi}\n`;
    });
    menuText += '\n☪️ *Kategori Islami*\n';
    fiturBot.islami.forEach(fitur => {
        menuText += `• ${fitur.command} - ${fitur.deskripsi}\n`;
    });
    menuText += '\nℹ️ *Kategori Info*\n';
    fiturBot.info.forEach(fitur => {
        menuText += `• ${fitur.command} - ${fitur.deskripsi}\n`;
    });
    menuText += '\n🎯 *Kategori Fun*\n';
    fiturBot.fun.forEach(fitur => {
        menuText += `• ${fitur.command} - ${fitur.deskripsi}\n`;
    });
    menuText += '\n\nGunakan command di atas untuk mengakses fitur yang diinginkan!';
    sock.sendMessage(sender, { text: menuText });
};

// Daftar prefix yang didukung
const prefixes = ['.', '!', '/', '#', '1','2','3','4','5','6','7','8','9','0','@','$','%','^','&','*','(',')','_','+','=','-','[',']',';','\'',',','.','/','{','}','\":','<','>','?','|'];

// State asah otak per chat
const asahOtakState = {};

// State caklontong per chat
const caklontongState = {};

// State autoread
let autoreadState = true;

// State family100 per chat
const family100State = {};

// Helper untuk countdown waktu
function startCountdown(sock, sender, msg, total, stateObj, label) {
    let sisa = total;
    stateObj[sender].interval = setInterval(async () => {
        sisa -= 5;
        if (sisa === 30 || sisa === 10) {
            await sock.sendMessage(sender, { text: `⏳ WAKTU TERSISA ${sisa} DETIK!! (${label})` }, { quoted: msg });
        }
        if (sisa <= 0 || !stateObj[sender]) {
            clearInterval(stateObj[sender]?.interval);
        }
    }, 5000);
}

// Fungsi untuk menghubungkan ke WhatsApp
const connectToWhatsApp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('sessions');
    
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        defaultQueryTimeoutMs: undefined,
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('Terhubung ke WhatsApp!');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Tambahkan event handler untuk pesan masuk
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type === 'notify' && messages && messages[0]) {
            const msg = messages[0];
            const sender = msg.key.remoteJid;
            // Autoread handler (pindahkan ke awal)
            if (autoreadState) {
                await sock.readMessages([msg.key]);
            }
            const isGroup = sender.endsWith('@g.us');
            const chatType = isGroup ? 'GRUP' : 'PRIBADI';
            // Fungsi untuk ekstrak teks dari berbagai struktur pesan
            function extractText(msg) {
                if (!msg) return '';
                if (msg.conversation) return msg.conversation;
                if (msg.extendedTextMessage && msg.extendedTextMessage.text) return msg.extendedTextMessage.text;
                if (msg.imageMessage && msg.imageMessage.caption) return msg.imageMessage.caption;
                if (msg.videoMessage && msg.videoMessage.caption) return msg.videoMessage.caption;
                if (msg.documentMessage && msg.documentMessage.caption) return msg.documentMessage.caption;
                if (msg.ephemeralMessage) return extractText(msg.ephemeralMessage.message);
                if (msg.viewOnceMessage) return extractText(msg.viewOnceMessage.message);
                return '';
            }
            const text = extractText(msg.message) || '[Non-text message]';
            console.log(chalk.bold.green`\nTipe Chat : ${chatType}\nNomer/ID  : ${sender}\nPesan     : ${text}\n`);

            // Deteksi prefix dan command
            const prefix = prefixes.find(p => text.trim().startsWith(p));
            const commandBody = prefix ? text.trim().slice(prefix.length) : '';

            // Fitur menu otomatis
            if (prefix && ['menu', 'help', 'm', 'h'].includes(commandBody)) {
                showMenu(sock, sender);
                return;
            }

            // Fitur stiker dari gambar (langsung atau via reply)
            const isStikerCmd = (cmd) => ['stiker', 's'].includes(cmd);
            // Jika pesan gambar dengan caption perintah
            if (
                msg.message?.imageMessage &&
                (msg.message?.imageMessage?.caption && prefixes.some(p => msg.message?.imageMessage?.caption.startsWith(p) && isStikerCmd(msg.message?.imageMessage?.caption.slice(p.length))) ||
                (prefix && isStikerCmd(commandBody)))
            ) {
                await sock.sendMessage(sender, { text: 'wait...' }, { quoted: msg });
                try {
                    const buffer = await downloadMediaMessage(
                        msg,
                        'buffer',
                        {},
                        { reuploadRequest: sock }
                    );
                    if (buffer) {
                        const webpBuffer = await sharp(buffer).webp().toBuffer();
                        await sock.sendMessage(sender, {
                            sticker: webpBuffer,
                            mimetype: 'image/webp'
                        }, { quoted: msg });
                    } else {
                        await sock.sendMessage(sender, { text: 'Gagal mengunduh gambar.' }, { quoted: msg });
                    }
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal membuat stiker.' }, { quoted: msg });
                }
            }
            // Jika reply ke gambar dengan perintah stiker/s
            else if (
                msg.message?.extendedTextMessage?.contextInfo?.quotedMessage &&
                prefix && isStikerCmd(commandBody)
            ) {
                const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage;
                if (!quoted.imageMessage) {
                    await sock.sendMessage(sender, { text: 'Pesan yang direply bukan gambar.' }, { quoted: msg });
                    return;
                }
                await sock.sendMessage(sender, { text: 'wait...' }, { quoted: msg });
                try {
                    const quotedMsg = {
                        key: {
                            remoteJid: sender,
                            id: msg.message.extendedTextMessage.contextInfo.stanzaId,
                            fromMe: false
                        },
                        message: quoted
                    };
                    const buffer = await downloadMediaMessage(
                        quotedMsg,
                        'buffer',
                        {},
                        { reuploadRequest: sock }
                    );
                    if (buffer) {
                        const webpBuffer = await sharp(buffer).webp().toBuffer();
                        await sock.sendMessage(sender, {
                            sticker: webpBuffer,
                            mimetype: 'image/webp'
                        }, { quoted: msg });
                    } else {
                        await sock.sendMessage(sender, { text: 'Gagal mengunduh gambar dari reply.' }, { quoted: msg });
                    }
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal membuat stiker dari reply.' }, { quoted: msg });
                }
            }
            // Fitur cecan random
            if (prefix && commandBody === 'cecan') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari cecan...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://raw.githubusercontent.com/KazukoGans/database/refs/heads/main/cecan/cecan.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'Nih cecan random buat kamu!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar cecan.' }, { quoted: msg });
                }
                return;
            }
            // Fitur cecan2 random
            if (prefix && commandBody === 'cecan2') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari cecan2...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://raw.githubusercontent.com/KazukoGans/database/refs/heads/main/cecan/cecan2.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'Cecan 2 spesial buat kamu!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar cecan2.' }, { quoted: msg });
                }
                return;
            }
            // Fitur cecan3 random
            if (prefix && commandBody === 'cecan3') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari cecan3...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://raw.githubusercontent.com/KazukoGans/database/refs/heads/main/cecan/cecan3.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'Cecan 3 pilihan hari ini!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar cecan3.' }, { quoted: msg });
                }
                return;
            }
            // Fitur cecan4 random
            if (prefix && commandBody === 'cecan4') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari cecan4...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://raw.githubusercontent.com/KazukoGans/database/refs/heads/main/cecan/cecan4.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'Cecan 4, fresh from the oven!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar cecan4.' }, { quoted: msg });
                }
                return;
            }
            // Fitur cecan5 random
            if (prefix && commandBody === 'cecan5') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari cecan5...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://raw.githubusercontent.com/KazukoGans/database/refs/heads/main/cecan/cecan5.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'Cecan 5, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar cecan5.' }, { quoted: msg });
                }
                return;
            }
            // Fitur china random
            if (prefix && commandBody === 'china') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari china...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://raw.githubusercontent.com/KazukoGans/database/refs/heads/main/cecan/china.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'china, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar china.' }, { quoted: msg });
                }
                return;
            }
            // Fitur thailand random
            if (prefix && commandBody === 'thailand') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari thailand...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://raw.githubusercontent.com/KazukoGans/database/refs/heads/main/cecan/thailand.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'thailand, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar thailand.' }, { quoted: msg });
                }
                return;
            }
            // Fitur vietnam random
            if (prefix && commandBody === 'vietnam') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari vietnam...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://raw.githubusercontent.com/KazukoGans/database/refs/heads/main/cecan/vietnam.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'vietnam, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar vietnam.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter akira random
            if (prefix && commandBody === 'akira') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter akira...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/akira.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'akira, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar akira.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter akiyama random
            if (prefix && commandBody === 'akiyama') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter akiyama...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/akiyama.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'akiyama, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar akiyama.' }, { quoted: msg });
                }
                return;
            }
        // Fitur karakter ana random
        if (prefix && commandBody === 'ana') {
            await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter ana...' }, { quoted: msg });
            try {
                const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/ana.json');
                const list = res.data;
                const url = list[Math.floor(Math.random() * list.length)];
                await sock.sendMessage(sender, { image: { url }, caption: 'ana, spesial request!' }, { quoted: msg });
            } catch (e) {
                await sock.sendMessage(sender, { text: 'Gagal mengambil gambar ana.' }, { quoted: msg });
            }
            return;
        }
        // Fitur karakter asuna random
        if (prefix && commandBody === 'asuna') {
            await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter asuna...' }, { quoted: msg });
            try {
                const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/asuna.json');
                const list = res.data;
                const url = list[Math.floor(Math.random() * list.length)];
                await sock.sendMessage(sender, { image: { url }, caption: 'asuna, spesial request!' }, { quoted: msg });
            } catch (e) {
                await sock.sendMessage(sender, { text: 'Gagal mengambil gambar asuna.' }, { quoted: msg });
            }
            return;
        }
        // Fitur karakter ayuzawa random
        if (prefix && commandBody === 'ayuzawa') {
            await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter ayuzawa...' }, { quoted: msg });
            try {
                const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/ayuzawa.json');
                const list = res.data;
                const url = list[Math.floor(Math.random() * list.length)];
                await sock.sendMessage(sender, { image: { url }, caption: 'ayuzawa, spesial request!' }, { quoted: msg });
            } catch (e) {
                await sock.sendMessage(sender, { text: 'Gagal mengambil gambar ayuzawa.' }, { quoted: msg });
            }
            return;
        }
        // Fitur karakter boruto random
        if (prefix && commandBody === 'boruto') {
            await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter boruto...' }, { quoted: msg });
            try {
                const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/boruto.json');
                const list = res.data;
                const url = list[Math.floor(Math.random() * list.length)];
                await sock.sendMessage(sender, { image: { url }, caption: 'boruto, spesial request!' }, { quoted: msg });
            } catch (e) {
                await sock.sendMessage(sender, { text: 'Gagal mengambil gambar boruto.' }, { quoted: msg });
            }
            return;
        }
        // Fitur karakter chitanda random
        if (prefix && commandBody === 'chitanda') {
            await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter chitanda...' }, { quoted: msg });
            try {
                const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/chitanda.json');
                const list = res.data;
                const url = list[Math.floor(Math.random() * list.length)];
                await sock.sendMessage(sender, { image: { url }, caption: 'chitanda, spesial request!' }, { quoted: msg });
            } catch (e) {
                await sock.sendMessage(sender, { text: 'Gagal mengambil gambar chitanda.' }, { quoted: msg });
            }
            return;
        }
        // Fitur karakter chitoge random
        if (prefix && commandBody === 'chitoge') {
            await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter chitoge...' }, { quoted: msg });
            try {
                const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/chitoge.json');
                const list = res.data;
                const url = list[Math.floor(Math.random() * list.length)];
                await sock.sendMessage(sender, { image: { url }, caption: 'chitoge, spesial request!' }, { quoted: msg });
            } catch (e) {
                await sock.sendMessage(sender, { text: 'Gagal mengambil gambar chitoge.' }, { quoted: msg });
            }
            return;
        }
        // Fitur karakter deidara random
        if (prefix && commandBody === 'deidara') {
            await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter deidara...' }, { quoted: msg });
            try {
                const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/deidara.json');
                const list = res.data;
                const url = list[Math.floor(Math.random() * list.length)];
                await sock.sendMessage(sender, { image: { url }, caption: 'deidara, spesial request!' }, { quoted: msg });
            } catch (e) {
                await sock.sendMessage(sender, { text: 'Gagal mengambil gambar deidara.' }, { quoted: msg });
            }
            return;
        }
        // Fitur karakter doraemon random
        if (prefix && commandBody === 'doraemon') {
            await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter doraemon...' }, { quoted: msg });
            try {
                const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/doraemon.json');
                const list = res.data;
                const url = list[Math.floor(Math.random() * list.length)];
                await sock.sendMessage(sender, { image: { url }, caption: 'doraemon, spesial request!' }, { quoted: msg });
            } catch (e) {
                await sock.sendMessage(sender, { text: 'Gagal mengambil gambar doraemon.' }, { quoted: msg });
            }
            return;
        }
        // Fitur karakter elaina random
        if (prefix && commandBody === 'elaina') {
            await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter elaina...' }, { quoted: msg });
            try {
                const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/elaina.json');
                const list = res.data;
                const url = list[Math.floor(Math.random() * list.length)];
                await sock.sendMessage(sender, { image: { url }, caption: 'elaina, spesial request!' }, { quoted: msg });
            } catch (e) {
                await sock.sendMessage(sender, { text: 'Gagal mengambil gambar elaina.' }, { quoted: msg });
            }
            return;
        }
        // Fitur karakter emilia random
        if (prefix && commandBody === 'emilia') {
            await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter emilia...' }, { quoted: msg });
            try {
                const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/emilia.json');
                const list = res.data;
                const url = list[Math.floor(Math.random() * list.length)];
                await sock.sendMessage(sender, { image: { url }, caption: 'emilia, spesial request!' }, { quoted: msg });
            } catch (e) {
                await sock.sendMessage(sender, { text: 'Gagal mengambil gambar emilia.' }, { quoted: msg });
            }
            return;
        }
        // Fitur karakter erza random
        if (prefix && commandBody === 'erza') {
            await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter erza...' }, { quoted: msg });
            try {
                const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/erza.json');
                const list = res.data;
                const url = list[Math.floor(Math.random() * list.length)];
                await sock.sendMessage(sender, { image: { url }, caption: 'erza, spesial request!' }, { quoted: msg });
            } catch (e) {
                await sock.sendMessage(sender, { text: 'Gagal mengambil gambar erza.' }, { quoted: msg });
            }
            return;
            }
            // Fitur karakter gremory random
            if (prefix && commandBody === 'gremory') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter gremory...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/gremory.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'gremory, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar gremory.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter hestia random
            if (prefix && commandBody === 'hestia') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter hestia...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/hestia.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'hestia, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar hestia.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter hinata random
            if (prefix && commandBody === 'hinata') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter hinata...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/hinata.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'hinata, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar hinata.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter hitogoto random
            if (prefix && commandBody === 'hitogoto') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter hitogoto...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/hitogoto.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'hitogoto, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar hitogoto.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter inor random
            if (prefix && commandBody === 'inor') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter inor...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/inor.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'inor, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar inor.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter isuzu random
            if (prefix && commandBody === 'isuzu') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter isuzu...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/isuzu.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'isuzu, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar isuzu.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter itachi random
            if (prefix && commandBody === 'itachi') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter itachi...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/itachi.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'itachi, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar itachi.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter itach random
            if (prefix && commandBody === 'itach') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter itach...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/itach.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'itach, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar itach.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter itori random
            if (prefix && commandBody === 'itori') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter itori...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/itori.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'itori, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar itori.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter kaga random
            if (prefix && commandBody === 'kaga') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter kaga...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/kaga.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'kaga, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar kaga.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter kagura random
            if (prefix && commandBody === 'kagura') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter kagura...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/kagura.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'kagura, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar kagura.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter kakashi random
            if (prefix && commandBody === 'kakashi') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter kakashi...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/kakashi.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'kakashi, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar kakashi.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter kaori random
            if (prefix && commandBody === 'kaori') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter kaori...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/kaori.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'kaori, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar kaori.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter keneki random
            if (prefix && commandBody === 'keneki') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter keneki...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/keneki.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'keneki, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar keneki.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter kosaki random
            if (prefix && commandBody === 'kosaki') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter kosaki...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/kosaki.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'kosaki, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar kosaki.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter kotori random
            if (prefix && commandBody === 'kotori') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter kotori...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/kotori.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'kotori, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar kotori.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter kuriyama random
            if (prefix && commandBody === 'kuriyama') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter kuriyama...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/kuriyama.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'kuriyama, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar kuriyama.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter kuroha random
            if (prefix && commandBody === 'kuroha') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter kuroha...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/kuroha.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'kuroha, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar kuroha.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter kurumi random
            if (prefix && commandBody === 'kurumi') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter kurumi...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/kurumi.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'kurumi, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar kurumi.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter lol random
            if (prefix && commandBody === 'lol') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter lol...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/lol.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'lol, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar lol.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter madara random
            if (prefix && commandBody === 'madara') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter madara...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/madara.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'madara, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar madara.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter megumin random
            if (prefix && commandBody === 'megumin') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter megumin...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/megumin.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'megumin, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar megumin.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter mikasa random
            if (prefix && commandBody === 'mikasa') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter mikasa...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/mikasa.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'mikasa, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar mikasa.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter miku random
            if (prefix && commandBody === 'miku') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter miku...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/miku.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'miku, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar miku.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter minato random
            if (prefix && commandBody === 'minato') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter minato...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/minato.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'minato, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar minato.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter naruto random
            if (prefix && commandBody === 'naruto') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter naruto...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/naruto.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'naruto, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar naruto.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter natsukawa random
            if (prefix && commandBody === 'natsukawa') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter natsukawa...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/natsukawa.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'natsukawa, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar natsukawa.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter neko random
            if (prefix && commandBody === 'neko') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter neko...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/neko.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'neko, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar neko.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter nekonime random
            if (prefix && commandBody === 'nekonime') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter nekonime...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/nekonime.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'nekonime, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar nekonime.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter nezuko random
            if (prefix && commandBody === 'nezuko') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter nezuko...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/nezuko.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'nezuko, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar nezuko.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter nishimiya random
            if (prefix && commandBody === 'nishimiya') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter nishimiya...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/nishimiya.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'nishimiya, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar nishimiya.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter onepiece random
            if (prefix && commandBody === 'onepiece') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter onepiece...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/onepiece.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'onepiece, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar onepiece.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter tsunade random
            if (prefix && commandBody === 'tsunade') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter tsunade...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/tsunade.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'tsunade, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar tsunade.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter waifu random
            if (prefix && commandBody === 'waifu') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter waifu...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/waifu.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'waifu, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar waifu.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter waifu2 random
            if (prefix && commandBody === 'waifu2') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter waifu2...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/waifu2.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'waifu2, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar waifu2.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter wallhp2 random
            if (prefix && commandBody === 'wallhp2') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter wallhp2...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/wallhp2.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'wallhp2, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar wallhp2.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter yatogami random
            if (prefix && commandBody === 'yatogami') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter yatogami...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/yatogami.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'yatogami, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar yatogami.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter yuki random
            if (prefix && commandBody === 'yuki') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter yuki...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/yuki.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'yuki, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar yuki.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter yuri random
            if (prefix && commandBody === 'yuri') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter yuri...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/yuri.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'yuri, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar yuri.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter pokemon random
            if (prefix && commandBody === 'pokemon') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter pokemon...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/pokemon.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'pokemon, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar pokemon.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter ppcouple random
            if (prefix && commandBody === 'ppcouple') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter ppcouple...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/ppcouple.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'ppcouple, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar ppcouple.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter rem random
            if (prefix && commandBody === 'rem') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter rem...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/rem.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'rem, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar rem.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter rize random
            if (prefix && commandBody === 'rize') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter rize...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/rize.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'rize, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar rize.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter sagiri random
            if (prefix && commandBody === 'sagiri') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter sagiri...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/sagiri.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'sagiri, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar sagiri.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter sakura random
            if (prefix && commandBody === 'sakura') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter sakura...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/sakura.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'sakura, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar sakura.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter sasuke random
            if (prefix && commandBody === 'sasuke') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter sasuke...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/sasuke.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'sasuke, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar sasuke.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter shina random
            if (prefix && commandBody === 'shina') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter shina...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/shina.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'shina, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar shina.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter shinka random
            if (prefix && commandBody === 'shinka') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter shinka...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/shinka.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'shinka, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar shinka.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter shizuka random
            if (prefix && commandBody === 'shizuka') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter shizuka...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/shizuka.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'shizuka, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar shizuka.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter shota random
            if (prefix && commandBody === 'shota') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter shota...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/shota.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'shota, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar shota.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter tomori random
            if (prefix && commandBody === 'tomori') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter tomori...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/tomori.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'tomori, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar tomori.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter toukachan random
            if (prefix && commandBody === 'toukachan') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari karakter toukachan...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/anime/toukachan.json');
                    const list = res.data;
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { image: { url }, caption: 'toukachan, spesial request!' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar toukachan.' }, { quoted: msg });
                }
                return;
            }
            // Fitur karakter asupan random
            if (prefix && commandBody === 'asupan') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari video asupan...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/asupan/asupan.json');
                    const list = res.data;
                    if (!Array.isArray(list) || list.length === 0) throw new Error('List asupan kosong atau bukan array!');
                    const url = list[Math.floor(Math.random() * list.length)];
                    await sock.sendMessage(sender, { video: { url }, caption: 'asupan, spesial request!' }, { quoted: msg });
                } catch (e) {
                    console.error('Error asupan:', e);
                    await sock.sendMessage(sender, { text: 'Gagal mengambil video asupan.' }, { quoted: msg });
                }
                return;
            }
            // Fitur cek khodam random
            if (prefix && commandBody === 'cekkhodam') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari khodam kamu...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/fun/cekkhodam.json');
                    const list = res.data;
                    if (!Array.isArray(list) || list.length === 0) throw new Error('List khodam kosong atau bukan array!');
                    const item = list[Math.floor(Math.random() * list.length)];
                    const hasil = `🧙‍♂️ *Khodam Kamu: ${item.name}*\n${item.meaning}`;
                    await sock.sendMessage(sender, { text: hasil }, { quoted: msg });
                } catch (e) {
                    console.error('Error cekkodam:', e);
                    await sock.sendMessage(sender, { text: 'Gagal mengambil data khodam.' }, { quoted: msg });
                }
                return;
            }
            // Fitur asah otak
            if (prefix && commandBody === 'asahotak') {
                if (asahOtakState[sender] || caklontongState[sender]) {
                    await sock.sendMessage(sender, { text: 'Kamu masih punya game yang belum selesai! Selesaikan dulu sebelum mulai game baru.' }, { quoted: msg });
                    return;
                }
                await sock.sendMessage(sender, { text: 'MARI KITA BERMAIN ASAH OTAK ...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://github.com/KazukoGans/database/raw/refs/heads/main/games/asahotak.json');
                    const list = res.data;
                    if (!Array.isArray(list) || list.length === 0) throw new Error('List asahotak kosong atau bukan array!');
                    const soal = list[Math.floor(Math.random() * list.length)];
                    asahOtakState[sender] = {
                        answer: soal.jawaban.trim().toLowerCase(),
                        timeout: setTimeout(async () => {
                            clearInterval(asahOtakState[sender].interval);
                            await sock.sendMessage(sender, { text: `WAKTU SELESAI\n\nSoal: ${soal.soal}\nJawabannya: ${soal.jawaban}` }, { quoted: msg });
                            delete asahOtakState[sender];
                        }, 60000), // 1 menit
                        question: soal.soal,
                        answerText: soal.jawaban
                    };
                    startCountdown(sock, sender, msg, 60, asahOtakState, 'Asah Otak');
                    await sock.sendMessage(sender, { text: `Soal : ${soal.soal}\n\nJawab sebelum 1 menit selesai` }, { quoted: msg });
                } catch (e) {
                    console.error('Error asahotak:', e);
                    await sock.sendMessage(sender, { text: 'Gagal mengambil soal asah otak.' }, { quoted: msg });
                }
                return;
            }
            // Fitur caklontong
            if (prefix && commandBody === 'caklontong') {
                if (asahOtakState[sender] || caklontongState[sender]) {
                    await sock.sendMessage(sender, { text: 'Kamu masih punya game yang belum selesai! Selesaikan dulu sebelum mulai game baru.' }, { quoted: msg });
                    return;
                }
                await sock.sendMessage(sender, { text: 'MARI KITA BERMAIN CAKLONTONG ...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://raw.githubusercontent.com/KazukoGans/database/refs/heads/main/games/caklontong.js');
                    const list = res.data;
                    if (!Array.isArray(list) || list.length === 0) throw new Error('List caklontong kosong atau bukan array!');
                    const soal = list[Math.floor(Math.random() * list.length)];
                    caklontongState[sender] = {
                        answer: soal.jawaban.trim().toLowerCase(),
                        timeout: setTimeout(async () => {
                            clearInterval(caklontongState[sender].interval);
                            await sock.sendMessage(sender, { text: `WAKTU SELESAI\n\nSoal: ${soal.soal}\nJawabannya: ${soal.jawaban}\nDeskripsi: ${soal.deskripsi || '-'}` }, { quoted: msg });
                            delete caklontongState[sender];
                        }, 60000), // 1 menit
                        question: soal.soal,
                        answerText: soal.jawaban,
                        reason: soal.deskripsi || '-'
                    };
                    startCountdown(sock, sender, msg, 60, caklontongState, 'Cak Lontong');
                    await sock.sendMessage(sender, { text: `Soal : ${soal.soal}\n\nJawab sebelum 1 menit selesai` }, { quoted: msg });
                } catch (e) {
                    console.error('Error caklontong:', e, e?.response?.data);
                    await sock.sendMessage(sender, { text: 'Gagal mengambil soal caklontong.' }, { quoted: msg });
                }
                return;
            }
            // Cek jawaban asah otak
            if (asahOtakState[sender] && text) {
                const jawabanUser = text.trim().toLowerCase();
                if (jawabanUser === asahOtakState[sender].answer) {
                    clearTimeout(asahOtakState[sender].timeout);
                    clearInterval(asahOtakState[sender].interval);
                    await sock.sendMessage(sender, { text: `SELAMAT JAWABAN ANDA BENAR\n\nSoal: ${asahOtakState[sender].question}\nJawaban : ${asahOtakState[sender].answerText}` }, { quoted: msg });
                    delete asahOtakState[sender];
                } else {
                    await sock.sendMessage(sender, { text: 'SALAH!' }, { quoted: msg });
                }
                return;
            }
            // Cek jawaban caklontong
            if (caklontongState[sender] && text) {
                const jawabanUser = text.trim().toLowerCase();
                const jawabanBot = caklontongState[sender].answer;
                if (
                    jawabanUser === jawabanBot ||
                    jawabanUser.includes(jawabanBot) ||
                    jawabanBot.includes(jawabanUser)
                ) {
                    clearTimeout(caklontongState[sender].timeout);
                    clearInterval(caklontongState[sender].interval);
                    await sock.sendMessage(sender, { text: `SELAMAT JAWABAN ANDA BENAR\n\nSoal: ${caklontongState[sender].question}\nJawaban : ${caklontongState[sender].answerText}\nDeskripsi: ${caklontongState[sender].reason}` }, { quoted: msg });
                    delete caklontongState[sender];
                } else {
                    await sock.sendMessage(sender, { text: 'SALAH!' }, { quoted: msg });
                }
                return;
            }
            // Tambahkan handler untuk autoread
            if (prefix && commandBody.startsWith('autoread')) {
                const action = commandBody.split(' ')[1];
                if (action === 'on') {
                    autoreadState = true;
                    await sock.sendMessage(sender, { text: '✅ *Autoread diaktifkan*\nSemua pesan akan otomatis terbaca' }, { quoted: msg });
                } else if (action === 'off') {
                    autoreadState = false;
                    await sock.sendMessage(sender, { text: '❌ *Autoread dinonaktifkan*\nPesan tidak akan otomatis terbaca' }, { quoted: msg });
                } else {
                    await sock.sendMessage(sender, { text: '❌ *Perintah tidak valid*\nGunakan .autoread on/off' }, { quoted: msg });
                }
                return;
            }
            // Fitur family100
            if (prefix && commandBody === 'family100') {
                if (family100State[sender] || asahOtakState[sender] || caklontongState[sender]) {
                    await sock.sendMessage(sender, { text: 'Kamu masih punya game yang belum selesai! Selesaikan dulu sebelum mulai game baru.' }, { quoted: msg });
                    return;
                }
                await sock.sendMessage(sender, { text: 'MARI BERMAIN FAMILY 100! ...' }, { quoted: msg });
                try {
                    const res = await axios.get('https://raw.githubusercontent.com/KazukoGans/database/refs/heads/main/games/family100.json');
                    const list = res.data;
                    if (!Array.isArray(list) || list.length === 0) throw new Error('List family100 kosong atau bukan array!');
                    const soal = list[Math.floor(Math.random() * list.length)];
                    family100State[sender] = {
                        answers: soal.jawaban.map(j => j.trim().toLowerCase()),
                        found: [],
                        timeout: setTimeout(async () => {
                            await sock.sendMessage(sender, { text: `⏰ WAKTU HABIS!\n\nSoal: ${soal.soal}\nJawaban yang benar:\n${soal.jawaban.map(j => `- ${j}`).join('\n')}` }, { quoted: msg });
                            delete family100State[sender];
                        }, 120000), // 2 menit
                        question: soal.soal,
                        allAnswers: soal.jawaban
                    };
                    startCountdown(sock, sender, msg, 60, family100State, 'Family 100');
                    await sock.sendMessage(sender, { text: `Soal : ${soal.soal}\n\nTebak semua jawaban yang benar!\nJawab sebelum 1 menit selesai.` }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil soal family100.' }, { quoted: msg });
                }
                return;
            }
            // Cek jawaban family100
            if (family100State[sender] && text) {
                const jawabanUser = text.trim().toLowerCase();
                const state = family100State[sender];
                if (state.answers.includes(jawabanUser) && !state.found.includes(jawabanUser)) {
                    state.found.push(jawabanUser);
                    await sock.sendMessage(sender, { text: `✅ Benar! Jawaban: ${jawabanUser}\nSudah ditemukan: ${state.found.length}/${state.answers.length}` }, { quoted: msg });
                    // Jika semua jawaban sudah ditemukan
                    if (state.found.length === state.answers.length) {
                        clearTimeout(state.timeout);
                        clearInterval(state.interval);
                        await sock.sendMessage(sender, { text: `🎉 SEMUA JAWABAN DITEMUKAN!\n\nSoal: ${state.question}\nJawaban:\n${state.allAnswers.map(j => `- ${j}`).join('\n')}` }, { quoted: msg });
                        delete family100State[sender];
                    }
                } else if (state.found.includes(jawabanUser)) {
                    await sock.sendMessage(sender, { text: 'Jawaban sudah pernah ditemukan!' }, { quoted: msg });
                } else {
                    await sock.sendMessage(sender, { text: '❌ Salah atau tidak ada di daftar jawaban.' }, { quoted: msg });
                }
                return;
            }

            // Tambahkan handler untuk fitur Alkitab
            if (prefix && commandBody.startsWith('alkitab')) {
                const searchText = commandBody.slice('alkitab'.length).trim();
                await handleAlkitab(sock, sender, searchText);
            }
            // Fitur Alquran
            if (prefix && commandBody.startsWith('alquran')) {
                const args = commandBody.split(' ').slice(1);
                if (!(args[0] && args[1])) {
                    await sock.sendMessage(sender, { text: `contoh:\n${prefix}alquran 1 2\n\nmaka hasilnya adalah surah Al-Fatihah ayat 2` }, { quoted: msg });
                    return;
                }
                if (isNaN(args[0]) || isNaN(args[1])) {
                    await sock.sendMessage(sender, { text: `contoh:\n${prefix}alquran 1 2\n\nmaka hasilnya adalah surah Al-Fatihah ayat 2` }, { quoted: msg });
                    return;
                }
                try {
                    const res = await alquran(args[0], args[1]);
                    let pesan = `\n${res.arab}\n${res.latin}\n\n${res.terjemahan}\n${readMore}\n${res.tafsir}\n\n( ${res.surah} )`;
                    await sock.sendMessage(sender, { text: pesan.trim() }, { quoted: msg });
                    // Cek apakah audio bisa diakses
                    const fetch = require('node-fetch');
                    let cekAudio = await fetch(res.audio);
                    if (cekAudio.ok) {
                        await sock.sendMessage(sender, { audio: { url: res.audio }, mimetype: 'audio/mpeg' }, { quoted: msg });
                    } else {
                        await sock.sendMessage(sender, { text: 'Maaf, audio tidak tersedia untuk ayat ini.' }, { quoted: msg });
                    }
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil ayat Alquran.' }, { quoted: msg });
                }
                return;
            }
            // Fitur Anime Info
            if (prefix && (/^(animeinfo|anime|infoanime|nimeinfo|nime)$/i).test(commandBody.split(' ')[0])) {
                const args = commandBody.split(' ').slice(1);
                const text = args.join(' ');
                if (!text) {
                    await sock.sendMessage(sender, { text: '*_Masukan Judul Anime Yang Ingin Kamu Cari !_*' }, { quoted: msg });
                    return;
                }
                await sock.sendMessage(sender, { text: 'Sedang mencari ANIME... Silahkan tunggu' }, { quoted: msg });
                try {
                    const fetch = require('node-fetch');
                    let res = await fetch('https://api.jikan.moe/v4/anime?q=' + encodeURIComponent(text));
                    if (!res.ok) throw 'Tidak Ditemukan';
                    let json = await res.json();
                    let data = json.data[0];
                    let producers = data.producers.map(prod => `${prod.name} (${prod.url})`).join('\n');
                    let studio = data.studios.map(stud => `${stud.name} (${stud.url})`).join('\n');
                    let genre = data.genres.map(x => `${x.name}`).join('\n');
                    let judul = data.titles.map(jud => `${jud.title} [${jud.type}]`).join('\n');
                    let trailerUrl = data.trailer?.url || '-';
                    let animeingfo = `📺 ᴛɪᴛʟᴇ: ${judul}\n📺 Trailer: ${trailerUrl}\n🎬 ᴇᴘɪsᴏᴅᴇs: ${data.episodes}\n✉️ ᴛʀᴀɴsᴍɪsɪ: ${data.type}\n👺 Genre: ${genre}\n🗂 sᴛᴀᴛᴜs: ${data.status}\n⌛ ᴅᴜʀᴀᴛɪᴏɴ: ${data.duration}\n🌟 ғᴀᴠᴏʀɪᴛᴇ: ${data.favorites}\n🧮 sᴄᴏʀᴇ: ${data.score}\n😍 RATING: ${data.rating}\n😎 SCORED BY: ${data.scored_by}\n💥 POPULARITY: ${data.popularity}\n⭐ RANK: ${data.rank}\n✨ SEASON / MUSIM: ${data.season}\n🏁 YEAR / TAHUN (RILIS): ${data.year}\n🤗 PRODUSER: ${producers}\n🤠 STUDIO: ${studio}\n👥 ᴍᴇᴍʙᴇʀs: ${data.members}\n⛓️ ᴜʀʟ: ${data.url}\n📝 ʙᴀᴄᴋɢʀᴏᴜɴᴅ: ${data.background}\n💬 sɪɴᴏᴘsɪs: ${data.synopsis}`;
                    await sock.sendMessage(sender, {
                        image: { url: data.images.jpg.image_url },
                        caption: `*ANIME INFO*\n${animeingfo}`
                    }, { quoted: msg });
                    await sock.sendMessage(sender, { text: 'JANGAN LUPA SUPPORT DEVELOPERNYA\nXnuvers007\nhttps://saweria.co/xnuvers007' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Anime tidak ditemukan atau terjadi error.' }, { quoted: msg });
                }
                return;
            }
            // Fitur Asmaul Husna
            if (prefix && (/^(asmaulhusna|asmaul|husna)$/i).test(commandBody.split(' ')[0])) {
                const args = commandBody.split(' ').slice(1);
                const nomor = args[0];
                const contoh = `*ᴀsᴍᴀᴜʟ-ʜᴜsɴᴀ*\n\n`;
                const anjuran = `\n\nDari Abu hurarirah radhiallahu anhu, Rasulullah Saw bersabda: "إِنَّ لِلَّهِ تَعَالَى تِسْعَةً وَتِسْعِينَ اسْمًا، مِائَةٌ إِلَّا وَاحِدًا، مَنْ أَحْصَاهَا دخل الجنة، وهو وتر يُحِبُّ الْوِتْرَ"
Artinya: "Sesungguhnya Allah mempunyai sembilan puluh sembilan nama, alias seratus kurang satu. Barang siapa yang menghitung-hitungnya, niscaya masuk surga; Dia Witir dan menyukai yang witir."`;
                let json = global.asmaulhusna;
                if (!json || !Array.isArray(json)) {
                    await sock.sendMessage(sender, { text: 'Data Asmaul Husna tidak tersedia.' }, { quoted: msg });
                    return;
                }
                let data = json.map((v, i) => `${i + 1}. ${v.latin}\n${v.arabic}\n${v.translation_id}`).join('\n\n');
                if (nomor) {
                    if (isNaN(nomor)) {
                        await sock.sendMessage(sender, { text: `contoh:\n${prefix}asmaulhusna 1` }, { quoted: msg });
                        return;
                    }
                    if (nomor < 1 || nomor > json.length) {
                        await sock.sendMessage(sender, { text: `minimal 1 & maksimal ${json.length}!` }, { quoted: msg });
                        return;
                    }
                    let found = json.find(v => v.index == nomor.replace(/[^0-9]/g, ''));
                    if (!found) {
                        await sock.sendMessage(sender, { text: 'Data tidak ditemukan.' }, { quoted: msg });
                        return;
                    }
                    let { index, latin, arabic, translation_id, translation_en } = found;
                    await sock.sendMessage(sender, { text: `No. ${index}\n${arabic}\n${latin}\n${translation_id}\n${translation_en}`.trim() }, { quoted: msg });
                    return;
                }
                await sock.sendMessage(sender, { text: contoh + data + anjuran }, { quoted: msg });
                return;
            }
            // Fitur Download Google Drive
            if (prefix && (/^(gdrive|gdrived|gdrivedl|gdl|gd|dle|l)$/i).test(commandBody.split(' ')[0])) {
                const args = commandBody.split(' ').slice(1);
                if (!args[0]) {
                    await sock.sendMessage(sender, { text: 'Input URL Google Drive!' }, { quoted: msg });
                    return;
                }
                try {
                    let res = await GDriveDl(args[0]);
                    if (!res) throw 'Gagal mendapatkan data file.';
                    await sock.sendMessage(sender, { text: `*Nama File:* ${res.fileName}\n*Ukuran:* ${res.fileSize}\n*Mime:* ${res.mimetype}` }, { quoted: msg });
                    await sock.sendMessage(sender, { document: { url: res.downloadUrl }, fileName: res.fileName, mimetype: res.mimetype }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal download file: ' + e }, { quoted: msg });
                }
                return;
            }
            // Fitur Git Clone
            if (prefix && commandBody.startsWith('gitclone')) {
                const args = commandBody.split(' ').slice(1);
                const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
                if (!args[0]) {
                    await sock.sendMessage(sender, { text: `Contoh: ${prefix}gitclone https://github.com/ImYanXiao/Elaina-MultiDevice` }, { quoted: msg });
                    return;
                }
                if (!regex.test(args[0])) {
                    await sock.sendMessage(sender, { text: 'Url Tidak Valid!' }, { quoted: msg });
                    return;
                }
                try {
                    let [_, user, repo] = args[0].match(regex) || [];
                    repo = repo.replace(/.git$/, '');
                    let url = `https://api.github.com/repos/${user}/${repo}/zipball`;
                    // Dapatkan nama file dari header
                    const fetch = require('node-fetch');
                    let head = await fetch(url, { method: 'HEAD' });
                    let filename = 'repo.zip';
                    try {
                        let disp = head.headers.get('content-disposition');
                        if (disp) filename = disp.match(/attachment; filename=(.*)/)[1];
                    } catch {}
                    await sock.sendMessage(sender, { text: 'Downloading...' }, { quoted: msg });
                    await sock.sendMessage(sender, { document: { url }, fileName: filename, mimetype: 'application/zip' }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal download repo: ' + e }, { quoted: msg });
                }
                return;
            }
            // Fitur Dark Joke
            if (prefix && commandBody === 'darkjoke') {
                try {
                    const res = await Darkjokes()
                    await sock.sendMessage(sender, { image: { url: res }, caption: 'Dark joke nih, jangan tersinggung ya 😄' }, { quoted: msg })
                } catch (error) {
                    console.error('Error in darkjoke:', error)
                    await sock.sendMessage(sender, { text: 'Maaf, terjadi kesalahan saat mengambil dark joke' }, { quoted: msg })
                }
                return;
            }
            // Fitur Kisah Nabi
            if (prefix && commandBody.startsWith('kisahnabi')) {
                const args = commandBody.split(' ').slice(1);
                if (!args[0]) {
                    await sock.sendMessage(sender, { text: `Masukan nama nabi\nExample: ${prefix}kisahnabi adam` }, { quoted: msg });
                    return;
                }
                try {
                    const res = await axios.get(`https://raw.githubusercontent.com/ZeroChanBot/Api-Freee/a9da6483809a1fbf164cdf1dfbfc6a17f2814577/data/kisahNabi/${args[0].toLowerCase()}.json`);
                    const kisah = res.data;
                    
                    const hasil = `_*👳 Nabi :*_ ${kisah.name}
_*📅 Tanggal Lahir :*_ ${kisah.thn_kelahiran}
_*📍 Tempat Lahir :*_ ${kisah.tmp}
_*📊 Usia :*_ ${kisah.usia}

*— — — — — — — — [ K I S A H ] — — — — — — — —*

${kisah.description}`;

                    await sock.sendMessage(sender, { text: hasil }, { quoted: msg });
                } catch (error) {
                    console.error('Error in kisahnabi:', error);
                    await sock.sendMessage(sender, { text: '*Not Found*\n*📮 ᴛɪᴘs :* coba jangan gunakan huruf capital' }, { quoted: msg });
                }
                return;
            }
            // Fitur Murotal
            if (prefix && commandBody === 'murotal') {
                const murotalText = `QUR'AN BOT:
Via Copas {SEBARKAN}

*YouTube:*
_~Drawl Nag_

Juz 1 ⇨ http://j.mp/2b8SiNO
Juz 2 ⇨ http://j.mp/2b8RJmQ
Juz 3 ⇨ http://j.mp/2bFSrtF
Juz 4 ⇨ http://j.mp/2b8SXi3
Juz 5 ⇨ http://j.mp/2b8RZm3
Juz 6 ⇨ http://j.mp/28MBohs
Juz 7 ⇨ http://j.mp/2bFRIZC
Juz 8 ⇨ http://j.mp/2bufF7o
Juz 9 ⇨ http://j.mp/2byr1bu
Juz 10 ⇨ http://j.mp/2bHfyUH
Juz 11 ⇨ http://j.mp/2bHf80y
Juz 12 ⇨ http://j.mp/2bWnTby
Juz 13 ⇨ http://j.mp/2bFTiKQ
Juz 14 ⇨ http://j.mp/2b8SUTA
Juz 15 ⇨ http://j.mp/2bFRQIM
Juz 16 ⇨ http://j.mp/2b8SegG
Juz 17 ⇨ http://j.mp/2brHsFz
Juz 18 ⇨ http://j.mp/2b8SCfc
Juz 19 ⇨ http://j.mp/2bFSq95
Juz 20 ⇨ http://j.mp/2brI1zc
Juz 21 ⇨ http://j.mp/2b8VcBO
Juz 22 ⇨ http://j.mp/2bFRxNP
Juz 23 ⇨ http://j.mp/2brItxm
Juz 24 ⇨ http://j.mp/2brHKw5
Juz 25 ⇨ http://j.mp/2brImlf
Juz 26 ⇨ http://j.mp/2bFRHF2
Juz 27 ⇨ http://j.mp/2bFRXno
Juz 28 ⇨ http://j.mp/2brI3ai
Juz 29 ⇨ http://j.mp/2bFRyBF
Juz 30 ⇨ http://j.mp/2bFREcc`;

                await sock.sendMessage(sender, { text: murotalText }, { quoted: msg });
                return;
            }
            // Fitur Screenshot Website
            if (prefix && ['ss', 'ssweb', 'sstablet', 'sspc', 'sslaptop', 'sshp'].includes(commandBody.split(' ')[0])) {
                const url = commandBody.split(' ').slice(1).join(' ');
                if (!url) {
                    await sock.sendMessage(sender, { text: `Gunakan format ${prefix}${commandBody.split(' ')[0]} <url>\n\n*Contoh :* ${prefix}${commandBody.split(' ')[0]} https://github.com/Xnuvers007\nList:\n${prefix}ss <url> (screenshot via hp)\n${prefix}ssweb <url> (screenshot via tablet)\n${prefix}sstablet <url> (screenshot via tablet)\n${prefix}sspc <url> (screenshot via pc)\n${prefix}sslaptop <url> (screenshot via laptop)\n${prefix}sshp <url> (screenshot via hp)` }, { quoted: msg });
                    return;
                }

                await sock.sendMessage(sender, { text: 'Tunggu sebentar, sedang mengambil screenshot...' }, { quoted: msg });
                
                try {
                    const phone = await ssweb(url, 'phone');
                    const desktop = await ssweb(url, 'desktop');
                    const tablet = await ssweb(url, 'tablet');

                    const now = new Date();
                    now.setHours(now.getHours());
                    const hour = now.getHours();
                    const minute = now.getMinutes();
                    
                    const res = `Ini kak screenshotnya dari ${url}\njam ${hour}:${minute}`;
                    
                    const command = commandBody.split(' ')[0];
                    if (command === 'sshp' || command === 'ss') {
                        await sock.sendMessage(sender, { image: phone.result, caption: res }, { quoted: msg });
                    } else if (command === 'ssweb' || command === 'sstablet') {
                        await sock.sendMessage(sender, { image: tablet.result, caption: res }, { quoted: msg });
                    } else if (command === 'sspc' || command === 'sslaptop') {
                        await sock.sendMessage(sender, { image: desktop.result, caption: res }, { quoted: msg });
                    }
                } catch (error) {
                    console.error('Error in screenshot:', error);
                    await sock.sendMessage(sender, { text: 'Maaf, terjadi kesalahan saat mengambil screenshot' }, { quoted: msg });
                }
                return;
            }
            // Fitur ZeroGPT
            if (prefix && commandBody.startsWith('zerogpt')) {
                const text = commandBody.slice('zerogpt'.length).trim();
                if (!text) {
                    await sock.sendMessage(sender, { text: `Fitur pendeteksi Tulisan yang dibuat oleh AI\nContoh:\n${prefix}zerogpt TextGenerateFromAI` }, { quoted: msg });
                    return;
                }

                await sock.sendMessage(sender, { text: 'Tunggu sebentar, sedang menganalisis teks...' }, { quoted: msg });

                try {
                    const options = {
                        method: 'POST',
                        url: 'https://tr.deployers.repl.co/zerogpt',
                        headers: {
                            Accept: '*/*',
                            'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
                            'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
                        },
                        data: `-----011000010111000001101001\r\nContent-Disposition: form-data; name="text"\r\n\r\n${text}\r\n-----011000010111000001101001--\r\n`
                    };

                    const response = await axios.request(options);
                    const aiWords = response.data.data.aiWords;
                    const detectedLanguage = response.data.data.detected_language;
                    const h = response.data.data.h;

                    const replyMessage = `
*Hasil Analisis ZeroGPT*

🤖 *AI Words:* ${aiWords}
🌐 *Detected Language:* ${detectedLanguage}
📝 *Perkataan AI:* ${h}

Support me on https://tr.deployers.repl.co/images`;

                    await sock.sendMessage(sender, { text: replyMessage }, { quoted: msg });
                } catch (error) {
                    console.error('Error in zerogpt:', error);
                    await sock.sendMessage(sender, { text: 'Maaf, terjadi kesalahan saat menganalisis teks' }, { quoted: msg });
                }
                return;
            }
            // Fitur Motivasi
            if (prefix && commandBody.split(' ')[0] === 'motivasi') {
                const motivasi = pickRandom(motivasiList);
                await sock.sendMessage(sender, { text: motivasi }, { quoted: msg });
                return;
            }
            // Fitur paptt (ambil random dari src/paptt.json)
            if (prefix && commandBody.split(' ')[0] === 'paptt') {
                let papttList = [];
                try {
                    papttList = JSON.parse(fs.readFileSync('./src/paptt.json', 'utf-8'));
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Data paptt tidak ditemukan atau rusak.' }, { quoted: msg });
                    return;
                }
                if (!Array.isArray(papttList) || papttList.length === 0) {
                    await sock.sendMessage(sender, { text: 'Data paptt kosong.' }, { quoted: msg });
                    return;
                }
                const url = papttList[Math.floor(Math.random() * papttList.length)];
                const isVideo = url.endsWith('.mp4');
                if (isVideo) {
                    await sock.sendMessage(sender, { video: { url }, caption: 'Tch, dasar sangean' }, { quoted: msg });
                } else {
                    await sock.sendMessage(sender, { image: { url }, caption: 'Tch, dasar sangean' }, { quoted: msg });
                }
                return;
            }
            // Fitur artinama
            if (prefix && commandBody.split(' ')[0] === 'artinama') {
                const args = commandBody.split(' ').slice(1);
                const nama = args.join(' ');
                if (!nama) {
                    await sock.sendMessage(sender, { text: 'Namanya siapa?' }, { quoted: msg });
                    return;
                }
                request.get({
                    headers: {'content-type' : 'application/x-www-form-urlencoded'},
                    url: 'http://www.primbon.com/arti_nama.php?nama1=' + encodeURIComponent(nama) + '&proses=+Submit%21+',
                }, async function(error, response, body) {
                    if (error || !body) {
                        await sock.sendMessage(sender, { text: 'Gagal mengambil arti nama.' }, { quoted: msg });
                        return;
                    }
                    let $ = cheerio.load(body);
                    try {
                        var y = $.html().split('arti:')[1];
                        var t = y.split('method="get">')[1];
                        var f = y.replace(t ," ");
                        var x = f.replace(/<br\s*[\/]?>/gi, "\n");
                        var h  = x.replace(/<[^>]*>?/gm, '');
                        await sock.sendMessage(sender, { text: `Arti Dari Nama ${nama} Adalah ${nama}\n\n${h}` }, { quoted: msg });
                    } catch (e) {
                        await sock.sendMessage(sender, { text: 'Gagal parsing arti nama.' }, { quoted: msg });
                    }
                });
                return;
            }
            // Fitur Cerpen
            if (prefix && commandBody === 'cerpen') {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari cerpen...' }, { quoted: msg });
                try {
                    const { Cerpen } = require('dhn-api');
                    let item = await Cerpen();
                    let cap = `🔍 *[ RESULT ]*\n\n${item}`;
                    await sock.sendMessage(sender, { text: cap }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil cerpen.' }, { quoted: msg });
                }
                return;
            }
            // Fitur NSFW Fantox-APIs
            const nsfwCommands = [
                'genshin', 'swimsuit', 'schoolswimsuit', 'white', 'barefoot', 'touhou', 'gamecg', 'hololive', 'uncensored', 'sunglasses', 'glasses', 'weapon', 'shirtlift', 'chain', 'fingering', 'flatchest', 'torncloth', 'bondage', 'demon', 'wet', 'pantypull', 'headdress', 'headphone', 'tie', 'anusview', 'shorts', 'stokings', 'topless', 'beach', 'bunnygirl', 'bunnyear', 'idol', 'vampire', 'gun', 'maid', 'bra', 'nobra', 'bikini', 'whitehair', 'blonde', 'pinkhair', 'bed', 'ponytail', 'nude', 'dress', 'underwear', 'foxgirl', 'uniform', 'skirt', 'sex', 'sex2', 'sex3', 'breast', 'twintail', 'spreadpussy', 'tears', 'seethrough', 'breasthold', 'drunk', 'fateseries', 'spreadlegs', 'openshirt', 'headband', 'food', 'close', 'tree', 'nipples', 'erectnipples', 'horns', 'greenhair', 'wolfgirl', 'catgirl'
            ];
            if (prefix && nsfwCommands.includes(commandBody)) {
                await sock.sendMessage(sender, { text: 'Tunggu sebentar, mencari gambar NSFW...' }, { quoted: msg });
                try {
                    const fetch = require('node-fetch');
                    let res = await fetch(`https://fantox-apis.vercel.app/${commandBody}`);
                    if (!res.ok) throw await res.text();
                    let json = await res.json();
                    if (!json.url) throw '❎ Error';
                    await sock.sendMessage(sender, { image: { url: json.url }, caption: `🚩 Random ${commandBody}` }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil gambar NSFW.' }, { quoted: msg });
                }
                return;
            }
            // Fitur Info Gempa Bumi BMKG
            if (prefix && (/^(gempa|gempabumi)$/i).test(commandBody)) {
                await sock.sendMessage(sender, { text: 'Mengambil info gempa bumi terbaru dari BMKG...' }, { quoted: msg });
                try {
                    const fetch = require('node-fetch');
                    const sharp = require('sharp');
                    const link = 'https://data.bmkg.go.id/DataMKG/TEWS/';
                    let res = await fetch(link + 'autogempa.json');
                    let anu = await res.json();
                    anu = anu.Infogempa.gempa;
                    let txt = `Tanggal : ${anu.Tanggal}\n`;
                    txt += `Waktu : ${anu.Jam}\n`;
                    txt += `Potensi : *${anu.Potensi}*\n`;
                    txt += `Magnitude : ${anu.Magnitude}\n`;
                    txt += `Kedalaman : ${anu.Kedalaman}\n`;
                    txt += `Wilayah : ${anu.Wilayah}\n`;
                    txt += `Lintang : ${anu.Lintang} & Bujur: ${anu.Bujur}\n`;
                    txt += `Koordinat : ${anu.Coordinates}\n`;
                    txt += anu.Dirasakan ? `Dirasakan : ${anu.Dirasakan}\n\n\nsupport me on https://trakteer.id/Xnuvers007\nyou can Scan me on DANA https://ndraeee25.000webhostapp.com/dana/DanaXnuvers007.jpeg` : '';
                    let imgBuffer = await (await fetch(link + anu.Shakemap)).buffer();
                    let img = await sharp(imgBuffer).png().toBuffer();
                    await sock.sendMessage(sender, { image: img, caption: txt }, { quoted: msg });
                } catch (e) {
                    console.log(e);
                    await sock.sendMessage(sender, { text: '[!] Fitur Error.' }, { quoted: msg });
                }
                return;
            }
            // Fitur Cek Cuaca OpenWeatherMap
            if (prefix && (/^(cuaca|weather)$/i).test(commandBody.split(' ')[0])) {
                const args = commandBody.split(' ').slice(1);
                const kota = args.join(' ');
                if (!kota) {
                    await sock.sendMessage(sender, { text: `Penggunaan:\n${prefix}cuaca <kota>\nContoh: ${prefix}cuaca Jakarta` }, { quoted: msg });
                    return;
                }
                try {
                    const fetch = require('node-fetch');
                    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(kota)}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273`);
                    if (!res.ok) throw 'Lokasi tidak ditemukan';
                    let json = await res.json();
                    if (json.cod != 200) throw 'Lokasi tidak ditemukan';
                    let reply = `Lokasi: ${json.name}\nNegara: ${json.sys.country}\nCuaca: ${json.weather[0].description}\nSuhu saat ini: ${json.main.temp} °C\nSuhu tertinggi: ${json.main.temp_max} °C\nSuhu terendah: ${json.main.temp_min} °C\nKelembapan: ${json.main.humidity} %\nAngin: ${json.wind.speed} km/jam`;
                    await sock.sendMessage(sender, { text: reply }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil data cuaca atau lokasi tidak ditemukan.' }, { quoted: msg });
                }
                return;
            }
            // Fitur Kata Anime Random (Bahasa Indonesia)
            if (prefix && commandBody === 'kataanime') {
                try {
                    const fs = require('fs');
                    const data = JSON.parse(fs.readFileSync('./src/kataanime.json', 'utf-8'));
                    if (!data.result || !Array.isArray(data.result) || data.result.length === 0) throw 'Data tidak ditemukan.';
                    const random = data.result[Math.floor(Math.random() * data.result.length)];
                    const reply = `"${random.indo}"

- ${random.character} (${random.anime})`;
                    await sock.sendMessage(sender, { text: reply }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil kata anime.' }, { quoted: msg });
                }
                return;
            }
            // Fitur CNN News
            if (prefix && commandBody.startsWith('cnn')) {
                // Ambil kategori dari perintah, default 'nasional' jika tidak ada
                const args = commandBody.split(' ');
                const kategori = args[1] ? args[1].toLowerCase() : 'nasional';
                const kategoriList = [
                    'nasional', 'internasional', 'ekonomi', 'olahraga', 'teknologi', 'hiburan', 'gaya-hidup'
                ];
                if (!kategoriList.includes(kategori)) {
                    await sock.sendMessage(sender, { text: `Kategori tidak valid!\nKategori yang tersedia:\n${kategoriList.join(', ')}` }, { quoted: msg });
                    return;
                }
                await sock.sendMessage(sender, { text: 'Menunggu berita dari kategori ' + kategori + ' ...' }, { quoted: msg });
                const news = await getCNNNewsByCategory(kategori);
                if (news && news.length > 0) {
                    const randomNews = news[Math.floor(Math.random() * news.length)];
                    const caption = `📰 *CNN News - ${kategori.toUpperCase()}*\n\n*${randomNews.title}*\n\n${randomNews.contentSnippet}\n\n🔗 ${randomNews.link}`;
                    try {
                        const imageResponse = await axios.get(randomNews.enclosure.url, { responseType: 'arraybuffer' });
                        const imageBuffer = Buffer.from(imageResponse.data);
                        await sock.sendMessage(sender, {
                            image: imageBuffer,
                            caption: caption
                        }, { quoted: msg });
                    } catch (error) {
                        console.error('Error sending news:', error);
                        await sock.sendMessage(sender, { text: 'Maaf, terjadi kesalahan saat mengambil berita.' }, { quoted: msg });
                    }
                } else {
                    await sock.sendMessage(sender, { text: 'Maaf, tidak dapat mengambil berita saat ini.' }, { quoted: msg });
                }
                return;
            }
            // Fitur CNBC News
            if (prefix && commandBody.startsWith('cnbc')) {
                console.log(chalk.blue(`[COMMAND] User ${sender} meminta berita CNBC`));
                const args = commandBody.split(' ');
                if (args.length > 1) {
                    const category = args[1];
                    console.log(chalk.yellow(`[COMMAND] Kategori yang diminta: ${category}`));
                    const news = await getCNBCNewsByCategory(category);
                    const newsArr = Array.isArray(news) ? news : (news && Array.isArray(news.data) ? news.data : []);
                    if (newsArr.length > 0) {
                        let response = `*📰 BERITA CNBC - ${category.toUpperCase()}*\n\n`;
                        newsArr.forEach((item, index) => {
                            response += `${index + 1}. ${item.title}\n${item.link}\n\n`;
                        });
                        await sock.sendMessage(sender, { text: response });
                        console.log(chalk.green(`[COMMAND] Berhasil mengirim ${newsArr.length} berita CNBC ke ${sender}`));
                    } else {
                        await sock.sendMessage(sender, { text: 'Tidak ada berita yang ditemukan.' });
                        console.log(chalk.red('[COMMAND] Tidak ada berita CNBC yang ditemukan!'));
                    }
                } else {
                    const news = await getCNBCNews();
                    const newsArr = Array.isArray(news) ? news : (news && Array.isArray(news.data) ? news.data : []);
                    if (newsArr.length > 0) {
                        let response = '*📰 BERITA CNBC TERKINI*\n\n';
                        newsArr.forEach((item, index) => {
                            response += `${index + 1}. ${item.title}\n${item.link}\n\n`;
                        });
                        await sock.sendMessage(sender, { text: response });
                        console.log(chalk.green(`[COMMAND] Berhasil mengirim ${newsArr.length} berita CNBC ke ${sender}`));
                    } else {
                        await sock.sendMessage(sender, { text: 'Tidak ada berita yang ditemukan.' });
                        console.log(chalk.red('[COMMAND] Tidak ada berita CNBC yang ditemukan!'));
                    }
                }
            }
            // Fitur Republika News
            if (prefix && commandBody.startsWith('republika')) {
                const args = commandBody.split(' ');
                if (args.length > 1) {
                    const category = args[1];
                    const news = await getRepublikaNewsByCategory(category);
                    const newsArr = Array.isArray(news) ? news : (news && Array.isArray(news.data) ? news.data : []);
                    if (newsArr.length > 0) {
                        let response = `*📰 BERITA REPUBLIKA - ${category.toUpperCase()}*\n\n`;
                        newsArr.forEach((item, index) => {
                            response += `${index + 1}. ${item.title}\n${item.link}\n\n`;
                        });
                        await sock.sendMessage(sender, { text: response });
                    } else {
                        await sock.sendMessage(sender, { text: 'Tidak ada berita yang ditemukan.' });
                    }
                } else {
                    const news = await getRepublikaNews();
                    const newsArr = Array.isArray(news) ? news : (news && Array.isArray(news.data) ? news.data : []);
                    if (newsArr.length > 0) {
                        let response = '*📰 BERITA REPUBLIKA TERKINI*\n\n';
                        newsArr.forEach((item, index) => {
                            response += `${index + 1}. ${item.title}\n${item.link}\n\n`;
                        });
                        await sock.sendMessage(sender, { text: response });
                    } else {
                        await sock.sendMessage(sender, { text: 'Tidak ada berita yang ditemukan.' });
                    }
                }
            }
            // Fitur Tempo News
            if (prefix && commandBody.startsWith('tempo')) {
                const args = commandBody.split(' ');
                if (args.length > 1) {
                    const category = args[1];
                    const news = await getTempoNewsByCategory(category);
                    const newsArr = Array.isArray(news) ? news : (news && Array.isArray(news.data) ? news.data : []);
                    if (newsArr.length > 0) {
                        let response = `*📰 BERITA TEMPO - ${category.toUpperCase()}*\n\n`;
                        newsArr.forEach((item, index) => {
                            response += `${index + 1}. ${item.title}\n${item.link}\n\n`;
                        });
                        await sock.sendMessage(sender, { text: response });
                    } else {
                        await sock.sendMessage(sender, { text: 'Tidak ada berita yang ditemukan.' });
                    }
                } else {
                    const news = await getTempoNews();
                    const newsArr = Array.isArray(news) ? news : (news && Array.isArray(news.data) ? news.data : []);
                    if (newsArr.length > 0) {
                        let response = '*📰 BERITA TEMPO TERKINI*\n\n';
                        newsArr.forEach((item, index) => {
                            response += `${index + 1}. ${item.title}\n${item.link}\n\n`;
                        });
                        await sock.sendMessage(sender, { text: response });
                    } else {
                        await sock.sendMessage(sender, { text: 'Tidak ada berita yang ditemukan.' });
                    }
                }
            }
            // Fitur Antara News
            if (prefix && commandBody.startsWith('antara')) {
                const args = commandBody.split(' ');
                if (args.length > 1) {
                    const category = args[1];
                    const news = await getAntaraNewsByCategory(category);
                    const newsArr = Array.isArray(news) ? news : (news && Array.isArray(news.data) ? news.data : []);
                    if (newsArr.length > 0) {
                        let response = `*📰 BERITA ANTARA - ${category.toUpperCase()}*\n\n`;
                        newsArr.forEach((item, index) => {
                            response += `${index + 1}. ${item.title}\n${item.link}\n\n`;
                        });
                        await sock.sendMessage(sender, { text: response });
                    } else {
                        await sock.sendMessage(sender, { text: 'Tidak ada berita yang ditemukan.' });
                    }
                }
            }
            // Fitur Kumparan News
            if (prefix && commandBody === 'kumparan') {
                const news = await getKumparanNews();
                const newsArr = Array.isArray(news) ? news : (news && Array.isArray(news.data) ? news.data : []);
                if (newsArr.length > 0) {
                    let response = '*📰 BERITA KUMPARAN TERKINI*\n\n';
                    newsArr.forEach((item, index) => {
                        response += `${index + 1}. ${item.title}\n${item.link}\n\n`;
                    });
                    await sock.sendMessage(sender, { text: response });
                    console.log(chalk.green(`[COMMAND] Berhasil mengirim ${newsArr.length} berita Kumparan ke ${sender}`));
                } else {
                    await sock.sendMessage(sender, { text: 'Tidak ada berita yang ditemukan.' });
                    console.log(chalk.red('[COMMAND] Tidak ada berita Kumparan yang ditemukan!'));
                }
            }
            // Fitur Niat Sholat
            if (prefix && commandBody.startsWith('niatsholat')) {
                const args = commandBody.split(' ');
                const nama = args[1] ? args[1].toLowerCase() : '';
                if (!nama) {
                    await sock.sendMessage(sender, { text: 'Contoh penggunaan: niatsholat subuh' });
                    return;
                }
                try {
                    const res = await axios.get('https://raw.githubusercontent.com/zeeoneofficial/My-SQL-Results/master/data/dataNiatShalat.json');
                    const data = res.data;
                    // Cari berdasarkan nama sholat (subuh, dzuhur, ashar, maghrib, isya)
                    const found = data.find(item => item.name.toLowerCase().includes(nama));
                    if (!found) {
                        await sock.sendMessage(sender, { text: 'Niat sholat tidak ditemukan. Gunakan: subuh, dzuhur, ashar, maghrib, isya' });
                        return;
                    }
                    let pesan = `*${found.name}*

` +
                        `Arab: ${found.arabic}
` +
                        `Latin: ${found.latin}
` +
                        `Terjemahan: ${found.terjemahan}`;
                    await sock.sendMessage(sender, { text: pesan });
                } catch (e) {
                    await sock.sendMessage(sender, { text: 'Gagal mengambil data niat sholat.' });
                }
                return;
            }
        }
    });

    return sock;
};

// Tambahkan handler untuk fitur Alkitab
async function handleAlkitab(sock, sender, text) {
    if (!text) {
        return sock.sendMessage(sender, { text: 'uhm.. teksnya mana?\n\ncontoh:\n.alkitab kejadian' });
    }

    try {
        let res = await axios.get(`https://alkitab.me/search?q=${encodeURIComponent(text)}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36"
            }
        });

        let $ = cheerio.load(res.data);
        let result = [];
        $('div.vw').each(function (a, b) {
            let teks = $(b).find('p').text().trim();
            let link = $(b).find('a').attr('href');
            let title = $(b).find('a').text().trim();
            result.push({ teks, link, title });
        });

        let foto = 'https://telegra.ph/file/a333442553b1bc336cc55.jpg';
        let judul = '*────────「 Alkitab 」 ────────*';
        let caption = result.map(v => `💌 ${v.title}\n📮 ${v.teks}`).join('\n┄┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┄\n');
        
        await sock.sendMessage(sender, {
            image: { url: foto },
            caption: `${judul}\n\n${caption}`
        });
    } catch (error) {
        console.error('Error in handleAlkitab:', error);
        sock.sendMessage(sender, { text: 'Maaf, terjadi kesalahan saat mencari ayat Alkitab.' });
    }
}

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

async function alquran(surah, ayat) {
    const fetch = require('node-fetch');
    const cheerio = require('cheerio');
    let res = await fetch(`https://kalam.sindonews.com/ayat/${ayat}/${surah}`);
    if (!res.ok) throw 'Error, maybe not found?';
    let $ = cheerio.load(await res.text());
    let content = $('body > main > div > div.content.clearfix > div.news > section > div.list-content.clearfix');
    let Surah = $(content).find('div.ayat-title > h1').text();
    let arab = $(content).find('div.ayat-detail > div.ayat-arab').text();
    let latin = $(content).find('div.ayat-detail > div.ayat-latin').text();
    let terjemahan = $(content).find('div.ayat-detail > div.ayat-detail-text').text();
    let tafsir = '';
    $(content).find('div.ayat-detail > div.tafsir-box > div').each(function () {
        tafsir += $(this).text() + '\n';
    });
    tafsir = tafsir.trim();
    let keterangan = $(content).find('div.ayat-detail > div.ayat-summary').text();
    let audio = `https://quran.kemenag.go.id/cmsq/source/s01/${surah < 10 ? '00' : surah >= 10 && surah < 100 ? '0' : ''}${surah}${ayat < 10 ? '00' : ayat >= 10 && ayat < 100 ? '0' : ''}${ayat}.mp3`;
    return {
        surah: Surah,
        arab,
        latin,
        terjemahan,
        tafsir,
        audio,
        keterangan,
    };
}

// Inisialisasi data asmaulhusna jika belum ada
defineAsmaulHusna();

function defineAsmaulHusna() {
    if (!global.asmaulhusna || !Array.isArray(global.asmaulhusna) || global.asmaulhusna.length < 1) {
        global.asmaulhusna = [
            { index: 1, latin: "Ar Rahman", arabic: "الرَّحْمَنُ", translation_id: "Yang Memiliki Mutlak sifat Pemurah", translation_en: "The All Beneficent" },
            { index: 2, latin: "Ar Rahiim", arabic: "الرَّحِيمُ", translation_id: "Yang Memiliki Mutlak sifat Penyayang", translation_en: "The Most Merciful" },
            { index: 3, latin: "Al Malik", arabic: "الْمَلِكُ", translation_id: "Yang Memiliki Mutlak sifat Merajai/Memerintah", translation_en: "The King, The Sovereign" },
            { index: 4, latin: "Al Quddus", arabic: "الْقُدُّوسُ", translation_id: "Yang Memiliki Mutlak sifat Suci", translation_en: "The Most Holy" },
            { index: 5, latin: "As Salaam", arabic: "السَّلاَمُ", translation_id: "Yang Memiliki Mutlak sifat Memberi Kesejahteraan", translation_en: "Peace and Blessing" },
            { index: 6, latin: "Al Mu'min", arabic: "الْمُؤْمِنُ", translation_id: "Yang Memiliki Mutlak sifat Memberi Keamanan", translation_en: "The Guarantor" },
            { index: 7, latin: "Al Muhaimin", arabic: "الْمُهَيْمِنُ", translation_id: "Yang Memiliki Mutlak sifat Pemelihara", translation_en: "The Guardian, the Preserver" },
            { index: 8, latin: "Al 'Aziiz", arabic: "الْعَزِيزُ", translation_id: "Yang Memiliki Mutlak Kegagahan", translation_en: "The Almighty, the Self Sufficient" },
            { index: 9, latin: "Al Jabbar", arabic: "الْجَبَّارُ", translation_id: "Yang Memiliki Mutlak sifat Perkasa", translation_en: "The Powerful, the Irresistible" },
            { index: 10, latin: "Al Mutakabbir", arabic: "الْمُتَكَبِّرُ", translation_id: "Yang Memiliki Mutlak sifat Megah,Yang Memiliki Kebesaran", translation_en: "The Tremendous" }
        ];
    }
}

async function GDriveDl(url) {
    const fetch = require('node-fetch');
    let id;
    if (!(url && url.match(/drive\.google/i))) throw 'Invalid URL';
    id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1];
    if (!id) throw 'ID Not Found';
    let res = await fetch(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
        method: 'post',
        headers: {
            'accept-encoding': 'gzip, deflate, br',
            'content-length': 0,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'origin': 'https://drive.google.com',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
            'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
            'x-drive-first-party': 'DriveWebUi',
            'x-json-requested': 'true'
        }
    });
    let { fileName, sizeBytes, downloadUrl } = JSON.parse((await res.text()).slice(4));
    if (!downloadUrl) throw 'Link Download Limit!';
    let data = await fetch(downloadUrl);
    if (data.status !== 200) throw data.statusText;
    // Format size
    const sizeFormatter = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        let kb = bytes / 1024;
        if (kb < 1024) return kb.toFixed(2) + ' KB';
        let mb = kb / 1024;
        if (mb < 1024) return mb.toFixed(2) + ' MB';
        let gb = mb / 1024;
        return gb.toFixed(2) + ' GB';
    };
    return { downloadUrl, fileName, fileSize: sizeFormatter(sizeBytes), mimetype: data.headers.get('content-type') };
}

// Tambahkan fungsi ssweb sebelum connectToWhatsApp
async function ssweb(url, device = 'desktop') {
    return new Promise((resolve, reject) => {
        const base = 'https://www.screenshotmachine.com';
        const param = {
            url: url,
            device: device,
            full: 'on',
            cacheLimit: 0
        };
        
        axios({
            url: base + '/capture.php',
            method: 'POST',
            data: new URLSearchParams(Object.entries(param)),
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then((data) => {
            const cookies = data.headers['set-cookie'];
            
            if (data.data.status == 'success') {
                axios.get(base + '/' + data.data.link, {
                    headers: {
                        'cookie': cookies.join('')
                    },
                    responseType: 'arraybuffer'
                }).then(({ data }) => {
                    const result = {
                        status: 200,
                        author: 'Xnuvers007',
                        result: data
                    };
                    resolve(result);
                });
            } else {
                reject({ status: 404, author: 'Xnuvers007', message: data.data });
            }
        }).catch(reject);
    });
}

// Daftar motivasi
const motivasiList = [
  "ᴊᴀɴɢᴀɴ ʙɪᴄᴀʀᴀ, ʙᴇʀᴛɪɴᴅᴀᴋ ꜱᴀᴊᴀ. ᴊᴀɴɢᴀɴ ᴋᴀᴛᴀᴋᴀɴ, ᴛᴜɴᴊᴜᴋᴋᴀɴ ꜱᴀᴊᴀ. ᴊᴀɴɢᴀɴ ᴊᴀɴᴊɪ, ʙᴜᴋᴛɪᴋᴀɴ ꜱᴀᴊᴀ.",
  "ᴊᴀɴɢᴀɴ ᴘᴇʀɴᴀʜ ʙᴇʀʜᴇɴᴛɪ ᴍᴇʟᴀᴋᴜᴋᴀɴ ʏᴀɴɢ ᴛᴇʀʙᴀɪᴋ ʜᴀɴʏᴀ ᴋᴀʀᴇɴᴀ ꜱᴇꜱᴇᴏʀᴀɴɢ ᴛɪᴅᴀᴋ ᴍᴇᴍʙᴇʀɪ ᴀɴᴅᴀ ᴘᴇɴɢʜᴀʀɢᴀᴀɴ.",
  "ʙᴇᴋᴇʀᴊᴀ ꜱᴀᴀᴛ ᴍᴇʀᴇᴋᴀ ᴛɪᴅᴜʀ. ʙᴇʟᴀᴊᴀʀ ꜱᴀᴀᴛ ᴍᴇʀᴇᴋᴀ ʙᴇʀᴘᴇꜱᴛᴀ. ʜᴇᴍᴀᴛ ꜱᴇᴍᴇɴᴛᴀʀᴀ ᴍᴇʀᴇᴋᴀ ᴍᴇɴɢʜᴀʙɪꜱᴋᴀɴ. ʜɪᴅᴜᴘʟᴀʜ ꜱᴇᴘᴇʀᴛɪ ᴍɪᴍᴘɪ ᴍᴇʀᴇᴋᴀ.",
  // ... (potong, tambahkan semua motivasi dari file yang Anda lampirkan)
  "ᴋᴇɢᴀɢᴀʟᴀɴ ᴛɪᴅᴀᴋ ᴀᴋᴀɴ ᴘᴇʀɴᴀʜ ᴍᴇɴʏᴜꜱᴜʟ ᴊɪᴋᴀ ᴛᴇᴋᴀᴅ ᴜɴᴛᴜᴋ ꜱᴜᴋꜱᴇꜱ ᴄᴜᴋᴜᴘ ᴋᴜᴀᴛ."
];
function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())];
}

// Fungsi untuk mengambil berita CNN
async function getCNNNews() {
    try {
        const response = await axios.get('https://news-api-zhirrr.vercel.app/v1/cnn-news');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching CNN news:', error);
        return null;
    }
}

// Tambahkan fungsi baru di bawah getCNNNews()
async function getCNNNewsByCategory(type = 'nasional') {
    try {
        const response = await axios.get(`https://news-api-zhirrr.vercel.app/v1/cnn-news/${type}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching CNN news by category:', error);
        return null;
    }
}

// Fungsi untuk mengambil berita CNBC
async function getCNBCNews() {
    try {
        console.log(chalk.blue('[CNBC] Mencoba mengambil berita CNBC...'));
        const response = await axios.get('https://news-api-zhirrr.vercel.app/v1/cnbc-news/');
        console.log(chalk.green('[CNBC] Berhasil mengambil berita CNBC'));
        console.log(chalk.yellow(`[CNBC] Jumlah berita: ${response.data.length}`));
        return response.data;
    } catch (error) {
        console.error(chalk.red('[CNBC] Error mengambil berita CNBC:'), error.message);
        return null;
    }
}

async function getCNBCNewsByCategory(type = 'market') {
    try {
        console.log(chalk.blue(`[CNBC] Mencoba mengambil berita CNBC kategori: ${type}`));
        const response = await axios.get(`https://news-api-zhirrr.vercel.app/v1/cnbc-news/${type}`);
        console.log(chalk.green(`[CNBC] Berhasil mengambil berita CNBC kategori: ${type}`));
        console.log(chalk.yellow(`[CNBC] Jumlah berita: ${response.data.length}`));
        return response.data;
    } catch (error) {
        console.error(chalk.red(`[CNBC] Error mengambil berita CNBC kategori ${type}:`), error.message);
        return null;
    }
}

// Fungsi untuk mengambil berita Republika
async function getRepublikaNews() {
    try {
        console.log(chalk.blue('[REPUBLIKA] Mencoba mengambil berita Republika...'));
        const response = await axios.get('https://news-api-zhirrr.vercel.app/v1/republika-news/');
        console.log(chalk.green('[REPUBLIKA] Berhasil mengambil berita Republika'));
        console.log(chalk.yellow(`[REPUBLIKA] Jumlah berita: ${response.data.length}`));
        return response.data;
    } catch (error) {
        console.error(chalk.red('[REPUBLIKA] Error mengambil berita Republika:'), error.message);
        return null;
    }
}

async function getRepublikaNewsByCategory(type = 'news') {
    try {
        console.log(chalk.blue(`[REPUBLIKA] Mencoba mengambil berita Republika kategori: ${type}`));
        const response = await axios.get(`https://news-api-zhirrr.vercel.app/v1/republika-news/${type}`);
        console.log(chalk.green(`[REPUBLIKA] Berhasil mengambil berita Republika kategori: ${type}`));
        console.log(chalk.yellow(`[REPUBLIKA] Jumlah berita: ${response.data.length}`));
        return response.data;
    } catch (error) {
        console.error(chalk.red(`[REPUBLIKA] Error mengambil berita Republika kategori ${type}:`), error.message);
        return null;
    }
}

// Fungsi untuk mengambil berita Tempo
async function getTempoNews() {
    try {
        console.log(chalk.blue('[TEMPO] Mencoba mengambil berita Tempo...'));
        const response = await axios.get('https://news-api-zhirrr.vercel.app/v1/tempo-news/');
        console.log(chalk.green('[TEMPO] Berhasil mengambil berita Tempo'));
        console.log(chalk.yellow(`[TEMPO] Jumlah berita: ${response.data.length}`));
        return response.data;
    } catch (error) {
        console.error(chalk.red('[TEMPO] Error mengambil berita Tempo:'), error.message);
        return null;
    }
}

async function getTempoNewsByCategory(type = 'nasional') {
    try {
        console.log(chalk.blue(`[TEMPO] Mencoba mengambil berita Tempo kategori: ${type}`));
        const response = await axios.get(`https://news-api-zhirrr.vercel.app/v1/tempo-news/${type}`);
        console.log(chalk.green(`[TEMPO] Berhasil mengambil berita Tempo kategori: ${type}`));
        console.log(chalk.yellow(`[TEMPO] Jumlah berita: ${response.data.length}`));
        return response.data;
    } catch (error) {
        console.error(chalk.red(`[TEMPO] Error mengambil berita Tempo kategori ${type}:`), error.message);
        return null;
    }
}

// Fungsi untuk mengambil berita Antara
async function getAntaraNewsByCategory(type = 'terkini') {
    try {
        console.log(chalk.blue(`[ANTARA] Mencoba mengambil berita Antara kategori: ${type}`));
        const response = await axios.get(`https://news-api-zhirrr.vercel.app/v1/antara-news/${type}`);
        console.log(chalk.green(`[ANTARA] Berhasil mengambil berita Antara kategori: ${type}`));
        console.log(chalk.yellow(`[ANTARA] Jumlah berita: ${response.data.length}`));
        return response.data;
    } catch (error) {
        console.error(chalk.red(`[ANTARA] Error mengambil berita Antara kategori ${type}:`), error.message);
        return null;
    }
}

// Fungsi untuk mengambil berita Kumparan
async function getKumparanNews() {
    try {
        console.log(chalk.blue('[KUMPARAN] Mencoba mengambil berita Kumparan...'));
        const response = await axios.get('https://news-api-zhirrr.vercel.app/v1/kumparan-news');
        console.log(chalk.green('[KUMPARAN] Berhasil mengambil berita Kumparan'));
        console.log(chalk.yellow(`[KUMPARAN] Jumlah berita: ${response.data.length}`));
        return response.data;
    } catch (error) {
        console.error(chalk.red('[KUMPARAN] Error mengambil berita Kumparan:'), error.message);
        return null;
    }
}

// Menjalankan bot
connectToWhatsApp().catch(err => console.log('Error:', err)); 