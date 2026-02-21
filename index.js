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
} from "discord.js";

const TOKEN = process.env.TOKEN;
const VERIFIED_ROLE_ID    = "1464623361626734637";
const WELCOME_CHANNEL_ID  = "1449067457082949752";
const LOG_CHANNEL_ID      = "1449525327175880865";
const REVIEW_CHANNEL_ID    = "1462534733270614239"; // canal público de avaliações
const FREEAGENT_CHANNEL_ID = "1461773344620941534"; // canal de free agents
const TICKET_CATEGORY_ID   = "";
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

import { createServer } from "net";
const lockServer = createServer();
lockServer.on("error", () => {
  console.error("❌ Bot já está rodando! Feche a instância anterior (taskkill /F /IM node.exe) e tente novamente.");
  process.exit(1);
});
lockServer.listen(19876, "127.0.0.1");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
});

client.once("ready", () => console.log(`✅ Bot online: ${client.user.tag}`));

client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (channel) await sendWelcome(channel, member);
});

import { readFileSync, writeFileSync } from "fs";

function loadTicketCount() {
  try {
    const raw  = readFileSync("./ticketcount.json", "utf8");
    const data = JSON.parse(raw);
    return typeof data.count === "number" ? data.count : 0;
  } catch {
    // Arquivo ainda não existe — cria com 0 e avisa no console
    writeFileSync("./ticketcount.json", JSON.stringify({ count: 0 }, null, 2));
    console.log("⚠️  ticketcount.json criado do zero. Contagem iniciada em 0.");
    return 0;
  }
}
function saveTicketCount(n) {
  writeFileSync("./ticketcount.json", JSON.stringify({ count: n }, null, 2));
}

// ─── Memória em runtime ───────────────────────────────────────────────
const handled        = new Set();
const cmdCooldown    = new Set();
const ticketOpening  = new Set();
const claimedTickets = new Set();

// Guarda dados do ticket: channelId → { ticketName, openerId, label, dateStr, claimerIdId }
const ticketData     = new Map();


// ─── Comandos ────────────────────────────────────────────────────────
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  if (handled.has(message.id)) return;
  handled.add(message.id);
  setTimeout(() => handled.delete(message.id), 10000);

  const member = message.member;
  if (!member || !member.permissions.has(PermissionFlagsBits.Administrator)) return;

  const content = message.content.trim().toLowerCase();
  const cmds = ["!verify","!rules","!booster","!info","!welcome","!loja","!ticket","!friendlys"];
  if (!cmds.includes(content)) return;

  const cooldownKey = `${message.channel.id}_${content}`;
  if (cmdCooldown.has(cooldownKey)) return;
  cmdCooldown.add(cooldownKey);
  setTimeout(() => cmdCooldown.delete(cooldownKey), 5000);

  await message.delete().catch(() => {});
  if (content === "!verify")   return cmdVerify(message.channel);
  if (content === "!rules")    return cmdRules(message.channel);
  if (content === "!booster")  return cmdBooster(message.channel);
  if (content === "!info")     return cmdInfo(message.channel);
  if (content === "!welcome")  return sendWelcome(message.channel, message.member);
  if (content === "!loja")     return cmdLoja(message.channel);
  if (content === "!ticket")   return cmdTicket(message.channel);
  if (content === "!friendlys") return cmdFriendlys(message.channel);
});


// ─── Comando !freeagent (qualquer membro) ────────────────────────────
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  if (!message.content.trim().toLowerCase().startsWith("!freeagent")) return;

  const member = message.member;
  if (!member) return;

  // Cooldown por usuário (30s)
  const cdKey = `fa_${member.id}`;
  if (cmdCooldown.has(cdKey)) {
    const warn = await message.reply({ content: "⏳ Aguarde antes de postar outro anúncio." }).catch(() => null);
    setTimeout(() => warn?.delete().catch(() => {}), 5000);
    return;
  }

  const raw  = message.content.trim().slice("!freeagent".length).trim();
  const args = raw.split(",").map(s => s.trim());

  if (args.length < 5 || args.some(a => !a)) {
    const warn = await message.reply({
      content:
        "❌ **Uso correto:**\n" +
        "`!freeagent <experiências>, <habilidades>, <posição>, <dispositivo>, <observações>`\n\n" +
        "**Exemplo:**\n" +
        "`!freeagent 5 anos de mps, incrivel, st cdm cm, PC, bom p krl!`"
    }).catch(() => null);
    setTimeout(() => warn?.delete().catch(() => {}), 10000);
    return;
  }

  const [experiencias, habilidades, posicao, dispositivo, observacoes] = args;

  // customId só carrega userId + messageId (resolvido depois buscando a mensagem)
  // messageId ainda não existe — usamos um placeholder, editamos após enviar
  cmdCooldown.add(cdKey);
  setTimeout(() => cmdCooldown.delete(cdKey), 30000);

  await message.delete().catch(() => {});

  const faCh = message.guild.channels.cache.get(FREEAGENT_CHANNEL_ID);
  if (!faCh) return;

  // Envia primeiro com botões temporários, depois edita com o msgId real
  const placeholder = "00000000000000000";
  const c = new ContainerBuilder()
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
      new ButtonBuilder().setCustomId(`fac_${member.id}_${placeholder}`).setLabel("Contratar").setStyle(ButtonStyle.Success).setEmoji("🤝"),
      new ButtonBuilder().setCustomId(`fas_${member.id}_${placeholder}`).setLabel("Saber Mais").setStyle(ButtonStyle.Secondary).setEmoji("📋")
    ));

  const sent = await faCh.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
  if (!sent) return;

  // Edita com o msgId real nos botões
  const msgId = sent.id;
  const c2 = new ContainerBuilder()
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

  await sent.edit({ components: [c2], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
});

function isStaffMember(member) {
  return STAFF_ROLES.some(id => member.roles.cache.has(id)) || member.permissions.has(PermissionFlagsBits.Administrator);
}

// ─── Interactions ─────────────────────────────────────────────────────
client.on("interactionCreate", (interaction) => {
  handleInteraction(interaction).catch((e) => console.error("Erro interaction:", e));
});

async function handleInteraction(interaction) {

  // ── Verificação ──────────────────────────────────────────────────────
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
        `**🔒 Segurança**\nA verificação garante que apenas pessoas reais acessem o servidor.\n\n` +
        `**🚫 Anti-Alt**\nImpedimos o uso de contas alternativas para burlar punições.\n\n` +
        `**🌐 Comunidade Organizada**\nUma comunidade verificada é mais segura e agradável para todos.\n\n` +
        `**🛡️ Proteção contra Spam**\nBots e contas de spam são bloqueados antes de causar danos.`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# © 2026 PAFO`));
    return interaction.reply({ components: [c], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
  }

  // ── Seleção de tipo de ticket ────────────────────────────────────────
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
        `> • Tickets sem resposta por **12 horas** serão fechados por inatividade\n` +
        `> • Mantenha o respeito em todas as situações\n` +
        `> • Em denúncias, envie provas *(prints, vídeos, links)*\n` +
        `> • Apenas você e a staff podem enviar mensagens no ticket\n` +
        `> • Em caso de denúncias por racismo, o usuário precisa estar no servidor`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ⚠️ O descumprimento dessas regras pode resultar em fechamento do ticket ou punições adicionais.`))
      .addActionRowComponents(new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`ticket_confirm_${tipo}`).setLabel("Confirmar e Abrir Ticket").setStyle(ButtonStyle.Success).setEmoji("✅"),
        new ButtonBuilder().setCustomId("ticket_cancel").setLabel("Cancelar").setStyle(ButtonStyle.Danger).setEmoji("❌")
      ));
    return interaction.reply({ components: [c], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
  }

  if (interaction.isButton() && interaction.customId === "ticket_cancel") {
    return interaction.reply({ content: "❌ Cancelado.", flags: MessageFlags.Ephemeral });
  }

  // ── Confirmar abertura de ticket ─────────────────────────────────────
  if (interaction.isButton() && interaction.customId.startsWith("ticket_confirm_")) {
    const tipo   = interaction.customId.replace("ticket_confirm_", "");
    const labels = { duvidas: "Dúvidas", parcerias: "Parcerias", compras: "Compras", denuncias: "Denúncias", outros: "Outros" };
    const label  = labels[tipo] ?? tipo;
    const guild  = interaction.guild;
    const user   = interaction.user;

    if (ticketOpening.has(user.id))
      return interaction.reply({ content: "⏳ Já existe um ticket sendo criado para você. Aguarde.", flags: MessageFlags.Ephemeral }).catch(() => {});
    ticketOpening.add(user.id);

    const ticketCount = loadTicketCount() + 1;
    saveTicketCount(ticketCount);
    const ticketName = `ticket-${String(ticketCount).padStart(4, "0")}`;

    const permsOverwrites = [
      { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
      { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
      { id: client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ReadMessageHistory] },
    ];
    for (const roleId of STAFF_ROLES) {
      if (guild.roles.cache.get(roleId))
        permsOverwrites.push({ id: roleId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] });
    }

    const channelOptions = { name: ticketName, type: ChannelType.GuildText, permissionOverwrites: permsOverwrites };
    if (TICKET_CATEGORY_ID) channelOptions.parent = TICKET_CATEGORY_ID;

    let ticketChannel;
    try {
      ticketChannel = await guild.channels.create(channelOptions);
    } catch (e) {
      console.error("Erro ao criar canal:", e);
      ticketOpening.delete(user.id);
      return;
    }
    ticketOpening.delete(user.id);

    const now = new Date();
    const dateStr = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

    // Salva dados do ticket na memória
    ticketData.set(ticketChannel.id, { ticketName, openerId: user.id, label, dateStr, claimerId: null });

    interaction.reply({ content: `✅ Ticket criado em: <#${ticketChannel.id}>`, flags: MessageFlags.Ephemeral }).catch(() => {});

    const staffMentions = STAFF_ROLES.map(id => `<@&${id}>`).join(" ");
    await ticketChannel.send({ content: `<@${user.id}> ${staffMentions}`, allowedMentions: { parse: ["users", "roles"] } });

    // Container do ticket com 3 botões + painéis
    const c = new ContainerBuilder()
      .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎫 Ticket Aberto`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `**Nome do Ticket:** \`${ticketName}\`\n**Criado Por:** <@${user.id}>\n**Opened Date:** ${dateStr}\n**Ticket Type:** ${label}`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`))
      // Linha 1: Fechar + Reivindicar
      .addActionRowComponents(new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`ticket_close_${ticketChannel.id}_${user.id}`).setLabel("Fechar Ticket").setStyle(ButtonStyle.Danger).setEmoji("🔒"),
        new ButtonBuilder().setCustomId(`ticket_claim_${ticketChannel.id}_${user.id}`).setLabel("Reivindicar Ticket").setStyle(ButtonStyle.Primary).setEmoji("📋")
      ))
      // Linha 2: Painéis
      .addActionRowComponents(new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`panel_staff_${ticketChannel.id}_${user.id}`).setLabel("Painel Staff").setStyle(ButtonStyle.Secondary).setEmoji({ id: "1436350133884293221", name: "icon_suplente_mod_1" }),
        new ButtonBuilder().setCustomId(`panel_member_${ticketChannel.id}_${user.id}`).setLabel("Painel Membro").setStyle(ButtonStyle.Secondary).setEmoji("👤")
      ));

    await ticketChannel.send({ components: [c], flags: MessageFlags.IsComponentsV2, allowedMentions: { parse: [] } });

    const logCh = guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logCh) {
      await logCh.send({ embeds: [new EmbedBuilder()
        .setTitle("🎫 Ticket Aberto")
        .addFields(
          { name: "Canal",      value: `<#${ticketChannel.id}>`, inline: true },
          { name: "Criado por", value: `<@${user.id}>`,          inline: true },
          { name: "Tipo",       value: label,                    inline: true },
          { name: "Data",       value: dateStr,                  inline: true },
        )
        .setColor(0x57F287).setFooter({ text: "PAFO — Ticket System", iconURL: SERVER_ICON }).setTimestamp()
      ]});
    }
    return;
  }

  // ── Painel Staff ─────────────────────────────────────────────────────
  if (interaction.isButton() && interaction.customId.startsWith("panel_staff_")) {
    if (!isStaffMember(interaction.member))
      return interaction.reply({ content: "❌ Apenas a staff pode usar o Painel Staff.", flags: MessageFlags.Ephemeral });

    const parts     = interaction.customId.split("_");
    const channelId = parts[2];
    const openerId  = parts[3];

    const select = new StringSelectMenuBuilder()
      .setCustomId(`staff_action_${channelId}_${openerId}`)
      .setPlaceholder("Selecione o que deseja fazer")
      .addOptions(
        new StringSelectMenuOptionBuilder().setLabel("Notificar Membro").setDescription("Envia um ping na DM do membro").setValue("notify_member").setEmoji("🔔"),
        new StringSelectMenuOptionBuilder().setLabel("Adicionar Membro").setDescription("Adiciona um membro ao ticket").setValue("add_member").setEmoji("➕"),
        new StringSelectMenuOptionBuilder().setLabel("Remover Membro").setDescription("Remove um membro do ticket").setValue("remove_member").setEmoji("➖")
      );

    const c = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `## ⚙️ Painel Staff\n` +
        `Controle o ticket com as opções abaixo:`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `> 🔔 **Notificar Membro** — Envia uma mensagem na DM do membro\n` +
        `> ➕ **Adicionar Membro** — Adiciona alguém ao ticket\n` +
        `> ➖ **Remover Membro** — Remove alguém do ticket`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Painel Staff`))
      .addActionRowComponents(new ActionRowBuilder().addComponents(select));

    return interaction.reply({ components: [c], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
  }

  // ── Painel Membro ────────────────────────────────────────────────────
  if (interaction.isButton() && interaction.customId.startsWith("panel_member_")) {
    const parts    = interaction.customId.split("_");
    const channelId = parts[2];
    const openerId  = parts[3];

    // Só o dono do ticket pode usar
    if (interaction.user.id !== openerId)
      return interaction.reply({ content: "❌ Apenas quem abriu o ticket pode usar o Painel Membro.", flags: MessageFlags.Ephemeral });

    const select = new StringSelectMenuBuilder()
      .setCustomId(`member_action_${channelId}_${openerId}`)
      .setPlaceholder("Selecione o que deseja fazer")
      .addOptions(
        new StringSelectMenuOptionBuilder().setLabel("Notificar Staff").setDescription("Envia um ping para a staff no canal").setValue("notify_staff").setEmoji("🔔")
      );

    const c = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `## 👤 Painel Membro\n` +
        `Use as opções abaixo para interagir com a staff:`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `> 🔔 **Notificar Staff** — Envia um ping para a staff no canal do ticket`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Painel Membro`))
      .addActionRowComponents(new ActionRowBuilder().addComponents(select));

    return interaction.reply({ components: [c], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
  }

  // ── Ações do Painel Staff ────────────────────────────────────────────
  if (interaction.isStringSelectMenu() && interaction.customId.startsWith("staff_action_")) {
    const parts     = interaction.customId.split("_");
    const channelId = parts[2];
    const openerId  = parts[3];
    const action    = interaction.values[0];
    const ch        = interaction.guild.channels.cache.get(channelId);

    if (action === "notify_member") {
      // Defer primeiro para evitar timeout do Discord
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const opener = await interaction.guild.members.fetch(openerId).catch(() => null);
      if (!opener) return interaction.editReply({ content: "❌ Não foi possível encontrar o membro." });

      const dmContainer = new ContainerBuilder()
        .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🔔 Notificação do Ticket`))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `Olá, <@${openerId}>!\n\n` +
          `A staff entrou em contato referente ao seu ticket.\n` +
          `Por favor, acesse o canal do ticket para continuar o atendimento.`
        ))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`));

      const sent = await opener.send({ components: [dmContainer], flags: MessageFlags.IsComponentsV2 }).catch(() => null);
      if (!sent) return interaction.editReply({ content: "❌ Não foi possível enviar DM para o membro (DMs fechadas)." });
      return interaction.editReply({ content: "✅ Membro notificado na DM com sucesso!" });
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

  // ── Modal: Adicionar membro ──────────────────────────────────────────
  if (interaction.isModalSubmit() && interaction.customId.startsWith("modal_add_")) {
    const channelId = interaction.customId.replace("modal_add_", "");
    const memberId  = interaction.fields.getTextInputValue("member_id").trim();
    const ch        = interaction.guild.channels.cache.get(channelId);
    if (!ch) return interaction.reply({ content: "❌ Canal não encontrado.", flags: MessageFlags.Ephemeral });

    const target = await interaction.guild.members.fetch(memberId).catch(() => null);
    if (!target) return interaction.reply({ content: "❌ Usuário não encontrado. Verifique o ID.", flags: MessageFlags.Ephemeral });

    await ch.permissionOverwrites.edit(memberId, {
      ViewChannel: true, SendMessages: true, ReadMessageHistory: true
    }).catch(() => {});

    const notice = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `### ➕ Membro Adicionado\n> <@${memberId}> foi adicionado ao ticket por <@${interaction.user.id}>.`
      ));
    await ch.send({ components: [notice], flags: MessageFlags.IsComponentsV2 });
    return interaction.reply({ content: `✅ <@${memberId}> adicionado ao ticket!`, flags: MessageFlags.Ephemeral });
  }

  // ── Modal: Remover membro ────────────────────────────────────────────
  if (interaction.isModalSubmit() && interaction.customId.startsWith("modal_remove_")) {
    const channelId = interaction.customId.replace("modal_remove_", "");
    const memberId  = interaction.fields.getTextInputValue("member_id").trim();
    const ch        = interaction.guild.channels.cache.get(channelId);
    if (!ch) return interaction.reply({ content: "❌ Canal não encontrado.", flags: MessageFlags.Ephemeral });

    await ch.permissionOverwrites.edit(memberId, { ViewChannel: false }).catch(() => {});

    const notice = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `### ➖ Membro Removido\n> <@${memberId}> foi removido do ticket por <@${interaction.user.id}>.`
      ));
    await ch.send({ components: [notice], flags: MessageFlags.IsComponentsV2 });
    return interaction.reply({ content: `✅ <@${memberId}> removido do ticket!`, flags: MessageFlags.Ephemeral });
  }

  // ── Ação do Painel Membro ────────────────────────────────────────────
  if (interaction.isStringSelectMenu() && interaction.customId.startsWith("member_action_")) {
    const parts     = interaction.customId.split("_");
    const channelId = parts[2];
    const openerId  = parts[3];
    const action    = interaction.values[0];
    const ch        = interaction.guild.channels.cache.get(channelId);

    if (action === "notify_staff") {
      if (!ch) return interaction.reply({ content: "❌ Canal não encontrado.", flags: MessageFlags.Ephemeral });
      const staffMentions = STAFF_ROLES.map(id => `<@&${id}>`).join(" ");

      // 1. Mensagem separada só com o ping (sem flags IsComponentsV2) para o ping funcionar
      await ch.send({ content: staffMentions, allowedMentions: { parse: ["roles"] } });

      // 2. Container visual separado
      const notifyContainer = new ContainerBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `### 🔔 Staff Notificada\n> <@${openerId}> está aguardando atendimento!`
        ));
      await ch.send({ components: [notifyContainer], flags: MessageFlags.IsComponentsV2 });

      return interaction.reply({ content: "✅ Staff notificada no canal!", flags: MessageFlags.Ephemeral });
    }
  }

  // ── Fechar ticket ────────────────────────────────────────────────────
  if (interaction.isButton() && interaction.customId.startsWith("ticket_close_")) {
    if (!isStaffMember(interaction.member))
      return interaction.reply({ content: "❌ Apenas a staff pode fechar tickets.", flags: MessageFlags.Ephemeral });

    const parts   = interaction.customId.split("_");
    const openerId = parts[3] ?? null;

    claimedTickets.delete(interaction.channel.id);

    await interaction.reply({ content: "🔒 Você fechou o ticket. O canal será deletado em **5 segundos**.", flags: MessageFlags.Ephemeral });

    const closeContainer = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `## 🔒 Ticket Sendo Fechado\n\n> Fechado por <@${interaction.user.id}>\n> Este canal será **deletado em 5 segundos.**`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`));
    await interaction.channel.send({ components: [closeContainer], flags: MessageFlags.IsComponentsV2 });

    const closedChannel = interaction.channel;
    const data          = ticketData.get(closedChannel.id);
    const ticketName    = data?.ticketName ?? closedChannel.name;
    const claimerId     = data?.claimerId  ?? null;
    const logCh         = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);

    // ─ Transcript ─
    let transcriptText = `📄 TRANSCRIPT DO TICKET: ${closedChannel.name}\nFechado por: ${interaction.user.tag}\n\n`;
    try {
      const messages  = await closedChannel.messages.fetch({ limit: 100 });
      const msgsArray = Array.from(messages.values()).reverse();
      msgsArray.forEach(m => {
        const time    = m.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        const author  = m.author ? m.author.tag : "Desconhecido";
        const content = m.content || "[Mensagem sem texto, mídia ou embed]";
        transcriptText += `[${time}] ${author}: ${content}\n`;
      });
    } catch (err) {
      console.error("Erro ao gerar transcript:", err);
      transcriptText += "\n⚠️ Erro ao carregar o histórico completo.";
    }
    const transcriptAttachment = new AttachmentBuilder(Buffer.from(transcriptText, "utf-8"), { name: `transcript-${closedChannel.name}.txt` });

    const now     = new Date();
    const dateStr = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

    if (logCh) {
      await logCh.send({
        embeds: [new EmbedBuilder()
          .setTitle("🔒 Ticket Fechado")
          .addFields(
            { name: "Canal",      value: closedChannel.name,                           inline: true },
            { name: "Fechado por",value: `<@${interaction.user.id}>`,                  inline: true },
            { name: "Criado por", value: openerId ? `<@${openerId}>` : "Desconhecido", inline: true },
            { name: "Data",       value: dateStr,                                       inline: true },
          )
          .setColor(0xED4245).setFooter({ text: "PAFO — Ticket System", iconURL: SERVER_ICON }).setTimestamp()
        ],
        files: [transcriptAttachment]
      });
    }

    // ─ DM de avaliação para quem abriu o ticket ─
    if (openerId) {
      const opener = await interaction.guild.members.fetch(openerId).catch(() => null);
      if (opener) {
        const dmContainer = new ContainerBuilder()
          .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🔒 Seu Ticket Foi Encerrado`))
          .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(
            `**Ticket:** \`${ticketName}\`\n` +
            `**Fechado por:** <@${interaction.user.id}>\n` +
            `**Data:** ${dateStr}`
          ))
          .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(
            `⭐ **Como foi o nosso atendimento?**\nAvalie clicando em uma das opções abaixo:`
          ))
          .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`))
          .addActionRowComponents(new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`rate_${ticketName}_${openerId}_${claimerId ?? interaction.user.id}_1`).setLabel("⭐ 1").setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId(`rate_${ticketName}_${openerId}_${claimerId ?? interaction.user.id}_2`).setLabel("⭐ 2").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId(`rate_${ticketName}_${openerId}_${claimerId ?? interaction.user.id}_3`).setLabel("⭐ 3").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId(`rate_${ticketName}_${openerId}_${claimerId ?? interaction.user.id}_4`).setLabel("⭐ 4").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`rate_${ticketName}_${openerId}_${claimerId ?? interaction.user.id}_5`).setLabel("⭐ 5").setStyle(ButtonStyle.Success)
          ));

        await opener.send({ components: [dmContainer], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
      }
    }

    ticketData.delete(closedChannel.id);
    setTimeout(() => { closedChannel.delete().catch(() => {}); }, 5000);
    return;
  }

  // ── Reivindicar ticket ───────────────────────────────────────────────
  if (interaction.isButton() && interaction.customId.startsWith("ticket_claim_")) {
    if (!isStaffMember(interaction.member))
      return interaction.reply({ content: "❌ Apenas a staff pode reivindicar tickets.", flags: MessageFlags.Ephemeral });

    const ch = interaction.channel;
    if (claimedTickets.has(ch.id))
      return interaction.reply({ content: "❌ Este ticket já foi reivindicado por outro membro da staff.", flags: MessageFlags.Ephemeral });

    claimedTickets.add(ch.id);
    await interaction.reply({ content: "✅ Você reivindicou este ticket!", flags: MessageFlags.Ephemeral });

    const parts     = interaction.customId.split("_");
    const channelId = parts[2] ?? null;
    const openerId  = parts[3] ?? null;

    // Atualiza claimerId na memória
    if (ticketData.has(ch.id)) {
      ticketData.get(ch.id).claimerId = interaction.user.id;
    }

    await Promise.all([
      ...STAFF_ROLES.map(roleId => ch.permissionOverwrites.edit(roleId, { ViewChannel: false }).catch(() => {})),
      ch.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true }).catch(() => {}),
      openerId ? ch.permissionOverwrites.edit(openerId, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true }).catch(() => {}) : Promise.resolve(),
    ]);

    // Reconstrói container com banner preservado
    const data      = ticketData.get(ch.id);
    const ticketInfo = data
      ? `**Nome do Ticket:** \`${data.ticketName}\`\n**Criado Por:** <@${data.openerId}>\n**Opened Date:** ${data.dateStr}\n**Ticket Type:** ${data.label}`
      : `**Criado Por:** <@${openerId}>`;

    const btnFechar = new ButtonBuilder()
      .setCustomId(`ticket_close_${ch.id}_${openerId}`)
      .setLabel("Fechar Ticket").setStyle(ButtonStyle.Danger).setEmoji("🔒");

    const btnReivindicado = new ButtonBuilder()
      .setCustomId(`claimed_by_${interaction.user.id}`)
      .setLabel(`Atendido por ${interaction.user.displayName}`)
      .setStyle(ButtonStyle.Secondary).setEmoji("👤").setDisabled(true);

    const updatedContainer = new ContainerBuilder()
      .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎫 Ticket Aberto`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(ticketInfo))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`))
      .addActionRowComponents(new ActionRowBuilder().addComponents(btnFechar, btnReivindicado))
      .addActionRowComponents(new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`panel_staff_${ch.id}_${openerId}`).setLabel("Painel Staff").setStyle(ButtonStyle.Secondary).setEmoji({ id: "1436350133884293221", name: "icon_suplente_mod_1" }),
        new ButtonBuilder().setCustomId(`panel_member_${ch.id}_${openerId}`).setLabel("Painel Membro").setStyle(ButtonStyle.Secondary).setEmoji("👤")
      ));

    await interaction.message.edit({ components: [updatedContainer], flags: MessageFlags.IsComponentsV2 }).catch(e => console.error("Erro ao editar:", e));

    const claimNotice = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `### 🤝 Atendimento Iniciado\n> O staff <@${interaction.user.id}> agora é o responsável por este ticket.`
      ));
    await ch.send({ components: [claimNotice], flags: MessageFlags.IsComponentsV2 });
    return;
  }

  // ── Free Agent: helper — lê campos do container da mensagem ─────────
  async function parseFaMessage(channelId, msgId) {
    try {
      const ch  = await client.channels.fetch(channelId).catch(() => null);
      if (!ch) return null;
      const msg = await ch.messages.fetch(msgId).catch(() => null);
      if (!msg) return null;
      // Extrai texto dos TextDisplay components do container
      const texts = [];
      for (const comp of msg.components) {
        if (comp.type === 17) { // Container
          for (const child of comp.components) {
            if (child.type === 10) texts.push(child.content ?? ""); // TextDisplay
          }
        }
      }
      // Campos estão nas posições: 1=jogador,2=exp,3=hab,4=pos,5=disp,6=obs
      const extract = (txt) => txt.includes("→") ? txt.split("→").slice(1).join("→").trim() : txt;
      return {
        userId:       texts[1] ? texts[1].replace(/[^0-9]/g, "").slice(0,20) : null,
        experiencias: texts[2] ? extract(texts[2]) : "—",
        habilidades:  texts[3] ? extract(texts[3]) : "—",
        posicao:      texts[4] ? extract(texts[4]) : "—",
        dispositivo:  texts[5] ? extract(texts[5]) : "—",
        observacoes:  texts[6] ? extract(texts[6]) : "—",
      };
    } catch { return null; }
  }

  // ── Free Agent: Contratar ─────────────────────────────────────────────
  if (interaction.isButton() && interaction.customId.startsWith("fac_")) {
    const parts   = interaction.customId.split("_");
    const userId  = parts[1];
    const msgId   = parts[2];

    if (interaction.user.id === userId)
      return interaction.reply({ content: "❌ Você não pode se contratar.", flags: MessageFlags.Ephemeral });

    const targetMember = await interaction.guild.members.fetch(userId).catch(() => null);
    if (!targetMember) return interaction.reply({ content: "❌ Jogador não encontrado no servidor.", flags: MessageFlags.Ephemeral });

    const dmC = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🤝 Proposta de Contratação`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `Olá, <@${userId}>! 👋

` +
        `<@${interaction.user.id}> viu seu anúncio de **Free Agent** e está interessado em você!

` +
        `📩 **Entre em contato:** <@${interaction.user.id}>
` +
        `🏷️ **Tag:** ${interaction.user.tag}`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Free Agent`));

    const sent = await targetMember.send({ components: [dmC], flags: MessageFlags.IsComponentsV2 }).catch(() => null);
    if (!sent) return interaction.reply({ content: "❌ Não foi possível enviar DM (DMs fechadas).", flags: MessageFlags.Ephemeral });

    const confirmC = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ✅ Proposta Enviada!`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `Sua proposta foi enviada para <@${userId}>!
Aguarde o contato dele no privado. 🎮`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Free Agent`));

    return interaction.reply({ components: [confirmC], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
  }

  // ── Free Agent: Saber Mais ────────────────────────────────────────────
  if (interaction.isButton() && interaction.customId.startsWith("fas_")) {
    const parts  = interaction.customId.split("_");
    const userId = parts[1];
    const msgId  = parts[2];

    const fa = await parseFaMessage(interaction.channel.id, msgId);

    const profileC = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 📋 Perfil Completo`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`🧑 ***JOGADOR***
→ <@${userId}>`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`⭐ ***EXPERIÊNCIAS***
→ ${fa?.experiencias ?? "—"}`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`⚡ ***HABILIDADES***
→ ${fa?.habilidades ?? "—"}`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`🎯 ***POSIÇÃO***
→ ${fa?.posicao ?? "—"}`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`📱 ***DISPOSITIVO***
→ ${fa?.dispositivo ?? "—"}`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`📝 ***OBSERVAÇÕES***
→ ${fa?.observacoes ?? "—"}`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `> 💬 Para contratar, clique em **Contratar** no anúncio ou envie uma DM para <@${userId}>.`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Free Agent`));

    return interaction.reply({ components: [profileC], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
  }

  // ── Avaliação (DM) ───────────────────────────────────────────────────
  if (interaction.isButton() && interaction.customId.startsWith("rate_")) {
    // rate_<ticketName>_<openerId>_<claimerId>_<nota>
    const parts      = interaction.customId.split("_");
    const nota       = parseInt(parts[parts.length - 1]);
    const claimerId  = parts[parts.length - 2];
    const openerId   = parts[parts.length - 3];
    const ticketName = parts.slice(1, parts.length - 3).join("_");

    // Defer imediatamente para evitar timeout (operação assíncrona longa)
    await interaction.deferUpdate();

    const stars   = "⭐".repeat(nota);
    const now     = new Date();
    const dateStr = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

    // Edita a DM para mostrar que já avaliou
    const confirmedDm = new ContainerBuilder()
      .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ✅ Avaliação Enviada!`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `Obrigado pelo seu feedback!\n\n**Sua nota:** ${stars} **(${nota}/5)**\n**Ticket:** \`${ticketName}\``
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`));

    await interaction.message.edit({ components: [confirmedDm], flags: MessageFlags.IsComponentsV2 }).catch(() => {});

    // Busca a guild pelo ID fixo (a interação vem de DM, não tem interaction.guild)
    const GUILD_ID = "1449061779060687063";
    const guild    = await client.guilds.fetch(GUILD_ID).catch(() => null);
    if (!guild) { console.error("Guild não encontrada para enviar avaliação."); return; }

    const reviewCh = await guild.channels.fetch(REVIEW_CHANNEL_ID).catch(() => null);
    if (reviewCh) {
      const reviewContainer = new ContainerBuilder()
        .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ⭐ Nova Avaliação de Atendimento`))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `**Ticket:** \`${ticketName}\`\n` +
          `**Membro:** <@${openerId}>\n` +
          `**Nota:** ${stars} **(${nota}/5)**\n` +
          `**Staff Responsável:** <@${claimerId}>\n` +
          `**Data:** ${dateStr}`
        ))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`));

      await reviewCh.send({ components: [reviewContainer], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
    } else {
      console.error(`Canal de avaliações ${REVIEW_CHANNEL_ID} não encontrado.`);
    }
    return;
  }
}

// ─── Funções de comando ───────────────────────────────────────────────

async function sendWelcome(channel, member) {
  const icon = member.guild.iconURL({ size: 1024 }) ?? SERVER_ICON;
  await channel.send({ embeds: [new EmbedBuilder()
    .setAuthor({ name: "PAFO", iconURL: icon })
    .setTitle("Bem-Vindo(a) a PAFO")
    .setThumbnail(icon)
    .setDescription(
      `Bem-vindo(a), <@${member.id}>! Ficamos felizes por você ter se juntado à 🌌 PAFO.\n\n` +
      `Por favor, certifique-se de ler as regras em:\nhttps://discord.com/channels/1449061779060687063/1449067621411459183\n\n` +
      `↳ Você pode obter ajuda com nosso suporte no canal\nhttps://discord.com/channels/1449061779060687063/1449068500567068804\n\n` +
      `↳ Você pode encontrar mais informações em\nhttps://discord.com/channels/1449061779060687063/1454098611754373296\n\n` +
      `↳ ⚠️ Certifique-se de verificar sua conta em\nhttps://discord.com/channels/1449061779060687063/1464627654744477819`
    )
    .setImage(BANNERS.welcome).setColor(0x1B2A4A).setFooter({ text: "© 2026 PAFO", iconURL: icon }).setTimestamp()
  ]}).catch(console.error);
}

async function cmdVerify(channel) {
  const c = new ContainerBuilder()
    .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.verify)))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `## 🔐 Verificação Necessária para Acessar a PAFO\n\nPara acessar o servidor, você deve concluir a verificação para confirmar que **é humano** e que **não está usando contas alternativas *(alts)* ou VPN.**`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `### 📋 Antes de Verificar\n> • Leia as **regras** do servidor\n> • Entenda que os cargos na PAFO dependem de **atividade**, **habilidade** e **contribuição**`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `### 🚫 Regras de Verificação\n> • Proibido usar __contas alternativas__\n> • Não usar __VPN__\n> • Golpes ou exploração = **banimento imediato**\n> • Respeite todos os membros`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# Ao realizar a verificação, você aceita todas as __Políticas da PAFO__.`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("verify_button").setLabel("Verificar").setStyle(ButtonStyle.Success).setEmoji({ id: "1396655318662119535", name: "verify", animated: true }),
      new ButtonBuilder().setCustomId("why_verify").setLabel("Porque?").setStyle(ButtonStyle.Secondary).setEmoji({ id: "1468006456489148580", name: "question", animated: true })
    ));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

async function cmdRules(channel) {
  const c = new ContainerBuilder()
    .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.rules)))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `1. Seja respeitoso — proibido \`assédio\`, \`bullying\`, \`toxicidade\` ou \`drama\`\n` +
      `2. Proibido \`discurso de ódio\`, \`racismo\`, \`insultos\`, \`homofobia\` ou \`transfobia\`\n` +
      `3. Proibido conteúdo \`NSFW\` — \`imagens/vídeos NSFW = banimento imediato\`\n` +
      `4. Proibido \`ameaças\`, \`doxxing\`, \`falar em raid\` ou incentivar \`automutilação\`\n` +
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
      `16. Proibido \`spam no VC\`, barulho excessivo ou comportamento disruptivo\n` +
      `17. Decisões da staff são \`finais\`\n` +
      `18. Proibido \`denúncias falsas\`, tickets de troll ou aplicações falsas`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# © 2026 PAFO — Ao entrar no servidor você concorda com todas as regras acima.`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setURL("https://discord.com/guidelines").setLabel("Discord TOS/Diretrizes").setStyle(ButtonStyle.Link).setEmoji({ id: "1445106637202395396", name: "Discord_Emoji" })
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
      `**⚠️ Avisos:**\n> • Válido enquanto o boost estiver __ativo__\n> • Os benefícios podem mudar conforme o servidor evolui\n> • Abra um ticket para resgatar seus benefícios`
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
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🏅 CARGOS DO SERVIDOR — FUNÇÃO & COMO OBTER`))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `🔴 **Owner** — Dono do servidor\n🟠 **Co-Owner** — Co-dono do servidor\n🟡 **Gerente** — Gerencia o servidor\n` +
      `🟢 **Staff** — Modera o servidor\n🔵 **Olheiro** — Pode divulgar peneiras\n🟣 **Scrim Hoster** — Pode hospedar scrims\n⚪ **Verificado** — Membro verificado`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 📌 CANAIS IMPORTANTES`))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `📜 **Regras** — <#1449067621411459183>\n✅ **Verificação** — <#1464627654744477819>\n📢 **Anúncios** — <#1454098611754373296>\n🎫 **Suporte/Ticket** — <#1449068500567068804>\n🎁 **Sorteios** — <#1449115997804957806>`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ⚠️ O QUE GERA ADVERTÊNCIA`))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `> • \`Linguagem inadequada\`\n> • \`Spam ou flood\`\n> • \`Links não autorizados\`\n> • \`Conteúdo off-topic\`\n> • \`Desobedecer staff\`\n> • \`Qualquer violação das regras\``
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`🔗 **Servidor de Appeal:** https://discord.gg/8eAK5xVHPY`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
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
      `## <:PAFO:1455732882235719862> TABELA DE PREÇOS — CARGOS\n### <a:arrow_arrow:1455734922823209043> FUNÇÃO & VALORES`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `🔍 <@&1449070067131224268> — **Olheiro**\n> • **Valor:** 150 Robux / Brainrots\n> • **Função:** Realizar peneiras e observar jogadores\n> • ⚠️ Obrigatório para fazer peneiras`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `⚔️ <@&1449070133040517262> — **Scrim Hoster**\n> • **Valor:** 300 Robux / Brainrots\n> • **Função:** Organizar e hostear scrims oficiais`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `📸 <@&1450118477179260948> — **Pic Perm**\n> • **Valor:** 60 Robux / Brainrots\n> • **Função:** Permissão para enviar imagens onde não é permitido`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `🛠️ **Canal Personalizado**\n> • **Valor:** 200 Robux / Brainrots\n> • **Função:** Criação de canais personalizados da PAFO`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### 🚫 NÃO VENDEMOS CARGO DE ADM\nPara adquirir qualquer cargo, abra um ticket:`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
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
      `Nossa equipe estará sempre disponível para ajudar você no que precisar.\nAbra um ticket de acordo com o assunto desejado:\n\n` +
      `❓ **Dúvidas** — Perguntas gerais sobre a liga ou o servidor\n🤝 **Parcerias** — Propostas de parceria e divulgações\n` +
      `🛒 **Compras** — Comprar cargo por exemplo: olheiro\n🚨 **Denúncias** — Denunciar algum usuário do servidor\n📌 **Outros** — Outros assuntos`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `> ⏳ Pedimos __paciência__ enquanto nossa staff analisa seu ticket.\n> Atenderemos o __mais rápido__ possível.`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(select));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

async function cmdFriendlys(channel) {
  const c = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `## 📋 REGRAS OFICIAIS — PAFO FRIENDLYS\n\n` +
      `Qualquer ato de **racismo**, **gordofobia**, **xenofobia** ou **discriminação** seja em servidor, privado ou qualquer outro meio:\n\n` +
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
      `> • Racismo, gordofobia, xenofobia e qualquer forma de preconceito se enquadram na mesma punição *(Mute + Adv)*\n` +
      `> • As regras são válidas **dentro e fora** do servidor`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**Mais informações:**\n<#1454098611754373296>\n<#1449068500567068804>`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# © 2026 PAFO — Friendlys Rules`));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

client.login(TOKEN);