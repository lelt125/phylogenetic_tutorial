# Part 2 — Reading, Collecting, and Aligning Sequences

**ChromasPro · BLAST · GenBank · MEGA**

**Presenters:** Ninh Thị Hòa & Lê Từ Hoàng Linh

This part covers quality control & sequence assembly, identification via
BLAST, collecting reference sequences from GenBank, and alignment with
MEGA — producing a dataset that's ready for tree-building. This is steps
1–4 of the general workflow introduced in Part 1 (quality control →
sequencing → alignment → model selection).

---

## I. ChromasPro — Reading & assembling chromatograms

*From raw `.ab1` files to a clean consensus sequence in FASTA format.*

### How Sanger sequencing works

![Principle of Sanger sequencing](../assets/images/phan2/s04_p01.png)

- **Principle:** the dideoxy method randomly terminates DNA synthesis at
  each base.
- **Reading the signal:** the machine detects 4 fluorescent colors
  corresponding to A, T, G, C.
- **Raw output:** a **chromatogram** — a plot of signal peaks along the
  sequence.

### What are `.ab1` files and chromatograms

![Example of a chromatogram](../assets/images/phan2/s05_p01.png)

`.ab1` (or `.scf`) is the raw file from a Sanger sequencer, containing the
fluorescent trace, the machine's base calls, and a quality score for each
base. A chromatogram is a 4-color plot of signal peaks along the
sequence — one color per base (A, C, G, T; color conventions vary by
software).

### How to read a chromatogram

<div class="grid" markdown>
![Good signal: tall, clearly separated peaks](../assets/images/phan2/s06_p01.png)
![Noisy signal: overlapping peaks, N calls](../assets/images/phan2/s06_p02.png)
</div>

- **Good signal:** tall, sharp, clearly separated peaks.
- **Poor signal:** low, overlapping peaks, background noise.
- **"N" base:** the machine couldn't call it — needs visual review.

!!! note "Rule of thumb"
    Only trust a base call when the trace at that position is clear.

### Quality Value (Phred score)

Formula: **QV = −10 · log₁₀(probability of a miscall)**. The higher the
QV, the more trustworthy the base. ChromasPro displays the QV at each
base — use it as the basis for trimming and for deciding what base is
really there.

| Threshold | Error probability | Interpretation |
|---|---|---|
| Q20 | 1% | 1 error per 100 bases |
| Q30 | 0.1% | 1 error per 1000 bases |

### Introducing ChromasPro

<div class="grid" markdown>
![ChromasPro interface](../assets/images/phan2/s08_p01.png)
![ChromasPro](../assets/images/phan2/s08_p02.png)
</div>

- **Role:** view, quality-check, trim, and **assemble** Sanger reads into
  a contig, then export the consensus.
- **Latest version:** 2.x; runs natively on Windows.
- **Download:** technelysium.com.au (Technelysium).
- **Output:** a clean consensus sequence in FASTA format.

### Trimming and keeping the good-quality region

![Trimming low-quality regions](../assets/images/phan2/s09_p01.png)

Both ends of a read are usually low quality (noisy, many Ns). Trim the
low-QV regions — automatically by threshold (e.g. Q20) or manually — to
keep only the reliable core.

### Assembling the contig, consensus & exporting FASTA

```
Forward  →                      >Species_A_Sample01
                                 ATGCTAGCTAGCTTAGGCTAACGT
←  Reverse (reverse-complement)  TAGCCGATCGTAGCTAGGCTA...

↓  assemble into a contig
CONTIG → CONSENSUS
```

- **Fixing bases:** correct "N" or miscalled bases where the trace is
  clear.
- **Reverse read:** may need reverse-complementing before assembly.
- **Assembly:** align the forward + reverse reads into a contig,
  compensating for low-quality ends.
- **Conflicts:** where the two reads disagree → check the trace to pick
  the correct base.
- **Consensus → FASTA:** export the consensus sequence with a clear name.

---

## II. NCBI & BLAST — Sequence identification

*Determine which species your sequence belongs to by comparing it against
a reference database.*

### What is NCBI

![NCBI homepage](../assets/images/phan2/s12_p01.jpg)

NCBI (the National Center for Biotechnology Information, USA) is freely
accessible on the web. It hosts sequence data and analysis tools:

- **GenBank / Nucleotide, Protein** — DNA/RNA and protein sequences.
- **SRA** — raw sequencing data.
- **PubMed** — scientific literature.
- **Taxonomy** — organism classification.
- **BLAST** — similarity search.

### What is GenBank

![GenBank accession number structure](../assets/images/phan2/s13_p01.png)

GenBank is a public, continuously updated DNA/RNA sequence repository.
Each sequence has an **accession number** with a version suffix (e.g.
`MN908947.3` — `MN908947` is the accession, `.3` is the version). It is
the main source for reference sequences when building a dataset.

### BLAST: why we need it & how it works

Once you have a consensus sequence, the question is: "what species is
this?" **BLAST** (Basic Local Alignment Search Tool,
[blast.ncbi.nlm.nih.gov](https://blast.ncbi.nlm.nih.gov/Blast.cgi))
compares your sequence against millions of sequences in the database,
finds regions of local similarity — quickly, using a heuristic algorithm —
and returns a ranked list of hits.

## Running BLAST on the web

*Link to NCBI BLAST*: [blast.ncbi.nlm.nih.gov](https://blast.ncbi.nlm.nih.gov/Blast.cgi)

### BLAST program types

<div class="grid" markdown>
![BLAST search interface](../assets/images/phan2/s14_p01.png)

| Program | Query | Database |
|---|---|---|
| `blastn` | DNA | DNA |
| `blastp` | Protein | Protein |
| `blastx` | DNA (translated) | Protein |
| `tblastn` | Protein | DNA (translated) |
| `tblastx` | DNA (translated) | DNA (translated) |

</div>

!!! tip "Tip"
    To identify a DNA sequence: use **blastn**.

### How to run Nucleotide BLAST

<div class="grid" markdown>

![How to run Nucleotide BLAST](../assets/images/phan2/s16_p01.png)

1. Go to NCBI BLAST → Nucleotide BLAST.
2. Paste your FASTA or upload the sequence file.
3. Choose a database.
4. Choose an Organism if you know/suspect the species (narrows the
   search).
5. Choose a program (megablast).
6. Click BLAST — wait for results.

</div>

### Reading BLAST results

![BLAST results](../assets/images/phan2/s17_p01.png)

- **Graphic Summary** — distribution of hits along the query.
- **Descriptions** — the table of hits, where you make your call.
- **Alignments** — detailed alignment for each hit.

**Key metrics:**

- **Percent Identity** — proportion of matching bases in the aligned
  region. Species identification usually wants ≳ 97–99%.
- **Query Cover** — the percentage of the query length that's aligned.
  Low = only a short stretch matched.
- **E-value** — expected number of random hits with an equivalent score.
  The smaller (≈ 0), the more trustworthy.
- **Bit / Max score** — a normalized alignment score. Higher is stronger;
  used to compare hits.

!!! tip
    Read **all** of the metrics together — don't rely on a single number.

### Interpreting results & caveats

Identify based on the best hit + high coverage + multiple consistent
hits. Multiple hits to the same species reinforce confidence; if the top
hits belong to several different species, be cautious and look for more
evidence.

!!! warning "Caveats"
    - Sequences on GenBank can be misidentified or contaminated.
    - Many GenBank sequences aren't updated to match their associated
      publication, so look them up and investigate further before using
      them.
    - Prefer sequences from peer-reviewed papers and from type/voucher
      specimens.
    - Some sequences may span multiple genes, even whole genomes → extract
      only the gene region you need.

---

## III. GenBank — Collecting sequences

*Build a reference dataset for phylogenetic analysis.*

### Dataset-building strategy

- **Ingroup:** the taxa whose relationships you want to investigate
  (typically 12–16 taxa).
- **Outgroup:** 1–2 taxa to root the tree.
- **Same marker:** all sequences need to be from the same gene/region
  (e.g. COI) so they can be compared.
- **Sample size:** enough to run quickly but still show real variation.

!!! tip "Tip"
    Instead of choosing sequences yourself, you can consult other papers
    to obtain the table of sequences they used to build their own
    phylogenetic tree, as a foundation for your dataset.

### Searching NCBI Nucleotide

- Select the Nucleotide database.
- Combine the Organism and Gene fields, for example:

```
Acanthosaura[Organism] AND COI[Gene]
```

![NCBI Nucleotide Search](../assets/images/phan2/s26.png)

<br>

Filter the results (Sort by) using:

- Sequence length
- Accession number
- Date Released

![NCBI Nucleotide Search Result](../assets/images/phan2/s27.png)

### Reading a GenBank record

<div class="grid" markdown>

![NCBI Nucleotide Record](../assets/images/phan2/s28.png)

| Field | Content |
|---|---|
| `LOCUS` | name/accession, length, molecule type |
| `DEFINITION` | sequence description |
| `ACCESSION` / `VERSION` | identifier + version |
| `SOURCE` | specimen source |
| `ORGANISM` | species |
| `AUTHORS` | authors |
| `TITLE` | paper title |
| `JOURNAL` | journal name |
| `FEATURES` | sequence components: gene, CDS, product |

</div>

**Check that:** it's the right gene/region (see FEATURES); the species in
ORGANISM matches your expectation; the length is reasonable, not an
overly short fragment.

### From BLAST hits to reference sequences

- Candidates from BLAST: strong hits are good candidates to include in
  your dataset.
- Supplement from the literature: add sequences used in published studies
  of the same group.
- Choose representatives: pick a few good sequences per species, avoid
  redundancy.
- Record the source: keep track of each sequence's accession number for
  lookup and citation.
- Record metadata: collection locality, coordinates, elevation, and field
  sample code — useful for other analyses later. It's a good idea to keep
  this information in an Excel spreadsheet.

!!! info "A reference sequence dataset used in a real study"
    Download the Excel file from the following paper to use as a
    reference:
    [Rhacophorus paper](https://doi.org/10.3897/zookeys.1117.85787){:target="_blank"}

### Downloading a single sequence

1. Open the sequence record you want.
2. `Send to` → `File`.
3. Choose FASTA format (or GenBank `.gb`).
4. Save the file.

Suitable when you only need a few sequences.

### Batch Entrez: bulk downloads from a list of accessions

When you need many sequences at once (a whole dataset):

1. Prepare a plain text file, one accession per line
   (`accessions.txt`).
2. Go to [Batch Entrez](https://ncbi.nlm.nih.gov/sites/batchentrez) →
   Nucleotide database → Retrieve.
3. `Send to` → `File` → FASTA for all of them at once.

Advantage: reproduces exactly the dataset from an accession list in a
published paper.

!!! tip "Tip"
    You can also paste the accession list directly into the Nucleotide
    search box; for something more advanced, use EDirect `efetch` from
    the command line.

### Naming, organizing & checking your dataset

Example of a clear taxon label with its accession:

```
>Acanthosaura_grismeri_IEBR_R_6353_PV646694
```

(Species + sample code + accession → a clear label, no diacritics, no
spaces or special characters, so it stays compatible with IQ-TREE &
MrBayes.)

**Dataset quality checklist:**

- [x] Same gene region.
- [x] Comparable lengths.
- [x] No overly short or erroneous sequences.
- [x] No duplicates.
- [x] Sufficient outgroup taxa.
- [x] Suspicious sequences removed before alignment.

---

## IV. MEGA — Alignment & exploratory analysis

*Build an alignment, view genetic distances, and produce an exploratory
tree.*

### Introducing MEGA

![MEGA12](../assets/images/phan2/s29_p01.jpg)

- **What it is:** MEGA12 — a tool for alignment, model testing, and
  tree-building.
- **Advantage:** friendly interface, well suited for teaching.
- **License:** free for research & teaching.
- **Platforms:** Windows and macOS.

### Importing data into MEGA

<div class="grid" markdown>
![Importing FASTA into MEGA](../assets/images/phan2/s30_p01.png)
![Alignment Explorer](../assets/images/phan2/s30_p02.png)
</div>

1. Open the FASTA file (your consensus + GenBank sequences).
2. Choose `Align` → open the Alignment Explorer.
3. Check the number of sequences and their labels.

### Aligning sequences

![Multiple sequence alignment in MEGA](../assets/images/phan2/s31_p01.png)

Choose the **MUSCLE** or **ClustalW** algorithm to line up homologous
positions into columns. Gaps are inserted where sequences have insertions
or deletions. A good alignment is a prerequisite for a trustworthy tree.

### Checking & editing the alignment

![Checking the alignment](../assets/images/phan2/s32_p01.png)

- Look at gaps & errors: visually check messy columns.
- Trim both ends: remove uneven leading/trailing regions across
  sequences.
- Coding genes: translate to amino acids to spot frameshift errors.
- Reverse complement: since DNA is double-stranded, reverse-complement
  any sequences that are in the wrong orientation.

### Genetic distance table (p-distance)

![p-distance table](../assets/images/phan2/s33_p01.png)

**p-distance** is the proportion of differing sites between two sequences
(number of differences / total sites). In MEGA: `Distance → Compute
Pairwise Distances` → choose the p-distance model.

Uses: detecting duplicate sequences, "outlier" sequences (errors or
misidentification), and observing distances between species.

!!! note
    p-distance doesn't correct for multiple substitutions → only suitable
    for closely related groups.

### Building a tree in MEGA

![Neighbor-Joining tree in MEGA](../assets/images/phan2/s34_p01.png)

Quickly run a **Neighbor-Joining** tree in MEGA to get a first look at the
structure of your data — this is an exploratory step before the more
rigorous analyses with IQ-TREE/MrBayes.

### Viewing a tree in Newick format

**Newick** is a text format that describes a tree using nested
parentheses: parentheses = a group/clade; commas separate taxa; `:number`
= branch length; `;` ends the tree. For example, a four-taxon tree with A,
B, C, D:

```
((A,B),(C,D));
```

MEGA can display/export trees in Newick format. The `.treefile`/`.nwk`
files produced by IQ-TREE & MrBayes are this same Newick format.

### Saving & exporting the alignment

| Format | Extension | Used for |
|---|---|---|
| MEGA | `.meg` / `.mas` | Saving a session in MEGA |
| FASTA | `.fasta` / `.fas` | Widely used, IQ-TREE |
| NEXUS | `.nex` | MrBayes |
| PHYLIP | `.phy` | Many ML tools |

!!! note "Note"
    Keep one "master" alignment as a backup.

---

## Part 2 summary

```
ChromasPro (consensus contig) → BLAST (identification) → GenBank + Batch Entrez
  → MEGA (alignment + p-distance) → Ready for tree-building
```

The full Part 2 workflow goes from a raw chromatogram to a quality-checked
alignment. Result: a dataset that's ready for phylogenetic tree-building
in the next part.
