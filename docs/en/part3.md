# Part 3 — Maximum Likelihood & Bayesian Inference

**Presenters:** Ninh Thị Hòa & Lê Từ Hoàng Linh

This part has two halves: (1) the theory behind nucleotide substitution
models and how software chooses an appropriate one, and (2) hands-on
tree-building from the command line with **IQ-TREE** (Maximum Likelihood)
and **MrBayes** (Bayesian Inference).

---

## I. Evolutionary models

### Why do we need a "model" for this at all?

Imagine photocopying a page, then photocopying that photocopy, and
repeating this thousands of times. Each copy has a small chance of an
error (a smudge, faded ink...) that turns one letter into another. The
more copies you make (the "further" you get from the original), the more
errors accumulate.

DNA works the same way: every time a cell copies its DNA to divide, there
is a very small chance that one base (A/T/G/C) gets copied incorrectly
into a different base — this is called a **substitution**. The more
evolutionarily "distant" two species are (the longer ago they split from
a common ancestor), the more differences accumulate between their DNA
sequences.

An **evolutionary model** is simply a mathematical formula describing:
*"if a nucleotide changes, which nucleotide is it likely to become, and
at what rate?"* — so that software can work backwards: looking at the
differences that currently exist between sequences, it infers which
phylogenetic tree is most plausible.

### Not every kind of change happens at the same rate

![Nucleotide substitution models: JC69, K80, HKY85, GTR](../assets/images/phan3/s02_p01.png)

The four bases fall into two chemical groups: purines (A, G — a
two-ring structure) and pyrimidines (C, T — a one-ring structure).
Empirical observation shows:

- **Transitions** — changes within the same group (A↔G or C↔T) — happen
  **more often**, because bases in the same group have a more similar
  shape and are more easily "miscopied" into one another.
- **Transversions** — changes across groups (A↔C, A↔T, G↔C, G↔T) — are
  **rarer**, because bases in different groups differ more in shape.

The **JC69 → K80 → HKY85 → … → GTR** models (going left to right in the
figure) are just increasingly detailed versions of the same idea: each
later model allows more free parameters than the one before it (e.g.
allowing transitions and transversions to have different rates, allowing
the 4 bases to occur at different frequencies...). No model is "absolutely
correct" — the goal is to pick the simplest model that still describes
your actual data well (see the ModelFinder section below).

Besides the *type* of substitution (A→G vs. A→C...), a model's name
sometimes also carries a `+G` or `+I` tag — describing rate variation
across positions along the sequence. Don't worry about fitting these two
parameters by hand: ModelFinder tries them automatically and picks the
best combination, and the hands-on Section III below will explain exactly
what these two tags mean right when you see them appear in your own
results.

### In short: an evolutionary model needs to answer 3 questions

1. **How does it change?** (the substitution model — e.g. JC69, HKY85,
   GTR above).
2. **Does it change equally across positions?** (`+G`, `+I` — details in
   Section III, right after running IQ-TREE).
3. **Does it change equally over time?** (the molecular clock — only
   relevant if you want to date the tree; not required for an ordinary
   ML/Bayesian tree).

### So how do you know which model to use?

Good news: you **don't need to choose by hand**. There are dozens of
different substitution models, and the **ModelFinder** program
(Kalyaanamoorthy et al., 2017) — built into **IQ-TREE** — automatically
tries these models on your own dataset and picks the "just right" one:
one that fits the data well without unnecessary complexity.

![ModelFinder: fast model selection for accurate phylogenetic estimates (Nature Methods, 2017)](../assets/images/phan3/s08_p01.png)

This is exactly the first step that happens when you type the IQ-TREE
command in the hands-on section below — you won't need to type the name
of any specific model, just tell IQ-TREE "find the best model for me."

---

## II. Getting comfortable with the Terminal (PowerShell) on Windows

Both IQ-TREE and MrBayes run from the command line, with no graphical
interface like ChromasPro or MEGA. On Windows, the default command line
is **PowerShell**.

### Installing a terminal app

Windows 11 already comes with the **Windows Terminal** app — a modern
command-line window that supports multiple tabs and displays text better
than the old PowerShell window.

!!! note "Windows 10 needs to download Terminal separately"
    If your machine runs Windows 10, the **Terminal** app is usually
    **not preinstalled** — download it for free from the **Microsoft
    Store** (search for "Terminal" or "Windows Terminal") and install it
    before following the instructions below. If you don't install it,
    you can still use the built-in **Windows PowerShell** window, just
    with an older-style interface.

### Opening PowerShell

1. Press `Windows` and type `Terminal` (or `PowerShell` if you haven't
   installed Terminal) → choose **Windows PowerShell**.
2. Or: hold `Shift` + right-click an empty area inside a folder in File
   Explorer → choose **Open PowerShell window here** (or **Open in
   Terminal**, depending on your Windows version) — this opens PowerShell
   directly in that folder, so you don't need to `cd` manually.

### Basic commands you should know

| What you want to do | PowerShell command | Notes |
|---|---|---|
| See which folder you're in | `pwd` | short for Print Working Directory |
| List files in a folder | `ls` (or `dir`) | `ls` is an alias for `Get-ChildItem` |
| Move into a subfolder | `cd folder_name` | use `cd ..` to go back up to the parent folder |
| Move to a specific path | `cd "C:\Users\Name\Documents\workshop"` | **wrap it in quotes if the path contains spaces** |
| Create a new folder | `mkdir folder_name` | |
| View the contents of a text file | `cat file_name.txt` | handy for quickly checking a `.fasta`/`.nex` file |
| View the first N lines of a file (like `head` on Linux) | `Get-Content file_name.txt -TotalCount 10` | can be shortened to `gc file_name.txt -TotalCount 10`; to see the last N lines (like `tail`) add `-Tail 10` |
| Run a program in the current folder | `.\program_name.exe` | the leading `.\` is required |

!!! warning "Common error: paths with spaces or non-ASCII characters"
    Folder names like `Huong_dan_chay_cay` that contain spaces or
    accented characters will cause command errors if not wrapped in
    quotes. Always wrap paths in `"..."` when typing `cd` or when passing
    a file name to IQ-TREE/MrBayes. Best practice: put your working
    folder on a short path with no accents or spaces (e.g.
    `C:\workshop\`) to avoid trouble altogether.

### Using Tab to type commands faster

Press `Tab` while typing a partial file name, folder name, or command
name to have PowerShell auto-complete the rest — no need to type out long
paths or worry about mistyping a `.fasta`/`.nex` file name. Pressing `Tab`
repeatedly cycles through each matching option in turn (unlike
Linux/bash, which shows the whole list at once — but it still saves a lot
of typing).

---

## III. Building a tree with IQ-TREE (Maximum Likelihood)

### Installing IQ-TREE and MrBayes

Neither program needs a "click Next-Next-Finish" style installer like
ChromasPro or MEGA — you just download a zip file, extract it into a
folder, and (in a later step) tell Windows where that folder is.

**IQ-TREE**

1. Go to the download page:
   [iqtree.github.io](https://iqtree.github.io/#download).
2. Choose the **Windows** build (e.g. `iqtree-3.1.x-Windows.zip`).
3. Extract the `.zip` file into a short folder path with no accented
   characters — e.g. `C:\workshop\iqtree`.
4. The executable is in the `bin\` subfolder, named **`iqtree3.exe`**.

**MrBayes**

1. Go to the download page:
   [nbisweden.github.io/MrBayes](https://nbisweden.github.io/MrBayes/download.html).
2. Choose the precompiled Windows build (currently
   `MrBayes-3.2.7-WIN.zip`).
3. Extract it into a short folder path with no accented characters —
   e.g. `C:\workshop\mrbayes`.
4. In the bin folder, the executable is named **`mb.3.2.7-win64.exe`**.
5. Rename that executable to **`mb.exe`**.

!!! note "The Windows build of MrBayes runs serially"
    The precompiled Windows build **does not include Beagle/MPI** —
    meaning it only runs on a single CPU thread, with no GPU acceleration
    or multi-machine parallelism. For the small dataset used in this
    workshop (12–16 taxa, one gene), this speed is still fast enough to
    finish within a single session. If you later need to analyze much
    larger datasets, consider installing via Homebrew on WSL/macOS/Linux
    to get the MPI-enabled build.

!!! tip "You don't have to use the exact paths shown above"
    The paths `C:\workshop\iqtree` and `C:\workshop\mrbayes` are just
    examples. You can place them anywhere, as long as the **path is
    short, with no accented characters or spaces** (see the warning in
    the "Basic commands" section above) — and remember the exact path so
    you can use it in the next step.

Once both programs are extracted, the next step is to add their `bin`
folders (or wherever the `.exe` files live) to the Path environment
variable, so you can simply type `iqtree3` or `mb` from anywhere.

### Adding programs to the Path environment variable

To be able to simply type `iqtree3` or `mb` from any folder (instead of
typing the full path to the `.exe` file every time), you need to add the
program's folder to Windows's **Path environment variable**:

1. Click the `Windows` logo button, type **"environment variables"** →
   choose **Edit the system environment variables** (or **Edit
   environment variables for your account** if you don't have admin
   rights on the machine).
![Windows Edit Environment Variables](../assets/images/phan3/s03.png)
2. In the **System Properties** window, click the **Environment
   Variables...** button.
![Windows System Properties](../assets/images/phan3/s04.png)
3. Under **User variables**, select the **Path** row → **Edit...**
![Windows System Variables](../assets/images/phan3/s05.png)
4. Click **New** → paste in the path to the folder containing IQ-TREE's
   or MrBayes's `.exe` file, e.g. `C:\workshop\iqtree-3.1\bin`.
5. Click **OK** on every window to save the changes.
6. **Close and reopen** your PowerShell/Terminal window for the new
   environment variable to take effect.

!!! note "Checking that the install worked"
    Open a **new** PowerShell window and type `iqtree3 --version` or
    `mb --version` — if PowerShell reports "not recognized", the
    program's folder wasn't added to the Path variable correctly, or you
    forgot to reopen the PowerShell window after editing it.

### Preparation

- Input file: the alignment you exported from MEGA in Part 2, in FASTA,
  PHYLIP, or NEXUS format (IQ-TREE can read all three).
- Place the alignment file in its own working folder, on a short path
  with no accented characters (see the warning above).
- Open PowerShell in that folder (Shift + right-click → *Open PowerShell
  window here*).

### Basic command: model selection + ML tree + bootstrap

```powershell
iqtree3 -s alignment.fasta -m MFP -B 1000 -T AUTO --prefix cayML -seed 12345
```

Explaining each option:

| Option | Meaning |
|---|---|
| `-s alignment.fasta` | the input alignment file (**required**) |
| `-m MFP` | run **ModelFinder Plus**: automatically choose the best substitution model, then build the tree using it |
| `-B 1000` | run **ultrafast bootstrap** with 1000 replicates (the recommended minimum) |
| `-T AUTO` | let IQ-TREE automatically choose the optimal number of CPU threads |
| `--prefix cayML` | every output file will start with `cayML.*` instead of reusing the input file's name |
| `-seed 12345` | sets the **seed** for the random number generator — you can replace `12345` with any integer you like; if omitted, IQ-TREE picks a seed from the system clock |

!!! note "Computers aren't really \"random\" — why set a seed?"
    A computer cannot generate "true" random numbers — it uses a
    deterministic algorithm called a **pseudo-random number generator**,
    which outputs a sequence of numbers that *look* random but are
    actually computed entirely from a single starting value called a
    **seed**. The same seed → always produces exactly the same sequence
    of numbers, no matter how many times you rerun it or on which
    machine.

    Both IQ-TREE (when searching for the ML tree, running bootstrap) and
    MrBayes (when sampling via MCMC, see Section IV) rely on random
    numbers at many steps. If you don't set a seed yourself, the software
    picks one from the system clock — meaning each run gives a slightly
    different result (though not statistically different). Setting a
    specific seed gives you:

    - **Reproducibility**: rerun the exact same command with the same
      seed → get exactly the same tree as before — useful for verifying
      results or when writing a paper (some journals require you to
      report the seed used so readers can reproduce the analysis).
    - **Debugging**: if you hit an error or an odd result, rerun with the
      same seed to reproduce the issue exactly.

    You do *not* need to set a seed to get a "more correct" tree — with a
    sufficiently informative dataset, different seeds still converge on
    the same result. Setting a seed is only about being able to
    reproduce that exact run later if needed.

!!! tip "Starting over"
    If a run was interrupted and you want to redo the whole thing
    (overwriting the previous results), add the `-redo` option at the end
    of the command (this is an option with no accompanying value — just
    being present turns the feature on, so it's also often called a
    "flag"). Otherwise, IQ-TREE will by default resume from where it left
    off, using the `.ckp.gz` checkpoint file.

### Reading the results

After it finishes, IQ-TREE produces several files sharing the same prefix
(`cayML.*`):

- **`cayML.iqtree`** — the main report, human-readable: the chosen model,
  a text rendering of the tree with support values, log-likelihood, etc.
- **`cayML.treefile`** — the ML tree in Newick format, used to open in
  MEGA (see below) or other tree viewers like FigTree/iTOL.
- **`cayML.contree`** — the consensus tree with support values assigned,
  with branch lengths re-optimized on the original alignment.
- **`cayML.log`** — the log of the entire run.

In the `.treefile`, each branch will have two numbers in the form
`(SH-aLRT/UFBoot)`, e.g. `(98.2/99)` — the higher, the more trustworthy
(recall the support-value thresholds from Part 1).

### Understanding the model ModelFinder just chose for you

Open the `cayML.iqtree` file (see "Reading the results" above) and find
the line naming the model ModelFinder chose — it usually looks something
like `GTR+F+I+G4`. This is where the theory from Section I becomes
concrete:

!!! note "Why do you sometimes see `+G` or `+I` after a model name?"
    Not every position along a sequence mutates at the same rate. Some
    positions are nearly "frozen" for millions of years (because a
    mutation there would be harmful), while others change constantly.

    - `+G` (gamma, usually followed by a number like `G4` = 4 rate
      categories) = the model gains an extra parameter describing this
      rate variation across sites.
    - `+I` (invariant) = the model assumes a proportion of sites almost
      never change at all.

    You don't need to fit these two parameters by hand — ModelFinder
    already tried them automatically and picked the best combination as
    part of the command you just ran.

To get a sense of just how complex this `GTR+F+I+G4` model is, compare it
with the **simplest model that can exist**:

<div class="grid" markdown>

![JC69 model: every substitution rate μ is equal](../assets/images/phan3/s07_p01.png)

**JC69** (Jukes & Cantor, 1969) — the simplest possible model, which will
usually *not* be the model ModelFinder chooses for your real data, but is
a good starting point for understanding the idea:

- Assumes the 4 bases A, G, C, T occur at **equal** frequencies (1/4
  each) — whereas `GTR` (the model ModelFinder may have just chosen)
  allows the 4 bases to have different frequencies (this is what the
  `+F` in the model name means).
- Assumes **every type of substitution has the same single rate** μ, with
  no distinction between transitions and transversions — whereas `GTR`
  (`nst=6`) allows all 6 substitution rates to differ.

</div>

The two remaining pieces — the **molecular clock** and **codon
position** — don't directly affect the command you just ran, but are
worth knowing when reading and interpreting the results:

!!! note "The molecular clock: using mutations to estimate time (not required for today)"
    If the mutation rate at a given DNA region is relatively stable over
    time, we can use it as a kind of "clock": the more differences that
    have accumulated between two sequences, the longer ago those two
    lineages diverged — quite similar to how paleontologists use
    radioactive isotopes to estimate the age of a fossil. This "clock"
    rate is not the same across every region of the genome (mitochondrial
    DNA mutates about 10 times faster than nuclear DNA — Brown et al.,
    1982), so it should only be compared within the **same gene region**,
    not across different genes. Sections III/IV today don't require
    dating the tree, so you can skip this if you just want to build a
    tree.

!!! note "For protein-coding genes: not every codon position is 'equal'"
    A codon consists of 3 positions and encodes 1 amino acid. The 3rd
    position changes most freely (~70% of changes here don't alter the
    amino acid — a **synonymous** mutation), while the 1st and 2nd
    positions face much stronger selective pressure and change less,
    since almost every change there does alter the amino acid. This is
    why some analyses split the alignment into 3 separate "partitions" by
    codon position, each with its own model/rate — but for today's small
    dataset, a single shared model for the whole gene (like the `-m MFP`
    command above) is sufficient.

### Opening the tree in MEGA

Since the class is already familiar with the MEGA interface from Part 2,
you can use MEGA directly to view the tree IQ-TREE built, without
installing any additional software:

1. Open **MEGA** → `File → Open A File/Session...` → select
   `cayML.treefile`.
2. MEGA will recognize this as a Newick tree and open it directly in the
   **Tree Explorer**.
3. In the Tree Explorer, check the box to display branch support values
   (usually under **Branch/Options** or a numbers icon on the toolbar) to
   see both the SH-aLRT/UFBoot values at each node.
4. Select the branch containing the outgroup → right-click → choose
   **Place Root on Branch** to root the tree at the correct biological
   position.

!!! warning "IQ-TREE always outputs an unrooted tree"
    IQ-TREE has no biological information about the outgroup, so it
    always draws the tree starting from the first taxon in the alignment.
    You **must** re-root the tree manually using the outgroup when you
    open it in MEGA.

---

## IV. Building a tree with MrBayes (Bayesian Inference)

### Preparing the NEXUS file

MrBayes needs the data file in **NEXUS** format (`.nex`), unlike the
FASTA format IQ-TREE uses. Use MEGA to reopen the alignment you built
earlier and export it as `.nex`.

A complete NEXUS file contains a data block (`begin data; ... end;`)
followed directly by a MrBayes command block (`begin mrbayes; ... end;`).

!!! example "Example of a small, complete NEXUS file"
    Here is the full content of a minimal `.nex` file with 4 taxa (for
    illustrating the structure only — the class's real dataset will have
    many more taxa and much longer sequences):

    ```nexus
    #NEXUS

    begin data;
        dimensions ntax=4 nchar=20;
        format datatype=dna missing=? gap=-;
        matrix
        Species_A         ATGCTAGCTAGCTTAGGCTA
        Species_B         ATGCTAGCTAGCTTAGGCTG
        Species_C         ATGCTTGCTAGCTTAGCCTA
        Outgroup_species  ATCCTAGGTAGATTAGGATA
        ;
    end;

    begin mrbayes;
        outgroup Outgroup_species;
        lset nst=6 rates=invgamma;
        mcmc ngen=100000 samplefreq=100 nchains=4 nruns=2;
        sump burnin=25;
        sumt burnin=25;
    end;
    ```

    The `#NEXUS` line **must** be the very first line of the file. The
    `data` block declares the number of taxa (`ntax`) and sequence length
    (`nchar`), followed by the sequence table (`matrix`) — each line is a
    taxon name and its sequence, separated by whitespace, with no accents
    or spaces in the taxon name.

Paste the following into the end of the NEXUS file exported from MEGA:

```nexus
begin mrbayes;
    lset applyto=(all) NucModel=4by4 Nst=6 Rates=Invgamma NGammaCat=8;
    prset applyto=(all) StateFreqPr=Dirichlet(1,1,1,1);
    set autoclose=no seed=12345 swapseed=12345;
    mcmcp ngen=10000000 printfreq=1000 samplefreq=100 nchain=4 nrun=2 temp=0.2 savebrlens=yes;
    mcmc diagnfreq=3000000;
    sump burnin=25000;
    sumt burnin=25000 contype=allcompat conformat=simple;
end;
```

Explaining the main commands:

| Command | Meaning |
|---|---|
| `outgroup` | specifies which taxon is the outgroup, used to root the tree |
| `lset nst=6 rates=invgamma` | the GTR model (`nst=6` = 6 different substitution rates) plus `+I+G` (`invgamma`) — equivalent to the model ModelFinder often picks for mitochondrial data |
| `NucModel=4by4` | treat the data as standard **4-state** nucleotide data (A/C/G/T) — as opposed to `Codon` mode if you wanted to analyze by codon triplet |
| `NGammaCat=8` | the number of discrete rate categories used to approximate the `+G` gamma distribution; 8 is a common value — more categories are more accurate but slower |
| `prset` | sets the priors for the model's parameters |
| `set autoclose=no` | don't automatically close the program once the commands finish — lets you review results/enter more commands in the same window |
| `seed=12345` | the seed for the main random number generator, used when sampling via MCMC — the same reason for setting a seed as explained in Section III (see "Computers aren't really 'random'") |
| `swapseed=12345` | a **separate** seed for the chain-swapping step between the "heated"/"cold" chains (`nchain`) — MrBayes uses two independent random number generators, so you need to set both if you want to reproduce an entire run exactly |
| `mcmcp ngen=...` | **pre-sets** the parameters for the MCMC run without starting it — useful for double-checking the configuration before actually starting |
| `mcmc` | **starts** the MCMC run using the parameters set in `mcmcp` (you can override/add parameters directly on the `mcmc` line, e.g. `diagnfreq` here) |
| `ngen=...` | the number of **generations** the MCMC will run — more generations converge more reliably but take longer |
| `printfreq=1000` | how many generations between each progress printout (log-likelihood, standard deviation of split frequencies...) to the screen |
| `samplefreq` | how many generations between each sampled tree/parameter |
| `nchain=4` | the number of MCMCMC **chains** run in parallel within each run (1 "cold" chain used for sampling + 3 "heated" chains that help explore tree space and avoid getting stuck at a local likelihood peak) |
| `nrun=2` | run 2 independent runs at the same time to check convergence |
| `temp=0.2` | the temperature difference between the "heated" and "cold" chains — a smaller value makes it easier for chains to swap with each other, improving exploration of tree space |
| `savebrlens=yes` | save the branch lengths of each sampled tree (needed if you want to view the consensus tree with branch lengths) |
| `diagnfreq=3000000` | how many generations between each recalculation of convergence diagnostics (the standard deviation of split frequencies between runs) |
| `sump` / `sumt` | summarize parameters / summarize the tree after discarding the **burn-in** period |
| `contype=allcompat` | the consensus tree type: `allcompat` keeps **all** compatible groups → a fully resolved tree that does **not** collapse low-support branches into polytomies — unlike the default `halfcompat` (which keeps only groups with ≥ 50% support) |
| `conformat=simple` | export the consensus tree file (`.con.tre`) in a **simple** Newick/NEXUS format — as opposed to `figtree` (which adds extra formatting commands for the FigTree program) |

!!! note "How to choose the number of generations (ngen)"
    For a small dataset (12–16 taxa, one gene) like the one used in this
    workshop, a few hundred thousand to 1 million generations usually
    converges within a single session. For larger datasets or multiple
    genes, tens of millions of generations may be needed — it's a good
    idea to have a longer pre-computed run ready as a backup.

### Running MrBayes from PowerShell

```powershell
mb dataset.nex
```

MrBayes reads and executes the `mrbayes` command block already in the
`.nex` file and automatically starts the MCMC run. You can also open
MrBayes first (type `mb`) and then type `execute dataset.nex` directly in
its own command-line interface.

### Monitoring convergence while it runs

While running, MrBayes continuously prints the **standard deviation of
split frequencies** between runs — the fastest way to check convergence,
right while the analysis is in progress:

!!! tip "Reading the standard deviation of split frequencies"
    The closer this value is to 0, the better. A common rule of thumb:
    **below 0.01** is a good sign that two (or more) independent runs are
    converging on the same region of tree space. If this value is still
    high (> 0.05) once the run finishes, you need to run more generations
    (increase `ngen`) before trusting the results.

### Reading the results & checking with Tracer

Download **Tracer** (free) from:
[github.com/beast-dev/tracer/releases](https://github.com/beast-dev/tracer/releases/latest){:target="_blank"}
— choose the `.zip` build for Windows, `.dmg` for macOS, or `.tgz` for
Linux.

After it finishes, MrBayes produces (with `nruns=2`) files such as:

- `dataset.nex.run1.p`, `.run2.p` — parameter values (log-likelihood,
  substitution rates, etc.) at each sampled generation.
- `dataset.nex.run1.t`, `.run2.t` — the sampled trees (Newick format, can
  be opened with MEGA or FigTree).
- `dataset.nex.con.tre` — the final consensus tree, with **posterior
  probabilities (PP)** on each branch.

1. Open **Tracer** → `File → Import Trace File` → select both `.p`
   files.
2. Check the **ESS** (Effective Sample Size) column for each parameter —
   it should be **above 200**; if lower, run more generations.
3. Look at the trace plot of `LnL` (log-likelihood) — if it looks like a
   "hairy caterpillar" oscillating around a stable value, that's a sign
   the chain has converged; if there's still a clear upward/downward
   trend, don't trust the results yet.
4. Open `dataset.nex.con.tre` with MEGA (`File → Open A File/Session...`,
   the same as opening the IQ-TREE tree above) to view the consensus tree
   with posterior probabilities at each node.

### Converting `.con.tre` to plain Newick with a website (when needed)

The `.con.tre` file MrBayes produces is actually a tree in **NEXUS**
format (with a `translate` block mapping numbers to taxon names), not
plain Newick like IQ-TREE's `.treefile`. MEGA reads this file directly,
so normally you don't need to convert anything — but some other tools
(iTOL, R packages like `ape`/`phytools`, or certain other online tree
viewers) only accept plain Newick. In that case, instead of installing
more software, you can use a free format-conversion website:

1. Go to Phylogeny.fr's format conversion page:
   [phylogeny.lirmm.fr/phylo_cgi/data_converter.cgi](http://phylogeny.lirmm.fr/phylo_cgi/data_converter.cgi){:target="_blank"}.
2. Paste the full contents of the `.con.tre` file into the data box (or
   upload the file directly with the **Upload** button) — the site
   automatically recognizes it as a NEXUS tree.
3. Under **Output format**, choose **Newick Tree**.
4. Click the convert button → download or copy the result: a single
   plain Newick tree line (in the form `(...);`), with the original taxon
   names correctly restored from the `translate` block.

!!! tip
    You can use this same trick for any NEXUS tree you need to convert to
    Newick, not just MrBayes output — including `.nex`/`.tre` files
    exported from MEGA or other software.

---

## V. Exporting the tree to PowerPoint/Affinity to finish it before publication

Trees drawn by MEGA/IQ-TREE/MrBayes are great for **viewing and
interpreting**, but they rarely meet the presentation standards required
for a figure in a scientific journal (default fonts, species names not
italicized, no clear scale bar, cluttered support-value labels...). This
final step is about bringing the tree into a design tool to "polish" it
into a finished figure.

### Why not take a screenshot?

!!! warning "Don't screenshot the tree to make your journal figure"
    A screenshot is a **raster** (bitmap) image — enlarging it will make
    it blurry and pixelated, falling short of the minimum resolution a
    journal requires (typically 300–600 dpi). You should always
    **export the tree in a vector format** (SVG) — this file format
    stores lines and text as mathematical formulas, so it can be scaled
    up freely without degrading, and — most importantly — it stays
    **editable in fine detail** (moving labels, recoloring a branch...)
    when opened in PowerPoint or Affinity.

### Step 1 — Export the tree as SVG from MEGA

1. In the **Tree Explorer** (where you're viewing the tree from
   IQ-TREE/MrBayes), go to the `Image` menu → **Save as SVG File...**
   (some MEGA versions may label it **Export Current View to SVG**).
2. Save the `.svg` file — this is the vector version, preserving every
   line and character in an editable form.

!!! tip "If MEGA can only export PDF"
    A few older MEGA versions don't have a direct SVG export option, only
    PDF. In that case, open the `.pdf` file with **Inkscape** (free) →
    `File → Save As` → choose the `.svg` format, then use this SVG file
    for the following steps.

### Step 2 — Editing in PowerPoint

1. Insert the SVG file into a slide: `Insert → Pictures → This
   Device...` (recent PowerPoint versions support inserting SVG
   directly).
2. Right-click the image → **Convert to Shape** → confirm. Repeat
   **Ungroup** once or twice more until each branch line and each taxon
   label becomes a separate object you can select and edit individually.
3. Things you'll typically do at this stage:
      - Italicize species names (`Genus species` — Newick doesn't store
        italic formatting automatically, so you have to select the text
        and press `Ctrl+I` yourself).
      - Remove unnecessary labels/numbers (e.g. keep support values only
        on the branches that matter).
      - Color or outline a clade you want to highlight.
      - Add captions, arrows, or specimen photos next to the tree.
      - Adjust the scale bar so it's clear, with units labeled (e.g.
        "0.02 substitutions/site").
4. Once done, select all the objects → right-click → **Group**, then
   `File → Save As` → choose an image format (`.png`/`.tiff`) or keep it
   as `.pptx` to keep editing later.

### Step 3 — Using Affinity when you need higher precision

PowerPoint is enough for most cases, but if the journal requires exact
figure dimensions in cm/inches, CMYK color mode, or a higher export
resolution, **Affinity** (a free image-editing and vector-drawing app
from Canva) is a better fit. Download it at:
[affinity.studio/download](https://www.affinity.studio/download){:target="_blank"}
(you'll need to sign in with a free Canva account to download and use it):

1. Open the `.svg` file exported from MEGA in Affinity, and switch to the
   **Vector** persona — this is the mode used to edit the phylogenetic
   tree itself (lines, text, shapes).
2. Affinity automatically splits the objects into separate layers —
   select each branch/label to edit it just like in step 2 above
   (italicize, recolor, remove extra labels...).
3. Create an **artboard** at the exact size the journal requires (e.g. a
   single column ~8.3 cm or a double column ~17.3 cm — check the target
   journal's "Instructions for Authors").
4. `File → Export` → choose the format and resolution required (usually
   TIFF or PNG at 300–600 dpi for a raster figure; or keep it as vector
   SVG if the journal accepts that).

!!! note "Three modes within Affinity"
    Affinity is now **a single app** with three switchable modes
    (personas) that all work within the same file, instead of three
    separate applications like before:

    - **Pixel** (Image) — the raster mode (similar to Photoshop), used
      when you need to edit an actual specimen photo (an animal/plant
      photo) that will accompany the tree figure — e.g. removing the
      background, adjusting brightness/contrast.
    - **Vector** — used to edit the phylogenetic tree itself (lines,
      text, shapes); this is the main mode for the work in this section.
    - **Layout** — used when you need to lay out multiple
      figures/sections (e.g. combining the tree figure with a data table
      and captions) into one finished page before exporting, similar to
      InDesign.

!!! tip "Checklist before submitting a figure to a journal"
    - [x] Species names (genus, species) are italicized.
    - [x] Fonts are consistent and large enough to read when the figure
      is shrunk down.
    - [x] There's a scale bar with units labeled.
    - [x] The outgroup is clearly marked/labeled.
    - [x] Only the necessary support values are shown, not so many that
      it looks cluttered.
    - [x] File size and format have been double-checked against the
      target journal's "Instructions for Authors."

---

## Part 3 summary

```
Choose a model (ModelFinder) → IQ-TREE: ML tree + SH-aLRT + UFBoot
                              → MrBayes: MCMC + convergence check → Bayesian tree + PP
                              → Compare the ML and Bayesian trees (Part 6)
                              → Export as vector (MEGA) → finish in
                                PowerPoint/Affinity → figure for publication
```

At this point you have both a Maximum Likelihood tree (with two kinds of
support values) and a Bayesian tree (with posterior probabilities) from
the same alignment. The next step is to compare these two trees side by
side, correctly interpret what each type of support value means, and once
you've settled on the final tree you want to publish, use PowerPoint or
Affinity to finish it into a journal-ready figure.
