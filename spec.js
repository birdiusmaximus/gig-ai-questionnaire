window.QUESTIONNAIRE_SPEC = {
  "waveDefault": "GIG_01_2025",
  "intro": {
    "title": "GIG Health — AI Readiness",
    "help": "This short survey is designed to help us better understand how AI is currently being used across our organization and how people feel about it in their day-to-day work.\n\nYour responses are completely anonymous. There are no right or wrong answers, and this is not an assessment of performance or ability. We’re interested in your genuine experience based on what’s true for you right now, whether you use AI often, rarely, or not at all. The goal is to create a clearer, more realistic picture of where we are today, so we can make better decisions about tools, training, and support in the future.\n\nThank you for taking the time to share your perspective.",
    "beginLabel": "Begin"
  },
  "questions": [
    {
      "id": "Q01_YEARS_EXPERIENCE",
      "type": "slider",
      "required": true,
      "title": "How many years of professional experience do you have?",
      "help": "Please select the option that best reflects your total years of professional experience. This helps us understand how perceptions vary across experience levels.",
      "slider": {
        "min": 0,
        "max": 15,
        "step": 1,
        "tickEvery": 3,
        "labels": {
          "left": "0",
          "right": "15+"
        }
      }
    },
    {
      "id": "Q02_ROLE_CATEGORY",
      "type": "single",
      "required": true,
      "title": "Which role best describes your primary function?",
      "help": "Please choose the option that most closely reflects your day-to-day role. This helps us understand how perceptions vary across functions.",
      "options": [
        "Frontline (Designer, Animator, Editor, Developer, Copywriter)",
        "Management (Project Manager, Account Director)",
        "Team Lead (Art Director, Creative Director, Team Lead)",
        "Support Functions (Marketing, Finance, Operations)"
      ]
    },
    {
      "id": "Q03_AI_TOOL_AWARENESS",
      "type": "multi_grouped",
      "required": false,
      "title": "Which of the following AI tools or technologies have you heard of before?",
      "help": "Select any tools you recognise, even if you have not personally used them. This helps us understand general awareness across the team.",
      "groups": [
        {
          "key": "Copywriting, Ideas and Productivity",
          "items": [
            "ChatGPT",
            "Claude",
            "Native Zoom/Teams AI Tools"
          ],
          "allowOther": true
        },
        {
          "key": "Image Generation & Editing",
          "items": [
            "Midjourney",
            "NanoBanana",
            "DALL-E",
            "Deedream",
            "Native Adobe AI Tools"
          ],
          "allowOther": true
        },
        {
          "key": "Video & Animation",
          "items": [
            "Sora",
            "Runway",
            "Wan",
            "Kling",
            "Seedance",
            "EBSynth",
            "Tripo AI",
            "Native Adobe AI Tools"
          ],
          "allowOther": true
        },
        {
          "key": "Development",
          "items": [
            "Replit",
            "Lovable"
          ],
          "allowOther": true
        }
      ]
    },
    {
      "id": "Q04_AI_TOOL_USAGE",
      "type": "multi_grouped_expand",
      "required": false,
      "title": "Which of the following AI tools do you currently use in your work?",
      "help": "Please select only the tools you use with some regularity in your day-to-day work.",
      "groups": [
        {
          "key": "Copywriting, Ideas and Productivity",
          "items": [
            "ChatGPT",
            "Claude",
            "Native Zoom/Teams AI Tools"
          ],
          "allowOther": true
        },
        {
          "key": "Image Generation & Editing",
          "items": [
            "Midjourney",
            "NanoBanana",
            "DALL-E",
            "Deedream",
            "Native Adobe AI Tools"
          ],
          "allowOther": true
        },
        {
          "key": "Video & Animation",
          "items": [
            "Sora",
            "Runway",
            "Wan",
            "Kling",
            "Seedance",
            "EBSynth",
            "Tripo AI",
            "Native Adobe AI Tools"
          ],
          "allowOther": true
        },
        {
          "key": "Development",
          "items": [
            "Replit",
            "Lovable"
          ],
          "allowOther": true
        }
      ]
    },
    {
      "id": "Q05_CONFIDENCE",
      "type": "slider",
      "required": true,
      "title": "How confident do you feel using AI tools in your work?",
      "help": "Rate your overall confidence based on your current skills and comfort level.",
      "slider": {
        "min": 0,
        "max": 10,
        "step": 1,
        "tickEvery": 2,
        "labels": {
          "left": "Not confident at all",
          "right": "Extremely confident"
        }
      }
    },
    {
      "id": "Q06_PRODUCTIVITY_IMPACT",
      "type": "slider",
      "required": true,
      "title": "How has using AI affected your efficiency and productivity?",
      "help": "Consider whether AI tools currently slow you down, make no difference, or help you work more efficiently.",
      "slider": {
        "min": -10,
        "max": 10,
        "step": 1,
        "tickEvery": 5,
        "labels": {
          "left": "Very negative impact",
          "mid": "No overall impact",
          "right": "Very positive impact"
        }
      }
    },
    {
      "id": "Q07_CREATIVITY_IMPACT",
      "type": "slider",
      "required": true,
      "title": "How has using AI affected your capacity for creativity?",
      "help": "Think about idea generation, exploration, and creative confidence.",
      "slider": {
        "min": -10,
        "max": 10,
        "step": 1,
        "tickEvery": 5,
        "labels": {
          "left": "Strongly limits creativity",
          "mid": "No overall impact",
          "right": "Strongly enhances creativity"
        }
      }
    },
    {
      "id": "Q08_WORKFLOW_POTENTIAL",
      "type": "timeline_multi",
      "required": true,
      "title": "Where do you see the greatest potential for AI to support the workflow of your organization?",
      "help": "Select the stages of a project where AI could be most valuable in the future.",
      "nodes": [
        "Organizational Operations",
        "Marketing & Client Outreach",
        "Insights & Research",
        "Idea Generation",
        "Moodboards & Art Direction",
        "Project Planning",
        "Asset Development",
        "Final Content Production"
      ]
    },
    {
      "id": "Q09_ORG_READINESS",
      "type": "slider",
      "required": true,
      "title": "How ready do you feel your organization is to adopt and use AI effectively in its workflows?",
      "help": "Consider tools, processes, guidance, and culture — not just individual skill.",
      "slider": {
        "min": 0,
        "max": 10,
        "step": 1,
        "tickEvery": 2,
        "labels": {
          "left": "Not ready at all",
          "right": "Fully ready"
        }
      }
    },
    {
      "id": "Q10_BARRIERS",
      "type": "multi",
      "required": true,
      "title": "What factors currently limit or slow down your use of AI at work?",
      "help": "Select all that apply based on your personal experience.",
      "options": [
        "Lack of Training",
        "Unclear Guidance or Policy",
        "Quality or Accuracy Concerns",
        "Security or Confidentiality Concerns",
        "Time Required to Learn Tools",
        "Cost or Access Limitations",
        "Uncertainty About When AI Should be Used",
        "Lack of Prompting Quality",
        "Personal Beliefs"
      ]
    },
    {
      "id": "Q11_ATTITUDE",
      "type": "slider",
      "required": true,
      "title": "Overall, how do you feel about AI technology and its influence on the industry?",
      "help": "This question captures your general emotional attitude toward AI.",
      "slider": {
        "min": -10,
        "max": 10,
        "step": 1,
        "tickEvery": 5,
        "labels": {
          "left": "Very Negative",
          "mid": "Neutral",
          "right": "Very Positive"
        }
      }
    },
    {
      "id": "Q12_REFLECTION",
      "type": "text",
      "required": true,
      "title": "In one sentence, how would you describe your personal view of AI?",
      "help": "Please keep this brief. Your response will be anonymised and grouped into themes.",
      "text": {
        "maxChars": 240,
        "placeholder": "Write your response…"
      }
    }
  ]
};
