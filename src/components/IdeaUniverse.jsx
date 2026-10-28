import { ArrowLeft, BookOpen, Compass } from 'lucide-react';

const ideaMap = {
  monotheism: [
    ['The problem of evil', 'If a good and powerful God exists, how should we understand suffering?', 'Theology · Ethics'],
    ['Natural law', 'Can moral rules be discovered through reason and the order of nature?', 'Ethics · Aquinas'],
    ['Faith and reason', 'Do belief and rational thought compete, or can they strengthen each other?', 'Epistemology'],
  ],
  naturalism: [
    ['The brain in a vat', 'If every experience could be simulated, what would count as real knowledge?', 'Epistemology'],
    ['The good life', 'Can human wellbeing and shared flourishing ground ethics without a divine source?', 'Ethics · Science'],
    ['Consciousness', 'How can first-person experience arise from physical matter?', 'Mind · Philosophy of mind'],
  ],
  pantheism: [
    ['The unity of nature', 'Is the boundary between the self and the world more fluid than it seems?', 'Metaphysics · Spinoza'],
    ['Tao and flow', 'What changes when we stop forcing life and learn to move with its patterns?', 'Eastern philosophy'],
    ['Deep ecology', 'Do non-human beings have value beyond their usefulness to us?', 'Ethics · Nature'],
  ],
  deism: [
    ['The clockwork universe', 'Can a lawful universe point to a creator without requiring constant intervention?', 'Metaphysics'],
    ['Autonomy', 'What does it mean to think for yourself rather than inherit every answer?', 'Enlightenment · Ethics'],
    ['The limits of reason', 'Where can reason take us, and where must humility begin?', 'Epistemology'],
  ],
  existentialism: [
    ['The absurd', 'How can a person live honestly when the universe offers no final answer?', 'Existentialism · Camus'],
    ['Radical freedom', 'Are we free to choose who we become, even inside difficult circumstances?', 'Ethics · Sartre'],
    ['Authenticity', 'What would remain if you stopped living for other people’s expectations?', 'Existentialism'],
  ],
  postmodernism: [
    ['Who decides what is normal?', 'How do language, institutions, and power shape the truths we accept?', 'Culture · Foucault'],
    ['The author is dead', 'Can a work mean more than its creator intended?', 'Art · Derrida'],
    ['Many truths', 'How can different perspectives challenge one dominant story without making dialogue impossible?', 'Knowledge · Society'],
  ],
  polytheism: [
    ['Many ways of being', 'What can a world of many gods teach us about pluralism and difference?', 'Religion · Culture'],
    ['Ritual and meaning', 'Why do repeated actions help communities remember what matters?', 'Anthropology · Ethics'],
    ['Nature as teacher', 'What do myths reveal about how people learn from seasons, animals, and place?', 'Myth · Nature'],
  ],
};

const defaultIdeas = [
  ['The Ship of Theseus', 'If every part of a thing changes, is it still the same thing?', 'Identity · Ancient Greece'],
  ['Plato’s Cave', 'What if the things you call real are only shadows of something deeper?', 'Knowledge · Plato'],
  ['The examined life', 'Which belief would you be willing to question today?', 'Self · Socrates'],
  ['The trolley problem', 'Would you sacrifice one person to save five others?', 'Ethics · Thought experiment'],
  ['The veil of ignorance', 'What rules would you choose for society if you did not know your place in it?', 'Justice · Rawls'],
  ['The experience machine', 'Would you plug into a machine that gave you a perfect life?', 'Happiness · Nozick'],
  ['Euthyphro dilemma', 'Is something good because the gods command it, or do the gods command it because it is good?', 'Ethics · Plato'],
  ['Moral luck', 'How much should we judge a person for outcomes shaped by chance?', 'Ethics · Nagel'],
  ['Categorical imperative', 'Could the rule behind your action become a rule for everyone?', 'Ethics · Kant'],
  ['Virtue ethics', 'What kind of person should you become, rather than only asking what to do?', 'Ethics · Aristotle'],
  ['The allegory of the cave', 'What would it cost to leave familiar appearances and face a harder truth?', 'Knowledge · Plato'],
  ['The method of doubt', 'What can survive if you question every belief that could be mistaken?', 'Knowledge · Descartes'],
  ['The Gettier problem', 'Can you have a justified true belief and still lack knowledge?', 'Epistemology · Gettier'],
  ['The problem of induction', 'Why expect the future to resemble the past?', 'Knowledge · Hume'],
  ['Personal identity', 'What makes you the same person through memory, change, and time?', 'Mind · Locke'],
  ['Compatibilism', 'Can free will exist if every event has a cause?', 'Freedom · Philosophy of action'],
  ['Eternal recurrence', 'Would you live differently if you had to repeat this life forever?', 'Existence · Nietzsche'],
  ['Being-toward-death', 'How does awareness of death change the way a life becomes your own?', 'Existence · Heidegger'],
  ['The original position', 'What rules would seem fair before you knew who you would be?', 'Justice · Rawls'],
  ['The panopticon', 'How does the possibility of being watched shape behaviour?', 'Power · Foucault'],
  ['The social contract', 'Why should free people accept limits placed on them by a shared society?', 'Politics · Hobbes / Rousseau'],
  ['Negative capability', 'Can uncertainty be held without rushing to a final answer?', 'Art · Keats'],
  ['The sublime', 'Why can vastness and danger feel both frightening and beautiful?', 'Aesthetics · Kant'],
];

export default function IdeaUniverse({ result, onBack, setActiveModal }) {
  const worldviewId = result?.worldviewId === 'nihilism' ? 'existentialism' : result?.worldviewId;
  const personalIdeas = ideaMap[worldviewId] || [];
  const ideas = [...personalIdeas, ...defaultIdeas];
  const starPositions = [
    [8, 12], [24, 8], [42, 16], [61, 8], [82, 14], [91, 30],
    [12, 35], [30, 29], [70, 30], [86, 45], [5, 58], [24, 50],
    [76, 57], [94, 67], [12, 78], [32, 73], [66, 75], [84, 84],
    [48, 7], [53, 87], [42, 40], [59, 57], [3, 25], [97, 17],
  ];

  return (
    <section className="idea-universe">
      <div className="universe-header">
        <button className="back-button" onClick={onBack}><ArrowLeft className="w-4 h-4" /> Back to ideas</button>
        <span className="universe-kicker"><Compass className="w-4 h-4" /> Explore new ideas</span>
        <h1>A universe of questions</h1>
        <p>{result ? `A constellation shaped by your ${result.title || 'worldview'}.` : 'Choose a star. Follow the question wherever it leads.'}</p>
      </div>
      <div className="star-field">
        {ideas.map(([title, thought, tag], index) => (
          <button key={`${title}-${index}`} className="idea-star" style={{ left: `${starPositions[index % starPositions.length][0]}%`, top: `${starPositions[index % starPositions.length][1]}%` }} onClick={() => setActiveModal({ title, type: tag, summary: thought })}>
            <span className="star-core" /><span className="star-label">{title}</span>
          </button>
        ))}
        <div className="universe-orb"><BookOpen className="w-5 h-5" /><span>{result ? 'Your path' : 'Start anywhere'}</span></div>
      </div>
    </section>
  );
}
