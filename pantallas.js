// pantallas.js
import { Markup } from 'telegraf';
import { obtenerUsuario, generarTecladoRivales, generarTecladoBloqueados } from './usuariosManager.js';

// 1. Botones del menú principal
export function obtenerBotonesInicio(chatId) {
  const usuario = obtenerUsuario(chatId);
  const estadoDND = usuario && usuario.noMolestar ? '🔴 No Molestar (Ocupado)' : '🟢 Disponible para Retos';

  return Markup.inlineKeyboard([
    [
      Markup.button.callback('🤖 Retar Bot', 'retar_bot'),
      Markup.button.callback('👥 Retar Amigo', 'abrir_menu_rivales')
    ],
    [
      Markup.button.callback(estadoDND, 'toggle_dnd')
    ],
    [
      Markup.button.callback('🚫 Gestionar Bloqueados', 'abrir_menu_bloqueados')
    ],
    [
      Markup.button.callback('🔄 Reiniciar Todo', 'reiniciar_todo')
    ]
  ]);
}

// 2. Renderizar el tablero de juego
export function obtenerTextoTablero(nombreRival, miNumeroSecreto, intentos, esMultijugador) {
  let texto = esMultijugador 
    ? `📊 *TABLERO DE JUEGO (vs ${nombreRival})*\n\nTu número secreto protegido: *${miNumeroSecreto}*\n\n`
    : `📊 *TABLERO DE JUEGO*\n\n`;

  if (intentos.length === 0) {
    texto += esMultijugador ? "Aún no has realizado intentos." : "Aún no has realizado intentos. ¡Comienza a adivinar!";
    return texto;
  }

  intentos.forEach((int, index) => {
    texto += `${index + 1}.  *${int.numero}*  👉  ${int.picos} Picos  |  ${int.palas} Palas\n`;
  });

  return texto;
}

// 3. Renderizar la lista de rivales activos y paginados
export async function renderizarMenuRivales(ctx, chatId, partidasActivas, pagina = 0) {
  const datosTeclado = generarTecladoRivales(chatId, partidasActivas, pagina);

  let textoFeedback = "🎯 *Selecciona un rival para jugar Pico y Pala*:\n\n" +
    "⌨️ _Puedes escribir parte de un nombre o un @usuario en el chat para filtrar esta lista._\n\n";

  if (datosTeclado.filtroActual) {
    textoFeedback += `🔍 Filtro activo: _"${datosTeclado.filtroActual}"_\n\n`;
  }
  
  textoFeedback += `📖 Página ${datosTeclado.paginaActual + 1} de ${datosTeclado.totalPaginas} (${datosTeclado.textoMostrando})`;

  await ctx.telegram.editMessageText(
    chatId,
    partidasActivas[chatId].feedbackMessageId,
    null,
    textoFeedback,
    {
      parse_mode: 'Markdown',
      ...datosTeclado.teclado
    }
  ).catch(err => console.log("Error al renderizar menú de rivales:", err.message));
}

// 4. Renderizar el menú de usuarios bloqueados
export async function renderizarMenuBloqueados(ctx, chatId, partidasActivas, pagina = 0) {
  const datosTeclado = generarTecladoBloqueados(chatId, pagina);

  let textoFeedback = "🚫 *Lista de Usuarios Bloqueados*:\n\n" +
    "ℹ️ _Toca sobre cualquier usuario de la lista para desbloquearlo de inmediato._\n" +
    "⌨️ _También puedes escribir en el chat para filtrar a quién buscas desbloquear._\n\n";

  if (datosTeclado.filtroActual) {
    textoFeedback += `🔍 Filtro activo: _"${datosTeclado.filtroActual}"_\n\n`;
  }
  
  textoFeedback += `📖 Página ${datosTeclado.paginaActual + 1} de ${datosTeclado.totalPaginas} (${datosTeclado.textoMostrando})`;

  await ctx.telegram.editMessageText(
    chatId,
    partidasActivas[chatId].feedbackMessageId,
    null,
    textoFeedback,
    {
      parse_mode: 'Markdown',
      ...datosTeclado.teclado
    }
  ).catch(err => console.log("Error al renderizar menú de bloqueados:", err.message));
}

// 5. Renderizar los botones de fin de partida multijugador (Filas separadas)
export function obtenerBotonesFinPvp(rivalId, nombreRival) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(`🔄 Volver a jugar con ${nombreRival}`, `solicitar_jugar_nuevamente:${rivalId}`)
    ],
    [
      Markup.button.callback('🏠 Volver al Inicio', 'volver_inicio')
    ]
  ]);
}