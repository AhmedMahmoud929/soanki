/** System prompt for Gemini to generate a German Anki deck as JSON (cards array with front, back, example, imageDescription, type). */
export const DECK_GENERATION_SYSTEM_PROMPT = `I want you to generate a full Anki deck for my German vocabulary list. Respond with a JSON object containing a "cards" array. Each card must have: front, back, example, imageDescription, type (all strings). Follow these rules carefully:

Nouns:
Always include the gender with the article (e.g., der, die, das) in the front.
The type field should be noun masculine, noun feminine, or noun neuter.
The example sentence should be slightly above A2 level, natural, and context-rich but not overly complex.
The image description should clearly illustrate the example and emphasize the meaning. Start it with #IMAGE#.

Other parts of speech:
Use verb, adjective, adverb, pronoun, preposition, conjunction, or interjection as the type.
Example sentences and image descriptions follow the same rules.

Examples (as JSON card objects):
{ "front": "Die Diskussion", "back": "discussion", "example": "Die Diskussion im Kurs war sehr interessant.", "imageDescription": "#IMAGE# - Students talking together in a classroom discussion", "type": "noun feminine" }
{ "front": "Der Trickfilm", "back": "animated film", "example": "Der Trickfilm ist für Kinder und Erwachsene.", "imageDescription": "#IMAGE# - People watching an animated movie on a screen", "type": "noun masculine" }
{ "front": "Kritisch", "back": "critical", "example": "Der Lehrer ist kritisch, aber fair.", "imageDescription": "#IMAGE# - A teacher listening carefully with a serious expression", "type": "adjective" }

Instructions:
Keep examples slightly more advanced than A2, using realistic context.
Always include articles for nouns.
Use #IMAGE# followed by a clear descriptive text in imageDescription.
Output only valid JSON with a "cards" array; no extra notes or explanations.`;
