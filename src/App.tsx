
import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Compass,
  House,
  Menu,
  MessageCircle,
  Send,
  Sparkles,
  X,
  Wind,
  ShieldCheck,
  CircleHelp
} from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const suggestions = [
  'Apa itu Feng Shui?',
  'Bagaimana menentukan arah rumah?',
  'Apa arti 24 Mountains?'
]

const features = [
  {
    icon: Compass,
    title: 'Kompas Luopan',
    description: 'Kenali arah mata angin dan dasar pembacaan kompas Feng Shui.',
    status: 'Panduan dasar'
  },
  {
    icon: House,
    title: 'Analisis Rumah',
    description: 'Pelajari hubungan arah hadap, posisi, dan tata ruang rumah.',
    status: 'Segera hadir'
  },
  {
    icon: Sparkles,
    title: 'Kalkulator Kua',
    description: 'Pelajari angka Kua dan kelompok arah berdasarkan metode yang dipilih.',
    status: 'Segera hadir'
  },
  {
    icon: Wind,
    title: '24 Mountains',
    description: 'Kenali pembagian arah Luopan dalam 24 sektor.',
    status: 'Panduan dasar'
  },
  {
    icon: BookOpen,
    title: 'Ba Zhai',
    description: 'Pelajari konsep Eight Mansions dan delapan jenis arah.',
    status: 'Segera hadir'
  },
  {
    icon: CircleHelp,
    title: 'Belajar Feng Shui',
    description: 'Mulai dari istilah dasar hingga konsep tradisional Feng Shui.',
    status: 'Panduan tersedia'
  }
]

function SummyChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Halo! Aku SUMMY, teman belajarmu di Luopan Nusantara. 🌿 Mau belajar apa tentang Feng Shui hari ini?'
    }
  ])

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const openChat = () => setOpen(true)
    window.addEventListener('open-summy', openChat)
    return () => window.removeEventListener('open-summy', openChat)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function sendMessage(text = input) {
    const question = text.trim()
    if (!question || loading) return

    const updated = [
      ...messages,
      { role: 'user' as const, content: question }
    ]

    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/summy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: updated
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'SUMMY sedang tidak tersedia.')
      }

      setMessages(previous => [
        ...previous,
        {
          role: 'assistant',
          content: data.reply
        }
      ])
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Terjadi kesalahan.'

      setMessages(previous => [
        ...previous,
        {
          role: 'assistant',
          content: message
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {open && (
        <section className="chat-panel">
          <div className="chat-header">
            <div className="summy-avatar">
              <Sparkles size={19} />
            </div>
            <div className="chat-heading">
              <strong>SUMMY</strong>
              <span>Asisten Feng Shui Nusantara</span>
            </div>
            <button
              className="icon-button"
              onClick={() => setOpen(false)}
              aria-label="Tutup chat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role}`}
              >
                {message.content}
              </div>
            ))}

            {loading && (
              <div className="message assistant">
                SUMMY sedang berpikir...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && (
            <div className="suggestions">
              {suggestions.map(item => (
                <button
                  key={item}
                  onClick={() => sendMessage(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          <form
            className="chat-input"
            onSubmit={event => {
              event.preventDefault()
              sendMessage()
            }}
          >
            <input
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder="Tanyakan sesuatu kepada SUMMY..."
              aria-label="Pesan untuk SUMMY"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Kirim pesan"
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      )}

      <button
        className="chat-launcher"
        onClick={() => setOpen(value => !value)}
        aria-label="Buka SUMMY"
      >
        {open ? <X size={23} /> : <MessageCircle size={23} />}
        {!open && <span>Tanya SUMMY</span>}
      </button>
    </>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  function openSummy() {
    window.dispatchEvent(new Event('open-summy'))
  }

  return (
    <main>
      <nav className="navbar">
        <a className="brand" href="#">
          <div className="brand-mark">
            <Compass size={25} />
          </div>
          <div>
            <strong>LUOPAN NUSANTARA</strong>
            <span>THE ART OF HARMONY</span>
          </div>
        </a>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Buka menu"
        >
          <Menu />
        </button>

        <div className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <a href="#beranda" onClick={() => setMenuOpen(false)}>Beranda</a>
          <a href="#fitur" onClick={() => setMenuOpen(false)}>Fitur</a>
          <a href="#belajar" onClick={() => setMenuOpen(false)}>Belajar</a>
          <button className="nav-ask" onClick={openSummy}>
            Tanya SUMMY <Sparkles size={15} />
          </button>
        </div>
      </nav>

      <section className="hero" id="beranda">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            WISDOM OF TRADITIONAL FENG SHUI
          </div>

          <h1>
            Temukan Harmoni
            <em>di Setiap Arah.</em>
          </h1>

          <p>
            Kenali filosofi Feng Shui, pelajari arah rumah,
            dan jelajahi kebijaksanaan Luopan melalui
            pengalaman belajar yang mudah dipahami.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#fitur">
              Jelajahi Luopan <ArrowRight size={17} />
            </a>
            <button className="secondary-button" onClick={openSummy}>
              <Sparkles size={17} /> Kenalan dengan SUMMY
            </button>
          </div>

          <div className="hero-note">
            <ShieldCheck size={16} />
            Belajar dengan tenang, tanpa janji atau klaim berlebihan.
          </div>
        </div>

        <div className="compass-art">
          <div className="compass-glow" />
          <div className="compass-ring outer-ring">
            <div className="compass-ring middle-ring">
              <div className="compass-ring inner-ring">
                <div className="compass-directions north">N</div>
                <div className="compass-directions east">E</div>
                <div className="compass-directions south">S</div>
                <div className="compass-directions west">W</div>
                <div className="compass-needle">
                  <div className="needle-top" />
                  <div className="needle-bottom" />
                  <div className="needle-center" />
                </div>
                <div className="compass-center">道</div>
              </div>
            </div>
          </div>
          <div className="compass-caption">
            <span>THE LUOPAN</span>
            <span>TRADITIONAL COMPASS</span>
          </div>
        </div>
      </section>

      <section className="intro-strip">
        <div>
          <span className="strip-number">01</span>
          <span>KENALI ARAH</span>
        </div>
        <div>
          <span className="strip-number">02</span>
          <span>PAHAMI RUANG</span>
        </div>
        <div>
          <span className="strip-number">03</span>
          <span>PELAJARI HARMONI</span>
        </div>
      </section>

      <section className="features-section" id="fitur">
        <div className="section-heading">
          <div className="eyebrow">EXPLORE THE KNOWLEDGE</div>
          <h2>Jelajahi Dunia <em>Luopan</em></h2>
          <p>
            Kenali berbagai konsep Feng Shui melalui panduan
            yang disusun untuk pemula dan pembelajar.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <article className="feature-card" key={feature.title}>
                <div className="feature-top">
                  <div className="feature-icon">
                    <Icon size={22} />
                  </div>
                  <span className="feature-index">
                    0{index + 1}
                  </span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-status">
                  {feature.status}
                  <ArrowRight size={15} />
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="summy-promo" id="belajar">
        <div className="promo-symbol">
          <Sparkles size={36} />
        </div>
        <div className="promo-copy">
          <div className="eyebrow">YOUR LEARNING COMPANION</div>
          <h2>Kenalan dengan <em>SUMMY</em></h2>
          <p>
            Tidak tahu harus mulai dari mana? SUMMY siap
            membantu menjelaskan istilah dan konsep Feng Shui
            dengan bahasa Indonesia yang sederhana.
          </p>
        </div>
        <button className="primary-button" onClick={openSummy}>
          Mulai Bertanya <ArrowRight size={17} />
        </button>
      </section>

      <footer>
        <a className="brand footer-brand" href="#">
          <div className="brand-mark">
            <Compass size={22} />
          </div>
          <div>
            <strong>LUOPAN NUSANTARA</strong>
            <span>THE ART OF HARMONY</span>
          </div>
        </a>

        <p>
          Feng Shui merupakan tradisi dan filosofi penataan ruang.
          Informasi di aplikasi ini bersifat edukatif.
        </p>

        <span className="copyright">
          © {new Date().getFullYear()} Luopan Nusantara
        </span>
      </footer>

      <SummyChat />
    </main>
  )
}
