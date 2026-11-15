# Reproduce the paired-data comparison using established R functions.
# The dashboard works in a browser and reproduces the test formulas in JavaScript.
# This script allows independent verification in R.
# Install as required:
# install.packages(c("WRS2", "lumen"))
# Alternatively, DescTools::YuenTTest(A, B, paired=TRUE, trim=.2)
# is another paired-difference trimming implementation.

stopifnot(requireNamespace("WRS2", quietly = TRUE))
stopifnot(requireNamespace("lumen", quietly = TRUE))

dat <- read.csv("water_tasting_paired_92.csv")
A <- dat$A_bottled
B <- dat$B_tap
stopifnot(length(A) == length(B), length(A) == 92L)

# 1. Population arithmetic mean of within-person differences
paired_mean <- t.test(A, B, paired = TRUE)
print(paired_mean)

# 2. Trim each PERSON'S DIFFERENCE (lumen)
# Target T_0.2(A-B): trimmed mean of paired differences
trimmed_differences <- lumen::yuenTTest(A, B, paired = TRUE, trim = 0.2)
print(trimmed_differences)

# 3. Trim the TWO MARGINS separately (WRS2)
# Target T_0.2(A)-T_0.2(B): difference of marginal trimmed means
# A paired Winsorized covariance term enters the standard error.
trimmed_margins <- WRS2::yuend(A, B, tr = 0.2)
print(trimmed_margins)

# Confirm point estimands independently of the package result objects.
T <- function(x, tr = .2) mean(x, trim = tr)
stopifnot(
  isTRUE(all.equal(mean(A-B), 4.206521739130435)),
  isTRUE(all.equal(T(A-B), 3.642857142857143)),
  isTRUE(all.equal(T(A)-T(B), 6.375))
)
cat("\nBoth trimmed estimands are valid but different.\n")
