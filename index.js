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

const TOKEN     = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID ?? ""; // Adicione CLIENT_ID no seu .env

const VERIFIED_ROLE_ID     = "1464623361626734637";
const WELCOME_CHANNEL_ID   = "1449067457082949752";
const LOG_CHANNEL_ID       = "1449525327175880865";
const REVIEW_CHANNEL_ID    = "1462534733270614239";
const FREEAGENT_CHANNEL_ID = "1461773344620941534";
const LOJA_CHANNEL_ID      = "1449518786825814036";
const TICKET_CATEGORY_ID   = "";
const GUILD_ID             = "1449061779060687063";
const STAFF_ROLES = ["1449062440183664701","1449064374177104074","1454100805496868906"];
const SERVER_ICON = "https://cdn.discordapp.com/icons/1449061779060687063/ecbd3ce76f39128b1ec08154e7faff75.png?size=2048";

const BANNERS = {
  welcome : "https://cdn.discordapp.com/attachments/1462471559032865115/1474215814038159410/imagem_2026-02-19_222715260-Photoroom.png",
  verify  : "https://cdn.discordapp.com/attachments/1462471559032865115/1474218682153566371/imagem_2026-02-19_223847173-Photoroom.png",
  rules   : "https://cdn.discordapp.com/attachments/1462471559032865115/1474220153192579326/imagem_2026-02-19_224443203-Photoroom.png",
  booster : "https://cdn.discordapp.com/attachments/1462471559032865115/1474221722369523723/imagem_2026-02-19_225105139-Photoroom.png",
  info    : "https://cdn.discordapp.com/attachments/1462471559032865115/1474221395520262196/imagem_2026-02-19_224936676-Photoroom.png",
  loja    : "https://cdn.discordapp.com/attachments/1469069997975535646/1474425406764351512/imagem_2026-02-20_122018758-Photoroom.png",
  ticket  : "https://cdn.discordapp.com/attachments/1469069997975535646/1474427362362916955/imagem_2026-02-20_122753297-Photoroom.png",
};

// ─── Port lock ────────────────────────────────────────────────────────
import { createServer } from "net";
const lockServer = createServer();
lockServer.on("error", () => {
  console.error("❌ Bot já está rodando! Feche a instância anterior e tente novamente.");
  process.exit(1);
});
lockServer.listen(19876, "127.0.0.1");

// ─── Client ───────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
});

client.once("ready", async () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
  await registerSlashCommands();
  checkTempRoles();
  setInterval(checkTempRoles, 60_000);
});

// ─── Slash Commands ───────────────────────────────────────────────────
async function registerSlashCommands() {
  if (!CLIENT_ID) {
    console.warn("⚠️  CLIENT_ID não definido. Slash commands não registrados.");
    return;
  }
  const commands = [
    new SlashCommandBuilder()
      .setName("setroletemp")
      .setDescription("Dá um cargo temporário a um membro")
      .addUserOption(o => o.setName("usuario").setDescription("Membro que receberá o cargo").setRequired(true))
      .addRoleOption(o => o.setName("cargo").setDescription("Cargo a conceder").setRequired(true))
      .addIntegerOption(o => o.setName("dias").setDescription("Dias de duração").setRequired(true).setMinValue(1).setMaxValue(30))
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .toJSON(),
  ];
  try {
    const rest = new REST({ version: "10" }).setToken(TOKEN);
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("✅ Slash commands registrados.");
  } catch (e) { console.error("Erro ao registrar slash commands:", e); }
}

// ─── Persistence helpers ──────────────────────────────────────────────
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

// ─── Temp Roles checker ───────────────────────────────────────────────
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

// ─── BRT date helper ──────────────────────────────────────────────────
function getBRT() {
  return new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── Runtime state ────────────────────────────────────────────────────
const handled        = new Set();
const cmdCooldown    = new Set();
const ticketOpening  = new Set();
const claimedTickets = new Set();
// channelId → { ticketName, openerId, label, dateStr, claimerId, ratedSent }
const ticketData     = new Map();

// ─── guildMemberAdd ───────────────────────────────────────────────────
client.on("guildMemberAdd", async (member) => {
  const ch = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (ch) await sendWelcome(ch, member);
});

// ─── Text commands (admin only) ───────────────────────────────────────
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  if (handled.has(message.id)) return;
  handled.add(message.id);
  setTimeout(() => handled.delete(message.id), 10_000);

  const member = message.member;
  if (!member?.permissions.has(PermissionFlagsBits.Administrator)) return;

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

// ─── !freeagent (qualquer membro) ────────────────────────────────────
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  if (!message.content.trim().toLowerCase().startsWith("!freeagent")) return;

  const member = message.member;
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
});

// ─── Staff check ──────────────────────────────────────────────────────
function isStaff(member) {
  return STAFF_ROLES.some(id => member.roles.cache.has(id)) || member.permissions.has(PermissionFlagsBits.Administrator);
}

// ─── Interactions ─────────────────────────────────────────────────────
client.on("interactionCreate", (i) => handleInteraction(i).catch(e => console.error("Erro interaction:", e)));

async function handleInteraction(interaction) {

  // ── /setroletemp ─────────────────────────────────────────────────────
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

  // ── Verificação ───────────────────────────────────────────────────────
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

  // ── Ticket select ─────────────────────────────────────────────────────
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

  // ── Confirmar ticket ──────────────────────────────────────────────────
  if (interaction.isButton() && interaction.customId.startsWith("ticket_confirm_")) {
    const tipo   = interaction.customId.replace("ticket_confirm_", "");
    const labels = { duvidas:"Dúvidas", parcerias:"Parcerias", compras:"Compras", denuncias:"Denúncias", outros:"Outros" };
    const label  = labels[tipo] ?? tipo;
    const guild  = interaction.guild;
    const user   = interaction.user;

    if (ticketOpening.has(user.id))
      return interaction.reply({ content: "⏳ Já existe um ticket sendo criado. Aguarde.", flags: MessageFlags.Ephemeral });
    ticketOpening.add(user.id);

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
    catch (e) { console.error("Erro ao criar canal:", e); ticketOpening.delete(user.id); return; }
    ticketOpening.delete(user.id);

    const dateStr = getBRT();
    ticketData.set(ticketCh.id, { ticketName, openerId: user.id, label, dateStr, claimerId: null, ratedSent: false });

    interaction.reply({ content: `✅ Ticket criado: <#${ticketCh.id}>`, flags: MessageFlags.Ephemeral }).catch(() => {});

    const staffMentions = STAFF_ROLES.map(id => `<@&${id}>`).join(" ");
    await ticketCh.send({ content: `<@${user.id}> ${staffMentions}`, allowedMentions: { parse: ["users","roles"] } });

    const c = new ContainerBuilder()
      .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎫 Ticket Aberto`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `**Nome do Ticket:** \`${ticketName}\`\n**Criado Por:** <@${user.id}>\n**Opened Date:** ${dateStr}\n**Ticket Type:** ${label}`
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

    guild.channels.cache.get(LOG_CHANNEL_ID)?.send({ embeds: [new EmbedBuilder()
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

  // ── Painel Staff ──────────────────────────────────────────────────────
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

  // ── Painel Membro ─────────────────────────────────────────────────────
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

  // ── Staff actions ─────────────────────────────────────────────────────
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

  // ── Member actions ────────────────────────────────────────────────────
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

  // ── Fechar ticket ─────────────────────────────────────────────────────
  if (interaction.isButton() && interaction.customId.startsWith("ticket_close_")) {
    if (!isStaff(interaction.member))
      return interaction.reply({ content: "❌ Apenas a staff pode fechar tickets.", flags: MessageFlags.Ephemeral });

    const parts    = interaction.customId.split("_");
    const openerId = parts[3] ?? null;

    claimedTickets.delete(interaction.channel.id);
    await interaction.reply({ content: "🔒 Ticket será deletado em **5 segundos**.", flags: MessageFlags.Ephemeral });

    const closing = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `## 🔒 Ticket Sendo Fechado\n\n> Fechado por <@${interaction.user.id}>\n> Deletado em **5 segundos.**`
      ))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`));
    await interaction.channel.send({ components: [closing], flags: MessageFlags.IsComponentsV2 });

    const ch         = interaction.channel;
    const data       = ticketData.get(ch.id);
    const ticketName = data?.ticketName ?? ch.name;
    const claimerId  = data?.claimerId  ?? null;
    const alreadySent = data?.ratedSent ?? false;
    const dateStr    = getBRT();

    // Transcript
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
          { name: "Data",       value: dateStr,                                           inline: true },
        )
        .setColor(0xED4245).setFooter({ text: "PAFO — Ticket System", iconURL: SERVER_ICON }).setTimestamp()
      ],
      files: [file]
    });

    // DM de avaliação — apenas 1 vez por ticket
    if (openerId && !alreadySent) {
      if (data) data.ratedSent = true;
      const opener = await interaction.guild.members.fetch(openerId).catch(() => null);
      if (opener) {
        const dmC = new ContainerBuilder()
          .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🔒 Seu Ticket Foi Encerrado`))
          .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(
            `**Ticket:** \`${ticketName}\`\n**Fechado por:** <@${interaction.user.id}>\n**Data:** ${dateStr}`
          ))
          .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`⭐ **Como foi o nosso atendimento?**\nAvalie clicando em uma das opções abaixo:`))
          .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`))
          .addActionRowComponents(new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`rate_${ticketName}_${openerId}_${claimerId ?? interaction.user.id}_1`).setLabel("⭐ 1").setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId(`rate_${ticketName}_${openerId}_${claimerId ?? interaction.user.id}_2`).setLabel("⭐ 2").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId(`rate_${ticketName}_${openerId}_${claimerId ?? interaction.user.id}_3`).setLabel("⭐ 3").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId(`rate_${ticketName}_${openerId}_${claimerId ?? interaction.user.id}_4`).setLabel("⭐ 4").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`rate_${ticketName}_${openerId}_${claimerId ?? interaction.user.id}_5`).setLabel("⭐ 5").setStyle(ButtonStyle.Success)
          ));
        await opener.send({ components: [dmC], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
      }
    }

    ticketData.delete(ch.id);
    setTimeout(() => ch.delete().catch(() => {}), 5000);
    return;
  }

  // ── Reivindicar ticket ────────────────────────────────────────────────
  if (interaction.isButton() && interaction.customId.startsWith("ticket_claim_")) {
    if (!isStaff(interaction.member))
      return interaction.reply({ content: "❌ Apenas a staff pode reivindicar tickets.", flags: MessageFlags.Ephemeral });

    const ch = interaction.channel;
    if (claimedTickets.has(ch.id))
      return interaction.reply({ content: "❌ Este ticket já foi reivindicado.", flags: MessageFlags.Ephemeral });
    claimedTickets.add(ch.id);

    await interaction.reply({ content: "✅ Você reivindicou este ticket!", flags: MessageFlags.Ephemeral });

    const [,, channelId, openerId] = interaction.customId.split("_");
    if (ticketData.has(ch.id)) ticketData.get(ch.id).claimerId = interaction.user.id;

    await Promise.all([
      ...STAFF_ROLES.map(rId => ch.permissionOverwrites.edit(rId, { ViewChannel: false }).catch(() => {})),
      ch.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true }).catch(() => {}),
      openerId ? ch.permissionOverwrites.edit(openerId, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true }).catch(() => {}) : null,
    ]);

    const data      = ticketData.get(ch.id);
    const ticketInfo = data
      ? `**Nome do Ticket:** \`${data.ticketName}\`\n**Criado Por:** <@${data.openerId}>\n**Opened Date:** ${data.dateStr}\n**Ticket Type:** ${data.label}`
      : `**Criado Por:** <@${openerId}>`;

    const updated = new ContainerBuilder()
      .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎫 Ticket Aberto`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(ticketInfo))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`))
      .addActionRowComponents(new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`ticket_close_${ch.id}_${openerId}`).setLabel("Fechar Ticket").setStyle(ButtonStyle.Danger).setEmoji("🔒"),
        new ButtonBuilder().setCustomId(`claimed_by_${interaction.user.id}`).setLabel(`Atendido por ${interaction.user.displayName}`).setStyle(ButtonStyle.Secondary).setEmoji("👤").setDisabled(true)
      ))
      .addActionRowComponents(new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`panel_staff_${ch.id}_${openerId}`).setLabel("Painel Staff").setStyle(ButtonStyle.Secondary).setEmoji({ id:"1436350133884293221", name:"icon_suplente_mod_1" }),
        new ButtonBuilder().setCustomId(`panel_member_${ch.id}_${openerId}`).setLabel("Painel Membro").setStyle(ButtonStyle.Secondary).setEmoji("👤")
      ));

    await interaction.message.edit({ components: [updated], flags: MessageFlags.IsComponentsV2 }).catch(console.error);

    const notice = new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `### 🤝 Atendimento Iniciado\n> <@${interaction.user.id}> é o responsável por este ticket.`
    ));
    await ch.send({ components: [notice], flags: MessageFlags.IsComponentsV2 });
    return;
  }

  // ── Free Agent helper ─────────────────────────────────────────────────
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

  // ── FA Contratar ──────────────────────────────────────────────────────
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

  // ── FA Saber Mais ─────────────────────────────────────────────────────
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

  // ── Avaliação (DM) ────────────────────────────────────────────────────
  if (interaction.isButton() && interaction.customId.startsWith("rate_")) {
    const parts      = interaction.customId.split("_");
    const nota       = parseInt(parts[parts.length - 1]);
    const claimerId  = parts[parts.length - 2];
    const openerId   = parts[parts.length - 3];
    const ticketName = parts.slice(1, parts.length - 3).join("_");

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

    const guild   = await client.guilds.fetch(GUILD_ID).catch(() => null);
    const revCh   = guild ? await guild.channels.fetch(REVIEW_CHANNEL_ID).catch(() => null) : null;
    if (revCh) {
      const rev = new ContainerBuilder()
        .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ⭐ Nova Avaliação de Atendimento`))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `**Ticket:** \`${ticketName}\`\n**Membro:** <@${openerId}>\n**Nota:** ${stars} **(${nota}/5)**\n**Staff:** <@${claimerId}>\n**Data:** ${dateStr}`
        ))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`));
      await revCh.send({ components: [rev], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
    }
    return;
  }
}

// ══════════════════════════════════════════════════════════════════════
//  Funções de comando
// ══════════════════════════════════════════════════════════════════════

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
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`🔗 **Servidor de Appeal:** https://discord.gg/8eAK5xVHPY`))
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

// ─── NOVO: !olheiro-rules ─────────────────────────────────────────────
async function cmdOlheiroRules(channel) {
  const c = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🔍 REGRAS PARA OLHEIROS — PAFO`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**📋 Regras de Conduta:**\n` +
      `> • Enviar o link do servidor privado **no máximo 2 vezes**\n` +
      `> • **Proibido** enviar link de times\n` +
      `> • Respeite os jogadores durante a peneira\n` +
      `> • Mantenha clareza na divulgação`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**📝 Modelo de mensagem para peneiras:**\n\n` +
      "```\n" +
      "# PENEIRA NOBRE!\n" +
      "**O real nobres está atrás de novas lendas!**\n\n" +
      "# regras\n" +
      "**- não hoggar\n" +
      "- não fazer Ts\n" +
      "- skille se puder\n" +
      "- tocar independente de tudo\n" +
      "- não passar fome**\n\n" +
      "Link: https://www.roblox.com/share?code=SEU_CODIGO&type=Server\n" +
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

// ─── NOVO: !scrimhoster-rules ─────────────────────────────────────────
async function cmdScrimHosterRules(channel) {
  const c = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ⚔️ REGRAS PARA SCRIM HOSTERS — PAFO`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**📋 Regras de Conduta:**\n` +
      `> • Enviar o link do servidor privado **no máximo 2 vezes**\n` +
      `> • **Proibido** enviar link de times\n` +
      `> • Informe estádio, modo de jogo e juiz no anúncio\n` +
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
      "https://www.roblox.com/share?code=SEU_CODIGO&type=Server\n" +
      "@everyone @here\n" +
      "```"
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**🛒 Como obter o cargo de Scrim Hoster?**\n` +
      `> Veja a loja em <#${LOJA_CHANNEL_ID}> e compre por **300 Robux**.\n` +
      `> ⚠️ Precisa do cargo **Olheiro** para realizar peneiras.\n` +
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

// ─── NOVO: !drops ─────────────────────────────────────────────────────
async function cmdDrops(channel) {
  const c = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎁 DROP DA PAFO`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `### 🏆 Drop de Olheiro, Scrim Hoster ou Pic Perm!\n\n` +
      `> 🕐 **Drops acontecem a cada 2 horas!**\n` +
      `> 🎯 O vencedor escolhe **um** dos cargos abaixo:\n\n` +
      `> 🔍 **Olheiro** — Realize peneiras oficiais\n` +
      `> ⚔️ **Scrim Hoster** — Organize scrims oficiais\n` +
      `> 📸 **Pic Perm** — Envie imagens onde não é permitido`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**🤔 Qual será o próximo sortudo?**\nFique ligado e seja o próximo a ganhar!\n\n` +
      `✅ **Se ganhar:** Abra um ticket para resgatar seu cargo!`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# © 2026 PAFO — Drops System`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setURL("https://discord.com/channels/1449061779060687063/1449068500567068804").setLabel("Resgatar Prêmio").setStyle(ButtonStyle.Link).setEmoji("🎁")
    ));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

// ─── NOVO: !bio-reward ────────────────────────────────────────────────
async function cmdBioReward(channel) {
  const c = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🌟 RECOMPENSAS EXCLUSIVAS — BIO & TAG DO DISCORD`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))

    // Opção 1: Link na bio
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

    // Opção 2: Tag do servidor
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

    // Como resgatar
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

// ─── NOVO: !parceria ──────────────────────────────────────────────────
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