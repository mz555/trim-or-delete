# Delete or trim? Interactive guide to Yuen’s test and paired estimands

A standalone, static HTML teaching dashboard showing:

- **Independent groups:** documented invalid observations vs outcome-based deletion, Welch's test, and Yuen's trimmed-mean test.
- **Paired/repeated ratings:** ordinary paired mean difference, trimmed mean of paired differences (`lumen::yuenTTest(..., paired=TRUE)`), and difference of separately trimmed margins (`WRS2::yuend()`).
- **Estimand comparison tab:** the question, target quantity, assumptions and limitations of each method.

It supports different trimming fractions, a 92-person publicly available water-tasting example, a simulated paired example, informative graphics, method-specific confidence intervals and local CSV export.

## Publish on GitHub Pages (no Shiny required)

1. Create a **public** repository on GitHub; suggested name: `trim-or-delete`.
2. Upload `index.html`, `.nojekyll`, `README.md`, and (optionally) the `R`, `CSV` and Python verification scripts to its **main** branch root.
3. In the repository, choose **Settings → Pages → Build and deployment → Deploy from a branch**. Select `main` / `(root)` and save.
4. Visit `https://<GITHUB-USERNAME>.github.io/<REPOSITORY>/` once GitHub publishes the site.

All calculations run locally in the user's browser. No backend, R runtime, server subscription, or additional hosting is needed. Avoid Shiny unless future features genuinely require R on a server.

## Statistical comparisons (the water-tasting example, n = 92)

| Analysis | Target parameter | Estimate | Approximate 95% CI | two-sided p |
|---|---|---:|---:|---:|
| Ordinary paired t-test | E(A−B) | +4.21 | [−0.97, 9.38] | .110 |
| `lumen::yuenTTest(..., paired=TRUE, trim=.20)` | T_0.2(A−B) | +3.64 | [0.08, 7.20] | .045 |
| `WRS2::yuend(..., tr=.20)` | T_0.2(A)−T_0.2(B) | +6.38 | [1.09, 11.66] | .019 |

All three analyses keep the 92 complete observations. They do **not** target the same estimand at positive trimming fractions. In particular, the marginal method does not ignore pairing; its SE uses the paired Winsorised covariance. The R script `compare_paired_methods.R` provides package-based reproduction. Data are in `water_tasting_paired_92.csv` and also embedded in `index.html`, so the website remains self-contained.

**Data source:** Wagenmakers and Bartoš, *People prefer the taste of Belgian mineral water Chaudfontaine over Amsterdam tap water*, [PsyArXiv DOI: 10.31234/osf.io/2u84v](https://doi.org/10.31234/osf.io/2u84v). The teaching display includes all 92 publicly shared participant records, including those omitted from the original primary t-test.

## Independent-group simulation

The independent-samples view and Monte Carlo reference simulation remain available. Run `verify_simulations.py` with NumPy and SciPy to check the simulated Type I error illustration. The site warns that exclusions of genuinely invalid records can be appropriate and that arbitrary deletion of valid extremes followed by a naive t-test changes the sampling procedure.

## Notes and limitations

- The paired computations use the tests' published formulas coded in JavaScript, not an R runtime. Numerical outputs were checked independently using SciPy, but formal publication analyses should be validated using the R calls in `compare_paired_methods.R`.
- The dashboard has not been tested against every browser or every data-generating process. It is an educational visualisation, not a general-purpose analysis platform for user-supplied data.
- The paired modes default to complete-case pairs. Ties and boundary ratings remain in the real water data.
- Different estimands are not meant to give the same result. Differences between p-values are neither proof of one method's superiority nor proof of contradictory evidence.
- A mean difference does not directly quantify a preference probability. The companion article discusses the latter separately.

## Statistical references

- [lumen: yuenTTest](https://andrisignorell.github.io/lumen/reference/yuenTTest.html) — trims paired differences.
- [WRS2: yuend source](https://rdrr.io/cran/WRS2/src/R/yuend.R) — trims margins separately, paired covariance correction.
- [WRS2: wincor source](https://rdrr.io/cran/WRS2/src/R/wincor.R) — covariance calculated from paired, independently Winsorised margins.
- [WRS2 vignette](https://cran.r-project.org/web/packages/WRS2/vignettes/WRS2.pdf) — Yuen's procedures and dependent-sample extension.
- [GitHub Pages publishing](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
