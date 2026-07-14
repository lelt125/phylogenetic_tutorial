# Part 1 — Theoretical Overview

**Presenters:** Ninh Thị Hòa & Lê Từ Hoàng Linh

This lecture introduces the foundational concepts of phylogenetics before
the class moves on to hands-on work with ChromasPro, MEGA, IQ-TREE, and
MrBayes in the later parts.

---

## 1. What is phylogenetics?

**Phylogenetics** is the field that studies and reconstructs the
evolutionary relationships and common ancestry among organisms (or genes,
sequences). The result is usually represented as a **phylogenetic tree**,
showing how groups diverged from a common ancestor over time.

![A phylogenetic tree](../assets/images/phan1/s02_p01.png)

**Why study it?**

- Helps classify and identify species.
- Traces the origin and transmission pathways of pathogens (viruses,
  bacteria).
- Finds close relatives of species that need conservation, or of crops
  and livestock.
- Infers the function and evolutionary history of genes and traits.

---

## 2. Structure of a phylogenetic tree

A phylogenetic tree is a branching diagram representing a hypothesis
about the evolutionary relationships among taxa, based on genetic or
morphological evidence. Its main components:

- **Tip** — represents a present-day taxon/species, at the very end of a
  branch.
- **Node** — a hypothesized common ancestor; the point where two lineages
  split.
- **Branch** — a line of evolutionary descent; its length can represent
  the amount of genetic change.
- **Root** — the common ancestor of all taxa; sets the direction of
  evolutionary time.
- **Clade** — an ancestor and all of its descendants.

---

## 3. Morphology-based trees

Before molecular data existed, phylogenetic trees were built mainly from
morphological characters.

![Example of a morphology-based phylogenetic tree](../assets/images/phan1/s04_p01.png)

**Principle:** organisms that share more similar traits tend to be more
closely related, having inherited those traits from a common ancestor.
This approach laid the foundation of taxonomy and is still important
today, especially for fossil groups with no DNA left to analyze.

!!! warning "Weakness"
    Not every similarity reflects common ancestry. Two species can look
    alike because of independent evolution rather than inheritance from a
    shared ancestor.

<div class="grid" markdown>
![Bird and bat wings evolved independently](../assets/images/phan1/s05_p01.png)
![Shark and dolphin](../assets/images/phan1/s05_p03.png)
</div>

Bird and bat wings evolved independently; sharks and dolphins have a
similar body shape because both adapted to aquatic life, not because they
share a recent common ancestor. This is the classic example of
**homoplasy**.

---

## 4. Homology vs. homoplasy

| | Homology | Homoplasy |
|---|---|---|
| Nature | Real signal | Signal noise |
| Definition | Similarity due to **common ancestry** — the true evolutionary signal we want to use to build the tree. | Similarity **not** due to common ancestry: convergent evolution, reversal, parallelism. Looks like homology but misleads about relationships. |

**Why do we need more rigorous inference methods?** The naked eye cannot
tell homology from homoplasy. We need explicit statistical models
(distance, parsimony, likelihood, Bayesian) to separate the true
evolutionary signal from noise and to quantify confidence.

---

## 5. Molecular phylogenetics

**Core idea:** at the molecular level, evolution is a process of
accumulating and selecting mutations over time. So the degree of sequence
difference between two species reflects the evolutionary distance between
them.

**Molecular phylogenetics** is a branch of phylogenetics that analyzes
molecular genetic differences — mainly in DNA sequences — to infer the
evolutionary relationships of organisms.

### A brief history

**1960s–1990s**

- **1965** — Zuckerkandl & Pauling use protein sequences to build trees
  and propose the molecular clock idea.
- **1977** — Sanger sequencing technology is developed.
- **1980s** — Camin & Sokal: the Maximum Parsimony method.
- **1983** — Mullis invents PCR.
- **1987** — Saitou & Nei: the Neighbor-Joining method.
- **1990** — Woese, Kandler & Wheelis: the three-domain system (Bacteria,
  Archaea, Eukarya); Woese & Fox had earlier (1977) used 16S rRNA
  sequences to identify the Archaea domain.
- Felsenstein: Maximum Likelihood and the bootstrap method.

**1997–2020**

- **1997** — the term "phylogenomics" is coined.
- **2001** — Huelsenbeck & Ronquist: the MrBayes software.
- **2003** — Rannala & Yang, Mau & Newton lay the groundwork for Bayesian
  phylogenetic inference via MCMC.
- **>2005** — next-generation sequencing (NGS) technology.
- **2015** — Nguyen et al.: the IQ-TREE software.
- **2016** — Hug et al.: a genome-scale tree of life.
- **2020** — COVID-19: genomic phylogenetic epidemiology becomes a public
  pandemic-tracking tool.

### Advantages of molecular phylogenetics

![Advantages of molecular phylogenetics — from morphology to genomes](../assets/images/phan1/s10_p01.png)

- Large, objective amount of information (quantifiable).
- Applicable to any group of organisms, including microbes that lack rich
  morphological traits.
- Resolves many relationships that morphology alone cannot distinguish.

*Image source: Hug et al., 2016.*

---

## 6. From DNA to the sequences used for tree-building

![DNA structure and gene types](../assets/images/phan1/s11_p01.png)

**DNA** is the molecule that carries genetic information, made of
nucleotides built from one of 4 nitrogen-containing nucleobases:
Cytosine (C), Guanine (G), Adenine (A), Thymine (T) / Uracil (U). A
**gene** is a DNA/RNA sequence in the genome required for a specific
function, and falls into 3 main types:

- Protein-coding genes — transcribed into RNA and then translated into
  protein.
- Specific RNA genes — transcribed only (mRNA, tRNA).
- Non-transcribed genes.

### Why DNA is usually chosen over protein

Because amino acids can carry synonymous changes (several codons encode
the same amino acid), a protein sequence carries less phylogenetic
information than its corresponding DNA sequence. DNA is therefore usually
preferred for building phylogenetic trees.

### Which DNA sequence should you choose?

![Mitochondrial genome map with commonly analyzed regions](../assets/images/phan1/s13_p01.png)

**Mitochondrial DNA** is commonly used for phylogenetic analysis because:

- It is maternally inherited → always present and continuous.
- Low recombination rate → avoids noise from recombination.
- Fast evolutionary rate → allows detection of genetic changes even among
  closely related groups.
- Ease of use: primers for amplifying DNA fragments are already designed
  and available.

Check the literature and prior studies to decide which gene to analyze.
Commonly used genes include: **16S, COI, Cytb, ND2**.

---

## 7. General workflow of a molecular phylogenetics study

1. Quality control; data collection
2. Sequencing
3. Alignment
4. Model selection
5. Inference
6. Branch support
7. Interpretation

!!! note "Why this order matters"
    Mistakes made in the early steps (quality, alignment) propagate
    through all downstream results — so preparing and cleaning the data is
    just as important as choosing the right method.

### Software used in this workshop

<div class="grid cards" markdown>

- **ChromasPro** (Steps 1–2) — quality control & assembly of Sanger
  chromatograms (`.ab1`) into a consensus sequence.
- **MEGA** (Steps 3–4) — multiple sequence alignment, preliminary model
  testing, and exploratory tree building (NJ/ML).
- **IQ-TREE** (Steps 4–6) — ModelFinder + fast, rigorous Maximum
  Likelihood inference with ultrafast bootstrap.
- **MrBayes** (Steps 5–6) — Bayesian inference via MCMC; produces a
  posterior tree and posterior probabilities.

</div>

---

## 8. Four inference methods

### Distance-based methods

Convert the aligned sequences into a pairwise genetic distance matrix
across taxa, then build a tree from that matrix (e.g. Neighbor-Joining,
UPGMA).

- **Advantages:** very fast and intuitive, suitable for large datasets or
  an initial survey.
- **Limitations:** collapses per-site information into a single number →
  loses detail; the result depends on how distance is computed.
- **Tools:** MEGA — used as an exploratory step (Neighbor-Joining /
  UPGMA).

### Maximum Parsimony (MP)

Chooses the tree that requires the **fewest** evolutionary changes to
explain the data — the "simplest hypothesis" principle.

- **Advantages:** intuitive, doesn't require a complex statistical model;
  easy to explain to beginners.
- **Limitations:** prone to error when evolutionary rates are uneven
  across branches ("long-branch attraction").
- **Tools:** MEGA (Maximum Parsimony option); PAUP*.

### Maximum Likelihood (ML)

Searches for the tree **and** substitution model that maximize the
probability of observing the sequence data (the likelihood).

- **Advantages:** rigorous statistical foundation, uses all per-site
  information, results are consistent and reproducible.
- **Limitations:** computationally intensive (IQ-TREE partly addresses
  this); requires choosing the right substitution model; produces one
  best tree rather than a distribution of trees.
- **Tools:** Treefinder, RAxML, IQ-TREE (ModelFinder + ML + ultrafast
  bootstrap).

### Bayesian Inference (BI)

Computes the **posterior** probability of a tree = prior × likelihood,
and samples tree space via MCMC instead of searching for one optimal
solution.

- **Advantages:** yields a full distribution of trees with posterior
  probabilities; handles complex models and uncertainty; lets you
  incorporate prior information from your own hypotheses.
- **Limitations:** slow to run, requires checking convergence (burn-in,
  ESS); results depend on the choice of priors.
- **Tools:** MrBayes (MCMC) — check convergence with Tracer.

---

## 9. Evaluating a phylogenetic tree: how to read one

When reading a phylogenetic tree, ask yourself four questions:

1. **What does the support value mean?** The number at each node shows
   branch confidence (bootstrap % and/or posterior probability — PP).
   High (BS ≳ 70–95%, PP ≳ 0.95) → trustworthy; low → the relationship is
   uncertain.
2. **Which species are you interested in?** Identify the species/clade
   you're studying, then find its closest relative (sister group) next to
   it on the tree.
3. **Is your clade of interest clearly separated?** Does your clade form
   its own well-supported monophyletic group, distinct from other
   species — or is it mixed in among them?
4. **Where is the outgroup?** Check that the outgroup sits at the root and
   is separate from the ingroup; it orients the root of the tree and
   confirms that your study group is monophyletic.

*Common convention: the number at a node = bootstrap (%) / posterior
probability (PP); green = high support, orange = low support.*

### How bootstrap and posterior probability differ

| | Bootstrap (BS) | Posterior Probability (PP) |
|---|---|---|
| Meaning | Stability of the signal | Probability under a Bayesian model |
| How it's computed | Resample the alignment columns (with replacement) and rebuild the tree many times. BS% = the proportion of times a clade appears → measures how STABLE the signal in the data is. | The probability that a clade is correct, computed from the posterior distribution given the model and data. Ranges from 0–1. |

!!! warning "Common misconceptions"
    - BS is **not** "the % probability that the clade is correct" — it
      only measures how repeatable the signal is.
    - BS usually needs at least 70% to be considered reliable; ultrafast
      bootstrap (UFB) or PP need at least 95%.
    - A high support value can still be **wrong** if the model is
      misspecified or the data are biased.

---

## 10. Example trees from recently described new species

The examples below are newly published species, illustrating how the
choice of gene (COI, 16S, Cytb, ND2, or a combination of several genes)
depends on the group of organisms and the research question.

| New species | Publication | Gene(s) used |
|---|---|---|
| *Acanthosaura grismeri* (Le et al., 2025) | Zootaxa | COI |
| *Zhangixalus thaoae* (Nguyen et al., 2024) | ZooKeys | 16S |
| *Euroscaptor darwini* (Vu et al., 2025) | ZooKeys | Cytb & 12S |
| *Uropsilus fansipanensis* (Bui et al., 2023) | Zootaxa | Cytb, RAG1, RAG2 |
| *Tylototriton vietnamirabilis* (Ong et al., 2026) | ZooKeys | ND2 |

<div class="grid" markdown>
![Phylogenetic tree of Acanthosaura grismeri](../assets/images/phan1/s22_p01.jpg)
![Acanthosaura grismeri — male (left) and female (right)](../assets/images/phan1/s22_p02.jpg)
</div>

<div class="grid" markdown>
![Phylogenetic tree of Zhangixalus thaoae](../assets/images/phan1/s23_p01.jpg)
![Zhangixalus thaoae](../assets/images/phan1/s23_p02.jpg)
</div>

<div class="grid" markdown>
![Phylogenetic tree of Euroscaptor darwini](../assets/images/phan1/s24_p01.jpg)
![Euroscaptor darwini](../assets/images/phan1/s24_p02.jpg)
</div>

<div class="grid" markdown>
![Phylogenetic tree of Uropsilus fansipanensis](../assets/images/phan1/s25_p01.jpg)
![Uropsilus fansipanensis](../assets/images/phan1/s25_p02.jpg)
</div>

<div class="grid" markdown>
![Phylogenetic tree of Tylototriton vietnamirabilis](../assets/images/phan1/s26_p01.jpg)
![Tylototriton vietnamirabilis — photo: Phạm Thế Cường](../assets/images/phan1/s26_p02.jpg)
</div>

---

## Next up

Part 2 moves into hands-on work: reading and assembling chromatograms
with ChromasPro, identifying sequences with BLAST, collecting reference
sequences from GenBank, and aligning with MEGA.
