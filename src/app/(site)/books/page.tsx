import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books",
  description: "Books that have shaped my thinking on philosophy, business, and life.",
  alternates: { canonical: "/books" },
};

interface Book {
  title: string;
  author: string;
}

interface Section {
  id: string;
  title: string;
  intro?: string;
  books: Book[];
  /** The one line that lists several authors' collected works together. */
  extraLine?: React.ReactNode;
}

const SECTIONS: Section[] = [
  {
    id: "influences",
    title: "Influences",
    intro: "Books that changed how I see the world:",
    books: [
      { title: "Tao Te Ching", author: "Lao Tzu" },
      { title: "Book of Disquiet", author: "Fernando Pessoa" },
      { title: "In Praise of Shadows", author: "Jun'ichiro Tanizaki" },
      { title: "Centering in Pottery, Poetry, and the Person", author: "M.C. Richards" },
      { title: "The Three-Body Problem Series", author: "Liu Cixin" },
      { title: "Vagabond", author: "Takehiko Inoue" },
    ],
  },
  {
    id: "philosophy",
    title: "Philosophy",
    intro: "Reading philosophy now that I have some life experience to bring to it:",
    books: [
      { title: "Nausea", author: "Jean-Paul Sartre" },
      { title: "Being and Nothingness", author: "Jean-Paul Sartre" },
      { title: "Existentialism is a Humanism", author: "Jean-Paul Sartre" },
      { title: "The Unbearable Lightness of Being", author: "Milan Kundera" },
      { title: "The Stranger", author: "Albert Camus" },
      { title: "Burnout Society", author: "Byung Chul Han" },
      { title: "Psychopolitics", author: "Byung Chul Han" },
      { title: "The Will to Change", author: "bell hooks" },
    ],
  },
  {
    id: "fiction-poetry",
    title: "Fiction & Poetry",
    books: [
      { title: "The Three-Body Problem Series", author: "Liu Cixin" },
      { title: "Exhalation", author: "Ted Chiang" },
      { title: "Paper Menagerie", author: "Ken Liu" },
      { title: "More than Human", author: "Osamu Dazai" },
      { title: "China in Ten Words", author: "Yu Hua" },
      { title: "Vagabond", author: "Takehiko Inoue" },
    ],
    extraLine: (
      <>
        Works of <strong className="font-medium text-foreground">Rumi</strong>,{" "}
        <strong className="font-medium text-foreground">Ren Hang</strong>, and{" "}
        <strong className="font-medium text-foreground">Basho</strong>
      </>
    ),
  },
  {
    id: "eastern-aesthetics",
    title: "Eastern Aesthetics",
    books: [
      { title: "Tao Te Ching", author: "Lao Tzu" },
      { title: "The Book of Tea", author: "Kakuzo Okakura" },
      { title: "In Praise of Shadows", author: "Jun'ichiro Tanizaki" },
      { title: "Centering in Pottery, Poetry, and the Person", author: "M.C. Richards" },
    ],
  },
  {
    id: "business",
    title: "Business",
    books: [
      { title: "100M Offers / 100M Leads", author: "Alex Hormozi" },
      { title: "Principles", author: "Ray Dalio" },
      { title: "Consulting Bible", author: "Alan Weiss" },
      { title: "1 Page Marketing Plan", author: "Allan Dib" },
      { title: "First Break All the Rules", author: "Marcus Buckingham" },
    ],
  },
  {
    id: "to-read",
    title: "To Read",
    intro: "Recommendations I haven't gotten to yet:",
    books: [
      { title: "The Three Cornered World", author: "Natsume Soseki" },
      { title: "Man's Search for Meaning", author: "Viktor Frankl" },
      { title: "Pedro Paramo", author: "Juan Rulfo" },
    ],
  },
];

export default function BooksPage() {
  return (
    <div className="max-w-none py-10">
      <h1 id="books" className="text-[2em] font-normal leading-[1.3] text-foreground/70 mb-8">
        Books
      </h1>

      {SECTIONS.map((section, i) => (
        <section key={section.id} className={i > 0 ? "mt-10" : undefined}>
          <h2
            id={section.id}
            className="text-[1.5625em] font-light tracking-[-0.01em] text-foreground mb-3"
          >
            {section.title}
          </h2>
          {section.intro && (
            <p className="text-foreground/65 leading-relaxed mb-3">{section.intro}</p>
          )}
          <ul className="list-disc ml-5 space-y-1.5 text-foreground/80 leading-relaxed">
            {section.books.map((book) => (
              <li key={book.title}>
                <strong className="font-medium text-foreground">{book.title}</strong> -{" "}
                {book.author}
              </li>
            ))}
            {section.extraLine && <li>{section.extraLine}</li>}
          </ul>
          {i < SECTIONS.length - 1 && <hr className="border-border mt-10" />}
        </section>
      ))}

      <div className="mt-16 pt-6 border-t border-border font-mono text-sm">
        <a href="#books" className="text-primary hover:underline">
          ↑ Back to top
        </a>
        <div className="mt-4">
          <Link href="/user-manual" className="text-primary hover:underline">
            ← Previous: User Manual
          </Link>
        </div>
      </div>
    </div>
  );
}
