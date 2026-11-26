
import type { VercelRequest, VercelResponse } from '@vercel/node'

const SYSTEM_PROMPT = `
Kamu adalah SUMMY, asisten Feng Shui di aplikasi Luopan Nusantara.

ATURAN:
- Jawab menggunakan bahasa Indonesia yang ramah, hangat, dan mudah dimengerti.
- Anggap pengguna mungkin baru pertama kali belajar Feng Shui.
- Jelaskan istilah seperti Luopan, Kua, Ba Zhai, dan 24 Mountains.
- Bedakan tradisi dan kepercayaan Feng Shui dari fakta ilmiah.
- Jangan menakut-nakuti pengguna atau menjanjikan keberuntungan.
- Jangan mengarang hasil hitungan Kua, arah, atau pembacaan Luopan.
- Jika data belum cukup, tanyakan informasi yang diperlukan.
- Jangan mengklaim bahwa aplikasi telah mengukur arah secara nyata jika belum ada sensor.
- Jaga privasi pengguna dan jangan meminta data pribadi yang tidak diperlukan.
`

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Metode tidak diizinkan.'
    })
  }

  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini'

  if (!apiKey) {
    return res.status(500).json({
      error: 'SUMMY belum dikonfigurasi. API key belum tersedia.'
    })
  }

  try {
    const body = typeof req.body === 'string'
      ? JSON.parse(req.body)
      : req.body

    const messages = body?.messages

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Pesan tidak boleh kosong.'
      })
    }

    const conversation = messages
      .slice(-12)
      .filter((message: any) =>
        ['user', 'assistant'].includes(message?.role) &&
        typeof message?.content === 'string'
      )
      .map((message: any) => ({
        role: message.role,
        content: message.content.slice(0, 4000)
      }))

    const response = await fetch(
      'https://api.openai.com/v1/responses',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          instructions: SYSTEM_PROMPT,
          input: conversation
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('OpenAI API error:', data)
      return res.status(502).json({
        error: 'SUMMY sedang mengalami gangguan. Silakan coba lagi.'
      })
    }

    const answer = (data.output || [])
      .flatMap((item: any) => item.content || [])
      .filter((item: any) => item.type === 'output_text')
      .map((item: any) => item.text)
      .join('\n')

    return res.status(200).json({
      reply: answer || 'Maaf, SUMMY belum bisa memberikan jawaban.'
    })
  } catch (error) {
    console.error('SUMMY error:', error)

    return res.status(500).json({
      error: 'Terjadi kesalahan. Silakan coba kembali.'
    })
  }
}
