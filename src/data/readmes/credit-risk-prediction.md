# Credit Risk Prediction

A machine learning model that predicts whether a borrower is likely to **default on a loan**.

## Overview

Banks lose money when borrowers can't pay back their loans. This project trains a model on past credit data to flag high-risk applicants early.

Default cases are rare, so the data is very **imbalanced**. I used **SMOTE** to balance the classes before training, so the model doesn't just predict "no default" for everyone.

## Features

- Data cleaning and feature engineering on credit records
- Class balancing with SMOTE
- XGBoost classifier with hyperparameter tuning
- Evaluation with metrics that work for imbalanced data (precision, recall, F1, ROC-AUC)

## Tech stack

| Part | Tools |
| --- | --- |
| Language | Python |
| Model | XGBoost |
| Preprocessing | scikit-learn, imbalanced-learn (SMOTE) |
| Analysis | pandas, NumPy, matplotlib |

## How it works

1. Load and clean the credit dataset
2. Encode categorical features and scale numeric ones
3. Split into train and test sets
4. Apply SMOTE to the **training set only** (to avoid data leakage)
5. Train and tune the XGBoost model
6. Evaluate on the untouched test set

<!-- ✏️ Add a "Results" section here with your real scores and a chart. -->

## Run it locally

```bash
git clone https://github.com/krrishpana/credit-risk-prediction.git
cd credit-risk-prediction
pip install -r requirements.txt
```

> 💡 What I learned: accuracy is misleading on imbalanced data. Recall on the default class matters much more.
