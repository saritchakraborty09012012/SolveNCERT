import type { SubjectKnowledge } from './knowledge-base';

export const SST_KNOWLEDGE: SubjectKnowledge = {
  id: 'sst', name: 'Social Science', slug: 'sst',
  book: 'Exploring Social Science', bookSlug: 'exploring-social-science',
  chapters: [
    {
      id: 'ch01', number: 1, title: 'Understanding Social Science',
      slug: 'understanding-social-science', subject: 'SST',
      keyConcepts: ['social science', 'history', 'geography', 'civics', 'economics'],
      topics: [
        { name: 'What is Social Science', keywords: ['society', 'human behaviour', 'study', 'discipline'], concepts: ['Branches of social science', 'Relevance of social science'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Disciplines Overview', keywords: ['history', 'geography', 'civics', 'economics'], concepts: ['What each branch studies', 'Interconnection between branches'], difficulty: 'easy', questionTypes: ['match_following', 'short_answer'] },
      ],
    },
    {
      id: 'ch02', number: 2, title: 'Shaping of the Earth\'s Surface',
      slug: 'shaping-of-the-earths-surface', subject: 'SST',
      keyConcepts: ['rocks', 'weathering', 'erosion', 'landforms', 'soil'],
      topics: [
        { name: 'Types of Rocks', keywords: ['igneous', 'sedimentary', 'metamorphic', 'rock cycle'], concepts: ['Classification of rocks', 'Rock cycle'], difficulty: 'easy', questionTypes: ['mcq', 'match_following'] },
        { name: 'Weathering and Erosion', keywords: ['weathering', 'erosion', 'wind', 'water', 'landform'], concepts: ['Agents of erosion', 'Formation of landforms'], difficulty: 'moderate', questionTypes: ['short_answer', 'competency'] },
      ],
    },
    {
      id: 'ch03', number: 3, title: 'Atmosphere and Climate',
      slug: 'atmosphere-and-climate', subject: 'SST',
      keyConcepts: ['atmosphere', 'layers', 'temperature', 'monsoon', 'climate zones'],
      topics: [
        { name: 'Structure of Atmosphere', keywords: ['troposphere', 'stratosphere', 'layers', 'composition'], concepts: ['Layers of the atmosphere', 'Importance of each layer'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Climate and Weather', keywords: ['monsoon', 'climate', 'rainfall', 'temperature'], concepts: ['Monsoon mechanism', 'Climate zones of India'], difficulty: 'moderate', questionTypes: ['short_answer', 'case_based'] },
      ],
    },
    {
      id: 'ch04', number: 4, title: 'Early Humans and Beginning of Civilisation',
      slug: 'early-humans-and-beginning-of-civilisation', subject: 'SST',
      keyConcepts: ['stone age', 'agricultural revolution', 'early civilizations', 'nomadic life', 'settled life'],
      topics: [
        { name: 'Stone Age', keywords: ['paleolithic', 'mesolithic', 'neolithic', 'tool'], concepts: ['Three stages of stone age', 'Life of early humans'], difficulty: 'easy', questionTypes: ['mcq', 'match_following'] },
        { name: 'Agricultural Revolution', keywords: ['farming', 'settlement', 'domestication', 'civilisation'], concepts: ['Shift from hunting to farming', 'Rise of early civilizations'], difficulty: 'moderate', questionTypes: ['short_answer', 'competency'] },
      ],
    },
    {
      id: 'ch05', number: 5, title: 'State and Society up to 1000 CE',
      slug: 'state-and-society-up-to-1000-ce', subject: 'SST',
      keyConcepts: ['Mauryas', 'Guptas', 'Sangam age', 'Varna system', 'Bhakti movement'],
      topics: [
        { name: 'Major Empires', keywords: ['Maurya', 'Gupta', 'Sangam', 'empire', 'dynasty'], concepts: ['Mauryan administration', 'Gupta golden age'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Society and Culture', keywords: ['Varna', 'Bhakti', 'religion', 'art', 'literature'], concepts: ['Varna system', 'Bhakti and cultural development'], difficulty: 'moderate', questionTypes: ['short_answer', 'assertion_reason'] },
      ],
    },
    {
      id: 'ch06', number: 6, title: 'Democracy',
      slug: 'democracy', subject: 'SST',
      keyConcepts: ['democracy', 'features', 'types', 'Indian democracy', 'universal adult franchise'],
      topics: [
        { name: 'Meaning and Features', keywords: ['democracy', 'people', 'election', 'freedom', 'equality'], concepts: ['Definition of democracy', 'Key features of democracy'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Types of Democracy', keywords: ['direct', 'indirect', 'parliamentary', 'presidential'], concepts: ['Direct vs indirect democracy', 'Indian parliamentary democracy'], difficulty: 'moderate', questionTypes: ['short_answer', 'competency'] },
      ],
    },
    {
      id: 'ch07', number: 7, title: 'Elections',
      slug: 'elections', subject: 'SST',
      keyConcepts: ['election process', 'Election Commission', 'voting', 'political parties', 'universal suffrage'],
      topics: [
        { name: 'Election Process', keywords: ['constituency', 'candidate', 'ballot', 'polling'], concepts: ['How elections are conducted', 'First-past-the-post system'], difficulty: 'easy', questionTypes: ['mcq', 'short_answer'] },
        { name: 'Election Commission and Parties', keywords: ['Election Commission', 'party', 'symbol', 'manifesto', 'campaign'], concepts: ['Role of Election Commission', 'Function of political parties'], difficulty: 'moderate', questionTypes: ['competency', 'case_based'] },
      ],
    },
    {
      id: 'ch08', number: 8, title: 'Building Blocks in Economics: The Problem of Choice',
      slug: 'building-blocks-in-economics', subject: 'SST',
      keyConcepts: ['scarcity', 'opportunity cost', 'factors of production', 'economic problem', 'choice'],
      topics: [
        { name: 'Scarcity and Choice', keywords: ['scarcity', 'choice', 'unlimited wants', 'limited resources'], concepts: ['Basic economic problem', 'Why we make choices'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Opportunity Cost and Production', keywords: ['opportunity cost', 'land', 'labour', 'capital'], concepts: ['Opportunity cost', 'Four factors of production'], difficulty: 'moderate', questionTypes: ['numerical', 'competency'] },
      ],
    },
    {
      id: 'ch09', number: 9, title: 'The Price Puzzle: What Drives the Market',
      slug: 'the-price-puzzle', subject: 'SST',
      keyConcepts: ['demand', 'supply', 'price determination', 'equilibrium', 'market'],
      topics: [
        { name: 'Demand and Supply', keywords: ['demand', 'supply', 'price', 'quantity', 'market'], concepts: ['Law of demand', 'Law of supply'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Price Determination', keywords: ['equilibrium', 'surplus', 'shortage', 'market price'], concepts: ['How price is determined', 'Shifts in demand and supply'], difficulty: 'moderate', questionTypes: ['numerical', 'case_based'] },
      ],
    },
  ],
};
