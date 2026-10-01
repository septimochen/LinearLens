export type AdvancedChapter = {
  number: number;
  title: string;
  subtitle: string;
  intuition: string;
  formula: string;
  notes: { title: string; text: string; formula: string }[];
  experiments: { title: string; text: string }[];
  summaryTitle: string;
  summary: string;
  labLabel?: string;
};
export const lessons: AdvancedChapter[] = [
  {
    number: 5,
    title: "Determinant",
    subtitle: "Area tells the story.",
    intuition:
      "Follow a unit square through a linear map. Its image is the parallelogram spanned by the matrix columns. The determinant measures its area with a sign that remembers the order of those columns.",
    formula: String.raw`\det\begin{pmatrix}a&b\\c&d\end{pmatrix}=ad-bc`,
    notes: [
      {
        title: "A square becomes a measurement.",
        text: "The original square has area one. The absolute determinant is the image’s area, and every other region has its area scaled by that same factor. The sign records orientation rather than a negative physical area.",
        formula: String.raw`\operatorname{area}(A\Omega)=|\det A|\operatorname{area}(\Omega)`,
      },
      {
        title: "Order gives area a sign.",
        text: "The standard ordered basis turns counterclockwise. A reflection reverses that orientation and has a negative determinant. Swapping two columns flips the sign; applying a quarter turn preserves it.",
        formula: String.raw`\det[\,v\ u\,]=-\det[\,u\ v\,]`,
      },
      {
        title: "Collapse makes area zero.",
        text: "When both columns lie on one line, the parallelogram flattens. A zero determinant means the map loses at least one direction, so no inverse can recover every input. In three dimensions, the determinant measures signed volume instead.",
        formula: String.raw`\det A=0\iff\text{columns are dependent}`,
      },
      {
        title: "Successive area factors multiply.",
        text: "Applying B and then A scales area twice. Their product has determinant det(A) det(B). A shear can have determinant one despite changing angles and lengths: area alone does not describe the whole map.",
        formula: String.raw`\det(AB)=\det A\det B`,
      },
    ],
    experiments: [
      {
        title: "Slide a column",
        text: "Choose Shear and change the upper-right entry. Notice that the shape changes while its signed area stays one.",
      },
      {
        title: "Cross a collapse",
        text: "Start at Identity and lower the bottom-right entry through zero to −1. Watch the square flatten and reopen with reversed orientation.",
      },
      {
        title: "Swap the columns",
        text: "For Double area, exchange the two columns by editing A. Predict the new area and sign before changing the inputs.",
      },
      {
        title: "Preserve area, change length",
        text: "Set diagonal entries to 2 and 0.5 with zero off-diagonal entries. Area returns to one, while each basis length changes.",
      },
    ],
    summaryTitle: "The determinant measures signed size change.",
    summary:
      "Its magnitude scales area, its sign tracks orientation, and zero signals lost directions. These three readings connect geometric shape to whether a system can have a unique solution.",
  },
  {
    number: 6,
    title: "Inverse & spaces",
    subtitle: "What can come back?",
    intuition:
      "Solving Ax = b asks which input lands at b. The column space is the set of reachable destinations. The null space contains inputs erased by the map. An inverse exists exactly when every destination has one preimage.",
    formula: String.raw`Ax=b,\qquad x=A^{-1}b\ \text{when }\det A\ne0`,
    notes: [
      {
        title: "An inverse reverses the whole map.",
        text: "Undoing one arrow is not enough. An inverse must recover every input, and its product with A in either order must be identity. For a square matrix this requires independent columns.",
        formula: String.raw`A^{-1}=\frac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}`,
      },
      {
        title: "Columns describe all destinations.",
        text: "Every output is a linear combination of columns. The column space can be the plane, a line, or the origin. Its dimension is the rank. A target outside this space has no preimage.",
        formula: String.raw`\operatorname{col}A=\{Ax:x\in\mathbb R^2\}`,
      },
      {
        title: "The kernel holds erased inputs.",
        text: "The null space, also called the kernel, lives in the input space. If An = 0, then adding n to any solution changes the input without changing its destination. The zero vector is always in the kernel.",
        formula: String.raw`A(x_0+tn)=Ax_0+tAn=b`,
      },
      {
        title: "Count kept and lost dimensions.",
        text: "In this two-dimensional input space, rank plus nullity equals two. Rank two gives a unique solution for every target. Rank one gives none or a whole line of solutions. The zero map gives none or the entire input plane.",
        formula: String.raw`\operatorname{rank}A+\dim\ker A=2`,
      },
    ],
    experiments: [
      {
        title: "Undo a shear",
        text: "Use Invertible shear and move b. Read x = A⁻¹b and verify that Ax always matches your target.",
      },
      {
        title: "Slide without moving the output",
        text: "Choose Many solutions. Move the null-direction slider and watch the dashed input move while Ax stays at b.",
      },
      {
        title: "Leave the image",
        text: "Choose No solution, then move b onto the x-axis. Why does the system change from impossible to infinitely many solutions?",
      },
      {
        title: "Erase everything",
        text: "Choose Zero map. Compare target zero with a nonzero target. The null space stays the whole plane, but solvability changes.",
      },
    ],
    summaryTitle: "Reachability and lost information decide the solution.",
    summary:
      "Column space determines whether a solution exists. Null space determines how many inputs share a destination. An invertible square map has full column space and only zero in its kernel.",
  },
  {
    number: 7,
    title: "Dot product",
    subtitle: "Measure alignment.",
    intuition:
      "The dot product compresses the relationship between two vectors into one number. It multiplies their lengths by the cosine of their angle. Equivalently, it measures the signed component of one vector along the other and scales it by that other vector’s length.",
    formula: String.raw`u\cdot v=u_xv_x+u_yv_y=\|u\|\|v\|\cos\theta`,
    notes: [
      {
        title: "Alignment has a sign.",
        text: "For two nonzero vectors, an acute angle gives a positive dot product, a right angle gives zero, and an obtuse angle gives a negative result. A zero vector also gives zero, but has no defined angle.",
        formula: String.raw`u\cdot v=0\iff u\perp v\quad(u,v\ne0)`,
      },
      {
        title: "Project onto a line.",
        text: "Projection keeps the part of v parallel to u. The remainder is perpendicular to u. Dividing by u’s squared length compensates for its scale; projection onto a zero direction is undefined.",
        formula: String.raw`\operatorname{proj}_u v=\frac{u\cdot v}{u\cdot u}u\quad(u\ne0)`,
      },
      {
        title: "A row can be a measurement.",
        text: "Fix u and treat the dot product as a map from vectors to scalars. This map respects addition and scaling. Its row matrix records how much each basis direction contributes to the measurement.",
        formula: String.raw`f(v)=\begin{pmatrix}u_x&u_y\end{pmatrix}v`,
      },
      {
        title: "Coordinates need the right geometry.",
        text: "Summing matching coordinate products measures the Euclidean dot product in an orthonormal basis. In an arbitrary basis B, the same physical dot product needs the Gram matrix BᵀB. Coordinates change; geometric alignment does not.",
        formula: String.raw`u\cdot v=[u]_B^T(B^TB)[v]_B`,
      },
    ],
    experiments: [
      {
        title: "Find a right angle",
        text: "Use Perpendicular, then drag v. Watch the sign change as v passes across a right angle with u.",
      },
      {
        title: "Look behind the origin",
        text: "Use Opposite. The projection points against u, and the dot product is negative.",
      },
      {
        title: "Scale the measuring arrow",
        text: "Double u without changing its direction. The dot product doubles; the projection of v onto its line stays in place.",
      },
      {
        title: "Remove the direction",
        text: "Use Zero direction. The lab keeps the dot product at zero and removes the undefined projection and angle.",
      },
    ],
    summaryTitle: "A dot product reads one vector along another.",
    summary:
      "It connects coordinates, lengths, angles, and projection. Holding one vector fixed creates a linear scalar measurement; the vectors perpendicular to it form that measurement’s kernel.",
  },
  {
    number: 8,
    title: "Cross product",
    subtitle: "Give area a direction.",
    labLabel: "INTERACTIVE 3D PROJECTION",
    intuition:
      "Two ordered vectors in three dimensions span a parallelogram. Their cross product points perpendicular to its plane. Its length is the parallelogram’s area, and the right-hand rule selects which of the two normal directions it takes.",
    formula: String.raw`u\times v=\begin{pmatrix}u_yv_z-u_zv_y\\u_zv_x-u_xv_z\\u_xv_y-u_yv_x\end{pmatrix}`,
    notes: [
      {
        title: "A normal carries an area.",
        text: "A perpendicular pair spans the largest area for fixed lengths. Parallel vectors span zero area, so their cross product is zero and has no normal direction. The lab’s projection distorts angles; numeric readouts use actual 3D components.",
        formula: String.raw`\|u\times v\|=\|u\|\|v\|\sin\theta`,
      },
      {
        title: "Order selects the normal.",
        text: "Curl the fingers of your right hand from u toward v; your thumb gives the normal direction. Swapping the inputs reverses the normal, leaving the area unchanged. In particular, e₁ crossed with e₂ gives e₃.",
        formula: String.raw`v\times u=-(u\times v),\qquad e_1\times e_2=e_3`,
      },
      {
        title: "Perpendicular in two ways.",
        text: "The resulting vector is orthogonal to each input. The coordinate formula builds exactly that property while preserving area and orientation. Zero remains orthogonal algebraically but has no direction.",
        formula: String.raw`u\cdot(u\times v)=v\cdot(u\times v)=0`,
      },
      {
        title: "Area extends to signed volume.",
        text: "Dotting a third vector with the normal multiplies base area by signed height. This scalar triple product equals the determinant whose columns are u, v, and w. In 2D, the determinant itself is a signed area scalar, not a 2D normal vector.",
        formula: String.raw`(u\times v)\cdot w=\det[\,u\ v\ w\,]`,
      },
    ],
    experiments: [
      {
        title: "Start in the xy-plane",
        text: "Choose XY plane. The normal lies on the z-axis. Set both nonzero components to one to make a unit normal.",
      },
      {
        title: "Tilt the plane",
        text: "Choose Tilted plane. Check both displayed dot products, even when the projected normal looks oblique to the input arrows.",
      },
      {
        title: "Reverse the order",
        text: "Swap u and v. Notice what happens to the normal and what stays the same about its length.",
      },
      {
        title: "Flatten the area",
        text: "Choose Parallel, then change one component of v. A small departure from parallel opens a small area.",
      },
    ],
    summaryTitle: "The cross product encodes oriented area in 3D.",
    summary:
      "Its magnitude is area, its direction is normal to both inputs, and input order sets its sign. Dotting that normal with a third vector turns area into signed volume.",
  },
  {
    number: 9,
    title: "Cross product maps",
    subtitle: "Fix one arrow. Transform the rest.",
    labLabel: "INTERACTIVE 3D PROJECTION",
    intuition:
      "Keep u fixed and vary v. The operation v ↦ u × v is now a linear transformation of three-dimensional space. Just as in the earlier matrix lessons, its columns are the images of the standard basis.",
    formula: String.raw`[u]_\times=\begin{pmatrix}0&-u_z&u_y\\u_z&0&-u_x\\-u_y&u_x&0\end{pmatrix}`,
    notes: [
      {
        title: "One fixed input gives one map.",
        text: "Crossing with a fixed u preserves sums and scalar multiplication in v. Varying u changes the map itself. The two-input operation is bilinear; it is not a linear map of the pair (u, v) jointly.",
        formula: String.raw`u\times(av+bw)=a(u\times v)+b(u\times w)`,
      },
      {
        title: "Read the three columns.",
        text: "Cross u with each standard basis vector to build the matrix. Its diagonal is zero and its transpose is its negative: it is skew-symmetric. Multiplying this matrix by v reproduces the cross product component by component.",
        formula: String.raw`[u]_\times=[\,u\times e_1\quad u\times e_2\quad u\times e_3\,]`,
      },
      {
        title: "One direction vanishes.",
        text: "For nonzero u, every input parallel to u maps to zero. Every output lies in the plane perpendicular to u, and the map reaches that whole plane. Thus the kernel has dimension one and the rank is two. With u zero, the whole map is zero.",
        formula: String.raw`\ker[u]_\times=\operatorname{span}(u),\quad \operatorname{im}[u]_\times=u^\perp\quad(u\ne0)`,
      },
      {
        title: "Turn and scale within a plane.",
        text: "On the plane perpendicular to nonzero u, crossing with u turns a vector by a quarter turn about u and scales its length by ‖u‖. Crossing twice gives a negative scaling there. The full 3D map has no inverse because its parallel direction was erased.",
        formula: String.raw`u\times(u\times v)=u(u\cdot v)-\|u\|^2v`,
      },
    ],
    experiments: [
      {
        title: "Reconstruct the matrix",
        text: "Keep u fixed and set v successively to (1,0,0), (0,1,0), and (0,0,1). Compare each output with the corresponding matrix column.",
      },
      {
        title: "Find the kernel",
        text: "Choose Parallel. Change v to another multiple of u, keeping both nonzero. The output remains zero.",
      },
      {
        title: "Scale the whole map",
        text: "Double every component of u. All matrix entries and all outputs double, but the image plane stays the same.",
      },
      {
        title: "Change the rank",
        text: "Use Zero u. Compare the null space and rank with the nonzero case, then restore one nonzero component.",
      },
    ],
    summaryTitle: "Fixing u makes cross product a matrix action.",
    summary:
      "The skew-symmetric matrix records three basis images. For nonzero u it loses the direction along u, reaches the perpendicular plane, and turns and scales vectors within that plane.",
  },
  {
    number: 10,
    title: "Cramer’s rule",
    subtitle: "Solve by comparing areas.",
    intuition:
      "Write b as x times the first column plus y times the second. Replacing a column with b builds a new parallelogram. Its signed area isolates one coefficient, because the part parallel to the other column contributes zero area.",
    formula: String.raw`x=\frac{\det[\,b\ a_2\,]}{\det A},\qquad y=\frac{\det[\,a_1\ b\,]}{\det A}`,
    notes: [
      {
        title: "A coefficient is an area ratio.",
        text: "Keep the second column fixed and substitute b for the first. The y contribution is parallel to the second column, so it contributes no area. The remaining signed area is x times the original area.",
        formula: String.raw`\det[\,x a_1+y a_2\quad a_2\,]=x\det A`,
      },
      {
        title: "Each unknown gets its own replacement.",
        text: "To recover y, replace the second column, preserving column order. Using signed determinants handles negative coefficients correctly. Physical areas alone would lose the sign of the solution.",
        formula: String.raw`\det[\,a_1\quad x a_1+y a_2\,]=y\det A`,
      },
      {
        title: "Division needs nonzero area.",
        text: "The rule applies to an invertible square system. If the original area is zero, the ratios are undefined. Zero replacement determinants do not distinguish many solutions from no solutions; return to column space and consistency.",
        formula: String.raw`\det A\ne0\implies\text{one unique solution}`,
      },
      {
        title: "A geometric formula, not a large-system algorithm.",
        text: "The same replacement rule works for square systems in higher dimensions with signed volume. Repeatedly computing determinants is inefficient for large problems; elimination or matrix factorizations are usually better numerical tools.",
        formula: String.raw`x_i=\frac{\det A_i}{\det A}`,
      },
    ],
    experiments: [
      {
        title: "Compare three shapes",
        text: "Choose Unique solution and cycle through Original, Replace column 1, and Replace column 2. Divide each replacement area by the original.",
      },
      {
        title: "Ask for a negative coefficient",
        text: "Move b to a destination requiring subtraction of one column. Observe the replacement area’s sign.",
      },
      {
        title: "Try two singular systems",
        text: "Compare Singular, reachable with Singular, unreachable. Both original areas vanish; the solution counts differ.",
      },
      {
        title: "Shrink the denominator",
        text: "Make the two columns nearly parallel without making them equal. Move b slightly and notice how strongly the solution can change.",
      },
    ],
    summaryTitle: "Signed replacement areas recover coordinates.",
    summary:
      "Cramer’s rule isolates one unknown at a time through determinant linearity. It needs a nonzero original determinant; singular systems require a separate reachability check.",
  },
  {
    number: 11,
    title: "Change of basis",
    subtitle: "Translate the same geometry.",
    intuition:
      "The arrow stays put while its coordinates change. A basis matrix B stores the new basis vectors in standard coordinates. Multiplying by B translates new coordinates into standard ones; multiplying by B⁻¹ translates back.",
    formula: String.raw`v=B[v]_B,\qquad [v]_B=B^{-1}v`,
    notes: [
      {
        title: "Coordinates are instructions.",
        text: "The numbers in [v]B tell you how much of each B column to combine. They are not the standard x and y components unless B is the standard basis. Changing B changes these instructions while keeping the physical arrow fixed.",
        formula: String.raw`v=\alpha b_1+\beta b_2=B\begin{pmatrix}\alpha\\\beta\end{pmatrix}`,
      },
      {
        title: "A basis must be independent.",
        text: "A pair of dependent columns cannot give every vector a unique coordinate description. B must be invertible. The lab disables coordinate translation when its columns fail to form a basis.",
        formula: String.raw`\det B\ne0`,
      },
      {
        title: "Translate a map at both ends.",
        text: "Start with B coordinates, translate to standard coordinates with B, apply A, then translate the output back with B⁻¹. Reading from right to left gives the conjugated matrix B⁻¹AB.",
        formula: String.raw`[A]_B=B^{-1}AB`,
      },
      {
        title: "A useful language simplifies the action.",
        text: "Choosing eigenvectors as a basis can make a matrix diagonal. This changes its coordinate representation while preserving the underlying linear map, determinant, and eigenvalues. Such a basis exists only when there are enough independent eigenvectors.",
        formula: String.raw`AB=B[A]_B,\qquad\det(B^{-1}AB)=\det A`,
      },
    ],
    experiments: [
      {
        title: "Keep the arrow still",
        text: "Use Sheared basis, then Rotated basis without changing v. Follow the new coordinates while the purple arrow stays in place.",
      },
      {
        title: "Verify the round trip",
        text: "Read [v]B and combine the two displayed B columns with those coefficients. You should return to v.",
      },
      {
        title: "Simplify a map",
        text: "Choose Eigenbasis. The standard map has off-diagonal entries; its B representation is diagonal.",
      },
      {
        title: "Break the language",
        text: "Choose Dependent columns. Which vectors remain reachable? Why can those vectors still lack unique coordinates?",
      },
    ],
    summaryTitle: "A basis changes the description of a map.",
    summary:
      "B converts basis coordinates to standard ones, and B⁻¹ converts back. For a map using the same basis at input and output, B⁻¹AB translates the full action without changing the geometry.",
  },
  {
    number: 12,
    title: "Eigenvectors",
    subtitle: "Directions that survive.",
    intuition:
      "Most vectors leave their original line under a map. An eigenvector is a nonzero vector whose image stays on that line: it is stretched, reversed, or sent to zero by a scalar called its eigenvalue.",
    formula: String.raw`Av=\lambda v,\qquad v\ne0`,
    notes: [
      {
        title: "A line can keep its direction.",
        text: "A positive eigenvalue stretches along the same direction. A negative one reverses it. Eigenvalue zero is allowed: a nonzero vector in the kernel is an eigenvector. The zero vector itself is excluded, because it satisfies the equation for every scalar.",
        formula: String.raw`Av-\lambda v=(A-\lambda I)v=0`,
      },
      {
        title: "Find scalars that make a collapse.",
        text: "A nonzero v can solve (A − λI)v = 0 only when that shifted matrix is singular. In 2D, this gives a quadratic equation using the trace and determinant. Its discriminant decides whether the eigenvalues are real.",
        formula: String.raw`\lambda^2-\operatorname{tr}(A)\lambda+\det A=0`,
      },
      {
        title: "A repeated value need not give two lines.",
        text: "A scalar matrix makes every nonzero vector an eigenvector. A shear can have the same repeated eigenvalue but only one eigenline. A quarter turn has complex eigenvalues and no real eigenvectors, so the real plane has no preserved line.",
        formula: String.raw`\begin{pmatrix}1&1\\0&1\end{pmatrix}:\quad\lambda=1,\quad\ker(A-I)=\operatorname{span}(e_1)`,
      },
      {
        title: "An eigenbasis makes iteration simple.",
        text: "If two independent real eigenvectors form B, its basis representation is diagonal. Repeated applications then scale each coordinate by a power of the corresponding eigenvalue. With only one real eigenline, this diagonal eigenbasis is unavailable.",
        formula: String.raw`A=B\Lambda B^{-1}\implies A^k=B\Lambda^k B^{-1}`,
      },
    ],
    experiments: [
      {
        title: "Find two lines",
        text: "Use Two stretches. Drag v to either coordinate axis and read its eigenvalue.",
      },
      {
        title: "Find a disappearing eigenvector",
        text: "Use Tilted eigenvectors and choose v = (1, −1). It is nonzero, yet its image is zero.",
      },
      {
        title: "Compare repeated values",
        text: "Compare Repeated, one line with Every direction. Both have repeated eigenvalues but different eigenspace dimensions.",
      },
      {
        title: "Leave the real plane",
        text: "Use Quarter turn. Every nonzero real arrow turns off its line; the lab reports the complex eigenvalue pair instead.",
      },
    ],
    summaryTitle: "Eigenvectors reveal a map’s preferred directions.",
    summary:
      "Eigenvalues tell how those nonzero vectors scale. A matrix may have two real eigenlines, one, every direction, or none. Enough independent eigenvectors give a basis in which the map becomes diagonal.",
  },
  {
    number: 13,
    title: "Abstract vector spaces",
    subtitle: "Beyond arrows.",
    labLabel: "INTERACTIVE FUNCTION LAB",
    intuition:
      "A vector need not be an arrow. Polynomials of degree at most two form a vector space: you can add them and scale them, and the result stays in the space. The basis (1, t, t²) turns every polynomial into three coordinates.",
    formula: String.raw`p(t)=c_0+c_1t+c_2t^2,\qquad [p]_{(1,t,t^2)}=\begin{pmatrix}c_0\\c_1\\c_2\end{pmatrix}`,
    notes: [
      {
        title: "Operations define the space.",
        text: "Over the real numbers, vector addition is associative and commutative, has a zero and additive inverses, and scalar multiplication distributes over both vector and scalar addition. Scalars compose multiplicatively, and one leaves a vector unchanged. Polynomials satisfy these rules coefficient by coefficient.",
        formula: String.raw`a(p+q)=ap+aq,\quad(a+b)p=ap+bp,\quad a(bp)=(ab)p`,
      },
      {
        title: "A basis is a reusable vocabulary.",
        text: "The polynomials 1, t, and t² span P₂ and are independent: the zero polynomial has all coefficients zero. Three basis functions give dimension three. The plotted curve is the whole vector; an individual point is only one evaluation of it.",
        formula: String.raw`\mathcal P_2=\operatorname{span}(1,t,t^2),\qquad\dim\mathcal P_2=3`,
      },
      {
        title: "Functions can be transformed linearly.",
        text: "Differentiation sends P₂ to P₁ and preserves linear combinations. Its columns are the derivatives of the three input basis functions, expressed in the output basis (1, t). A linear map between spaces of different dimensions has a rectangular matrix.",
        formula: String.raw`D(1)=0,\quad D(t)=1,\quad D(t^2)=2t,\qquad[D]=\begin{pmatrix}0&1&0\\0&0&2\end{pmatrix}`,
      },
      {
        title: "The same kept-and-lost story returns.",
        text: "Differentiation erases constants, so its kernel has dimension one. It reaches every linear polynomial, so its rank is two. Matrices, sequences, and other function spaces can also be vector spaces when their operations satisfy the same rules; not every collection is closed under those operations.",
        formula: String.raw`\ker D=\operatorname{span}(1),\qquad\operatorname{rank}D+\dim\ker D=2+1=3`,
      },
    ],
    experiments: [
      {
        title: "Add whole curves",
        text: "Use Quadratic + line. Change a and b. At every t, the purple curve’s height is the same combination of the green and orange heights.",
      },
      {
        title: "Build the zero vector",
        text: "Use Cancellation. The zero polynomial is the entire horizontal zero curve, not an empty graph.",
      },
      {
        title: "Erase a constant",
        text: "Use Constant kernel, then switch to Derivatives. Change p’s constant coefficient and notice that Dp stays zero.",
      },
      {
        title: "Check linearity",
        text: "Switch between Functions and Derivatives while varying the coefficients. D(ap+bq) matches aDp+bDq throughout the interval.",
      },
    ],
    summaryTitle: "The structure survives when the objects change.",
    summary:
      "Addition, scaling, basis, dimension, kernel, and image work for functions as well as arrows. A matrix represents a linear map after bases are chosen; it records structure shared across many kinds of vector spaces.",
  },
];
