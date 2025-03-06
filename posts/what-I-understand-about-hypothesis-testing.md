---  
author : "Osmond Xin"  
categories : ["hypothesis", "statistics"]  
date : "2025-03-01 11:09:24"  
description : "What I understand about hypothesis testing" 
slug : "what-I-understand-about-hypothesis-testing"  
summary : "What I understand about hypothesis testing"  
tags : ["hypothesis", "statistics", "article"]  
title : "What I understand about hypothesis testing"  

---

What I understand about hypothesis testing
# Definition
hypothesis testing is a template for making decisions using data and statistics.
# Conception
## Hypotheses
There are two contradictory hypotheses about a scenario from which the data was collected.
They are called:
- Null hypothesis: The default assumption. Usually means there is no effect or no difference.
- Alternative hypothesis: the opposite assumption. usually means there is an effect or a different one.
## Reject or Accept
Use dataset to decide:
- Reject the null hypothesis: This means that the data show it is possible that the null hypothesis is false. The data set does not support the null hypothesis.
- Accept null hypothesis (not reject null hypothesis): that mean the dataset show it ti possible that null hypothesis is true. The data set supports the null hypothesis.

## Type of error
### Type I error: The "false positive"
- When you reject the null hypothesis, but the reality is that the null hypothesis is true.
- You think something is effect or different, but it is not true.
### Type II Error: The "False Negative"
- When you accept (do not reject) the null hypothesis, but the reality is the null hypothesis is false.
- You think something has no effect or is not different, but it is true

## How do we make a decision?
We calculate P-value by statistical method.
- What is P-value. P-value mean assume H0 is true, the probability of current data set can be selected.
Then we decide an α (alpha) value. usually 5%.
- What is α(alpha).α(alpha) means the threshold that we can accept for the type I error. 
- Low α (alpha) means the chance of Type I error (the "false positive") became low, but the Type II error (the "false negative") became high.
- Use low α (alpha) for life-related things, such as medical and court cases.
If P-value < α (alpha): reject null hypothesis, accept alternative hypothesis
If P-value > α (alpha): accept null hypothesis, reject alternative hypothesis