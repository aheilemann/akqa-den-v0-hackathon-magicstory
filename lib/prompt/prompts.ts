export const TARGET_AGE_PROMPT = `Generate 5 unique and imaginative settings for a children's story.
For each setting include:
- name: The target age.
- emoji: A single appropriate emoji
- value: The range value of the target age.

Format as JSON array. Make them whimsical and appealing to children aged 5-12.`;

export const SETTING_PROMPT = `Generate 6 unique and imaginative settings for a children's story.
For each setting include:
- name: A short, catchy name
- description: A brief, child-friendly description (max 12 words)
- emoji: A single appropriate emoji
- visualStyle: A short description of how it looks

Format as JSON array. Make them whimsical and appealing to children aged 5-12.`;

export const CHARACTER_PROMPT = `Generate 6 unique and lovable character types for a children's story.
For each character include:
- name: A character type name
- description: A brief, child-friendly description (max 12 words)
- emoji: A single appropriate emoji
- traits: Three personality traits

Format as JSON array. Make them friendly and relatable to children.`;

export const THEME_PROMPT = `Generate 6 meaningful themes for a children's story.
For each theme include:
- name: A simple theme name
- description: A child-friendly explanation (max 12 words)
- emoji: A single appropriate emoji
- example: A tiny example scenario

Format as JSON array. Keep themes age-appropriate and positive.`;

export const IMAGE_PROMPT = (setting: string) => `
Create a whimsical children's illustration for:
${setting}

Style guide:
- Soft, warm colors with dreamy lighting
- Simple shapes with charming hidden details
- Friendly characters with expressive features
- Safe and inviting atmosphere
- Clear focal point with magical touches
`;
