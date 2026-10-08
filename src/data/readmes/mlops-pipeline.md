# MLOps Pipeline

An **end-to-end MLOps system** built on the Online Retail II dataset. It predicts **transaction value** (a regression task) and covers the full ML lifecycle.

## Overview

Most ML projects stop at a notebook. This project goes further: data flows automatically from ingestion to a deployed model, and the model is monitored after deployment.

All steps run inside **one Airflow DAG** (`online_retail.py`).

## Pipeline stages

1. **Data ingestion** — load the raw retail data
2. **Preprocessing** — clean and validate the data
3. **Feature engineering** — build features for the model
4. **Model training** — train an XGBoost regressor, tracked with MLflow
5. **Deployment** — serve predictions through a FastAPI endpoint
6. **Monitoring** — check for data drift with Evidently

## Tech stack

| Part | Tools |
| --- | --- |
| Orchestration | Apache Airflow |
| Storage | MariaDB ColumnStore, Redis |
| Experiment tracking | MLflow |
| Model | XGBoost |
| Serving | FastAPI |
| Monitoring | Evidently |
| Testing | pytest |

<!-- ✏️ Add an architecture diagram and your model results here. -->

## Run it locally

```bash
git clone https://github.com/krrishpana/Online-retail-ml-pipeline.git
cd Online-retail-ml-pipeline
```

<!-- ✏️ Add the setup steps (Docker / Airflow start commands) here. -->

> 💡 What I learned: getting all the tools to work together was the hardest part. Most of my time went into fixing compatibility and architecture issues.
