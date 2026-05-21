// @ts-ignore
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const JOURNEY_STEPS = [
  {
    order: 1,
    slug: 'introduction',
    title: 'Introduction to the Gita',
    subtitle: 'Discover the background and significance of the Bhagavad Gita',
    icon: '📖',
    estimatedMinutes: 15,
    lessons: [
      {
        order: 1,
        title: 'What is the Bhagavad Gita?',
        content: `## What is the Bhagavad Gita?

The Bhagavad Gita, often called simply "the Gita," is a 700-verse Sanskrit scripture that is part of the ancient Indian epic, the Mahabharata. The dialogue is set on the battlefield of Kurukshetra.

### The Setting

The Gita begins moments before a great civil war, as the warrior prince Arjuna surveys the opposing army and recognises family members, teachers, and friends. Overcome with grief and moral confusion, he lowers his bow and refuses to fight.

> "My limbs fail and my mouth is parched, my body quivers and my hair stands on end." — Arjuna (1.29)

### The Teacher

His charioteer, Krishna — revealed to be the Supreme Being in human form — then imparts timeless wisdom over 18 chapters, guiding Arjuna from despair to clarity.

### Why It Matters

The Gita does not advocate war. It uses the battlefield as a metaphor for the inner war we all face — the conflict between our higher self and our lower impulses, our duty versus our comfort.`,
        verseRefs: ['1.29', '2.7'],
        estimatedMinutes: 7,
      },
      {
        order: 2,
        title: 'The 18 Chapters at a Glance',
        content: `## The 18 Chapters at a Glance

The Gita is structured as a conversation, with Arjuna's questions and Krishna's answers woven across 18 chapters (adhyayas).

### Three Sections

**Chapters 1–6: Karma Kanda (Action)**
Focus on self-discipline, selfless service, and the yoga of action.

**Chapters 7–12: Bhakti Kanda (Devotion)**
The nature of God, devotion, and the path of surrender.

**Chapters 13–18: Jnana Kanda (Knowledge)**
The nature of reality, the three gunas, and liberation.

### Key Themes
- **Dharma** — righteous duty
- **Karma** — action and its fruits
- **Yoga** — union with the divine
- **Moksha** — liberation from the cycle of birth and death`,
        verseRefs: ['2.47', '18.66'],
        estimatedMinutes: 5,
      },
    ],
    quiz: [
      {
        order: 1,
        question: 'On what battlefield does the Bhagavad Gita dialogue take place?',
        options: ['Hastinapura', 'Kurukshetra', 'Ayodhya', 'Vrindavan'],
        correctIndex: 1,
        explanation: 'The Gita takes place on the battlefield of Kurukshetra, just before the great Mahabharata war between the Pandavas and Kauravas.',
      },
      {
        order: 2,
        question: 'Who is the primary teacher in the Bhagavad Gita?',
        options: ['Arjuna', 'Vyasa', 'Krishna', 'Bhishma'],
        correctIndex: 2,
        explanation: 'Krishna, acting as Arjuna\'s charioteer, is the teacher. He is revealed to be the Supreme Being in human form.',
      },
      {
        order: 3,
        question: 'How many verses does the Bhagavad Gita contain?',
        options: ['500', '600', '700', '800'],
        correctIndex: 2,
        explanation: 'The Bhagavad Gita contains 700 Sanskrit verses spread across 18 chapters.',
      },
    ],
  },
  {
    order: 2,
    slug: 'key-concepts',
    title: 'Key Sanskrit Concepts',
    subtitle: 'Master the essential vocabulary of the Gita\'s philosophy',
    icon: '🔑',
    estimatedMinutes: 20,
    lessons: [
      {
        order: 1,
        title: 'Dharma — Your Sacred Duty',
        content: `## Dharma — Your Sacred Duty

The word **dharma** comes from the Sanskrit root *dhri*, meaning "to hold" or "to sustain." It refers to the natural order that holds the universe together — and your personal role within it.

### Types of Dharma

**Sanatana Dharma** — Universal, eternal law (truth, non-violence, compassion)

**Sva-dharma** — Your personal duty based on your nature, position, and circumstances

> "Better is one's own dharma, though imperfectly performed, than the dharma of another well performed." — Krishna (3.35)

### Dharma vs. Morality

Dharma is not just about following rules. It is about acting in accordance with your deepest nature. When Arjuna refuses to fight, he believes he is being compassionate — but Krishna argues this is *adharma* (anti-dharma), a betrayal of his nature as a warrior-protector.

**Reflection**: What is your sva-dharma right now?`,
        verseRefs: ['3.35', '2.31'],
        estimatedMinutes: 6,
      },
      {
        order: 2,
        title: 'Karma, Yoga & Moksha',
        content: `## Karma, Yoga & Moksha

### Karma — Action and Consequence

**Karma** means "action." Every action creates an impression (samskara) that shapes future experience. The Gita's revolutionary teaching is not to avoid karma, but to act *without attachment to results*.

> "Let right deeds be thy motive, not the fruit which comes from them." — 2.47 (Arnold)

### Yoga — Paths of Union

The Gita outlines four main paths to union with the divine:

| Path | Meaning | Chapter Focus |
|------|---------|---------------|
| Karma Yoga | Path of selfless action | 3, 5 |
| Bhakti Yoga | Path of devotion | 12 |
| Jnana Yoga | Path of knowledge | 4, 13 |
| Raja Yoga | Path of meditation | 6 |

### Moksha — Liberation

Moksha is freedom from the cycle of death and rebirth (samsara). It is achieved when the individual soul (Atman) recognises its unity with the universal consciousness (Brahman).`,
        verseRefs: ['2.47', '6.47', '12.2'],
        estimatedMinutes: 8,
      },
    ],
    quiz: [
      {
        order: 1,
        question: 'What does "sva-dharma" mean?',
        options: ["Universal moral law", "Your own personal duty", "Devotion to God", "Liberation from rebirth"],
        correctIndex: 1,
        explanation: 'Sva-dharma means your own personal duty based on your nature and circumstances, as opposed to universal dharma or someone else\'s duty.',
      },
      {
        order: 2,
        question: 'Which yoga is the path of selfless action?',
        options: ['Bhakti Yoga', 'Jnana Yoga', 'Karma Yoga', 'Raja Yoga'],
        correctIndex: 2,
        explanation: 'Karma Yoga is the path of selfless action — performing one\'s duties without attachment to the results.',
      },
      {
        order: 3,
        question: 'What is moksha?',
        options: ['Righteous duty', 'Selfless action', 'Devotion to Krishna', 'Liberation from the cycle of rebirth'],
        correctIndex: 3,
        explanation: 'Moksha is liberation — freedom from samsara (the cycle of death and rebirth) achieved when the individual soul recognises its unity with Brahman.',
      },
    ],
  },
  {
    order: 3,
    slug: 'battlefield-setting',
    title: 'The Battlefield Setting',
    subtitle: 'Understanding Arjuna\'s crisis and the context of the teaching',
    icon: '⚔️',
    estimatedMinutes: 18,
    lessons: [
      {
        order: 1,
        title: 'Arjuna\'s Dilemma',
        content: `## Arjuna's Dilemma

When Arjuna surveys the battlefield and sees his beloved teachers, cousins, uncles, and friends arrayed against him, he is paralysed by grief.

### The Inner War

The physical battlefield is a symbol for the internal battles we all face:

- **Duty vs. Desire** — What you must do vs. what you want to do
- **Wisdom vs. Ego** — Higher knowledge vs. the small self
- **Courage vs. Comfort** — Acting rightly vs. avoiding pain

### Krishna's Response

Rather than dismissing Arjuna's grief, Krishna acknowledges it and begins a systematic teaching on the nature of the self, reality, and right action.

> "From whence, O Arjuna, has this weakness come upon thee in this crisis? It does not become thee. Do not yield to impotence, O Arjuna." — 2.2-3`,
        verseRefs: ['1.28', '2.2', '2.3'],
        estimatedMinutes: 7,
      },
    ],
    quiz: [
      {
        order: 1,
        question: 'Why does Arjuna refuse to fight at the start of the Gita?',
        options: ['He is afraid of losing', 'He sees beloved family and teachers on the opposing side', 'Krishna told him not to fight', 'He is injured'],
        correctIndex: 1,
        explanation: 'Arjuna is overwhelmed with compassion and grief upon seeing beloved teachers, cousins, uncles, and friends on the opposing side, and questions whether victory is worth such destruction.',
      },
      {
        order: 2,
        question: 'The battlefield of Kurukshetra is often understood as a metaphor for what?',
        options: ['A historical battle', 'The inner conflict within the human mind', 'The struggle between nations', 'The conflict between gods and demons'],
        correctIndex: 1,
        explanation: 'The Gita uses the physical battlefield as a metaphor for the inner war — the conflict between our higher wisdom and lower impulses, duty and desire.',
      },
    ],
  },
  {
    order: 4,
    slug: 'core-teachings',
    title: 'Core Teachings',
    subtitle: 'The central philosophical teachings of the Bhagavad Gita',
    icon: '🕉️',
    estimatedMinutes: 25,
    lessons: [
      {
        order: 1,
        title: 'The Immortal Self (Atman)',
        content: `## The Immortal Self (Atman)

Krishna's first teaching addresses Arjuna's deepest fear: that his actions will cause the death of his loved ones.

### The Eternal Soul

> "Never was there a time when I did not exist, nor you, nor all these kings; nor in the future shall any of us cease to be." — 2.12

The self (Atman) is eternal, unborn, and indestructible. The body dies; the self does not.

> "The soul is never born nor dies at any time. It has not come into being, does not come into being, and will not come into being. It is unborn, eternal, ever-existing, and primeval." — 2.20

### Practical Significance

Understanding the immortality of the self is not an abstract philosophy — it is the foundation for action *without fear*. When we know that the essential self cannot be harmed, we can act freely and fearlessly in service of dharma.`,
        verseRefs: ['2.12', '2.20', '2.23'],
        estimatedMinutes: 8,
      },
      {
        order: 2,
        title: 'Nishkama Karma — Action Without Attachment',
        content: `## Nishkama Karma — Action Without Attachment

The most famous verse of the Gita encapsulates a revolutionary approach to action:

> "You have a right to perform your prescribed duties, but you are not entitled to the fruits of those actions. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty." — 2.47

### What This Means

**Act fully** — Put your complete effort into whatever you do.

**Release the outcome** — The results are not in your hands. External circumstances, the actions of others, and forces beyond your control all play a role.

**Avoid both extremes** — Don't be obsessed with success, but also don't use detachment as an excuse for inaction.

### The Psychology

Modern psychology calls this "process focus" — being fully engaged with the task itself rather than anxious about the outcome. Athletes, artists, and surgeons perform best when they are absorbed in the process, not calculating the result.`,
        verseRefs: ['2.47', '2.48', '2.50'],
        estimatedMinutes: 8,
      },
    ],
    quiz: [
      {
        order: 1,
        question: 'According to the Gita, what happens to the soul (Atman) when the body dies?',
        options: ['It ceases to exist', 'It is reborn immediately in a new body', 'It is eternal and does not die', 'It merges with Krishna'],
        correctIndex: 2,
        explanation: 'The Gita teaches that the Atman (self/soul) is eternal, unborn, and indestructible. Only the body dies; the soul is never truly born or destroyed.',
      },
      {
        order: 2,
        question: 'What is the teaching of verse 2.47 about karma?',
        options: ['Avoid all action to avoid bad karma', 'You are entitled to the rewards of your hard work', 'Perform your duty but do not cling to results', 'Only act when you are certain of success'],
        correctIndex: 2,
        explanation: '2.47 teaches nishkama karma — act fully in performing your duty, but release attachment to the fruits/results of those actions.',
      },
    ],
  },
  {
    order: 5,
    slug: 'paths-of-yoga',
    title: 'The Four Paths of Yoga',
    subtitle: 'Explore the different routes to union with the divine',
    icon: '🧘',
    estimatedMinutes: 22,
    lessons: [
      {
        order: 1,
        title: 'Karma Yoga & Jnana Yoga',
        content: `## Karma Yoga: The Path of Action

Karma Yoga is the practice of performing all actions as an offering, without attachment to personal gain. It is the yoga of the active person.

**Key principles:**
- Act in accordance with dharma
- Offer all actions to the divine
- Release attachment to outcomes
- See yourself as an instrument

## Jnana Yoga: The Path of Knowledge

Jnana Yoga is the path of philosophical inquiry and self-knowledge. Through discrimination (viveka) between the real and unreal, the finite and infinite, the seeker comes to know their true nature.

> "Even if you are considered the most sinful of all sinners, you shall cross over the ocean of sin by the boat of transcendental knowledge." — 4.36

**Key practices:**
- Sravana — Listening to scriptural wisdom
- Manana — Deep contemplation
- Nididhyasana — Meditation on truth`,
        verseRefs: ['3.19', '4.36', '4.38'],
        estimatedMinutes: 8,
      },
      {
        order: 2,
        title: 'Bhakti Yoga & Raja Yoga',
        content: `## Bhakti Yoga: The Path of Devotion

Bhakti Yoga is often called the easiest and most direct path. It involves cultivating an intimate, loving relationship with the divine.

> "Fix your mind on Me, be devoted to Me, worship Me, bow down to Me. So shall you come to Me. I promise you truly, for you are dear to Me." — 18.65

**Forms of Bhakti:**
- Hearing about the divine (Sravana)
- Singing God's names (Kirtana)
- Remembering (Smarana)
- Serving (Dasya)
- Surrender (Atma-nivedana)

## Raja Yoga: The Path of Meditation

Chapter 6 details the meditative path — controlling the mind through pranayama, concentration, and deep meditation (dhyana).

> "For one who has conquered the mind, the mind is the best of friends; but for one who has failed to do so, the mind will remain the greatest enemy." — 6.6`,
        verseRefs: ['18.65', '6.6', '6.35'],
        estimatedMinutes: 8,
      },
    ],
    quiz: [
      {
        order: 1,
        question: 'Which yoga path involves performing actions as an offering without attachment to results?',
        options: ['Jnana Yoga', 'Bhakti Yoga', 'Karma Yoga', 'Raja Yoga'],
        correctIndex: 2,
        explanation: 'Karma Yoga is the path of selfless action — performing all duties as an offering to the divine, without personal attachment to the fruits.',
      },
      {
        order: 2,
        question: 'According to verse 6.6, what happens when one fails to control the mind?',
        options: ['The mind becomes peaceful', 'The mind becomes the greatest enemy', 'The mind becomes devoted', 'The mind achieves liberation'],
        correctIndex: 1,
        explanation: 'Krishna says the unconquered mind is the greatest enemy — it creates agitation, delusion, and binds us to suffering.',
      },
    ],
  },
  {
    order: 6,
    slug: 'the-divine',
    title: 'The Divine — Krishna\'s Nature',
    subtitle: 'Understand the nature of God as revealed in the Gita',
    icon: '✨',
    estimatedMinutes: 20,
    lessons: [
      {
        order: 1,
        title: 'Krishna\'s Universal Form',
        content: `## Krishna's Universal Form (Vishvarupa)

Chapter 11 contains one of the most awe-inspiring passages in all world literature — the revelation of Krishna's cosmic form to Arjuna.

Arjuna, having asked to see Krishna's divine form, is granted divine vision and beholds:

- All of creation existing simultaneously within Krishna
- Gods, sages, and cosmic beings paying homage
- The entire universe — past, present, and future — contained in one body

> "I am mighty Time, the source of destruction that comes forth to annihilate the worlds. Even without your participation, all the warriors arrayed in the opposing armies shall cease to exist." — 11.32

### The Message

This revelation is not merely spectacular — it is the direct perception of non-duality. All that exists is Krishna. All that appears separate is ultimately one.`,
        verseRefs: ['11.32', '11.13', '7.7'],
        estimatedMinutes: 8,
      },
    ],
    quiz: [
      {
        order: 1,
        question: 'In Chapter 11, what does Arjuna ask Krishna to reveal?',
        options: ["The secret of karma", "His divine cosmic form", "The path to heaven", "The meaning of dharma"],
        correctIndex: 1,
        explanation: 'Arjuna asks to see Krishna\'s divine, universal form. Krishna grants him divine vision and reveals the Vishvarupa — his cosmic form containing all of creation.',
      },
      {
        order: 2,
        question: 'In verse 11.32, how does Krishna describe himself?',
        options: ['The source of all creation', 'Mighty Time, the source of destruction', 'The eternal teacher', 'The friend of all beings'],
        correctIndex: 1,
        explanation: 'Krishna identifies himself as "mighty Time" (Kala) — the force of cosmic destruction that ultimately consumes all things, regardless of human action.',
      },
    ],
  },
  {
    order: 7,
    slug: 'liberation',
    title: 'Liberation & Self-Realisation',
    subtitle: 'The Gita\'s teaching on freedom and the highest goal of life',
    icon: '🌅',
    estimatedMinutes: 18,
    lessons: [
      {
        order: 1,
        title: 'The Three Gunas',
        content: `## The Three Gunas — Qualities of Nature

The Gita teaches that all of material nature (Prakriti) is composed of three qualities (gunas):

### Tamas (Inertia / Darkness)
Heaviness, dullness, confusion, laziness, and ignorance. Tamasic actions are done out of delusion.

### Rajas (Activity / Passion)
Desire, ambition, restlessness, passion, and attachment to results. Rajasic actions are driven by ego and craving.

### Sattva (Harmony / Clarity)
Purity, clarity, wisdom, and balance. Sattvic actions are performed selflessly, with clarity and wisdom.

> "From sattva arises wisdom, from rajas greed, and from tamas confusion, delusion, and ignorance." — 14.17

### The Path to Liberation

Liberation (moksha) is reached when we transcend all three gunas — not by suppressing them, but by becoming the witness of them.`,
        verseRefs: ['14.17', '14.5', '14.19'],
        estimatedMinutes: 8,
      },
    ],
    quiz: [
      {
        order: 1,
        question: 'Which guna is associated with clarity, wisdom, and purity?',
        options: ['Tamas', 'Rajas', 'Sattva', 'Dharma'],
        correctIndex: 2,
        explanation: 'Sattva is the guna of clarity, harmony, and wisdom. The Gita encourages cultivating sattva as a foundation for spiritual progress.',
      },
      {
        order: 2,
        question: 'What is the highest state according to the Gita\'s teaching on the three gunas?',
        options: ['Perfectly sattvic', 'Transcending all three gunas', 'Perfectly rajasic', 'Balancing all three equally'],
        correctIndex: 1,
        explanation: 'While sattva is the highest guna, liberation (moksha) requires transcending all three gunas entirely — becoming the pure witness of Prakriti.',
      },
    ],
  },
  {
    order: 8,
    slug: 'daily-practice',
    title: 'Daily Practice & Integration',
    subtitle: 'Bringing the Gita\'s wisdom into your everyday life',
    icon: '🌿',
    estimatedMinutes: 15,
    lessons: [
      {
        order: 1,
        title: 'Living the Gita',
        content: `## Living the Gita

The Bhagavad Gita is not merely a text to be studied — it is a manual for living. Krishna gives Arjuna practical tools for transformation.

### The Sthitaprajna — The Stable-Minded Person

In Chapter 2, Krishna describes the ideal person: the *sthitaprajna* (one of steady wisdom).

Characteristics of the sthitaprajna:
- **Unshaken in sorrow** — not disturbed by pain
- **Unmoved by pleasure** — not craving sensory delight
- **Free from fear and anger** — acting from wisdom, not reaction
- **Unattached** — neither grasping nor pushing away

> "One who is not disturbed even amidst the threefold miseries, who is not elated when there is happiness, and who is free from attachment, fear, and anger, is called a sage of steady mind." — 2.56

### Daily Practice

1. **Morning verse** — Read one verse and carry it through the day
2. **Mindful action** — Before important decisions, ask: "Am I acting from dharma or from ego?"
3. **Evening reflection** — Review your day: where were you attached to outcomes?
4. **Weekly chapter** — Slowly work through one chapter per week`,
        verseRefs: ['2.56', '2.55', '6.17'],
        estimatedMinutes: 8,
      },
    ],
    quiz: [
      {
        order: 1,
        question: 'What does the term "sthitaprajna" mean?',
        options: ['Path of devotion', 'Person of steady wisdom', 'Form of meditation', 'State of liberation'],
        correctIndex: 1,
        explanation: 'Sthitaprajna means "one of steady wisdom" — the Gita\'s ideal of a person who remains equanimous in pleasure and pain, unshaken by the vicissitudes of life.',
      },
      {
        order: 2,
        question: 'Which quality does Krishna NOT describe as a characteristic of the sthitaprajna?',
        options: ['Free from fear', 'Unattached to outcomes', 'Seeking sensory pleasure', 'Unshaken in sorrow'],
        correctIndex: 2,
        explanation: 'The sthitaprajna is described as someone who has transcended craving for sensory pleasure — not someone who seeks it. The other three options are all characteristics of the steady-minded sage.',
      },
    ],
  },
];

const ACHIEVEMENTS = [
  { slug: 'first-step', title: 'First Step', description: 'Complete your first journey lesson', icon: '👣', xpReward: 50, rarity: 'COMMON' },
  { slug: 'knowledge-seeker', title: 'Knowledge Seeker', description: 'Complete 3 journey steps', icon: '📚', xpReward: 100, rarity: 'COMMON' },
  { slug: 'halfway-there', title: 'Halfway There', description: 'Complete 4 of 8 journey steps', icon: '🌓', xpReward: 150, rarity: 'RARE' },
  { slug: 'journey-complete', title: 'Journey Complete', description: 'Complete all 8 journey steps', icon: '🏆', xpReward: 500, rarity: 'LEGENDARY' },
  { slug: 'quiz-master', title: 'Quiz Master', description: 'Score 100% on any quiz', icon: '🎯', xpReward: 200, rarity: 'RARE' },
  { slug: 'verse-reader', title: 'Verse Reader', description: 'Read 10 verses', icon: '📖', xpReward: 50, rarity: 'COMMON' },
  { slug: 'deep-reader', title: 'Deep Reader', description: 'Read 100 verses', icon: '🌊', xpReward: 200, rarity: 'RARE' },
  { slug: 'sacred-500', title: 'Sacred 500', description: 'Read 500 verses', icon: '🕉️', xpReward: 500, rarity: 'EPIC' },
  { slug: 'week-streak', title: 'Week of Wisdom', description: 'Maintain a 7-day streak', icon: '🔥', xpReward: 150, rarity: 'COMMON' },
  { slug: 'month-streak', title: 'Month of Devotion', description: 'Maintain a 30-day streak', icon: '💎', xpReward: 500, rarity: 'EPIC' },
  { slug: 'bookworm', title: 'Bookworm', description: 'Create 10 bookmarks', icon: '🔖', xpReward: 75, rarity: 'COMMON' },
  { slug: 'first-note', title: 'First Reflection', description: 'Add a note to a bookmark', icon: '✍️', xpReward: 50, rarity: 'COMMON' },
];

async function seedJourney() {
  console.log('Seeding journey steps and lessons...');

  for (const stepData of JOURNEY_STEPS) {
    const { lessons, quiz, ...stepFields } = stepData;

    const step = await (prisma.journeyStep as any).upsert({
      where: { slug: stepFields.slug },
      update: { ...stepFields },
      create: { ...stepFields },
    });

    for (const lesson of lessons) {
      await (prisma.lesson as any).upsert({
        where: { stepId_order: { stepId: step.id, order: lesson.order } },
        update: { ...lesson, stepId: step.id },
        create: { ...lesson, stepId: step.id },
      });
    }

    for (const q of quiz) {
      await (prisma.quizQuestion as any).upsert({
        where: { stepId_order: { stepId: step.id, order: q.order } },
        update: { ...q, stepId: step.id },
        create: { ...q, stepId: step.id },
      });
    }

    console.log(`  ✓ Step ${stepFields.order}: ${stepFields.title}`);
  }

  console.log('\nSeeding achievements...');
  for (const ach of ACHIEVEMENTS) {
    await (prisma.achievement as any).upsert({
      where: { slug: ach.slug },
      update: ach,
      create: ach,
    });
    console.log(`  ✓ Achievement: ${ach.title}`);
  }

  console.log('\n✅ Journey seed complete.');
}

seedJourney()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
