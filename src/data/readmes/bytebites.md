# ByteBites

An **AI-powered nutrition planner** that creates personalised diet plans.

## Overview

Eating well is hard when you don't know where to start. ByteBites asks a few questions about you and your goals, then suggests a diet plan that fits your needs.

## Features

- User accounts and a simple profile with goals and preferences
- AI-generated, personalised meal plans
- Clean, responsive interface

<!-- ✏️ Add more features here (e.g. calorie tracking, shopping lists). -->

## Tech stack

| Part | Tools |
| --- | --- |
| Backend | Django (Python) |
| AI | AI model for plan generation |
| Frontend | Bootstrap, HTML, CSS |

## How it works

1. The user signs up and fills in their profile
2. The app sends the profile to the AI model
3. The AI returns a meal plan
4. The plan is shown in the dashboard

## Run it locally

```bash
git clone https://github.com/krrishpana/Bytebites_official.git
cd Bytebites_official
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
