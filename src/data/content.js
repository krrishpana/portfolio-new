// ─────────────────────────────────────────────────────────────
//  ✿ EDIT YOUR PORTFOLIO HERE ✿
//  All the text, links and lists on the site come from this file.
//  Change a value, save, and the site updates.
// ─────────────────────────────────────────────────────────────

export const site = {
  domain: "krrishpana.dev",
  name: "KRRISHPANA",
  role: "AI/ML student & curious builder",
  intro: "I build intelligent systems, experiment with new ideas, and turn coffee into code.",
  resumeUrl: "resume.pdf", // the file is public/resume.pdf — replace it to update your CV
  email: "krrishpana@gmail.com",
  socials: {
    github: "https://github.com/krrishpana",
    linkedin: "https://www.linkedin.com/in/krrishpana-karmacharya/",
  },
};

export const about = {
  // Each line of the big heading. The first word is shown in pink.
  heading: [
    ["curious", "mind."],
    ["builder", "heart."],
    ["always", "learning."],
  ],
  text: [
    "I'm an AI/ML student who loves building things that solve real problems.",
    "I enjoy learning, experimenting and turning complex ideas into simple, useful products.",
  ],
  // icon options: heart, spark, rocket, coffee, book, music, chess, swim, compass
  loves: [
    { icon: "heart", label: "AI & ML" },
    { icon: "spark", label: "Problem solving" },
    { icon: "rocket", label: "Building products" },
    { icon: "coffee", label: "Coffee" },
    { icon: "book", label: "Books" },
    // { icon: "music", label: "Lo-fi music" },
    { icon: "chess", label: "Chess" },
    { icon: "swim", label: "Swimming" },
    { icon: "compass", label: "Exploring" },
  ],
};

// art options: chart, bowl, robot, server, eye, mystery
// slug:   short id. The project's README is in src/data/readmes/<slug>.md
// github: link to the repo (the "view on github" button)
// demo:   optional link to a live demo (leave "" to hide the button)
export const projects = [
  {
    title: "Credit Risk Prediction",
    description: "ML model to predict credit default using XGBoost and SMOTE.",
    tags: ["Python", "XGBoost", "Sklearn"],
    art: "chart",
    slug: "credit-risk-prediction",
    github: "https://github.com/krrishpana/Credit-Risk.git",
    demo: "",
  },
  {
    title: "ByteBites",
    description: "AI-powered nutrition planner with personalised diet plans.",
    tags: ["Django", "AI", "Bootstrap"],
    art: "bowl",
    slug: "bytebites",
    github: "https://github.com/krrishpana/Bytebites_official",
    demo: "",
  },
  {
    title: "AI Academic Agent",
    description: "AI assistant for research, note taking and study help.",
    tags: ["LangChain", "RAG", "LLM"],
    art: "robot",
    slug: "ai-academic-agent",
    github: "https://github.com/krrishpana/AI-Acadmic-Agent",
    demo: "",
  },
  {
    title: "MLOps Pipeline",
    description: "End-to-end ML pipeline with MLflow, Docker and Redis.",
    tags: ["MLflow", "Docker", "Redis"],
    art: "server",
    slug: "mlops-pipeline",
    github: "https://github.com/krrishpana/Online-retail-ml-pipeline",
    demo: "",
  },
  {
    title: "Guassian Glass Try Ons",
    description: "Image classification system using deep learning.",
    tags: ["Python", "Guassian Splat", "MediaPipe"],
    art: "eye",
    slug: "guassian-glass-tryons",
    github: "https://github.com/hyandri/gaussian-glass-tryons.git",
    demo: "",
  },
];

// The last card on the projects grid.
export const comingSoon = {
  title: "More Coming Soon",
  description: "Lots of ideas. Lots of coffee. Something amazing ahead ✦",
};

// One island per milestone (up to 6 look best). Set future: true for the last one.
export const journey = [
  { year: "2023", title: "College Life", text: "Started my college life with 50% scholarship." },
  { year: "2024", title: "Sunway Student Representative Council", text: "Became the Joint Secretary of our Student Council." },
  { year: "2025", title: "Hackathons", text: "Participated in a hackathons and became an organizing member in other 2 hackathons" },
  { year: "2025", title: "Projects & Research", text: "Built real-world projects and explored research and won 3rd place in our college's Innovation Fest." },
  { year: "2026", title: "Internship", text: "Turning learning into real experience." },
  { year: "Future", title: "What's next?", text: "Building, growing and making an impact.", future: true },
];

// status options: progress, done, upcoming
// Lab items with a `slug` open a README pop-up (src/data/readmes/<slug>.md),
// just like projects. Items without a slug are plain rows.
// art options for lab: flask, agents, photo, tools (or any project art)
export const lab = {
  intro: "A space for experiments, ideas and rabbit holes. Where I test, break, learn and build again.",
  tabs: {
    experiments: [
      {
        title: "N8N Experiment", text: "Exploring the world of AI Automation through N8N.", status: "progress",
        slug: "N8N-experiment", art: "flask", tags: ["N8N", "APIs"],
        github: "https://github.com/krrishpana/rag-experiment", demo: "",
      },
      {
        title: "Leet Code", text: "Entering the world of leetcode", status: "progress",
        slug: "leetcode-experiment", art: "agents", tags: ["AI Agents", "LLM", "Research"],
        github: "https://github.com/krrishpana/leetcode-solutions.git", demo: "",
      },
      // {
      //   title: "Image Captioning", text: "Exploring CNN + Transformer for image caption generation.", status: "done",
      //   slug: "image-captioning", art: "photo", tags: ["CNN", "Transformer", "Vision"],
      //   github: "https://github.com/krrishpana/image-captioning", demo: "",
      // },
      {
        title: "LangGraph", text: "Exploring graphs and tool calling", status: "donr",
        slug: "langgraph-experiment", art: "tools", tags: ["AI Agents", "Tool use", "Graphs"],
        github: "https://github.com/krrishpana/tools-for-agents", demo: "",
      },
    ],
    // "reading list": [
    //   { title: "Designing Machine Learning Systems", text: "Chip Huyen — production ML from data to deployment.", status: "progress" },
    //   { title: "Deep Learning with Python", text: "François Chollet — revisiting the fundamentals.", status: "done" },
    //   { title: "Hands-On Large Language Models", text: "Practical guide to building with LLMs.", status: "upcoming" },
    // ],
    // papers: [
    //   { title: "Attention Is All You Need", text: "The Transformer paper. Read, annotated, re-read.", status: "done" },
    //   { title: "Retrieval-Augmented Generation", text: "Lewis et al. — the original RAG paper.", status: "done" },
    //   { title: "ReAct", text: "Reasoning and acting in language models.", status: "progress" },
    // ],
    // ideas: [
    //   { title: "Study buddy that quizzes me", text: "Turn my notes into spaced-repetition quizzes.", status: "upcoming" },
    //   { title: "Plant health from photos", text: "Small CV model for spotting sick leaves.", status: "upcoming" },
    // ],
  },
};

export const contact = {
  heading: "let's connect",
  text: "Have a project in mind or just want to say hi? Drop a message!",
  // To make the form send real emails, create a free form on formspree.io
  // and paste its URL here, e.g. "https://formspree.io/f/abcdwxyz".
  formEndpoint: "",
};

export const footer = "made with curiosity, code & way too much coffee";
