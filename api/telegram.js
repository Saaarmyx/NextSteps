export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({
      success: false,
      message: 'Método no permitido.',
    })
  }

  const { BOT_TOKEN, CHAT_ID } = process.env

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Faltan las variables de entorno BOT_TOKEN o CHAT_ID.')
    return res.status(500).json({
      success: false,
      message: 'El servidor no está configurado correctamente.',
    })
  }

  try {
    // Captura completa de parámetros estructurales del frontend
    const { emoji, title, description, date, time, note } = req.body || {}

    if (!emoji || !title || !description || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Información incompleta.',
      })
    }

    // Validaciones estrictas y sanitización anti-desbordamiento
    if (
      typeof emoji !== 'string' ||
      typeof title !== 'string' ||
      typeof description !== 'string' ||
      typeof date !== 'string' ||
      typeof time !== 'string' ||
      title.length > 200 ||
      description.length > 500 ||
      emoji.length > 20 ||
      date.length > 20 ||
      time.length > 20 ||
      (note && (typeof note !== 'string' || note.length > 200))
    ) {
      return res.status(400).json({
        success: false,
        message: 'Información inválida.',
      })
    }

    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      'Desconocida'

    const userAgent = req.headers['user-agent'] || 'Desconocido'
    const so = detectOS(userAgent)

    const fechaEnvio = new Date().toLocaleString('es-CO', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'America/Bogota',
    })

    const bloqueNota = note ? `💬 Nota de Emy: "${note}"` : '💬 Nota de Emy: Sin comentarios.'

    // Plantilla limpia y sin duplicaciones para Telegram
    const mensaje = [
      '💌 ¡Emily confirmó una salida! ❤️',
      '━━━━━━━━━━━━━━━━━━',
      `📍 Plan: ${emoji} ${title}`,
      `📝 Descripción: ${description}`,
      '━━━━━━━━━━━━━━━━━━',
      '📅 PLANIFICACIÓN:',
      `📆 Fecha: ${date}`,
      `⏰ Hora sugerida: ${time}`,
      ` ${bloqueNota}`,
      '━━━━━━━━━━━━━━━━━━',
      '⚙️ Detalles del sistema:',
      `🕒 Enviado: ${fechaEnvio}`,
      `🌐 IP: ${ip}`,
      `💻 OS: ${so}`,
      '━━━━━━━━━━━━━━━━━━',
      '❤️ ¡Ya puedes empezar a preparar todo!',
    ].join('\n')

    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: mensaje,
      }),
    })

    if (!telegramResponse.ok) {
      const errorBody = await telegramResponse.text().catch(() => '')
      console.error('Telegram respondió con error:', telegramResponse.status, errorBody)
      throw new Error('Telegram respondió con error.')
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error en /api/telegram:', error)
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor.',
    })
  }
}

function detectOS(userAgent) {
  const ua = userAgent.toLowerCase()
  if (ua.includes('windows')) return 'Windows'
  if (ua.includes('android')) return 'Android'
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) return 'iOS'
  if (ua.includes('mac os')) return 'macOS'
  if (ua.includes('linux')) return 'Linux'
  return 'Desconocido'
}
