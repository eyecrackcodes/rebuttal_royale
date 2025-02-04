import React from 'react';
import { Phone, Shield, Star, Target } from "lucide-react";
import { TrainingSection } from "@/types/training";

export const TRAINING_SECTIONS: TrainingSection[] = [
  {
    id: 'intake',
    title: 'Initial Contact',
    description: 'Master the complete intake process following the exact script',
    icon: <Phone className="w-6 h-6" />,
    modules: [
      {
        id: 'intake-beginner',
        title: 'Intake Process (Beginner)',
        description: 'Practice the standard intake flow',
        difficulty: 'BEGINNER',
        scenarios: [
          {
            agentScript: "Hello, this is [Name] with Luminary Life on a recorded line. How can I help you?",
            expectedResponse: "Exact greeting following compliance requirements",
            prospectResponse: [
              "I received something in the mail about final expense insurance",
              "I got your letter about life insurance coverage",
              "I'm calling about the insurance information"
            ],
            keyPhrases: ["Hello, this is", "with Luminary Life", "on a recorded line"],
            forbiddenPhrases: ["um", "uh", "yeah"],
            scoringCriteria: {
              tonality: {
                weight: 30,
                keyPhrases: ["thank you", "assist you"],
                forbiddenPhrases: ["yeah", "what", "huh"]
              },
              phrasing: {
                weight: 40,
                keyPhrases: ["thank you for calling", "Luminary Life", "how may I assist you"],
                forbiddenPhrases: ["hold on", "just a sec", "um"]
              },
              empathy: {
                weight: 30,
                keyPhrases: ["pleased to help", "happy to assist"],
                forbiddenPhrases: ["whatever", "anyway"]
              }
            },
            nextPrompt: "Perfect, let me get some information from you so we can look at some options! What's your first and last name?"
          },
          {
            agentScript: "Perfect, let me get some information from you so we can look at some options! What's your first and last name?",
            expectedResponse: "Smooth transition to name collection",
            prospectResponse: [
              "John Smith",
              "Mary Johnson",
              "Robert Williams",
              "Jane Davis"
            ],
            keyPhrases: ["Perfect", "first and last name"],
            forbiddenPhrases: ["um", "uh", "yeah"],
            scoringCriteria: {
              tonality: {
                weight: 30,
                keyPhrases: ["please"],
                forbiddenPhrases: ["hold on", "um"]
              },
              phrasing: {
                weight: 40,
                keyPhrases: ["first and last name"],
                forbiddenPhrases: ["um"]
              },
              empathy: {
                weight: 30,
                keyPhrases: ["pleased to help", "happy to assist"],
                forbiddenPhrases: ["whatever", "anyway"]
              }
            },
            nextPrompt: "And is this cell phone number I'm calling the best way to reach you?"
          },
          {
            agentScript: "And is this cell phone number I'm calling the best way to reach you?",
            expectedResponse: "Natural phone verification",
            prospectResponse: "Yes, this is my cell phone",
            keyPhrases: ["cell phone", "best way to reach you"],
            forbiddenPhrases: ["mobile", "um", "uh"],
            scoringCriteria: {
              tonality: {
                weight: 30,
                keyPhrases: ["cell phone", "best number", "reach you"],
                forbiddenPhrases: ["give me", "what's your"]
              },
              phrasing: {
                weight: 40,
                keyPhrases: ["cell phone", "best number", "reach you"],
                forbiddenPhrases: ["give me", "what's your"]
              },
              empathy: {
                weight: 30,
                keyPhrases: ["pleased to help", "happy to assist"],
                forbiddenPhrases: ["whatever", "anyway"]
              }
            }
          },
          {
            agentScript: "Great, I'm going to text you a link to my Bio! It has my direct contact info, my picture, my insurance license #, and if you like, you can read a little about me and the company.",
            expectedResponse: "Explain bio link purpose",
            prospectResponse: "Okay, that sounds good",
            keyPhrases: [
              "text you a link",
              "Bio",
              "direct contact info",
              "insurance license",
              "about me and the company"
            ],
            forbiddenPhrases: ["um", "uh", "yeah"],
            scoringCriteria: {
              tonality: {
                weight: 30,
                keyPhrases: ["thank you", "assist you"],
                forbiddenPhrases: ["yeah", "what", "huh"]
              },
              phrasing: {
                weight: 40,
                keyPhrases: ["thank you for calling", "Luminary Life", "how may I assist you"],
                forbiddenPhrases: ["hold on", "just a sec", "um"]
              },
              empathy: {
                weight: 30,
                keyPhrases: ["pleased to help", "happy to assist"],
                forbiddenPhrases: ["whatever", "anyway"]
              }
            }
          },
          {
            agentScript: "What is your home address?",
            expectedResponse: "Collect full address information",
            prospectResponse: [
              "4714 Hawkhaven Lane, Austin, Texas 78727",
              "2301 Oak Street, Austin, Texas 78701",
              "5500 Pine Road, Austin, Texas 78759",
              "8200 Meadow Lane, Austin, Texas 78745"
            ],
            keyPhrases: ["home address"],
            forbiddenPhrases: ["live", "um", "uh"],
            scoringCriteria: {
              tonality: {
                weight: 30,
                keyPhrases: ["please"],
                forbiddenPhrases: ["hold on", "um"]
              },
              phrasing: {
                weight: 40,
                keyPhrases: ["first and last name"],
                forbiddenPhrases: ["um"]
              },
              empathy: {
                weight: 30,
                keyPhrases: ["pleased to help", "happy to assist"],
                forbiddenPhrases: ["whatever", "anyway"]
              }
            }
          },
          {
            agentScript: "What is your email? I'd like to send you a recap after this call.",
            expectedResponse: "Request email with clear purpose",
            prospectResponse: [
              "john.smith@email.com",
              "mary.johnson@gmail.com",
              "robert.williams@yahoo.com",
              "jane.davis@hotmail.com"
            ],
            keyPhrases: ["email", "send you a recap"],
            forbiddenPhrases: ["um", "uh", "yeah"],
            scoringCriteria: {
              tonality: {
                weight: 30,
                keyPhrases: ["thank you", "assist you"],
                forbiddenPhrases: ["yeah", "what", "huh"]
              },
              phrasing: {
                weight: 40,
                keyPhrases: ["thank you for calling", "Luminary Life", "how may I assist you"],
                forbiddenPhrases: ["hold on", "just a sec", "um"]
              },
              empathy: {
                weight: 30,
                keyPhrases: ["pleased to help", "happy to assist"],
                forbiddenPhrases: ["whatever", "anyway"]
              }
            }
          }
        ],
        requiredScore: 70
      },
      {
        id: 'intake-intermediate',
        title: 'Intake Process (Intermediate)',
        description: 'Handle mild objections during intake',
        difficulty: 'INTERMEDIATE',
        scenarios: [
          {
            agentScript: "Hello, this is [Name] with Luminary Life on a recorded line. How can I help you?",
            expectedResponse: "Exact greeting following compliance requirements",
            prospectResponse: "Yeah, I got something about insurance but I'm not sure if I want to give out my information",
            keyPhrases: ["Hello, this is", "with Luminary Life", "on a recorded line"],
            forbiddenPhrases: ["um", "uh", "yeah"],
            scoringCriteria: {
              tonality: {
                weight: 30,
                keyPhrases: ["thank you", "assist you"],
                forbiddenPhrases: ["yeah", "what", "huh"]
              },
              phrasing: {
                weight: 40,
                keyPhrases: ["thank you for calling", "Luminary Life", "how may I assist you"],
                forbiddenPhrases: ["hold on", "just a sec", "um"]
              },
              empathy: {
                weight: 30,
                keyPhrases: ["pleased to help", "happy to assist"],
                forbiddenPhrases: ["whatever", "anyway"]
              }
            }
          },
          {
            agentScript: "I completely understand your concern. I just want to make sure I can provide you with accurate information. Would you be comfortable sharing just your first name to start?",
            expectedResponse: "Address privacy concern and ask for minimal information",
            prospectResponse: "Well... okay, my name is John",
            keyPhrases: ["understand your concern", "accurate information", "comfortable"],
            forbiddenPhrases: ["need", "must", "have to"],
            scoringCriteria: {
              tonality: {
                weight: 30,
                keyPhrases: ["please"],
                forbiddenPhrases: ["hold on", "um"]
              },
              phrasing: {
                weight: 40,
                keyPhrases: ["first and last name"],
                forbiddenPhrases: ["um"]
              },
              empathy: {
                weight: 30,
                keyPhrases: ["pleased to help", "happy to assist"],
                forbiddenPhrases: ["whatever", "anyway"]
              }
            }
          },
          {
            agentScript: "Thank you, John. And is this cell phone number I'm calling the best way to reach you?",
            expectedResponse: "Natural phone verification",
            prospectResponse: "Why do you need to know if it's a cell phone?",
            keyPhrases: ["best way to reach you", "cell phone"],
            forbiddenPhrases: ["required", "must", "have to"],
            scoringCriteria: {
              tonality: {
                weight: 30,
                keyPhrases: ["cell phone", "best number", "reach you"],
                forbiddenPhrases: ["give me", "what's your"]
              },
              phrasing: {
                weight: 40,
                keyPhrases: ["cell phone", "best number", "reach you"],
                forbiddenPhrases: ["give me", "what's your"]
              },
              empathy: {
                weight: 30,
                keyPhrases: ["pleased to help", "happy to assist"],
                forbiddenPhrases: ["whatever", "anyway"]
              }
            }
          },
          {
            agentScript: "Great question! I'd like to text you a link to my Bio with my license information and picture, so you can verify who I am. Would that be helpful?",
            expectedResponse: "Explain purpose of phone verification and build trust",
            prospectResponse: "Oh, I see. Yes, this is my cell phone.",
            keyPhrases: ["Bio", "license information", "verify who I am"],
            forbiddenPhrases: ["um", "uh", "yeah"],
            scoringCriteria: {
              tonality: {
                weight: 30,
                keyPhrases: ["thank you", "assist you"],
                forbiddenPhrases: ["yeah", "what", "huh"]
              },
              phrasing: {
                weight: 40,
                keyPhrases: ["thank you for calling", "Luminary Life", "how may I assist you"],
                forbiddenPhrases: ["hold on", "just a sec", "um"]
              },
              empathy: {
                weight: 30,
                keyPhrases: ["pleased to help", "happy to assist"],
                forbiddenPhrases: ["whatever", "anyway"]
              }
            }
          },
          {
            agentScript: "What's your home address where you'd want the coverage to be based?",
            expectedResponse: "Ask for address with context",
            prospectResponse: "I'd rather not give that until I know more about the prices",
            keyPhrases: ["coverage to be based", "home address"],
            forbiddenPhrases: ["need", "must", "required"],
            scoringCriteria: {
              tonality: {
                weight: 30,
                keyPhrases: ["please"],
                forbiddenPhrases: ["hold on", "um"]
              },
              phrasing: {
                weight: 40,
                keyPhrases: ["first and last name"],
                forbiddenPhrases: ["um"]
              },
              empathy: {
                weight: 30,
                keyPhrases: ["pleased to help", "happy to assist"],
                forbiddenPhrases: ["whatever", "anyway"]
              }
            }
          }
        ],
        requiredScore: 75
      },
      {
        id: 'intake-pro',
        title: 'Intake Process (Pro)',
        description: 'Master handling difficult intake situations',
        difficulty: 'ADVANCED',
        scenarios: [
          {
            agentScript: "Hello, this is [Name] with Luminary Life on a recorded line. How can I help you?",
            expectedResponse: "Professional greeting with strong presence",
            prospectResponse: "Look, I got something in the mail but I don't give out personal information over the phone. Just tell me the prices.",
            keyPhrases: ["Hello, this is", "with Luminary Life", "on a recorded line"],
            forbiddenPhrases: ["um", "uh", "yeah"],
            scoringCriteria: {
              tonality: {
                weight: 30,
                keyPhrases: ["thank you", "assist you"],
                forbiddenPhrases: ["yeah", "what", "huh"]
              },
              phrasing: {
                weight: 40,
                keyPhrases: ["thank you for calling", "Luminary Life", "how may I assist you"],
                forbiddenPhrases: ["hold on", "just a sec", "um"]
              },
              empathy: {
                weight: 30,
                keyPhrases: ["pleased to help", "happy to assist"],
                forbiddenPhrases: ["whatever", "anyway"]
              }
            }
          },
          {
            agentScript: "I absolutely respect your privacy. Let me explain - I'm a licensed agent, and I'd like to text you my license information and photo so you can verify who I am. Would that help you feel more comfortable?",
            expectedResponse: "Build trust and address privacy concerns head-on",
            prospectResponse: "Well... maybe. But why can't you just give me a quote first?",
            keyPhrases: ["licensed agent", "verify who I am", "feel more comfortable"],
            forbiddenPhrases: ["need", "must", "required"],
            scoringCriteria: {
              tonality: {
                weight: 30,
                keyPhrases: ["thank you", "assist you"],
                forbiddenPhrases: ["yeah", "what", "huh"]
              },
              phrasing: {
                weight: 40,
                keyPhrases: ["thank you for calling", "Luminary Life", "how may I assist you"],
                forbiddenPhrases: ["hold on", "just a sec", "um"]
              },
              empathy: {
                weight: 30,
                keyPhrases: ["pleased to help", "happy to assist"],
                forbiddenPhrases: ["whatever", "anyway"]
              }
            }
          },
          {
            agentScript: "I want to make sure I give you accurate pricing. These policies are customized based on age and location. Could we start with just your first name and age range?",
            expectedResponse: "Explain value of information gathering",
            prospectResponse: "Fine. I'm John, and I'm 65. Now what about the price?",
            keyPhrases: ["accurate pricing", "customized", "age range"],
            forbiddenPhrases: ["have to", "must", "requirement"],
            scoringCriteria: {
              tonality: {
                weight: 30,
                keyPhrases: ["thank you", "assist you"],
                forbiddenPhrases: ["yeah", "what", "huh"]
              },
              phrasing: {
                weight: 40,
                keyPhrases: ["thank you for calling", "Luminary Life", "how may I assist you"],
                forbiddenPhrases: ["hold on", "just a sec", "um"]
              },
              empathy: {
                weight: 30,
                keyPhrases: ["pleased to help", "happy to assist"],
                forbiddenPhrases: ["whatever", "anyway"]
              }
            }
          },
          {
            agentScript: "Thanks John. Since this is a cell phone, I'll text you my license info right now. Then I can show you some options based on your situation. What state are you in?",
            expectedResponse: "Build momentum while gathering information",
            prospectResponse: "I'm in Texas, but I'm still not sure about giving my address...",
            keyPhrases: ["text you my license", "based on your situation"],
            forbiddenPhrases: ["need address", "must have", "required"],
            scoringCriteria: {
              tonality: {
                weight: 30,
                keyPhrases: ["thank you", "assist you"],
                forbiddenPhrases: ["yeah", "what", "huh"]
              },
              phrasing: {
                weight: 40,
                keyPhrases: ["thank you for calling", "Luminary Life", "how may I assist you"],
                forbiddenPhrases: ["hold on", "just a sec", "um"]
              },
              empathy: {
                weight: 30,
                keyPhrases: ["pleased to help", "happy to assist"],
                forbiddenPhrases: ["whatever", "anyway"]
              }
            }
          },
          {
            agentScript: "I understand your concern. The address helps us verify coverage areas and ensure you get the best rate. I'm already seeing some good options for Texas residents in your age range.",
            expectedResponse: "Address objection while demonstrating value",
            prospectResponse: "Alright, I guess that makes sense. It's 4714 Hawkhaven Ln, Austin, 78727",
            keyPhrases: ["verify coverage", "best rate", "seeing some good options"],
            forbiddenPhrases: ["required", "must", "have to"],
            scoringCriteria: {
              tonality: {
                weight: 30,
                keyPhrases: ["thank you", "assist you"],
                forbiddenPhrases: ["yeah", "what", "huh"]
              },
              phrasing: {
                weight: 40,
                keyPhrases: ["thank you for calling", "Luminary Life", "how may I assist you"],
                forbiddenPhrases: ["hold on", "just a sec", "um"]
              },
              empathy: {
                weight: 30,
                keyPhrases: ["pleased to help", "happy to assist"],
                forbiddenPhrases: ["whatever", "anyway"]
              }
            }
          }
        ],
        requiredScore: 80
      }
    ],
    requiredScore: 70,
    completionPhrases: [
      "Here's what we'll do over the next few minutes",
      "Let me walk you through what happens next",
      "Let me explain how we'll proceed"
    ]
  }
]; 