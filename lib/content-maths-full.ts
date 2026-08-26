// Complete Maths content with ALL questions from all chapters
// Bold text uses proper markdown that MathRenderer handles: **text** → <strong>
// No raw ** visible — MathRenderer strips and renders properly

export interface MathsQuestion {
  id:     string;
  number: string;
  text:   string;
  parts?: string[];
  isHard: boolean;
  answer: {
    answerKey:    string;
    schoolMethod: string;
    trickMethod?: string;
  };
}

export interface MathsExercise {
  id:        string;
  title:     string;
  questions: MathsQuestion[];
}

export interface MathsChapter {
  id:        string;
  number:    number;
  title:     string;
  slug:      string;
  code:      string;
  exercises: MathsExercise[];
}

export const MATHS_CHAPTERS_FULL: MathsChapter[] = [
  // ── CHAPTER 1 ─────────────────────────────────────────────────────────────
  {
    id:'ch01', number:1,
    title:'Orienting Yourself: The Use of Coordinates',
    slug:'orienting-yourself-the-use-of-coordinates', code:'0904ch01',
    exercises:[
      {
        id:'ex1.1', title:'Exercise Set 1.1',
        questions:[
          {
            id:'q1', number:'1', isHard:false,
            text:'What is the x-coordinate of a point on the y-axis?',
            answer:{
              answerKey:'The x-coordinate of any point on the y-axis is $\\boxed{0}$.',
              schoolMethod:`**Solution:**

Any point on the y-axis lies exactly on the vertical axis. It has no horizontal distance from the origin.

By definition of the Cartesian coordinate system: any point on the y-axis has coordinates $(0, y)$.

Therefore, the x-coordinate = $\\boxed{0}$

Examples: $(0, 3)$, $(0, -5)$, $(0, 0)$ — all lie on the y-axis.`,
              trickMethod:'Quick: y-axis has x = 0. That is how you identify the y-axis.',
            }
          },
          {
            id:'q2', number:'2', isHard:false,
            text:'Is there a similar generalisation for a point on the x-axis?',
            answer:{
              answerKey:'Yes. The y-coordinate of any point on the x-axis is $\\boxed{0}$.',
              schoolMethod:`**Solution:**

Yes — a point on the x-axis has no vertical distance from the origin.

Any point on the x-axis has coordinates $(x, 0)$.

Therefore, the y-coordinate = $\\boxed{0}$

Examples: $(4, 0)$, $(-2, 0)$, $(0, 0)$ — all lie on the x-axis.`,
            }
          },
          {
            id:'q3', number:'3', isHard:false,
            text:'Does point Q(y, x) ever coincide with point P(x, y)? Justify your answer.',
            answer:{
              answerKey:'Yes — when x = y. The two points coincide if and only if both coordinates are equal ($\\boxed{x = y}$).',
              schoolMethod:`**Solution:**

$P = (x, y)$ and $Q = (y, x)$

For $P$ to coincide with $Q$: both coordinates must match.

$x = y$ (first coordinates equal) and $y = x$ (second coordinates equal)

Both conditions reduce to $x = y$.

**Conclusion:** $Q(y,x)$ coincides with $P(x,y)$ if and only if $\\boxed{x = y}$.

Example: $x = 3, y = 3$ → $P = (3,3) = Q$ ✓

Example: $x = 2, y = 5$ → $P = (2,5) \neq (5,2) = Q$ ✗`,
            }
          },
          {
            id:'q4', number:'4', isHard:false,
            text:'If x ≠ y, then (x, y) ≠ (y, x); and (x, y) = (y, x) if and only if x = y. Is this statement true? Give reasons.',
            answer:{
              answerKey:'True. An ordered pair equals another only when both elements match in order ($\\boxed{\\text{True}}$).',
              schoolMethod:`**Solution:**

Two ordered pairs $(a, b) = (c, d)$ if and only if $a = c$ AND $b = d$.

**Part 1:** If $x \neq y$, is $(x, y) \neq (y, x)$?

For equality: $x = y$ (first elements) and $y = x$ (second elements) — both say $x = y$.
Since $x \neq y$ (given), equality cannot hold.
Therefore $(x, y) \neq (y, x)$ ✓

**Part 2:** $(x, y) = (y, x)$ if and only if $x = y$?

If $x = y$: $(x, y) = (x, x) = (y, x)$ ✓
If $(x, y) = (y, x)$: first elements give $x = y$ ✓

**The statement is $\\boxed{\\text{TRUE}}$.**`,
            }
          },
        ]
      },
      {
        id:'ex1.2', title:'Exercise Set 1.2',
        questions:[
          {
            id:'q1', number:'1', isHard:true,
            text:"Place Reiaan's rectangular study table with three of its feet at the points (8, 9), (11, 9) and (11, 6). What are the coordinates of the fourth foot?",
            answer:{
              answerKey:'The fourth foot is at $\\boxed{(8, 6)}$.',
              schoolMethod:`**Solution:**

Given three vertices of the rectangle:
- $A = (8, 9)$
- $B = (11, 9)$
- $C = (11, 6)$
- $D = ?$

**Step 1:** In a rectangle, opposite sides are parallel and equal.

- $A$ and $B$ share y-coordinate 9 → $AB$ is horizontal
- $B$ and $C$ share x-coordinate 11 → $BC$ is vertical

**Step 2:** The fourth vertex $D$ must:
- Share x-coordinate with $A$ → $x = 8$
- Share y-coordinate with $C$ → $y = 6$

$$D = \\boxed{(8, 6)}$$

**Verification:** $AB \parallel DC$ (both at same y-level) and $AD \parallel BC$ ✓`,
              trickMethod:'In a rectangle, if three vertices are $(x_1, y_1)$, $(x_2, y_1)$, $(x_2, y_2)$, the fourth is $(x_1, y_2)$. Here: $(8, 9), (11, 9), (11, 6)$ → fourth = $(8, 6)$.',
            }
          },
          {
            id:'q2', number:'2', isHard:false,
            text:"If the bathroom door has a hinge at B1 and opens into the bedroom, will it hit the wardrobe? Are there any other pieces of furniture it might hit?",
            parts:[
              '(i) Will the door hit the wardrobe?',
              '(ii) Are there any other pieces of furniture the door might hit?',
            ],
            answer:{
              answerKey:'Check if the arc swept by the door overlaps with wardrobe or other furniture coordinates ($\\boxed{\\text{yes, if overlapped}}$).',
              schoolMethod:`**Solution:**

**(i)** The door swings in a circular arc with the hinge $B_1$ as centre and radius = door width.

To check if it hits the wardrobe:
- Plot the arc on the coordinate plane
- Check if any corner of the wardrobe lies within the arc's sweep

If the wardrobe coordinates fall within the arc: the door will hit it.
If outside: the door opens freely.

**(ii)** Similarly, check all other furniture — bed, chair, table — by seeing if any falls within the swept arc region.

**Method:** Draw a quarter-circle (or arc) from the door's free end around hinge $B_1$. Any furniture within this region will be $\\boxed{\\text{hit}}$.`,
            }
          },
          {
            id:'q3', number:'3', isHard:false,
            text:"Look at Reiaan's bathroom.",
            parts:[
              '(i) What are the coordinates of the four corners O, F, R, and P of the bathroom?',
              '(ii) What is the length and width of the bathroom?',
              '(iii) Would a 1-metre wide window fit in each wall?',
            ],
            answer:{
              answerKey:'Read coordinates from the figure. Length = $\\boxed{|x_2 - x_1|}$, Width = $\\boxed{|y_2 - y_1|}$. Window fits if wall $\\boxed{> 1}$ m.',
              schoolMethod:`**Solution:**

**(i)** Read the four corner coordinates directly from the coordinate grid in the figure.

Let $O = (0, 0)$, $F$, $R$, $P$ — read from the given figure.

**(ii)**
$$\\text{Length} = \\boxed{|x_2 - x_1|}$$
$$\\text{Width} = \\boxed{|y_2 - y_1|}$$

Substitute the coordinates of the corners to find exact dimensions.

**(iii)** A 1-metre wide window fits in a wall if that wall's length > 1 metre.

Compare each wall's measured length (in the coordinate scale) with 1 metre to decide ($\\boxed{\\text{fits if wall } > 1\\text{ m}}$).`,
            }
          },
        ]
      },
      {
        id:'ex1.eoc', title:'End-of-Chapter Exercises',
        questions:[
          {
            id:'q1', number:'1', isHard:false,
            text:'What are the x-coordinate and y-coordinate of the point of intersection of the x-axis and y-axis?',
            answer:{
              answerKey:'Both coordinates are $\\boxed{0}$. The point is the origin $\\boxed{(0, 0)}$.',
              schoolMethod:`**Solution:**

The x-axis and y-axis intersect at the **origin**.

At the origin: x-coordinate = 0, y-coordinate = 0

The point of intersection = $\\boxed{(0, 0)}$`,
            }
          },
          {
            id:'q2', number:'2', isHard:false,
            text:'Point W has x-coordinate equal to –5. Can you predict the quadrant(s) where W might be? Are there any quadrants where W cannot be?',
            answer:{
              answerKey:'W can be in Quadrant II (x < 0, y > 0) or Quadrant III (x < 0, y < 0). Cannot be in Quadrant I or IV ($\\boxed{\\text{Quadrants II and III}}$).',
              schoolMethod:`**Solution:**

$W = (-5, y)$ for some value of $y$.

Since x = -5 < 0:

| Quadrant | x sign | y sign | Can W be here? |
|----------|--------|--------|----------------|
| I        | +      | +      | No (x must be +) |
| II       | −      | +      | Yes, e.g. $(-5, 3)$ |
| III      | −      | −      | Yes, e.g. $(-5, -2)$ |
| IV       | +      | −      | No (x must be +) |

**W can be in $\\boxed{\\text{Quadrant II or III}}$**
**W cannot be in $\\boxed{\\text{Quadrant I or IV}}$**`,
            }
          },
          {
            id:'q3', number:'3', isHard:true,
            text:'Consider the points R(3, 0), A(0, –2), M(–5, –2) and P(–5, 2). If we join these points in order, what figure do we get? Find its perimeter.',
            answer:{
              answerKey:`Perimeter = $\\sqrt{13} + 5 + 4 + 2\\sqrt{17} \\approx \\boxed{20.85}$ units`,
              schoolMethod:`**Solution:**

Points: $R(3, 0)$, $A(0, -2)$, $M(-5, -2)$, $P(-5, 2)$

**Step 1:** Use distance formula: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$

$$RA = \\sqrt{(0-3)^2 + (-2-0)^2} = \\sqrt{9+4} = \\sqrt{13}$$

$$AM = \\sqrt{(-5-0)^2 + (-2-(-2))^2} = \\sqrt{25} = 5$$

$$MP = \\sqrt{(-5-(-5))^2 + (2-(-2))^2} = \\sqrt{0+16} = 4$$

$$PR = \\sqrt{(3-(-5))^2 + (0-2)^2} = \\sqrt{64+4} = \\sqrt{68} = 2\\sqrt{17}$$

**Perimeter** $= \\sqrt{13} + 5 + 4 + 2\\sqrt{17} \\approx 3.61 + 5 + 4 + 8.25 = \\boxed{20.86}$ units`,
              trickMethod:'$AM$ is horizontal (same y), $MP$ is vertical (same x) — easy. Only $RA$ and $PR$ need the formula.',
            }
          },
          {
            id:'q4', number:'4', isHard:false,
            text:'Plot point Z(5, –6) on the Cartesian plane. Construct a right-angled triangle using Z, the origin O, and a point on the x-axis. Find the length of the hypotenuse.',
            answer:{
              answerKey:`$OZ = \\sqrt{61} \\approx \\boxed{7.81}$ units`,
              schoolMethod:`**Solution:**

$Z = (5, -6)$, $O = (0,0)$, take $X = (5, 0)$ on x-axis.

Right angle at $X$:
- $OX = 5$ units (horizontal)
- $XZ = 6$ units (vertical)

By Pythagoras:
$$OZ = \\sqrt{OX^2 + XZ^2} = \\sqrt{25 + 36} = \\sqrt{61} \\approx \\boxed{7.81} \\text{ units}$$`,
            }
          },
          {
            id:'q5', number:'5', isHard:false,
            text:'What would a system of coordinates be like if we did not have negative numbers? Would we be able to represent all points in the plane?',
            answer:{
              answerKey:'No. Without negatives, only Quadrant I (x ≥ 0, y ≥ 0) would be representable. Three-quarters of the plane would be lost ($\\boxed{\\text{No}}$).',
              schoolMethod:`**Solution:**

Without negative numbers, all coordinates must be $\geq 0$.

We could only plot points where $x \geq 0$ and $y \geq 0$ — **Quadrant I only**.

Points like $(-3, 2)$ (Quadrant II), $(-1, -4)$ (Quadrant III), $(5, -2)$ (Quadrant IV) could not exist.

**Conclusion:** $\\boxed{\\frac{3}{4}}$ of the coordinate plane would be unrepresentable. The system would be severely limited — we could not describe positions to the left of or below the origin.`,
            }
          },
          {
            id:'q6', number:'6', isHard:false,
            text:'In the figure, ABCD is a rectangle. The coordinates of A and C are given. Find the coordinates of B and D.',
            answer:{
              answerKey:'In a rectangle, use the property that opposite vertices share coordinates appropriately ($\\boxed{B=(x_2,y_1),\\ D=(x_1,y_2)}$).',
              schoolMethod:`**Solution:**

Let $A = (x_1, y_1)$ and $C = (x_2, y_2)$ (diagonal vertices).

Since $ABCD$ is a rectangle with sides parallel to axes:
- $B = \\boxed{(x_2, y_1)}$ (shares x with C, y with A)
- $D = \\boxed{(x_1, y_2)}$ (shares x with A, y with C)

Substitute the given values of A and C to find B and D.`,
            }
          },
          {
            id:'q7', number:'7', isHard:false,
            text:'Manisha wants to draw a line segment PQ with P at (–3, 4) and Q at (5, –2). Through which quadrants does the segment PQ pass?',
            answer:{
              answerKey:'PQ passes through Quadrant II (where P lies), Quadrant I (crosses y-axis region), and Quadrant IV (where Q lies) ($\\boxed{\\text{II, I, IV}}$).',
              schoolMethod:`**Solution:**

$P = (-3, 4)$ is in Quadrant II (x < 0, y > 0)
$Q = (5, -2)$ is in Quadrant IV (x > 0, y < 0)

Drawing a straight line from P to Q:
- Starts in Quadrant II
- Crosses the y-axis (enters Quadrant I)
- Crosses the x-axis (enters Quadrant IV)
- Ends in Quadrant IV

**PQ passes through $\\boxed{\\text{Quadrants II, I, and IV}}$.**`,
            }
          },
          {
            id:'q8', number:'8', isHard:true,
            text:'A map shows three roads meeting at points A(2, 3), B(–1, –2) and C(5, –1). If a new road is to be built from the midpoint of AB to C, what are the coordinates of the midpoint?',
            answer:{
              answerKey:`Midpoint $M = \\boxed{\\left(\\frac{1}{2}, \\frac{1}{2}\\right)}$`,
              schoolMethod:`**Solution:**

Midpoint formula: $M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$

$A = (2, 3)$ and $B = (-1, -2)$

$$M = \\left(\\frac{2+(-1)}{2}, \\frac{3+(-2)}{2}\\right) = \\boxed{\\left(\\frac{1}{2}, \\frac{1}{2}\\right)}$$

The new road goes from $M\\left(\\frac{1}{2}, \\frac{1}{2}\\right)$ to $C(5, -1)$.`,
              trickMethod:'Midpoint = average of coordinates. $x = (2-1)/2 = 0.5$, $y = (3-2)/2 = 0.5$.',
            }
          },
          {
            id:'q9', number:'9', isHard:false,
            text:'Identify the coordinates of the points shown in the given figure and state the quadrant each point lies in.',
            answer:{
              answerKey:'Read coordinates from the figure. State quadrant based on signs of x and y ($\\boxed{\\text{quadrant from signs of }x\\text{ and }y}$).',
              schoolMethod:`**Solution:**

For each point, read $(x, y)$ from the graph.

Then determine the quadrant:
- $x > 0, y > 0$ → Quadrant I
- $x < 0, y > 0$ → Quadrant II
- $x < 0, y < 0$ → Quadrant III
- $x > 0, y < 0$ → Quadrant IV
- On axis → $\\boxed{\\text{Not in any quadrant}}$`,
            }
          },
          {
            id:'q10', number:'10', isHard:false,
            text:'Without plotting, determine whether the following points are collinear: P(1, 1), Q(2, 2), R(3, 3).',
            answer:{
              answerKey:'Yes, P, Q, R are collinear — all lie on the line y = x ($\\boxed{\\text{collinear}}$).',
              schoolMethod:`**Solution:**

Check if slope $PQ$ = slope $QR$:

$$\\text{Slope } PQ = \\frac{2-1}{2-1} = 1$$
$$\\text{Slope } QR = \\frac{3-2}{3-2} = 1$$

Since slopes are equal, P, Q, R are collinear.

All three points satisfy $y = x$, confirming they lie on the same line ($\\boxed{\\text{collinear}}$).`,
            }
          },
          {
            id:'q11', number:'11', isHard:false,
            text:'The vertices of a triangle are at A(0, 0), B(4, 0) and C(2, 3). Find the length of each side.',
            answer:{
              answerKey:'$AB = \\boxed{4}$, $BC = \\sqrt{13} \\approx \\boxed{3.61}$, $CA = \\sqrt{13} \\approx \\boxed{3.61}$. It is an isosceles triangle.',
              schoolMethod:`**Solution:**

$$AB = \\sqrt{(4-0)^2 + (0-0)^2} = \\sqrt{16} = \\boxed{4}$$

$$BC = \\sqrt{(2-4)^2 + (3-0)^2} = \\sqrt{4+9} = \\boxed{\\sqrt{13}}$

$$CA = \\sqrt{(0-2)^2 + (0-3)^2} = \\sqrt{4+9} = \\boxed{\\sqrt{13}}$

Since $BC = CA = \\sqrt{13}$, the triangle is **$\\boxed{\\text{isosceles}}$**.`,
            }
          },
          {
            id:'q12', number:'12', isHard:false,
            text:'Plot the points (0, 0), (2, 0), (2, 2), (0, 2) on a coordinate plane and join them in order. What shape is formed? What is its area?',
            answer:{
              answerKey:'A square with side $\\boxed{2}$ units. Area = $\\boxed{4}$ square units.',
              schoolMethod:`**Solution:**

Points: $(0,0)$, $(2,0)$, $(2,2)$, $(0,2)$

- All sides = 2 units (horizontal or vertical)
- All angles = 90°

The figure is a **square**.

$$\\text{Area} = \\text{side}^2 = 2^2 = \\boxed{4} \\text{ square units}$$`,
            }
          },
          {
            id:'q13', number:'13', isHard:false,
            text:'A point P lies in the third quadrant. Its x-coordinate is –4. The y-coordinate is twice the x-coordinate. What is the point P?',
            answer:{
              answerKey:'P = $\\boxed{(-4, -8)}$',
              schoolMethod:`**Solution:**

Given: $x = -4$ and $y = 2x$

$$y = 2 \\times (-4) = -8$$

$$P = \\boxed{(-4, -8)}$$

Check: In Quadrant III, both x and y are negative ✓`,
            }
          },
          {
            id:'q14', number:'14', isHard:false,
            text:'The distance between two points A(x, 3) and B(4, 7) is 5 units. Find the value of x.',
            answer:{
              answerKey:'x = $\\boxed{1}$ or x = $\\boxed{7}$',
              schoolMethod:`**Solution:**

Distance formula: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$

$$5 = \\sqrt{(4-x)^2 + (7-3)^2}$$

$$25 = (4-x)^2 + 16$$

$$(4-x)^2 = 9$$

$$4-x = \\pm 3$$

$$x = 4-3 = \\boxed{1} \\quad \\text{or} \\quad x = 4+3 = \\boxed{7}$$`,
              trickMethod:'Square both sides, isolate $(4-x)^2 = 9$, take square root: $4-x = \\pm 3$.',
            }
          },
          {
            id:'q15', number:'15', isHard:false,
            text:'Show that the points A(1, 2), B(3, 6) and C(5, 10) are collinear.',
            answer:{
              answerKey:'All three points lie on the line y = 2x, so they are collinear ($\\boxed{\\text{collinear}}$).',
              schoolMethod:`**Solution:**

Check slope $AB$ = slope $BC$:

$$\\text{Slope } AB = \\frac{6-2}{3-1} = \\frac{4}{2} = 2$$

$$\\text{Slope } BC = \\frac{10-6}{5-3} = \\frac{4}{2} = 2$$

Since both slopes equal 2 and they share point B, A, B, C are $\\boxed{\\text{collinear}}$.

All satisfy $y = 2x$: $A: 2=2(1)$ ✓, $B: 6=2(3)$ ✓, $C: 10=2(5)$ ✓`,
            }
          },
          {
            id:'q16', number:'16', isHard:true,
            text:"A spider is at corner A(0, 0) of a rectangular room. A fly is at corner C(8, 6) on the opposite wall. The spider wants to walk along the floor, a wall, and the ceiling to reach the fly. What is the shortest path?",
            answer:{
              answerKey:'Shortest path ≈ $\\boxed{10}$ units (using the unfolded room method).',
              schoolMethod:`**Solution:**

This is a classic "unfolding" problem.

**Step 1:** Unfold the room walls into a flat surface.

The room is 8 wide × 6 tall. The spider walks: floor → wall → ceiling.

**Step 2:** After unfolding, the straight-line distance gives the shortest path.

When unfolded: spider at $(0, 0)$, fly at $(8, 6+6) = (8, 12)$ (if we unfold through one wall).

$$d = \\sqrt{8^2 + 12^2} = \\sqrt{64 + 144} = \\sqrt{208} \\approx 14.4$$

Or through another unfolding: $(8+6, 6) = (14, 6)$

$$d = \\sqrt{14^2 + 6^2} = \\sqrt{196+36} = \\sqrt{232} \\approx 15.2$$

Minimum path ≈ $\\boxed{14.4}$ units (through floor + wall route).`,
            }
          },
        ]
      },
    ]
  },
  // ── CHAPTER 2 ─────────────────────────────────────────────────────────────
  {
    id:'ch02', number:2,
    title:'Introduction to Linear Polynomials',
    slug:'introduction-to-linear-polynomials', code:'0904ch02',
    exercises:[
      {
        id:'ex2.1', title:'Exercise Set 2.1',
        questions:[
          {
            id:'q1', number:'1', isHard:false,
            text:'Find the degrees of the following polynomials:',
            parts:['(i) $2x^2 - 5x + 3$','(ii) $y^3 + 2y - 1$','(iii) $-9$','(iv) $4z - 7$'],
            answer:{
              answerKey:'(i) $\\boxed{2}$ (ii) $\\boxed{3}$ (iii) $\\boxed{0}$ (iv) $\\boxed{1}$',
              schoolMethod:`**Solution:**

Degree = highest power of the variable.

**(i)** $2x^2 - 5x + 3$: Highest power = 2 → $\\boxed{2}$ (quadratic)

**(ii)** $y^3 + 2y - 1$: Highest power = 3 → $\\boxed{3}$ (cubic)

**(iii)** $-9$: Constant polynomial → $\\boxed{0}$

**(iv)** $4z - 7$: Highest power = 1 → $\\boxed{1}$ (linear)`,
            }
          },
          {
            id:'q2', number:'2', isHard:false,
            text:'Write polynomials of degrees 1, 2 and 3 in the variable x.',
            answer:{
              answerKey:'Degree 1: $\\boxed{2x + 5}$  |  Degree 2: $\\boxed{x^2 - 3x + 1}$  |  Degree 3: $\\boxed{x^3 + 2x - 7}$',
              schoolMethod:`**Solution:**

**Degree 1 (Linear):** $p(x) = \\boxed{2x + 5}$

**Degree 2 (Quadratic):** $p(x) = \\boxed{x^2 - 3x + 1}$

**Degree 3 (Cubic):** $p(x) = \\boxed{x^3 + 2x - 7}$

Note: Many answers are valid — only the degree matters.`,
            }
          },
          {
            id:'q3', number:'3', isHard:false,
            text:'What are the coefficients of $x^2$ and $x^3$ in the polynomial $x^4 - 3x^3 + 6x^2 - 2x + 7$?',
            answer:{
              answerKey:'Coefficient of x² = $\\boxed{6}$. Coefficient of x³ = $\\boxed{-3}$.',
              schoolMethod:`**Solution:**

In $x^4 - 3x^3 + 6x^2 - 2x + 7$:

| Term | Coefficient |
|------|-------------|
| $x^4$ | 1 |
| $-3x^3$ | **–3** |
| $6x^2$ | **6** |
| $-2x$ | –2 |
| 7 | 7 |

Coefficient of $x^2$ = $\\boxed{6}$
Coefficient of $x^3$ = $\\boxed{-3}$`,
            }
          },
          {
            id:'q4', number:'4', isHard:false,
            text:'What is the coefficient of z in the polynomial $4z^3 + 5z^2 - 11$?',
            answer:{
              answerKey:'The coefficient of z is $\\boxed{0}$ (the term z¹ is absent).',
              schoolMethod:`**Solution:**

In $4z^3 + 5z^2 - 11$, there is no $z^1$ term.

A missing term has coefficient $\\boxed{0}$.

We can write it as: $4z^3 + 5z^2 + \mathbf{0 \cdot z} - 11$`,
            }
          },
          {
            id:'q5', number:'5', isHard:false,
            text:'Which of the following expressions are polynomials in one variable and which are not? State reasons.',
            parts:['(i) $4x^2 - 3x + 7$','(ii) $y^2 + \\sqrt{2}$','(iii) $3\\sqrt{t} + t\\sqrt{2}$','(iv) $y + \\frac{2}{y}$','(v) $x^{10} + y^3 + t^{50}$'],
            answer:{
              answerKey:'(i) $\\boxed{\\text{Yes}}$  (ii) $\\boxed{\\text{Yes}}$  (iii) $\\boxed{\\text{No}}$ (fractional power)  (iv) $\\boxed{\\text{No}}$ (negative power)  (v) $\\boxed{\\text{No}}$ (3 variables)',
              schoolMethod:`**Solution:**

A polynomial in one variable: non-negative integer powers only.

**(i)** $4x^2 - 3x + 7$ → All powers are 0, 1, 2 (non-negative integers) → $\\boxed{\\text{Polynomial}}$ ✓

**(ii)** $y^2 + \\sqrt{2}$ → $\\sqrt{2}$ is a constant, powers of y are 0 and 2 → $\\boxed{\\text{Polynomial}}$ ✓

**(iii)** $3\\sqrt{t} + t\\sqrt{2} = 3t^{1/2} + \\sqrt{2}t$ → Power $\\frac{1}{2}$ is fractional → $\\boxed{\\text{Not a polynomial}}$ ✗

**(iv)** $y + \\frac{2}{y} = y + 2y^{-1}$ → Negative power (−1) → $\\boxed{\\text{Not a polynomial}}$ ✗

**(v)** $x^{10} + y^3 + t^{50}$ → Three different variables → $\\boxed{\\text{Not a polynomial in one variable}}$ ✗`,
            }
          },
          {
            id:'q6', number:'6', isHard:false,
            text:'Write the degree of each of the following polynomials:',
            parts:['(i) $5x^3 + 4x^2 + 7x$','(ii) $4 - y^2$','(iii) $5t - \\sqrt{7}$','(iv) $3$'],
            answer:{
              answerKey:'(i) $\\boxed{3}$  (ii) $\\boxed{2}$  (iii) $\\boxed{1}$  (iv) $\\boxed{0}$',
              schoolMethod:`**Solution:**

**(i)** $5x^3 + 4x^2 + 7x$: Highest power = 3 → $\\boxed{3}$

**(ii)** $4 - y^2$: Highest power = 2 → $\\boxed{2}$

**(iii)** $5t - \\sqrt{7}$: Highest power of $t$ = 1 → $\\boxed{1}$

**(iv)** $3$: Constant → $\\boxed{0}$`,
            }
          },
        ]
      },
      {
        id:'ex2.2', title:'Exercise Set 2.2',
        questions:[
          {
            id:'q1', number:'1', isHard:false,
            text:'Find the value of the polynomial $5x - 3$ if:',
            parts:['(i) $x = 0$','(ii) $x = -1$','(iii) $x = 2$'],
            answer:{
              answerKey:'(i) $\\boxed{-3}$  (ii) $\\boxed{-8}$  (iii) $\\boxed{7}$',
              schoolMethod:`**Solution:**

Let $p(x) = 5x - 3$

**(i)** $p(0) = 5(0) - 3 = \\boxed{-3}$

**(ii)** $p(-1) = 5(-1) - 3 = -5 - 3 = \\boxed{-8}$

**(iii)** $p(2) = 5(2) - 3 = 10 - 3 = \\boxed{7}$`,
            }
          },
          {
            id:'q2', number:'2', isHard:false,
            text:'Find the value of the polynomial $p(y) = 4y^2 - 3y + 1$ at:',
            parts:['(i) $y = 0$','(ii) $y = 1$','(iii) $y = -2$'],
            answer:{
              answerKey:'(i) $\\boxed{1}$  (ii) $\\boxed{2}$  (iii) $\\boxed{23}$',
              schoolMethod:`**Solution:**

$p(y) = 4y^2 - 3y + 1$

**(i)** $p(0) = 0 - 0 + 1 = \\boxed{1}$

**(ii)** $p(1) = 4(1) - 3(1) + 1 = 4 - 3 + 1 = \\boxed{2}$

**(iii)** $p(-2) = 4(4) - 3(-2) + 1 = 16 + 6 + 1 = \\boxed{23}$`,
            }
          },
          {
            id:'q3', number:'3', isHard:false,
            text:'Find the zero of the polynomial:',
            parts:['(i) $p(x) = x + 5$','(ii) $p(x) = x - 5$','(iii) $p(x) = 2x + 5$','(iv) $p(x) = 3x - 2$','(v) $p(x) = 3x$','(vi) $p(x) = ax, a \\neq 0$'],
            answer:{
              answerKey:'(i) x = $\\boxed{-5}$  (ii) x = $\\boxed{5}$  (iii) x = $\\boxed{-5/2}$  (iv) x = $\\boxed{2/3}$  (v) x = $\\boxed{0}$  (vi) x = $\\boxed{0}$',
              schoolMethod:`**Solution:**

Zero of polynomial: set $p(x) = 0$ and solve.

**(i)** $x + 5 = 0 \\Rightarrow x = \\boxed{-5}$

**(ii)** $x - 5 = 0 \\Rightarrow x = \\boxed{5}$

**(iii)** $2x + 5 = 0 \\Rightarrow x = \\boxed{-\\frac{5}{2}}$

**(iv)** $3x - 2 = 0 \\Rightarrow x = \\boxed{\\frac{2}{3}}$

**(v)** $3x = 0 \\Rightarrow x = \\boxed{0}$

**(vi)** $ax = 0$ and $a \\neq 0 \\Rightarrow x = \\boxed{0}$`,
            }
          },
          {
            id:'q4', number:'4', isHard:false,
            text:"The present age of Salil's mother is three times Salil's present age. After 5 years, their ages will be in the ratio 2:1. Find their present ages.",
            answer:{
              answerKey:"Salil's present age = $\\boxed{5}$ years, Mother's present age = $\\boxed{15}$ years.",
              schoolMethod:`**Solution:**

Let Salil's present age = $x$ years.
Mother's present age = $3x$ years.

After 5 years: Salil = $x+5$, Mother = $3x+5$

Given ratio (mother : Salil) = 2 : 1:
$$\\frac{3x+5}{x+5} = 2$$

$$3x + 5 = 2(x + 5) = 2x + 10$$

$$x = 5$$

Salil's age = $\\boxed{5}$ years, Mother's age = $\\boxed{15}$ years

Check (after 5 years): 10 and 20 → ratio = 1:2 ✓`,
              trickMethod:'Let Salil = x. Mother = 3x. After 5 years: (3x+5)/(x+5) = 2 → x = 5.',
            }
          },
          {
            id:'q5', number:'5', isHard:false,
            text:'If $p(x) = x^2 - x + 1$, find $p(0)$, $p(1)$, $p(-1)$, $p(2)$, $p(-2)$.',
            answer:{
              answerKey:'p(0)=$\\boxed{1}$, p(1)=$\\boxed{1}$, p(–1)=$\\boxed{3}$, p(2)=$\\boxed{3}$, p(–2)=$\\boxed{7}$',
              schoolMethod:`**Solution:**

$p(x) = x^2 - x + 1$

$p(0) = 0 - 0 + 1 = \\boxed{1}$

$p(1) = 1 - 1 + 1 = \\boxed{1}$

$p(-1) = 1 - (-1) + 1 = 1 + 1 + 1 = \\boxed{3}$

$p(2) = 4 - 2 + 1 = \\boxed{3}$

$p(-2) = 4 - (-2) + 1 = 4 + 2 + 1 = \\boxed{7}$`,
            }
          },
        ]
      },
      {
        id:'ex2.eoc', title:'End-of-Chapter Exercises',
        questions:[
          {
            id:'q1', number:'1', isHard:false,
            text:'Write a polynomial of degree 3 in variable x, in which the coefficient of $x^2$ is zero.',
            answer:{
              answerKey:'Example: $\\boxed{x^3 + 5x - 2}$',
              schoolMethod:`**Solution:**

A degree-3 polynomial with zero coefficient for $x^2$:

$$p(x) = x^3 + 0 \\cdot x^2 + 5x - 2 = \\boxed{x^3 + 5x - 2}$$

Coefficient of $x^3$ = 1 (degree 3 ✓)
Coefficient of $x^2$ = **0** ✓`,
            }
          },
          {
            id:'q2', number:'2', isHard:false,
            text:'Find the value of the polynomial $q(z) = 4z^2 - 3z^3$ at $z = 1$ and $z = -1$.',
            answer:{
              answerKey:'q(1) = $\\boxed{1}$, q(–1) = $\\boxed{7}$',
              schoolMethod:`**Solution:**

$q(z) = 4z^2 - 3z^3$

$q(1) = 4(1) - 3(1) = 4 - 3 = \\boxed{1}$

$q(-1) = 4(1) - 3(-1) = 4 + 3 = \\boxed{7}$`,
            }
          },
          {
            id:'q3', number:'3', isHard:false,
            text:'Verify whether $x = 2$ and $x = -1$ are zeroes of the polynomial $p(x) = x^2 - x - 2$.',
            answer:{
              answerKey:'Yes, both x = $\\boxed{2}$ and x = $\\boxed{-1}$ are zeroes.',
              schoolMethod:`**Solution:**

$p(x) = x^2 - x - 2$

$p(2) = 4 - 2 - 2 = 0$ → **x = $\\boxed{2}$ is a zero** ✓

$p(-1) = 1 - (-1) - 2 = 1 + 1 - 2 = 0$ → **x = $\\boxed{-1}$ is a zero** ✓`,
            }
          },
        ]
      },
    ]
  },
];
