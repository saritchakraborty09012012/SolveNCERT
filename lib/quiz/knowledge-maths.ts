import type { SubjectKnowledge } from './knowledge-base';

export const MATHS_KNOWLEDGE: SubjectKnowledge = {
  id: 'maths', name: 'Mathematics', slug: 'maths',
  book: 'Ganita Manjari Part I', bookSlug: 'ganita-manjari',
  chapters: [
    {
      id: 'ch01', number: 1, title: 'Orienting Yourself: The Use of Coordinates',
      slug: 'orienting-yourself-the-use-of-coordinates', subject: 'Maths',
      keyConcepts: ['Cartesian plane', 'x-axis', 'y-axis', 'origin', 'quadrants', 'coordinates', 'distance formula'],
      formulas: ['d = sqrt((x2-x1)^2 + (y2-y1)^2)', 'Midpoint = ((x1+x2)/2, (y1+y2)/2)'],
      topics: [
        { name: 'Cartesian Plane', keywords: ['coordinate', 'plane', 'axis', 'quadrant', 'origin'], concepts: ['Four quadrants', 'Sign convention', 'Plotting points'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Coordinates', keywords: ['point', 'coordinate', 'ordered pair'], concepts: ['Ordered pairs', 'Reading coordinates'], difficulty: 'easy', questionTypes: ['mcq', 'short_answer'] },
        { name: 'Distance Formula', keywords: ['distance', 'formula', 'between points'], concepts: ['Distance between two points'], difficulty: 'moderate', questionTypes: ['numerical', 'competency'] },
        { name: 'Real-world Applications', keywords: ['map', 'room', 'layout', 'navigation'], concepts: ['Grid-based navigation'], difficulty: 'moderate', questionTypes: ['case_based', 'competency'] },
      ],
    },
    {
      id: 'ch02', number: 2, title: 'Introduction to Linear Polynomials',
      slug: 'introduction-to-linear-polynomials', subject: 'Maths',
      keyConcepts: ['polynomial', 'degree', 'coefficient', 'variable', 'linear equation', 'zeroes'],
      formulas: ['ax + b = 0 => x = -b/a'],
      topics: [
        { name: 'Polynomial Basics', keywords: ['term', 'coefficient', 'degree', 'variable'], concepts: ['Types of polynomials', 'Degree classification'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Linear Polynomials', keywords: ['linear', 'degree 1', 'ax+b'], concepts: ['Standard form', 'Zeroes of polynomial'], difficulty: 'easy', questionTypes: ['mcq', 'short_answer'] },
        { name: 'Value of Polynomial', keywords: ['evaluate', 'substitute', 'p(x)'], concepts: ['Finding p(a)'], difficulty: 'moderate', questionTypes: ['numerical', 'mcq'] },
        { name: 'Linear Equations', keywords: ['equation', 'solve', 'variable'], concepts: ['Solving linear equations', 'Word problems'], difficulty: 'moderate', questionTypes: ['competency', 'case_based'] },
      ],
    },
    {
      id: 'ch03', number: 3, title: 'The World of Numbers',
      slug: 'the-world-of-numbers', subject: 'Maths',
      keyConcepts: ['natural numbers', 'integers', 'rational numbers', 'number line', 'closure', 'commutativity', 'associativity'],
      formulas: ['a + b = b + a', 'a + (b + c) = (a + b) + c'],
      topics: [
        { name: 'Number Systems', keywords: ['natural', 'whole', 'integer', 'rational'], concepts: ['Classification of numbers'], difficulty: 'easy', questionTypes: ['mcq', 'match_following'] },
        { name: 'Properties of Numbers', keywords: ['closure', 'commutative', 'associative', 'distributive'], concepts: ['Brahmagupta laws'], difficulty: 'moderate', questionTypes: ['mcq', 'assertion_reason'] },
        { name: 'Rational Numbers', keywords: ['fraction', 'ratio', 'decimal'], concepts: ['Representation on number line'], difficulty: 'moderate', questionTypes: ['numerical', 'short_answer'] },
      ],
    },
    {
      id: 'ch04', number: 4, title: 'Exploring Algebraic Identities',
      slug: 'exploring-algebraic-identities', subject: 'Maths',
      keyConcepts: ['identity', '(a+b)^2', '(a-b)^2', 'a^2-b^2', 'expansion', 'factorisation'],
      formulas: ['(a+b)^2 = a^2+2ab+b^2', '(a-b)^2 = a^2-2ab+b^2', 'a^2-b^2 = (a+b)(a-b)'],
      topics: [
        { name: 'Standard Identities', keywords: ['identity', 'square', 'formula'], concepts: ['(a+b)^2', '(a-b)^2', 'Difference of squares'], difficulty: 'moderate', questionTypes: ['mcq', 'numerical'] },
        { name: 'Expansion', keywords: ['expand', 'multiply', 'simplify'], concepts: ['Using identities to expand'], difficulty: 'moderate', questionTypes: ['numerical', 'short_answer'] },
        { name: 'Factorisation', keywords: ['factor', 'split', 'reverse'], concepts: ['Factoring using identities'], difficulty: 'hard', questionTypes: ['numerical', 'hots'] },
      ],
    },
    {
      id: 'ch05', number: 5, title: 'Circles',
      slug: 'im-up-and-down-and-round-and-round', subject: 'Maths',
      keyConcepts: ['circle', 'radius', 'diameter', 'circumference', 'area', 'pi'],
      formulas: ['C = 2*pi*r', 'A = pi*r^2', 'pi = 22/7'],
      topics: [
        { name: 'Circle Basics', keywords: ['circle', 'radius', 'diameter', 'centre'], concepts: ['Parts of a circle'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Circumference and Area', keywords: ['circumference', 'perimeter', 'area', 'pi'], concepts: ['Formula for circumference', 'Formula for area'], difficulty: 'moderate', questionTypes: ['numerical', 'mcq'] },
        { name: 'Applications', keywords: ['wheel', 'track', 'garden'], concepts: ['Distance in revolutions'], difficulty: 'hard', questionTypes: ['competency', 'case_based', 'numerical'] },
      ],
    },
    {
      id: 'ch06', number: 6, title: 'Measuring Space: Perimeter and Area',
      slug: 'measuring-space-perimeter-and-area', subject: 'Maths',
      keyConcepts: ['perimeter', 'area', 'rectangle', 'square', 'triangle', 'composite shapes'],
      formulas: ['P(rect)=2(l+b)', 'A(rect)=l*b', 'P(sq)=4s', 'A(sq)=s^2', 'A(tri)=1/2*b*h'],
      topics: [
        { name: 'Perimeter', keywords: ['perimeter', 'boundary', 'fence'], concepts: ['Perimeter of shapes'], difficulty: 'easy', questionTypes: ['mcq', 'numerical'] },
        { name: 'Area', keywords: ['area', 'surface', 'coverage'], concepts: ['Area of shapes'], difficulty: 'moderate', questionTypes: ['numerical', 'competency'] },
        { name: 'Composite Figures', keywords: ['composite', 'combined', 'irregular'], concepts: ['Breaking into simpler shapes'], difficulty: 'hard', questionTypes: ['competency', 'case_based'] },
      ],
    },
    {
      id: 'ch07', number: 7, title: 'Introduction to Probability',
      slug: 'the-mathematics-of-maybe-introduction-to-probability', subject: 'Maths',
      keyConcepts: ['probability', 'sample space', 'events', 'outcomes', 'complementary events'],
      formulas: ['P(E) = favourable / total', 'P(E) + P(not E) = 1'],
      topics: [
        { name: 'Basic Probability', keywords: ['probability', 'chance', 'likely', 'event'], concepts: ['Definition of probability'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Sample Space', keywords: ['sample space', 'outcomes', 'possible'], concepts: ['Listing outcomes'], difficulty: 'moderate', questionTypes: ['mcq', 'short_answer'] },
        { name: 'Complementary Events', keywords: ['complement', 'not event'], concepts: ['P(not E) = 1 - P(E)'], difficulty: 'moderate', questionTypes: ['assertion_reason', 'numerical'] },
      ],
    },
    {
      id: 'ch08', number: 8, title: 'Exploring Sequences and Progressions',
      slug: 'exploring-sequences-and-progressions', subject: 'Maths',
      keyConcepts: ['sequence', 'AP', 'common difference', 'nth term', 'sum of n terms'],
      formulas: ['an = a + (n-1)d', 'Sn = n/2 * (2a + (n-1)d)'],
      topics: [
        { name: 'Sequences', keywords: ['sequence', 'pattern', 'term', 'next'], concepts: ['Finding patterns'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Arithmetic Progression', keywords: ['AP', 'common difference'], concepts: ['Identifying AP', 'Finding d'], difficulty: 'moderate', questionTypes: ['mcq', 'numerical'] },
        { name: 'nth Term and Sum', keywords: ['nth term', 'sum', 'formula'], concepts: ['Using nth term formula'], difficulty: 'hard', questionTypes: ['numerical', 'competency', 'hots'] },
      ],
    },
  ],
};
