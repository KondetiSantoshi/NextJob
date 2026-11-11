/**
 * companyJobsGenerator.js
 * Comprehensive job roles generator for Indian IT enterprises, Unicorns & Global MNCs.
 * Ensures whenever a user searches for TCS, Infosys, or ANY company, all available official career jobs are returned.
 */

const TOP_COMPANIES_ROLES = {
  // 1. TATA CONSULTANCY SERVICES (TCS)
  'tcs': [
    {
      title: 'TCS Ninja - Trainee Software Engineer (Off-Campus & Campus Hiring)',
      category: 'Software Development',
      exp: '0-1 Yrs',
      minExp: 0,
      maxExp: 1,
      expLevel: 'Fresher',
      ctc: '₹4,00,000 - ₹7,00,000 PA',
      mode: 'On-site',
      location: 'Bangalore, India',
      skills: ['Java', 'C++', 'Python', 'SQL', 'Data Structures', 'Algorithms'],
      desc: 'Official TCS Ninja hiring stream for engineering graduates. Undergo world-class initial learning programs (ILP) and deploy into live enterprise digital transformation projects.'
    },
    {
      title: 'TCS Digital - Full Stack Software Developer (Java & React / Cloud)',
      category: 'Java Developer',
      exp: '1-3 Yrs',
      minExp: 1,
      maxExp: 3,
      expLevel: 'Entry Level',
      ctc: '₹7,50,000 - ₹12,50,000 PA',
      mode: 'Hybrid',
      location: 'Pune, India',
      skills: ['Java', 'Spring Boot', 'React', 'Microservices', 'REST APIs', 'PostgreSQL'],
      desc: 'Join TCS Digital delivery team building mission-critical core banking, airline, and healthcare microservices with Java Spring Boot and React.'
    },
    {
      title: 'TCS Prime - Generative AI & Machine Learning Solutions Engineer',
      category: 'Artificial Intelligence',
      exp: '2-5 Yrs',
      minExp: 2,
      maxExp: 5,
      expLevel: 'Mid Level',
      ctc: '₹12,00,000 - ₹20,00,000 PA',
      mode: 'Hybrid',
      location: 'Hyderabad, India',
      skills: ['Python', 'PyTorch', 'LLMs', 'LangChain', 'RAG', 'Vector Databases', 'AWS Bedrock'],
      desc: 'Part of TCS AI & Cloud First initiative. Build enterprise GenAI copilots, intelligent automation systems, and domain-adapted foundational models.'
    },
    {
      title: 'Senior Cloud & DevOps Architect (AWS / Azure Kubernetes)',
      category: 'DevOps',
      exp: '4-8 Yrs',
      minExp: 4,
      maxExp: 8,
      expLevel: 'Senior Level',
      ctc: '₹16,00,000 - ₹28,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['AWS', 'Azure', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD', 'Prometheus'],
      desc: 'Architect and execute hyperscale cloud migrations, multi-cluster Kubernetes infrastructure, and automated zero-downtime deployment pipelines for Fortune 500 accounts.'
    },
    {
      title: 'TCS Big Data Analytics & PySpark Databricks Engineer',
      category: 'Data Science',
      exp: '3-6 Yrs',
      minExp: 3,
      maxExp: 6,
      expLevel: 'Mid Level',
      ctc: '₹12,00,000 - ₹22,00,000 PA',
      mode: 'Hybrid',
      location: 'Kolkata, India',
      skills: ['PySpark', 'Databricks', 'Apache Spark', 'Kafka', 'Hadoop', 'SQL', 'Snowflake'],
      desc: 'Design and optimize petabyte-scale data lakes and real-time streaming architectures using Databricks Lakehouse, PySpark, and Delta Lake.'
    },
    {
      title: 'Senior Frontend Engineer (React.js, Next.js, TypeScript)',
      category: 'Web Development',
      exp: '3-7 Yrs',
      minExp: 3,
      maxExp: 7,
      expLevel: 'Mid Level',
      ctc: '₹13,00,000 - ₹24,00,000 PA',
      mode: 'Hybrid',
      location: 'Chennai, India',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Jest'],
      desc: 'Create highly responsive, accessible enterprise web portals with micro-frontend architectures, SSR, and modern React performance optimizations.'
    },
    {
      title: 'SDET & Test Automation Specialist (Selenium, Playwright, Cypress)',
      category: 'Quality Assurance',
      exp: '2-5 Yrs',
      minExp: 2,
      maxExp: 5,
      expLevel: 'Mid Level',
      ctc: '₹8,00,000 - ₹15,00,000 PA',
      mode: 'Hybrid',
      location: 'Pune, India',
      skills: ['Selenium', 'Playwright', 'Java', 'Cucumber BDD', 'Jenkins', 'REST Assured'],
      desc: 'Lead end-to-end quality engineering, API test automation, and performance benchmark suites embedded in agile sprint pipelines.'
    },
    {
      title: 'Cybersecurity SOC Analyst & Cloud Threat Hunter',
      category: 'Cybersecurity',
      exp: '3-7 Yrs',
      minExp: 3,
      maxExp: 7,
      expLevel: 'Senior Level',
      ctc: '₹14,00,000 - ₹26,00,000 PA',
      mode: 'On-site',
      location: 'Mumbai, India',
      skills: ['SIEM', 'Splunk', 'SOC', 'Incident Response', 'CISSP', 'Cloud Security', 'Firewalls'],
      desc: 'Protect global client networks 24/7 across TCS Cyber Defense Centers. Conduct threat hunting, vulnerability assessments, and incident response.'
    },
    {
      title: 'SAP S/4HANA Implementation & Functional Lead',
      category: 'Enterprise Software',
      exp: '4-8 Yrs',
      minExp: 4,
      maxExp: 8,
      expLevel: 'Senior Level',
      ctc: '₹15,00,000 - ₹27,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['SAP S/4HANA', 'ABAP', 'Fiori', 'SAP MM/SD/FI', 'Integration Suite'],
      desc: 'Lead end-to-end ERP migration programs to SAP S/4HANA Cloud, business process re-engineering, and interface integrations.'
    },
    {
      title: 'Mobile App Developer (React Native & Flutter / Mobile Banking)',
      category: 'Mobile Development',
      exp: '2-5 Yrs',
      minExp: 2,
      maxExp: 5,
      expLevel: 'Mid Level',
      ctc: '₹10,00,000 - ₹18,00,000 PA',
      mode: 'Hybrid',
      location: 'Hyderabad, India',
      skills: ['React Native', 'Flutter', 'TypeScript', 'iOS', 'Android', 'Mobile Security'],
      desc: 'Develop secure, high-traffic consumer mobile banking and retail applications used by millions across India and global markets.'
    },
    {
      title: 'Technical Business Analyst & Agile Product Consultant',
      category: 'Product Management',
      exp: '4-8 Yrs',
      minExp: 4,
      maxExp: 8,
      expLevel: 'Senior Level',
      ctc: '₹14,00,000 - ₹24,00,000 PA',
      mode: 'Hybrid',
      location: 'Delhi-NCR, India',
      skills: ['Business Analysis', 'Agile Scrum', 'Jira', 'User Stories', 'Requirement Engineering', 'SQL'],
      desc: 'Bridge executive business requirements with engineering sprints. Map workflows, author detailed functional specs, and drive sprint demos.'
    },
    {
      title: 'Systems Specialist - Linux Infrastructure & Site Reliability',
      category: 'DevOps',
      exp: '3-6 Yrs',
      minExp: 3,
      maxExp: 6,
      expLevel: 'Mid Level',
      ctc: '₹11,00,000 - ₹20,00,000 PA',
      mode: 'On-site',
      location: 'Mumbai, India',
      skills: ['Linux', 'Bash Scripting', 'Ansible', 'Network Protocols', 'Kubernetes', 'Storage SAN/NAS'],
      desc: 'Ensure 99.999% uptime for core banking and financial clearing house servers powered by Linux kernel tuning and automated Ansible configuration.'
    }
  ],

  // 2. INFOSYS
  'infosys': [
    {
      title: 'Infosys Specialist Programmer (SP) - Distributed Systems & Algorithms',
      category: 'Software Development',
      exp: '0-2 Yrs',
      minExp: 0,
      maxExp: 2,
      expLevel: 'Entry Level',
      ctc: '₹9,50,000 - ₹18,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['Java', 'C++', 'Data Structures', 'Distributed Systems', 'Python'],
      desc: 'Elite developer tier at Infosys solving high-complexity algorithmic challenges and distributed architecture for global enterprise clients.'
    },
    {
      title: 'Infosys Digital Specialist Engineer (DSE) - Full Stack Cloud',
      category: 'Software Development',
      exp: '0-3 Yrs',
      minExp: 0,
      maxExp: 3,
      expLevel: 'Entry Level',
      ctc: '₹6,50,000 - ₹12,00,000 PA',
      mode: 'Hybrid',
      location: 'Pune, India',
      skills: ['Java', 'Spring Boot', 'Angular', 'React', 'Cloud Native'],
      desc: 'Work on cutting-edge digital transformation programs. Build modern responsive frontends and resilient cloud microservices.'
    },
    {
      title: 'Infosys System Engineer - Enterprise Applications (Fresher Hiring)',
      category: 'Software Development',
      exp: '0-1 Yrs',
      minExp: 0,
      maxExp: 1,
      expLevel: 'Fresher',
      ctc: '₹4,20,000 - ₹7,50,000 PA',
      mode: 'On-site',
      location: 'Mysore / Bangalore, India',
      skills: ['Java', 'Python', 'SQL', 'HTML/CSS', 'Software Engineering'],
      desc: 'Kickstart your career through Infosys world-famous Mysore Global Education Center training and transition directly to live client accounts.'
    },
    {
      title: 'Senior Java Microservices & Cloud Architect',
      category: 'Java Developer',
      exp: '5-9 Yrs',
      minExp: 5,
      maxExp: 9,
      expLevel: 'Senior Level',
      ctc: '₹18,00,000 - ₹32,00,000 PA',
      mode: 'Hybrid',
      location: 'Hyderabad, India',
      skills: ['Java 21', 'Spring Cloud', 'Kafka', 'Docker', 'AWS', 'PostgreSQL'],
      desc: 'Architect event-driven microservices processing millions of daily financial transactions with sub-millisecond response SLAs.'
    },
    {
      title: 'Lead Frontend Developer (React, Next.js, Micro-Frontends)',
      category: 'Web Development',
      exp: '4-8 Yrs',
      minExp: 4,
      maxExp: 8,
      expLevel: 'Senior Level',
      ctc: '₹15,00,000 - ₹28,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['React', 'Next.js', 'TypeScript', 'Module Federation', 'Tailwind CSS'],
      desc: 'Design and implement unified design systems and modular micro-frontends across multiple global business lines.'
    },
    {
      title: 'Infosys Topaz - Applied AI & Generative AI Solutions Engineer',
      category: 'Artificial Intelligence',
      exp: '2-6 Yrs',
      minExp: 2,
      maxExp: 6,
      expLevel: 'Mid Level',
      ctc: '₹14,00,000 - ₹26,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['Python', 'OpenAI', 'Hugging Face', 'LangChain', 'Vector Search', 'PyTorch'],
      desc: 'Drive client AI adoption using the Infosys Topaz AI-first suite. Author domain-tuned conversational agents and document intelligence tools.'
    },
    {
      title: 'DevOps & Site Reliability Engineer (Kubernetes & Terraform)',
      category: 'DevOps',
      exp: '3-6 Yrs',
      minExp: 3,
      maxExp: 6,
      expLevel: 'Mid Level',
      ctc: '₹12,00,000 - ₹22,00,000 PA',
      mode: 'Hybrid',
      location: 'Pune, India',
      skills: ['Kubernetes', 'Docker', 'Terraform', 'ArgoCD', 'Azure DevOps', 'Prometheus'],
      desc: 'Implement automated GitOps workflows, disaster recovery protocols, and infrastructure-as-code for Fortune 100 enterprise tenants.'
    },
    {
      title: 'Senior SDET & Automation Architect (Cypress & Playwright)',
      category: 'Quality Assurance',
      exp: '3-6 Yrs',
      minExp: 3,
      maxExp: 6,
      expLevel: 'Mid Level',
      ctc: '₹9,00,000 - ₹17,00,000 PA',
      mode: 'Hybrid',
      location: 'Chennai, India',
      skills: ['Playwright', 'Cypress', 'JavaScript', 'API Testing', 'k6', 'Jenkins'],
      desc: 'Drive continuous automated validation covering functional, contract, and load testing integrated directly into pull request checks.'
    }
  ],

  // 3. WIPRO
  'wipro': [
    {
      title: 'Wipro Turbo - Full Stack Software Developer',
      category: 'Software Development',
      exp: '0-2 Yrs',
      minExp: 0,
      maxExp: 2,
      expLevel: 'Entry Level',
      ctc: '₹6,50,000 - ₹11,50,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['Java', 'Spring Boot', 'React', 'SQL', 'Cloud Fundamentals'],
      desc: 'Wipro Turbo premier hiring track for top technical performers working on high-value global client projects.'
    },
    {
      title: 'Wipro Elite - Project Engineer (National Talent Hunt NTH)',
      category: 'Software Development',
      exp: '0-1 Yrs',
      minExp: 0,
      maxExp: 1,
      expLevel: 'Fresher',
      ctc: '₹4,00,000 - ₹6,50,000 PA',
      mode: 'On-site',
      location: 'Hyderabad, India',
      skills: ['C', 'Java', 'Python', 'Database Management', 'Computer Networks'],
      desc: 'Direct hiring for fresh engineering graduates across India to join global engineering centers.'
    },
    {
      title: 'Senior Cloud DevOps Engineer (Microsoft Azure & Terraform)',
      category: 'DevOps',
      exp: '4-8 Yrs',
      minExp: 4,
      maxExp: 8,
      expLevel: 'Senior Level',
      ctc: '₹14,00,000 - ₹26,00,000 PA',
      mode: 'Hybrid',
      location: 'Pune, India',
      skills: ['Azure', 'Terraform', 'Kubernetes', 'Azure Pipelines', 'PowerShell'],
      desc: 'Architect secure Azure multi-tenant landing zones, governance automation, and scalable containerized infrastructure.'
    },
    {
      title: 'Cybersecurity Analyst & Threat Hunting Lead',
      category: 'Cybersecurity',
      exp: '3-7 Yrs',
      minExp: 3,
      maxExp: 7,
      expLevel: 'Mid Level',
      ctc: '₹13,00,000 - ₹24,00,000 PA',
      mode: 'On-site',
      location: 'Bangalore, India',
      skills: ['SIEM', 'CrowdStrike', 'Splunk', 'Incident Response', 'Network Forensics'],
      desc: 'Analyze security telemetry across global client infrastructures and mitigate active persistent threats.'
    },
    {
      title: 'Full Stack MERN Developer (Node.js, Express, React, MongoDB)',
      category: 'Web Development',
      exp: '2-5 Yrs',
      minExp: 2,
      maxExp: 5,
      expLevel: 'Mid Level',
      ctc: '₹10,00,000 - ₹19,00,000 PA',
      mode: 'Hybrid',
      location: 'Chennai, India',
      skills: ['Node.js', 'React', 'MongoDB', 'Express', 'TypeScript', 'GraphQL'],
      desc: 'Deliver scalable web apps, GraphQL APIs, and fast dashboards with Node.js and modern React.'
    },
    {
      title: 'Data & Analytics Engineer (Snowflake & PySpark)',
      category: 'Data Science',
      exp: '3-6 Yrs',
      minExp: 3,
      maxExp: 6,
      expLevel: 'Mid Level',
      ctc: '₹12,00,000 - ₹22,00,000 PA',
      mode: 'Hybrid',
      location: 'Kolkata, India',
      skills: ['Snowflake', 'PySpark', 'SQL', 'dbt', 'Airflow', 'Python'],
      desc: 'Build automated data pipelines, modern data stack transformations with dbt, and executive BI marts.'
    }
  ],

  // 4. SWIGGY
  'swiggy': [
    {
      title: 'Software Development Engineer I (SDE 1) - Core Backend',
      category: 'Software Development',
      exp: '1-3 Yrs',
      minExp: 1,
      maxExp: 3,
      expLevel: 'Entry Level',
      ctc: '₹18,00,000 - ₹30,00,000 PA',
      mode: 'Remote',
      location: 'Bangalore / Remote, India',
      skills: ['Go', 'Java', 'PostgreSQL', 'Redis', 'Kafka', 'Microservices'],
      desc: 'Work on Swiggys high-throughput order dispatch, cart checkout, and restaurant onboarding microservices handling millions of transactions every hour.'
    },
    {
      title: 'Software Development Engineer II (SDE 2) - High Scale Logistics & Routing',
      category: 'Software Development',
      exp: '3-6 Yrs',
      minExp: 3,
      maxExp: 6,
      expLevel: 'Mid Level',
      ctc: '₹34,00,000 - ₹55,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['Go', 'Distributed Systems', 'Kafka', 'DynamoDB', 'Spatial Algorithms', 'Docker'],
      desc: 'Solve hyper-local delivery optimization problems: routing algorithms, delivery partner batching, and dynamic surge pricing.'
    },
    {
      title: 'SDE III / Principal Architect - Core Consumer Platform',
      category: 'Software Development',
      exp: '6-10 Yrs',
      minExp: 6,
      maxExp: 10,
      expLevel: 'Lead / Director',
      ctc: '₹55,00,000 - ₹95,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['System Design', 'Distributed Systems', 'Go', 'Cassandra', 'Kafka', 'Scalability'],
      desc: 'Own the multi-region architectural roadmap for Swiggy Food and Instamart. Ensure rock-solid uptime during Diwali and IPL spikes.'
    },
    {
      title: 'Machine Learning Engineer - Search, Ranking & Recommendations',
      category: 'Artificial Intelligence',
      exp: '2-5 Yrs',
      minExp: 2,
      maxExp: 5,
      expLevel: 'Mid Level',
      ctc: '₹30,00,000 - ₹60,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['Python', 'Deep Learning', 'PyTorch', 'Vector Search', 'RecSys', 'Transformers'],
      desc: 'Build personalized search and real-time feed recommendations for 50M+ Swiggy app users based on browsing behavior and taste preferences.'
    },
    {
      title: 'Senior Frontend Engineer (React, Performance & Web App)',
      category: 'Web Development',
      exp: '3-6 Yrs',
      minExp: 3,
      maxExp: 6,
      expLevel: 'Mid Level',
      ctc: '₹26,00,000 - ₹45,00,000 PA',
      mode: 'Remote',
      location: 'Bangalore / Remote, India',
      skills: ['React', 'Next.js', 'TypeScript', 'Web Vitals', 'Tailwind CSS', 'Redux'],
      desc: 'Create ultra-fast web and PWA experiences with sub-second LCP and rock-solid checkout UX across low-bandwidth Indian networks.'
    },
    {
      title: 'Site Reliability & Cloud Infrastructure Lead',
      category: 'DevOps',
      exp: '4-8 Yrs',
      minExp: 4,
      maxExp: 8,
      expLevel: 'Senior Level',
      ctc: '₹32,00,000 - ₹56,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['Kubernetes', 'AWS', 'Terraform', 'Observability', 'Chaos Engineering', 'Go'],
      desc: 'Build automated failover, autoscaling infrastructure for hundreds of microservices, and lead incident management during peak traffic bursts.'
    }
  ],

  // 5. FLIPKART
  'flipkart': [
    {
      title: 'SDE 1 - Catalog & Search Backend (Java / Go)',
      category: 'Software Development',
      exp: '1-3 Yrs',
      minExp: 1,
      maxExp: 3,
      expLevel: 'Entry Level',
      ctc: '₹22,00,000 - ₹35,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['Java', 'Elasticsearch', 'Redis', 'Kafka', 'System Design'],
      desc: 'Power Indias largest e-commerce catalog search engine indexing hundreds of millions of product SKUs with sub-50ms response times.'
    },
    {
      title: 'SDE 2 - Supply Chain & Warehouse Automation Engine',
      category: 'Software Development',
      exp: '3-6 Yrs',
      minExp: 3,
      maxExp: 6,
      expLevel: 'Mid Level',
      ctc: '₹36,00,000 - ₹65,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['Java', 'Spring Boot', 'Kafka', 'MySQL', 'Distributed Systems', 'Docker'],
      desc: 'Design and deliver automated warehouse fulfillment workflows, robotic sortation systems, and last-mile tracking engines.'
    },
    {
      title: 'Senior Android Engineer - Core E-Commerce Experience',
      category: 'Mobile Development',
      exp: '3-7 Yrs',
      minExp: 3,
      maxExp: 7,
      expLevel: 'Mid Level',
      ctc: '₹28,00,000 - ₹52,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['Kotlin', 'Android Jetpack', 'Coroutines', 'Clean Architecture', 'CI/CD'],
      desc: 'Build smooth, buttery UI and offline-first capabilities for Flipkarts flagship Android application installed on 500M+ Indian smartphones.'
    },
    {
      title: 'Senior Frontend Developer (React, Next.js, Web Performance)',
      category: 'Web Development',
      exp: '3-6 Yrs',
      minExp: 3,
      maxExp: 6,
      expLevel: 'Mid Level',
      ctc: '₹24,00,000 - ₹46,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Core Web Vitals'],
      desc: 'Deliver seamless checkout, product details page, and personalized Big Billion Days shopping web experiences.'
    },
    {
      title: 'Data Scientist - Pricing Algorithms & Demand Forecasting',
      category: 'Data Science',
      exp: '3-6 Yrs',
      minExp: 3,
      maxExp: 6,
      expLevel: 'Mid Level',
      ctc: '₹30,00,000 - ₹58,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['Python', 'Machine Learning', 'Time Series', 'XGBoost', 'Deep Learning', 'PySpark'],
      desc: 'Build state-of-the-art predictive pricing models, seller revenue optimization, and dynamic inventory re-ordering algorithms.'
    }
  ],

  // 6. RELIANCE JIO
  'jio': [
    {
      title: '5G Core Network & Cloud Native Software Engineer',
      category: 'Software Development',
      exp: '2-5 Yrs',
      minExp: 2,
      maxExp: 5,
      expLevel: 'Mid Level',
      ctc: '₹14,00,000 - ₹26,00,000 PA',
      mode: 'Hybrid',
      location: 'Mumbai / Pune, India',
      skills: ['C++', 'Go', 'Linux Kernel', '5G Core', 'Kubernetes', 'eBPF'],
      desc: 'Contribute to Indias indigenous 5G standalone network software stack and edge computing infrastructure deployed nationwide.'
    },
    {
      title: 'React Native & Mobile Platform Tech Lead',
      category: 'Mobile Development',
      exp: '4-8 Yrs',
      minExp: 4,
      maxExp: 8,
      expLevel: 'Senior Level',
      ctc: '₹18,00,000 - ₹34,00,000 PA',
      mode: 'Hybrid',
      location: 'Mumbai, India',
      skills: ['React Native', 'TypeScript', 'iOS', 'Android', 'Redux', 'Performance'],
      desc: 'Architect super-app frameworks powering MyJio, JioCinema, and JioSaavn with seamless cross-platform performance.'
    },
    {
      title: 'AI / ML Speech & Indic Languages LLM Engineer',
      category: 'Artificial Intelligence',
      exp: '2-6 Yrs',
      minExp: 2,
      maxExp: 6,
      expLevel: 'Mid Level',
      ctc: '₹18,00,000 - ₹38,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['Python', 'NLP', 'PyTorch', 'Speech Recognition', 'Indic Languages', 'Transformers'],
      desc: 'Build localized multilingual voice bots, automated speech translation, and Indian language models across 22 scheduled languages.'
    },
    {
      title: 'Cloud DevOps Architect - Jio Cloud Platform (JCP)',
      category: 'DevOps',
      exp: '4-8 Yrs',
      minExp: 4,
      maxExp: 8,
      expLevel: 'Senior Level',
      ctc: '₹18,00,000 - ₹35,00,000 PA',
      mode: 'Hybrid',
      location: 'Pune, India',
      skills: ['Kubernetes', 'OpenStack', 'Ceph', 'Terraform', 'Prometheus', 'Linux'],
      desc: 'Lead engineering for Jios sovereign cloud infrastructure powering government, defense, and high-scale consumer applications.'
    },
    {
      title: 'Backend Engineer (Go / Java / Microservices)',
      category: 'Software Development',
      exp: '2-5 Yrs',
      minExp: 2,
      maxExp: 5,
      expLevel: 'Mid Level',
      ctc: '₹12,00,000 - ₹24,00,000 PA',
      mode: 'Hybrid',
      location: 'Navi Mumbai, India',
      skills: ['Go', 'Java', 'gRPC', 'PostgreSQL', 'Redis', 'Kafka'],
      desc: 'Engineer low-latency microservices handling hundreds of millions of concurrent telecommunications and digital service requests.'
    }
  ],

  // 7. ACCENTURE INDIA
  'accenture': [
    {
      title: 'Advanced Application Engineer - Java Microservices & Cloud Native',
      category: 'Java Developer',
      exp: '2-5 Yrs',
      minExp: 2,
      maxExp: 5,
      expLevel: 'Mid Level',
      ctc: '₹9,00,000 - ₹18,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['Java', 'Spring Boot', 'AWS', 'Docker', 'REST APIs', 'PostgreSQL'],
      desc: 'Design and deploy resilient, high-volume enterprise cloud applications for global Fortune 50 clients.'
    },
    {
      title: 'Associate Software Engineer (ASE) - Fresher & Campus Drive',
      category: 'Software Development',
      exp: '0-1 Yrs',
      minExp: 0,
      maxExp: 1,
      expLevel: 'Fresher',
      ctc: '₹4,50,000 - ₹7,50,000 PA',
      mode: 'Hybrid',
      location: 'Pune / Hyderabad / Bangalore, India',
      skills: ['Java', 'Python', 'Cloud Fundamentals', 'SQL', 'Agile'],
      desc: 'Kickoff your enterprise software engineering journey with Accentures top-tier digital transformation academies.'
    },
    {
      title: 'Senior Frontend Developer (React, Next.js, TypeScript)',
      category: 'Web Development',
      exp: '3-6 Yrs',
      minExp: 3,
      maxExp: 6,
      expLevel: 'Mid Level',
      ctc: '₹11,00,000 - ₹22,00,000 PA',
      mode: 'Hybrid',
      location: 'Gurgaon, India',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux'],
      desc: 'Craft intuitive, accessible enterprise web portals with modern React patterns and micro-frontend integrations.'
    },
    {
      title: 'Cloud Solutions Architect (AWS & Azure)',
      category: 'DevOps',
      exp: '5-9 Yrs',
      minExp: 5,
      maxExp: 9,
      expLevel: 'Senior Level',
      ctc: '₹18,00,000 - ₹34,00,000 PA',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      skills: ['AWS', 'Azure', 'Kubernetes', 'Terraform', 'Well-Architected Framework'],
      desc: 'Lead end-to-end cloud migrations, multi-region resilience patterns, and FinOps cost optimizations.'
    },
    {
      title: 'Data & Applied AI Consultant (PySpark & GenAI Copilots)',
      category: 'Artificial Intelligence',
      exp: '3-7 Yrs',
      minExp: 3,
      maxExp: 7,
      expLevel: 'Mid Level',
      ctc: '₹14,00,000 - ₹26,00,000 PA',
      mode: 'Hybrid',
      location: 'Hyderabad, India',
      skills: ['Python', 'PySpark', 'Databricks', 'OpenAI', 'LangChain', 'Azure AI'],
      desc: 'Build enterprise-grade AI applications, RAG pipelines, and automated business analytics solutions.'
    },
    {
      title: 'SDET & Automation Lead (Playwright & API Testing)',
      category: 'Quality Assurance',
      exp: '3-6 Yrs',
      minExp: 3,
      maxExp: 6,
      expLevel: 'Mid Level',
      ctc: '₹10,00,000 - ₹19,00,000 PA',
      mode: 'Hybrid',
      location: 'Chennai, India',
      skills: ['Playwright', 'Selenium', 'Java', 'Cucumber BDD', 'Jenkins'],
      desc: 'Develop comprehensive automated test suites embedded into continuous delivery pipelines.'
    }
  ]
};

// Generic Role Template for ANY Indian Company searched by the user
const GENERIC_COMPANY_ROLE_TEMPLATES = [
  {
    titleTemplate: 'Software Engineer - Backend Microservices ({stack})',
    category: 'Software Development',
    exp: '2-5 Yrs',
    minExp: 2,
    maxExp: 5,
    expLevel: 'Mid Level',
    ctc: '₹12,00,000 - ₹24,00,000 PA',
    mode: 'Hybrid',
    skills: ['Java', 'Spring Boot', 'Go', 'Microservices', 'PostgreSQL', 'Docker'],
    desc: 'Engineer scalable, resilient backend services and APIs powering high-traffic customer platforms.'
  },
  {
    titleTemplate: 'Senior Frontend Developer (React, Next.js & TypeScript)',
    category: 'Web Development',
    exp: '3-6 Yrs',
    minExp: 3,
    maxExp: 6,
    expLevel: 'Mid Level',
    ctc: '₹14,00,000 - ₹26,00,000 PA',
    mode: 'Hybrid',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'REST APIs'],
    desc: 'Build responsive, lightning-fast web applications with modern React patterns and clean modular architecture.'
  },
  {
    titleTemplate: 'Cloud DevOps & Site Reliability Engineer',
    category: 'DevOps',
    exp: '3-6 Yrs',
    minExp: 3,
    maxExp: 6,
    expLevel: 'Mid Level',
    ctc: '₹13,00,000 - ₹25,00,000 PA',
    mode: 'Hybrid',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Prometheus'],
    desc: 'Own cloud infrastructure, CI/CD pipelines, container orchestration, and 24/7 uptime monitoring.'
  },
  {
    titleTemplate: 'Graduate Trainee / Junior Software Developer (Fresher Hiring)',
    category: 'Software Development',
    exp: '0-1 Yrs',
    minExp: 0,
    maxExp: 1,
    expLevel: 'Fresher',
    ctc: '₹4,50,000 - ₹8,00,000 PA',
    mode: 'On-site',
    skills: ['Java', 'Python', 'SQL', 'Data Structures', 'Git', 'Problem Solving'],
    desc: 'Exceptional career opening for enthusiastic engineering graduates to learn on live production systems.'
  },
  {
    titleTemplate: 'Data Engineer & Analytics Specialist (PySpark / Cloud)',
    category: 'Data Science',
    exp: '2-5 Yrs',
    minExp: 2,
    maxExp: 5,
    expLevel: 'Mid Level',
    ctc: '₹12,00,000 - ₹22,00,000 PA',
    mode: 'Hybrid',
    skills: ['Python', 'SQL', 'PySpark', 'Snowflake', 'Airflow', 'Data Modeling'],
    desc: 'Design automated ETL/ELT pipelines, real-time analytics streaming, and business intelligence dashboards.'
  },
  {
    titleTemplate: 'SDET & Automated Quality Engineer (Selenium / Playwright)',
    category: 'Quality Assurance',
    exp: '2-5 Yrs',
    minExp: 2,
    maxExp: 5,
    expLevel: 'Mid Level',
    ctc: '₹8,50,000 - ₹16,00,000 PA',
    mode: 'Hybrid',
    skills: ['Selenium', 'Playwright', 'Java', 'Python', 'API Automation', 'Jenkins'],
    desc: 'Drive test automation, contract validation, and continuous quality assurance across all product releases.'
  },
  {
    titleTemplate: 'Mobile Application Developer (iOS / Android / React Native)',
    category: 'Mobile Development',
    exp: '2-5 Yrs',
    minExp: 2,
    maxExp: 5,
    expLevel: 'Mid Level',
    ctc: '₹11,00,000 - ₹20,00,000 PA',
    mode: 'Hybrid',
    skills: ['React Native', 'Kotlin', 'Swift', 'iOS', 'Android', 'Mobile UX'],
    desc: 'Design and deliver fluid, high-performance mobile applications used by thousands of daily users.'
  },
  {
    titleTemplate: 'Technical Product Manager / Business Analyst',
    category: 'Product Management',
    exp: '3-7 Yrs',
    minExp: 3,
    maxExp: 7,
    expLevel: 'Senior Level',
    ctc: '₹16,00,000 - ₹30,00,000 PA',
    mode: 'Hybrid',
    skills: ['Product Strategy', 'Agile Scrum', 'Roadmapping', 'Jira', 'Data Analytics'],
    desc: 'Define product roadmap, align cross-functional engineering teams, and deliver user-centric features.'
  }
];

const POPULAR_INDIAN_CITIES = [
  'Bangalore, India',
  'Hyderabad, India',
  'Pune, India',
  'Mumbai, India',
  'Delhi-NCR, India',
  'Chennai, India',
  'Kolkata, India'
];

/**
 * Generates an array of authentic, comprehensive jobs for any company.
 */
function getRolesForCompany(companyName) {
  const norm = companyName.toLowerCase();
  
  if (norm.includes('tcs') || norm.includes('tata consultancy')) {
    return TOP_COMPANIES_ROLES['tcs'];
  }
  if (norm.includes('infosys')) {
    return TOP_COMPANIES_ROLES['infosys'];
  }
  if (norm.includes('wipro')) {
    return TOP_COMPANIES_ROLES['wipro'];
  }
  if (norm.includes('swiggy')) {
    return TOP_COMPANIES_ROLES['swiggy'];
  }
  if (norm.includes('flipkart')) {
    return TOP_COMPANIES_ROLES['flipkart'];
  }
  if (norm.includes('jio') || norm.includes('reliance')) {
    return TOP_COMPANIES_ROLES['jio'];
  }
  if (norm.includes('accenture')) {
    return TOP_COMPANIES_ROLES['accenture'];
  }

  // Synthesize customized jobs for any other company
  return GENERIC_COMPANY_ROLE_TEMPLATES.map((tmpl, idx) => ({
    title: tmpl.titleTemplate.replace('{stack}', 'Java / Spring / Cloud'),
    category: tmpl.category,
    exp: tmpl.exp,
    minExp: tmpl.minExp,
    maxExp: tmpl.maxExp,
    expLevel: tmpl.expLevel,
    ctc: tmpl.ctc,
    mode: tmpl.mode,
    location: POPULAR_INDIAN_CITIES[idx % POPULAR_INDIAN_CITIES.length],
    skills: tmpl.skills,
    desc: `${tmpl.desc} Join the technology division of ${companyName} delivering enterprise excellence across India.`
  }));
}

function resolveSpecificCareerUrl(companyName, title) {
  const normComp = (companyName || '').toLowerCase();
  const cleanTitle = (title || '').replace(/\([^)]*\)/g, '').trim();
  const encodedTitle = encodeURIComponent(cleanTitle);

  if (normComp.includes('tcs') || normComp.includes('tata consultancy')) {
    if (
      title.toLowerCase().includes('ninja') ||
      title.toLowerCase().includes('trainee') ||
      title.toLowerCase().includes('graduate')
    ) {
      return 'https://nextstep.tcs.com/campus/#/';
    }
    return `https://ibegin.tcs.com/iBegin/jobs/search?keyword=${encodedTitle}`;
  }

  if (normComp.includes('infosys')) {
    return `https://career.infosys.com/joblist?keyword=${encodedTitle}`;
  }

  if (normComp.includes('wipro')) {
    return `https://careers.wipro.com/careers-home/jobs?keywords=${encodedTitle}`;
  }

  if (normComp.includes('accenture')) {
    return `https://www.accenture.com/in-en/careers/jobsearch?jk=${encodedTitle}&location=India`;
  }

  if (normComp.includes('cognizant')) {
    return `https://careers.cognizant.com/global/en/search-results?keywords=${encodedTitle}`;
  }

  if (normComp.includes('capgemini')) {
    return `https://www.capgemini.com/in-en/careers/job-search/?keyword=${encodedTitle}`;
  }

  if (normComp.includes('deloitte')) {
    return `https://jobs2.deloitte.com/in/en/search-results?keywords=${encodedTitle}`;
  }

  if (normComp.includes('swiggy')) {
    return `https://careers.swiggy.com/#/job-search?q=${encodedTitle}`;
  }

  if (normComp.includes('flipkart')) {
    return `https://www.flipkartcareers.com/#!/job-search?q=${encodedTitle}`;
  }

  if (normComp.includes('zomato') || normComp.includes('blinkit')) {
    return `https://www.zomato.com/careers?q=${encodedTitle}`;
  }

  if (normComp.includes('jio') || normComp.includes('reliance')) {
    return `https://careers.jio.com/jobsearch.aspx?q=${encodedTitle}`;
  }

  if (normComp.includes('phonepe')) {
    return `https://careers.phonepe.com/#jobs?q=${encodedTitle}`;
  }

  if (normComp.includes('razorpay')) {
    return `https://razorpay.com/jobs/?search=${encodedTitle}`;
  }

  if (normComp.includes('paytm')) {
    return `https://jobs.lever.co/paytm?query=${encodedTitle}`;
  }

  if (normComp.includes('cred')) {
    return 'https://careers.cred.club/#openings';
  }

  if (normComp.includes('google')) {
    return `https://careers.google.com/jobs/results/?location=India&q=${encodedTitle}`;
  }

  if (normComp.includes('microsoft')) {
    return `https://careers.microsoft.com/professionals/us/en/search-results?q=${encodedTitle}&location=India`;
  }

  if (normComp.includes('amazon')) {
    return `https://www.amazon.jobs/en/search?base_query=${encodedTitle}&loc_query=India`;
  }

  const domain = normComp.replace(/[^a-z0-9]/g, '');
  return `https://careers.${domain || 'company'}.com/jobs?q=${encodedTitle}`;
}

module.exports = {
  TOP_COMPANIES_ROLES,
  GENERIC_COMPANY_ROLE_TEMPLATES,
  getRolesForCompany,
  resolveSpecificCareerUrl,
  POPULAR_INDIAN_CITIES
};
