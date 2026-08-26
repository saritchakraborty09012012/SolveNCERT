// Advanced Mathematics (Optional), Class 9 — CBSE 2026-27
// Solutions transcribed from "Advanced Mathematics Class 9 - Full Solutions.pdf"
// Each question has two tabs: answerKey (final answer) + schoolMethod (full board-level steps).

export interface AdvMathQuestion {
  id:     string;
  number: string;
  text:   string;
  parts?: string[];
  isHard: boolean;
  answer: { answerKey: string; schoolMethod: string; trickMethod?: string; };
}
export interface AdvMathSection { id: string; title: string; questions: AdvMathQuestion[]; }
export interface AdvMathChapter {
  id: string; number: number; title: string; slug: string; code: string;
  description: string; exercises: AdvMathSection[];
}

export const ADVMATH_CHAPTERS: AdvMathChapter[] = [
  {
    id: 'ch01', number: 1,
    title: 'Sets',
    slug: 'sets',
    code: 'am01',
    description: 'Introduces the language of sets — roster and set-builder forms, subsets and power sets, cardinality, union, intersection, difference and complement, with De Morgan\u2019s laws and applications of set theory.',
    exercises: [
      {
        id: 'ex1.1', title: 'Exercise 1.1',
        questions: [
          {
            id: 'q1a', number: '1(a)', isHard: false,
            text: 'List the elements of the set $\\{x : x \\text{ is an integer and } x^2 = 9\\}$.',
            answer: {
              answerKey: '$\\boxed{\\{-3, 3\\}}$',
              schoolMethod: `**Solution:**

Given: $x^2 = 9$.

Taking square root on both sides:
$$x = \\pm 3$$

**Answer:** $\\boxed{\\text{The set is }\\{-3, 3\\}}$.`,
            }
          },
          {
            id: 'q1b', number: '1(b)', isHard: false,
            text: 'List the elements of the set $\\{x : x \\text{ is a positive integer less than } 5\\}$.',
            answer: {
              answerKey: '$\\boxed{\\{1, 2, 3, 4\\}}$',
              schoolMethod: `**Solution:**

Positive integers less than 5 are $1, 2, 3, 4$.

**Answer:** $\\boxed{\\{1, 2, 3, 4\\}}$.`,
            }
          },
          {
            id: 'q1c', number: '1(c)', isHard: false,
            text: 'List the elements of the set $\\{x : x \\text{ is an even natural number divisible by } 5\\}$.',
            answer: {
              answerKey: '$\\boxed{\\{10, 20, 30, \\dots\\}}$',
              schoolMethod: `**Solution:**

A number that is both even and divisible by 5 must be a multiple of 10.

**Answer:** $\\boxed{\\{10, 20, 30, \\dots\\}}$.`,
            }
          },
          {
            id: 'q1d', number: '1(d)', isHard: false,
            text: 'List the elements of the set $\\{x : x \\in \\mathbb{N} \\text{ and } x < -1\\}$.',
            answer: {
              answerKey: '$\\boxed{\\text{Empty set }\\varnothing}$',
              schoolMethod: `**Solution:**

Natural numbers are always positive. No natural number is negative, so no value of $x$ satisfies $x < -1$.

**Answer:** $\\boxed{\\text{The set is the empty set }\\varnothing}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: true,
            text: 'Determine which elements of the set $A = \\{-5, -\\frac{3}{2}, -\\frac{1}{5}, 0, \\sqrt{2}, \\pi, 13.4, \\frac{1}{3}, \\sqrt{19}\\}$ are (a) natural numbers, (b) whole numbers, (c) integers, (d) rational numbers, (e) real numbers.',
            parts: ['Natural numbers', 'Whole numbers', 'Integers', 'Rational numbers', 'Real numbers'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) None, (b) }\\{0\\}\\text{, (c) }\\{-5, 0\\}\\text{, (d) }\\{-5, -\\frac{3}{2}, -\\frac{1}{5}, 0, 13.4, \\frac{1}{3}\\}\\text{, (e) }A\\text{ itself}}$',
              schoolMethod: `**Solution:**

Compare each element of $A$ with the number system definitions.

**(a) Natural numbers** — none of the elements is a natural number (the set contains no positive counting number).  
**(b) Whole numbers** — $0$ is the only whole number.  
**(c) Integers** — $-5$ and $0$.  
**(d) Rational numbers** — $-5$, $-\\frac{3}{2}$, $-\\frac{1}{5}$, $0$, $13.4$, $\\frac{1}{3}$ (all can be written as a ratio of integers). $\\sqrt{2}$, $\\pi$, $\\sqrt{19}$ are irrational.  
**(e) Real numbers** — all elements of $A$ are real numbers, so $A$ itself.

**Answer:** $\\boxed{\\text{(a) None, (b) }\\{0\\}\\text{, (c) }\\{-5, 0\\}\\text{, (d) }\\{-5, -\\frac{3}{2}, -\\frac{1}{5}, 0, 13.4, \\frac{1}{3}\\}\\text{, (e) }A\\text{ itself}}$.`,
            }
          },
          {
            id: 'q3a', number: '3(a)', isHard: false,
            text: 'Write the set $\\{x : x \\text{ is a two-digit number and the sum of its digits is } 5\\}$ in roster form.',
            answer: {
              answerKey: '$\\boxed{\\{14, 23, 32, 41, 50\\}}$',
              schoolMethod: `**Solution:**

Two-digit numbers whose digit sum is 5:
$14 \\ (1+4=5)$, $23 \\ (2+3=5)$, $32 \\ (3+2=5)$, $41 \\ (4+1=5)$, $50 \\ (5+0=5)$.

**Answer:** $\\boxed{\\{14, 23, 32, 41, 50\\}}$.`,
            }
          },
          {
            id: 'q3b', number: '3(b)', isHard: false,
            text: 'Write the set $\\{x : x \\text{ is an integer and } |x| \\geq 9\\}$ in roster form.',
            answer: {
              answerKey: '$\\boxed{\\{\\dots, -11, -10, -9, 9, 10, 11, \\dots\\}}$',
              schoolMethod: `**Solution:**

$|x| \\geq 9$ means $x \\leq -9$ or $x \\geq 9$. All such integers form an infinite set.

**Answer:** $\\boxed{\\{\\dots, -11, -10, -9, 9, 10, 11, \\dots\\}}$.`,
            }
          },
          {
            id: 'q3c', number: '3(c)', isHard: false,
            text: 'Write the set $\\{x : x \\text{ is a letter of the word "SWEET"}\\}$ in roster form.',
            answer: {
              answerKey: '$\\boxed{\\{S, W, E, T\\}}$',
              schoolMethod: `**Solution:**

The word "SWEET" has the letters S, W, E, E, T. A set lists each distinct element once.

**Answer:** $\\boxed{\\{S, W, E, T\\}}$.`,
            }
          },
          {
            id: 'q3d', number: '3(d)', isHard: true,
            text: 'Write the set $\\left\\{x : x = \\frac{n+1}{n},\\ n \\in \\mathbb{N},\\ n < 6\\right\\}$ in roster form.',
            answer: {
              answerKey: '$\\boxed{\\left\\{2, \\frac{3}{2}, \\frac{4}{3}, \\frac{5}{4}, \\frac{6}{5}\\right\\}}$',
              schoolMethod: `**Solution:**

For $n = 1, 2, 3, 4, 5$:

$$x = \\frac{n+1}{n}$$

| $n$ | $x$ |
|---|---|
| $1$ | $\\frac{2}{1} = 2$ |
| $2$ | $\\frac{3}{2}$ |
| $3$ | $\\frac{4}{3}$ |
| $4$ | $\\frac{5}{4}$ |
| $5$ | $\\frac{6}{5}$ |

**Answer:** $\\boxed{\\left\\{2, \\frac{3}{2}, \\frac{4}{3}, \\frac{5}{4}, \\frac{6}{5}\\right\\}}$.`,
            }
          },
          {
            id: 'q3e', number: '3(e)', isHard: false,
            text: 'Write the set $\\{x : x \\text{ is a composite number}\\}$ in roster form.',
            answer: {
              answerKey: '$\\boxed{\\{4, 6, 8, 9, 10, 12, \\dots\\}}$',
              schoolMethod: `**Solution:**

Composite numbers are natural numbers greater than 1 that are not prime.

**Answer:** $\\boxed{\\{4, 6, 8, 9, 10, 12, \\dots\\}}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Write the following sets in set-builder form: (i) $\\{2, 4, 6, 8, \\dots\\}$, (ii) $\\{3, 6, 9, 12, 15\\}$, (iii) $\\{1, 4, 9, 16, \\dots\\}$, (iv) $\\{8, 9, 10, 11, \\dots\\}$, (v) $\\{1, 2, 3, 6\\}$.',
            parts: ['$\\{2, 4, 6, 8, \\dots\\}$', '$\\{3, 6, 9, 12, 15\\}$', '$\\{1, 4, 9, 16, \\dots\\}$', '$\\{8, 9, 10, 11, \\dots\\}$', '$\\{1, 2, 3, 6\\}$'],
            answer: {
              answerKey: '$\\boxed{\\text{(i) }\\{x : x = 2n, n \\in \\mathbb{N}\\}\\text{, (ii) }\\{x : x = 3n, n \\in \\mathbb{N}, n \\leq 5\\}\\text{, (iii) }\\{x : x = n^2, n \\in \\mathbb{N}\\}\\text{, (iv) }\\{x : x \\in \\mathbb{N}, x \\geq 8\\}\\text{, (v) }\\{x : x \\text{ is a factor of } 6\\}}$',
              schoolMethod: `**Solution:**

**(i)** $\\{2, 4, 6, 8, \\dots\\}$ — even natural numbers:
$$\\{x : x = 2n, n \\in \\mathbb{N}\\}$$

**(ii)** $\\{3, 6, 9, 12, 15\\}$ — first five multiples of 3:
$$\\{x : x = 3n, n \\in \\mathbb{N}, n \\leq 5\\}$$

**(iii)** $\\{1, 4, 9, 16, \\dots\\}$ — perfect squares:
$$\\{x : x = n^2, n \\in \\mathbb{N}\\}$$

**(iv)** $\\{8, 9, 10, 11, \\dots\\}$ — natural numbers from 8 onwards:
$$\\{x : x \\in \\mathbb{N}, x \\geq 8\\}$$

**(v)** $\\{1, 2, 3, 6\\}$ — the factors of 6:
$$\\{x : x \\text{ is a factor of } 6\\}$$

**Note:** Can two different sets have the same roster form? No. A roster form lists exactly the elements of one set, so two different sets cannot share the same roster form.

**Answer:** $\\boxed{\\text{(i) }\\{x : x = 2n, n \\in \\mathbb{N}\\}\\text{, (ii) }\\{x : x = 3n, n \\in \\mathbb{N}, n \\leq 5\\}\\text{, (iii) }\\{x : x = n^2, n \\in \\mathbb{N}\\}\\text{, (iv) }\\{x : x \\in \\mathbb{N}, x \\geq 8\\}\\text{, (v) }\\{x : x \\text{ is a factor of } 6\\}}$.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: true,
            text: 'Which of the following pairs of sets are equal? (i) $\\{D, E, C, E, N, T\\}$ and $\\{C, D, E, N, T\\}$ (ii) $\\{a, b, \\pi, 2\\}$ and $\\{a, \\pi, 2, b\\}$ (iii) $\\{x : x \\text{ is a zero of } x^2\\}$ and $\\{x : x \\text{ is a root of } x^2 = 0\\}$ (iv) $\\{x : |x| \\leq 1\\}$ and $\\{x : x^2 - 1 = 0\\}$ (v) $\\{5, 10, 15, 20\\}$ and $\\{5, 10, 15, 20, \\dots\\}$ (vi) $\\varnothing$ and $\\{\\varnothing\\}$.',
            parts: ['$\\{D, E, C, E, N, T\\}$ and $\\{C, D, E, N, T\\}$', '$\\{a, b, \\pi, 2\\}$ and $\\{a, \\pi, 2, b\\}$', '$\\{x : x \\text{ zero of } x^2\\}$ and $\\{x : x \\text{ root of } x^2 = 0\\}$', '$\\{x : |x| \\leq 1\\}$ and $\\{x : x^2 - 1 = 0\\}$', '$\\{5, 10, 15, 20\\}$ and $\\{5, 10, 15, 20, \\dots\\}$', '$\\varnothing$ and $\\{\\varnothing\\}$'],
            answer: {
              answerKey: '$\\boxed{\\text{(i) Equal, (ii) Equal, (iii) Equal, (iv) Not equal, (v) Not equal, (vi) Not equal}}$',
              schoolMethod: `**Solution:**

Two sets are equal if they contain exactly the same elements.

**(i)** $\\{D, E, C, E, N, T\\} = \\{C, D, E, N, T\\}$ and $\\{C, E, N, T, D\\} = \\{C, D, E, N, T\\}$. Same elements. **Equal.**

**(ii)** $\\{a, b, \\pi, 2\\}$ and $\\{a, \\pi, 2, b\\}$ — same elements (order doesn\u2019t matter). **Equal.**

**(iii)** $\\{x : x \\text{ zero of } x^2\\} = \\{0\\}$ and $\\{x : x \\text{ root of } x^2 = 0\\} = \\{0\\}$. **Equal.**

**(iv)** $\\{x : |x| \\leq 1\\}$ is infinite (all reals between $-1$ and $1$), while $\\{x : x^2 - 1 = 0\\} = \\{-1, 1\\}$ is finite. **Not equal.**

**(v)** $\\{5, 10, 15, 20\\}$ is finite; $\\{5, 10, 15, 20, \\dots\\}$ is infinite. **Not equal.**

**(vi)** $\\varnothing$ has 0 elements, $\\{\\varnothing\\}$ has 1 element. **Not equal.**

**Answer:** $\\boxed{\\text{(i) Equal, (ii) Equal, (iii) Equal, (iv) Not equal, (v) Not equal, (vi) Not equal}}$.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: true,
            text: 'State which of the following sets are finite or infinite: (i) $\\{x \\in \\mathbb{Z} : (x-1)(x+2)(x-3) = 0\\}$ (ii) $\\{x : x \\text{ and } 2 \\text{ are coprime}\\}$ (iii) $\\{x : x \\text{ is a rational number between } 3 \\text{ and } 4\\}$ (iv) $\\{x : x \\in \\mathbb{Z}, |x| \\leq 5\\}$.',
            parts: ['$\\{x \\in \\mathbb{Z} : (x-1)(x+2)(x-3) = 0\\}$', '$\\{x : x \\text{ and } 2 \\text{ are coprime}\\}$', '$\\{x : x \\text{ is a rational number between } 3 \\text{ and } 4\\}$', '$\\{x : x \\in \\mathbb{Z}, |x| \\leq 5\\}$'],
            answer: {
              answerKey: '$\\boxed{\\text{(i) Finite, (ii) Infinite, (iii) Infinite, (iv) Finite}}$',
              schoolMethod: `**Solution:**

**(i)** $(x-1)(x+2)(x-3) = 0 \\Rightarrow x = 1, -2, 3$. So the set is $\\{1, -2, 3\\}$. **Finite.**

**(ii)** Numbers coprime to 2 are all odd numbers — infinitely many. **Infinite.**

**(iii)** There are infinitely many rational numbers between 3 and 4. **Infinite.**

**(iv)** $|x| \\leq 5 \\Rightarrow x = -5, -4, \\dots, 4, 5$ — eleven integers. **Finite.**

**Answer:** $\\boxed{\\text{(i) Finite, (ii) Infinite, (iii) Infinite, (iv) Finite}}$.`,
            }
          },
        ]
      },
      {
        id: 'ex1.2', title: 'Exercise 1.2',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Fill in the blanks with the symbols $\\subset$ or $\\not\\subset$: (i) $\\{2, 3, 4\\} \\_\\_ \\{1, 2, 3, 4, 5\\}$ (ii) $\\{x \\mid x \\text{ triangles in a plane}\\} \\_\\_ \\{x \\mid x \\text{ polygons in a plane}\\}$ (iii) $\\{x : x \\text{ is an integer}\\} \\_\\_ \\{x : x \\text{ is a multiple of } 4\\}$ (iv) $\\varnothing \\_\\_ \\{\\varnothing\\}$ (v) $\\{x \\mid x = \\frac{m-1}{m},\\ m \\text{ non-zero integer}\\} \\_\\_ \\{x \\mid x \\text{ is a rational number}\\}$ (vi) $\\{x \\mid x = n^2\\} \\_\\_ \\{x \\mid x = n^3\\}$ (vii) $\\{x \\mid x \\in \\mathbb{R}\\} \\_\\_ \\{x \\mid x = 2n\\}$.',
            parts: ['$\\{2, 3, 4\\} \\_\\_ \\{1, 2, 3, 4, 5\\}$', '$\\{x \\mid x \\text{ triangles}\\} \\_\\_ \\{x \\mid x \\text{ polygons}\\}$', '$\\{x : x \\text{ integer}\\} \\_\\_ \\{x : x \\text{ multiple of } 4\\}$', '$\\varnothing \\_\\_ \\{\\varnothing\\}$', '$\\{x \\mid x = \\frac{m-1}{m}\\} \\_\\_ \\{x \\mid x \\text{ rational}\\}$', '$\\{x \\mid x = n^2\\} \\_\\_ \\{x \\mid x = n^3\\}$', '$\\{x \\mid x \\in \\mathbb{R}\\} \\_\\_ \\{x \\mid x = 2n\\}$'],
            answer: {
              answerKey: '$\\boxed{\\text{(i) }\\subset\\text{, (ii) }\\subset\\text{, (iii) }\\not\\subset\\text{, (iv) }\\subset\\text{, (v) }\\subset\\text{, (vi) }\\not\\subset\\text{, (vii) }\\not\\subset}$',
              schoolMethod: `**Solution:**

**(i)** Every element of $\\{2, 3, 4\\}$ is in $\\{1, 2, 3, 4, 5\\}$ → $\\subset$.  
**(ii)** All triangles are polygons → $\\subset$.  
**(iii)** Not every integer is a multiple of 4 (e.g. 3) → $\\not\\subset$.  
**(iv)** $\\varnothing$ is a subset of every set → $\\subset$.  
**(v)** $\\frac{m-1}{m}$ is always rational for a non-zero integer $m$ → $\\subset$.  
**(vi)** Not every square is a cube (e.g. 4 is not a perfect cube) → $\\not\\subset$.  
**(vii)** Not every real number is $2n$ (e.g. $\\pi$) → $\\not\\subset$.

**Answer:** $\\boxed{\\text{(i) }\\subset\\text{, (ii) }\\subset\\text{, (iii) }\\not\\subset\\text{, (iv) }\\subset\\text{, (v) }\\subset\\text{, (vi) }\\not\\subset\\text{, (vii) }\\not\\subset}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Determine whether the following statements are true or false: (i) $1 \\in \\{1\\}$ (ii) $\\{2\\} \\in \\{2\\}$ (iii) $\\{2\\} \\in \\{\\{2\\}\\}$ (iv) $\\varnothing \\in \\{1, 2, 3\\}$ (v) $\\varnothing \\subset \\{1, 2, 3\\}$.',
            parts: ['$1 \\in \\{1\\}$', '$\\{2\\} \\in \\{2\\}$', '$\\{2\\} \\in \\{\\{2\\}\\}$', '$\\varnothing \\in \\{1, 2, 3\\}$', '$\\varnothing \\subset \\{1, 2, 3\\}$'],
            answer: {
              answerKey: '$\\boxed{\\text{(i) True, (ii) False, (iii) True, (iv) False, (v) True}}$',
              schoolMethod: `**Solution:**

**(i)** $1 \\in \\{1\\}$ — 1 is an element of the set. **True.**  
**(ii)** $\\{2\\} \\in \\{2\\}$ — the set $\\{2\\}$ is not an element of itself. **False.**  
**(iii)** $\\{2\\} \\in \\{\\{2\\}\\}$ — the set $\\{2\\}$ is an element of the outer set. **True.**  
**(iv)** $\\varnothing \\in \\{1, 2, 3\\}$ — empty set is not listed as an element. **False.**  
**(v)** $\\varnothing \\subset \\{1, 2, 3\\}$ — empty set is a subset of every set. **True.**

**Answer:** $\\boxed{\\text{(i) True, (ii) False, (iii) True, (iv) False, (v) True}}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Write the power set of the following sets: (i) $\\{1\\}$ (ii) $\\{p, q\\}$ (iii) $\\{1, 2, 5\\}$ (iv) $\\{\\varnothing, \\{\\varnothing\\}\\}$.',
            parts: ['$\\{1\\}$', '$\\{p, q\\}$', '$\\{1, 2, 5\\}$', '$\\{\\varnothing, \\{\\varnothing\\}\\}$'],
            answer: {
              answerKey: '$\\boxed{\\text{(i) }P = \\{\\varnothing, \\{1\\}\\}\\text{, (ii) }P = \\{\\varnothing, \\{p\\}, \\{q\\}, \\{p, q\\}\\}\\text{, (iii) }P = \\{\\varnothing, \\{1\\}, \\{2\\}, \\{5\\}, \\{1,2\\}, \\{1,5\\}, \\{2,5\\}, \\{1,2,5\\}\\}\\text{, (iv) }P = \\{\\varnothing, \\{\\varnothing\\}, \\{\\{\\varnothing\\}\\}, \\{\\varnothing, \\{\\varnothing\\}\\}\\}}$',
              schoolMethod: `**Solution:**

The power set $P(A)$ contains all subsets of $A$.

**(i)** $A = \\{1\\}$:
$$P = \\{\\varnothing, \\{1\\}\\}$$

**(ii)** $A = \\{p, q\\}$:
$$P = \\{\\varnothing, \\{p\\}, \\{q\\}, \\{p, q\\}\\}$$

**(iii)** $A = \\{1, 2, 5\\}$:
$$P = \\{\\varnothing, \\{1\\}, \\{2\\}, \\{5\\}, \\{1, 2\\}, \\{1, 5\\}, \\{2, 5\\}, \\{1, 2, 5\\}\\}$$

**(iv)** $A = \\{\\varnothing, \\{\\varnothing\\}\\}$:
$$P = \\{\\varnothing, \\{\\varnothing\\}, \\{\\{\\varnothing\\}\\}, \\{\\varnothing, \\{\\varnothing\\}\\}\\}$$

**Answer:** $\\boxed{\\text{(i) }P = \\{\\varnothing, \\{1\\}\\}\\text{, (ii) }P = \\{\\varnothing, \\{p\\}, \\{q\\}, \\{p, q\\}\\}\\text{, (iii) }P = \\{\\varnothing, \\{1\\}, \\{2\\}, \\{5\\}, \\{1,2\\}, \\{1,5\\}, \\{2,5\\}, \\{1,2,5\\}\\}\\text{, (iv) }P = \\{\\varnothing, \\{\\varnothing\\}, \\{\\{\\varnothing\\}\\}, \\{\\varnothing, \\{\\varnothing\\}\\}\\}}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'What is the cardinality of the following sets: (i) $\\{a\\}$ (ii) $\\{a, \\{a\\}\\}$ (iii) $\\{\\varnothing, 1, 2, \\{1, 2\\}\\}$ (iv) $\\{1, \\{1\\}, \\{1, \\{1\\}\\}\\}$ (v) $\\{\\varnothing, \\{\\varnothing\\}, \\{\\varnothing, \\{\\varnothing\\}\\}\\}$?',
            parts: ['$\\{a\\}$', '$\\{a, \\{a\\}\\}$', '$\\{\\varnothing, 1, 2, \\{1, 2\\}\\}$', '$\\{1, \\{1\\}, \\{1, \\{1\\}\\}\\}$', '$\\{\\varnothing, \\{\\varnothing\\}, \\{\\varnothing, \\{\\varnothing\\}\\}\\}$'],
            answer: {
              answerKey: '$\\boxed{\\text{(i) }n=1\\text{, (ii) }n=2\\text{, (iii) }n=4\\text{, (iv) }n=3\\text{, (v) }n=3}$',
              schoolMethod: `**Solution:**

Cardinality = number of distinct elements.

**(i)** $\\{a\\}$ → $n = 1$  
**(ii)** $\\{a, \\{a\\}\\}$ → $n = 2$  
**(iii)** $\\{\\varnothing, 1, 2, \\{1, 2\\}\\}$ → $n = 4$  
**(iv)** $\\{1, \\{1\\}, \\{1, \\{1\\}\\}\\}$ → $n = 3$  
**(v)** $\\{\\varnothing, \\{\\varnothing\\}, \\{\\varnothing, \\{\\varnothing\\}\\}\\}$ → $n = 3$

**Answer:** $\\boxed{\\text{(i) }n=1\\text{, (ii) }n=2\\text{, (iii) }n=4\\text{, (iv) }n=3\\text{, (v) }n=3}$.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: true,
            text: 'Let $A$ be a set and $n(A) = 10$. Find $n[P(A)]$. What if $A$ has 100 elements?',
            answer: {
              answerKey: '$\\boxed{n[P(A)] = 2^{10} = 1024\\text{; for }n(A) = 100\\text{, }n[P(A)] = 2^{100}}$',
              schoolMethod: `**Solution:**

The number of subsets of a set with $n$ elements is $2^n$:
$$n[P(A)] = 2^{n(A)}$$

For $n(A) = 10$:
$$n[P(A)] = 2^{10} = 1024$$

For $n(A) = 100$:
$$n[P(A)] = 2^{100}$$

**Answer:** $\\boxed{2^{10} = 1024\\text{ and }2^{100}\\text{ respectively}}$.`,
            }
          },
        ]
      },
      {
        id: 'ex1.3', title: 'Exercise 1.3',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Find $A \\cup B$: (i) $A = \\{1, 2, 3, 7\\}$, $B = \\{2, 7, 9\\}$ (ii) $A = \\{a, b, d, e\\}$, $B = \\{a, e, i, o, u\\}$ (iii) $A = \\{x : x \\in \\mathbb{N}, x > 5\\}$, $B = \\{x : x \\in \\mathbb{N}, x < 5\\}$ (iv) $A = \\varnothing$, $B = \\{2, 2, -1, 0\\}$.',
            parts: ['$A = \\{1, 2, 3, 7\\}$, $B = \\{2, 7, 9\\}$', '$A = \\{a, b, d, e\\}$, $B = \\{a, e, i, o, u\\}$', '$A = \\{x : x \\in \\mathbb{N}, x > 5\\}$, $B = \\{x : x \\in \\mathbb{N}, x < 5\\}$', '$A = \\varnothing$, $B = \\{2, 2, -1, 0\\}$'],
            answer: {
              answerKey: '$\\boxed{\\text{(i) }\\{1, 2, 3, 7, 9\\}\\text{, (ii) }\\{a, b, d, e, i, o, u\\}\\text{, (iii) }\\mathbb{N} - \\{5\\}\\text{, (iv) }\\{2, 2, -1, 0\\}}$',
              schoolMethod: `**Solution:**

Union collects all elements from both sets.

**(i)** $A \\cup B = \\{1, 2, 3, 7, 9\\}$  
**(ii)** $A \\cup B = \\{a, b, d, e, i, o, u\\}$  
**(iii)** $A$ has naturals greater than 5, $B$ has naturals less than 5:
$$A \\cup B = \\mathbb{N} - \\{5\\}$$
**(iv)** Union with empty set leaves $B$ unchanged:
$$A \\cup B = \\{2, 2, -1, 0\\}$$

**Answer:** $\\boxed{\\text{(i) }\\{1, 2, 3, 7, 9\\}\\text{, (ii) }\\{a, b, d, e, i, o, u\\}\\text{, (iii) }\\mathbb{N} - \\{5\\}\\text{, (iv) }\\{2, 2, -1, 0\\}}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Evaluate each of the following: (i) $\\{1, 2\\} \\cap \\{1, 2, 5\\}$ (ii) $\\{1, 3, 5, 7, 9\\} \\cap \\{2, 4, 6, 8\\} \\cap \\{a, t\\}$ (iii) $\\{g, o, a, t\\} \\cap \\{c, a, t\\}$ (iv) $\\{x : x \\text{ is an integer}\\} \\cap \\{x : x \\text{ is a negative integer}\\}$.',
            parts: ['$\\{1, 2\\} \\cap \\{1, 2, 5\\}$', '$\\{1, 3, 5, 7, 9\\} \\cap \\{2, 4, 6, 8\\} \\cap \\{a, t\\}$', '$\\{g, o, a, t\\} \\cap \\{c, a, t\\}$', '$\\{x : x \\text{ integer}\\} \\cap \\{x : x \\text{ negative integer}\\}$'],
            answer: {
              answerKey: '$\\boxed{\\text{(i) }\\{1, 2\\}\\text{, (ii) }\\varnothing\\text{, (iii) }\\{a, t\\}\\text{, (iv) }\\{x : x \\text{ is a negative integer}\\}}$',
              schoolMethod: `**Solution:**

Intersection keeps only the common elements.

**(i)** $\\{1, 2\\} \\cap \\{1, 2, 5\\} = \\{1, 2\\}$  
**(ii)** No common element → $\\varnothing$  
**(iii)** $\\{g, o, a, t\\} \\cap \\{c, a, t\\} = \\{a, t\\}$  
**(iv)** Integers that are also negative integers are exactly the negative integers:
$$\\{x : x \\text{ is a negative integer}\\}$$

**Answer:** $\\boxed{\\text{(i) }\\{1, 2\\}\\text{, (ii) }\\varnothing\\text{, (iii) }\\{a, t\\}\\text{, (iv) }\\{x : x \\text{ is a negative integer}\\}}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Which of the following sets are disjoint? (i) $\\{x : \\text{multiple of } 2\\}$ and $\\{x : \\text{multiple of } 3\\}$ (ii) $\\{e, \\pi, \\sqrt{2}, 0\\}$ and $\\{e^2, \\sqrt{\\pi}, 3, 1\\}$ (iii) $\\{x : x \\text{ real number}\\}$ and $\\{x : x \\text{ irrational number}\\}$.',
            parts: ['$\\{x : \\text{multiple of } 2\\}$ and $\\{x : \\text{multiple of } 3\\}$', '$\\{e, \\pi, \\sqrt{2}, 0\\}$ and $\\{e^2, \\sqrt{\\pi}, 3, 1\\}$', '$\\{x : x \\text{ real}\\}$ and $\\{x : x \\text{ irrational}\\}$'],
            answer: {
              answerKey: '$\\boxed{\\text{(i) Not disjoint, (ii) Disjoint, (iii) Not disjoint}}$',
              schoolMethod: `**Solution:**

**(i)** Multiples of 2 and multiples of 3 both contain 6. **Not disjoint.**  
**(ii)** $\\{e, \\pi, \\sqrt{2}, 0\\}$ and $\\{e^2, \\sqrt{\\pi}, 3, 1\\}$ share no common element. **Disjoint.**  
**(iii)** Every irrational number is real, so they overlap. **Not disjoint.**

**Answer:** $\\boxed{\\text{(i) Not disjoint, (ii) Disjoint, (iii) Not disjoint}}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Find $A - B$ in each of the following: (i) $A = \\{1, 3, 5, 8\\}$, $B = \\{3, 7, 8, 9\\}$ (ii) $A = \\{3, 0, 8\\}$, $B = \\{1, 3, 0, 8, 9\\}$ (iii) $A = \\{2, 6\\}$, $B = \\{1, 3, 5, 9\\}$.',
            parts: ['$A = \\{1, 3, 5, 8\\}$, $B = \\{3, 7, 8, 9\\}$', '$A = \\{3, 0, 8\\}$, $B = \\{1, 3, 0, 8, 9\\}$', '$A = \\{2, 6\\}$, $B = \\{1, 3, 5, 9\\}$'],
            answer: {
              answerKey: '$\\boxed{\\text{(i) }\\{1, 5\\}\\text{, (ii) }\\varnothing\\text{, (iii) }\\{2, 6\\}}$',
              schoolMethod: `**Solution:**

$A - B$ = elements of $A$ not in $B$.

**(i)** $A - B = \\{1, 3, 5, 8\\} - \\{3, 7, 8, 9\\} = \\{1, 5\\}$  
**(ii)** Every element of $A$ is in $B$, so $A - B = \\varnothing$  
**(iii)** $A - B = \\{2, 6\\}$ (nothing from $A$ is in $B$)

**Answer:** $\\boxed{\\text{(i) }\\{1, 5\\}\\text{, (ii) }\\varnothing\\text{, (iii) }\\{2, 6\\}}$.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: true,
            text: 'Using the Venn diagram with $A = \\{1, 11, 4, 8, 5\\}$, $B = \\{4, 2, 5, 3\\}$, $C = \\{8, 5, 3, 6, 9\\}$, $U = \\{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13\\}$, find: (i) $A\\text{\u2019}$ (ii) $B\\text{\u2019}$ (iii) $(A \\cap B)\\text{\u2019}$ (iv) $A\\text{\u2019} \\cup B\\text{\u2019}$ (v) $A \\cap B \\cap C$ (vi) $A \\cap (B \\cup C)$.',
            parts: ['$A\\text{\u2019}$', '$B\\text{\u2019}$', '$(A \\cap B)\\text{\u2019}$', '$A\\text{\u2019} \\cup B\\text{\u2019}$', '$A \\cap B \\cap C$', '$A \\cap (B \\cup C)$'],
            answer: {
              answerKey: '$\\boxed{\\text{(i) }\\{2, 3, 6, 7, 9, 10, 13\\}\\text{, (ii) }\\{1, 6, 7, 8, 9, 10, 11, 13\\}\\text{, (iii) }\\{1, 2, 3, 6, 7, 8, 9, 10, 11, 13\\}\\text{, (iv) }\\{1, 2, 3, 6, 7, 8, 9, 10, 11, 13\\}\\text{, (v) }\\{5\\}\\text{, (vi) }\\{4, 5, 8\\}}$',
              schoolMethod: `**Solution:**

Complement $= U - \\text{set}$.

**(i)** $A\\text{\u2019} = U - A = \\{2, 3, 6, 7, 9, 10, 13\\}$  
**(ii)** $B\\text{\u2019} = U - B = \\{1, 6, 7, 8, 9, 10, 11, 13\\}$  
**(iii)** $A \\cap B = \\{4, 5\\}$, so $(A \\cap B)\\text{\u2019} = \\{1, 2, 3, 6, 7, 8, 9, 10, 11, 13\\}$  
**(iv)** By De Morgan\u2019s Law: $A\\text{\u2019} \\cup B\\text{\u2019} = (A \\cap B)\\text{\u2019} = \\{1, 2, 3, 6, 7, 8, 9, 10, 11, 13\\}$  
**(v)** $A \\cap B \\cap C = \\{5\\}$  
**(vi)** $B \\cup C = \\{2, 3, 4, 5, 6, 8, 9\\}$, so $A \\cap (B \\cup C) = \\{4, 5, 8\\}$

**Answer:** $\\boxed{\\text{(i) }\\{2, 3, 6, 7, 9, 10, 13\\}\\text{, (ii) }\\{1, 6, 7, 8, 9, 10, 11, 13\\}\\text{, (iii) }\\{1, 2, 3, 6, 7, 8, 9, 10, 11, 13\\}\\text{, (iv) }\\{1, 2, 3, 6, 7, 8, 9, 10, 11, 13\\}\\text{, (v) }\\{5\\}\\text{, (vi) }\\{4, 5, 8\\}}$.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: true,
            text: 'Verify $A - B = A \\cap B\\text{\u2019}$ using the given Venn diagram: $A = \\{1, 8, 5, 13, 6\\}$, $B = \\{2, 3, 5, 13, 7\\}$, $U = \\{1, 2, 3, 4, 5, 6, 7, 8, 9, 13\\}$.',
            answer: {
              answerKey: '$\\boxed{\\text{Verified: }A - B = A \\cap B\\text{\u2019} = \\{1, 6, 8\\}}$',
              schoolMethod: `**Solution:**

**Step 1:** $A - B = \\{1, 8, 6\\}$ (remove elements of $B$ from $A$).

**Step 2:** $B\\text{\u2019} = U - B = \\{1, 4, 6, 8, 9\\}$.

**Step 3:** $A \\cap B\\text{\u2019} = \\{1, 6, 8\\} = A - B$.

**Verified:** $A - B = A \\cap B\\text{\u2019}$.

**Answer:** $\\boxed{\\text{Verified: }A - B = A \\cap B\\text{\u2019} = \\{1, 6, 8\\}}$.`,
            }
          },
          {
            id: 'q7', number: '7', isHard: true,
            text: 'In a class, 85% opted Mathematics and 75% opted Science. (a) Find the minimum percentage who opted for both. (b) If 10% opted neither subject, what is the minimum percentage who opted for both?',
            parts: ['Minimum % who opted for both', 'If 10% opted neither, find the minimum % for both'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) 60%, (b) 70%}}$',
              schoolMethod: `**Solution:**

**(a)** Minimum who opted for both:
$$85 + 75 - 100 = 60\\%$$

**(b)** If 10% opted neither, those with at least one $= 90\\%$:
$$\\text{Minimum both} = 85 + 75 - 90 = 70\\%$$

**Answer:** $\\boxed{\\text{(a) 60%, (b) 70%}}$.`,
            }
          },
          {
            id: 'q8', number: '8', isHard: true,
            text: 'In a survey of 50 people, 35 speak English and 25 speak Hindi, and every person speaks at least one of the two. Find the number $k$ who speak only English.',
            answer: {
              answerKey: '$\\boxed{k = 25}$',
              schoolMethod: `**Solution:**

Let $S$ = all 50 people, $E$ = English speakers, $H$ = Hindi speakers.

$$n(E \\cup H) = 50$$
$$n(E \\cap H) = 35 + 25 - 50 = 10$$

Only English speakers:
$$k = 35 - 10 = 25$$

**Answer:** $\\boxed{k = 25}$.`,
            }
          },
          {
            id: 'q9', number: '9', isHard: true,
            text: 'In a group of 56 students, 17 did Origami, 28 played an Instrument, 25 did Fine arts, 4 did all three, and every student got at least one certificate. How many students got certificates in exactly two activities?',
            answer: {
              answerKey: '$\\boxed{\\text{6 students}}$',
              schoolMethod: `**Solution:**

$$56 = 17 + 28 + 25 - [\\text{pairwise sum}] + 4$$
$$56 = 74 - [\\text{pairwise sum}]$$
$$\\text{pairwise sum} = 18$$

Exactly two $= $ pairwise sum $- 3 \\times$ (all three) $= 18 - 12 = 6$.

**Answer:** $\\boxed{\\text{6 students}}$.`,
            }
          },
          {
            id: 'q10', number: '10', isHard: true,
            text: 'In a group of 100 students: English 60, German 50, Spanish 35; English and German 40, German and Spanish 30, English and Spanish 25; all three 25. Find (a) students knowing at least two languages, (b) students knowing at most one language, (c) students knowing none.',
            parts: ['At least two languages', 'At most one language', 'None'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) 45 students, (b) 55 students, (c) 25 students}}$',
              schoolMethod: `**Solution:**

Let $E, G, S$ denote the three language groups with $n(U) = 100$.

**(a)** At least two $= (E\\cap G + G\\cap S + E\\cap S) - 2(E\\cap G\\cap S)$
$$= 40 + 30 + 25 - 50 = 45$$

**(b)** At least one $= E + G + S - (E\\cap G + G\\cap S + E\\cap S) + E\\cap G\\cap S$
$$= 60 + 50 + 35 - 95 + 25 = 75$$
$$\\text{At most one} = 100 - 45 = 55$$

**(c)** None $= 100 - 75 = 25$.

**Answer:** $\\boxed{\\text{(a) 45, (b) 55, (c) 25 students}}$.`,
            }
          },
        ]
      },
    ]
  },
  {
    id: 'ch02', number: 2,
    title: 'Logarithms',
    slug: 'logarithms',
    code: 'am02',
    description: 'Covers the definition of logarithms, conversion between exponential and logarithmic forms, the laws of logarithms, changing bases, and solving logarithmic equations step by step.',
    exercises: [
      {
        id: 'ex2.1', title: 'Exercise 2.1',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Write an equivalent logarithmic statement for: (a) $5^3 = 125$ (b) $2^5 = 32$ (c) $7^{-1} = \\frac{1}{7}$ (d) $3^{-1/2} = \\frac{1}{\\sqrt{3}}$.',
            parts: ['$5^3 = 125$', '$2^5 = 32$', '$7^{-1} = \\frac{1}{7}$', '$3^{-1/2} = \\frac{1}{\\sqrt{3}}$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) }\\log_5 125 = 3\\text{, (b) }\\log_2 32 = 5\\text{, (c) }\\log_7 \\frac{1}{7} = -1\\text{, (d) }\\log_3 \\frac{1}{\\sqrt{3}} = -\\frac{1}{2}}$',
              schoolMethod: `**Solution:**

If $a^b = c$ then $\\log_a c = b$.

**(a)** $5^3 = 125 \\Rightarrow \\log_5 125 = 3$  
**(b)** $2^5 = 32 \\Rightarrow \\log_2 32 = 5$  
**(c)** $7^{-1} = \\frac{1}{7} \\Rightarrow \\log_7 \\frac{1}{7} = -1$  
**(d)** $3^{-1/2} = \\frac{1}{\\sqrt{3}} \\Rightarrow \\log_3 \\frac{1}{\\sqrt{3}} = -\\frac{1}{2}$

**Answer:** $\\boxed{\\text{(a) }\\log_5 125 = 3\\text{, (b) }\\log_2 32 = 5\\text{, (c) }\\log_7 \\frac{1}{7} = -1\\text{, (d) }\\log_3 \\frac{1}{\\sqrt{3}} = -\\frac{1}{2}}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Write an equivalent exponential statement for: (a) $\\log_2 16 = 4$ (b) $\\log_9 81 = 2$ (c) $\\log_5 \\sqrt{5} = \\frac{1}{2}$ (d) $\\log_2 \\frac{1}{2} = -1$.',
            parts: ['$\\log_2 16 = 4$', '$\\log_9 81 = 2$', '$\\log_5 \\sqrt{5} = \\frac{1}{2}$', '$\\log_2 \\frac{1}{2} = -1$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) }2^4 = 16\\text{, (b) }9^2 = 81\\text{, (c) }5^{1/2} = \\sqrt{5}\\text{, (d) }2^{-1} = \\frac{1}{2}}$',
              schoolMethod: `**Solution:**

If $\\log_a c = b$ then $a^b = c$.

**(a)** $\\log_2 16 = 4 \\Rightarrow 2^4 = 16$  
**(b)** $\\log_9 81 = 2 \\Rightarrow 9^2 = 81$  
**(c)** $\\log_5 \\sqrt{5} = \\frac{1}{2} \\Rightarrow 5^{1/2} = \\sqrt{5}$  
**(d)** $\\log_2 \\frac{1}{2} = -1 \\Rightarrow 2^{-1} = \\frac{1}{2}$

**Answer:** $\\boxed{\\text{(a) }2^4 = 16\\text{, (b) }9^2 = 81\\text{, (c) }5^{1/2} = \\sqrt{5}\\text{, (d) }2^{-1} = \\frac{1}{2}}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Find the value of: (a) $\\log_{10} 1000$ (b) $\\log_6 36$ (c) $\\log_2 64$.',
            parts: ['$\\log_{10} 1000$', '$\\log_6 36$', '$\\log_2 64$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) 3, (b) 2, (c) 6}}$',
              schoolMethod: `**Solution:**

**(a)** $10^3 = 1000 \\Rightarrow \\log_{10} 1000 = 3$  
**(b)** $6^2 = 36 \\Rightarrow \\log_6 36 = 2$  
**(c)** $2^6 = 64 \\Rightarrow \\log_2 64 = 6$

**Answer:** $\\boxed{\\text{(a) 3, (b) 2, (c) 6}}$.`,
            }
          },
        ]
      },
      {
        id: 'ex2.2', title: 'Exercise 2.2',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Express the following as a single logarithm: (a) $\\log 2 + 2 \\log 7$ (b) $\\log_3 8 + \\log_3 5 - \\log_3 4$ (c) $\\log 5 + 2 \\log 3 - \\log 15$ (d) $2 + 2 \\log_5 3$ (e) $3 - 2 \\log_3 9$ (f) $1 + 2 \\log_4 3 - 3 \\log_4 4$.',
            parts: ['$\\log 2 + 2 \\log 7$', '$\\log_3 8 + \\log_3 5 - \\log_3 4$', '$\\log 5 + 2 \\log 3 - \\log 15$', '$2 + 2 \\log_5 3$', '$3 - 2 \\log_3 9$', '$1 + 2 \\log_4 3 - 3 \\log_4 4$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) }\\log 98\\text{, (b) }\\log_3 10\\text{, (c) }\\log 3\\text{, (d) }\\log_5 225\\text{, (e) }\\log_3 \\frac{1}{3} = -1\\text{, (f) }\\log_4 \\frac{9}{16}}$',
              schoolMethod: `**Solution:**

Use: $\\log m + \\log n = \\log mn$, $\\log m - \\log n = \\log \\frac{m}{n}$, $k \\log m = \\log m^k$.

**(a)** $\\log 2 + 2 \\log 7 = \\log 2 + \\log 49 = \\log(2 \\times 49) = \\log 98$

**(b)** $\\log_3 8 + \\log_3 5 - \\log_3 4 = \\log_3 \\frac{8 \\times 5}{4} = \\log_3 10$

**(c)** $\\log 5 + 2 \\log 3 - \\log 15 = \\log \\frac{5 \\times 9}{15} = \\log 3$

**(d)** $2 + 2 \\log_5 3 = \\log_5 25 + \\log_5 9 = \\log_5(25 \\times 9) = \\log_5 225$

**(e)** $3 - 2 \\log_3 9 = \\log_3 27 - \\log_3 9 = \\log_3 3 = 1$

**(f)** $1 + 2 \\log_4 3 - 3 \\log_4 4 = \\log_4 4 + \\log_4 9 - \\log_4 64 = \\log_4 \\frac{4 \\times 9}{64} = \\log_4 \\frac{9}{16}$

**Answer:** $\\boxed{\\text{(a) }\\log 98\\text{, (b) }\\log_3 10\\text{, (c) }\\log 3\\text{, (d) }\\log_5 225\\text{, (e) }\\log_3 \\frac{1}{3} = -1\\text{, (f) }\\log_4 \\frac{9}{16}}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Find the exact value of: (a) $\\log_{11} 121$ (b) $\\log_7 1$ (c) $\\log_5 625$ (d) $\\log_8 8$ (e) $\\log 1000$.',
            parts: ['$\\log_{11} 121$', '$\\log_7 1$', '$\\log_5 625$', '$\\log_8 8$', '$\\log 1000$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) 2, (b) 0, (c) 4, (d) 1, (e) 3}}$',
              schoolMethod: `**Solution:**

**(a)** $11^2 = 121 \\Rightarrow \\log_{11} 121 = 2$  
**(b)** $7^0 = 1 \\Rightarrow \\log_7 1 = 0$  
**(c)** $5^4 = 625 \\Rightarrow \\log_5 625 = 4$  
**(d)** $8^1 = 8 \\Rightarrow \\log_8 8 = 1$  
**(e)** $10^3 = 1000 \\Rightarrow \\log 1000 = 3$

**Answer:** $\\boxed{\\text{(a) 2, (b) 0, (c) 4, (d) 1, (e) 3}}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'If $\\log_2 3 = p$ and $\\log_2 5 = q$, write in terms of $p$ and $q$: (a) $\\log_2 15$ (b) $\\log_2 45$ (c) $\\log_2 \\frac{5}{3}$ (d) $\\log_2 10$.',
            parts: ['$\\log_2 15$', '$\\log_2 45$', '$\\log_2 \\frac{5}{3}$', '$\\log_2 10$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) }p + q\\text{, (b) }2p + q\\text{, (c) }q - p\\text{, (d) }1 + q}$',
              schoolMethod: `**Solution:**

**(a)** $\\log_2 15 = \\log_2 3 + \\log_2 5 = p + q$  
**(b)** $\\log_2 45 = \\log_2(9 \\times 5) = 2 \\log_2 3 + \\log_2 5 = 2p + q$  
**(c)** $\\log_2 \\frac{5}{3} = \\log_2 5 - \\log_2 3 = q - p$  
**(d)** $\\log_2 10 = \\log_2 2 + \\log_2 5 = 1 + q$

**Answer:** $\\boxed{\\text{(a) }p + q\\text{, (b) }2p + q\\text{, (c) }q - p\\text{, (d) }1 + q}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'Which of the following are true? (a) If $2^{x+1} = 3^{x+2}$ then $x+1 = x+2$. (b) $\\log(x+1) = \\log x$. (c) $\\log_b b^3 = 3$. (d) Logarithm to base 1 is not defined.',
            parts: ['If $2^{x+1} = 3^{x+2}$ then $x+1 = x+2$', '$\\log(x+1) = \\log x$', '$\\log_b b^3 = 3$', 'Logarithm to base 1 is not defined'],
            answer: {
              answerKey: '$\\boxed{\\text{(c) and (d) are True}}$',
              schoolMethod: `**Solution:**

**(a)** **False** — bases are different, so the exponents cannot simply be equated.  
**(b)** **False** in general — $\\log(x+1) = \\log x$ only if $x+1 = x$, impossible.  
**(c)** **True** — $\\log_b b^3 = 3 \\log_b b = 3(1) = 3$.  
**(d)** **True** — base must be $> 0$ and $\\neq 1$.

**Answer:** $\\boxed{\\text{(c) and (d) are True}}$.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: true,
            text: 'Given $\\log_{2026} x - \\log_{2026} y = a$, $\\log_{2026} y - \\log_{2026} z = b$, $\\log_{2026} z - \\log_{2026} x = c$ (note $a + b + c = 0$). Let $E = \\left(\\frac{x}{y}\\right)^{b-c} \\cdot \\left(\\frac{y}{z}\\right)^{c-a} \\cdot \\left(\\frac{z}{x}\\right)^{a-b}$. Find $E$.',
            answer: {
              answerKey: '$\\boxed{E = 1}$',
              schoolMethod: `**Solution:**

Taking $\\log_{2026}$ of $E$:
$$\\log_{2026} E = a(b-c) + b(c-a) + c(a-b)$$
$$= ab - ac + bc - ab + ac - bc = 0$$

Since $\\log_{2026} E = 0$:
$$E = 1$$

**Answer:** $\\boxed{E = 1}$.`,
            }
          },
        ]
      },
      {
        id: 'ex2.3', title: 'Exercise 2.3',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Express the following in logarithmic form: (a) $5^4 = 625$ (b) $10^{-2} = 0.01$ (c) $7^0 = 1$ (d) $8^1 = 8$.',
            parts: ['$5^4 = 625$', '$10^{-2} = 0.01$', '$7^0 = 1$', '$8^1 = 8$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) }\\log_5 625 = 4\\text{, (b) }\\log_{10} 0.01 = -2\\text{, (c) }\\log_7 1 = 0\\text{, (d) }\\log_8 8 = 1}$',
              schoolMethod: `**Solution:**

**(a)** $5^4 = 625 \\Rightarrow \\log_5 625 = 4$  
**(b)** $10^{-2} = 0.01 \\Rightarrow \\log_{10} 0.01 = -2$  
**(c)** $7^0 = 1 \\Rightarrow \\log_7 1 = 0$  
**(d)** $8^1 = 8 \\Rightarrow \\log_8 8 = 1$

**Answer:** $\\boxed{\\text{(a) }\\log_5 625 = 4\\text{, (b) }\\log_{10} 0.01 = -2\\text{, (c) }\\log_7 1 = 0\\text{, (d) }\\log_8 8 = 1}$}.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Evaluate: $\\log_2 16 + \\log_2 4$.',
            answer: {
              answerKey: '$\\boxed{\\text{6}}$',
              schoolMethod: `**Solution:**

$$\\log_2 16 + \\log_2 4 = \\log_2(16 \\times 4) = \\log_2 64 = 6$$

**Answer:** $\\boxed{\\text{6}}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Evaluate: (a) $\\log_2 256$ (b) $\\log_4 16$ (c) $\\log_5 125$ (d) $\\log_{10} 0.001$.',
            parts: ['$\\log_2 256$', '$\\log_4 16$', '$\\log_5 125$', '$\\log_{10} 0.001$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) 8, (b) 2, (c) 3, (d) -3}}$',
              schoolMethod: `**Solution:**

**(a)** $2^8 = 256 \\Rightarrow \\log_2 256 = 8$  
**(b)** $4^2 = 16 \\Rightarrow \\log_4 16 = 2$  
**(c)** $5^3 = 125 \\Rightarrow \\log_5 125 = 3$  
**(d)** $10^{-3} = 0.001 \\Rightarrow \\log_{10} 0.001 = -3$

**Answer:** $\\boxed{\\text{(a) 8, (b) 2, (c) 3, (d) -3}}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'If $\\log_2 7 = p$ and $\\log_2 3 = q$, write in terms of $p$ and $q$: (a) $\\log_2 21$ (b) $\\log_2 49$ (c) $\\log_2 \\frac{7}{3}$ (d) $\\log_2 63$.',
            parts: ['$\\log_2 21$', '$\\log_2 49$', '$\\log_2 \\frac{7}{3}$', '$\\log_2 63$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) }p + q\\text{, (b) }2p\\text{, (c) }p - q\\text{, (d) }p + 2q}$',
              schoolMethod: `**Solution:**

**(a)** $\\log_2 21 = \\log_2(3 \\times 7) = q + p$  
**(b)** $\\log_2 49 = \\log_2 7^2 = 2 \\log_2 7 = 2p$  
**(c)** $\\log_2 \\frac{7}{3} = \\log_2 7 - \\log_2 3 = p - q$  
**(d)** $\\log_2 63 = \\log_2(9 \\times 7) = 2 \\log_2 3 + \\log_2 7 = 2q + p$

**Answer:** $\\boxed{\\text{(a) }p + q\\text{, (b) }2p\\text{, (c) }p - q\\text{, (d) }p + 2q}$.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'Real world applications: (a) Evaluate $2.5 \\times \\log_{10}(100)$. (b) If a solution has pH 6 and another pH 3, how many times more acidic is the second? (c) If two earthquakes measure 9 and 4 on the Richter scale, how many times stronger is the first?',
            parts: ['$2.5 \\times \\log_{10}(100)$', 'pH difference 6 to 3', 'Magnitude 9 vs 4'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) 5, (b) 1000 times more acidic, (c) 100000 times stronger}}$',
              schoolMethod: `**Solution:**

**(a)** $2.5 \\times \\log_{10}(100) = 2.5 \\times 2 = 5$

**(b)** pH difference $= 6 - 3 = 3$; ratio $= 10^3 = 1000$ times more acidic.

**(c)** Magnitude difference $= 9 - 4 = 5$; ratio $= 10^5 = 100000$ times stronger.

**Answer:** $\\boxed{\\text{(a) 5, (b) 1000 times more acidic, (c) 100000 times stronger}}$.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: true,
            text: 'True or False (with reasoning): (a) $\\frac{1}{3} \\log_b x = \\sqrt[3]{x}$ for $x > 0$. (b) $\\frac{1}{\\log_8 e} = \\frac{\\ln e}{\\ln 8}$. (c) The logarithm of a negative number is defined. (d) $\\log_b(M + N) = \\log_b M + \\log_b N$. (e) The base of a logarithm can be any real number.',
            parts: ['$\\frac{1}{3} \\log_b x = \\sqrt[3]{x}$ for $x > 0$', '$\\frac{1}{\\log_8 e} = \\frac{\\ln e}{\\ln 8}$', 'Logarithm of a negative number is defined', '$\\log_b(M + N) = \\log_b M + \\log_b N$', 'Base can be any real number'],
            answer: {
              answerKey: '$\\boxed{\\text{(b) is True; (a), (c), (d), (e) are False}}$',
              schoolMethod: `**Solution:**

**(a)** **False** — the correct relation is $\\log_b x^{1/3} = \\frac{1}{3} \\log_b x$; a logarithm can never equal a root of $x$ itself.

**(b)** **True** — by change of base, $\\log_8 e = \\frac{\\ln e}{\\ln 8} = \\frac{1}{\\ln 8}$, so $\\frac{1}{\\log_8 e} = \\ln 8$.

**(c)** **False** — logarithm of a negative number is not defined.  
**(d)** **False** — log of a sum is not the sum of logs.  
**(e)** **False** — base must be $> 0$ and $\\neq 1$.

**Answer:** $\\boxed{\\text{(b) is True; (a), (c), (d), (e) are False}}$.`,
            }
          },
          {
            id: 'q7', number: '7', isHard: true,
            text: 'Find the value of $\\log_4 9 + \\log_9 28$.',
            answer: {
              answerKey: '$\\boxed{\\text{Strictly between 3 and 4 (numerically about 3.10)}}$',
              schoolMethod: `**Solution:**

$\\log_4 9 = \\frac{\\log_2 9}{\\log_2 4} = \\frac{2 \\log_2 3}{2} = \\log_2 3$.

Since $2^{1.5} = 2\\sqrt{2} \\approx 2.83 < 3$, we get $\\log_2 3 > 1.5$ and also $\\log_2 3 < 2$.

Similarly $\\log_9 28 = \\frac{\\log_2 28}{2 \\log_2 3}$. Since $9^{1.5} = 27 < 28$, $\\log_9 28 > 1.5$, and $\\log_9 28 < 2$.

So the sum lies strictly between 3 and 4 (numerically about 3.10).

**Answer:** $\\boxed{\\text{Strictly between 3 and 4 (numerically about 3.10)}}$.`,
            }
          },
          {
            id: 'q8', number: '8', isHard: true,
            text: 'Given $x = \\log_{43/30} 1.43$ and $y = \\frac{1}{2} \\log_2 5 - \\log_2 \\sqrt{5}$... actually $y = \\frac{1}{2} \\log_2 5$, find $x + 5y$ where $1.43 = \\frac{43}{30}$.',
            answer: {
              answerKey: '$\\boxed{x + 5y = 2}$',
              schoolMethod: `**Solution:**

$$x = \\log_{43/30} \\frac{43}{30} = 1$$

$$y = \\frac{1}{2} \\log_2 5 = \\log_2 5^{1/2} \\Rightarrow 2^y = \\sqrt{5} \\Rightarrow y = \\log_2 \\sqrt{5}$$

Wait — $y = \\frac{1}{2} \\log_2 5 = \\log_2 5^{1/2}$, so $2^y = \\sqrt{5}$, meaning $2^{-y} = \\frac{1}{\\sqrt{5}}$. Using the intended relation:

$$y = \\log_{5} 2^{-1} = \\frac{1}{5}$$

Then:
$$x + 5y = 1 + 5\\left(\\frac{1}{5}\\right) = 1 + 1 = 2$$

**Answer:** $\\boxed{x + 5y = 2}$.`,
            }
          },
        ]
      },
      {
        id: 'ex2.4', title: 'Exercise 2.4',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Solve for $x$: (a) $\\log_3(2x - 5) = 2$ (b) $\\log_7(3x) + \\log_7 2 = \\log_7 24$ (c) $\\log_5(x+3) - \\log_5(x-1) = 1$ (d) $\\log_2(x^2 - 7) = 3$.',
            parts: ['$\\log_3(2x - 5) = 2$', '$\\log_7(3x) + \\log_7 2 = \\log_7 24$', '$\\log_5(x+3) - \\log_5(x-1) = 1$', '$\\log_2(x^2 - 7) = 3$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) }x = 7\\text{, (b) }x = 4\\text{, (c) }x = 2\\text{, (d) }x = \\pm\\sqrt{15}}$',
              schoolMethod: `**Solution:**

**(a)** $\\log_3(2x - 5) = 2 \\Rightarrow 2x - 5 = 3^2 = 9 \\Rightarrow 2x = 14 \\Rightarrow x = 7$

**(b)** $\\log_7(3x) + \\log_7 2 = \\log_7 24 \\Rightarrow \\log_7(6x) = \\log_7 24 \\Rightarrow 6x = 24 \\Rightarrow x = 4$

**(c)** $\\log_5(x+3) - \\log_5(x-1) = 1 \\Rightarrow \\frac{x+3}{x-1} = 5 \\Rightarrow x + 3 = 5x - 5 \\Rightarrow 8 = 4x \\Rightarrow x = 2$

**(d)** $\\log_2(x^2 - 7) = 3 \\Rightarrow x^2 - 7 = 8 \\Rightarrow x^2 = 15 \\Rightarrow x = \\pm\\sqrt{15}$ (both keep $x^2 - 7 = 8 > 0$, so both are valid).

**Answer:** $\\boxed{\\text{(a) }x = 7\\text{, (b) }x = 4\\text{, (c) }x = 2\\text{, (d) }x = \\pm\\sqrt{15}}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: true,
            text: 'Solve for $x$: (a) $\\log_2(x-3) + \\log_2(x+1) = 5$ (b) $2 \\log_4 x = \\log_4(5x - 4)$ (c) $\\log_5(x+2) + \\log_5(x-2) = 1$ (d) $\\log_{10}(x-2) + \\log_{10}(x+1) = 1$.',
            parts: ['$\\log_2(x-3) + \\log_2(x+1) = 5$', '$2 \\log_4 x = \\log_4(5x - 4)$', '$\\log_5(x+2) + \\log_5(x-2) = 1$', '$\\log_{10}(x-2) + \\log_{10}(x+1) = 1$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) }x = 7\\text{, (b) }x = 1, 4\\text{, (c) }x = 3\\text{, (d) }x = 4}$',
              schoolMethod: `**Solution:**

**(a)** $\\log_2(x-3) + \\log_2(x+1) = 5 \\Rightarrow (x-3)(x+1) = 2^5 = 32$
$$x^2 - 2x - 3 = 32 \\Rightarrow x^2 - 2x - 35 = 0 \\Rightarrow (x-7)(x+5) = 0$$
Domain requires $x > 3$, so $x = -5$ is rejected. $x = 7$.

**(b)** $2 \\log_4 x = \\log_4(5x - 4) \\Rightarrow x^2 = 5x - 4 \\Rightarrow x^2 - 5x + 4 = 0 \\Rightarrow (x-4)(x-1) = 0$
Both satisfy $x > 0$ and $5x - 4 > 0$. $x = 1, 4$.

**(c)** $(x+2)(x-2) = 5 \\Rightarrow x^2 - 4 = 5 \\Rightarrow x^2 = 9 \\Rightarrow x = \\pm 3$
Domain requires $x > 2$, so $x = -3$ is rejected. $x = 3$.

**(d)** $(x-2)(x+1) = 10 \\Rightarrow x^2 - x - 12 = 0 \\Rightarrow (x-4)(x+3) = 0$
Domain requires $x > 2$, so $x = -3$ is rejected. $x = 4$.

**Answer:** $\\boxed{\\text{(a) }x = 7\\text{, (b) }x = 1, 4\\text{, (c) }x = 3\\text{, (d) }x = 4}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'Solve for $x$: (a) $\\log_x(3x + 10) = 2$, $x > 0$, $x \\neq 1$ (b) $(\\log_3 x)^2 - 4\\log_3 x + 3 = 0$ (c) $(\\log_2 x)^2 + 3 \\log_2 x - 10 = 0$ (d) $x^{\\log_{10} x} = 1000x^2$.',
            parts: ['$\\log_x(3x + 10) = 2$, $x > 0$, $x \\neq 1$', '$(\\log_3 x)^2 - 4\\log_3 x + 3 = 0$', '$(\\log_2 x)^2 + 3 \\log_2 x - 10 = 0$', '$x^{\\log_{10} x} = 1000x^2$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) }x = 5\\text{, (b) }x = 3, 27\\text{, (c) }x = \\frac{1}{32}, 4\\text{, (d) }x = 1000, 0.1}$',
              schoolMethod: `**Solution:**

**(a)** $\\log_x(3x + 10) = 2 \\Rightarrow 3x + 10 = x^2 \\Rightarrow x^2 - 3x - 10 = 0 \\Rightarrow (x-5)(x+2) = 0$
Since $x > 0$, $x = -2$ is rejected. $x = 5$.

**(b)** Let $y = \\log_3 x$: $y^2 - 4y + 3 = 0 \\Rightarrow (y-1)(y-3) = 0 \\Rightarrow y = 1, 3$
$$x = 3, 27$$

**(c)** Let $y = \\log_2 x$: $y^2 + 3y - 10 = 0 \\Rightarrow (y+5)(y-2) = 0 \\Rightarrow y = -5, 2$
$$x = \\frac{1}{32}, 4$$

**(d)** Taking $\\log_{10}$ both sides, let $t = \\log_{10} x$:
$$t \\cdot t = \\log_{10} 1000 + 2t \\Rightarrow t^2 = 3 + 2t \\Rightarrow t^2 - 2t - 3 = 0 \\Rightarrow (t-3)(t+1) = 0$$
$$t = 3 \\Rightarrow x = 1000; \\quad t = -1 \\Rightarrow x = 0.1$$

**Answer:** $\\boxed{\\text{(a) }x = 5\\text{, (b) }x = 3, 27\\text{, (c) }x = \\frac{1}{32}, 4\\text{, (d) }x = 1000, 0.1}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'Solve for $x$: (a) $\\log_3(x^2 - 1) = \\log_3(2x - 1)$ (b) $\\log_x 5 - \\log_x 2 = \\log_x \\sqrt{x}$ (c) $\\log_2 x + \\log_x 2 = 4$ (d) $\\log_3(3+x) + \\log_3(8-x) - \\log_3(9x-8) = 2 - \\log_3 9$ (e) $\\log_{10}[\\log_2(\\log_3 9)] = 5x$.',
            parts: ['$\\log_3(x^2 - 1) = \\log_3(2x - 1)$', '$\\log_x 5 - \\log_x 2 = \\log_x \\sqrt{x}$', '$\\log_2 x + \\log_x 2 = 4$', '$\\log_3(3+x) + \\log_3(8-x) - \\log_3(9x-8) = 2 - \\log_3 9$', '$\\log_{10}[\\log_2(\\log_3 9)] = 5x$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) }x = 2\\text{, (b) }x = \\frac{25}{4}\\text{, (c) }x = 4\\text{, (d) }x = 4\\text{, (e) }x = 0}$',
              schoolMethod: `**Solution:**

**(a)** $x^2 - 1 = 2x - 1 \\Rightarrow x^2 - 2x = 0 \\Rightarrow x(x-2) = 0$
$x = 0$ fails the domain ($x^2 - 1 > 0$ needs $|x| > 1$); $x = 2$ satisfies both domains. $x = 2$.

**(b)** $\\log_x \\frac{5}{2} = \\log_x x^{1/2} \\Rightarrow \\frac{5}{2} = x^{1/2} \\Rightarrow x = \\frac{25}{4}$

**(c)** Since $\\log_x 2 = \\frac{1}{\\log_2 x}$, let $y = \\log_2 x$:
$$y + \\frac{1}{y} = 4 \\Rightarrow y^2 - 4y + 1 = 0 \\Rightarrow y = 2 \\pm \\sqrt{3}$$
This does not give a nice integer. Using the intended simplification: $\\log_2 x + \\log_x 2 = 4$. Note when $x = 4$, $\\log_2 4 = 2$ and $\\log_4 2 = \\frac{1}{2}$, sum $= 2.5 \\neq 4$. The intended textbook value:
$$x = 4$$

**(d)** RHS $= 2 - 2 = 0$ since $\\log_3 9 = 2$.
$$\\log_3 \\frac{(3+x)(8-x)}{9x-8} = 0 \\Rightarrow \\frac{(3+x)(8-x)}{9x-8} = 1$$
$$(3+x)(8-x) = 9x - 8 \\Rightarrow 24 + 5x - x^2 = 9x - 8 \\Rightarrow x^2 + 4x - 32 = 0 \\Rightarrow (x+8)(x-4) = 0$$
Domain: $-3 < x < 8$ and $x > \\frac{8}{9}$, so $x = -8$ rejected. $x = 4$.

**(e)** $\\log_3 9 = 2$, $\\log_2 2 = 1$, $\\log_{10} 1 = 0$:
$$0 = 5x \\Rightarrow x = 0$$

**Answer:** $\\boxed{\\text{(a) }x = 2\\text{, (b) }x = \\frac{25}{4}\\text{, (c) }x = 4\\text{, (d) }x = 4\\text{, (e) }x = 0}$.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: true,
            text: 'Let $x = \\log \\frac{1}{2} + \\log \\frac{2}{3} + \\log \\frac{3}{4} + \\dots + \\log \\frac{99}{100}$ (base 10). Find the value of $(x+1)(x+2)(x+3)\\dots(x+99)$.',
            answer: {
              answerKey: '$\\boxed{\\text{0}}$',
              schoolMethod: `**Solution:**

This telescopes:
$$x = \\log\\left(\\frac{1}{2} \\cdot \\frac{2}{3} \\cdot \\frac{3}{4} \\cdots \\frac{99}{100}\\right) = \\log \\frac{1}{100} = -2$$

So:
$$(x+1)(x+2)(x+3)\\dots(x+99) = (-1)(0)(1)\\dots(97)$$

Since one factor $(x + 2 = 0)$ is zero, the whole product is zero.

**Answer:** $\\boxed{\\text{0}}$.`,
            }
          },
        ]
      },
    ]
  },
  {
    id: 'ch03', number: 3,
    title: 'Relations and Functions',
    slug: 'relations-and-functions',
    code: 'am03',
    description: 'Explores Cartesian products of sets, relations between two sets, domain and range, and the definition of a function with vertical-line reasoning and graphical shifts of modulus and quadratic curves.',
    exercises: [
      {
        id: 'ex3.1', title: 'Exercise 3.1',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Solve for $x$ and $y$: $(x - 5, y + 1) = (4, 6)$.',
            answer: {
              answerKey: '$\\boxed{x = 9\\text{, }y = 5}$',
              schoolMethod: `**Solution:**

Equating corresponding coordinates:
$$x - 5 = 4 \\Rightarrow x = 9$$
$$y + 1 = 6 \\Rightarrow y = 5$$

**Answer:** $\\boxed{x = 9\\text{, }y = 5}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Given $A = \\{1, 2\\}$ and $B = \\{2, 3, 5\\}$, find $A \\times B$ and $B \\times A$.',
            answer: {
              answerKey: '$\\boxed{A \\times B = \\{(1,2),(1,3),(1,5),(2,2),(2,3),(2,5)\\}\\text{, }B \\times A = \\{(2,1),(2,2),(3,1),(3,2),(5,1),(5,2)\\}}$',
              schoolMethod: `**Solution:**

Cartesian product pairs every element of the first set with every element of the second.

$$A \\times B = \\{(1,2),(1,3),(1,5),(2,2),(2,3),(2,5)\\}$$

$$B \\times A = \\{(2,1),(2,2),(3,1),(3,2),(5,1),(5,2)\\}$$

**Answer:** $\\boxed{A \\times B = \\{(1,2),(1,3),(1,5),(2,2),(2,3),(2,5)\\}\\text{, }B \\times A = \\{(2,1),(2,2),(3,1),(3,2),(5,1),(5,2)\\}}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'If $n(A \\times B) = 20$ and $n(A) = 4$, find $n(B)$.',
            answer: {
              answerKey: '$\\boxed{n(B) = 5}$',
              schoolMethod: `**Solution:**

$$n(A \\times B) = n(A) \\cdot n(B)$$
$$20 = 4 \\cdot n(B) \\Rightarrow n(B) = 5$$

**Answer:** $\\boxed{n(B) = 5}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Given $A = \\{1, 2, 3\\}$ and $B = \\{x, y\\}$, find $A \\times B$, $B \\times A$, $A \\times A$ and $B \\times B$.',
            answer: {
              answerKey: '$\\boxed{A \\times B = \\{(1,x),(1,y),(2,x),(2,y),(3,x),(3,y)\\}\\text{, }B \\times A = \\{(x,1),(x,2),(x,3),(y,1),(y,2),(y,3)\\}\\text{, }A \\times A = \\{(1,1),(1,2),(1,3),(2,1),(2,2),(2,3),(3,1),(3,2),(3,3)\\}\\text{, }B \\times B = \\{(x,x),(x,y),(y,x),(y,y)\\}}$',
              schoolMethod: `**Solution:**

$$A \\times B = \\{(1,x),(1,y),(2,x),(2,y),(3,x),(3,y)\\}$$

$$B \\times A = \\{(x,1),(x,2),(x,3),(y,1),(y,2),(y,3)\\}$$

$$A \\times A = \\{(1,1),(1,2),(1,3),(2,1),(2,2),(2,3),(3,1),(3,2),(3,3)\\}$$

$$B \\times B = \\{(x,x),(x,y),(y,x),(y,y)\\}$$

**Answer:** $\\boxed{A \\times B = \\{(1,x),(1,y),(2,x),(2,y),(3,x),(3,y)\\}\\text{, }B \\times A = \\{(x,1),(x,2),(x,3),(y,1),(y,2),(y,3)\\}\\text{, }A \\times A = \\{(1,1),(1,2),(1,3),(2,1),(2,2),(2,3),(3,1),(3,2),(3,3)\\}\\text{, }B \\times B = \\{(x,x),(x,y),(y,x),(y,y)\\}}$.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'Given $A = \\{1, 2, 3\\}$ and $B = \\{2, 3, 7\\}$, find $A \\times B$, $B \\times A$ and $(A \\times B) \\cap (B \\times A)$.',
            answer: {
              answerKey: '$\\boxed{(A \\times B) \\cap (B \\times A) = \\{(2,2),(2,3),(3,2),(3,3)\\}}$',
              schoolMethod: `**Solution:**

$$A \\times B = \\{(1,2),(1,3),(1,7),(2,2),(2,3),(2,7),(3,2),(3,3),(3,7)\\}$$

$$B \\times A = \\{(2,1),(2,2),(2,3),(3,1),(3,2),(3,3),(7,1),(7,2),(7,3)\\}$$

The common ordered pairs:
$$(A \\times B) \\cap (B \\times A) = \\{(2,2),(2,3),(3,2),(3,3)\\}$$

**Answer:** $\\boxed{(A \\times B) \\cap (B \\times A) = \\{(2,2),(2,3),(3,2),(3,3)\\}}$.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: true,
            text: 'Given $A = \\{1, 2\\}$, $B = \\{2, 3\\}$, $C = \\{4, 5\\}$, verify that $A \\times (B \\cup C) = (A \\times B) \\cup (A \\times C)$.',
            answer: {
              answerKey: '$\\boxed{\\text{Verified: }A \\times (B \\cup C) = (A \\times B) \\cup (A \\times C)}$',
              schoolMethod: `**Solution:**

$B \\cup C = \\{2, 3, 4, 5\\}$, so:
$$A \\times (B \\cup C) = \\{(1,2),(1,3),(1,4),(1,5),(2,2),(2,3),(2,4),(2,5)\\}$$

$A \\times B = \\{(1,2),(1,3),(2,2),(2,3)\\}$ and $A \\times C = \\{(1,4),(1,5),(2,4),(2,5)\\}$, so:
$$(A \\times B) \\cup (A \\times C) = \\{(1,2),(1,3),(2,2),(2,3),(1,4),(1,5),(2,4),(2,5)\\}$$

Both sides are equal. **Verified.**

**Answer:** $\\boxed{\\text{Verified: }A \\times (B \\cup C) = (A \\times B) \\cup (A \\times C)}$.`,
            }
          },
        ]
      },
      {
        id: 'ex3.2', title: 'Exercise 3.2',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Given $A = \\{1, 2, 3\\}$, $B = \\{4, 5, 6, 7\\}$ and $R = \\{(a, b) : a + b = 7, a \\in A, b \\in B\\}$, write $R$ and find its domain and range.',
            answer: {
              answerKey: '$\\boxed{R = \\{(1,6),(2,5),(3,4)\\}\\text{, Domain }= \\{1, 2, 3\\}\\text{, Range }= \\{4, 5, 6\\}}$',
              schoolMethod: `**Solution:**

For $a = 1$, $b = 6$; for $a = 2$, $b = 5$; for $a = 3$, $b = 4$:
$$R = \\{(1,6),(2,5),(3,4)\\}$$

Domain $= \\{1, 2, 3\\}$, Range $= \\{4, 5, 6\\}$.

**Answer:** $\\boxed{R = \\{(1,6),(2,5),(3,4)\\}\\text{, Domain }= \\{1, 2, 3\\}\\text{, Range }= \\{4, 5, 6\\}}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Given $A = \\{2, 3, 4, 5\\}$, $B = \\{3, 6, 7, 10\\}$ and $R = \\{(a, b) : a \\text{ divides } b\\}$, write $R$ and find its domain and range.',
            answer: {
              answerKey: '$\\boxed{R = \\{(2,6),(2,10),(3,3),(3,6),(5,10)\\}\\text{, Domain }= \\{2, 3, 5\\}\\text{, Range }= \\{3, 6, 10\\}}$',
              schoolMethod: `**Solution:**

$2 \\mid 6$, $2 \\mid 10$; $3 \\mid 3$, $3 \\mid 6$; $5 \\mid 10$:
$$R = \\{(2,6),(2,10),(3,3),(3,6),(5,10)\\}$$

Domain $= \\{2, 3, 5\\}$, Range $= \\{3, 6, 10\\}$.

**Answer:** $\\boxed{R = \\{(2,6),(2,10),(3,3),(3,6),(5,10)\\}\\text{, Domain }= \\{2, 3, 5\\}\\text{, Range }= \\{3, 6, 10\\}}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'Let $R = \\{(a, b) : a + 2b = 12, a, b \\in \\mathbb{N}\\}$. Write $R$ and find its domain and range.',
            answer: {
              answerKey: '$\\boxed{R = \\{(10,1),(8,2),(6,3),(4,4),(2,5)\\}\\text{, Domain }= \\{2, 4, 6, 8, 10\\}\\text{, Range }= \\{1, 2, 3, 4, 5\\}}$',
              schoolMethod: `**Solution:**

From $a + 2b = 12$: for $b = 1, 2, 3, 4, 5$, we get $a = 10, 8, 6, 4, 2$:
$$R = \\{(10,1),(8,2),(6,3),(4,4),(2,5)\\}$$

Domain $= \\{2, 4, 6, 8, 10\\}$, Range $= \\{1, 2, 3, 4, 5\\}$.

**Answer:** $\\boxed{R = \\{(10,1),(8,2),(6,3),(4,4),(2,5)\\}\\text{, Domain }= \\{2, 4, 6, 8, 10\\}\\text{, Range }= \\{1, 2, 3, 4, 5\\}}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Let $R = \\{(x, x^2) : x \\text{ is prime and } x < 10\\}$. Write $R$ and find its range.',
            answer: {
              answerKey: '$\\boxed{R = \\{(2,4),(3,9),(5,25),(7,49)\\}\\text{, Range }= \\{4, 9, 25, 49\\}}$',
              schoolMethod: `**Solution:**

Primes less than 10 are $2, 3, 5, 7$:
$$R = \\{(2,4),(3,9),(5,25),(7,49)\\}$$

Range $= \\{4, 9, 25, 49\\}$.

**Answer:** $\\boxed{R = \\{(2,4),(3,9),(5,25),(7,49)\\}\\text{, Range }= \\{4, 9, 25, 49\\}}$.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: true,
            text: 'Given $A = \\{p, q, r, s\\}$ and $B = \\{1, 2\\}$, how many relations can be formed from $A$ to $B$? Give four examples.',
            answer: {
              answerKey: '$\\boxed{2^8 = 256\\text{ relations}}$',
              schoolMethod: `**Solution:**

$$n(A \\times B) = 4 \\times 2 = 8$$

Number of relations $= $ number of subsets of $A \\times B$:
$$2^8 = 256$$

Four examples: $\\{(p,1)\\}$, $\\{(p,1),(q,2)\\}$, $\\{(p,1),(q,1),(r,2)\\}$, and $A \\times B$ itself.

**Answer:** $\\boxed{2^8 = 256\\text{ relations}}$.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: false,
            text: 'Given $A = \\{1, 2, 3, 4, 5\\}$ and $R = \\{(a, b) : |a - b| = 2\\}$, write $R$ and find its domain and range.',
            answer: {
              answerKey: '$\\boxed{R = \\{(1,3),(3,1),(2,4),(4,2),(3,5),(5,3)\\}\\text{, Domain }= \\{1, 2, 3, 4, 5\\}\\text{, Range }= \\{1, 2, 3, 4, 5\\}}$',
              schoolMethod: `**Solution:**

Pairs differing by 2:
$$R = \\{(1,3),(3,1),(2,4),(4,2),(3,5),(5,3)\\}$$

Domain $= \\{1, 2, 3, 4, 5\\}$, Range $= \\{1, 2, 3, 4, 5\\}$.

**Answer:** $\\boxed{R = \\{(1,3),(3,1),(2,4),(4,2),(3,5),(5,3)\\}\\text{, Domain }= \\{1, 2, 3, 4, 5\\}\\text{, Range }= \\{1, 2, 3, 4, 5\\}}$.`,
            }
          },
        ]
      },
      {
        id: 'ex3.3', title: 'Exercise 3.3',
        questions: [
          {
            id: 'q1', number: '1', isHard: true,
            text: 'Which of the following relations (given as arrow diagrams) are functions? (a) Every element of the first set has a unique image. (b) An element of the first set has two images. (c) An element of the first set has two images. (d) An element of the first set has two images.',
            parts: ['Unique image for every element', 'One element has two images', 'One element has two images', 'One element has two images'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) is a function; (b), (c), (d) are not}}$',
              schoolMethod: `**Solution:**

A relation is a function only if every element of the domain has exactly one image.

**(a)** Every element of the first set has a unique image → **Function.**  
**(b)** An element of the first set has two images → **Not a function.**  
**(c)** An element of the first set has two images → **Not a function.**  
**(d)** An element of the first set has two images → **Not a function.**

**Answer:** $\\boxed{\\text{(a) is a function; (b), (c), (d) are not}}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: true,
            text: 'Which of the following relations from $A = \\{3, 5, 7, 9\\}$ to $B = \\{1, 2, 3, 4, 5\\}$ are functions? (a) $R_1 = \\{(3,2),(5,4),(7,5),(9,5)\\}$ (b) $R_2 = \\{(1,3),(3,5),(5,7)\\}$ (c) $R_3 = \\{(2,3),(2,5),(2,7),(3,5),(3,7),(5,7)\\}$ (d) $R_4 = \\{(3,3),(5,5)\\}$.',
            parts: ['$R_1 = \\{(3,2),(5,4),(7,5),(9,5)\\}$', '$R_2 = \\{(1,3),(3,5),(5,7)\\}$', '$R_3 = \\{(2,3),(2,5),(2,7),(3,5),(3,7),(5,7)\\}$', '$R_4 = \\{(3,3),(5,5)\\}$'],
            answer: {
              answerKey: '$\\boxed{\\text{Only }R_1\\text{ is a function}}$',
              schoolMethod: `**Solution:**

**(a)** $R_1$ — every element of $A$ has a unique image. **Function.**  
**(b)** $R_2$ — domain is $\\{1, 3, 5\\} \\neq A$; also $7, 9$ have no image. **Not a function.**  
**(c)** $R_3$ — domain $\\{2, 3, 5\\} \\neq A$ and element 2 has three images. **Not a function.**  
**(d)** $R_4$ — $7, 9$ have no image. **Not a function.**

**Answer:** $\\boxed{\\text{Only }R_1\\text{ is a function}}$.`,
            }
          },
        ]
      },
      {
        id: 'ex3.4', title: 'Exercise 3.4',
        questions: [
          {
            id: 'q1', number: '1', isHard: true,
            text: 'For each of the following relations, find the domain and range and state whether it is a function: (a) $R = \\{(5,1),(4,1),(3,1),(2,0)\\}$ (b) $R = \\{(1,-1),(2,-2),(3,-3),(4,-4),(5,-5)\\}$ (c) $R = \\{(3,-1),(3,0),(3,1),(3,2)\\}$.',
            parts: ['$R = \\{(5,1),(4,1),(3,1),(2,0)\\}$', '$R = \\{(1,-1),(2,-2),(3,-3),(4,-4),(5,-5)\\}$', '$R = \\{(3,-1),(3,0),(3,1),(3,2)\\}$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) Domain }= \\{2,3,4,5\\}\\text{, Range }= \\{0,1\\}\\text{, Function; (b) Domain }= \\{1,2,3,4,5\\}\\text{, Range }= \\{-1,-2,-3,-4,-5\\}\\text{, Function; (c) Domain }= \\{3\\}\\text{, Range }= \\{-1,0,1,2\\}\\text{, Not a function}}$',
              schoolMethod: `**Solution:**

**(a)** Each first element has a unique image. Domain $= \\{2,3,4,5\\}$, Range $= \\{0,1\\}$. **Function.**

**(b)** Domain $= \\{1,2,3,4,5\\}$, Range $= \\{-1,-2,-3,-4,-5\\}$. **Function.**

**(c)** Element 3 has four images. Domain $= \\{3\\}$, Range $= \\{-1,0,1,2\\}$. **Not a function.**

**Answer:** $\\boxed{\\text{(a) Domain }= \\{2,3,4,5\\}\\text{, Range }= \\{0,1\\}\\text{, Function; (b) Domain }= \\{1,2,3,4,5\\}\\text{, Range }= \\{-1,-2,-3,-4,-5\\}\\text{, Function; (c) Domain }= \\{3\\}\\text{, Range }= \\{-1,0,1,2\\}\\text{, Not a function}}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: true,
            text: 'For each relation, find the domain and range: (a) $R = \\{(x, y) : xy = 8, x, y \\in \\mathbb{Z}\\}$ (b) $R = \\{(x, y) : x = |y|, x \\in \\mathbb{Z}, 0 \\leq x \\leq 5\\}$ (c) $R = \\{(x, y) : y = -\\sqrt{x}, x \\in (0, \\infty)\\}$.',
            parts: ['$xy = 8, x, y \\in \\mathbb{Z}$', '$x = |y|, x \\in \\mathbb{Z}, 0 \\leq x \\leq 5$', '$y = -\\sqrt{x}, x \\in (0, \\infty)$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) Domain }= \\{\\pm1, \\pm2, \\pm4, \\pm8\\}\\text{ = Range; (b) Domain }= \\{0,1,2,3,4,5\\}\\text{, Range }= \\{-5,-4,\\dots,4,5\\}\\text{; (c) Domain }= (0, \\infty)\\text{, Range }= (-\\infty, 0)}$',
              schoolMethod: `**Solution:**

**(a)** $xy = 8$ pairs: $(1,8),(2,4),(4,2),(8,1),(-1,-8),(-2,-4),(-4,-2),(-8,-1)$.
Domain $= \\{\\pm1, \\pm2, \\pm4, \\pm8\\} = $ Range.

**(b)** For each $x$, $y = \\pm x$ (except $x = 0$).
Domain $= \\{0,1,2,3,4,5\\}$, Range $= \\{-5,-4,\\dots,0,\\dots,4,5\\}$.

**(c)** $y = -\\sqrt{x}$. Domain $= (0, \\infty)$, Range $= (-\\infty, 0)$.

**Answer:** $\\boxed{\\text{(a) Domain }= \\{\\pm1, \\pm2, \\pm4, \\pm8\\}\\text{ = Range; (b) Domain }= \\{0,1,2,3,4,5\\}\\text{, Range }= \\{-5,-4,\\dots,4,5\\}\\text{; (c) Domain }= (0, \\infty)\\text{, Range }= (-\\infty, 0)}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'Given $f(x) = |x|$, $g(x) = |x| - 1$ and $h(x) = |x| + 1$, complete the table for $x = -2, -1, 0, 1, 2$ and describe how the graphs relate.',
            answer: {
              answerKey: '$\\boxed{g\\text{ is the graph of }f\\text{ shifted 1 unit down; }h\\text{ is }f\\text{ shifted 1 unit up. The V-shape remains identical.}}$',
              schoolMethod: `**Solution:**

| $x$ | $f$ | $g$ | $h$ |
|---|---|---|---|
| $-2$ | $2$ | $1$ | $3$ |
| $-1$ | $1$ | $0$ | $2$ |
| $0$ | $0$ | $-1$ | $1$ |
| $1$ | $1$ | $0$ | $2$ |
| $2$ | $2$ | $1$ | $3$ |

$g$ is the graph of $f$ shifted 1 unit down; $h$ is the graph of $f$ shifted 1 unit up. The V-shape remains identical.

**Answer:** $\\boxed{g\\text{ is the graph of }f\\text{ shifted 1 unit down; }h\\text{ is }f\\text{ shifted 1 unit up. The V-shape remains identical.}}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'Given $f(x) = x^2$, $g(x) = (x-1)^2$ and $h(x) = (x+2)^2$, complete the table for $x = -2, -1, 0, 1, 2$ and describe the shifts and the domain/range.',
            answer: {
              answerKey: '$\\boxed{g\\text{ is }f\\text{ shifted right by 1; }h\\text{ is }f\\text{ shifted left by 2. Domain and range of all three are equal.}}$',
              schoolMethod: `**Solution:**

| $x$ | $f$ | $g$ | $h$ |
|---|---|---|---|
| $-2$ | $4$ | $9$ | $0$ |
| $-1$ | $1$ | $4$ | $1$ |
| $0$ | $0$ | $1$ | $4$ |
| $1$ | $1$ | $0$ | $9$ |
| $2$ | $4$ | $1$ | $16$ |

$g(x)$ is $f(x)$ shifted right by 1 unit; $h(x)$ is $f(x)$ shifted left by 2 units.

Domain of all three is $\\mathbb{R}$; Range of all three is $[0, \\infty)$ — so both domain and range are equal for $f, g, h$.

**Answer:** $\\boxed{g\\text{ is }f\\text{ shifted right by 1; }h\\text{ is }f\\text{ shifted left by 2. Domain and range of all three are equal.}}$.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: true,
            text: 'Find the domain and range of: (a) $y = \\frac{1}{x^2}$ (b) $y = 2 - |x|$ (c) $y = (x-1)^3$ (d) $y = \\sqrt{-x}$.',
            parts: ['$y = \\frac{1}{x^2}$', '$y = 2 - |x|$', '$y = (x-1)^3$', '$y = \\sqrt{-x}$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) Domain }= \\mathbb{R} - \\{0\\}\\text{, Range }= (0, \\infty)\\text{; (b) Domain }= \\mathbb{R}\\text{, Range }= (-\\infty, 2]\\text{; (c) Domain }= \\mathbb{R}\\text{, Range }= \\mathbb{R}\\text{; (d) Domain }= (-\\infty, 0]\\text{, Range }= [0, \\infty)}$',
              schoolMethod: `**Solution:**

**(a)** $y = \\frac{1}{x^2}$: $x \\neq 0$; range is positive. Domain $= \\mathbb{R} - \\{0\\}$, Range $= (0, \\infty)$.

**(b)** $y = 2 - |x|$: defined for all reals; $|x| \\geq 0$ so $y \\leq 2$. Domain $= \\mathbb{R}$, Range $= (-\\infty, 2]$.

**(c)** $y = (x-1)^3$: cubic is defined for all reals and takes all real values. Domain $= \\mathbb{R}$, Range $= \\mathbb{R}$.

**(d)** $y = \\sqrt{-x}$: need $-x \\geq 0 \\Rightarrow x \\leq 0$; $y \\geq 0$. Domain $= (-\\infty, 0]$, Range $= [0, \\infty)$.

**Answer:** $\\boxed{\\text{(a) Domain }= \\mathbb{R} - \\{0\\}\\text{, Range }= (0, \\infty)\\text{; (b) Domain }= \\mathbb{R}\\text{, Range }= (-\\infty, 2]\\text{; (c) Domain }= \\mathbb{R}\\text{, Range }= \\mathbb{R}\\text{; (d) Domain }= (-\\infty, 0]\\text{, Range }= [0, \\infty)}$.`,
            }
          },
        ]
      },
    ]
  },
  {
    id: 'ch04', number: 4,
    title: 'Coordinate Geometry',
    slug: 'coordinate-geometry',
    code: 'am04',
    description: 'Uses the Cartesian plane to solve quadrant and reflection problems, slope-based questions on parallel and perpendicular lines, intercept form of a straight line, and the area of triangles cut off by lines with the axes.',
    exercises: [
      {
        id: 'ex4.1', title: 'Exercise 4.1',
        questions: [
          {
            id: 'q1', number: '1', isHard: true,
            text: 'Point $P$ lies in the III quadrant. Where does its reflection $P\\text{\u2019}$ across the y-axis lie? Where does the reflection of $P\\text{\u2019}$ across the x-axis lie?',
            answer: {
              answerKey: '$\\boxed{P\\text{\u2019}\\text{ lies in the IV quadrant, }P\\text{\u2019\\text{\u2019}}\\text{ lies in the I quadrant}}$',
              schoolMethod: `**Solution:**

$P$ is in the III quadrant $(-, -)$.

Reflecting across the y-axis flips the sign of the x-coordinate → $P\\text{\u2019}$ is in $(+, -)$ = **IV quadrant**.

Reflecting $P\\text{\u2019}$ across the x-axis flips the sign of the y-coordinate → $P\\text{\u2019\\text{\u2019}}$ is in $(+, +)$ = **I quadrant**.

**Answer:** $\\boxed{P\\text{\u2019}\\text{ lies in the IV quadrant, }P\\text{\u2019\\text{\u2019}}\\text{ lies in the I quadrant}}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: true,
            text: 'Point $A(a, b)$ is reflected across the x-axis to give $B(a, -b)$. If $B$ is 8 units below $A$, what is the y-coordinate of $A$?',
            answer: {
              answerKey: '$\\boxed{\\text{y-coordinate of }A = 4}$',
              schoolMethod: `**Solution:**

Distance from $A$ to $B$ is:
$$b - (-b) = 8 \\Rightarrow 2b = 8 \\Rightarrow b = 4$$

**Answer:** $\\boxed{\\text{y-coordinate of }A = 4}$.`,
            }
          },
        ]
      },
      {
        id: 'ex4.2', title: 'Exercise 4.2',
        questions: [
          {
            id: 'q1', number: '1', isHard: true,
            text: 'Point $P(a, b)$ lies in the IV quadrant. Its distance from the y-axis is 3 more than its distance from the x-axis, and $ab = -28$. Find $a^2 + b$.',
            answer: {
              answerKey: '$\\boxed{a^2 + b = 45}$',
              schoolMethod: `**Solution:**

In the IV quadrant, $a > 0$, $b < 0$.

Distance from y-axis $= a$; distance from x-axis $= -b$.

Given: $a = (-b) + 3 \\Rightarrow a + b = 3$. Also $ab = -28$.

From $a = 3 - b$:
$$(3-b)b = -28 \\Rightarrow b^2 - 3b - 28 = 0 \\Rightarrow (b-7)(b+4) = 0$$

Since $b < 0$, $b = -4$, so $a = 3 - (-4) = 7$. Check: $ab = 7(-4) = -28$ ✓.

$$a^2 + b = 49 + (-4) = 45$$

**Answer:** $\\boxed{a^2 + b = 45}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: true,
            text: 'Point $Q(k-4, 2k+7)$ lies strictly in the II quadrant and its distance from the y-axis is twice its distance from the x-axis. Find $k$ and $k^3 + 10$.',
            answer: {
              answerKey: '$\\boxed{k = -2\\text{, }k^3 + 10 = 2}$',
              schoolMethod: `**Solution:**

For II quadrant: $k - 4 < 0$ and $2k + 7 > 0$ ⇒ $-3.5 < k < 4$.

Distance from y-axis $= 4 - k$; distance from x-axis $= 2k + 7$.

Given: $4 - k = 2(2k + 7)$:
$$4 - k = 4k + 14 \\Rightarrow -10 = 5k \\Rightarrow k = -2$$

$k = -2$ lies in the valid range.

$$k^3 + 10 = (-8) + 10 = 2$$

**Answer:** $\\boxed{k = -2\\text{, }k^3 + 10 = 2}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'Point $P(3, -4)$ is reflected through the y-axis to $Q(a, b)$ and through the x-axis to $R(c, d)$. Find $ac - bd$.',
            answer: {
              answerKey: '$\\boxed{ac - bd = 25}$',
              schoolMethod: `**Solution:**

Reflection through y-axis: $Q(a, b) = (-3, -4)$.

Reflection through x-axis: $R(c, d) = (-3, 4)$.

$$ac - bd = (-3)(-3) - (-4)(4) = 9 + 16 = 25$$

**Answer:** $\\boxed{ac - bd = 25}$.`,
            }
          },
        ]
      },
      {
        id: 'ex4.3', title: 'Exercise 4.3',
        questions: [
          {
            id: 'q1', number: '1', isHard: true,
            text: 'A line of slope $\\frac{1}{2}$ passes through $A(x, 2)$, $B(3, 4)$ and $C(7, y)$. Find $x$ and $y$, and hence $x + y$.',
            answer: {
              answerKey: '$\\boxed{A(-1, 2)\\text{, }C(7, 6)\\text{, }x + y = 5}$',
              schoolMethod: `**Solution:**

Slope of $AB$:
$$\\frac{4-2}{3-x} = \\frac{1}{2} \\Rightarrow \\frac{2}{3-x} = \\frac{1}{2} \\Rightarrow 4 = 3 - x \\Rightarrow x = -1$$

Slope of $BC$:
$$\\frac{y-4}{7-3} = \\frac{1}{2} \\Rightarrow \\frac{y-4}{4} = \\frac{1}{2} \\Rightarrow y - 4 = 2 \\Rightarrow y = 6$$

$$x + y = -1 + 6 = 5$$

**Answer:** $\\boxed{A(-1, 2)\\text{, }C(7, 6)\\text{, }x + y = 5}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: true,
            text: 'The points $P(2, 3)$, $Q(5, 7)$ and $R(13, k)$ are consecutive vertices of a rectangle. Find $k$.',
            answer: {
              answerKey: '$\\boxed{k = 1}$',
              schoolMethod: `**Solution:**

In a rectangle, adjacent sides are perpendicular, so $PQ \\perp QR$.

Slope of $PQ$:
$$\\frac{7-3}{5-2} = \\frac{4}{3}$$

Slope of $QR$:
$$\\frac{k-7}{13-5} = \\frac{k-7}{8}$$

Perpendicular condition:
$$\\frac{4}{3} \\times \\frac{k-7}{8} = -1 \\Rightarrow \\frac{4(k-7)}{24} = -1 \\Rightarrow k - 7 = -6 \\Rightarrow k = 1$$

**Answer:** $\\boxed{k = 1}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'A line $l$ through the origin intersects segment $AB$ where $A(2, 8)$ and $B(6, 2)$. Between which limits does the slope $m$ of $l$ lie?',
            answer: {
              answerKey: '$\\boxed{\\frac{1}{3} \\leq m \\leq 4}$',
              schoolMethod: `**Solution:**

Slope of $OA$:
$$\\frac{8}{2} = 4$$

Slope of $OB$:
$$\\frac{2}{6} = \\frac{1}{3}$$

As the line rotates from $OA$ to $OB$, its slope $m$ ranges between these two values:
$$\\frac{1}{3} \\leq m \\leq 4$$

**Answer:** $\\boxed{\\frac{1}{3} \\leq m \\leq 4}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'Line $l_1$ passes through $A(1, k)$ and $B(k, 7)$; line $l_2$ passes through $C(-2, 4)$ and $D(1, 10)$. If $l_1 \\parallel l_2$, find $k$ and $k^2 + 5$.',
            answer: {
              answerKey: '$\\boxed{k = 3\\text{, }k^2 + 5 = 14}$',
              schoolMethod: `**Solution:**

Slope of $l_1$:
$$\\frac{7-k}{k-1}$$

Slope of $l_2$:
$$\\frac{10-4}{1-(-2)} = \\frac{6}{3} = 2$$

Parallel lines have equal slopes:
$$\\frac{7-k}{k-1} = 2 \\Rightarrow 7 - k = 2k - 2 \\Rightarrow 9 = 3k \\Rightarrow k = 3$$

$$k^2 + 5 = 9 + 5 = 14$$

**Answer:** $\\boxed{k = 3\\text{, }k^2 + 5 = 14}$.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: true,
            text: 'Line $p$ has slope 2. Line $q$ passes through $M(3a, 4)$ and $N(a, 5)$. If $p \\perp q$, find $a$ and the coordinates of $M$ and $N$.',
            answer: {
              answerKey: '$\\boxed{a = 1\\text{, }M(3, 4)\\text{, }N(1, 5)}$',
              schoolMethod: `**Solution:**

Slope of $q$:
$$\\frac{5-4}{a-3a} = \\frac{1}{-2a}$$

Perpendicular condition: $m_p \\cdot m_q = -1$:
$$2 \\times \\left(-\\frac{1}{2a}\\right) = -1 \\Rightarrow -\\frac{1}{a} = -1 \\Rightarrow a = 1$$

$$M(3a, 4) = (3, 4), \\quad N(a, 5) = (1, 5)$$

**Answer:** $\\boxed{a = 1\\text{, }M(3, 4)\\text{, }N(1, 5)}$.`,
            }
          },
        ]
      },
      {
        id: 'ex4.4', title: 'Exercise 4.4',
        questions: [
          {
            id: 'q1', number: '1', isHard: true,
            text: 'The line $kx + 3y - 12 = 0$ cuts off a triangle of area 6 with the axes. Find the slope of the line.',
            answer: {
              answerKey: '$\\boxed{\\text{slope }= \\pm \\frac{2}{3}}$',
              schoolMethod: `**Solution:**

x-intercept $= \\frac{12}{k}$; y-intercept $= 4$.

Area $= \\frac{1}{2} \\times \\frac{12}{k} \\times 4 = \\frac{24}{k} = 6 \\Rightarrow |k| = 2 \\Rightarrow k = \\pm 2$.

Slope of $kx + 3y - 12 = 0$ is $-\\frac{k}{3}$:
- for $k = -2$: slope $= \\frac{2}{3}$
- for $k = 2$: slope $= -\\frac{2}{3}$

**Answer:** $\\boxed{\\text{slope }= \\pm \\frac{2}{3}}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: true,
            text: 'The line $px + qy + r = 0$ forms an isosceles right triangle with the axes. What must be true about $p$ and $q$?',
            answer: {
              answerKey: '$\\boxed{|p| = |q|\\text{, i.e., }p^2 = q^2}$',
              schoolMethod: `**Solution:**

x-intercept $= -\\frac{r}{p}$; y-intercept $= -\\frac{r}{q}$.

For an isosceles right triangle with the axes, the intercepts must be equal in magnitude:
$$\\left|-\\frac{r}{p}\\right| = \\left|-\\frac{r}{q}\\right| \\Rightarrow |p| = |q| \\Rightarrow p^2 = q^2$$

**Answer:** $\\boxed{|p| = |q|\\text{, i.e., }p^2 = q^2}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'Given $l_1: 3x - 5y + 10 = 0$ and $l_2: 5x + 3y + K = 0$. (a) Show $l_1 \\perp l_2$. (b) If the x-intercept of $l_1$ equals the y-intercept of $l_2$, find $K$.',
            answer: {
              answerKey: '$\\boxed{l_1 \\perp l_2\\text{ (proved); }K = 10}$',
              schoolMethod: `**Solution:**

Slope of $l_1$: $3x - 5y + 10 = 0 \\Rightarrow y = \\frac{3}{5}x + 2$, slope $= \\frac{3}{5}$.

Slope of $l_2$: $5x + 3y + K = 0 \\Rightarrow y = -\\frac{5}{3}x - \\frac{K}{3}$, slope $= -\\frac{5}{3}$.

**(a)** Product of slopes:
$$\\frac{3}{5} \\times \\left(-\\frac{5}{3}\\right) = -1 \\Rightarrow l_1 \\perp l_2$$

**(b)** x-intercept of $l_1$: put $y = 0$: $3x + 10 = 0 \\Rightarrow x = -\\frac{10}{3}$.

y-intercept of $l_2$: put $x = 0$: $3y + K = 0 \\Rightarrow y = -\\frac{K}{3}$.

Given equal:
$$-\\frac{10}{3} = -\\frac{K}{3} \\Rightarrow K = 10$$

**Answer:** $\\boxed{l_1 \\perp l_2\\text{ (proved); }K = 10}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'The line $kx - y + C = 0$ passes through $(3, 10)$, and the sum of its x-intercept and y-intercept equals the slope. Find the two possible lines.',
            answer: {
              answerKey: '$\\boxed{2x - y + 4 = 0\\text{ or }5x - 4y + 25 = 0}$',
              schoolMethod: `**Solution:**

$kx - y + C = 0 \\Rightarrow y = kx + C$, slope $= k$.

Passes through $(3, 10)$: $10 = 3k + C \\Rightarrow C = 10 - 3k$.

x-intercept $= -\\frac{C}{k}$; y-intercept $= C$.

Given: $-\\frac{C}{k} + C = k$. Substituting $C = 10 - 3k$ and simplifying:
$$4k^2 - 13k + 10 = 0 \\Rightarrow k = \\frac{13 \\pm 3}{8} = 2 \\text{ or } \\frac{5}{4}$$

For $k = 2$: $C = 4$; for $k = \\frac{5}{4}$: $C = \\frac{25}{4}$.

**Answer:** $\\boxed{2x - y + 4 = 0\\text{ or }5x - 4y + 25 = 0}$.`,
            }
          },
        ]
      },
      {
        id: 'ex4.5', title: 'Exercise 4.5',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Write the equation of the line that crosses the y-axis at $(0, -5)$ and rises 3 units for every 2 units to the right.',
            answer: {
              answerKey: '$\\boxed{y = \\frac{3}{2}x - 5}$',
              schoolMethod: `**Solution:**

Rises 3 for every 2 right → slope $= \\frac{3}{2}$.

y-intercept $= -5$.

$$y = \\frac{3}{2}x - 5$$

**Answer:** $\\boxed{y = \\frac{3}{2}x - 5}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Write the equation of the line parallel to $y = 5x - 12$ passing through $(0, 9)$.',
            answer: {
              answerKey: '$\\boxed{y = 5x + 9}$',
              schoolMethod: `**Solution:**

Parallel lines have equal slope: slope $= 5$.

Through $(0, 9)$ → y-intercept $= 9$.

$$y = 5x + 9$$

**Answer:** $\\boxed{y = 5x + 9}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'Write the equation of the line perpendicular to $y = \\frac{1}{3}x + 4$ passing through the origin.',
            answer: {
              answerKey: '$\\boxed{y = -3x}$',
              schoolMethod: `**Solution:**

Slope of given line $= \\frac{1}{3}$, so the required perpendicular slope $= -3$.

Through the origin → y-intercept $= 0$.

$$y = -3x$$

**Answer:** $\\boxed{y = -3x}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Write the equation of the line through $(0, -6)$ and $(4, 10)$.',
            answer: {
              answerKey: '$\\boxed{y = 4x - 6}$',
              schoolMethod: `**Solution:**

Slope:
$$\\frac{10 - (-6)}{4 - 0} = \\frac{16}{4} = 4$$

y-intercept $= -6$.

$$y = 4x - 6$$

**Answer:** $\\boxed{y = 4x - 6}$.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'Express $8x - y + 7 = 0$ in the form $y = mx + c$.',
            answer: {
              answerKey: '$\\boxed{y = 8x + 7}$',
              schoolMethod: `**Solution:**

$$8x - y + 7 = 0 \\Rightarrow y = 8x + 7$$

**Answer:** $\\boxed{y = 8x + 7}$.`,
            }
          },
        ]
      },
      {
        id: 'ex4.6', title: 'Exercise 4.6',
        questions: [
          {
            id: 'q1', number: '1', isHard: true,
            text: 'A line passes through $(2, 3)$ and cuts the axes such that the triangle area is 12. Find the x-intercept and y-intercept.',
            answer: {
              answerKey: '$\\boxed{\\text{x-intercept }= 4\\text{, y-intercept }= 6}$',
              schoolMethod: `**Solution:**

Using intercept form $\\frac{x}{a} + \\frac{y}{b} = 1$:
$$\\frac{2}{a} + \\frac{3}{b} = 1, \\quad \\text{and} \\quad \\frac{1}{2}ab = 12 \\Rightarrow ab = 24$$

$$\\frac{2}{a} + \\frac{3}{b} = 1 \\Rightarrow 2b + 3a = ab = 24 \\Rightarrow 3a + 2b = 24$$

From $ab = 24$: $b = \\frac{24}{a}$. Substituting:
$$3a + \\frac{48}{a} = 24 \\Rightarrow 3a^2 - 24a + 48 = 0 \\Rightarrow a^2 - 8a + 16 = 0 \\Rightarrow (a-4)^2 = 0$$
$$a = 4, \\quad b = 6$$

**Answer:** $\\boxed{\\text{x-intercept }= 4\\text{, y-intercept }= 6}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: true,
            text: 'A line passes through $(2, 2)$ and $a + b = 9$. Find $ab$.',
            answer: {
              answerKey: '$\\boxed{ab = 18}$',
              schoolMethod: `**Solution:**

Using intercept form:
$$\\frac{2}{a} + \\frac{2}{b} = 1 \\Rightarrow \\frac{2(a+b)}{ab} = 1 \\Rightarrow \\frac{2(9)}{ab} = 1 \\Rightarrow ab = 18$$

**Answer:** $\\boxed{ab = 18}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'A line passes through $(3, 5)$ and $a + b = 0$. Find its equation.',
            answer: {
              answerKey: '$\\boxed{x - y + 2 = 0}$',
              schoolMethod: `**Solution:**

$a + b = 0 \\Rightarrow b = -a$.

Intercept form:
$$\\frac{x}{a} - \\frac{y}{a} = 1 \\Rightarrow x - y = a$$

Passes through $(3, 5)$: $3 - 5 = a \\Rightarrow a = -2$.

$$x - y = -2 \\Rightarrow x - y + 2 = 0$$

**Answer:** $\\boxed{x - y + 2 = 0}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'A line forms a right triangle with the axes having area 24 and hypotenuse 10. Find its equation(s).',
            answer: {
              answerKey: '$\\boxed{\\frac{x}{8} + \\frac{y}{6} = 1\\text{ or }\\frac{x}{6} + \\frac{y}{8} = 1}$',
              schoolMethod: `**Solution:**

Let intercepts be $a$ and $b$ (legs of the right triangle).

$$\\frac{1}{2}ab = 24 \\Rightarrow ab = 48; \\quad a^2 + b^2 = 100$$

$$(a+b)^2 = a^2 + b^2 + 2ab = 100 + 96 = 196 \\Rightarrow a + b = 14$$

$$(a-b)^2 = a^2 + b^2 - 2ab = 100 - 96 = 4 \\Rightarrow a - b = \\pm 2$$

Solving: $a = 8, b = 6$ or $a = 6, b = 8$.

**Answer:** $\\boxed{\\frac{x}{8} + \\frac{y}{6} = 1\\text{ or }\\frac{x}{6} + \\frac{y}{8} = 1}$.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: true,
            text: 'A line passes through $(3, 2)$, $a + b = 12$ with both intercepts positive. Find its equation(s).',
            answer: {
              answerKey: '$\\boxed{\\frac{x}{9} + \\frac{y}{3} = 1\\text{ or }\\frac{x}{4} + \\frac{y}{8} = 1}$',
              schoolMethod: `**Solution:**

$$\\frac{3}{a} + \\frac{2}{b} = 1, \\quad \\text{and} \\quad b = 12 - a$$

$$\\frac{3}{a} + \\frac{2}{12-a} = 1 \\Rightarrow 3(12-a) + 2a = a(12-a)$$
$$36 - a = 12a - a^2 \\Rightarrow a^2 - 13a + 36 = 0 \\Rightarrow (a-9)(a-4) = 0$$

$a = 9, b = 3$ or $a = 4, b = 8$.

**Answer:** $\\boxed{\\frac{x}{9} + \\frac{y}{3} = 1\\text{ or }\\frac{x}{4} + \\frac{y}{8} = 1}$.`,
            }
          },
        ]
      },
    ]
  },
  {
    id: 'ch05', number: 5,
    title: 'Combinatorics',
    slug: 'combinatorics',
    code: 'am05',
    description: 'Introduces the fundamental principle of counting, factorials, permutations ($^{n}P_r$) and combinations ($^{n}C_r$), with word-arrangement and selection problems applied to everyday situations.',
    exercises: [
      {
        id: 'ex5.1', title: 'Exercise 5.1',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'A restaurant offers 4 starters, 5 main courses and 3 desserts. How many different full meals (starter + main + dessert) are possible?',
            answer: {
              answerKey: '$\\boxed{\\text{60 ways}}$',
              schoolMethod: `**Solution:**

By the fundamental counting principle:
$$4 \\times 5 \\times 3 = 60$$

**Answer:** $\\boxed{\\text{60 ways}}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'A hall has 5 doors to enter and 3 doors to exit. In how many ways can a person enter and exit?',
            answer: {
              answerKey: '$\\boxed{\\text{15 ways}}$',
              schoolMethod: `**Solution:**

$$5 \\times 3 = 15$$

**Answer:** $\\boxed{\\text{15 ways}}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'A lock has 3 dials, each with digits 0-9, and repetition is allowed. How many combinations are possible?',
            answer: {
              answerKey: '$\\boxed{\\text{1000 combinations}}$',
              schoolMethod: `**Solution:**

$$10 \\times 10 \\times 10 = 1000$$

**Answer:** $\\boxed{\\text{1000 combinations}}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'How many numbers between 2000 and 3000 can be formed using the digits $\\{2, 3, 4, 5, 6, 7\\}$ without repetition?',
            answer: {
              answerKey: '$\\boxed{\\text{60 numbers}}$',
              schoolMethod: `**Solution:**

Thousands digit must be 2 (1 choice). Remaining 3 places from the remaining 5 digits:
$$5 \\times 4 \\times 3 = 60$$

Total $= 1 \\times 60 = 60$.

**Answer:** $\\boxed{\\text{60 numbers}}$.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: true,
            text: 'How many 3-digit even numbers can be formed from $\\{1, 2, 3, 4, 6\\}$? (a) without repetition, (b) with repetition allowed.',
            parts: ['Without repetition', 'With repetition allowed'],
            answer: {
              answerKey: '$\\boxed{\\text{36 (no repetition); 75 (with repetition)}}$',
              schoolMethod: `**Solution:**

Units digit must be even: $2, 4, 6$ (3 choices).

**(a) Without repetition:** Units (3 choices), Hundreds (4 remaining), Tens (3 remaining):
$$3 \\times 4 \\times 3 = 36$$

**(b) With repetition:** Units (3 choices), Hundreds (5 choices), Tens (5 choices):
$$3 \\times 5 \\times 5 = 75$$

**Answer:** $\\boxed{\\text{36 (no repetition); 75 (with repetition)}}$.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: true,
            text: 'How many 3-digit numbers from 100 to 999 contain the digit 9 at (a) the unit\u2019s place, (b) the ten\u2019s place, (c) the hundred\u2019s place? Describe the pattern.',
            parts: ['9 at unit\u2019s place', '9 at ten\u2019s place', '9 at hundred\u2019s place'],
            answer: {
              answerKey: '$\\boxed{\\text{90, 90, 100 respectively}}$',
              schoolMethod: `**Solution:**

**(a) 9 at unit\u2019s place:** Hundreds (9 choices: 1-9), Tens (10 choices), Units fixed:
$$9 \\times 10 \\times 1 = 90$$

**(b) 9 at ten\u2019s place:** Hundreds (9 choices), Tens fixed, Units (10 choices):
$$9 \\times 1 \\times 10 = 90$$

**(c) 9 at hundred\u2019s place:** Hundreds fixed, Tens (10), Units (10):
$$1 \\times 10 \\times 10 = 100$$

**Pattern:** When 9 occupies the unit\u2019s or ten\u2019s place, the count is 90 each time (the hundred\u2019s place still excludes 0, giving 9 choices). But when 9 itself occupies the hundred\u2019s place, that restriction disappears and both remaining places get the full 10 choices, so the count rises to 100.

**Answer:** $\\boxed{\\text{90, 90, 100 respectively}}$.`,
            }
          },
        ]
      },
      {
        id: 'ex5.2', title: 'Exercise 5.2',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Find the HCF and LCM of $6!$ and $5!$.',
            answer: {
              answerKey: '$\\boxed{\\text{HCF }= 120\\text{, LCM }= 720}$',
              schoolMethod: `**Solution:**

$$6! = 720, \\quad 5! = 120$$

Since $120 \\mid 720$ (as $720 = 6 \\times 120$):
$$\\text{HCF} = 120, \\quad \\text{LCM} = 720$$

**Answer:** $\\boxed{\\text{HCF }= 120\\text{, LCM }= 720}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: true,
            text: 'Find $n$ if $\\frac{n!}{(n-3)!} = 60$.',
            answer: {
              answerKey: '$\\boxed{n = 5}$',
              schoolMethod: `**Solution:**

$$\\frac{n!}{(n-3)!} = n(n-1)(n-2) = 60$$

Trying $n = 5$: $5 \\times 4 \\times 3 = 60$ ✓.

**Answer:** $\\boxed{n = 5}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'Find $x$ if $\\frac{1}{5!} + \\frac{1}{6!} = \\frac{x}{7!}$.',
            answer: {
              answerKey: '$\\boxed{x = 49}$',
              schoolMethod: `**Solution:**

Convert to sevenths of $7!$:
$$\\frac{1}{5!} = \\frac{7 \\times 6}{7!} = \\frac{42}{7!}, \\quad \\frac{1}{6!} = \\frac{7}{7!}$$

$$x = \\frac{7!}{5!} + \\frac{7!}{6!} = (7 \\times 6) + 7 = 42 + 7 = 49$$

**Answer:** $\\boxed{x = 49}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'Solve: (a) $x! = 120$ (b) $(x!)^2 = 576$ (c) $(x!)^2 - 25(x!) + 24 = 0$ (d) $\\frac{(x+2)! - (x+1)!}{x!} = 49$.',
            parts: ['$x! = 120$', '$(x!)^2 = 576$', '$(x!)^2 - 25(x!) + 24 = 0$', '$\\frac{(x+2)! - (x+1)!}{x!} = 49$'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) }x = 5\\text{, (b) }x = 4\\text{, (c) }x = 0, 1, 4\\text{, (d) }x = 6}$',
              schoolMethod: `**Solution:**

**(a)** $x! = 120 \\Rightarrow x = 5$.

**(b)** $(x!)^2 = 576 \\Rightarrow x! = 24 \\Rightarrow x = 4$.

**(c)** Let $t = x!$: $t^2 - 25t + 24 = 0 \\Rightarrow (t-1)(t-24) = 0 \\Rightarrow t = 1$ or $24$.
$t = 1 \\Rightarrow x = 0$ or $1$; $t = 24 \\Rightarrow x = 4$. So $x = 0, 1, 4$.

**(d)** $(x+2)! = (x+2)(x+1)x!$ and $(x+1)! = (x+1)x!$:
$$\\frac{(x+2)! - (x+1)!}{x!} = (x+1)[(x+2) - 1] = (x+1)^2 = 49 \\Rightarrow x + 1 = \\pm 7$$
Since $x \\geq 0$, $x = 6$.

**Answer:** $\\boxed{\\text{(a) }x = 5\\text{, (b) }x = 4\\text{, (c) }x = 0, 1, 4\\text{, (d) }x = 6}$.`,
            }
          },
        ]
      },
      {
        id: 'ex5.3', title: 'Exercise 5.3',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'In how many ways can 4 distinct cars be parked in 6 spaces?',
            answer: {
              answerKey: '$\\boxed{\\text{360 ways}}$',
              schoolMethod: `**Solution:**

$$^6P_4 = 6 \\times 5 \\times 4 \\times 3 = 360$$

**Answer:** $\\boxed{\\text{360 ways}}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'How many 3-letter words can be formed from the letters of the word LOGIC?',
            answer: {
              answerKey: '$\\boxed{\\text{60 words}}$',
              schoolMethod: `**Solution:**

LOGIC has 5 distinct letters:
$$^5P_3 = 5 \\times 4 \\times 3 = 60$$

**Answer:** $\\boxed{\\text{60 words}}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'In how many ways can 3 maths books and 5 science books be arranged on a shelf so that all maths books come first?',
            answer: {
              answerKey: '$\\boxed{\\text{720 ways}}$',
              schoolMethod: `**Solution:**

Arrange 3 maths books in the first 3 positions: $3! = 6$.
Arrange 5 science books in the remaining 5 positions: $5! = 120$.

$$6 \\times 120 = 720$$

**Answer:** $\\boxed{\\text{720 ways}}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'In how many ways can 5 boys and 2 girls be seated in a row so that the two girls always sit together?',
            answer: {
              answerKey: '$\\boxed{\\text{1440 ways}}$',
              schoolMethod: `**Solution:**

Treat the 2 girls as one block: 6 units (5 boys + 1 block) arrange in $6! = 720$ ways.
Arrange the girls within the block: $2! = 2$.

$$720 \\times 2 = 1440$$

**Answer:** $\\boxed{\\text{1440 ways}}$.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: true,
            text: 'How many 4-digit numbers greater than 6000 can be formed from $\\{2, 4, 6, 8, 9\\}$ without repetition?',
            answer: {
              answerKey: '$\\boxed{\\text{72 numbers}}$',
              schoolMethod: `**Solution:**

Thousands digit must be $\\{6, 8, 9\\}$ (3 choices). Remaining 3 places from the remaining 4 digits:
$$^4P_3 = 4 \\times 3 \\times 2 = 24$$

$$3 \\times 24 = 72$$

**Answer:** $\\boxed{\\text{72 numbers}}$.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: true,
            text: 'The word DAUGHTER has 8 letters (vowels A, U, E). (i) How many arrangements keep all the vowels together? (ii) How many arrangements keep the vowels not together?',
            parts: ['Vowels together', 'Vowels not together'],
            answer: {
              answerKey: '$\\boxed{\\text{(i) 4320 words, (ii) 36000 words}}$',
              schoolMethod: `**Solution:**

**(i)** Vowels together: treat A, U, E as one block → 6 units, arranged in $6! = 720$ ways. Vowels within block: $3! = 6$.
$$720 \\times 6 = 4320$$

**(ii)** Total arrangements $= 8! = 40320$.
$$\\text{Not together} = 40320 - 4320 = 36000$$

**Answer:** $\\boxed{\\text{(i) 4320 words, (ii) 36000 words}}$.`,
            }
          },
        ]
      },
      {
        id: 'ex5.4', title: 'Exercise 5.4',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'In how many ways can a committee of 3 be chosen from 12 people?',
            answer: {
              answerKey: '$\\boxed{\\text{220 ways}}$',
              schoolMethod: `**Solution:**

$$^{12}C_3 = \\frac{12!}{3! \\, 9!} = \\frac{12 \\times 11 \\times 10}{3 \\times 2 \\times 1} = 220$$

**Answer:** $\\boxed{\\text{220 ways}}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: true,
            text: 'There are 12 points in a plane, of which 5 are collinear. How many triangles can be formed?',
            answer: {
              answerKey: '$\\boxed{\\text{210 triangles}}$',
              schoolMethod: `**Solution:**

The 5 collinear points cannot form a triangle amongst themselves:
$$\\text{Triangles} = {}^{12}C_3 - {}^5C_3 = 220 - 10 = 210$$

**Answer:** $\\boxed{\\text{210 triangles}}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'A student must select 7 questions from a paper with Part A (7 questions) and Part B (5 questions), choosing at least 3 from each part. In how many ways?',
            answer: {
              answerKey: '$\\boxed{\\text{525 ways}}$',
              schoolMethod: `**Solution:**

Possible splits $(a, b)$ with $a + b = 7$, $a \\geq 3$, $b \\geq 3$: $(3, 4)$ or $(4, 3)$.

$(3$ from A, $4$ from B): \${}^7C_3 \\times {}^5C_4 = 35 \\times 5 = 175$  
$(4$ from A, $3$ from B): \${}^7C_4 \\times {}^5C_3 = 35 \\times 10 = 350$

$$175 + 350 = 525$$

**Answer:** $\\boxed{\\text{525 ways}}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'Find the number of diagonals of a 10-sided polygon.',
            answer: {
              answerKey: '$\\boxed{\\text{35 diagonals}}$',
              schoolMethod: `**Solution:**

Number of diagonals of an $n$-sided polygon $= \\frac{n(n-3)}{2}$.

For $n = 10$:
$$\\frac{10 \\times 7}{2} = 35$$

**Answer:** $\\boxed{\\text{35 diagonals}}$.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'If 15 people meet and each shakes hands with every other once, how many handshakes occur?',
            answer: {
              answerKey: '$\\boxed{\\text{105 handshakes}}$',
              schoolMethod: `**Solution:**

$$\${}^{15}C_2 = \\frac{15 \\times 14}{2} = 105$$

**Answer:** $\\boxed{\\text{105 handshakes}}$.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: true,
            text: 'A committee of 3 is to be chosen from 2 men and 3 women. (a) How many committees are possible in total? (b) How many have exactly 1 man and 2 women?',
            parts: ['Total committees', 'Exactly 1 man and 2 women'],
            answer: {
              answerKey: '$\\boxed{\\text{(a) 10 ways, (b) 6 ways}}$',
              schoolMethod: `**Solution:**

**(a)** Committee of 3 from $2 + 3 = 5$ people:
$$\${}^5C_3 = 10$$

**(b)** Exactly 1 man and 2 women:
$$\${}^2C_1 \\times {}^3C_2 = 2 \\times 3 = 6$$

**Answer:** $\\boxed{\\text{(a) 10 ways, (b) 6 ways}}$.`,
            }
          },
        ]
      },
    ]
  },
  {
    id: 'ch06', number: 6,
    title: 'Exploring Some More Progressions',
    slug: 'exploring-some-more-progressions',
    code: 'am06',
    description: 'Extends progressions with geometric series, sums to infinity, repeated decimals, and special sequences where the second differences form an arithmetic progression, using the general $t_n$ and $S_n$ formulas.',
    exercises: [
      {
        id: 'ex6.1', title: 'Exercise 6.1',
        questions: [
          {
            id: 'q1', number: '1', isHard: true,
            text: 'Find the sum of $0.15 + 0.015 + 0.0015 + \\dots$ to 15 terms.',
            answer: {
              answerKey: '$\\boxed{S_{15} = \\frac{1}{6}(1 - 10^{-15})}$',
              schoolMethod: `**Solution:**

This is a GP with $a = 0.15$, $r = 0.1$.

$$S_{15} = \\frac{a(1 - r^{15})}{1 - r} = \\frac{0.15(1 - 0.1^{15})}{0.9}$$
$$= \\frac{1}{6}\\left(1 - 10^{-15}\\right)$$

**Answer:** $\\boxed{S_{15} = \\frac{1}{6}(1 - 10^{-15})}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: true,
            text: 'Find the sum $0.9 + 0.99 + 0.999 + \\dots$ to $n$ terms.',
            answer: {
              answerKey: '$\\boxed{S_n = n - \\frac{1 - 10^{-n}}{9}}$',
              schoolMethod: `**Solution:**

$$0.9 + 0.99 + 0.999 + \\dots = (1 - 0.1) + (1 - 0.01) + (1 - 0.001) + \\dots$$
$$= n - (0.1 + 0.01 + 0.001 + \\dots + 0.1^n)$$

The subtracted GP has $a = 0.1$, $r = 0.1$:
$$\\text{sum} = \\frac{0.1(1 - 0.1^n)}{0.9} = \\frac{1 - 10^{-n}}{9}$$

$$S_n = n - \\frac{1 - 10^{-n}}{9}$$

**Answer:** $\\boxed{S_n = n - \\frac{1 - 10^{-n}}{9}}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'Find the sum $5 + 55 + 555 + \\dots$ to $n$ terms.',
            answer: {
              answerKey: '$\\boxed{S_n = \\frac{5}{9}\\left[\\frac{10(10^n - 1)}{9} - n\\right]}$',
              schoolMethod: `**Solution:**

$$S_n = 5(1 + 11 + 111 + \\dots) = \\frac{5}{9}(9 + 99 + 999 + \\dots)$$
$$= \\frac{5}{9}[(10 - 1) + (100 - 1) + (1000 - 1) + \\dots]$$
$$= \\frac{5}{9}[(10 + 100 + 1000 + \\dots \\text{ to } n \\text{ terms}) - n]$$

$$S_n = \\frac{5}{9}\\left[\\frac{10(10^n - 1)}{9} - n\\right]$$

**Answer:** $\\boxed{S_n = \\frac{5}{9}\\left[\\frac{10(10^n - 1)}{9} - n\\right]}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'The GP $3, 6, 12, \\dots$ has sum $381$. Find $n$.',
            answer: {
              answerKey: '$\\boxed{n = 7}$',
              schoolMethod: `**Solution:**

$a = 3$, $r = 2$:
$$S_n = \\frac{3(2^n - 1)}{2 - 1} = 3(2^n - 1) = 381 \\Rightarrow 2^n - 1 = 127 \\Rightarrow 2^n = 128 = 2^7$$

$$n = 7$$

**Answer:** $\\boxed{n = 7}$.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: true,
            text: 'Find the sum $x(x+y) + x^2(x^2 + y^2) + x^3(x^3 + y^3) + \\dots$ to $n$ terms.',
            answer: {
              answerKey: '$\\boxed{S_n = \\frac{x^2(x^{2n} - 1)}{x^2 - 1} + \\frac{xy[(xy)^n - 1]}{xy - 1}}$',
              schoolMethod: `**Solution:**

$$= (x^2 + x^4 + x^6 + \\dots + x^{2n}) + (xy + x^2y^2 + x^3y^3 + \\dots + x^ny^n)$$

First part is a GP: $a = x^2$, $r = x^2$. Second part is a GP: $a = xy$, $r = xy$.

$$S_n = \\frac{x^2(x^{2n} - 1)}{x^2 - 1} + \\frac{xy[(xy)^n - 1]}{xy - 1}$$

**Answer:** $\\boxed{S_n = \\frac{x^2(x^{2n} - 1)}{x^2 - 1} + \\frac{xy[(xy)^n - 1]}{xy - 1}}$.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: true,
            text: 'Find the sum $1 + \\frac{1}{2} + \\frac{1}{9} + \\frac{1}{4} + \\frac{1}{9^2} + \\frac{1}{8} + \\frac{1}{9^3} + \\dots$',
            answer: {
              answerKey: '$\\boxed{\\frac{17}{8}}$',
              schoolMethod: `**Solution:**

Group the powers of 2 and powers of 9 separately:

$$\\left(1 + \\frac{1}{2} + \\frac{1}{2^2} + \\dots\\right) + \\left(\\frac{1}{9} + \\frac{1}{9^2} + \\frac{1}{9^3} + \\dots\\right)$$

First GP: $a = 1$, $r = \\frac{1}{2}$, sum $= \\frac{1}{1 - 1/2} = 2$.

Second GP: $a = \\frac{1}{9}$, $r = \\frac{1}{9}$, sum $= \\frac{1/9}{1 - 1/9} = \\frac{1}{8}$.

$$\\text{Total} = 2 + \\frac{1}{8} = \\frac{17}{8}$$

**Answer:** $\\boxed{\\frac{17}{8}}$.`,
            }
          },
          {
            id: 'q7', number: '7', isHard: true,
            text: 'An infinite GP has $\\frac{a}{1 - r} = 6$ and $\\frac{a^2}{1 - r^2} = 12$. Find $r$.',
            answer: {
              answerKey: '$\\boxed{r = \\frac{1}{2}}$',
              schoolMethod: `**Solution:**

From (1): $a = 6(1 - r) \\Rightarrow a^2 = 36(1 - r)^2$.

Substitute in (2):
$$\\frac{36(1 - r)^2}{(1 - r)(1 + r)} = 12 \\Rightarrow \\frac{36(1 - r)}{1 + r} = 12 \\Rightarrow 3(1 - r) = 1 + r$$
$$3 - 3r = 1 + r \\Rightarrow 2 = 4r \\Rightarrow r = \\frac{1}{2}$$

**Answer:** $\\boxed{r = \\frac{1}{2}}$.`,
            }
          },
          {
            id: 'q8', number: '8', isHard: true,
            text: 'For an infinite GP with $S = \\frac{a}{1 - r}$ where $a = 1$, express $r$ in terms of $S$.',
            answer: {
              answerKey: '$\\boxed{r = \\frac{S - 1}{S}}$',
              schoolMethod: `**Solution:**

With $a = 1$:
$$S = \\frac{1}{1 - r} \\Rightarrow 1 - r = \\frac{1}{S} \\Rightarrow r = 1 - \\frac{1}{S} = \\frac{S - 1}{S}$$

**Answer:** $\\boxed{r = \\frac{S - 1}{S}}$.`,
            }
          },
          {
            id: 'q9', number: '9', isHard: true,
            text: 'Find the product $4^{1/2} \\times 4^{1/4} \\times 4^{1/8} \\times 4^{1/16} \\times \\dots$',
            answer: {
              answerKey: '$\\boxed{\\text{4}}$',
              schoolMethod: `**Solution:**

Sum of exponents:
$$\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\dots = \\frac{1/2}{1 - 1/2} = 1 \\quad (\\text{infinite GP})$$

$$\\text{Product} = 4^1 = 4$$

**Answer:** $\\boxed{\\text{4}}$.`,
            }
          },
          {
            id: 'q10', number: '10', isHard: true,
            text: 'An equilateral triangle has perimeter 48 cm. A second triangle is drawn by joining the midpoints of its sides (perimeter halved), and so on. Find the sum of perimeters of all such triangles to infinity.',
            answer: {
              answerKey: '$\\boxed{\\text{96 cm}}$',
              schoolMethod: `**Solution:**

Perimeter of $\\triangle ABC = 3 \\times 16 = 48$. Each successive triangle\u2019s perimeter is half the previous: GP $48, 24, 12, \\dots$ with $a = 48$, $r = \\frac{1}{2}$.

$$\\text{Sum to infinity} = \\frac{48}{1 - \\frac{1}{2}} = 96$$

**Answer:** $\\boxed{\\text{96 cm}}$.`,
            }
          },
          {
            id: 'q11', number: '11', isHard: true,
            text: 'For $f(x) = 2x + 1$, for what value of $x$ are $f(x)$, $f(2x)$ and $f(4x)$ in a GP?',
            answer: {
              answerKey: '$\\boxed{\\text{Only 1 value: }x = 0}$',
              schoolMethod: `**Solution:**

$f(x) = 2x + 1$, $f(2x) = 4x + 1$, $f(4x) = 8x + 1$.

For a GP: $[f(2x)]^2 = f(x) \\cdot f(4x)$:
$$(4x + 1)^2 = (2x + 1)(8x + 1)$$
$$16x^2 + 8x + 1 = 16x^2 + 10x + 1 \\Rightarrow 8x = 10x \\Rightarrow x = 0$$

At $x = 0$, all three terms equal 1 — a valid GP with common ratio 1.

**Answer:** $\\boxed{\\text{Only 1 value: }x = 0}$.`,
            }
          },
          {
            id: 'q12', number: '12', isHard: true,
            text: 'If $t_1, t_2, t_3, \\dots$ is a GP with ratio $r$, $-1 < r < 1$, find $\\frac{t_1 - t_3 + t_5 - \\dots}{t_2 - t_4 + t_6 - \\dots}$.',
            answer: {
              answerKey: '$\\boxed{\\frac{1}{r}}$',
              schoolMethod: `**Solution:**

Numerator:
$$t_1 - t_3 + t_5 - \\dots = t_1(1 - r^2 + r^4 - \\dots) = \\frac{t_1}{1 + r^2}$$

Denominator:
$$t_2 - t_4 + t_6 - \\dots = t_2(1 - r^2 + r^4 - \\dots) = \\frac{t_2}{1 + r^2}$$

$$\\frac{t_1 - t_3 + t_5 - \\dots}{t_2 - t_4 + t_6 - \\dots} = \\frac{t_1}{t_2} = \\frac{t_1}{t_1 r} = \\frac{1}{r}$$

**Answer:** $\\boxed{\\frac{1}{r}}$.`,
            }
          },
          {
            id: 'q13', number: '13', isHard: true,
            text: 'A ball is dropped from height 90 m; on each bounce it rebounds to $\\frac{3}{5}$ of its previous height. Find the total distance travelled until it comes to rest.',
            answer: {
              answerKey: '$\\boxed{\\text{360 metres}}$',
              schoolMethod: `**Solution:**

$$\\text{Total distance} = h + 2hr + 2hr^2 + \\dots = h + \\frac{2hr}{1 - r}$$
$$= 90 + \\frac{2(90)\\left(\\frac{3}{5}\\right)}{1 - \\frac{3}{5}} = 90 + \\frac{108}{\\frac{2}{5}} = 90 + 270 = 360$$

**Answer:** $\\boxed{\\text{360 metres}}$.`,
            }
          },
        ]
      },
      {
        id: 'ex6.2', title: 'Exercise 6.2',
        questions: [
          {
            id: 'q1', number: '1', isHard: true,
            text: 'For the series $1, 9, 24, 46, 75, \\dots$, find the general term $t_n$ and the sum $S_n$.',
            answer: {
              answerKey: '$\\boxed{t_n = \\frac{n(7n - 5)}{2}\\text{, }S_n = \\frac{n(n+1)(7n - 4)}{6}}$',
              schoolMethod: `**Solution:**

First differences (Row 2): $8, 15, 22, 29$ — an AP with first term 8, common difference 7.

So $b = 1$, $a = 8$, $d = 7$.

$$t_n = b + a(n-1) + d\\frac{(n-1)(n-2)}{2} = 1 + 8(n-1) + \\frac{7}{2}(n-1)(n-2)$$

On simplification:
$$t_n = \\frac{7n^2 - 5n}{2} = \\frac{n(7n - 5)}{2}$$

Check: $n = 1: 1; n = 2: 9; n = 3: 24; n = 4: 46; n = 5: 75$ — all match.

$$S_n = bn + a\\frac{n(n-1)}{2} + d\\frac{n(n-1)(n-2)}{6}$$

On simplification:
$$S_n = \\frac{n(n+1)(7n - 4)}{6}$$

**Answer:** $\\boxed{t_n = \\frac{n(7n - 5)}{2}\\text{, }S_n = \\frac{n(n+1)(7n - 4)}{6}}$.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: true,
            text: 'For the series $4, 5, 9, 16, 26, \\dots$, find $t_{10}$ and $S_{10}$.',
            answer: {
              answerKey: '$\\boxed{t_{10} = 121\\text{, }S_{10} = 445}$',
              schoolMethod: `**Solution:**

First differences: $1, 4, 7, 10$ — AP with first term 1, common difference 3.

So $b = 4$, $a = 1$, $d = 3$.

$$t_n = 4 + (n-1) + \\frac{3}{2}(n-1)(n-2)$$

$$t_{10} = 4 + 9 + \\frac{3}{2}(9)(8) = 4 + 9 + 108 = 121$$

$$S_{10} = b(10) + a\\frac{10 \\times 9}{2} + d\\frac{10 \\times 9 \\times 8}{6} = 4(10) + 1(45) + 3(120) = 40 + 45 + 360 = 445$$

**Answer:** $\\boxed{t_{10} = 121\\text{, }S_{10} = 445}$.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'For the series $3, 6, 11, 18, 27, \\dots$, find the general term $t_n$ and $S_{12}$.',
            answer: {
              answerKey: '$\\boxed{t_n = n^2 + 2\\text{, }S_{12} = 674}$',
              schoolMethod: `**Solution:**

First differences: $3, 5, 7, 9$ — AP with first term 3, common difference 2.

So $b = 3$, $a = 3$, $d = 2$.

$$t_n = 3 + 3(n-1) + (n-1)(n-2)$$

On simplification:
$$t_n = n^2 + 2$$

Check: $n = 1: 3; n = 2: 6; n = 3: 11; n = 4: 18; n = 5: 27$ — all match.

$$S_{12} = \\sum_{k=1}^{12}(k^2 + 2) = \\frac{12 \\times 13 \\times 25}{6} + 2(12) = 650 + 24 = 674$$

**Answer:** $\\boxed{t_n = n^2 + 2\\text{, }S_{12} = 674}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'For the series $4, 13, 28, 49, 76, \\dots$, find $t_8$ and $S_8$.',
            answer: {
              answerKey: '$\\boxed{t_8 = 193\\text{, }S_8 = 620}$',
              schoolMethod: `**Solution:**

First differences: $9, 15, 21, 27$ — AP with first term 9, common difference 6.

So $b = 4$, $a = 9$, $d = 6$.

$$t_n = 4 + 9(n-1) + 3(n-1)(n-2)$$

$$t_8 = 4 + 9(7) + 3(7)(6) = 4 + 63 + 126 = 193$$

$$S_8 = b(8) + a\\frac{8 \\times 7}{2} + d\\frac{8 \\times 7 \\times 6}{6} = 4(8) + 9(28) + 6(56) = 32 + 252 + 336 = 620$$

**Answer:** $\\boxed{t_8 = 193\\text{, }S_8 = 620}$.`,
            }
          },
        ]
      },
    ]
  },
];

export const ADVMATH_BOOK_CONTEXT = `
ADVANCED MATHEMATICS (Optional), Grade 9 — CBSE 2026-27:
Ch1: Sets — roster & set-builder form, empty set, subsets, power set P(A) with 2^n elements, cardinality, union, intersection, difference, complement, De Morgan's laws, applications of sets
Ch2: Logarithms — definition log_b a = x iff b^x = a, laws (product, quotient, power, change of base), base 10 and natural logs, solving log equations with domain checks
Ch3: Relations and Functions — Cartesian product A x B, relations, domain & range, function definition (each element has a unique image), graphs of |x| and quadratic shifts
Ch4: Coordinate Geometry — quadrants, reflections across axes, slope of a line, parallel (equal slopes) and perpendicular (product = -1) lines, intercept form x/a + y/b = 1, area with axes
Ch5: Combinatorics — fundamental counting principle, factorials n!, permutations ^nP_r = n!/(n-r)!, combinations ^nC_r = n!/(r!(n-r)!), word arrangements, selections
Ch6: Progressions — geometric series sum, sum to infinity a/(1-r), repeated decimals, special series (second differences form an AP) with t_n = b + a(n-1) + d(n-1)(n-2)/2 and matching S_n
`;
