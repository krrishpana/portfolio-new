# AI Academic Agent

An **AI study assistant** that helps with research, note taking and studying.

## Overview

Students spend a lot of time searching through papers and notes. This agent uses **RAG (Retrieval-Augmented Generation)** to answer questions using your own documents, so answers are grounded in your study material.

## Features

- Ask questions about your own notes and papers
- Summarise long documents
- Help with study and revision

<!-- ✏️ List your real features here (e.g. PDF upload, citations, quiz mode). -->

## Tech stack

| Part | Tools |
| --- | --- |
| Framework | LangChain |
| Approach | RAG (retrieval + generation) |
| Model | Large Language Model (LLM) |

## How it works

1. Documents are split into small chunks
2. Each chunk is turned into an embedding and stored in a vector store
3. When you ask a question, the most relevant chunks are retrieved
4. The LLM writes an answer using those chunks as context

## Run it locally

```bash
git clone https://github.com/krrishpana/AI-Acadmic-Agent.git
cd AI-Acadmic-Agent
pip install -r requirements.txt
```
