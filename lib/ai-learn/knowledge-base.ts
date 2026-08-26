import type { NoteSection, Topic } from "./types"

export const TOPICS: Topic[] = [
  {
    id: "photosynthesis",
    title: "Photosynthesis",
    keywords: ["photosynthesis", "plant", "chlorophyll", "leaf", "leaves"],
    sections: [
      {
        id: "overview",
        heading: "Overview",
        points: [
          "Process by which plants convert light energy into chemical energy",
          "Occurs mainly in the chloroplasts of leaf cells",
          "Produces glucose and releases oxygen as a by-product",
        ],
      },
      {
        id: "inputs",
        heading: "Inputs & Outputs",
        points: [
          "Inputs: sunlight, water (H2O), carbon dioxide (CO2)",
          "Outputs: glucose (C6H12O6), oxygen (O2)",
          "Reaction: 6CO2 + 6H2O + light → C6H12O6 + 6O2",
        ],
      },
      {
        id: "stages",
        heading: "Key Stages",
        points: [
          "Light-dependent reactions occur in the thylakoid membrane",
          "Light-independent reactions (Calvin cycle) occur in the stroma",
          "ATP and NADPH shuttle energy between the two stages",
        ],
      },
      {
        id: "importance",
        heading: "Why It Matters",
        points: [
          "Foundation of almost every food chain on Earth",
          "Regulates atmospheric oxygen and carbon dioxide levels",
          "Drives global carbon cycling and climate regulation",
        ],
      },
    ],
  },
  {
    id: "gravity",
    title: "Gravity",
    keywords: ["gravity", "newton", "gravitation", "orbit", "weight", "mass"],
    sections: [
      {
        id: "overview",
        heading: "Overview",
        points: [
          "A fundamental force of attraction between any two masses",
          "Described by Newton's Law of Universal Gravitation",
          "Refined by Einstein's General Relativity as curvature of spacetime",
        ],
      },
      {
        id: "formula",
        heading: "Core Formula",
        points: [
          "F = G · (m1 · m2) / r²",
          "G is the gravitational constant (6.674 × 10⁻¹¹ N·m²/kg²)",
          "Force increases with mass, decreases with distance squared",
        ],
      },
      {
        id: "effects",
        heading: "Real-World Effects",
        points: [
          "Keeps planets in orbit around the sun",
          "Causes objects to accelerate at 9.8 m/s² near Earth's surface",
          "Responsible for tides via the Moon's gravitational pull",
        ],
      },
    ],
  },
  {
    id: "closures",
    title: "JavaScript Closures",
    keywords: ["closure", "closures", "javascript", "scope", "function"],
    sections: [
      {
        id: "definition",
        heading: "Definition",
        points: [
          "A closure is a function bundled with its surrounding lexical scope",
          "It lets an inner function access outer function variables",
          "Variables stay alive even after the outer function returns",
        ],
      },
      {
        id: "example",
        heading: "Example Pattern",
        points: [
          "function counter() { let n = 0; return () => ++n }",
          "Each call to counter() creates an independent private state",
          "Commonly used to build private variables and memoized values",
        ],
      },
      {
        id: "uses",
        heading: "Common Uses",
        points: [
          "Event handlers that need access to outer state",
          "Debounce and throttle utility functions",
          "Module patterns before ES modules existed",
        ],
      },
    ],
  },
  {
    id: "french-revolution",
    title: "The French Revolution",
    keywords: ["french revolution", "revolution", "bastille", "guillotine", "napoleon"],
    sections: [
      {
        id: "causes",
        heading: "Root Causes",
        points: [
          "Deep financial crisis and unfair taxation of commoners",
          "Widespread famine and rising bread prices in 1788-89",
          "Enlightenment ideas questioning monarchy and privilege",
        ],
      },
      {
        id: "timeline",
        heading: "Key Timeline",
        points: [
          "1789: Storming of the Bastille marks the revolution's start",
          "1793: Execution of King Louis XVI",
          "1799: Napoleon Bonaparte seizes power, ending the revolutionary period",
        ],
      },
      {
        id: "impact",
        heading: "Lasting Impact",
        points: [
          "Ended absolute monarchy in France",
          "Inspired the spread of nationalism and republicanism across Europe",
          "Produced the Declaration of the Rights of Man and of the Citizen",
        ],
      },
    ],
  },
  {
    id: "neural-networks",
    title: "Neural Networks",
    keywords: ["neural network", "deep learning", "machine learning", "ai", "artificial intelligence", "model"],
    sections: [
      {
        id: "overview",
        heading: "Overview",
        points: [
          "Computing systems loosely inspired by biological brains",
          "Built from layers of interconnected artificial neurons",
          "Learn patterns from data instead of explicit rules",
        ],
      },
      {
        id: "architecture",
        heading: "Core Architecture",
        points: [
          "Input layer receives raw features",
          "Hidden layers apply weights, biases, and activation functions",
          "Output layer produces the final prediction",
        ],
      },
      {
        id: "training",
        heading: "How They Learn",
        points: [
          "Forward pass computes a prediction from current weights",
          "Loss function measures the error against the true answer",
          "Backpropagation adjusts weights to reduce that error over time",
        ],
      },
    ],
  },
  {
    id: "solar-system",
    title: "The Solar System",
    keywords: ["solar system", "planet", "planets", "sun", "mars", "jupiter", "saturn"],
    sections: [
      {
        id: "structure",
        heading: "Structure",
        points: [
          "Centered on the Sun, which holds 99.8% of the system's mass",
          "Eight planets divided into rocky inner and gas giant outer worlds",
          "Includes moons, asteroid belts, comets, and dwarf planets",
        ],
      },
      {
        id: "inner",
        heading: "Inner Planets",
        points: [
          "Mercury, Venus, Earth, and Mars — small and rocky",
          "Closer orbits mean shorter years and higher surface temperatures",
          "Earth is the only known planet with life",
        ],
      },
      {
        id: "outer",
        heading: "Outer Planets",
        points: [
          "Jupiter, Saturn, Uranus, and Neptune — large and gaseous",
          "Jupiter's gravity shields inner planets from many asteroids",
          "Saturn's rings are made of ice and rock fragments",
        ],
      },
    ],
  },
  {
    id: "compound-interest",
    title: "Compound Interest",
    keywords: ["compound interest", "interest", "investing", "finance", "savings"],
    sections: [
      {
        id: "overview",
        heading: "Overview",
        points: [
          "Interest calculated on both the initial principal and accumulated interest",
          "Grows exponentially rather than linearly over time",
          "The core mechanism behind long-term wealth building",
        ],
      },
      {
        id: "formula",
        heading: "Core Formula",
        points: ["A = P(1 + r/n)^(nt)", "P = principal, r = rate, n = compounds per year, t = years"],
      },
      {
        id: "tips",
        heading: "Practical Tips",
        points: [
          "Starting early matters more than the amount invested",
          "Higher compounding frequency slightly increases returns",
          "Reinvesting dividends accelerates the compounding effect",
        ],
      },
    ],
  },
]

function buildGenericSections(query: string): NoteSection[] {
  const clean = query.trim().replace(/[?.!]+$/, "")
  return [
    {
      id: "overview",
      heading: "Overview",
      points: [
        `Breaking down the topic: "${clean}"`,
        "Structuring the core idea before diving into detail",
        "Framing what this concept is and why it exists",
      ],
    },
    {
      id: "key-points",
      heading: "Key Points",
      points: [
        "Identify the fundamental building blocks of the concept",
        "Connect it to something you already understand",
        "Note any formulas, rules, or definitions worth memorizing",
      ],
    },
    {
      id: "why-it-matters",
      heading: "Why It Matters",
      points: [
        "Understanding this helps solve related real-world problems",
        "Forms a foundation for more advanced topics ahead",
      ],
    },
    {
      id: "recap",
      heading: "Quick Recap",
      points: ["Review the overview and key points above", "Try explaining it in your own words to lock it in"],
    },
  ]
}

export function generateNotes(query: string): { title: string; sections: NoteSection[] } {
  const q = query.toLowerCase()
  let best: Topic | null = null
  let bestScore = 0

  for (const topic of TOPICS) {
    let score = 0
    for (const kw of topic.keywords) {
      if (q.includes(kw)) score += kw.length
    }
    if (score > bestScore) {
      bestScore = score
      best = topic
    }
  }

  if (best) {
    return { title: best.title, sections: best.sections }
  }

  return { title: query.trim() || "New Topic", sections: buildGenericSections(query) }
}
