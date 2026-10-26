import { Link } from 'react-router-dom'

export type LegalSection = {
  heading: string
  text?: string
  list?: string[]
}

type LegalPageProps = {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
  otherLink: { to: string; label: string }
}

export default function LegalPage({
  title,
  updated,
  intro,
  sections,
  otherLink,
}: LegalPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-100 text-[#2a1020]">
      <header className="bg-[#8c0f4f] px-6 py-7">
        <Link
          to="/"
          className="font-serif text-2xl font-bold tracking-[0.3em] text-white"
        >
          HAGORA
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-10 leading-relaxed">
        <h1 className="font-serif text-4xl text-[#5e0f33]">{title}</h1>
        <p className="mb-8 mt-1 text-[#7a5a68]">Last updated: {updated}</p>
        <p>{intro}</p>

        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="mb-2 mt-8 text-lg font-semibold text-[#8c0f4f]">
              {s.heading}
            </h2>
            {s.text && <p>{s.text}</p>}
            {s.list && (
              <ul className="list-disc space-y-1 pl-6">
                {s.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className="mt-10">
          See also our{' '}
          <Link className="text-[#8c0f4f] underline" to={otherLink.to}>
            {otherLink.label}
          </Link>
          .
        </p>
        <p className="mt-2">
          <Link className="text-[#8c0f4f] underline" to="/login">
            &larr; Back to sign in
          </Link>
        </p>
      </main>

      <footer className="py-6 text-center text-sm text-[#7a5a68]">
        &copy; 2026 HAGORA. All rights reserved.
      </footer>
    </div>
  )
}