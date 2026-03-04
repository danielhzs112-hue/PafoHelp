import {
  Client,
  GatewayIntentBits,
  Partials,
  MessageFlags,
  TextDisplayBuilder,
  ContainerBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ChannelType,
  PermissionsBitField,
  AttachmentBuilder,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";

const TOKEN                 = process.env.TOKEN;
const CLIENT_ID             = process.env.CLIENT_ID ?? "";

const VERIFIED_ROLE_ID      = "1464623361626734637";
const WELCOME_CHANNEL_ID    = "1449067457082949752";
const LOG_CHANNEL_ID        = "1449525327175880865";
const REVIEW_CHANNEL_ID     = "1462534733270614239";
const FREEAGENT_CHANNEL_ID  = "1461773344620941534";
const LOJA_CHANNEL_ID       = "1449518786825814036";
const TICKET_CATEGORY_ID    = "";
const GUILD_ID              = "1449061779060687063";
const PUNITIONS_CHANNEL_ID  = "1450094761452109948";
const SCOUTING_CHANNEL_ID   = "1475890932162367529";
const FEEDBACK_COMPRAS_ID   = "1462499290810286254";
const TICKET_LOG_CHANNEL_ID = "1449525327175880865";
const PARCERIA_CHANNEL_ID   = "1449071892873871522";
const FREELINKS_CHANNEL_ID  = "1449112362912186389";
const LEAGUES_CHANNEL_ID    = "1449070133778714738";
const PENEIRA_CHANNEL_ID    = "1475542500180754523";
const GENERAL_CHANNEL_ID    = "1449061779882901636";
const APPEAL_SERVER         = "https://discord.gg/hvQ8x9JwyB";

const STAFF_ROLES = ["1449062440183664701","1449064374177104074","1454100805496868906"];
const SERVER_ICON = "https://cdn.discordapp.com/icons/1449061779060687063/ecbd3ce76f39128b1ec08154e7faff75.png?size=2048";

const WARN_ROLES = [
  "1453806335996203050",
  "1453806497409536020",
  "1453806627105935461",
];

const BANNERS = {
  welcome : "https://cdn.discordapp.com/attachments/1462471559032865115/1474215814038159410/imagem_2026-02-19_222715260-Photoroom.png",
  verify  : "https://cdn.discordapp.com/attachments/1462471559032865115/1474218682153566371/imagem_2026-02-19_223847173-Photoroom.png",
  rules   : "https://cdn.discordapp.com/attachments/1462471559032865115/1474220153192579326/imagem_2026-02-19_224443203-Photoroom.png",
  booster : "https://cdn.discordapp.com/attachments/1462471559032865115/1474221722369523723/imagem_2026-02-19_225105139-Photoroom.png",
  info    : "https://cdn.discordapp.com/attachments/1462471559032865115/1474221395520262196/imagem_2026-02-19_224936676-Photoroom.png",
  loja    : "https://cdn.discordapp.com/attachments/1469069997975535646/1474425406764351512/imagem_2026-02-20_122018758-Photoroom.png",
  ticket  : "https://cdn.discordapp.com/attachments/1469069997975535646/1474427362362916955/imagem_2026-02-20_122753297-Photoroom.png",
};

const BLACKLIST_PATTERNS = [
  /Yooo looook at girl in vc/i,
  /cute-voice/i,
];

const EMOJI_FREE_CHANNELS = new Set([
  FREEAGENT_CHANNEL_ID,
  LEAGUES_CHANNEL_ID,
  SCOUTING_CHANNEL_ID,
  FREELINKS_CHANNEL_ID,
]);

const DROPS_QUESTIONS = [
  { q: "Que ano nasceu o Lula?", a: ["1945"] },
  { q: "Qual a capital do Brasil?", a: ["brasilia", "brasília"] },
  { q: "Em que ano o Roblox foi lançado?", a: ["2006"] },
  { q: "Qual o nome do criador do Roblox?", a: ["david baszucki", "david"] },
  { q: "Quantos títulos de Copa do Mundo o Brasil tem?", a: ["5", "cinco", "penta"] },
  { q: "Quem pintou a Mona Lisa?", a: ["da vinci", "leonardo", "leonardo da vinci"] },
  { q: "Qual o maior planeta do sistema solar?", a: ["jupiter", "júpiter"] },
  { q: "Quantos estados tem o Brasil?", a: ["26"] },
  { q: "Qual a moeda oficial do Japão?", a: ["iene", "yen"] },
  { q: "Quem descobriu o Brasil?", a: ["pedro alvares cabral", "cabral"] },
  { q: "Quantos continentes existem?", a: ["6", "seis"] },
  { q: "Qual o metal cujo símbolo químico é Au?", a: ["ouro"] },
  { q: "Em que ano começou a Segunda Guerra Mundial?", a: ["1939"] },
  { q: "Qual o menor país do mundo?", a: ["vaticano"] },
  { q: "Quem escreveu Dom Quixote?", a: ["miguel de cervantes", "cervantes"] },
  { q: "Quantos ossos tem o corpo humano adulto?", a: ["206"] },
  { q: "Qual o gás que as plantas absorvem na fotossíntese?", a: ["gas carbonico", "dióxido de carbono", "co2"] },
  { q: "Qual a cor da esmeralda?", a: ["verde"] },
  { q: "Qual a montanha mais alta do mundo?", a: ["everest", "monte everest"] },
  { q: "Qual oceano banha o Brasil?", a: ["atlantico", "atlântico"] },
  { q: "Qual animal é conhecido como o rei da selva?", a: ["leao", "leão"] },
  { q: "Em qual continente fica o Egito?", a: ["africa", "áfrica"] },
  { q: "Quantas patas tem uma aranha?", a: ["8", "oito"] },
  { q: "Qual é o idioma mais falado no mundo?", a: ["mandarim", "ingles", "inglês"] },
  { q: "Qual instrumento musical tem teclas pretas e brancas?", a: ["piano", "teclado"] },
  { q: "Quem foi o primeiro homem a pisar na lua?", a: ["neil armstrong", "armstrong"] },
  { q: "Qual é a raiz quadrada de 144?", a: ["12", "doze"] },
  { q: "Qual o maior mamífero terrestre?", a: ["elefante"] },
  { q: "Em que ano o homem pisou na lua?", a: ["1969"] },
  { q: "Qual é o nome da galáxia em que vivemos?", a: ["via lactea", "via láctea"] },
  { q: "Quem é o autor de 'O Senhor dos Anéis'?", a: ["tolkien", "j.r.r. tolkien"] },
  { q: "Qual a capital da França?", a: ["paris"] },
  { q: "Qual a fórmula química da água?", a: ["h2o"] },
  { q: "Qual o planeta mais próximo do Sol?", a: ["mercurio", "mercúrio"] },
  { q: "Em que país fica a Torre Eiffel?", a: ["franca", "frança"] },
  { q: "Quantos dias tem um ano bissexto?", a: ["366"] },
  { q: "Qual o símbolo químico do oxigênio?", a: ["o"] },
  { q: "Qual esporte o Pelé jogava?", a: ["futebol"] },
  { q: "Qual o nome do evento em que a bola passa a linha do gol?", a: ["gol"] },
  { q: "Quantos jogadores tem um time de futebol em campo?", a: ["11", "onze"] },
  { q: "Qual país venceu a Copa do Mundo de 2014?", a: ["alemanha"] },
  { q: "Em que estado fica a cidade de São Paulo?", a: ["sao paulo", "sp"] },
  { q: "Qual o maior oceano do mundo?", a: ["pacifico", "pacífico"] },
  { q: "Qual a capital dos Estados Unidos?", a: ["washington", "washington dc"] },
  { q: "Quem é conhecido como o Rei do Pop?", a: ["michael jackson"] },
  { q: "Qual o resultado de 8x8?", a: ["64"] },
  { q: "Quem escreveu 'Romeu e Julieta'?", a: ["shakespeare", "william shakespeare"] },
  { q: "Quantos segundos tem um minuto?", a: ["60", "sessenta"] },
  { q: "Qual a cor do cavalo branco de Napoleão?", a: ["branco"] },
  { q: "Quantas horas tem um dia?", a: ["24", "vinte e quatro"] },
  { q: "Em qual país se originou o sushi?", a: ["japao", "japão"] },
  { q: "Qual o oposto de claro?", a: ["escuro"] },
  { q: "Qual a temperatura em que a água ferve (em graus Celsius)?", a: ["100"] },
  { q: "Qual é o primeiro mês do ano?", a: ["janeiro"] },
  { q: "Que animal produz mel?", a: ["abelha"] },
  { q: "Qual é o coletivo de cães?", a: ["matilha"] },
  { q: "Quantos milímetros há em um centímetro?", a: ["10", "dez"] },
  { q: "Qual a cor do sangue humano?", a: ["vermelho", "vermelha"] },
  { q: "Onde se localiza o Cristo Redentor?", a: ["rio de janeiro", "rj"] },
  { q: "Qual é a estação mais quente do ano?", a: ["verao", "verão"] },
  { q: "Como se chama o satélite natural da Terra?", a: ["lua"] },
  { q: "Quem fundou a Microsoft?", a: ["bill gates"] },
  { q: "Que fruta é conhecida por manter os médicos afastados?", a: ["maca", "maçã"] },
  { q: "Qual é a língua oficial do Brasil?", a: ["portugues", "português"] },
  { q: "Em que ano a pandemia de COVID-19 começou?", a: ["2019", "2020"] },
  { q: "Qual a soma de 15 e 25?", a: ["40", "quarenta"] },
  { q: "Que letra vem depois de 'K'?", a: ["l"] },
  { q: "Qual é a capital da Argentina?", a: ["buenos aires"] },
  { q: "O que significa a sigla ONU?", a: ["organizacao das nacoes unidas", "organização das nações unidas"] },
  { q: "Em qual oceano afundou o Titanic?", a: ["atlantico", "atlântico"] },
  { q: "Quantas sílabas tem a palavra 'paralelepípedo'?", a: ["7", "sete"] },
  { q: "Em que estado do Brasil fica o Pelourinho?", a: ["bahia", "ba"] },
  { q: "Qual time espanhol tem mais títulos da Champions League?", a: ["real madrid"] },
  { q: "Qual a cidade com mais habitantes no mundo?", a: ["toquio", "tóquio"] },
  { q: "Em qual continente fica a Austrália?", a: ["oceania"] },
  { q: "O que os pandas mais comem?", a: ["bambu"] },
  { q: "Quantos anos durou a Guerra dos Cem Anos?", a: ["116"] },
  { q: "Qual é o país mais populoso do mundo?", a: ["india", "índia", "china"] },
  { q: "Como se chama a figura geométrica de 3 lados?", a: ["triangulo", "triângulo"] },
  { q: "Quantos minutos tem meia hora?", a: ["30", "trinta"] },
  { q: "Qual elemento químico tem o símbolo Fe?", a: ["ferro"] },
  { q: "Que inventor brasileiro desenvolveu o 14-Bis?", a: ["santos dumont"] },
  { q: "Qual o estado da água no formato de gelo?", a: ["solido", "sólido"] },
  { q: "Qual a cor que se obtém misturando azul e amarelo?", a: ["verde"] },
  { q: "Em qual esporte se usa raquete e peteca?", a: ["badminton"] },
  { q: "Qual o maior estado do Brasil em extensão territorial?", a: ["amazonas"] },
  { q: "Em qual continente encontramos as pirâmides de Gizé?", a: ["africa", "áfrica"] },
  { q: "Quem é o mascote da SEGA?", a: ["sonic"] },
  { q: "Qual console de videogame mais vendido de todos os tempos?", a: ["ps2", "playstation 2"] },
  { q: "Quem é o encanador mais famoso do mundo dos games?", a: ["mario", "super mario"] },
  { q: "Qual a moeda virtual do Roblox?", a: ["robux"] },
  { q: "No jogo Minecraft, de que material é feita a primeira picareta?", a: ["madeira"] },
  { q: "Em que cidade o Batman atua?", a: ["gotham", "gotham city"] },
  { q: "Que herói perdeu os pais e foi criado pelo Tio Ben?", a: ["homem aranha", "spider man"] },
  { q: "Qual a cor do sabre de luz do Darth Vader?", a: ["vermelho"] },
  { q: "Como se chama a mãe do Naruto?", a: ["kushina"] },
  { q: "Que animal de estimação é o Tom, do desenho Tom e Jerry?", a: ["gato"] },
  { q: "Em Harry Potter, qual casa tem as cores vermelho e dourado?", a: ["grifinoria", "grifinória"] },
  { q: "Qual super-herói tem um escudo de Vibranium?", a: ["capitao america", "capitão américa"] },
  { q: "Em que jogo existe a cidade de Los Santos?", a: ["gta v", "gta", "grand theft auto"] },
  { q: "Quantos anos tem um século?", a: ["100", "cem"] }
];

let dropActive = false;

import { createServer } from "net";
const lockServer = createServer();
lockServer.on("error", () => {
  console.error("❌ Bot já está rodando! Feche a instância anterior ou limpe as portas do host.");
  process.exit(1);
});
lockServer.listen(19876, "127.0.0.1");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
});

client.once("ready", async () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
  await registerSlashCommands();
  checkTempRoles();
  setInterval(checkTempRoles, 60_000);
  setInterval(checkStaleTickets, 5 * 60_000);
  triggerDrop();
  setInterval(triggerDrop, 2 * 60 * 60 * 1000);
});

async function triggerDrop() {
  if (dropActive) return;
  const brtTime = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo", hour12: false });
  const brtHour = new Date(brtTime).getHours();
  if (brtHour < 10) return; 

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) return;
  const channel = guild.channels.cache.get(GENERAL_CHANNEL_ID);
  if (!channel) return;

  dropActive = true;
  const item = DROPS_QUESTIONS[Math.floor(Math.random() * DROPS_QUESTIONS.length)];

  const c = new ContainerBuilder()
    .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.booster)))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎁 DROP RÁPIDO!\n\n> **${item.q}**\n\nResponda no chat em até **1 minuto** para ganhar um cargo VIP!\n*(Olheiro [5 Dias], Scrim Hoster ou Pic Perm)*`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Drops System`));

  await channel.send({ content: "@here", components: [c], flags: MessageFlags.IsComponentsV2 }).catch(() => {});

  const filter = m => !m.author.bot;
  const collector = channel.createMessageCollector({ filter, time: 60000 });

  collector.on("collect", async m => {
    const answer = m.content.toLowerCase().trim();
    if (item.a.some(ans => answer.includes(ans))) {
      collector.stop("winner");
      const winC = new ContainerBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎉 TEMOS UM VENCEDOR!\n\nParabéns <@${m.author.id}>! Você acertou a resposta e ganhou o drop!\nVerifique suas DMs para escolher seu prêmio.`))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Drops System`));
      await channel.send({ components: [winC], flags: MessageFlags.IsComponentsV2 }).catch(() => {});

const dmSelect = new StringSelectMenuBuilder()
  .setCustomId(`drop_claim_${m.author.id}`)
  .setPlaceholder("Escolha seu cargo VIP (Válido por 5 dias)")
  .addOptions(
    new StringSelectMenuOptionBuilder().setLabel("Olheiro (5 Dias)").setValue("1449070067131224268").setEmoji("🔍"),
    new StringSelectMenuOptionBuilder().setLabel("Scrim Hoster (5 Dias)").setValue("1449070133040517262").setEmoji("⚔️"),
    new StringSelectMenuOptionBuilder().setLabel("Pic Perm (5 Dias)").setValue("1450118477179260948").setEmoji("📸")
  );
      const dmC = new ContainerBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎁 Você Venceu o Drop!\n\nVocê respondeu corretamente no chat e garantiu seu prêmio. Escolha abaixo qual cargo você deseja receber no servidor:`))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Drops System`))
        .addActionRowComponents(new ActionRowBuilder().addComponents(dmSelect));

      await m.author.send({ components: [dmC], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
    }
  });

  collector.on("end", (collected, reason) => {
    dropActive = false;
    if (reason !== "winner") {
      const failC = new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(`### ⏰ O tempo esgotou!\n> Ninguém acertou o drop desta vez. A resposta era: **${item.a[0]}**`));
      channel.send({ components: [failC], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
    }
  });
}

async function registerSlashCommands() {
  if (!CLIENT_ID) { console.warn("⚠️ CLIENT_ID não definido."); return; }
  const commands = [
    new SlashCommandBuilder()
      .setName("setroletemp")
      .setDescription("Dá um cargo temporário a um membro")
      .addUserOption(o => o.setName("usuario").setDescription("Membro").setRequired(true))
      .addRoleOption(o => o.setName("cargo").setDescription("Cargo").setRequired(true))
      .addIntegerOption(o => o.setName("dias").setDescription("Dias").setRequired(true).setMinValue(1).setMaxValue(30))
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .toJSON(),

    new SlashCommandBuilder()
      .setName("ban")
      .setDescription("Bane um membro do servidor")
      .addUserOption(o => o.setName("usuario").setDescription("Membro a banir").setRequired(true))
      .addStringOption(o => o.setName("motivo").setDescription("Motivo do ban").setRequired(false))
      .addIntegerOption(o => o.setName("dias").setDescription("Dias de mensagens a deletar (0-7)").setMinValue(0).setMaxValue(7).setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .toJSON(),

    new SlashCommandBuilder()
      .setName("unban")
      .setDescription("Desbane um usuário")
      .addStringOption(o => o.setName("userid").setDescription("ID do usuário a desbanir").setRequired(true))
      .addStringOption(o => o.setName("motivo").setDescription("Motivo do unban").setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .toJSON(),

    new SlashCommandBuilder()
      .setName("mute")
      .setDescription("Silencia (timeout) um membro")
      .addUserOption(o => o.setName("usuario").setDescription("Membro").setRequired(true))
      .addIntegerOption(o => o.setName("minutos").setDescription("Duração em minutos").setRequired(true).setMinValue(1).setMaxValue(40320))
      .addStringOption(o => o.setName("motivo").setDescription("Motivo").setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .toJSON(),

    new SlashCommandBuilder()
      .setName("unmute")
      .setDescription("Remove o silenciamento de um membro")
      .addUserOption(o => o.setName("usuario").setDescription("Membro").setRequired(true))
      .addStringOption(o => o.setName("motivo").setDescription("Motivo").setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .toJSON(),

    new SlashCommandBuilder()
      .setName("warn")
      .setDescription("Adverte um membro (dá cargo de advertência + mute 1h)")
      .addUserOption(o => o.setName("usuario").setDescription("Membro").setRequired(true))
      .addStringOption(o => o.setName("motivo").setDescription("Motivo").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .toJSON(),

    new SlashCommandBuilder()
      .setName("unwarn")
      .setDescription("Remove advertência de um membro")
      .addUserOption(o => o.setName("usuario").setDescription("Membro").setRequired(true))
      .addStringOption(o => o.setName("motivo").setDescription("Motivo").setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .toJSON(),

    new SlashCommandBuilder()
      .setName("kick")
      .setDescription("Expulsa um membro do servidor")
      .addUserOption(o => o.setName("usuario").setDescription("Membro").setRequired(true))
      .addStringOption(o => o.setName("motivo").setDescription("Motivo").setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
      .toJSON(),

    new SlashCommandBuilder()
      .setName("lock")
      .setDescription("Trava o canal (impede mensagens de @everyone)")
      .addChannelOption(o => o.setName("canal").setDescription("Canal a travar (padrão: atual)").setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .toJSON(),

    new SlashCommandBuilder()
      .setName("unlock")
      .setDescription("Destravar o canal")
      .addChannelOption(o => o.setName("canal").setDescription("Canal a destravar (padrão: atual)").setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .toJSON(),

    new SlashCommandBuilder()
      .setName("slowmode")
      .setDescription("Define o modo lento do canal")
      .addIntegerOption(o => o.setName("segundos").setDescription("Segundos (0 = desativar)").setRequired(true).setMinValue(0).setMaxValue(21600))
      .addChannelOption(o => o.setName("canal").setDescription("Canal (padrão: atual)").setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .toJSON(),
  ];

  try {
    const rest = new REST({ version: "10" }).setToken(TOKEN);
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("✅ Slash commands registrados.");
  } catch (e) { console.error("Erro ao registrar slash commands:", e); }
}

import { readFileSync, writeFileSync, existsSync } from "fs";

function loadJSON(path, fallback) {
  try {
    if (!existsSync(path)) { writeFileSync(path, JSON.stringify(fallback, null, 2)); return fallback; }
    return JSON.parse(readFileSync(path, "utf8"));
  } catch { return fallback; }
}
function saveJSON(path, data) { writeFileSync(path, JSON.stringify(data, null, 2)); }

function loadTicketCount() { return loadJSON("./ticketcount.json", { count: 0 }).count ?? 0; }
function saveTicketCount(n) { saveJSON("./ticketcount.json", { count: n }); }
function loadTempRoles()    { return loadJSON("./temproles.json", []); }
function saveTempRoles(d)   { saveJSON("./temproles.json", d); }
function loadWarns()        { return loadJSON("./warns.json", {}); }
function saveWarns(d)       { saveJSON("./warns.json", d); }
function loadTicketData() {
  const raw = loadJSON("./ticketdata.json", {});
  const map = new Map();
  for (const [k, v] of Object.entries(raw)) map.set(k, v);
  return map;
}
function saveTicketData(map) {
  const obj = {};
  for (const [k, v] of map.entries()) obj[k] = v;
  saveJSON("./ticketdata.json", obj);
}

async function checkTempRoles() {
  const now  = Date.now();
  const data = loadTempRoles();
  const keep = [];
  for (const entry of data) {
    if (now >= entry.expiresAt) {
      try {
        const guild  = await client.guilds.fetch(entry.guildId).catch(() => null);
        const member = guild ? await guild.members.fetch(entry.userId).catch(() => null) : null;
        if (member?.roles.cache.has(entry.roleId)) {
          await member.roles.remove(entry.roleId).catch(() => {});
          const logCh = guild.channels.cache.get(LOG_CHANNEL_ID);
          logCh?.send({ embeds: [new EmbedBuilder()
            .setTitle("⏰ Cargo Temporário Expirado")
            .setDescription(`<@${entry.userId}> teve o cargo <@&${entry.roleId}> removido após ${entry.days} dia(s).`)
            .setColor(0xED4245).setFooter({ text: "PAFO — Temp Role System", iconURL: SERVER_ICON }).setTimestamp()
          ]}).catch(() => {});
        }
      } catch (e) { console.error("Erro ao remover cargo temp:", e); }
    } else { keep.push(entry); }
  }
  saveTempRoles(keep);
}

async function checkStaleTickets() {
  const now = Date.now();
  const TWO_HOURS = 2 * 60 * 60 * 1000;
  const data = loadTicketData();

  for (const [channelId, info] of data.entries()) {
    if (info.reminderSent) continue;
    if (!info.createdAt) continue;
    if (now - info.createdAt < TWO_HOURS) continue;

    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) continue;
    const ch = guild.channels.cache.get(channelId);
    if (!ch) continue;

    const staffMentions = STAFF_ROLES.map(id => `<@&${id}>`).join(" ");

    const reminderContainer = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `## ⏰ Ticket Aguardando Atendimento\n\n` +
        `<@${info.openerId}> está aguardando há **2 horas** sem resposta!\n\n` +
        `> Por favor, atenda ou feche este ticket.`
      ))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`));

    await ch.send({
      content: `<@${info.openerId}> ${staffMentions}`,
      components: [reminderContainer],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: { parse: ["users", "roles"] },
    }).catch(() => {});

    const opener = await guild.members.fetch(info.openerId).catch(() => null);
    if (opener) {
      const dmContainer = new ContainerBuilder()
        .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ⏰ Seu Ticket Ainda Não Foi Atendido`))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `**Ticket:** \`${info.ticketName}\`\n**Tipo:** ${info.label}\n\nSeu ticket está aberto há **2 horas** sem resposta.\nAcesse o canal para continuar ou aguarde a staff.`
        ))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`));
      await opener.send({ components: [dmContainer], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
    }

    info.reminderSent = true;
    saveTicketData(data);
  }
}

function getBRT() {
  return new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const handled        = new Set();
const editHandled    = new Set();
const deleteHandled  = new Set();
const cmdCooldown    = new Set();
const ticketOpening  = new Set();
const claimedTickets = new Set();
const ticketData     = loadTicketData();
const ratedTickets   = new Set();

const EMOJI_REGEX      = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
const MAX_EMOJIS       = 10;
const FAST_MSG_LIMIT   = 5;
const FAST_MSG_WINDOW  = 5000;
const IMAGE_LIMIT      = 3;
const IMAGE_WINDOW     = 10000;
const MAX_MENTIONS     = 5;
const DUP_WINDOW       = 30_000;

const spamTracker = new Map();
const pendingConfirm = new Map();

function getSpam(userId) {
  if (!spamTracker.has(userId)) spamTracker.set(userId, { msgs: [], images: [], lastContent: "", lastContentTime: 0, lastContentCount: 0, punished: false });
  return spamTracker.get(userId);
}

function isStaff(member) {
  if (!member) return false;
  return STAFF_ROLES.some(id => member.roles.cache.has(id)) || member.permissions.has(PermissionFlagsBits.Administrator);
}

async function handleAntiSpam(message) {
  if (message.author.bot || !message.guild) return false;
  const member = message.member;
  if (!member) return false;
  if (isStaff(member)) return false;

  const now     = Date.now();
  const content = message.content ?? "";
  const userId  = message.author.id;
  const data    = getSpam(userId);
  const logCh   = message.guild.channels.cache.get(LOG_CHANNEL_ID);

  async function punish(reason, emoji) {
    if (data.punished) return true;
    data.punished = true;
    setTimeout(() => { data.punished = false; }, 8000);

    await message.delete().catch(() => {});
    await member.timeout(5 * 60_000, reason).catch(() => {});
    const w = await message.channel.send({
      content: `<@${userId}> 🚫 **${reason}** — você foi silenciado por **5 minutos**.`
    }).catch(() => null);
    if (w) setTimeout(() => w.delete().catch(() => {}), 8000);

    logCh?.send({ embeds: [new EmbedBuilder()
      .setTitle(`${emoji} AutoMod — ${reason}`)
      .setThumbnail(message.author.displayAvatarURL({ size: 128 }))
      .addFields(
        { name: "Usuário", value: `<@${userId}> (\`${message.author.tag}\`)`, inline: true },
        { name: "Canal",   value: `<#${message.channel.id}>`, inline: true },
        { name: "Conteúdo", value: content.slice(0, 500) || "[sem texto]", inline: false },
      )
      .setColor(0xFEE75C).setFooter({ text: "PAFO — AutoMod", iconURL: SERVER_ICON }).setTimestamp()
    ]}).catch(() => {});
    return true;
  }

  for (const pattern of BLACKLIST_PATTERNS) {
    if (pattern.test(content)) {
      await message.delete().catch(() => {});
      await member.timeout(10 * 60_000, "Mensagem na blacklist").catch(() => {});
      logCh?.send({ embeds: [new EmbedBuilder()
        .setTitle("🚫 AutoMod — Blacklist")
        .setThumbnail(message.author.displayAvatarURL({ size: 128 }))
        .addFields(
          { name: "Usuário", value: `<@${userId}> (\`${message.author.tag}\`)`, inline: true },
          { name: "Canal",   value: `<#${message.channel.id}>`, inline: true },
          { name: "Conteúdo", value: content.slice(0, 500), inline: false },
        )
        .setColor(0xED4245).setFooter({ text: "PAFO — AutoMod", iconURL: SERVER_ICON }).setTimestamp()
      ]}).catch(() => {});
      const w = await message.channel.send({
        content: `<@${userId}> 🚫 Sua mensagem foi removida por conter conteúdo proibido.`
      }).catch(() => null);
      if (w) setTimeout(() => w.delete().catch(() => {}), 8000);
      return true;
    }
  }

  const mentionCount = (message.mentions.users.size + message.mentions.roles.size);
  if (mentionCount >= MAX_MENTIONS) return punish(`Mass Mentions detectado (${mentionCount} menções)`, "📣");

  if (!EMOJI_FREE_CHANNELS.has(message.channel.id)) {
    const emojiMatches = content.match(EMOJI_REGEX);
    if (emojiMatches && emojiMatches.length > MAX_EMOJIS) {
      return punish(`Emoji Spam detectado (${emojiMatches.length} emojis)`, "😵");
    }
  }

  if (content.length > 5) {
    if (content === data.lastContent && (now - data.lastContentTime) < DUP_WINDOW) {
      data.lastContentCount++;
      if (data.lastContentCount >= 2) {
        data.lastContentCount = 0;
        data.lastContent = "";
        return punish("Texto duplicado detectado", "🔁");
      }
    } else {
      data.lastContent = content;
      data.lastContentTime = now;
      data.lastContentCount = 0;
    }
  }

  data.msgs.push(now);
  data.msgs = data.msgs.filter(t => now - t < FAST_MSG_WINDOW);
  if (data.msgs.length >= FAST_MSG_LIMIT) {
    data.msgs = [];
    return punish("Fast Message Spam detectado", "⚡");
  }

  if (message.attachments.size > 0) {
    data.images.push(now);
    data.images = data.images.filter(t => now - t < IMAGE_WINDOW);
    if (data.images.length >= IMAGE_LIMIT) {
      data.images = [];
      return punish("Image Spam detectado", "🖼️");
    }
  }

  return false;
}

client.on("guildMemberAdd", async (member) => {
  const ch = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (ch) await sendWelcome(ch, member);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  const member = message.member;

  if (message.channel.id === PENEIRA_CHANNEL_ID && !isStaff(member)) {
    if (!message.content.includes("roblox.com/")) {
      await message.delete().catch(() => {});
      const w = await message.channel.send(`<@${message.author.id}> ❌ Neste canal, você só pode enviar mensagens que contenham um link do Roblox.`).catch(() => null);
      if (w) setTimeout(() => w.delete().catch(() => {}), 10000);
      return;
    }
  }

  if (/(tiktok\.com|vt\.tiktok\.com)/i.test(message.content) && !isStaff(member)) {
    await message.delete().catch(() => {});
    const w = await message.channel.send(`<@${message.author.id}> ❌ Links do TikTok não são permitidos neste servidor.`).catch(() => null);
    if (w) setTimeout(() => w.delete().catch(() => {}), 8000);
    const logCh = message.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logCh) {
      const logMsg = new ContainerBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `### 📝 Mensagem deletada — Link TikTok\n` +
          `**Usuário:** <@${message.author.id}>\n` +
          `**Canal:** <#${message.channel.id}>\n` +
          `**Conteúdo:**\n\`\`\`\n${message.content.slice(0, 500)}\n\`\`\``
        ));
      await logCh.send({ components: [logMsg], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
    }
    return;
  }

  const blocked = await handleAntiSpam(message);
  if (blocked) return;

  const inviteRegex = /discord(?:\.gg|app\.com\/invite|\.com\/invite)\/[a-zA-Z0-9]+/i;
  if (inviteRegex.test(message.content) && member) {
    if (!isStaff(member)) {
      const allowedChannels = [FREEAGENT_CHANNEL_ID, SCOUTING_CHANNEL_ID, PARCERIA_CHANNEL_ID, FREELINKS_CHANNEL_ID, LEAGUES_CHANNEL_ID];
      const isTicketChannel = message.channel.name?.startsWith("ticket-");
      if (!allowedChannels.includes(message.channel.id) && !isTicketChannel) {
        await message.delete().catch(() => {});
        try {
          const dmMsg = new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `## 🚫 Convite não permitido!\n\n` +
              `<@${message.author.id}>, você **não pode enviar convites** neste canal.\n\n` +
              `> 🔒 Para manter a organização do servidor **PAFO**, links de convite são **restritos** a canais específicos ou precisam de autorização da staff.\n\n` +
              `> ❓ Caso tenha dúvidas ou queira solicitar permissão, entre em contato com a equipe de moderação em <#1449068500567068804>.`
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Sistema de Moderação`));
          await message.author.send({ components: [dmMsg], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
        } catch {}
        const logCh = message.guild.channels.cache.get(LOG_CHANNEL_ID);
        if (logCh) {
          const logMsg = new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `### 📝 Mensagem deletada — Convite bloqueado\n` +
              `**Usuário:** <@${message.author.id}> (\`${message.author.tag}\`)\n` +
              `**Canal:** <#${message.channel.id}>\n` +
              `**Conteúdo:**\n\`\`\`\n${message.content.slice(0, 500)}\n\`\`\`\n` +
              `**Data:** ${getBRT()}`
            ));
          await logCh.send({ components: [logMsg], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
        }
        return;
      }
    }
  }

  if (message.channel.id === FREEAGENT_CHANNEL_ID && !isStaff(member)) {
    if (!message.content.trim().toLowerCase().startsWith("!freeagent")) {
      const content = message.content.trim();
      if (content.length >= 3) {
        const tipo = await classifyFreeAgentMessage(content);
        if (tipo === "TIME") {
          await message.delete().catch(() => {});
          const w = await message.channel.send({
            content: `<@${message.author.id}> ❌ Divulgações de **times/vagas** não são permitidas aqui! Este canal é para **jogadores se anunciarem** como free agents.\n> 👉 Use o canal <#${SCOUTING_CHANNEL_ID}> para divulgar seu time.`
          }).catch(() => null);
          if (w) setTimeout(() => w.delete().catch(() => {}), 10_000);
          const logCh = message.guild.channels.cache.get(LOG_CHANNEL_ID);
          logCh?.send({ embeds: [new EmbedBuilder()
            .setTitle("🚫 Scouting bloqueado no free-agents")
            .setThumbnail(message.author.displayAvatarURL({ size: 128 }))
            .addFields(
              { name: "Usuário", value: `<@${message.author.id}>`, inline: true },
              { name: "Conteúdo", value: content.slice(0, 500), inline: false },
            )
            .setColor(0xED4245).setFooter({ text: "PAFO — IA Filter", iconURL: SERVER_ICON }).setTimestamp()
          ]}).catch(() => {});
          return;
        }
      }
    }
  }

  if (message.content.trim().toLowerCase().startsWith("!freeagent")) {
    if (!member) return;
    const cdKey = `fa_${member.id}`;
    if (cmdCooldown.has(cdKey)) {
      const w = await message.reply({ content: "⏳ Aguarde antes de postar outro anúncio." }).catch(() => null);
      setTimeout(() => w?.delete().catch(() => {}), 5000);
      return;
    }
    const raw  = message.content.trim().slice("!freeagent".length).trim();
    const args = raw.split(",").map(s => s.trim());
    if (args.length < 5 || args.some(a => !a)) {
      const w = await message.reply({
        content: "❌ **Uso correto:**\n`!freeagent <experiências>, <habilidades>, <posição>, <dispositivo>, <observações>`\n\n**Exemplo:**\n`!freeagent 5 anos de mps, incrivel, st cdm cm, PC, bom p krl!`"
      }).catch(() => null);
      setTimeout(() => w?.delete().catch(() => {}), 10_000);
      return;
    }
    const [experiencias, habilidades, posicao, dispositivo, observacoes] = args;
    cmdCooldown.add(cdKey);
    setTimeout(() => cmdCooldown.delete(cdKey), 30_000);
    await message.delete().catch(() => {});
    const faCh = message.guild.channels.cache.get(FREEAGENT_CHANNEL_ID);
    if (!faCh) return;
    const buildFa = (msgId) => new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎮 Free Agent Disponível`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`🧑 ***JOGADOR***\n→ <@${member.id}>`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`⭐ ***EXPERIÊNCIAS***\n→ ${experiencias}`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`⚡ ***HABILIDADES***\n→ ${habilidades}`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`🎯 ***POSIÇÃO***\n→ ${posicao}`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`📱 ***DISPOSITIVO***\n→ ${dispositivo}`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`📝 ***OBSERVAÇÕES***\n→ ${observacoes}`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Free Agent`))
      .addActionRowComponents(new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`fac_${member.id}_${msgId}`).setLabel("Contratar").setStyle(ButtonStyle.Success).setEmoji("🤝"),
        new ButtonBuilder().setCustomId(`fas_${member.id}_${msgId}`).setLabel("Saber Mais").setStyle(ButtonStyle.Secondary).setEmoji("📋")
      ));
    const sent = await faCh.send({ components: [buildFa("00000000000000000")], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
    if (sent) await sent.edit({ components: [buildFa(sent.id)], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
    return;
  }

  if (handled.has(message.id)) return;
  handled.add(message.id);
  setTimeout(() => handled.delete(message.id), 10_000);

  if (!isStaff(member)) return;

  const content = message.content.trim().toLowerCase();
  const cmds = [
    "!verify","!rules","!booster","!info","!welcome","!loja","!ticket","!friendlys",
    "!olheiro-rules","!scrimhoster-rules","!drops","!bio-reward","!parceria",
  ];
  if (!cmds.includes(content)) return;

  const ck = `${message.channel.id}_${content}`;
  if (cmdCooldown.has(ck)) return;
  cmdCooldown.add(ck);
  setTimeout(() => cmdCooldown.delete(ck), 5000);
  await message.delete().catch(() => {});

  const map = {
    "!verify":           () => cmdVerify(message.channel),
    "!rules":            () => cmdRules(message.channel),
    "!booster":          () => cmdBooster(message.channel),
    "!info":             () => cmdInfo(message.channel),
    "!welcome":          () => sendWelcome(message.channel, message.member),
    "!loja":             () => cmdLoja(message.channel),
    "!ticket":           () => cmdTicket(message.channel),
    "!friendlys":        () => cmdFriendlys(message.channel),
    "!olheiro-rules":    () => cmdOlheiroRules(message.channel),
    "!scrimhoster-rules":() => cmdScrimHosterRules(message.channel),
    "!drops":            () => cmdDrops(message.channel),
    "!bio-reward":       () => cmdBioReward(message.channel),
    "!parceria":         () => cmdParceria(message.channel),
  };
  return map[content]?.();
});

client.on("messageDelete", async (message) => {
  if (!message.guild || message.author?.bot) return;
  if (deleteHandled.has(message.id)) return;
  deleteHandled.add(message.id);
  setTimeout(() => deleteHandled.delete(message.id), 10_000);

  const logCh = message.guild.channels.cache.get(LOG_CHANNEL_ID);
  if (!logCh) return;
  if (!message.content && message.attachments.size === 0) return;

  const authorTag  = message.author?.tag ?? "Desconhecido";
  const authorId   = message.author?.id  ?? "Desconhecido";
  const channelId  = message.channel?.id ?? "Desconhecido";
  const content    = message.content ? message.content.slice(0, 1000) : "[sem texto]";
  const avatarURL  = message.author?.displayAvatarURL({ size: 128 }) ?? null;

  const embed = new EmbedBuilder()
    .setAuthor({ name: `${authorTag} (${authorId})`, iconURL: avatarURL ?? undefined })
    .setTitle("🗑️ Mensagem Deletada")
    .addFields(
      { name: "Canal", value: `<#${channelId}>`, inline: true },
      { name: "Autor", value: `<@${authorId}>`, inline: true },
      { name: "Conteúdo", value: `\`\`\`${content}\`\`\``, inline: false },
    )
    .setColor(0xED4245)
    .setFooter({ text: `ID da mensagem: ${message.id} • ${getBRT()}` })
    .setTimestamp();

  if (avatarURL) embed.setThumbnail(avatarURL);

  if (message.attachments.size > 0) {
    const urls = Array.from(message.attachments.values()).map(a => a.url).join("\n");
    embed.addFields({ name: "Anexos", value: urls.slice(0, 1024), inline: false });
  }

  await logCh.send({ embeds: [embed] }).catch(() => {});
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (!newMessage.guild || newMessage.author?.bot) return;
  if (oldMessage.content === newMessage.content) return;
  if (editHandled.has(newMessage.id)) return;
  editHandled.add(newMessage.id);
  setTimeout(() => editHandled.delete(newMessage.id), 10_000);

  const logCh = newMessage.guild.channels.cache.get(LOG_CHANNEL_ID);
  if (!logCh) return;

  const authorTag = newMessage.author?.tag ?? "Desconhecido";
  const authorId  = newMessage.author?.id  ?? "Desconhecido";
  const channelId = newMessage.channel?.id ?? "Desconhecido";
  const avatarURL = newMessage.author?.displayAvatarURL({ size: 128 }) ?? null;

  const oldContent = oldMessage.content ? oldMessage.content.slice(0, 500) : "[não disponível]";
  const newContent = newMessage.content ? newMessage.content.slice(0, 500) : "[sem texto]";

  const embed = new EmbedBuilder()
    .setAuthor({ name: `${authorTag} (${authorId})`, iconURL: avatarURL ?? undefined })
    .setTitle("✏️ Mensagem Editada")
    .addFields(
      { name: "Canal", value: `<#${channelId}>`, inline: true },
      { name: "Autor", value: `<@${authorId}>`, inline: true },
      { name: "Antes", value: `\`\`\`${oldContent}\`\`\``, inline: false },
      { name: "Depois", value: `\`\`\`${newContent}\`\`\``, inline: false },
    )
    .setColor(0xFEE75C)
    .setFooter({ text: `ID da mensagem: ${newMessage.id} • ${getBRT()}` })
    .setTimestamp();

  if (avatarURL) embed.setThumbnail(avatarURL);

  const jumpBtn = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setURL(newMessage.url).setLabel("Ver Mensagem").setStyle(ButtonStyle.Link).setEmoji("🔗")
  );

  await logCh.send({ embeds: [embed], components: [jumpBtn] }).catch(() => {});
});

async function classifyFreeAgentMessage(content) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 10,
        system: "Você é um classificador de mensagens de Discord de um servidor de futebol no Roblox (MPS/TCS/Soccer). Responda APENAS com uma palavra: JOGADOR ou TIME.\n\nJOGADOR = o próprio jogador se anunciando como free agent, procurando time, ou descrevendo suas habilidades. Exemplos: 'f/a cb', 'procuro time sou mc bom', 'sou gk disponível', 'f/a pe md', 'disponível sou um bom st'.\n\nTIME = um time/clube recrutando jogadores, divulgando vagas ou chamando para peneira. Exemplos: 'VAGAS PARA O BARCELONA', 'Real Madrid recruta', 'nosso time procura CB', 'peneira aberta', 'clique para entrar no time'.",
        messages: [{ role: "user", content: `Classifique esta mensagem: "${content.slice(0, 300)}"` }]
      })
    });
    const data = await response.json();
    const result = data.content?.[0]?.text?.trim().toUpperCase() ?? "JOGADOR";
    return result.includes("TIME") ? "TIME" : "JOGADOR";
  } catch {
    return "JOGADOR";
  }
}

async function logPunishment(guild, { tipo, emoji, staffId, membroTag, membroId, motivo, extra = "" }) {
  const punCh = guild.channels.cache.get(PUNITIONS_CHANNEL_ID);
  if (!punCh) return;

  const staff  = await guild.members.fetch(staffId).catch(() => null);
  const membro = await guild.members.fetch(membroId).catch(() => null);

  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${staff?.user?.tag ?? staffId}`,
      iconURL: staff?.user?.displayAvatarURL({ size: 128 }) ?? undefined,
    })
    .setTitle(`${emoji} ${tipo}`)
    .setDescription(`• O usuário foi punido no servidor PAFO.`)
    .addFields(
      { name: "Staff",  value: `<@${staffId}>`,                    inline: false },
      { name: "Membro", value: `${membroTag}`,                     inline: false },
      { name: "Punição",value: `${tipo} • Sistema de Moderação`,   inline: false },
    );

  if (motivo) embed.addFields({ name: "Motivo", value: motivo, inline: false });
  if (extra)  embed.addFields({ name: "Info", value: extra, inline: false });

  if (membro) embed.setThumbnail(membro.user.displayAvatarURL({ size: 128 }));

  embed.setColor(
    tipo.includes("Banimento")    ? 0xED4245 :
    tipo.includes("Silenciamento")? 0xFEE75C :
    tipo.includes("Kick")         ? 0xFFA500 :
    tipo.includes("Advertência")  ? 0xFF6B35 : 0x5865F2
  ).setTimestamp().setFooter({ text: "PAFO — Sistema de Moderação", iconURL: SERVER_ICON });

  await punCh.send({ embeds: [embed] }).catch(() => {});
}

function buildConfirmContainer({ emoji, title, description, targetId, motivo, extra }) {
  let text = `## ${emoji} ${title}\n\n${description}\n\n**Alvo:** <@${targetId}>\n**Motivo:** ${motivo ?? "Sem motivo"}`;
  if (extra) text += `\n**Extra:** ${extra}`;
  
  return new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(text))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Sistema de Moderação`));
}

client.on("interactionCreate", (i) => handleInteraction(i).catch(e => {
  if (e?.code === 10062 || e?.message?.includes("Unknown interaction")) return;
  console.error("Erro interaction:", e);
}));

async function handleInteraction(interaction) {

  // --- SISTEMA DE RESGATE DE DROP (TODOS TEMPORÁRIOS) ---
  if (interaction.isStringSelectMenu() && interaction.customId.startsWith("drop_claim_")) {
    const userId = interaction.customId.replace("drop_claim_", "");
    if (interaction.user.id !== userId) return interaction.reply({ content: "❌ Este drop não é seu.", flags: MessageFlags.Ephemeral });

    await interaction.deferUpdate();
    const roleId = interaction.values[0];
    
    const guild = await client.guilds.fetch(GUILD_ID).catch(() => null);
    if (!guild) return;
    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) return;

    try {
      // 1. Adiciona o cargo ao membro
      await member.roles.add(roleId);

      // 2. Regista no sistema temporário (5 dias)
      const dias = 5;
      const expiresAt = Date.now() + dias * 86_400_000; // 5 dias em milissegundos
      
      // Carrega os dados atuais e remove entradas antigas do mesmo utilizador para esse cargo
      const data = loadTempRoles().filter(e => !(e.userId === userId && e.roleId === roleId));
      
      data.push({ 
        userId, 
        roleId, 
        guildId: GUILD_ID, 
        expiresAt, 
        days: dias 
      });
      
      saveTempRoles(data);

      // 3. Resposta de confirmação
      const confirmC = new ContainerBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `## ✅ Drop Resgatado com Sucesso!\n\n` +
          `Você recebeu o cargo <@&${roleId}>.\n` +
          `> ⏳ **Duração:** 5 dias\n` +
          `> ⚠️ O cargo será removido automaticamente após esse período.`
        ))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Drops System`));
      
      await interaction.message.edit({ components: [confirmC], flags: MessageFlags.IsComponentsV2 }).catch(() => {});

    } catch (error) {
      console.error("Erro ao entregar cargo de drop:", error);
      await interaction.followUp({ content: "Houve um erro ao tentar entregar o seu cargo. Contacte um administrador.", flags: MessageFlags.Ephemeral });
    }
    return;
  }

  if (interaction.isChatInputCommand() && interaction.commandName === "setroletemp") {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator))
      return interaction.reply({ content: "❌ Sem permissão.", flags: MessageFlags.Ephemeral });

    const target = interaction.options.getMember("usuario");
    const role   = interaction.options.getRole("cargo");
    const dias   = interaction.options.getInteger("dias");
    if (!target || !role || !dias)
      return interaction.reply({ content: "❌ Parâmetros inválidos.", flags: MessageFlags.Ephemeral });

    await target.roles.add(role).catch(() => {});
    const expiresAt = Date.now() + dias * 86_400_000;
    const data = loadTempRoles().filter(e => !(e.userId === target.id && e.roleId === role.id));
    data.push({ userId: target.id, roleId: role.id, guildId: interaction.guild.id, expiresAt, days: dias });
    saveTempRoles(data);

    const expiresStr = new Date(expiresAt).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
    });

    await interaction.reply({ embeds: [new EmbedBuilder()
      .setTitle("✅ Cargo Temporário Concedido")
      .setDescription(`<@${target.id}> recebeu <@&${role.id}> por **${dias} dia(s)**.\nExpira: \`${expiresStr}\``)
      .setColor(0x57F287).setFooter({ text: "PAFO — Temp Role System", iconURL: SERVER_ICON }).setTimestamp()
    ]});

    interaction.guild.channels.cache.get(LOG_CHANNEL_ID)?.send({ embeds: [new EmbedBuilder()
      .setTitle("⏱️ Cargo Temporário Adicionado")
      .addFields(
        { name: "Membro",  value: `<@${target.id}>`,           inline: true },
        { name: "Cargo",   value: `<@&${role.id}>`,            inline: true },
        { name: "Dias",    value: `${dias}`,                   inline: true },
        { name: "Expira",  value: expiresStr,                  inline: true },
        { name: "Staff",   value: `<@${interaction.user.id}>`, inline: true },
      )
      .setColor(0xFEE75C).setFooter({ text: "PAFO — Temp Role System", iconURL: SERVER_ICON }).setTimestamp()
    ]}).catch(() => {});
    return;
  }

  if (interaction.isChatInputCommand() && interaction.commandName === "ban") {
    const target = interaction.options.getUser("usuario");
    const motivo = interaction.options.getString("motivo") ?? "Sem motivo especificado";
    const dias   = interaction.options.getInteger("dias") ?? 0;

    if (!target) return interaction.reply({ content: "❌ Usuário não encontrado.", flags: MessageFlags.Ephemeral });

    const existingBan = await interaction.guild.bans.fetch(target.id).catch(() => null);
    if (existingBan) {
      return interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle("⚠️ Usuário Já Banido")
        .setDescription(`**${target.tag}** já está banido do servidor!`)
        .setColor(0xFEE75C).setTimestamp()
      ], flags: MessageFlags.Ephemeral });
    }
    const targetMember = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (targetMember?.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: "❌ Não é possível banir um administrador.", flags: MessageFlags.Ephemeral });
    }

    const c = buildConfirmContainer({
      emoji: "🔨", title: "Confirmar Banimento",
      description: "Você tem certeza que deseja banir este usuário?",
      targetId: target.id, motivo,
      extra: dias > 0 ? `Deletar mensagens dos últimos ${dias} dia(s)` : null,
    });
    
    c.addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`confirm_ban_${target.id}_${dias}_${Date.now()}`).setLabel("Confirmar Ban").setStyle(ButtonStyle.Danger).setEmoji("🔨"),
      new ButtonBuilder().setCustomId("cancel_action").setLabel("Cancelar").setStyle(ButtonStyle.Secondary).setEmoji("❌"),
    ));

    pendingConfirm.set(`ban_${target.id}_${interaction.user.id}`, { motivo, dias, targetTag: target.tag });
    return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
  }

  if (interaction.isButton() && interaction.customId.startsWith("confirm_ban_")) {
    const parts    = interaction.customId.split("_");
    const targetId = parts[2];
    const dias     = parseInt(parts[3]) || 0;
    const key      = `ban_${targetId}_${interaction.user.id}`;
    const stored   = pendingConfirm.get(key);
    if (!stored) return interaction.update({ content: "⚠️ Ação expirada ou você não tem permissão para confirmar.", embeds: [], components: [] });
    pendingConfirm.delete(key);

    const { motivo, targetTag } = stored;
    const target = await interaction.guild.members.fetch(targetId).catch(() => null);

    try {
      const dm = new ContainerBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `## 🔨 Você foi banido do servidor PAFO\n\n` +
          `**Motivo:** ${motivo}\n**Staff:** <@${interaction.user.id}>\n\n` +
          `Se acredita que o ban foi injusto, use o servidor de appeal:\n🔗 ${APPEAL_SERVER}`
        ))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Sistema de Moderação`));
      await (target?.send ?? interaction.guild.members.cache.get(targetId)?.send)?.({ components: [dm], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
    } catch {}

    try {
      await interaction.guild.members.ban(targetId, { reason: `${motivo} | Staff: ${interaction.user.tag}`, deleteMessageDays: dias });
    } catch (e) {
      return interaction.update({ content: `❌ Erro ao banir: ${e.message}`, embeds: [], components: [] });
    }

    const resultC = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `## 🔨 Usuário Banido\n\n**Usuário:** <@${targetId}> (\`${targetId}\`)\n**Motivo:** ${motivo}\n**Staff:** <@${interaction.user.id}>`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# Data: ${getBRT()}`));

    await interaction.update({ components: [resultC], flags: MessageFlags.IsComponentsV2 });
    await logPunishment(interaction.guild, {
      tipo: "Banimento Aplicado!", emoji: "🔨",
      staffId: interaction.user.id, membroTag: targetTag, membroId: targetId, motivo
    });
    return;
  }

  if (interaction.isButton() && interaction.customId === "cancel_action") {
    return interaction.update({ content: "❌ Ação cancelada.", embeds: [], components: [] });
  }

  if (interaction.isChatInputCommand() && interaction.commandName === "unban") {
    const userId = interaction.options.getString("userid")?.trim();
    const motivo = interaction.options.getString("motivo") ?? "Sem motivo especificado";

    try {
      const ban = await interaction.guild.bans.fetch(userId).catch(() => null);
      if (!ban) return interaction.reply({ content: "❌ Esse usuário não está banido.", flags: MessageFlags.Ephemeral });
      await interaction.guild.members.unban(userId, motivo);
    } catch (e) {
      return interaction.reply({ content: `❌ Erro ao desbanir: ${e.message}`, flags: MessageFlags.Ephemeral });
    }

    await interaction.reply({ embeds: [new EmbedBuilder()
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ size: 128 }) })
      .setTitle("✅ Usuário Desbanido")
      .addFields(
        { name: "ID",     value: userId, inline: true },
        { name: "Motivo", value: motivo, inline: false },
        { name: "Staff",  value: `<@${interaction.user.id}>`, inline: true },
      )
      .setColor(0x57F287).setTimestamp()
    ]});

    interaction.guild.channels.cache.get(LOG_CHANNEL_ID)?.send({ embeds: [new EmbedBuilder()
      .setTitle("✅ Unban Aplicado")
      .addFields(
        { name: "ID",     value: userId, inline: true },
        { name: "Motivo", value: motivo, inline: false },
        { name: "Staff",  value: `<@${interaction.user.id}>`, inline: true },
      )
      .setColor(0x57F287).setFooter({ text: "PAFO — Sistema de Moderação", iconURL: SERVER_ICON }).setTimestamp()
    ]}).catch(() => {});
    return;
  }

  if (interaction.isChatInputCommand() && interaction.commandName === "mute") {
    const target  = interaction.options.getMember("usuario");
    const minutos = interaction.options.getInteger("minutos");
    const motivo  = interaction.options.getString("motivo") ?? "Sem motivo especificado";

    if (!target) return interaction.reply({ content: "❌ Membro não encontrado.", flags: MessageFlags.Ephemeral });

    if (target.communicationDisabledUntil && target.communicationDisabledUntil > new Date()) {
      const remaining = Math.ceil((target.communicationDisabledUntil - Date.now()) / 60_000);
      return interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle("⚠️ Membro Já Silenciado")
        .setDescription(`<@${target.id}> **já está silenciado!**\nTempo restante: **${remaining} minuto(s)**`)
        .setColor(0xFEE75C).setTimestamp()
      ], flags: MessageFlags.Ephemeral });
    }
    if (target.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: "❌ Não é possível silenciar um administrador.", flags: MessageFlags.Ephemeral });
    }

    const c = buildConfirmContainer({
      emoji: "🔇", title: "Confirmar Silenciamento",
      description: "Você tem certeza que deseja silenciar este membro?",
      targetId: target.id, motivo,
      extra: `Duração: **${minutos} minuto(s)**`,
    });
    
    c.addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`confirm_mute_${target.id}_${minutos}_${Date.now()}`).setLabel("Confirmar Mute").setStyle(ButtonStyle.Danger).setEmoji("🔇"),
      new ButtonBuilder().setCustomId("cancel_action").setLabel("Cancelar").setStyle(ButtonStyle.Secondary).setEmoji("❌"),
    ));

    pendingConfirm.set(`mute_${target.id}_${interaction.user.id}`, { motivo, minutos, targetTag: target.user.tag });
    return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
  }

  if (interaction.isButton() && interaction.customId.startsWith("confirm_mute_")) {
    const parts    = interaction.customId.split("_");
    const targetId = parts[2];
    const minutos  = parseInt(parts[3]);
    const key      = `mute_${targetId}_${interaction.user.id}`;
    const stored   = pendingConfirm.get(key);
    if (!stored) return interaction.update({ content: "⚠️ Ação expirada ou sem permissão.", embeds: [], components: [] });
    pendingConfirm.delete(key);

    const { motivo, targetTag } = stored;
    const target = await interaction.guild.members.fetch(targetId).catch(() => null);

    try {
      await target.timeout(minutos * 60_000, `${motivo} | Staff: ${interaction.user.tag}`);
    } catch (e) {
      return interaction.update({ content: `❌ Erro ao silenciar: ${e.message}`, embeds: [], components: [] });
    }

    const resultC = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `## 🔇 Membro Silenciado\n\n**Membro:** <@${targetId}>\n**Duração:** ${minutos} minuto(s)\n**Motivo:** ${motivo}\n**Staff:** <@${interaction.user.id}>`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# Data: ${getBRT()}`));

    await interaction.update({ components: [resultC], flags: MessageFlags.IsComponentsV2 });
    await logPunishment(interaction.guild, {
      tipo: "Silenciamento aplicado", emoji: "🔇",
      staffId: interaction.user.id, membroTag: targetTag, membroId: targetId,
      motivo, extra: `Duração: ${minutos} minuto(s)`
    });
    return;
  }

  if (interaction.isChatInputCommand() && interaction.commandName === "unmute") {
    const target = interaction.options.getMember("usuario");
    const motivo = interaction.options.getString("motivo") ?? "Sem motivo especificado";

    if (!target) return interaction.reply({ content: "❌ Membro não encontrado.", flags: MessageFlags.Ephemeral });

    if (!target.communicationDisabledUntil || target.communicationDisabledUntil <= new Date()) {
      return interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle("⚠️ Membro Não Silenciado")
        .setDescription(`<@${target.id}> **não está silenciado!**`)
        .setColor(0xFEE75C).setTimestamp()
      ], flags: MessageFlags.Ephemeral });
    }

    try {
      await target.timeout(null, `${motivo} | Staff: ${interaction.user.tag}`);
    } catch (e) {
      return interaction.reply({ content: `❌ Erro ao remover silenciamento: ${e.message}`, flags: MessageFlags.Ephemeral });
    }

    await interaction.reply({ embeds: [new EmbedBuilder()
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ size: 128 }) })
      .setTitle("🔊 Silenciamento Removido")
      .setThumbnail(target.user.displayAvatarURL({ size: 128 }))
      .addFields(
        { name: "Membro", value: `<@${target.id}>`, inline: true },
        { name: "Motivo", value: motivo, inline: false },
        { name: "Staff",  value: `<@${interaction.user.id}>`, inline: true },
      )
      .setColor(0x57F287).setTimestamp()
    ]});

    interaction.guild.channels.cache.get(LOG_CHANNEL_ID)?.send({ embeds: [new EmbedBuilder()
      .setTitle("🔊 Unmute Aplicado")
      .addFields(
        { name: "Membro", value: `<@${target.id}>`, inline: true },
        { name: "Motivo", value: motivo, inline: false },
        { name: "Staff",  value: `<@${interaction.user.id}>`, inline: true },
      )
      .setColor(0x57F287).setFooter({ text: "PAFO — Sistema de Moderação", iconURL: SERVER_ICON }).setTimestamp()
    ]}).catch(() => {});
    return;
  }

  if (interaction.isChatInputCommand() && interaction.commandName === "warn") {
    const target = interaction.options.getMember("usuario");
    const motivo = interaction.options.getString("motivo");

    if (!target) return interaction.reply({ content: "❌ Membro não encontrado.", flags: MessageFlags.Ephemeral });
    if (target.permissions.has(PermissionFlagsBits.Administrator))
      return interaction.reply({ content: "❌ Não é possível advertir um administrador.", flags: MessageFlags.Ephemeral });
    if (target.id === interaction.user.id)
      return interaction.reply({ content: "❌ Você não pode se advertir.", flags: MessageFlags.Ephemeral });

    const warns = loadWarns();
    if (!warns[target.id]) warns[target.id] = [];
    warns[target.id].push({ motivo, staffId: interaction.user.id, data: getBRT() });
    saveWarns(warns);
    const warnCount = warns[target.id].length;

    if (warnCount >= 3) {
      const banRole = interaction.guild.roles.cache.get(WARN_ROLES[2]);
      if (banRole) await target.roles.add(banRole).catch(() => {});
      try {
        const dm = new ContainerBuilder()
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(
            `## 🔨 Você foi banido do servidor PAFO\n\n` +
            `**Motivo:** 3ª Advertência — ${motivo}\n**Staff:** <@${interaction.user.id}>\n\n` +
            `Se acredita que o ban foi injusto:\n🔗 ${APPEAL_SERVER}`
          ))
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Sistema de Moderação`));
        await target.send({ components: [dm], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
      } catch {}
      await interaction.guild.members.ban(target.id, { reason: `3ª Advertência: ${motivo} | Staff: ${interaction.user.tag}` }).catch(() => {});
      
      const c = new ContainerBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `## 🔨 3ª Advertência — Banimento Aplicado\n\n**Membro:** <@${target.id}>\n**Motivo:** ${motivo}\n**Staff:** <@${interaction.user.id}>`
        ))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# Data: ${getBRT()}`));
      await interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });

      await logPunishment(interaction.guild, {
        tipo: "Banimento Aplicado! (3ª Adv)", emoji: "🔨",
        staffId: interaction.user.id, membroTag: target.user.tag, membroId: target.id,
        motivo: `3ª Advertência: ${motivo}`
      });
      return;
    }

    const warnRoleId = WARN_ROLES[warnCount - 1];
    const warnRole = interaction.guild.roles.cache.get(warnRoleId);
    if (warnCount > 1) {
      const prevRole = interaction.guild.roles.cache.get(WARN_ROLES[warnCount - 2]);
      if (prevRole) await target.roles.remove(prevRole).catch(() => {});
    }
    if (warnRole) await target.roles.add(warnRole).catch(() => {});
    await target.timeout(3_600_000, `Advertência ${warnCount}: ${motivo} | Staff: ${interaction.user.tag}`).catch(() => {});

    try {
      const dm = new ContainerBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `## ⚠️ Você recebeu uma advertência no servidor PAFO\n\n` +
          `**Motivo:** ${motivo}\n**Staff:** <@${interaction.user.id}>\n**Total de advertências:** ${warnCount}/3\n\n` +
          `> Você também foi silenciado por **1 hora** como consequência.\n` +
          `> ⚠️ Na **3ª advertência** você será **banido** automaticamente.\n-# PAFO — Sistema de Moderação`
        ));
      await target.send({ components: [dm], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
    } catch {}

    const c = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `## ⚠️ Advertência ${warnCount}/3 Aplicada\n\n**Membro:** <@${target.id}>\n**Motivo:** ${motivo}\n**Staff:** <@${interaction.user.id}>\n**Total:** ${warnCount}/3 advertência(s)`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# Data: ${getBRT()}`));
    await interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });

    await logPunishment(interaction.guild, {
      tipo: "Advertência Aplicada", emoji: "⚠️",
      staffId: interaction.user.id, membroTag: target.user.tag, membroId: target.id,
      motivo, extra: `Total: ${warnCount}/3 • Mute: 1h`
    });
    return;
  }

  if (interaction.isChatInputCommand() && interaction.commandName === "unwarn") {
    const target = interaction.options.getMember("usuario");
    const motivo = interaction.options.getString("motivo") ?? "Sem motivo especificado";

    if (!target) return interaction.reply({ content: "❌ Membro não encontrado.", flags: MessageFlags.Ephemeral });

    const warns = loadWarns();
    const count  = warns[target.id]?.length ?? 0;
    if (count === 0)
      return interaction.reply({ content: "❌ Este membro não possui advertências.", flags: MessageFlags.Ephemeral });

    const prevCount = warns[target.id].length;
    warns[target.id].pop();
    const newCount = warns[target.id].length;
    if (newCount === 0) delete warns[target.id];
    if (prevCount >= 1 && prevCount <= 3) {
      const oldRole = interaction.guild.roles.cache.get(WARN_ROLES[prevCount - 1]);
      if (oldRole) await target.roles.remove(oldRole).catch(() => {});
    }
    if (newCount >= 1 && newCount <= 2) {
      const newRole = interaction.guild.roles.cache.get(WARN_ROLES[newCount - 1]);
      if (newRole) await target.roles.add(newRole).catch(() => {});
    }
    saveWarns(warns);

    await interaction.reply({ embeds: [new EmbedBuilder()
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ size: 128 }) })
      .setTitle("✅ Advertência Removida")
      .setThumbnail(target.user.displayAvatarURL({ size: 128 }))
      .addFields(
        { name: "Membro",    value: `<@${target.id}>`, inline: true },
        { name: "Motivo",    value: motivo, inline: false },
        { name: "Staff",     value: `<@${interaction.user.id}>`, inline: true },
        { name: "Restantes", value: `${warns[target.id]?.length ?? 0} advertência(s)`, inline: true },
      )
      .setColor(0x57F287).setTimestamp()
    ]});

    interaction.guild.channels.cache.get(LOG_CHANNEL_ID)?.send({ embeds: [new EmbedBuilder()
      .setTitle("✅ Unwarn Aplicado")
      .addFields(
        { name: "Membro",    value: `<@${target.id}>`, inline: true },
        { name: "Motivo",    value: motivo, inline: false },
        { name: "Staff",     value: `<@${interaction.user.id}>`, inline: true },
        { name: "Restantes", value: `${warns[target.id]?.length ?? 0}`, inline: true },
      )
      .setColor(0x57F287).setFooter({ text: "PAFO — Sistema de Moderação", iconURL: SERVER_ICON }).setTimestamp()
    ]}).catch(() => {});
    return;
  }

  if (interaction.isChatInputCommand() && interaction.commandName === "kick") {
    const target = interaction.options.getMember("usuario");
    const motivo = interaction.options.getString("motivo") ?? "Sem motivo especificado";

    if (!target) return interaction.reply({ content: "❌ Membro não encontrado.", flags: MessageFlags.Ephemeral });
    if (target.permissions.has(PermissionFlagsBits.Administrator))
      return interaction.reply({ content: "❌ Não é possível expulsar um administrador.", flags: MessageFlags.Ephemeral });
    if (target.id === interaction.user.id)
      return interaction.reply({ content: "❌ Você não pode se expulsar.", flags: MessageFlags.Ephemeral });

    const c = buildConfirmContainer({
      emoji: "👢", title: "Confirmar Kick",
      description: "Você tem certeza que deseja expulsar este membro?",
      targetId: target.id, motivo,
    });
    
    c.addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`confirm_kick_${target.id}_${Date.now()}`).setLabel("Confirmar Kick").setStyle(ButtonStyle.Danger).setEmoji("👢"),
      new ButtonBuilder().setCustomId("cancel_action").setLabel("Cancelar").setStyle(ButtonStyle.Secondary).setEmoji("❌"),
    ));

    pendingConfirm.set(`kick_${target.id}_${interaction.user.id}`, { motivo, targetTag: target.user.tag });
    return interaction.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
  }

  if (interaction.isButton() && interaction.customId.startsWith("confirm_kick_")) {
    const parts    = interaction.customId.split("_");
    const targetId = parts[2];
    const key      = `kick_${targetId}_${interaction.user.id}`;
    const stored   = pendingConfirm.get(key);
    if (!stored) return interaction.update({ content: "⚠️ Ação expirada ou sem permissão.", embeds: [], components: [] });
    pendingConfirm.delete(key);

    const { motivo, targetTag } = stored;
    const target = await interaction.guild.members.fetch(targetId).catch(() => null);

    try {
      await target?.kick(`${motivo} | Staff: ${interaction.user.tag}`);
    } catch (e) {
      return interaction.update({ content: `❌ Erro ao expulsar: ${e.message}`, embeds: [], components: [] });
    }

    const resultC = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `## 👢 Membro Expulso\n\n**Membro:** <@${targetId}>\n**Motivo:** ${motivo}\n**Staff:** <@${interaction.user.id}>`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# Data: ${getBRT()}`));

    await interaction.update({ components: [resultC], flags: MessageFlags.IsComponentsV2 });
    await logPunishment(interaction.guild, {
      tipo: "Kick Aplicado", emoji: "👢",
      staffId: interaction.user.id, membroTag: targetTag, membroId: targetId, motivo
    });
    return;
  }

  if (interaction.isChatInputCommand() && interaction.commandName === "lock") {
    const canal = interaction.options.getChannel("canal") ?? interaction.channel;
    const everyoneOverwrite = canal.permissionOverwrites.cache.get(interaction.guild.roles.everyone.id);
    if (everyoneOverwrite?.deny.has(PermissionFlagsBits.SendMessages)) {
      return interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle("⚠️ Canal Já Travado")
        .setDescription(`O canal <#${canal.id}> **já está travado!**`)
        .setColor(0xFEE75C).setTimestamp()
      ], flags: MessageFlags.Ephemeral });
    }
    try {
      await canal.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
    } catch (e) {
      return interaction.reply({ content: `❌ Erro: ${e.message}`, flags: MessageFlags.Ephemeral });
    }

    await interaction.reply({ content: `🔒 Canal <#${canal.id}> travado com sucesso.`, flags: MessageFlags.Ephemeral });

    await canal.send({ embeds: [new EmbedBuilder()
      .setTitle("🔒 Canal Travado")
      .setDescription(`Este canal foi travado por <@${interaction.user.id}>. Nenhum membro pode enviar mensagens.`)
      .setColor(0xED4245).setTimestamp()
    ]}).catch(() => {});
    return;
  }

  if (interaction.isChatInputCommand() && interaction.commandName === "unlock") {
    const canal = interaction.options.getChannel("canal") ?? interaction.channel;
    const everyoneOverwrite = canal.permissionOverwrites.cache.get(interaction.guild.roles.everyone.id);
    if (!everyoneOverwrite?.deny.has(PermissionFlagsBits.SendMessages)) {
      return interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle("⚠️ Canal Já Destravado")
        .setDescription(`O canal <#${canal.id}> **já está destravado!**`)
        .setColor(0xFEE75C).setTimestamp()
      ], flags: MessageFlags.Ephemeral });
    }
    try {
      await canal.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });
    } catch (e) {
      return interaction.reply({ content: `❌ Erro: ${e.message}`, flags: MessageFlags.Ephemeral });
    }

    await interaction.reply({ content: `🔓 Canal <#${canal.id}> destravado com sucesso.`, flags: MessageFlags.Ephemeral });

    await canal.send({ embeds: [new EmbedBuilder()
      .setTitle("🔓 Canal Destravado")
      .setDescription(`Este canal foi destravado por <@${interaction.user.id}>.`)
      .setColor(0x57F287).setTimestamp()
    ]}).catch(() => {});
    return;
  }

  if (interaction.isChatInputCommand() && interaction.commandName === "slowmode") {
    const segundos = interaction.options.getInteger("segundos");
    const canal    = interaction.options.getChannel("canal") ?? interaction.channel;

    if (canal.rateLimitPerUser === segundos) {
      const msg = segundos === 0
        ? `O canal <#${canal.id}> **já está sem slowmode!**`
        : `O canal <#${canal.id}> **já está com slowmode de ${segundos}s!**`;
      return interaction.reply({ embeds: [new EmbedBuilder()
        .setTitle("⚠️ Slowmode Já Configurado")
        .setDescription(msg)
        .setColor(0xFEE75C).setTimestamp()
      ], flags: MessageFlags.Ephemeral });
    }

    try {
      await canal.setRateLimitPerUser(segundos);
    } catch (e) {
      return interaction.reply({ content: `❌ Erro: ${e.message}`, flags: MessageFlags.Ephemeral });
    }

    const desc = segundos === 0
      ? `Modo lento **desativado** em <#${canal.id}>.`
      : `Modo lento de **${segundos}s** ativado em <#${canal.id}>.`;

    await interaction.reply({ embeds: [new EmbedBuilder()
      .setTitle("⏱️ Slowmode Atualizado")
      .setDescription(desc)
      .addFields({ name: "Staff", value: `<@${interaction.user.id}>`, inline: true })
      .setColor(0xFEE75C).setTimestamp()
    ]});
    return;
  }

  if (interaction.isButton() && interaction.customId === "verify_button") {
    if (interaction.member.roles.cache.has(VERIFIED_ROLE_ID))
      return interaction.reply({ content: "✅ Você já está verificado!", flags: MessageFlags.Ephemeral });
    const modal = new ModalBuilder().setCustomId("roblox_modal").setTitle("Verificação Roblox");
    modal.addComponents(new ActionRowBuilder().addComponents(
      new TextInputBuilder().setCustomId("roblox_username").setLabel("Nome de usuário do Roblox")
        .setStyle(TextInputStyle.Short).setPlaceholder("Digite seu usuário do Roblox").setRequired(true).setMaxLength(20)
    ));
    return interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId === "roblox_modal") {
    const robloxUser = interaction.fields.getTextInputValue("roblox_username");
    const member = interaction.member;
    const role   = interaction.guild.roles.cache.get(VERIFIED_ROLE_ID);
    const newNick = `${member.displayName} (@${robloxUser})`.slice(0, 32);
    try {
      await member.setNickname(newNick).catch(() => {});
      if (role) await member.roles.add(role);
      return interaction.reply({ content: `✅ **Verificado com sucesso!** 🎉\n> **Apelido:** \`${newNick}\`\n> Acesso liberado! Bem-vindo(a) à PAFO 🌌`, flags: MessageFlags.Ephemeral });
    } catch {
      return interaction.reply({ content: "❌ Erro ao verificar. Contate um administrador.", flags: MessageFlags.Ephemeral });
    }
  }

  if (interaction.isButton() && interaction.customId === "why_verify") {
    const c = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ❓ Por que verificar?`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `**🔒 Segurança** — Apenas pessoas reais acessam o servidor.\n\n` +
        `**🚫 Anti-Alt** — Impedimos contas alternativas para burlar punições.\n\n` +
        `**🌐 Comunidade Organizada** — Mais segura e agradável para todos.\n\n` +
        `**🛡️ Anti-Spam** — Bots e contas de spam bloqueados antes de causar danos.`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# © 2026 PAFO`));
    return interaction.reply({ components: [c], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
  }

  if (interaction.isStringSelectMenu() && interaction.customId === "ticket_select") {
    const tipo = interaction.values[0];
    const c = new ContainerBuilder()
      .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 📋 Regras do Canal de Tickets`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `> • Abra tickets apenas quando necessário\n` +
        `> • Explique o assunto de forma clara e objetiva\n` +
        `> • Não faça spam nem cobre respostas da staff\n` +
        `> • Tickets sem resposta por **12 horas** serão fechados\n` +
        `> • Mantenha o respeito em todas as situações\n` +
        `> • Em denúncias, envie provas *(prints, vídeos, links)*\n` +
        `> • Em denúncias por racismo, o usuário precisa estar no servidor`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ⚠️ O descumprimento pode resultar em fechamento do ticket ou punições.`))
      .addActionRowComponents(new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`ticket_confirm_${tipo}`).setLabel("Confirmar e Abrir Ticket").setStyle(ButtonStyle.Success).setEmoji("✅"),
        new ButtonBuilder().setCustomId("ticket_cancel").setLabel("Cancelar").setStyle(ButtonStyle.Danger).setEmoji("❌")
      ));
    return interaction.reply({ components: [c], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
  }

  if (interaction.isButton() && interaction.customId === "ticket_cancel")
    return interaction.reply({ content: "❌ Cancelado.", flags: MessageFlags.Ephemeral });

  if (interaction.isButton() && interaction.customId.startsWith("ticket_confirm_")) {
    const tipo   = interaction.customId.replace("ticket_confirm_", "");
    const labels = { duvidas:"Dúvidas", parcerias:"Parcerias", compras:"Compras", denuncias:"Denúncias", outros:"Outros" };
    const label  = labels[tipo] ?? tipo;
    const isCompra = tipo === "compras";
    const guild  = interaction.guild;
    const user   = interaction.user;

    if (ticketOpening.has(user.id))
      return interaction.reply({ content: "⏳ Já existe um ticket sendo criado. Aguarde.", flags: MessageFlags.Ephemeral });

    ticketOpening.add(user.id);
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const num  = loadTicketCount() + 1;
    saveTicketCount(num);
    const ticketName = `ticket-${String(num).padStart(4, "0")}`;

    const overw = [
      { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
      { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
      { id: client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ReadMessageHistory] },
    ];
    for (const rId of STAFF_ROLES) {
      if (guild.roles.cache.get(rId))
        overw.push({ id: rId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] });
    }

    const chOpts = { name: ticketName, type: ChannelType.GuildText, permissionOverwrites: overw };
    if (TICKET_CATEGORY_ID) chOpts.parent = TICKET_CATEGORY_ID;

    let ticketCh;
    try { ticketCh = await guild.channels.create(chOpts); }
    catch (e) {
      console.error("Erro ao criar canal:", e);
      ticketOpening.delete(user.id);
      interaction.editReply({ content: "❌ Erro ao criar o ticket. Tente novamente." }).catch(() => {});
      return;
    }
    ticketOpening.delete(user.id);

    const dateStr = getBRT();
    ticketData.set(ticketCh.id, { ticketName, openerId: user.id, label, dateStr, claimerId: null, ratedSent: false, isCompra, createdAt: Date.now(), reminderSent: false });
    saveTicketData(ticketData);

    interaction.editReply({ content: `✅ Ticket criado: <#${ticketCh.id}>` }).catch(() => {});

    const staffMentions = STAFF_ROLES.map(id => `<@&${id}>`).join(" ");
    await ticketCh.send({ content: `<@${user.id}> ${staffMentions}`, allowedMentions: { parse: ["users","roles"] } });

    const c = new ContainerBuilder()
      .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎫 Ticket Aberto`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `🎫 **Ticket Aberto**\n\n> 📋 **Nome do Ticket:** \`${ticketName}\`\n> 👤 **Criado Por:** <@${user.id}>\n> 📅 **Opened Date:** ${dateStr}\n> 🏷️ **Ticket Type:** ${label}`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`))
      .addActionRowComponents(new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`ticket_close_${ticketCh.id}_${user.id}`).setLabel("Fechar Ticket").setStyle(ButtonStyle.Danger).setEmoji("🔒"),
        new ButtonBuilder().setCustomId(`ticket_claim_${ticketCh.id}_${user.id}`).setLabel("Reivindicar Ticket").setStyle(ButtonStyle.Primary).setEmoji("📋")
      ))
      .addActionRowComponents(new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`panel_staff_${ticketCh.id}_${user.id}`).setLabel("Painel Staff").setStyle(ButtonStyle.Secondary).setEmoji({ id:"1436350133884293221", name:"icon_suplente_mod_1" }),
        new ButtonBuilder().setCustomId(`panel_member_${ticketCh.id}_${user.id}`).setLabel("Painel Membro").setStyle(ButtonStyle.Secondary).setEmoji("👤")
      ));

    await ticketCh.send({ components: [c], flags: MessageFlags.IsComponentsV2, allowedMentions: { parse: [] } });

    const logTargetId = isCompra ? TICKET_LOG_CHANNEL_ID : LOG_CHANNEL_ID;
    guild.channels.cache.get(logTargetId)?.send({ embeds: [new EmbedBuilder()
      .setTitle("🎫 Ticket Aberto")
      .addFields(
        { name: "Canal",      value: `<#${ticketCh.id}>`, inline: true },
        { name: "Criado por", value: `<@${user.id}>`,     inline: true },
        { name: "Tipo",       value: label,               inline: true },
        { name: "Data",       value: dateStr,             inline: true },
      )
      .setColor(0x57F287).setFooter({ text: "PAFO — Ticket System", iconURL: SERVER_ICON }).setTimestamp()
    ]});
    return;
  }

  if (interaction.isButton() && interaction.customId.startsWith("panel_staff_")) {
    if (!isStaff(interaction.member))
      return interaction.reply({ content: "❌ Apenas a staff pode usar o Painel Staff.", flags: MessageFlags.Ephemeral });

    const [,, channelId, openerId] = interaction.customId.split("_");
    const select = new StringSelectMenuBuilder()
      .setCustomId(`staff_action_${channelId}_${openerId}`)
      .setPlaceholder("Selecione o que deseja fazer")
      .addOptions(
        new StringSelectMenuOptionBuilder().setLabel("Notificar Membro").setDescription("Envia um ping na DM do membro").setValue("notify_member").setEmoji("🔔"),
        new StringSelectMenuOptionBuilder().setLabel("Adicionar Membro").setDescription("Adiciona um membro ao ticket").setValue("add_member").setEmoji("➕"),
        new StringSelectMenuOptionBuilder().setLabel("Remover Membro").setDescription("Remove um membro do ticket").setValue("remove_member").setEmoji("➖")
      );

    const c = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ⚙️ Painel Staff\nControle o ticket com as opções abaixo:`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `> 🔔 **Notificar Membro** — DM ao membro\n> ➕ **Adicionar Membro** — Adiciona ao ticket\n> ➖ **Remover Membro** — Remove do ticket`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Painel Staff`))
      .addActionRowComponents(new ActionRowBuilder().addComponents(select));
    return interaction.reply({ components: [c], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
  }

  if (interaction.isButton() && interaction.customId.startsWith("panel_member_")) {
    const [,, channelId, openerId] = interaction.customId.split("_");
    if (interaction.user.id !== openerId)
      return interaction.reply({ content: "❌ Apenas quem abriu o ticket pode usar o Painel Membro.", flags: MessageFlags.Ephemeral });

    const select = new StringSelectMenuBuilder()
      .setCustomId(`member_action_${channelId}_${openerId}`)
      .setPlaceholder("Selecione o que deseja fazer")
      .addOptions(
        new StringSelectMenuOptionBuilder().setLabel("Notificar Staff").setDescription("Envia um ping para a staff no canal").setValue("notify_staff").setEmoji("🔔")
      );

    const c = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 👤 Painel Membro\nUse as opções abaixo para interagir com a staff:`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`> 🔔 **Notificar Staff** — Envia um ping para a staff no canal do ticket`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Painel Membro`))
      .addActionRowComponents(new ActionRowBuilder().addComponents(select));
    return interaction.reply({ components: [c], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
  }

  if (interaction.isStringSelectMenu() && interaction.customId.startsWith("staff_action_")) {
    const [,, channelId, openerId] = interaction.customId.split("_");
    const action = interaction.values[0];
    const ch = interaction.guild.channels.cache.get(channelId);

    if (action === "notify_member") {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      const opener = await interaction.guild.members.fetch(openerId).catch(() => null);
      if (!opener) return interaction.editReply({ content: "❌ Não foi possível encontrar o membro." });

      const dm = new ContainerBuilder()
        .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🔔 Notificação do Ticket`))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `Olá, <@${openerId}>!\n\nA staff entrou em contato referente ao seu ticket.\nPor favor, acesse o canal para continuar o atendimento.`
        ))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`));

      const sent = await opener.send({ components: [dm], flags: MessageFlags.IsComponentsV2 }).catch(() => null);
      return interaction.editReply({ content: sent ? "✅ Membro notificado!" : "❌ DMs fechadas." });
    }

    if (action === "add_member") {
      const modal = new ModalBuilder().setCustomId(`modal_add_${channelId}`).setTitle("Adicionar Membro ao Ticket");
      modal.addComponents(new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("member_id").setLabel("ID do usuário a adicionar")
          .setStyle(TextInputStyle.Short).setPlaceholder("Ex: 123456789012345678").setRequired(true).setMaxLength(20)
      ));
      return interaction.showModal(modal);
    }

    if (action === "remove_member") {
      const modal = new ModalBuilder().setCustomId(`modal_remove_${channelId}`).setTitle("Remover Membro do Ticket");
      modal.addComponents(new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId("member_id").setLabel("ID do usuário a remover")
          .setStyle(TextInputStyle.Short).setPlaceholder("Ex: 123456789012345678").setRequired(true).setMaxLength(20)
      ));
      return interaction.showModal(modal);
    }
  }

  if (interaction.isModalSubmit() && interaction.customId.startsWith("modal_add_")) {
    const channelId = interaction.customId.replace("modal_add_", "");
    const memberId  = interaction.fields.getTextInputValue("member_id").trim();
    const ch        = interaction.guild.channels.cache.get(channelId);
    if (!ch) return interaction.reply({ content: "❌ Canal não encontrado.", flags: MessageFlags.Ephemeral });
    if (!await interaction.guild.members.fetch(memberId).catch(() => null))
      return interaction.reply({ content: "❌ Usuário não encontrado.", flags: MessageFlags.Ephemeral });

    await ch.permissionOverwrites.edit(memberId, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true }).catch(() => {});
    const n = new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `### ➕ Membro Adicionado\n> <@${memberId}> foi adicionado por <@${interaction.user.id}>.`
    ));
    await ch.send({ components: [n], flags: MessageFlags.IsComponentsV2 });
    return interaction.reply({ content: `✅ <@${memberId}> adicionado!`, flags: MessageFlags.Ephemeral });
  }

  if (interaction.isModalSubmit() && interaction.customId.startsWith("modal_remove_")) {
    const channelId = interaction.customId.replace("modal_remove_", "");
    const memberId  = interaction.fields.getTextInputValue("member_id").trim();
    const ch        = interaction.guild.channels.cache.get(channelId);
    if (!ch) return interaction.reply({ content: "❌ Canal não encontrado.", flags: MessageFlags.Ephemeral });

    await ch.permissionOverwrites.edit(memberId, { ViewChannel: false }).catch(() => {});
    const n = new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `### ➖ Membro Removido\n> <@${memberId}> foi removido por <@${interaction.user.id}>.`
    ));
    await ch.send({ components: [n], flags: MessageFlags.IsComponentsV2 });
    return interaction.reply({ content: `✅ <@${memberId}> removido!`, flags: MessageFlags.Ephemeral });
  }

  if (interaction.isStringSelectMenu() && interaction.customId.startsWith("member_action_")) {
    const [,, channelId, openerId] = interaction.customId.split("_");
    const action = interaction.values[0];
    const ch = interaction.guild.channels.cache.get(channelId);

    if (action === "notify_staff") {
      if (!ch) return interaction.reply({ content: "❌ Canal não encontrado.", flags: MessageFlags.Ephemeral });
      const staffMentions = STAFF_ROLES.map(id => `<@&${id}>`).join(" ");
      await ch.send({ content: staffMentions, allowedMentions: { parse: ["roles"] } });
      const n = new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `### 🔔 Staff Notificada\n> <@${openerId}> está aguardando atendimento!`
      ));
      await ch.send({ components: [n], flags: MessageFlags.IsComponentsV2 });
      return interaction.reply({ content: "✅ Staff notificada!", flags: MessageFlags.Ephemeral });
    }
  }

  if (interaction.isButton() && interaction.customId.startsWith("ticket_close_")) {
    if (!isStaff(interaction.member))
      return interaction.reply({ content: "❌ Apenas a staff pode fechar tickets.", flags: MessageFlags.Ephemeral });

    const parts    = interaction.customId.split("_");
    const openerId = parts[3] ?? null;
    const ch       = interaction.channel;
    const data     = ticketData.get(ch.id);
    const isCompra = data?.isCompra ?? false;

    if (ratedTickets.has(ch.id))
      return interaction.reply({ content: "⚠️ Este ticket já está sendo fechado.", flags: MessageFlags.Ephemeral });
    ratedTickets.add(ch.id);

    claimedTickets.delete(ch.id);
    await interaction.reply({ content: "🔒 Ticket será deletado em **5 segundos**.", flags: MessageFlags.Ephemeral });

    const closing = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `## 🔒 Ticket Sendo Fechado\n\n> Fechado por <@${interaction.user.id}>\n> Deletado em **5 segundos.**`
      ))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`));
    await ch.send({ components: [closing], flags: MessageFlags.IsComponentsV2 });

    const ticketName  = data?.ticketName ?? ch.name;
    const ticketLabel = data?.label ?? "Desconhecido";
    const claimerId   = data?.claimerId  ?? null;
    const dateStr     = getBRT();

    let txt = `📄 TRANSCRIPT: ${ch.name}\nFechado por: ${interaction.user.tag}\n\n`;
    try {
      const msgs = await ch.messages.fetch({ limit: 100 });
      Array.from(msgs.values()).reverse().forEach(m => {
        const time = m.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        txt += `[${time}] ${m.author?.tag ?? "?"}: ${m.content || "[sem texto]"}\n`;
      });
    } catch { txt += "\n⚠️ Erro ao carregar histórico."; }
    const file = new AttachmentBuilder(Buffer.from(txt, "utf-8"), { name: `transcript-${ch.name}.txt` });

    interaction.guild.channels.cache.get(LOG_CHANNEL_ID)?.send({
      embeds: [new EmbedBuilder()
        .setTitle("🔒 Ticket Fechado")
        .addFields(
          { name: "Canal",      value: ch.name,                                          inline: true },
          { name: "Fechado por",value: `<@${interaction.user.id}>`,                      inline: true },
          { name: "Criado por", value: openerId ? `<@${openerId}>` : "Desconhecido",     inline: true },
          { name: "Tipo",       value: ticketLabel,                                       inline: true },
          { name: "Data",       value: dateStr,                                           inline: true },
        )
        .setColor(0xED4245).setFooter({ text: "PAFO — Ticket System", iconURL: SERVER_ICON }).setTimestamp()
      ],
      files: [file]
    });

    if (openerId && !(data?.ratedSent)) {
      if (data) data.ratedSent = true;
      const opener = await interaction.guild.members.fetch(openerId).catch(() => null);
      if (opener) {
        if (isCompra) {
          const cargoSelect = new StringSelectMenuBuilder()
            .setCustomId(`compra_cargo|${ticketName}|${openerId}|${claimerId ?? interaction.user.id}`)
            .setPlaceholder("Qual cargo você comprou?")
            .addOptions(
              new StringSelectMenuOptionBuilder().setLabel("Olheiro").setValue("olheiro").setEmoji("🔍"),
              new StringSelectMenuOptionBuilder().setLabel("Scrim Hoster").setValue("scrim_hoster").setEmoji("⚔️"),
              new StringSelectMenuOptionBuilder().setLabel("Pic Perm").setValue("pic_perm").setEmoji("📸"),
            );

          const dmC = new ContainerBuilder()
            .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🛒 Seu Ticket de Compra Foi Encerrado`))
            .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `**Ticket:** \`${ticketName}\`\n**Fechado por:** <@${interaction.user.id}>\n**Data:** ${dateStr}`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`🛒 **Qual cargo você comprou?**\nSelecione abaixo para continuar a avaliação:`))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`))
            .addActionRowComponents(new ActionRowBuilder().addComponents(cargoSelect));

          await opener.send({ components: [dmC], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
        } else {
          const dmC = buildRatingDM({
            ticketName, openerId,
            claimerId: claimerId ?? interaction.user.id,
            closerId: interaction.user.id,
            dateStr,
            ticketType: ticketLabel,
            cargoBought: null,
          });
          await opener.send({ components: [dmC], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
        }
      }
    }

    ticketData.delete(ch.id);
    saveTicketData(ticketData);
    setTimeout(() => {
      ch.delete().catch(() => {});
      ratedTickets.delete(ch.id);
    }, 5000);
    return;
  }

  if (interaction.isStringSelectMenu() && interaction.customId.startsWith("compra_cargo|")) {
    const parts      = interaction.customId.split("|");
    const ticketName = parts[1];
    const openerId   = parts[2];
    const claimerId  = parts[3];

    const cargoLabel = {
      olheiro:      "Olheiro",
      scrim_hoster: "Scrim Hoster",
      pic_perm:     "Pic Perm",
    };
    const cargoBought = cargoLabel[interaction.values[0]] ?? interaction.values[0];

    await interaction.deferUpdate();

    const dateStr = getBRT();
    const dmC = buildRatingDM({
      ticketName, openerId, claimerId,
      closerId: claimerId,
      dateStr,
      ticketType: "Compras",
      cargoBought,
    });
    await interaction.message.edit({ components: [dmC], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
    return;
  }

  if (interaction.isButton() && interaction.customId.startsWith("ticket_claim_")) {
    if (!isStaff(interaction.member))
      return interaction.reply({ content: "❌ Apenas a staff pode reivindicar tickets.", flags: MessageFlags.Ephemeral });

    const ch = interaction.channel;
    if (claimedTickets.has(ch.id))
      return interaction.reply({ content: "❌ Este ticket já foi reivindicado.", flags: MessageFlags.Ephemeral });
    claimedTickets.add(ch.id);

    await interaction.reply({ content: "✅ Você reivindicou este ticket!", flags: MessageFlags.Ephemeral });

    const [,, channelId, openerId] = interaction.customId.split("_");
    if (ticketData.has(ch.id)) {
      ticketData.get(ch.id).claimerId = interaction.user.id;
      saveTicketData(ticketData);
    }

    await Promise.all([
      ...STAFF_ROLES.map(rId => ch.permissionOverwrites.edit(rId, { ViewChannel: false }).catch(() => {})),
      ch.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true }).catch(() => {}),
      openerId ? ch.permissionOverwrites.edit(openerId, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true }).catch(() => {}) : null,
    ]);

    const data       = ticketData.get(ch.id);
    const ticketInfo = `🎫 **Ticket Aberto**\n\n> 📋 **Nome do Ticket:** \`${data?.ticketName ?? ch.name}\`\n> 👤 **Criado Por:** <@${data?.openerId ?? openerId}>\n> 📅 **Opened Date:** ${data?.dateStr ?? getBRT()}\n> 🏷️ **Ticket Type:** ${data?.label ?? "Desconhecido"}`;

    const updated = new ContainerBuilder()
      .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎫 Ticket Aberto`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(ticketInfo))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`))
      .addActionRowComponents(new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`ticket_close_${ch.id}_${openerId}`).setLabel("Fechar Ticket").setStyle(ButtonStyle.Danger).setEmoji("🔒"),
        new ButtonBuilder().setCustomId(`claimed_by_${interaction.user.id}`).setLabel(`Atendido por ${interaction.user.displayName}`).setStyle(ButtonStyle.Secondary).setEmoji("✅").setDisabled(true)
      ))
      .addActionRowComponents(new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`panel_staff_${ch.id}_${openerId}`).setLabel("Painel Staff").setStyle(ButtonStyle.Secondary).setEmoji({ id:"1436350133884293221", name:"icon_suplente_mod_1" }),
        new ButtonBuilder().setCustomId(`panel_member_${ch.id}_${openerId}`).setLabel("Painel Membro").setStyle(ButtonStyle.Secondary).setEmoji("👤")
      ));

    await interaction.message.edit({ components: [updated], flags: MessageFlags.IsComponentsV2 }).catch(console.error);

    const claimNotice = new ContainerBuilder()
      .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🤝 Atendimento Iniciado`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `Olá <@${openerId}>, o seu atendimento foi iniciado!\n\n` +
        `**Staff responsável:** <@${interaction.user.id}>\n\n` +
        `> Por favor, descreva sua solicitação detalhadamente para agilizar o suporte.`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`));
      
    await ch.send({
      content: `<@${openerId}>`,
      components: [claimNotice],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: { parse: ["users"] },
    });
    return;
  }

  async function parseFa(channelId, msgId) {
    try {
      const ch  = await client.channels.fetch(channelId).catch(() => null);
      const msg = ch ? await ch.messages.fetch(msgId).catch(() => null) : null;
      if (!msg) return null;
      const texts = [];
      for (const comp of msg.components) {
        if (comp.type === 17) for (const child of comp.components) if (child.type === 10) texts.push(child.content ?? "");
      }
      const ex = (t) => t.includes("→") ? t.split("→").slice(1).join("→").trim() : t;
      return {
        userId: texts[1]?.replace(/[^0-9]/g,"").slice(0,20) ?? null,
        experiencias: texts[2] ? ex(texts[2]) : "—",
        habilidades:  texts[3] ? ex(texts[3]) : "—",
        posicao:      texts[4] ? ex(texts[4]) : "—",
        dispositivo:  texts[5] ? ex(texts[5]) : "—",
        observacoes:  texts[6] ? ex(texts[6]) : "—",
      };
    } catch { return null; }
  }

  if (interaction.isButton() && interaction.customId.startsWith("fac_")) {
    const [, userId, msgId] = interaction.customId.split("_");
    if (interaction.user.id === userId)
      return interaction.reply({ content: "❌ Você não pode se contratar.", flags: MessageFlags.Ephemeral });

    const target = await interaction.guild.members.fetch(userId).catch(() => null);
    if (!target) return interaction.reply({ content: "❌ Jogador não encontrado.", flags: MessageFlags.Ephemeral });

    const dm = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🤝 Proposta de Contratação`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `Olá, <@${userId}>! 👋\n\n<@${interaction.user.id}> está interessado em você!\n\n📩 **Entre em contato:** <@${interaction.user.id}>\n🏷️ **Tag:** ${interaction.user.tag}`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Free Agent`));

    const sent = await target.send({ components: [dm], flags: MessageFlags.IsComponentsV2 }).catch(() => null);
    if (!sent) return interaction.reply({ content: "❌ DMs fechadas.", flags: MessageFlags.Ephemeral });

    const confirm = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ✅ Proposta Enviada!`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`Sua proposta foi enviada para <@${userId}>! 🎮`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Free Agent`));
    return interaction.reply({ components: [confirm], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
  }

  if (interaction.isButton() && interaction.customId.startsWith("fas_")) {
    const [, userId, msgId] = interaction.customId.split("_");
    const fa = await parseFa(interaction.channel.id, msgId);

    const profile = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 📋 Perfil Completo`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`🧑 ***JOGADOR***\n→ <@${userId}>`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`⭐ ***EXPERIÊNCIAS***\n→ ${fa?.experiencias ?? "—"}`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`⚡ ***HABILIDADES***\n→ ${fa?.habilidades ?? "—"}`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`🎯 ***POSIÇÃO***\n→ ${fa?.posicao ?? "—"}`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`📱 ***DISPOSITIVO***\n→ ${fa?.dispositivo ?? "—"}`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`📝 ***OBSERVAÇÕES***\n→ ${fa?.observacoes ?? "—"}`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`> 💬 Para contratar, clique em **Contratar** no anúncio ou envie DM para <@${userId}>.`))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Free Agent`));
    return interaction.reply({ components: [profile], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
  }

  if (interaction.isButton() && interaction.customId.startsWith("rate|")) {
    const parts      = interaction.customId.split("|");
    const nota       = parseInt(parts[6]);
    const safeCargo  = parts[5];
    const safeType   = parts[4];
    const claimerId  = parts[3];
    const openerId   = parts[2];
    const ticketName = parts[1];
    const cargoBought = safeCargo !== "null" ? decodeURIComponent(safeCargo) : null;
    const ticketType  = safeType  !== "null" ? decodeURIComponent(safeType)  : "Desconhecido";

    await interaction.deferUpdate();

    const stars   = "⭐".repeat(nota);
    const dateStr = getBRT();

    const confirmed = new ContainerBuilder()
      .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ✅ Avaliação Enviada!`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `Obrigado pelo seu feedback!\n\n**Sua nota:** ${stars} **(${nota}/5)**\n**Ticket:** \`${ticketName}\``
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`));
    await interaction.message.edit({ components: [confirmed], flags: MessageFlags.IsComponentsV2 }).catch(() => {});

    const guild = await client.guilds.fetch(GUILD_ID).catch(() => null);

    const targetChannelId = ticketType === "Compras" ? FEEDBACK_COMPRAS_ID : REVIEW_CHANNEL_ID;
    const revCh = guild ? await guild.channels.fetch(targetChannelId).catch(() => null) : null;

    if (revCh) {
      const rev = new ContainerBuilder()
        .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          ticketType === "Compras" ? `## 🛒 Nova Avaliação de Compra` : `## ⭐ Nova Avaliação de Atendimento`
        ))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `**Ticket:** \`${ticketName}\`\n` +
          `**Ticket Type:** ${ticketType}\n` +
          (cargoBought ? `**Cargo Comprado:** ${cargoBought}\n` : "") +
          `**Membro:** <@${openerId}>\n` +
          `**Nota:** ${stars} **(${nota}/5)**\n` +
          `**Staff:** <@${claimerId}>\n` +
          `**Data:** ${dateStr}`
        ))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`));
      await revCh.send({ components: [rev], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
    }
    return;
  }
}

function buildRatingDM({ ticketName, openerId, claimerId, closerId, dateStr, ticketType, cargoBought }) {
  const safeType  = encodeURIComponent(ticketType ?? "Desconhecido");
  const safeCargo = encodeURIComponent(cargoBought ?? "null");
  const baseId = `rate|${ticketName}|${openerId}|${claimerId}|${safeType}|${safeCargo}`;

  const title = cargoBought ? `## 🛒 Avalie sua Compra` : `## 🔒 Seu Ticket Foi Encerrado`;

  let extraInfo = `**Ticket:** \`${ticketName}\`\n**Ticket Type:** ${ticketType}\n`;
  if (cargoBought) extraInfo += `**Cargo Comprado:** ${cargoBought}\n`;
  extraInfo += `**Fechado por:** <@${closerId}>\n**Data:** ${dateStr}`;

  return new ContainerBuilder()
    .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(title))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(extraInfo))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`⭐ **Como foi o nosso atendimento?**\nAvalie clicando em uma das opções abaixo:`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`${baseId}|1`).setLabel("⭐ 1").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`${baseId}|2`).setLabel("⭐ 2").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId(`${baseId}|3`).setLabel("⭐ 3").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId(`${baseId}|4`).setLabel("⭐ 4").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`${baseId}|5`).setLabel("⭐ 5").setStyle(ButtonStyle.Success)
    ));
}

async function sendWelcome(channel, member) {
  const icon = member.guild.iconURL({ size: 1024 }) ?? SERVER_ICON;
  await channel.send({ embeds: [new EmbedBuilder()
    .setAuthor({ name: "PAFO", iconURL: icon })
    .setTitle("Bem-Vindo(a) a PAFO")
    .setThumbnail(icon)
    .setDescription(
      `Bem-vindo(a), <@${member.id}>! Ficamos felizes por você ter se juntado à 🌌 PAFO.\n\n` +
      `📜 Leia as regras: https://discord.com/channels/1449061779060687063/1449067621411459183\n\n` +
      `🎫 Suporte: https://discord.com/channels/1449061779060687063/1449068500567068804\n\n` +
      `📢 Informações: https://discord.com/channels/1449061779060687063/1454098611754373296\n\n` +
      `✅ Verifique sua conta: https://discord.com/channels/1449061779060687063/1464627654744477819`
    )
    .setImage(BANNERS.welcome).setColor(0x1B2A4A).setFooter({ text: "© 2026 PAFO", iconURL: icon }).setTimestamp()
  ]}).catch(console.error);
}

async function cmdVerify(channel) {
  const c = new ContainerBuilder()
    .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.verify)))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `## 🔐 Verificação Necessária para Acessar a PAFO\n\nPara acessar o servidor, confirme que **é humano** e **não usa contas alternativas ou VPN.**`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `### 📋 Antes de Verificar\n> • Leia as **regras** do servidor\n> • Os cargos dependem de **atividade**, **habilidade** e **contribuição**`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `### 🚫 Regras de Verificação\n> • Proibido __contas alternativas__\n> • Não usar __VPN__\n> • Golpes = **banimento imediato**\n> • Respeite todos os membros`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# Ao verificar, você aceita todas as __Políticas da PAFO__.`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("verify_button").setLabel("Verificar").setStyle(ButtonStyle.Success).setEmoji({ id:"1396655318662119535", name:"verify", animated:true }),
      new ButtonBuilder().setCustomId("why_verify").setLabel("Porque?").setStyle(ButtonStyle.Secondary).setEmoji({ id:"1468006456489148580", name:"question", animated:true })
    ));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

async function cmdRules(channel) {
  const c = new ContainerBuilder()
    .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.rules)))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `1. Seja respeitoso — proibido \`assédio\`, \`bullying\`, \`toxicidade\` ou \`drama\`\n` +
      `2. Proibido \`discurso de ódio\`, \`racismo\`, \`insultos\`, \`homofobia\` ou \`transfobia\`\n` +
      `3. Proibido conteúdo \`NSFW\` — \`banimento imediato\`\n` +
      `4. Proibido \`ameaças\`, \`doxxing\`, \`raid\` ou incentivar \`automutilação\`\n` +
      `5. Proibido \`spam\`, \`flood\` ou \`abuso de menções\`\n` +
      `6. Mantenha-se \`no assunto\` do canal\n` +
      `7. Proibido \`se passar por outra pessoa\`\n` +
      `8. \`Política\` não é permitida nos canais\n` +
      `9. Siga os \`Termos de Serviço do Discord\`\n` +
      `10. Proibido \`golpes\` ou links suspeitos\n` +
      `11. Proibido \`propaganda\` ou promoções não autorizadas\n` +
      `12. Proibido \`evasão de banimento\` ou uso de alts\n` +
      `13. Proibido \`desinformação\` ou enganar membros\n` +
      `14. Proibido \`burlar o AutoMod\` com símbolos ou grafias alternativas\n` +
      `15. Evite mencionar outros \`servidores\`\n` +
      `16. Proibido \`spam no VC\` ou comportamento disruptivo\n` +
      `17. Decisões da staff são \`finais\`\n` +
      `18. Proibido \`denúncias falsas\`, tickets de troll ou aplicações falsas`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# © 2026 PAFO — Ao entrar você concorda com todas as regras acima.`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setURL("https://discord.com/guidelines").setLabel("Discord TOS/Diretrizes").setStyle(ButtonStyle.Link).setEmoji({ id:"1445106637202395396", name:"Discord_Emoji" })
    ));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

async function cmdBooster(channel) {
  const c = new ContainerBuilder()
    .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.booster)))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ✨ Benefícios Boosters`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `Agradecemos a todos que impulsionam o servidor! 💖\n\n**💎 Vantagens:**\n` +
      `> • Cargo __exclusivo__ de Booster\n> • **25 Robux** por boost\n> • Mais chances em **sorteios**\n> • Destaque especial no servidor`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**⚠️ Avisos:**\n> • Válido enquanto o boost estiver __ativo__\n> • Benefícios podem mudar conforme o servidor evolui\n> • Abra um ticket para resgatar`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Server Booster`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setURL("https://discord.com/channels/1449061779060687063/1449068500567068804").setLabel("Resgatar Benefícios").setStyle(ButtonStyle.Link).setEmoji("📩")
    ));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

async function cmdInfo(channel) {
  const c = new ContainerBuilder()
    .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.info)))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🏅 CARGOS DO SERVIDOR`))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `🔴 **Owner** — Dono do servidor\n🟠 **Co-Owner** — Co-dono do servidor\n🟡 **Gerente** — Gerencia o servidor\n` +
      `🟢 **Staff** — Modera o servidor\n🔵 **Olheiro** — Pode divulgar peneiras\n🟣 **Scrim Hoster** — Pode hospedar scrims\n⚪ **Verificado** — Membro verificado`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 📌 CANAIS IMPORTANTES`))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `📜 **Regras** — <#1449067621411459183>\n✅ **Verificação** — <#1464627654744477819>\n📢 **Anúncios** — <#1454098611754373296>\n🎫 **Ticket** — <#1449068500567068804>\n🎁 **Sorteios** — <#1449115997804957806>`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ⚠️ O QUE GERA ADVERTÊNCIA`))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `> • \`Linguagem inadequada\`\n> • \`Spam ou flood\`\n> • \`Links não autorizados\`\n> • \`Conteúdo off-topic\`\n> • \`Desobedecer staff\``
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`🔗 **Servidor de Appeal:** ${APPEAL_SERVER}`))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# © 2026 PAFO`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setURL("https://discord.com/channels/1449061779060687063/1449068500567068804").setLabel("Abrir Ticket").setStyle(ButtonStyle.Link).setEmoji("🎫")
    ));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

async function cmdLoja(channel) {
  const c = new ContainerBuilder()
    .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.loja)))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `## <:PAFO:1455732882235719862> TABELA DE PREÇOS — CARGOS`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `🔍 <@&1449070067131224268> — **Olheiro** — **150 Robux**\n> Realize peneiras e observe jogadores`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `⚔️ <@&1449070133040517262> — **Scrim Hoster** — **300 Robux**\n> Organize e hostear scrims oficiais`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `📸 <@&1450118477179260948> — **Pic Perm** — **60 Robux**\n> Permissão para enviar imagens onde não é permitido`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `🛠️ **Canal Personalizado** — **200 Robux**\n> Criação de canal personalizado da PAFO`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### 🚫 NÃO VENDEMOS CARGO DE ADM`))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# © 2026 PAFO`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setURL("https://discord.com/channels/1449061779060687063/1449068500567068804").setLabel("Abrir Ticket").setStyle(ButtonStyle.Link).setEmoji("📩")
    ));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

async function cmdTicket(channel) {
  const select = new StringSelectMenuBuilder()
    .setCustomId("ticket_select").setPlaceholder("Selecione uma opção:")
    .addOptions(
      new StringSelectMenuOptionBuilder().setLabel("Dúvidas").setDescription("Perguntas gerais.").setValue("duvidas").setEmoji("❓"),
      new StringSelectMenuOptionBuilder().setLabel("Parcerias").setDescription("Divulgação de servidor.").setValue("parcerias").setEmoji("🤝"),
      new StringSelectMenuOptionBuilder().setLabel("Compras").setDescription("Comprar Cargo").setValue("compras").setEmoji("🛒"),
      new StringSelectMenuOptionBuilder().setLabel("Denúncias").setDescription("Denunciar um usuário").setValue("denuncias").setEmoji("🚨"),
      new StringSelectMenuOptionBuilder().setLabel("Outros").setDescription("Outros assuntos não listados acima.").setValue("outros").setEmoji("📌")
    );
  const c = new ContainerBuilder()
    .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎫 Help & Support`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `Nossa equipe estará sempre disponível para ajudar!\n\n` +
      `❓ **Dúvidas** — Perguntas gerais\n🤝 **Parcerias** — Propostas e divulgações\n` +
      `🛒 **Compras** — Comprar cargos\n🚨 **Denúncias** — Denunciar usuários\n📌 **Outros** — Outros assuntos`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`> ⏳ Pedimos __paciência__ enquanto nossa staff analisa seu ticket.`))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(select));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

async function cmdFriendlys(channel) {
  const c = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `## 📋 REGRAS OFICIAIS — PAFO FRIENDLYS\n\n` +
      `Qualquer ato de **racismo**, **gordofobia**, **xenofobia** ou **discriminação** em qualquer meio:\n\n` +
      `> Resultado: **Mute + Advertência**\n\n` +
      `⚠️ Caso ocorra **DURANTE** um amistoso:\n` +
      `> Resultado: **BANIMENTO**\n\n` +
      `-# O usuário precisa estar no servidor para que a punição seja aplicada.`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `## 🚫 PENEIRAS IRREGULARES\n\n` +
      `Realizar peneiras sem possuir o cargo: <@&1449070067131224268>\n\n` +
      `> Resultado: **BANIMENTO**`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `## ⚠️ OBSERVAÇÕES IMPORTANTES\n\n` +
      `> • Racismo, gordofobia, xenofobia e preconceito = Mute + Adv\n` +
      `> • As regras são válidas **dentro e fora** do servidor\n` +
      `> • Se o servidor tiver **-13 membros**, avise antes da peneira\n` +
      `> • Proibido dar **kick all** sem motivo justificado\n` +
      `> • Respeite os **Friendly Rules** em todos os momentos`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**Mais informações:**\n<#1454098611754373296> | <#1449068500567068804>`
    ))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# © 2026 PAFO — Friendlys Rules`));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

async function cmdOlheiroRules(channel) {
  const c = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🔍 REGRAS PARA OLHEIROS — PAFO`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**📋 Regras de Conduta:**\n` +
      `> • Enviar o link do servidor privado **no máximo 2 vezes**\n` +
      `> • **Proibido** enviar link de times\n` +
      `> • Respeite os Friendly Rules durante as scrims\n` +
      `> • Mantenha clareza na divulgação`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**📝 Modelo de mensagem para peneiras:**\n\n` +
      "```\n" +
      "# PENEIRA!\n" +
      "**O real madrid está atrás de novas lendas!**\n\n" +
      "# regras\n" +
      "**- não hoggar\n" +
      "- não fazer Ts\n" +
      "- skille se puder\n" +
      "- tocar independente de tudo\n" +
      "- não passar fome**\n\n" +
      "Link: [https://www.roblox.com/share?code=SEU_CODIGO&type=Server](https://www.roblox.com/share?code=SEU_CODIGO&type=Server)\n" +
      "||@here||\n" +
      "```"
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**🛒 Como obter o cargo de Olheiro?**\n` +
      `> Veja a loja em <#${LOJA_CHANNEL_ID}> e compre por **150 Robux**.\n` +
      `> Depois abra um ticket para liberar o acesso.`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`⚠️ **Descumprir as regras resulta em remoção do cargo sem reembolso.**`))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# © 2026 PAFO — Olheiro Rules`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setURL("https://discord.com/channels/1449061779060687063/1449068500567068804").setLabel("Abrir Ticket").setStyle(ButtonStyle.Link).setEmoji("🎫"),
      new ButtonBuilder().setURL(`https://discord.com/channels/${GUILD_ID}/${LOJA_CHANNEL_ID}`).setLabel("Ver Loja").setStyle(ButtonStyle.Link).setEmoji("🛒")
    ));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

async function cmdScrimHosterRules(channel) {
  const c = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ⚔️ REGRAS PARA SCRIM HOSTERS — PAFO`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**📋 Regras de Conduta:**\n` +
      `> • Enviar o link do servidor privado **no máximo 2 vezes**\n` +
      `> • **Proibido** enviar link de times\n` +
      `> • Informe estádio, modo de jogo e juiz no anúncio (Opcional)\n` +
      `> • Respeite os Friendly Rules durante as scrims`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**📝 Modelo de mensagem para scrims:**\n\n` +
      "```\n" +
      "# LINK SCRIM\n" +
      "# | - NOME DO ESTÁDIO\n" +
      "# |- MODO (ex: clássico / futsal)\n" +
      "# |- Juiz: SEU_NICK\n\n" +
      "[https://www.roblox.com/share?code=SEU_CODIGO&type=Server](https://www.roblox.com/share?code=SEU_CODIGO&type=Server)\n" +
      "@everyone @here\n" +
      "```"
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**🛒 Como obter o cargo de Scrim Hoster?**\n` +
      `> Veja a loja em <#${LOJA_CHANNEL_ID}> e compre por **300 Robux**.\n` +
      `> ⚠️ Precisa do cargo **Scrim Hoster** para realizar scrims.\n` +
      `> Depois abra um ticket para liberar o acesso.`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`⚠️ **Descumprir as regras resulta em remoção do cargo sem reembolso.**`))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# © 2026 PAFO — Scrim Hoster Rules`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setURL("https://discord.com/channels/1449061779060687063/1449068500567068804").setLabel("Abrir Ticket").setStyle(ButtonStyle.Link).setEmoji("🎫"),
      new ButtonBuilder().setURL(`https://discord.com/channels/${GUILD_ID}/${LOJA_CHANNEL_ID}`).setLabel("Ver Loja").setStyle(ButtonStyle.Link).setEmoji("🛒")
    ));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

async function cmdDrops(channel) {
  const c = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎁 DROPS DA PAFO`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `### 🏆 Drop de Olheiro, Scrim Hoster ou Pic Perm!\n\n` +
      `> 🕐 **Drops acontecem a cada 2 horas (10h as 00h)!**\n` +
      `> 🎯 O vencedor escolhe **um** dos cargos abaixo:\n\n` +
      `> 🔍 **Olheiro** — Realize peneiras oficiais\n` +
      `> ⚔️ **Scrim Hoster** — Organize scrims oficiais\n` +
      `> 📸 **Pic Perm** — Envie imagens onde não é permitido`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**🤔 Qual será o próximo sortudo?**\nFique ligado no chat e seja o próximo a ganhar!\n\n` +
      `✅ **Se ganhar:** O prêmio é entregue direto na sua DM!`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# © 2026 PAFO — Drops System`));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

async function cmdBioReward(channel) {
  const c = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🌟 RECOMPENSAS EXCLUSIVAS — BIO & TAG DO DISCORD`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `### 🔗 Opção 1 — Link na Bio\n` +
      `> Coloque **\`discord.gg/pafo1\`** na sua **bio do Discord**`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**🎁 Recompensas:**\n` +
      `> 🎰 **Mais chances** em todos os sorteios\n` +
      `> 🏷️ **Cargo exclusivo** de apoiador da PAFO\n` +
      `> ⏱️ **Cargo temporário** por **3 dias** à sua escolha:\n` +
      `>   → 🔍 Olheiro **|** ⚔️ Scrim Hoster **|** 📸 Pic Perm`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `### 🏷️ Opção 2 — Tag do Servidor\n` +
      `> Adote a tag **\`PAFO\`** no seu perfil do Discord`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**🎁 Recompensas:**\n` +
      `> 🎰 **Mais chances** em todos os sorteios\n` +
      `> 🏷️ **Cargo exclusivo** de apoiador da PAFO`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `### 📋 Como resgatar?\n` +
      `> **1.** Coloque o link na bio **ou** adote a tag PAFO\n` +
      `> **2.** Abra um ticket com um **print** comprovando\n` +
      `> **3.** A staff verificará e liberará suas recompensas!\n\n` +
      `-# ⚠️ Remover o link/tag resulta na remoção automática dos benefícios.`
    ))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# © 2026 PAFO — Bio Reward System`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setURL("https://discord.com/channels/1449061779060687063/1449068500567068804").setLabel("Resgatar Recompensas").setStyle(ButtonStyle.Link).setEmoji("🎁")
    ));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

async function cmdParceria(channel) {
  const c = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ***P.A.F.O***`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `***Welcome to PAFO! The largest server for finding friendly matches in all of MPS and TCS, where you can search for teams, players, friendly matches, futsal games, loans, etc.\n` +
      `A reconstruction of the old PAFO group with 4500 members, we now have over 3000 people looking for the same thing you're looking for!\n` +
      `And on top of all that, we have a tournament every month, bringing more competitiveness to the server.***\n\n` +
      `*And you? What are you waiting for? Come in and take your team to the top of the classic Soccer!*`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**🔗 https://discord.gg/GF5taZTAkB**\n*@everyone @here*`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `## 📋 Requisitos para Parceria\n\n` +
      `> 🔴 **1 — 999 membros** → Sem parceria\n` +
      `> 🟡 **1.000 — 1.999 membros** → @here\n` +
      `> 🟢 **2.000+ membros** → @everyone\n\n` +
      `-# *Não aceitamos parceiros com menos de 1.000 membros.*\n\n` +
      `***@everyone @here***`
    ))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# © 2026 PAFO — Parcerias`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setURL("https://discord.com/channels/1449061779060687063/1449068500567068804").setLabel("Solicitar Parceria").setStyle(ButtonStyle.Link).setEmoji("🤝")
    ));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

client.login(TOKEN);