// Types for better type safety
export interface Question {
  id: string;
  text: string;
  options: { value: string; label: string }[];
  type: 'checkbox' | 'radio';
}

export interface IllegalHarm {
  id: string;
  name: string;
  description?: string;
  impact?: string;
}

export interface RiskFactorInfo {
  id: string;
  name: string;
  description: string;
  relatedHarms: string[];
}

export interface SafetyMeasure {
  reference: string;
  name: string;
  condition: string;
  description: string;
  conditionType: 'highRiskCount' | 'specificHarmHighRisk' | 'largeServiceAndHighRisk';
  conditionData: {
    minCount?: number;
    harmId?: string;
  };
}

export interface RiskLevels {
  [harmId: string]: 'High' | 'Medium' | 'Low';
}

export interface QuestionnaireAnswers {
  q1?: string[];
  q2?: string[];
  q3?: 'smallService' | 'largeService';
  [key: string]: any;
}

// Note for candidates: When a user selects "700,000 or more" for question 3,
// this means the service should be considered a "Large Service" for the purpose
// of safety measure conditions (e.g., "Large service AND High risk of Hate")
export const questionnaireData = {
  questions: [
    {
      id: 'q1',
      text: 'Is your service any of the following service types?',
      options: [
        { value: 'socialMedia', label: 'Social media service' },
        { value: 'gaming', label: 'Gaming service' },
        { value: 'marketplace', label: 'Marketplace or listing service' },
      ],
      type: 'checkbox',
    },
    {
      id: 'q2',
      text: 'Does your service have any of the following functionalities that allow users to communicate with one another?',
      options: [
        { value: 'directMessaging', label: 'Direct messaging' },
        { value: 'commenting', label: 'Commenting on content' },
        { value: 'postingImages', label: 'Posting or sending images or videos' },
      ],
      type: 'checkbox',
    },
    {
      id: 'q3',
      text: 'How many monthly active UK users does your service have?',
      options: [
        { value: 'smallService', label: 'Less than 700,000' },
        { value: 'largeService', label: '700,000 or more i.e. Large service' },
      ],
      type: 'radio',
    },
  ],
};

export const illegalHarms: IllegalHarm[] = [
  { id: 'terrorism', name: 'Terrorism' },
  { id: 'hate', name: 'Hate' },
  { id: 'harassment', name: 'Harassment, stalking threats and abuse' },
  { id: 'drugs', name: 'Drugs and psychoactive substances' },
];

// This object maps risk factors to the illegal harms they are associated with
// When implementing filtering logic, use this to determine which illegal harms
// are relevant for each risk factor identified from the questionnaire answers
export const riskFactors: Record<string, string[]> = {
  socialMedia: ['terrorism', 'hate', 'harassment', 'drugs'],
  gaming: ['terrorism', 'harassment'],
  marketplace: ['terrorism', 'drugs'],
  directMessaging: ['hate', 'harassment'],
  commenting: ['hate', 'harassment'],
  postingImages: ['terrorism', 'hate', 'drugs'],
  largeService: ['terrorism', 'hate', 'harassment', 'drugs'],
};

export const riskFactorDescriptions: RiskFactorInfo[] = [
  {
    id: 'socialMedia',
    name: 'Social media services',
    description:
      'Research shows that social media services can increase the risk of all kinds of illegal harm. This may be due to more research on social media services, or greater probability of risk due to the wide range of functionalities and features on many social media services.',
    relatedHarms: ['terrorism', 'hate', 'harassment', 'drugs'],
  },
  {
    id: 'gaming',
    name: 'Gaming services',
    description:
      "If your service is a gaming service, you should consider how it may bring potential perpetrators in contact with other users and may create a space where potentially illegal behaviour is normalised. Gaming services can allow hateful content to spread and become sites of 'normalised harassment', where name-calling or insults are part of user interactions. Gaming services can also be created and modified by terrorist organisations as recruitment tools.",
    relatedHarms: ['terrorism', 'harassment'],
  },
  {
    id: 'marketplace',
    name: 'Marketplace or listing services',
    description:
      'If your service is a marketplace or listings service, you should consider how your service may be used by potential perpetrators to sell or buy illegal goods or services. They are often used in purchase scams in fraud offences and can also be used to raise funds that are used for potentially illegal purposes such as terrorist activities. The ability to make online payments on online marketplaces or listing services can increase the risk of harm.',
    relatedHarms: ['terrorism', 'drugs'],
  },
  {
    id: 'directMessaging',
    name: 'Direct messaging',
    description:
      'There is a strong link between direct messaging and various offences due to the closed nature of these messages. While direct messaging can enable users to protect their privacy, direct messaging can be used to facilitate offences or share illegal content in a way that is not immediately visible to the public.',
    relatedHarms: ['hate', 'harassment'],
  },
  {
    id: 'commenting',
    name: 'Commenting on content',
    description:
      "Commenting on content can enable potential perpetrators to target users who share content and to amplify or signpost to existing illegal content. For example, potential perpetrators may share comments containing hateful content on a user's post, sometimes with a coordinated group of users, as a means of targeting the user who posted the content.",
    relatedHarms: ['hate', 'harassment'],
  },
  {
    id: 'postingImages',
    name: 'Posting images or videos',
    description:
      "Posting images or videos can allow potential perpetrators to share illegal content with many users in open channels of communication. Posting images is a key functionality in the commission of image-based offences, for example, users may be able to post 'memes' that include terrorist or hateful content.",
    relatedHarms: ['terrorism', 'hate', 'drugs'],
  },
  {
    id: 'largeService',
    name: 'Large service',
    description:
      'Services with 700,000 or more monthly active UK users are considered large services. Large services may have greater resources to implement safety measures but also have a greater potential impact if illegal content is shared on their platform.',
    relatedHarms: ['terrorism', 'hate', 'harassment', 'drugs'],
  },
];

export const safetyMeasures: SafetyMeasure[] = [
  {
    reference: 'M1',
    name: 'Enhanced Content Moderation',
    condition: "2 illegal harms assigned 'High' risk",
    description: 'Implement real-time automated content moderation and expand human review coverage.',
    conditionType: 'highRiskCount',
    conditionData: {
      minCount: 2,
    },
  },
  {
    reference: 'M2',
    name: 'Terrorism Response Protocol',
    condition: 'High risk of Terrorism',
    description: 'Establish a rapid escalation and takedown process for terrorist content, including staff training.',
    conditionType: 'specificHarmHighRisk',
    conditionData: {
      harmId: 'terrorism',
    },
  },
  {
    reference: 'M3',
    name: 'Community Reporting Boost',
    condition: 'Large service AND High risk of Hate',
    description: 'Increase visibility and ease of user reporting tools, with prioritisation for hate-related content.',
    conditionType: 'largeServiceAndHighRisk',
    conditionData: {
      harmId: 'hate',
    },
  },
  {
    reference: 'M4',
    name: 'Restricted Media Sharing',
    condition: 'High risk of Drugs and psychoactive substances',
    description: 'Limit the ability to post or share images/videos in high-risk contexts or implement pre-screening.',
    conditionType: 'specificHarmHighRisk',
    conditionData: {
      harmId: 'drugs',
    },
  },
  {
    reference: 'M5',
    name: 'Private Messaging Safeguards',
    condition: 'High risk of Harassment, stalking threats and abuse',
    description: 'Introduce keywords detection and friction (e.g., message prompts) in direct messages to reduce abuse',
    conditionType: 'specificHarmHighRisk',
    conditionData: {
      harmId: 'harassment',
    },
  },
];
