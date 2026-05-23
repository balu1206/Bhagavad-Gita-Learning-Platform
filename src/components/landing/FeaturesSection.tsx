import { BookOpen, Headphones, Map, Bookmark, BarChart3, Moon } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Immersive Reading',
    desc: 'Read all 700 verses with Sanskrit text, transliteration, word-by-word meaning, and Prabhupada commentary. Customize font size and reading theme.',
    gradient: 'from-saffron-500 to-gold-500',
  },
  {
    icon: Headphones,
    title: 'Audio Recitation',
    desc: 'Listen to authentic Sanskrit recitation with a full-screen player, speed controls, queue management, and lock-screen media controls.',
    gradient: 'from-blue-500 to-spiritual-purple',
  },
  {
    icon: Map,
    title: 'Guided Journey',
    desc: 'Follow an 8-step beginner path from Introduction to Liberation. Complete lessons, pass quizzes, and unlock achievements as you grow.',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    icon: Bookmark,
    title: 'Bookmarks & Notes',
    desc: 'Save verses that move you. Add personal notes, organize with tags, and search your entire collection with instant results.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    desc: 'Watch your reading streak grow daily. See chapter completion, listening hours, and your learning journey visualized beautifully.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Moon,
    title: 'Dark Mode & Offline',
    desc: 'Beautiful light and dark themes. PWA support means you can read verses even without an internet connection, any time.',
    gradient: 'from-slate-500 to-dark-700',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 px-4 sm:px-6 bg-warm-50 dark:bg-dark-900">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-saffron-600 dark:text-saffron-400 mb-3">
            Everything you need
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-dark-900 dark:text-dark-100 mb-4">
            A complete platform for
            <br />
            <span className="text-gradient">spiritual learning</span>
          </h2>
          <p className="mx-auto max-w-xl text-dark-500 dark:text-dark-400 text-lg">
            Built with the same care as Headspace, Calm, and Notion — for the study of timeless wisdom.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, gradient }) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-warm-100 dark:border-dark-700 bg-white dark:bg-dark-850 p-6 shadow-soft hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-medium mb-4`}>
                <Icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-lg text-dark-900 dark:text-dark-100 mb-2">{title}</h3>
              <p className="text-dark-500 dark:text-dark-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
