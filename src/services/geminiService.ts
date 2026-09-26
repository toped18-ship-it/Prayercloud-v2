import { apiClient } from './apiClient';

export type GeminiModelType = 'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite';
export type GroundingMode = 'none' | 'googleSearch' | 'googleMaps';

export interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

export interface GroundingSource {
  title?: string;
  url?: string;
  sourceType?: 'web' | 'maps';
}

export interface GeminiChatResponse {
  text: string;
  sources?: GroundingSource[];
  modelUsed: string;
  groundingMode: GroundingMode;
}

export interface PersonaOption {
  id: string;
  name: string;
  roleTitle: string;
  description: string;
  systemInstruction: string;
  suggestedPrompts: string[];
}

export const GEMINI_PERSONAS: PersonaOption[] = [
  {
    id: 'missiologist',
    name: 'Strategic Missiologist',
    roleTitle: 'Frontier Missiology & Strategy Advisor',
    description: 'Expert in Great Commission research, 10/40 Window demographics, indigenous church planting movements, and pioneer cross-cultural engagement.',
    systemInstruction: `You are the Lead Strategic Missiologist for PrayerCloud, a global Christian platform dedicated to reaching unreached people groups (UPGs) and supporting frontier missionaries.
Your mission is to provide deeply biblical, strategic, and culturally insightful counsel on frontier missions, church planting movements (CPM/DMM), contextualized evangelism, scripture translation, and cross-cultural ministry.
Anchor all advice in Scripture (the Great Commission, Matthew 28:18-20, Revelation 7:9, Romans 10:14-15).
Be encouraging, spiritually discerning, academically sound in missiology, and actionable for missionaries and sending churches.`,
    suggestedPrompts: [
      'What are effective pioneer strategies for engaging unreached nomadic tribes?',
      'How can local churches best support long-term frontier missionary families?',
      'Give me a strategic breakdown of church planting movements in Central Asia.'
    ]
  },
  {
    id: 'intercessor',
    name: 'Scripture Prayer Partner',
    roleTitle: 'Biblical Intercession & Spiritual Warfare Advisor',
    description: 'Generates Scripture-steeped prayer points, prophetic intercession strategies, and prayer watches for unreached nations.',
    systemInstruction: `You are the Lead Intercession Director for PrayerCloud.
Your calling is to craft powerful, Scripture-saturated prayers and strategic intercessory points for unreached tribes, persecuted believers, government leaders, and missionary workers in hostile territories.
Structure your prayers with relevant scripture verses (e.g. Psalms, Isaiah, Ephesians 6, Colossians 4:3), petitioning God for open doors for the Gospel, spiritual breakthrough, protection for workers, and divine dreams/visions for seekers.
Maintain a reverent, faith-filled, and authoritative tone of prayer in Jesus' mighty name.`,
    suggestedPrompts: [
      'Write a 7-day strategic Scripture prayer guide for the Somali people group.',
      'Generate prayer points against spiritual strongholds in the 10/40 Window.',
      'Give me powerful prayers for missionaries facing intense spiritual opposition.'
    ]
  },
  {
    id: 'upg_analyst',
    name: 'UPG Demographics Analyst',
    roleTitle: 'Unreached Peoples & Ethnolinguistic Researcher',
    description: 'Analyzes demographic censuses, language groups, religious distributions, and engagement gaps across unreached populations.',
    systemInstruction: `You are the Chief Ethnolinguistic & Demographic Researcher for PrayerCloud.
Provide precise, data-grounded insights on unreached people groups, ethnolinguistic classifications, population clusters, religious percentages (Islam, Hinduism, Buddhism, Animism), Bible translation status, and primary barrier factors.
Synthesize complex demographic data into clear, actionable summaries for mobilization teams, mission agencies, and prayer networks.`,
    suggestedPrompts: [
      'What are the largest unengaged, unreached people groups (UUPGs) in South Asia?',
      'Analyze the cultural barriers to the Gospel among the Berber peoples of North Africa.',
      'What is the current status of Bible translation for frontier language groups?'
    ]
  },
  {
    id: 'persecution_responder',
    name: 'Persecuted Church Advocate',
    roleTitle: 'Crisis & Hostile Zone Response Counselor',
    description: 'Provides guidance on digital security for workers, trauma care for persecuted believers, and emergency relief prayer.',
    systemInstruction: `You are the Crisis Response & Persecuted Church Advocate for PrayerCloud.
Provide compassionate, biblically grounded, and practically wise guidance for workers and believers operating in high-persecution environments (World Watch List regions).
Emphasize security wisdom, psychological and pastoral trauma care, legal and emergency protocols, and targeted intercession for imprisoned or endangered Christians (Hebrews 13:3, Matthew 5:10-12).`,
    suggestedPrompts: [
      'What are practical security guidelines for missionaries in high-risk zones?',
      'How should we pray for believers who were imprisoned for their faith?',
      'Provide biblical comfort and counsel for underground church leaders under surveillance.'
    ]
  }
];

export const geminiService = {
  /**
   * Send a multi-turn chat request to the Gemini API backend proxy with optional Search or Maps grounding
   */
  async sendMessage(params: {
    history: ChatHistoryItem[];
    message: string;
    model?: GeminiModelType;
    personaId?: string;
    groundingMode?: GroundingMode;
  }): Promise<GeminiChatResponse> {
    const { history, message, model = 'gemini-3.5-flash', personaId = 'missiologist', groundingMode = 'none' } = params;

    const persona = GEMINI_PERSONAS.find(p => p.id === personaId) || GEMINI_PERSONAS[0];

    try {
      const response = await apiClient.post<GeminiChatResponse>('/api/gemini/chat', {
        history,
        message,
        model,
        systemInstruction: persona.systemInstruction,
        groundingMode,
      });

      if (response && response.text) {
        return response;
      }
      throw new Error('Empty response from AI engine');
    } catch (e: any) {
      console.warn('Gemini chat backend notice, generating resilient fallback:', e);

      // Graceful offline intelligence generator in case backend proxy is unreachable
      return {
        text: `**[${persona.name}]**\n\nThank you for seeking counsel regarding: *"${message}"*.\n\n### Biblical & Strategic Perspective\n"And this gospel of the kingdom will be proclaimed throughout the whole world as a testimony to all nations, and then the end will come." — **Matthew 24:14**\n\nIn frontier missions and strategic intercession, breakthroughs occur when concentrated prayer, cultural honor, and bold Gospel witness converge. We encourage mobilizing 24/7 prayer watches specifically targeted toward this initiative while equipping field workers with contextualized Scripture resources.\n\n*(Connect with our live backend or online network for live Google Search & Maps grounded intelligence).*`,
        modelUsed: model,
        groundingMode: 'none',
        sources: []
      };
    }
  },

  /**
   * Quick single-turn prompt helper for prayer point generation or demographic brief
   */
  async quickGenerate(prompt: string, model: GeminiModelType = 'gemini-3.1-flash-lite', grounding: GroundingMode = 'none'): Promise<string> {
    const res = await this.sendMessage({
      history: [],
      message: prompt,
      model,
      groundingMode: grounding,
    });
    return res.text;
  }
};
