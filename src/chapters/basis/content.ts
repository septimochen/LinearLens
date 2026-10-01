export const notes = [
  {
    title: "Scale the pieces. Add the steps.",
    text: "A linear combination multiplies each vector by a scalar and adds the results. Negative coefficients walk backward; zero leaves a piece out. The destination depends on both the generators and the coefficients.",
    formula: "\\mathbf r=a\\mathbf u+b\\mathbf v",
  },
  {
    title: "Span is every place you could reach.",
    text: "Span allows all real coefficients, not just the bounded sliders in this lab. Two nonparallel directions reach the whole plane. Parallel generators reach a line; two zero vectors reach only the origin.",
    formula: "\\operatorname{span}(u,v)=\\{au+bv:a,b\\in\\mathbb R\\}",
  },
  {
    title: "Independence means no redundant direction.",
    text: "The pair is linearly independent if the only way to combine it into zero is to set both coefficients to zero. A zero vector or a parallel pair is dependent: one generator adds no new direction.",
    formula: "au+bv=0\\;\\Longrightarrow\\;a=b=0",
  },
  {
    title: "A basis spans, without redundancy.",
    text: "A basis of the plane is a linearly independent pair that spans it. Every vector then has exactly one pair of coordinates in that basis. The same destination can have different coordinates when you choose a different basis.",
    formula: "(x,y)=x(1,0)+y(0,1)",
  },
];
export const experiments = [
  {
    title: "Reach the target",
    text: "With the starting generators, find a and b that land at (1, 3). Can you reach it using only positive steps?",
  },
  {
    title: "Lose a direction",
    text: "Choose “One line.” Change both coefficients. Which destinations remain impossible?",
  },
  {
    title: "One vector is enough for a line",
    text: "Set one generator to zero. How does the span depend on the other? Then make both zero.",
  },
  {
    title: "Keep the destination, change the recipe",
    text: "Reach a point with the starting generators. Switch to the standard basis and find new coefficients for the same point.",
  },
];
