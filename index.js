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
const VERIFIED_ROLE_ID   = "1464623361626734637";
const WELCOME_CHANNEL_ID = "1449067457082949752";
const LOG_CHANNEL_ID     = "1449525327175880865";
const TICKET_CATEGORY_ID = "";
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
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
});

client.once("ready", () => console.log(`✅ Bot online: ${client.user.tag}`));

client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (channel) await sendWelcome(channel, member);
});

import { readFileSync, writeFileSync } from "fs";

function loadTicketCount() {
  try { return JSON.parse(readFileSync("./ticketcount.json", "utf8")).count ?? 0; }
  catch { return 0; }
}
function saveTicketCount(n) {
  writeFileSync("./ticketcount.json", JSON.stringify({ count: n }));
}

const handled = new Set();
const cmdCooldown = new Set();
const ticketOpening = new Set();
const claimedTickets = new Set();

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
  if (content === "!verify")  return cmdVerify(message.channel);
  if (content === "!rules")   return cmdRules(message.channel);
  if (content === "!booster") return cmdBooster(message.channel);
  if (content === "!info")    return cmdInfo(message.channel);
  if (content === "!welcome") return sendWelcome(message.channel, message.member);
  if (content === "!loja")    return cmdLoja(message.channel);
  if (content === "!ticket")    return cmdTicket(message.channel);
  if (content === "!friendlys") return cmdFriendlys(message.channel);
});

function isStaffMember(member) {
  return STAFF_ROLES.some(id => member.roles.cache.has(id)) || member.permissions.has(PermissionFlagsBits.Administrator);
}

client.on("interactionCreate", (interaction) => {
  handleInteraction(interaction).catch((e) => console.error("Erro interaction:", e));
});

async function handleInteraction(interaction) {

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
    const role = interaction.guild.roles.cache.get(VERIFIED_ROLE_ID);
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

  if (interaction.isStringSelectMenu() && interaction.customId === "ticket_select") {
    const tipo = interaction.values[0];
    const labels = { duvidas: "❓ Dúvidas", parcerias: "🤝 Parcerias", compras: "🛒 Compras", denuncias: "🚨 Denúncias", outros: "📌 Outros" };
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

  if (interaction.isButton() && interaction.customId.startsWith("ticket_confirm_")) {
    const tipo   = interaction.customId.replace("ticket_confirm_", "");
    const labels = { duvidas: "Dúvidas", parcerias: "Parcerias", compras: "Compras", denuncias: "Denúncias", outros: "Outros" };
    const label  = labels[tipo] ?? tipo;
    const guild  = interaction.guild;
    const user   = interaction.user;

    if (ticketOpening.has(user.id)) {
      return interaction.reply({ content: "⏳ Já existe um ticket sendo criado para você. Aguarde.", flags: MessageFlags.Ephemeral }).catch(() => {});
    }
    ticketOpening.add(user.id);

    const ticketCount = loadTicketCount() + 1;
    saveTicketCount(ticketCount);
    const ticketName  = `ticket-${String(ticketCount).padStart(4, "0")}`;
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

    interaction.reply({ content: `✅ Ticket criado em: <#${ticketChannel.id}>`, flags: MessageFlags.Ephemeral }).catch(() => {});

    const staffMentions = STAFF_ROLES.map(id => `<@&${id}>`).join(" ");
    await ticketChannel.send({ content: `<@${user.id}> ${staffMentions}`, allowedMentions: { parse: ["users", "roles"] } });

    const now = new Date();
    const dateStr = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
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
        new ButtonBuilder().setCustomId(`ticket_close_${ticketChannel.id}_${user.id}`).setLabel("Fechar Ticket").setStyle(ButtonStyle.Danger).setEmoji("🔒"),
        new ButtonBuilder().setCustomId(`ticket_claim_${ticketChannel.id}_${user.id}`).setLabel("Reivindicar Ticket").setStyle(ButtonStyle.Primary).setEmoji("📋")
      ));
    await ticketChannel.send({ components: [c], flags: MessageFlags.IsComponentsV2, allowedMentions: { parse: [] } });

    const logCh = guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logCh) {
      await logCh.send({ embeds: [new EmbedBuilder()
        .setTitle("🎫 Ticket Aberto")
        .addFields(
          { name: "Canal", value: `<#${ticketChannel.id}>`, inline: true },
          { name: "Criado por", value: `<@${user.id}>`, inline: true },
          { name: "Tipo", value: label, inline: true },
          { name: "Data", value: dateStr, inline: true },
        )
        .setColor(0x57F287).setFooter({ text: "PAFO — Ticket System", iconURL: SERVER_ICON }).setTimestamp()
      ]});
    }
    return;
  }

  if (interaction.isButton() && interaction.customId.startsWith("ticket_close_")) {
    if (!isStaffMember(interaction.member))
      return interaction.reply({ content: "❌ Apenas a staff pode fechar tickets.", flags: MessageFlags.Ephemeral });

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
    const parts = interaction.customId.split("_");
    const openerId = parts[3] ?? null;
    const logCh = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
    
    if (logCh) {
      // 📜 1. GERANDO O TRANSCRIPT ANTES DE DELETAR
      let transcriptText = `📄 TRANSCRIPT DO TICKET: ${closedChannel.name}\nFechado por: ${interaction.user.tag}\n\n`;
      try {
        // Busca as últimas 100 mensagens do canal
        const messages = await closedChannel.messages.fetch({ limit: 100 });
        const msgsArray = Array.from(messages.values()).reverse(); // Inverte para ordem cronológica
        
        msgsArray.forEach(m => {
          const time = m.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
          const author = m.author ? m.author.tag : "Desconhecido";
          const content = m.content || "[Mensagem sem texto, mídia ou embed]";
          transcriptText += `[${time}] ${author}: ${content}\n`;
        });
      } catch (err) {
        console.error("Erro ao gerar transcript:", err);
        transcriptText += "\n⚠️ Erro ao carregar o histórico completo.";
      }

      // Cria o arquivo .txt com o histórico
      const transcriptAttachment = new AttachmentBuilder(Buffer.from(transcriptText, "utf-8"), { name: `transcript-${closedChannel.name}.txt` });

      // 2. ENVIANDO A LOG COM O ARQUIVO ANEXADO
      const now = new Date();
      const dateStr = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
      await logCh.send({ 
        embeds: [new EmbedBuilder()
          .setTitle("🔒 Ticket Fechado")
          .addFields(
            { name: "Canal", value: closedChannel.name, inline: true },
            { name: "Fechado por", value: `<@${interaction.user.id}>`, inline: true },
            { name: "Criado por", value: openerId ? `<@${openerId}>` : "Desconhecido", inline: true },
            { name: "Data", value: dateStr, inline: true },
          )
          .setColor(0xED4245).setFooter({ text: "PAFO — Ticket System", iconURL: SERVER_ICON }).setTimestamp()
        ],
        files: [transcriptAttachment] // 👈 Anexa o arquivo na log
      });
    }

    setTimeout(() => { closedChannel.delete().catch(() => {}); }, 5000);
    return;
  }

if (interaction.isButton() && interaction.customId.startsWith("ticket_claim_")) {
    if (!isStaffMember(interaction.member))
      return interaction.reply({ content: "❌ Apenas a staff pode reivindicar tickets.", flags: MessageFlags.Ephemeral });

    const ch = interaction.channel;

    if (claimedTickets.has(ch.id)) {
      return interaction.reply({ content: "❌ Este ticket já foi reivindicado por outro membro da staff.", flags: MessageFlags.Ephemeral });
    }

    claimedTickets.add(ch.id);

    await interaction.reply({ content: "✅ Você reivindicou este ticket!", flags: MessageFlags.Ephemeral });

    const parts = interaction.customId.split("_");
    const channelId = parts[2] ?? null;
    const openerId  = parts[3] ?? null;

    await Promise.all([
      ...STAFF_ROLES.map(roleId => ch.permissionOverwrites.edit(roleId, { ViewChannel: false }).catch(() => {})),
      ch.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true }).catch(() => {}),
      openerId ? ch.permissionOverwrites.edit(openerId, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true }).catch(() => {}) : Promise.resolve(),
    ]);

    // Pega a data/hora e info do ticket original para reconstruir
    // Vamos ler o conteúdo da mensagem original para extrair os dados
    const originalMsg = interaction.message;
    
    const btnFechar = new ButtonBuilder()
      .setCustomId(`ticket_close_${ch.id}_${openerId}`)
      .setLabel("Fechar Ticket")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("🔒");

    const btnReivindicado = new ButtonBuilder()
      .setCustomId(`claimed_by_${interaction.user.id}`)
      .setLabel(`Atendido por ${interaction.user.displayName}`)
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("👤")
      .setDisabled(true);

    const novaRow = new ActionRowBuilder().addComponents(btnFechar, btnReivindicado);

    // Reconstrói o container COMPLETO com a imagem + dados originais + novos botões
    const now = new Date();
    const dateStr = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

    // Extrai o texto original dos components para preservar os dados do ticket
    let ticketInfo = "";
    try {
      const comps = originalMsg.components;
      for (const comp of comps) {
        if (comp.type === 17) { // Container
          for (const child of comp.components) {
            if (child.type === 10) { // TextDisplay
              const txt = child.content ?? "";
              if (txt.includes("Nome do Ticket")) ticketInfo = txt;
            }
          }
        }
      }
    } catch {}

    const updatedContainer = new ContainerBuilder()
      .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNERS.ticket)))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎫 Ticket Aberto`))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        ticketInfo || `**Criado Por:** <@${openerId}>`
      ))
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# PAFO — Ticket System`))
      .addActionRowComponents(novaRow);

    await originalMsg.edit({
      components: [updatedContainer],
      flags: MessageFlags.IsComponentsV2
    }).catch(e => console.error("Erro ao editar botões:", e));

    const claimNotice = new ContainerBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `### 🤝 Atendimento Iniciado\n> O staff <@${interaction.user.id}> agora é o responsável por este ticket.`
      ));

    await ch.send({ components: [claimNotice], flags: MessageFlags.IsComponentsV2 });
    return;
  }
}

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
      `## 📋 REGRAS OFICIAIS — PAFO FRIENDLYS

` +
      `Qualquer ato de **racismo**, **gordofobia**, **xenofobia** ou **discriminação** seja em servidor, privado ou qualquer outro meio:

` +
      `> Resultado: **Mute + Advertência**

` +
      `⚠️ Caso ocorra **DURANTE** um amistoso:
` +
      `> Resultado: **BANIMENTO**

` +
      `-# O usuário precisa estar no servidor para que a punição seja aplicada.`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `## 🚫 PENEIRAS IRREGULARES

` +
      `Realizar peneiras sem possuir o cargo: <@&1449070067131224268>

` +
      `> Resultado: **BANIMENTO**`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `## ⚠️ OBSERVAÇÕES IMPORTANTES

` +
      `> • Racismo, gordofobia, xenofobia e qualquer forma de preconceito se enquadram na mesma punição *(Mute + Adv)*
` +
      `> • As regras são válidas **dentro e fora** do servidor`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**Mais informações:**
` +
      `<#1454098611754373296>
` +
      `<#1449068500567068804>`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# © 2026 PAFO — Friendlys Rules`));
  await channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
}

client.login(TOKEN);