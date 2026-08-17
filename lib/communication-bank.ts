// ─────────────────────────────────────────────────────────────────────────────
// COMMUNICATION BANK — 400 Questions across 4 topics
// Topics: Direct & Indirect Speech, Active & Passive Voice,
//         Sentence Improvement, Idioms & Phrases
// ─────────────────────────────────────────────────────────────────────────────

export interface CommQ {
  id: string
  section: "verbal"
  topic: string
  difficulty: "Medium" | "Hard"
  question: string
  options: string[]
  correct: number
  explanation: string
}

export const COMMUNICATION_BANK: CommQ[] = [

// ─────────────────────────────────────────────────────────────────────────────
// DIRECT & INDIRECT SPEECH — 100 Questions (DIS001–DIS100)
// ─────────────────────────────────────────────────────────────────────────────

{ id:"DIS001", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I am busy."',
  options:["He said that he was busy.","He said that he is busy.","He said that I was busy.","He said that he had been busy."],
  correct:0, explanation:"Present Simple changes to Past Simple in reported speech." },

{ id:"DIS002", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "I have finished my work."',
  options:["She said that she has finished her work.","She said that she had finished her work.","She said that she finished her work.","She said that she was finishing her work."],
  correct:1, explanation:"Present Perfect changes to Past Perfect." },

{ id:"DIS003", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I will come tomorrow."',
  options:["He said that he will come the next day.","He said that he would come the next day.","He said that he would come tomorrow.","He said that he will come tomorrow."],
  correct:1, explanation:"'Will' changes to 'would'; 'tomorrow' changes to 'the next day'." },

{ id:"DIS004", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "I am going to the market."',
  options:["She said that she is going to the market.","She said that she was going to the market.","She said that she had gone to the market.","She said that she went to the market."],
  correct:1, explanation:"Present Continuous changes to Past Continuous." },

{ id:"DIS005", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said to me, "Where do you live?"',
  options:["He asked me where I lived.","He asked me where did I live.","He asked me where do I live.","He told me where I lived."],
  correct:0, explanation:"In reported questions, use statement word order and change the tense." },

{ id:"DIS006", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "Please help me."',
  options:["She asked me to help her.","She told me to help her.","She ordered me to help her.","She said me to help her."],
  correct:0, explanation:"Polite requests with 'please' become 'asked + to-infinitive'." },

{ id:"DIS007", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I can solve this problem."',
  options:["He said that he can solve that problem.","He said that he could solve that problem.","He said that he could solve this problem.","He said that he can solve this problem."],
  correct:1, explanation:"'Can' changes to 'could'; 'this' changes to 'that'." },

{ id:"DIS008", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "I may come."',
  options:["She said that she may come.","She said that she might come.","She said that she may came.","She said that she might came."],
  correct:1, explanation:"'May' changes to 'might'." },

{ id:"DIS009", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I have been working hard."',
  options:["He said that he has been working hard.","He said that he had been working hard.","He said that he was working hard.","He said that he worked hard."],
  correct:1, explanation:"Present Perfect Continuous changes to Past Perfect Continuous." },

{ id:"DIS010", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said to him, "Do you know the answer?"',
  options:["She asked him if he knew the answer.","She asked him if he knows the answer.","She asked him did he know the answer.","She told him if he knew the answer."],
  correct:0, explanation:"Yes/No questions use 'if/whether' + statement order." },

{ id:"DIS011", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I must leave now."',
  options:["He said that he must leave then.","He said that he had to leave then.","He said that he must leave now.","Both A and B"],
  correct:3, explanation:"'Must' can remain or change to 'had to' depending on context." },

{ id:"DIS012", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "I shall return soon."',
  options:["She said that she should return soon.","She said that she would return soon.","She said that she shall return soon.","She said that she will return soon."],
  correct:1, explanation:"'Shall' (for future) usually changes to 'would'." },

{ id:"DIS013", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I wrote a letter yesterday."',
  options:["He said that he wrote a letter the previous day.","He said that he had written a letter the previous day.","He said that he has written a letter the previous day.","He said that he wrote a letter yesterday."],
  correct:1, explanation:"Past Simple often changes to Past Perfect; 'yesterday' → 'the previous day'." },

{ id:"DIS014", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "I was watching TV."',
  options:["She said that she was watching TV.","She said that she had been watching TV.","She said that she has been watching TV.","She said that she watched TV."],
  correct:1, explanation:"Past Continuous often changes to Past Perfect Continuous." },

{ id:"DIS015", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said to her, "What is your name?"',
  options:["He asked her what was her name.","He asked her what her name was.","He asked her what is her name.","He told her what her name was."],
  correct:1, explanation:"Wh-questions use statement word order in reported speech." },

{ id:"DIS016", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "Don\'t touch that."',
  options:["She told me not to touch that.","She ordered me not to touch that.","She asked me not to touch that.","All of the above (depending on tone)"],
  correct:3, explanation:"Negative imperatives become 'not to + infinitive'; reporting verb depends on context." },

{ id:"DIS017", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I am leaving today."',
  options:["He said that he was leaving that day.","He said that he is leaving today.","He said that he was leaving today.","He said that he had left that day."],
  correct:0, explanation:"'Today' changes to 'that day'." },

{ id:"DIS018", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "I can speak French."',
  options:["She said that she can speak French.","She said that she could speak French.","She said that she could spoke French.","She said that she can spoke French."],
  correct:1, explanation:"'Can' changes to 'could'." },

{ id:"DIS019", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I may not attend the meeting."',
  options:["He said that he may not attend the meeting.","He said that he might not attend the meeting.","He said that he may not attended the meeting.","He said that he might not attended the meeting."],
  correct:1, explanation:"'May' changes to 'might'." },

{ id:"DIS020", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said to me, "Are you free?"',
  options:["She asked me if I was free.","She asked me if I am free.","She asked me was I free.","She told me if I was free."],
  correct:0, explanation:"Yes/No question → if/whether + statement order + tense change." },

{ id:"DIS021", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I have to go now."',
  options:["He said that he has to go then.","He said that he had to go then.","He said that he have to go then.","He said that he had to go now."],
  correct:1, explanation:"'Have to' changes to 'had to'; 'now' → 'then'." },

{ id:"DIS022", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "I will help you."',
  options:["She said that she will help me.","She said that she would help me.","She said that she would help you.","She said that she will help you."],
  correct:1, explanation:"'Will' → 'would'; pronoun 'you' changes according to context." },

{ id:"DIS023", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I was born in 1990."',
  options:["He said that he was born in 1990.","He said that he had been born in 1990.","He said that he is born in 1990.","He said that he has been born in 1990."],
  correct:0, explanation:"Historical facts or permanent situations often remain in the same tense." },

{ id:"DIS024", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "The sun rises in the east."',
  options:["She said that the sun rose in the east.","She said that the sun rises in the east.","She said that the sun had risen in the east.","She said that the sun is rising in the east."],
  correct:1, explanation:"Universal truths remain in present tense." },

{ id:"DIS025", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said to her, "Why are you crying?"',
  options:["He asked her why she was crying.","He asked her why was she crying.","He asked her why is she crying.","He told her why she was crying."],
  correct:0, explanation:"Wh-question → statement order + tense change." },

{ id:"DIS026", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "Please wait here."',
  options:["She asked me to wait there.","She told me to wait there.","She ordered me to wait there.","All of the above (depending on tone)"],
  correct:3, explanation:"Requests become 'to-infinitive'; reporting verb varies with context." },

{ id:"DIS027", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I shall be there."',
  options:["He said that he should be there.","He said that he would be there.","He said that he shall be there.","He said that he will be there."],
  correct:1, explanation:"'Shall' for future usually becomes 'would'." },

{ id:"DIS028", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "I am reading a book."',
  options:["She said that she is reading a book.","She said that she was reading a book.","She said that she had been reading a book.","She said that she read a book."],
  correct:1, explanation:"Present Continuous → Past Continuous." },

{ id:"DIS029", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I have lost my keys."',
  options:["He said that he has lost his keys.","He said that he had lost his keys.","He said that he lost his keys.","He said that he was losing his keys."],
  correct:1, explanation:"Present Perfect → Past Perfect." },

{ id:"DIS030", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said to him, "Can you help me?"',
  options:["She asked him if he could help her.","She asked him if he can help her.","She asked him could he help her.","She told him if he could help her."],
  correct:0, explanation:"Yes/No question with modal → if + modal change + statement order." },

{ id:"DIS031", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I must finish this today."',
  options:["He said that he must finish that that day.","He said that he had to finish that that day.","Both A and B","He said that he must finish this today."],
  correct:2, explanation:"'Must' can stay or become 'had to'; time expressions change." },

{ id:"DIS032", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "I may join you later."',
  options:["She said that she may join us later.","She said that she might join us later.","She said that she may joined us later.","She said that she might joined us later."],
  correct:1, explanation:"'May' → 'might'." },

{ id:"DIS033", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I wrote the letter last week."',
  options:["He said that he wrote the letter the previous week.","He said that he had written the letter the previous week.","He said that he has written the letter the previous week.","He said that he wrote the letter last week."],
  correct:1, explanation:"Past Simple → Past Perfect; 'last week' → 'the previous week'." },

{ id:"DIS034", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "I was cooking dinner."',
  options:["She said that she was cooking dinner.","She said that she had been cooking dinner.","She said that she has been cooking dinner.","She said that she cooked dinner."],
  correct:1, explanation:"Past Continuous often → Past Perfect Continuous." },

{ id:"DIS035", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said to me, "When will you return?"',
  options:["He asked me when I would return.","He asked me when would I return.","He asked me when will I return.","He told me when I would return."],
  correct:0, explanation:"Wh-question → statement order + 'will' → 'would'." },

{ id:"DIS036", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "Don\'t be late."',
  options:["She told me not to be late.","She ordered me not to be late.","She asked me not to be late.","All of the above (depending on tone)"],
  correct:3, explanation:"Negative command → 'not to + infinitive'." },

{ id:"DIS037", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I am leaving tomorrow."',
  options:["He said that he was leaving the next day.","He said that he is leaving tomorrow.","He said that he was leaving tomorrow.","He said that he had left the next day."],
  correct:0, explanation:"'Tomorrow' → 'the next day'." },

{ id:"DIS038", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "I can drive a car."',
  options:["She said that she can drive a car.","She said that she could drive a car.","She said that she could drove a car.","She said that she can drove a car."],
  correct:1, explanation:"'Can' → 'could'." },

{ id:"DIS039", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I may be late."',
  options:["He said that he may be late.","He said that he might be late.","He said that he may been late.","He said that he might been late."],
  correct:1, explanation:"'May' → 'might'." },

{ id:"DIS040", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said to me, "Is it raining?"',
  options:["She asked me if it was raining.","She asked me if it is raining.","She asked me was it raining.","She told me if it was raining."],
  correct:0, explanation:"Yes/No question → if + statement order + tense change." },

{ id:"DIS041", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I have to submit the report."',
  options:["He said that he has to submit the report.","He said that he had to submit the report.","He said that he have to submit the report.","He said that he had to submitted the report."],
  correct:1, explanation:"'Have to' → 'had to'." },

{ id:"DIS042", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "I will call you later."',
  options:["She said that she will call me later.","She said that she would call me later.","She said that she would call you later.","She said that she will call you later."],
  correct:1, explanation:"'Will' → 'would'; pronoun adjustment." },

{ id:"DIS043", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I was born in Delhi."',
  options:["He said that he was born in Delhi.","He said that he had been born in Delhi.","He said that he is born in Delhi.","He said that he has been born in Delhi."],
  correct:0, explanation:"Permanent facts often remain unchanged." },

{ id:"DIS044", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "Water boils at 100°C."',
  options:["She said that water boiled at 100°C.","She said that water boils at 100°C.","She said that water had boiled at 100°C.","She said that water is boiling at 100°C."],
  correct:1, explanation:"Scientific truths remain in present tense." },

{ id:"DIS045", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said to her, "Where have you been?"',
  options:["He asked her where she had been.","He asked her where had she been.","He asked her where has she been.","He told her where she had been."],
  correct:0, explanation:"Wh-question with present perfect → statement order + past perfect." },

{ id:"DIS046", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "Please sit down."',
  options:["She asked me to sit down.","She told me to sit down.","She ordered me to sit down.","All of the above (depending on tone)"],
  correct:3, explanation:"Polite request → to-infinitive; reporting verb varies." },

{ id:"DIS047", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I shall do it."',
  options:["He said that he should do it.","He said that he would do it.","He said that he shall do it.","He said that he will do it."],
  correct:1, explanation:"'Shall' for future → 'would'." },

{ id:"DIS048", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said, "I am writing a letter."',
  options:["She said that she is writing a letter.","She said that she was writing a letter.","She said that she had been writing a letter.","She said that she wrote a letter."],
  correct:1, explanation:"Present Continuous → Past Continuous." },

{ id:"DIS049", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: He said, "I have seen that movie."',
  options:["He said that he has seen that movie.","He said that he had seen that movie.","He said that he saw that movie.","He said that he was seeing that movie."],
  correct:1, explanation:"Present Perfect → Past Perfect." },

{ id:"DIS050", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Medium",
  question:'Change into indirect speech: She said to him, "Will you come with me?"',
  options:["She asked him if he would come with her.","She asked him if he will come with her.","She asked him would he come with her.","She told him if he would come with her."],
  correct:0, explanation:"Yes/No question with 'will' → if + would + statement order." },

{ id:"DIS051", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "I wish I were rich."',
  options:["He said that he wished he were rich.","He said that he wished he was rich.","He said that he wishes he were rich.","He said that he had wished he were rich."],
  correct:0, explanation:"Subjunctive 'were' is retained after 'wish' in reported speech." },

{ id:"DIS052", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "If I had known, I would have helped."',
  options:["She said that if she had known, she would have helped.","She said that if she knew, she would help.","She said that if she has known, she would have helped.","She said that if she had known, she will have helped."],
  correct:0, explanation:"Third conditional remains largely unchanged in reported speech." },

{ id:"DIS053", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "Let us go for a walk."',
  options:["He suggested that they should go for a walk.","He proposed that they go for a walk.","He suggested going for a walk.","All of the above"],
  correct:3, explanation:"Suggestions with 'let us' can be reported in multiple acceptable ways." },

{ id:"DIS054", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "How beautiful the scenery is!"',
  options:["She exclaimed that the scenery was very beautiful.","She exclaimed with joy that the scenery was beautiful.","She said that the scenery was beautiful.","Both A and B"],
  correct:3, explanation:"Exclamatory sentences are reported with 'exclaimed' and often intensified." },

{ id:"DIS055", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "What a pleasant surprise!"',
  options:["He exclaimed that it was a pleasant surprise.","He exclaimed with surprise that it was pleasant.","Both A and B","He said that it was a pleasant surprise."],
  correct:2, explanation:"Exclamations are reported with appropriate reporting verbs and structure." },

{ id:"DIS056", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said to him, "Could you please open the window?"',
  options:["She requested him to open the window.","She asked him if he could open the window.","Both A and B","She ordered him to open the window."],
  correct:2, explanation:"Polite requests can be reported as 'requested + to-infinitive' or as questions." },

{ id:"DIS057", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "I must be there by 5 o\'clock."',
  options:["He said that he must be there by 5 o'clock.","He said that he had to be there by 5 o'clock.","Both A and B","He said that he must have been there by 5 o'clock."],
  correct:2, explanation:"Obligation 'must' can remain or change to 'had to'." },

{ id:"DIS058", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "I needn\'t go there."',
  options:["She said that she needn't go there.","She said that she didn't need to go there.","Both A and B","She said that she needn't have gone there."],
  correct:2, explanation:"'Needn't' can remain or become 'didn't need to'." },

{ id:"DIS059", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "I used to play cricket."',
  options:["He said that he used to play cricket.","He said that he had used to play cricket.","He said that he was used to play cricket.","He said that he had been used to play cricket."],
  correct:0, explanation:"'Used to' for past habits remains unchanged." },

{ id:"DIS060", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "I would rather stay at home."',
  options:["She said that she would rather stay at home.","She said that she would rather stayed at home.","She said that she had rather stay at home.","She said that she would rather to stay at home."],
  correct:0, explanation:"'Would rather' remains unchanged." },

{ id:"DIS061", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "It is time we left."',
  options:["He said that it was time they left.","He said that it is time they left.","He said that it was time they had left.","He said that it is time we left."],
  correct:0, explanation:"'It is time + past' becomes 'it was time + past'." },

{ id:"DIS062", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "I had better leave now."',
  options:["She said that she had better leave then.","She said that she had better left then.","She said that she has better leave then.","She said that she had better to leave then."],
  correct:0, explanation:"'Had better' remains; time expression changes." },

{ id:"DIS063", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "May you live long!"',
  options:["He prayed that she might live long.","He wished that she might live long.","Both A and B","He said that she may live long."],
  correct:2, explanation:"Optative sentences are reported with 'prayed/wished + might'." },

{ id:"DIS064", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "Would that I were a bird!"',
  options:["She wished that she were a bird.","She wished that she was a bird.","She said that she would be a bird.","She wished that she had been a bird."],
  correct:0, explanation:"Wish with 'would that' is reported with 'wished + were'." },

{ id:"DIS065", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "Let him try if he wants."',
  options:["He suggested that he should try if he wanted.","He said that he might try if he wanted.","Both A and B","He ordered him to try if he wanted."],
  correct:2, explanation:"'Let him' can be reported as suggestion or permission." },

{ id:"DIS066", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "I am going to buy a new car next month."',
  options:["She said that she was going to buy a new car the following month.","She said that she is going to buy a new car next month.","She said that she was going to buy a new car next month.","She said that she had been going to buy a new car the following month."],
  correct:0, explanation:"'Going to' future + time change ('next month' → 'the following month')." },

{ id:"DIS067", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "I have been living here since 2010."',
  options:["He said that he has been living there since 2010.","He said that he had been living there since 2010.","He said that he was living there since 2010.","He said that he lived there since 2010."],
  correct:1, explanation:"Present Perfect Continuous → Past Perfect Continuous; 'here' → 'there'." },

{ id:"DIS068", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said to me, "What were you doing at 8 pm yesterday?"',
  options:["She asked me what I had been doing at 8 pm the previous day.","She asked me what I was doing at 8 pm yesterday.","She asked me what had I been doing at 8 pm the previous day.","She asked me what I have been doing at 8 pm the previous day."],
  correct:0, explanation:"Past Continuous in question → Past Perfect Continuous; time expression changes." },

{ id:"DIS069", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "I must have left my keys at home."',
  options:["He said that he must have left his keys at home.","He said that he had to have left his keys at home.","He said that he must have left his keys at home (no change).","Both A and C"],
  correct:3, explanation:"Deduction with 'must have' usually remains unchanged." },

{ id:"DIS070", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "I can\'t have made such a mistake."',
  options:["She said that she couldn't have made such a mistake.","She said that she can't have made such a mistake.","She said that she could not have made such a mistake.","Both A and C"],
  correct:3, explanation:"'Can't have' for deduction becomes 'couldn't have'." },

{ id:"DIS071", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "I should have informed you earlier."',
  options:["He said that he should have informed me earlier.","He said that he should have informed you earlier.","He said that he should informed me earlier.","He said that he should have inform me earlier."],
  correct:0, explanation:"'Should have' remains; pronoun changes according to context." },

{ id:"DIS072", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "I ought to have helped him."',
  options:["She said that she ought to have helped him.","She said that she ought to have helped me.","She said that she ought have helped him.","She said that she ought to helped him."],
  correct:0, explanation:"'Ought to have' remains unchanged." },

{ id:"DIS073", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "I needn\'t have gone there."',
  options:["He said that he needn't have gone there.","He said that he didn't need to go there.","Both A and B (with slight difference in meaning)","He said that he needn't gone there."],
  correct:2, explanation:"'Needn't have' (unnecessary past action) can remain or be expressed differently." },

{ id:"DIS074", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "I dare not speak to him."',
  options:["She said that she dare not speak to him.","She said that she dared not speak to him.","Both A and B","She said that she dare not spoke to him."],
  correct:2, explanation:"'Dare not' can remain or change to 'dared not'." },

{ id:"DIS075", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "I would rather you stayed."',
  options:["He said that he would rather I stayed.","He said that he would rather I stay.","He said that he would rather I had stayed.","He said that he would rather you stayed."],
  correct:0, explanation:"'Would rather + past' remains; pronoun changes." },

{ id:"DIS076", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "It is high time we started."',
  options:["She said that it was high time they started.","She said that it is high time they started.","She said that it was high time they had started.","She said that it is high time we started."],
  correct:0, explanation:"'It is high time + past' → 'it was high time + past'." },

{ id:"DIS077", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "I had better not interfere."',
  options:["He said that he had better not interfere.","He said that he had better not interfered.","He said that he has better not interfere.","He said that he had better not to interfere."],
  correct:0, explanation:"'Had better' remains unchanged." },

{ id:"DIS078", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "Long live the king!"',
  options:["She prayed that the king might live long.","She wished that the king might live long.","Both A and B","She said that the king lives long."],
  correct:2, explanation:"Optative sentences → prayed/wished + might." },

{ id:"DIS079", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "Would that I had wings!"',
  options:["He wished that he had wings.","He wished that he has wings.","He said that he would have wings.","He wished that he had had wings."],
  correct:0, explanation:"Wish about present unreal situation remains with past tense." },

{ id:"DIS080", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "Let me try once more."',
  options:["She requested that she should be allowed to try once more.","She asked to be allowed to try once more.","Both A and B","She ordered to try once more."],
  correct:2, explanation:"'Let me' requests can be reported with 'asked/requested to be allowed'." },

{ id:"DIS081", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "I am going to start a new business next year."',
  options:["He said that he was going to start a new business the following year.","He said that he is going to start a new business next year.","He said that he was going to start a new business next year.","He said that he had been going to start a new business the following year."],
  correct:0, explanation:"'Going to' + time expression change." },

{ id:"DIS082", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "I have been waiting here for two hours."',
  options:["She said that she has been waiting there for two hours.","She said that she had been waiting there for two hours.","She said that she was waiting there for two hours.","She said that she waited there for two hours."],
  correct:1, explanation:"Present Perfect Continuous → Past Perfect Continuous; 'here' → 'there'." },

{ id:"DIS083", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said to me, "What had you done before I arrived?"',
  options:["He asked me what I had done before he arrived.","He asked me what had I done before he arrived.","He asked me what I have done before he arrived.","He asked me what I did before he arrived."],
  correct:0, explanation:"Past Perfect in question remains Past Perfect in reported speech." },

{ id:"DIS084", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "I must have forgotten the appointment."',
  options:["She said that she must have forgotten the appointment.","She said that she had to have forgotten the appointment.","She said that she must have forgotten the appointment (no change).","Both A and C"],
  correct:3, explanation:"Deduction with 'must have' usually remains." },

{ id:"DIS085", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "I can\'t have been so careless."',
  options:["He said that he couldn't have been so careless.","He said that he can't have been so careless.","He said that he could not have been so careless.","Both A and C"],
  correct:3, explanation:"'Can't have' → 'couldn't have'." },

{ id:"DIS086", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "I should have been more careful."',
  options:["She said that she should have been more careful.","She said that she should have been more careful (no change).","Both A and B","She said that she should been more careful."],
  correct:2, explanation:"'Should have been' remains unchanged." },

{ id:"DIS087", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "I ought to have informed them."',
  options:["He said that he ought to have informed them.","He said that he ought to have informed them (no change).","Both A and B","He said that he ought have informed them."],
  correct:2, explanation:"'Ought to have' remains." },

{ id:"DIS088", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "I needn\'t have worried so much."',
  options:["She said that she needn't have worried so much.","She said that she didn't need to worry so much.","Both A and B (slight difference)","She said that she needn't worried so much."],
  correct:2, explanation:"'Needn't have' expresses unnecessary past action." },

{ id:"DIS089", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "I dare say he is right."',
  options:["He said that he dare say he was right.","He said that he dared say he was right.","He said that he dared to say he was right.","All of the above are possible"],
  correct:3, explanation:"'Dare say' (meaning 'I suppose') can be reported in several ways." },

{ id:"DIS090", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "I would rather you didn\'t tell anyone."',
  options:["She said that she would rather I didn't tell anyone.","She said that she would rather I don't tell anyone.","She said that she would rather I hadn't told anyone.","She said that she would rather you didn't tell anyone."],
  correct:0, explanation:"'Would rather + past' remains; pronoun changes." },

{ id:"DIS091", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "It is time you started working."',
  options:["He said that it was time I started working.","He said that it is time I started working.","He said that it was time I had started working.","He said that it is time you started working."],
  correct:0, explanation:"'It is time + past' → 'it was time + past'." },

{ id:"DIS092", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "I had better leave before it gets dark."',
  options:["She said that she had better leave before it got dark.","She said that she had better left before it got dark.","She said that she has better leave before it got dark.","She said that she had better to leave before it got dark."],
  correct:0, explanation:"'Had better' remains; tense in the subordinate clause may change." },

{ id:"DIS093", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "God save the Queen!"',
  options:["He prayed that God might save the Queen.","He wished that God might save the Queen.","Both A and B","He said that God saves the Queen."],
  correct:2, explanation:"Optative → prayed/wished + might." },

{ id:"DIS094", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "Would that the war would end!"',
  options:["She wished that the war would end.","She wished that the war ended.","She said that the war would end.","She wished that the war had ended."],
  correct:0, explanation:"Wish about future is reported with 'wished + would'." },

{ id:"DIS095", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "Let the matter be decided tomorrow."',
  options:["He suggested that the matter should be decided the next day.","He proposed that the matter be decided the next day.","Both A and B","He ordered that the matter be decided the next day."],
  correct:2, explanation:"'Let' for suggestion can be reported with 'suggested/proposed + should/be'." },

{ id:"DIS096", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "I am going to visit my parents next week."',
  options:["She said that she was going to visit her parents the following week.","She said that she is going to visit her parents next week.","She said that she was going to visit her parents next week.","She said that she had been going to visit her parents the following week."],
  correct:0, explanation:"'Going to' + time change ('next week' → 'the following week')." },

{ id:"DIS097", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "I have been working on this project for six months."',
  options:["He said that he has been working on that project for six months.","He said that he had been working on that project for six months.","He said that he was working on that project for six months.","He said that he worked on that project for six months."],
  correct:1, explanation:"Present Perfect Continuous → Past Perfect Continuous; 'this' → 'that'." },

{ id:"DIS098", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said to me, "Why had you not informed me earlier?"',
  options:["She asked me why I had not informed her earlier.","She asked me why had I not informed her earlier.","She asked me why I have not informed her earlier.","She asked me why I did not inform her earlier."],
  correct:0, explanation:"Past Perfect in question remains; statement order is used." },

{ id:"DIS099", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: He said, "I must have been dreaming."',
  options:["He said that he must have been dreaming.","He said that he had to have been dreaming.","He said that he must have been dreaming (no change).","Both A and C"],
  correct:3, explanation:"Deduction with continuous perfect remains largely unchanged." },

{ id:"DIS100", section:"verbal", topic:"Direct & Indirect Speech", difficulty:"Hard",
  question:'Change into indirect speech: She said, "I can\'t have been so foolish."',
  options:["She said that she couldn't have been so foolish.","She said that she can't have been so foolish.","She said that she could not have been so foolish.","Both A and C"],
  correct:3, explanation:"'Can't have been' → 'couldn't have been'." },


// ─────────────────────────────────────────────────────────────────────────────
// ACTIVE & PASSIVE VOICE — 100 Questions (APV001–APV100)
// ─────────────────────────────────────────────────────────────────────────────

{ id:"APV001", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: She writes a letter.",
  options:["A letter is written by her.","A letter was written by her.","A letter is being written by her.","A letter has been written by her."],
  correct:0, explanation:"Present Simple Active → Present Simple Passive (is/am/are + V3)." },

{ id:"APV002", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: They are playing football.",
  options:["Football is played by them.","Football is being played by them.","Football was being played by them.","Football has been played by them."],
  correct:1, explanation:"Present Continuous Active → Present Continuous Passive (is/am/are + being + V3)." },

{ id:"APV003", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: He has completed the work.",
  options:["The work is completed by him.","The work has been completed by him.","The work was completed by him.","The work is being completed by him."],
  correct:1, explanation:"Present Perfect Active → Present Perfect Passive (has/have + been + V3)." },

{ id:"APV004", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: The teacher taught the students.",
  options:["The students are taught by the teacher.","The students were taught by the teacher.","The students have been taught by the teacher.","The students are being taught by the teacher."],
  correct:1, explanation:"Past Simple Active → Past Simple Passive (was/were + V3)." },

{ id:"APV005", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: They were watching a movie.",
  options:["A movie is being watched by them.","A movie was being watched by them.","A movie has been watched by them.","A movie was watched by them."],
  correct:1, explanation:"Past Continuous Active → Past Continuous Passive (was/were + being + V3)." },

{ id:"APV006", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: Someone has stolen my bag.",
  options:["My bag is stolen.","My bag has been stolen.","My bag was stolen.","My bag is being stolen."],
  correct:1, explanation:"When the agent is unknown or unimportant, it can be omitted." },

{ id:"APV007", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: The chef is preparing the meal.",
  options:["The meal is prepared by the chef.","The meal is being prepared by the chef.","The meal was being prepared by the chef.","The meal has been prepared by the chef."],
  correct:1, explanation:"Present Continuous → is/am/are + being + V3." },

{ id:"APV008", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: Open the door.",
  options:["The door is opened.","Let the door be opened.","The door was opened.","The door has been opened."],
  correct:1, explanation:"Imperative sentences in passive often use 'Let + object + be + V3'." },

{ id:"APV009", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: Who wrote this book?",
  options:["By whom was this book written?","Who was this book written?","By who was this book written?","Whom was this book written by?"],
  correct:0, explanation:"In questions, 'who' as subject becomes 'by whom' in passive." },

{ id:"APV010", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: They will finish the project tomorrow.",
  options:["The project will be finished by them tomorrow.","The project will finish by them tomorrow.","The project is finished by them tomorrow.","The project would be finished by them tomorrow."],
  correct:0, explanation:"Future Simple Active → will be + V3." },

{ id:"APV011", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: The children have broken the window.",
  options:["The window is broken by the children.","The window has been broken by the children.","The window was broken by the children.","The window is being broken by the children."],
  correct:1, explanation:"Present Perfect → has/have been + V3." },

{ id:"APV012", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: She was writing a letter.",
  options:["A letter is being written by her.","A letter was being written by her.","A letter has been written by her.","A letter was written by her."],
  correct:1, explanation:"Past Continuous → was/were + being + V3." },

{ id:"APV013", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: Do not touch the exhibits.",
  options:["The exhibits are not touched.","Let the exhibits not be touched.","The exhibits should not be touched.","Both B and C"],
  correct:3, explanation:"Negative imperatives can be expressed as 'Let…not be' or with 'should not be'." },

{ id:"APV014", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: The company will announce the results next week.",
  options:["The results will be announced by the company next week.","The results will announce by the company next week.","The results are announced by the company next week.","The results would be announced by the company next week."],
  correct:0, explanation:"Future Simple → will be + V3." },

{ id:"APV015", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: People speak English all over the world.",
  options:["English is spoken all over the world.","English was spoken all over the world.","English has been spoken all over the world.","English is being spoken all over the world."],
  correct:0, explanation:"General truths often omit the agent ('by people')." },

{ id:"APV016", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: The storm destroyed the crops.",
  options:["The crops are destroyed by the storm.","The crops were destroyed by the storm.","The crops have been destroyed by the storm.","The crops are being destroyed by the storm."],
  correct:1, explanation:"Past Simple → was/were + V3." },

{ id:"APV017", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: He is going to buy a new car.",
  options:["A new car is going to be bought by him.","A new car is bought by him.","A new car will be bought by him.","A new car has been bought by him."],
  correct:0, explanation:"'Going to' future → is/am/are going to be + V3." },

{ id:"APV018", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: Someone is knocking at the door.",
  options:["The door is knocked at.","The door is being knocked at.","The door was being knocked at.","The door has been knocked at."],
  correct:1, explanation:"Present Continuous; agent can be omitted." },

{ id:"APV019", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: They had completed the assignment before the deadline.",
  options:["The assignment was completed before the deadline.","The assignment had been completed before the deadline.","The assignment has been completed before the deadline.","The assignment is completed before the deadline."],
  correct:1, explanation:"Past Perfect Active → had been + V3." },

{ id:"APV020", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: The principal gave her a prize.",
  options:["She was given a prize by the principal.","A prize was given to her by the principal.","Both A and B","She has been given a prize by the principal."],
  correct:2, explanation:"Verbs with two objects can form two passive structures." },

{ id:"APV021", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: Close the window.",
  options:["The window is closed.","Let the window be closed.","The window was closed.","The window has been closed."],
  correct:1, explanation:"Imperative → Let + object + be + V3." },

{ id:"APV022", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: Who taught you French?",
  options:["By whom were you taught French?","Who were you taught French by?","Both A and B","By who were you taught French?"],
  correct:2, explanation:"Both formal ('By whom') and informal ('Who…by') are acceptable." },

{ id:"APV023", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: The gardener is watering the plants.",
  options:["The plants are watered by the gardener.","The plants are being watered by the gardener.","The plants were being watered by the gardener.","The plants have been watered by the gardener."],
  correct:1, explanation:"Present Continuous → is/am/are + being + V3." },

{ id:"APV024", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: They must complete the form.",
  options:["The form must be completed by them.","The form must complete by them.","The form must be complete by them.","The form must been completed by them."],
  correct:0, explanation:"Modal + V1 → modal + be + V3." },

{ id:"APV025", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: The postman delivers letters every day.",
  options:["Letters are delivered every day by the postman.","Letters were delivered every day by the postman.","Letters have been delivered every day by the postman.","Letters are being delivered every day by the postman."],
  correct:0, explanation:"Present Simple → is/am/are + V3." },

{ id:"APV026", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: She can solve this problem.",
  options:["This problem can be solved by her.","This problem can solve by her.","This problem can be solve by her.","This problem could be solved by her."],
  correct:0, explanation:"Modal 'can' → can be + V3." },

{ id:"APV027", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: The boys were flying kites.",
  options:["Kites are being flown by the boys.","Kites were being flown by the boys.","Kites have been flown by the boys.","Kites were flown by the boys."],
  correct:1, explanation:"Past Continuous → was/were + being + V3." },

{ id:"APV028", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: Please help me.",
  options:["I am helped.","Let me be helped.","I was helped.","I have been helped."],
  correct:1, explanation:"Polite imperative → Let + object + be + V3." },

{ id:"APV029", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: The teacher has punished the student.",
  options:["The student is punished by the teacher.","The student has been punished by the teacher.","The student was punished by the teacher.","The student is being punished by the teacher."],
  correct:1, explanation:"Present Perfect → has/have been + V3." },

{ id:"APV030", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: They are going to build a new hospital.",
  options:["A new hospital is going to be built by them.","A new hospital is built by them.","A new hospital will be built by them.","A new hospital has been built by them."],
  correct:0, explanation:"'Going to' → is/am/are going to be + V3." },

{ id:"APV031", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: Someone has broken the vase.",
  options:["The vase is broken.","The vase has been broken.","The vase was broken.","The vase is being broken."],
  correct:1, explanation:"Agent omitted when unknown." },

{ id:"APV032", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: The manager will sign the documents.",
  options:["The documents will be signed by the manager.","The documents will sign by the manager.","The documents are signed by the manager.","The documents would be signed by the manager."],
  correct:0, explanation:"Future Simple → will be + V3." },

{ id:"APV033", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: She was reading a novel.",
  options:["A novel is being read by her.","A novel was being read by her.","A novel has been read by her.","A novel was read by her."],
  correct:1, explanation:"Past Continuous → was/were + being + V3." },

{ id:"APV034", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: Do not insult the poor.",
  options:["The poor are not insulted.","Let the poor not be insulted.","The poor should not be insulted.","Both B and C"],
  correct:3, explanation:"Negative imperative can use 'Let…not be' or 'should not be'." },

{ id:"APV035", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: The children are flying kites in the park.",
  options:["Kites are flown by the children in the park.","Kites are being flown by the children in the park.","Kites were being flown by the children in the park.","Kites have been flown by the children in the park."],
  correct:1, explanation:"Present Continuous → is/am/are + being + V3." },

{ id:"APV036", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: He had written the letter before he left.",
  options:["The letter was written before he left.","The letter had been written before he left.","The letter has been written before he left.","The letter is written before he left."],
  correct:1, explanation:"Past Perfect → had been + V3." },

{ id:"APV037", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: Who has broken this window?",
  options:["By whom has this window been broken?","Who has this window been broken by?","Both A and B","By who has this window been broken?"],
  correct:2, explanation:"Both structures are acceptable in questions." },

{ id:"APV038", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: They should respect their elders.",
  options:["Their elders should be respected by them.","Their elders should respect by them.","Their elders should be respect by them.","Their elders should been respected by them."],
  correct:0, explanation:"Modal → modal + be + V3." },

{ id:"APV039", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: The storm has damaged many houses.",
  options:["Many houses are damaged by the storm.","Many houses have been damaged by the storm.","Many houses were damaged by the storm.","Many houses are being damaged by the storm."],
  correct:1, explanation:"Present Perfect → has/have been + V3." },

{ id:"APV040", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: She can speak three languages.",
  options:["Three languages can be spoken by her.","Three languages can speak by her.","Three languages can be speak by her.","Three languages could be spoken by her."],
  correct:0, explanation:"Modal 'can' → can be + V3." },

{ id:"APV041", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: The committee is considering the proposal.",
  options:["The proposal is considered by the committee.","The proposal is being considered by the committee.","The proposal was being considered by the committee.","The proposal has been considered by the committee."],
  correct:1, explanation:"Present Continuous → is/am/are + being + V3." },

{ id:"APV042", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: Keep the door closed.",
  options:["The door is kept closed.","Let the door be kept closed.","The door was kept closed.","The door has been kept closed."],
  correct:1, explanation:"Imperative → Let + object + be + V3." },

{ id:"APV043", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: They have invited me to the party.",
  options:["I am invited to the party by them.","I have been invited to the party by them.","I was invited to the party by them.","I am being invited to the party by them."],
  correct:1, explanation:"Present Perfect → has/have been + V3." },

{ id:"APV044", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: The mechanic is repairing the car.",
  options:["The car is repaired by the mechanic.","The car is being repaired by the mechanic.","The car was being repaired by the mechanic.","The car has been repaired by the mechanic."],
  correct:1, explanation:"Present Continuous → is/am/are + being + V3." },

{ id:"APV045", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: Someone will clean the room.",
  options:["The room will be cleaned.","The room will clean.","The room is cleaned.","The room would be cleaned."],
  correct:0, explanation:"Future Simple; agent can be omitted." },

{ id:"APV046", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: She was teaching the children.",
  options:["The children are being taught by her.","The children were being taught by her.","The children have been taught by her.","The children were taught by her."],
  correct:1, explanation:"Past Continuous → was/were + being + V3." },

{ id:"APV047", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: Do not waste water.",
  options:["Water is not wasted.","Let water not be wasted.","Water should not be wasted.","Both B and C"],
  correct:3, explanation:"Negative imperative can use either structure." },

{ id:"APV048", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: The company has launched a new product.",
  options:["A new product is launched by the company.","A new product has been launched by the company.","A new product was launched by the company.","A new product is being launched by the company."],
  correct:1, explanation:"Present Perfect → has/have been + V3." },

{ id:"APV049", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: They are painting the house.",
  options:["The house is painted by them.","The house is being painted by them.","The house was being painted by them.","The house has been painted by them."],
  correct:1, explanation:"Present Continuous → is/am/are + being + V3." },

{ id:"APV050", section:"verbal", topic:"Active & Passive Voice", difficulty:"Medium",
  question:"Change into passive voice: He must finish the work today.",
  options:["The work must be finished by him today.","The work must finish by him today.","The work must be finish by him today.","The work must been finished by him today."],
  correct:0, explanation:"Modal → modal + be + V3." },

{ id:"APV051", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They say that he is a genius.",
  options:["He is said to be a genius.","It is said that he is a genius.","Both A and B","He is said that he is a genius."],
  correct:2, explanation:"Impersonal passive: 'It is said that…' or 'He is said to be…'." },

{ id:"APV052", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: People believe that the company is making huge profits.",
  options:["The company is believed to be making huge profits.","It is believed that the company is making huge profits.","Both A and B","The company is believed that it is making huge profits."],
  correct:2, explanation:"Both impersonal structures are correct." },

{ id:"APV053", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They expected him to win the match.",
  options:["He was expected to win the match.","It was expected that he would win the match.","Both A and B","He was expected that he would win the match."],
  correct:2, explanation:"Verbs of expectation allow both structures." },

{ id:"APV054", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: Someone will have completed the task by tomorrow.",
  options:["The task will have been completed by tomorrow.","The task will be completed by tomorrow.","The task has been completed by tomorrow.","The task would have been completed by tomorrow."],
  correct:0, explanation:"Future Perfect Active → will have been + V3." },

{ id:"APV055", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They are going to announce the winner tomorrow.",
  options:["The winner is going to be announced tomorrow.","The winner will be announced tomorrow.","The winner is announced tomorrow.","The winner has been announced tomorrow."],
  correct:0, explanation:"'Going to' future in passive: is/am/are going to be + V3." },

{ id:"APV056", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: Who do you think invented the telephone?",
  options:["Who do you think the telephone was invented by?","By whom do you think the telephone was invented?","Both A and B","Who do you think was the telephone invented?"],
  correct:2, explanation:"Complex questions retain the embedded structure in passive." },

{ id:"APV057", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They made him work overtime.",
  options:["He was made to work overtime.","He was made work overtime.","He was made working overtime.","He has been made to work overtime."],
  correct:0, explanation:"After 'make' in passive, use 'to-infinitive' (unlike active)." },

{ id:"APV058", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: She let him go early.",
  options:["He was let to go early.","He was allowed to go early.","He was let go early.","Both B and C"],
  correct:3, explanation:"'Let' in passive is often replaced by 'allow'; 'let go' is also possible." },

{ id:"APV059", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They say she has written a bestseller.",
  options:["She is said to have written a bestseller.","It is said that she has written a bestseller.","Both A and B","She is said that she has written a bestseller."],
  correct:2, explanation:"Perfect infinitive is used when the action is prior to the reporting." },

{ id:"APV060", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: The authorities are to announce a new policy soon.",
  options:["A new policy is to be announced soon.","A new policy is announced soon.","A new policy will be announced soon.","A new policy has to be announced soon."],
  correct:0, explanation:"'Be to' construction → is/am/are to be + V3." },

{ id:"APV061", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They have been building the bridge for two years.",
  options:["The bridge has been being built for two years.","The bridge has been built for two years.","The bridge is being built for two years.","The bridge was being built for two years."],
  correct:0, explanation:"Present Perfect Continuous Passive (rarely used but grammatically possible)." },

{ id:"APV062", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: One should keep one's promises.",
  options:["Promises should be kept.","One's promises should be kept.","Both A and B","Promises should keep."],
  correct:2, explanation:"Impersonal 'one' can be omitted or retained in passive." },

{ id:"APV063", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They will have finished the construction by next month.",
  options:["The construction will have been finished by next month.","The construction will be finished by next month.","The construction has been finished by next month.","The construction would have been finished by next month."],
  correct:0, explanation:"Future Perfect → will have been + V3." },

{ id:"APV064", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: People think that the minister will resign.",
  options:["The minister is thought to resign.","The minister is thought to be going to resign.","It is thought that the minister will resign.","Both B and C"],
  correct:3, explanation:"Future reference after 'think' uses 'to be going to' or 'it is thought that'." },

{ id:"APV065", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They saw him enter the building.",
  options:["He was seen to enter the building.","He was seen enter the building.","He was seen entering the building.","Both A and C"],
  correct:3, explanation:"Verbs of perception take bare infinitive or present participle in passive." },

{ id:"APV066", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: Someone must have taken the documents.",
  options:["The documents must have been taken.","The documents must be taken.","The documents must have taken.","The documents must been taken."],
  correct:0, explanation:"Modal perfect → modal + have been + V3." },

{ id:"APV067", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They are believed to have left the country. (Convert to equivalent passive structure)",
  options:["It is believed that they have left the country.","They are believed to leave the country.","It is believed them to have left the country.","They are believed that they have left the country."],
  correct:0, explanation:"The given sentence is already passive; 'It is believed that…' is equivalent." },

{ id:"APV068", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: The teacher made the students rewrite the essay.",
  options:["The students were made to rewrite the essay.","The students were made rewrite the essay.","The students were made rewriting the essay.","The students have been made to rewrite the essay."],
  correct:0, explanation:"In passive of 'make', 'to' is required before the infinitive." },

{ id:"APV069", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They will be discussing the issue tomorrow.",
  options:["The issue will be being discussed tomorrow.","The issue will be discussed tomorrow.","The issue is being discussed tomorrow.","The issue would be discussed tomorrow."],
  correct:0, explanation:"Future Continuous Passive (rare but possible): will be being + V3." },

{ id:"APV070", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: Nobody has ever spoken to me like that.",
  options:["I have never been spoken to like that.","I have never been spoken like that.","I have never spoken to like that.","I have never been speak to like that."],
  correct:0, explanation:"Prepositional verbs retain the preposition in passive." },

{ id:"APV071", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They say that the company has been making losses for years.",
  options:["The company is said to have been making losses for years.","It is said that the company has been making losses for years.","Both A and B","The company is said that it has been making losses for years."],
  correct:2, explanation:"Continuous perfect infinitive is used for ongoing past action." },

{ id:"APV072", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: The police are looking into the matter.",
  options:["The matter is being looked into by the police.","The matter is looked into by the police.","The matter has been looked into by the police.","The matter was being looked into by the police."],
  correct:0, explanation:"Phrasal verbs retain the particle in passive." },

{ id:"APV073", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They ought to have informed us earlier.",
  options:["We ought to have been informed earlier.","We ought to be informed earlier.","We ought have been informed earlier.","We ought to have informed earlier."],
  correct:0, explanation:"Modal perfect passive: modal + have been + V3." },

{ id:"APV074", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: Someone is to meet you at the airport.",
  options:["You are to be met at the airport.","You are met at the airport.","You will be met at the airport.","You have to be met at the airport."],
  correct:0, explanation:"'Be to' → is/am/are to be + V3." },

{ id:"APV075", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They have been considering your application.",
  options:["Your application has been being considered.","Your application has been considered.","Your application is being considered.","Your application was being considered."],
  correct:0, explanation:"Present Perfect Continuous Passive (formal and rare)." },

{ id:"APV076", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: Who broke the silence?",
  options:["By whom was the silence broken?","Who was the silence broken by?","Both A and B","By who was the silence broken?"],
  correct:2, explanation:"Both formal and informal structures are correct." },

{ id:"APV077", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They will have been repairing the road for a month by then.",
  options:["The road will have been being repaired for a month by then.","The road will have been repaired for a month by then.","The road will be repaired for a month by then.","The road has been repaired for a month by then."],
  correct:0, explanation:"Future Perfect Continuous Passive (extremely rare but grammatically possible)." },

{ id:"APV078", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: People know that he has written several books.",
  options:["He is known to have written several books.","It is known that he has written several books.","Both A and B","He is known that he has written several books."],
  correct:2, explanation:"Perfect infinitive for prior action." },

{ id:"APV079", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They saw the thief running away.",
  options:["The thief was seen running away.","The thief was seen to run away.","Both A and B","The thief was seen run away."],
  correct:0, explanation:"Present participle is preferred for ongoing action with verbs of perception." },

{ id:"APV080", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: One cannot please everybody.",
  options:["Everybody cannot be pleased.","Everybody cannot please.","Everybody can not be pleased.","Everybody cannot been pleased."],
  correct:0, explanation:"Impersonal 'one' is omitted; negative is retained." },

{ id:"APV081", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They are to have completed the work by now.",
  options:["The work is to have been completed by now.","The work is to be completed by now.","The work has to have been completed by now.","The work is to have completed by now."],
  correct:0, explanation:"'Be to' + perfect infinitive → is/am/are to have been + V3." },

{ id:"APV082", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: Someone must be helping him.",
  options:["He must be being helped.","He must be helped.","He must have been helped.","He must being helped."],
  correct:0, explanation:"Modal continuous passive: modal + be being + V3." },

{ id:"APV083", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They expect the results to be announced soon.",
  options:["The results are expected to be announced soon.","The results are expected to announce soon.","The results expect to be announced soon.","The results are expected announcing soon."],
  correct:0, explanation:"Complex object becomes passive with 'to be + V3'." },

{ id:"APV084", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: Nobody told me about the change in schedule.",
  options:["I was not told about the change in schedule.","I was not told the change in schedule.","I have not been told about the change in schedule.","Both A and C"],
  correct:3, explanation:"Both past simple and present perfect passive are possible depending on context." },

{ id:"APV085", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They are saying that the minister has resigned.",
  options:["The minister is being said to have resigned.","It is being said that the minister has resigned.","The minister is said to have resigned.","Both B and C"],
  correct:3, explanation:"'Are saying' can become continuous passive or simple 'is said'." },

{ id:"APV086", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: The management is to review the policy next month.",
  options:["The policy is to be reviewed next month.","The policy is reviewed next month.","The policy will be reviewed next month.","The policy has to be reviewed next month."],
  correct:0, explanation:"'Be to' → is/am/are to be + V3." },

{ id:"APV087", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They have been looking after the children well.",
  options:["The children have been being looked after well.","The children have been looked after well.","The children are being looked after well.","The children were being looked after well."],
  correct:1, explanation:"Present Perfect of phrasal verb; continuous form is rarely used." },

{ id:"APV088", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: Who do people say invented the light bulb?",
  options:["Who is said to have invented the light bulb?","Who do people say the light bulb was invented by?","Both A and B","Who is said the light bulb was invented by?"],
  correct:2, explanation:"Both personal and impersonal structures work." },

{ id:"APV089", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They made us wait for two hours.",
  options:["We were made to wait for two hours.","We were made wait for two hours.","We were made waiting for two hours.","We have been made to wait for two hours."],
  correct:0, explanation:"Passive of 'make' requires 'to' before the infinitive." },

{ id:"APV090", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: Someone ought to have warned them.",
  options:["They ought to have been warned.","They ought to be warned.","They ought have been warned.","They ought to have warned."],
  correct:0, explanation:"Modal perfect passive." },

{ id:"APV091", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They will be announcing the awards tomorrow evening.",
  options:["The awards will be being announced tomorrow evening.","The awards will be announced tomorrow evening.","The awards are being announced tomorrow evening.","The awards would be announced tomorrow evening."],
  correct:0, explanation:"Future Continuous Passive (rare)." },

{ id:"APV092", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: People believe that she is the best candidate.",
  options:["She is believed to be the best candidate.","It is believed that she is the best candidate.","Both A and B","She is believed that she is the best candidate."],
  correct:2, explanation:"Both structures are standard." },

{ id:"APV093", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They saw her leave the building in a hurry.",
  options:["She was seen to leave the building in a hurry.","She was seen leaving the building in a hurry.","Both A and B","She was seen leave the building in a hurry."],
  correct:2, explanation:"Both infinitive (with 'to') and participle are possible." },

{ id:"APV094", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: Someone has to complete this task urgently.",
  options:["This task has to be completed urgently.","This task has to complete urgently.","This task has been completed urgently.","This task has to been completed urgently."],
  correct:0, explanation:"'Have to' → has/have to be + V3." },

{ id:"APV095", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They are known to have supported the movement. (Convert to equivalent passive)",
  options:["It is known that they have supported the movement.","They are known that they have supported the movement.","It is known them to have supported the movement.","They are known supporting the movement."],
  correct:0, explanation:"The given sentence is already a form of passive; 'It is known that…' is equivalent." },

{ id:"APV096", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: The committee is expected to reach a decision soon.",
  options:["A decision is expected to be reached soon by the committee.","A decision is expected to reach soon.","A decision expects to be reached soon.","A decision is expected reaching soon."],
  correct:0, explanation:"Complex passive structure with 'to be + V3'." },

{ id:"APV097", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They might have solved the problem already.",
  options:["The problem might have been solved already.","The problem might be solved already.","The problem might have solved already.","The problem might been solved already."],
  correct:0, explanation:"Modal perfect passive." },

{ id:"APV098", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: Nobody has ever treated me so kindly.",
  options:["I have never been treated so kindly.","I have never treated so kindly.","I have never been treat so kindly.","I have never been treating so kindly."],
  correct:0, explanation:"Present Perfect Passive with adverb of frequency." },

{ id:"APV099", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They will have been discussing the issue for hours by the time we arrive.",
  options:["The issue will have been being discussed for hours by the time we arrive.","The issue will have been discussed for hours by the time we arrive.","The issue will be discussed for hours by the time we arrive.","The issue has been discussed for hours by the time we arrive."],
  correct:0, explanation:"Future Perfect Continuous Passive (theoretical form)." },

{ id:"APV100", section:"verbal", topic:"Active & Passive Voice", difficulty:"Hard",
  question:"Change into passive voice: They say the new law will come into effect next month.",
  options:["The new law is said to come into effect next month.","It is said that the new law will come into effect next month.","Both A and B","The new law is said that it will come into effect next month."],
  correct:2, explanation:"Both personal and impersonal passive structures are correct." },


// ─────────────────────────────────────────────────────────────────────────────
// SENTENCE IMPROVEMENT — 100 Questions (SIM001–SIM100)
// ─────────────────────────────────────────────────────────────────────────────

{ id:"SIM001", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"She is senior than me in the office. (Improve the underlined part if needed.)",
  options:["senior to me","senior from me","more senior than me","No improvement"],
  correct:0, explanation:"'Senior' is followed by 'to', not 'than'." },

{ id:"SIM002", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"He preferred coffee than tea. (Improve the underlined part.)",
  options:["coffee to tea","coffee from tea","coffee over than tea","No improvement"],
  correct:0, explanation:"'Prefer' is followed by 'to'." },

{ id:"SIM003", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"Despite of the heavy rain, they continued the match. (Improve.)",
  options:["Despite the heavy rain","Despite of heavy rain","In spite the heavy rain","No improvement"],
  correct:0, explanation:"'Despite' is not followed by 'of'." },

{ id:"SIM004", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"The number of students are increasing every year. (Improve.)",
  options:["is increasing","have increasing","were increasing","No improvement"],
  correct:0, explanation:"'The number of' takes a singular verb." },

{ id:"SIM005", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"She is one of the best student in the class. (Improve.)",
  options:["one of the best students","one of the better student","one of best student","No improvement"],
  correct:0, explanation:"'One of the' is followed by a plural noun." },

{ id:"SIM006", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"I look forward to meet you soon. (Improve.)",
  options:["to meeting you","for meeting you","meeting you","No improvement"],
  correct:0, explanation:"'Look forward to' is followed by a gerund." },

{ id:"SIM007", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"Neither of the two boys have completed the work. (Improve.)",
  options:["has completed","have complete","were completed","No improvement"],
  correct:0, explanation:"'Neither' is singular and takes a singular verb." },

{ id:"SIM008", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"He is good in English and Mathematics. (Improve.)",
  options:["good at","good on","good for","No improvement"],
  correct:0, explanation:"Use 'good at' for subjects/skills." },

{ id:"SIM009", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"The sceneries of Kashmir are very beautiful. (Improve.)",
  options:["The scenery of Kashmir is","The sceneries of Kashmir is","The scenery of Kashmir are","No improvement"],
  correct:0, explanation:"'Scenery' is uncountable and takes a singular verb." },

{ id:"SIM010", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"She made him to clean the room. (Improve.)",
  options:["him clean","him cleaning","him cleaned","No improvement"],
  correct:0, explanation:"After 'make' use the bare infinitive (without 'to')." },

{ id:"SIM011", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"He has been living here since five years. (Improve.)",
  options:["for five years","from five years","by five years","No improvement"],
  correct:0, explanation:"Use 'for' with a period of time." },

{ id:"SIM012", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"The police is investigating the case. (Improve.)",
  options:["are investigating","has investigating","have investigate","No improvement"],
  correct:0, explanation:"'Police' is a plural noun." },

{ id:"SIM013", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"One of my friend is a doctor. (Improve.)",
  options:["One of my friends is","One of my friends are","One of my friend are","No improvement"],
  correct:0, explanation:"Use plural noun after 'one of' and singular verb." },

{ id:"SIM014", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"She ordered for a cup of coffee. (Improve.)",
  options:["ordered a cup","ordered to a cup","ordered of a cup","No improvement"],
  correct:0, explanation:"'Order' does not take 'for' in this structure." },

{ id:"SIM015", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"He is living in this city for 2015. (Improve.)",
  options:["since 2015","from 2015","by 2015","No improvement"],
  correct:0, explanation:"Use 'since' with a point of time." },

{ id:"SIM016", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"The furniture in this room are quite old. (Improve.)",
  options:["is quite old","have quite old","were quite old","No improvement"],
  correct:0, explanation:"'Furniture' is uncountable and singular." },

{ id:"SIM017", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"She is the most unique artist of our times. (Improve.)",
  options:["a unique artist","the unique most artist","more unique artist","No improvement"],
  correct:0, explanation:"'Unique' is an absolute adjective and does not take comparative/superlative." },

{ id:"SIM018", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"He congratulated me for my success. (Improve.)",
  options:["on my success","about my success","of my success","No improvement"],
  correct:0, explanation:"Use 'congratulate on'." },

{ id:"SIM019", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"The climate of this place is better than Delhi. (Improve.)",
  options:["than that of Delhi","than of Delhi","than Delhi's is","No improvement"],
  correct:0, explanation:"Compare like with like using 'that of'." },

{ id:"SIM020", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"Being a rainy day, I stayed at home. (Improve.)",
  options:["It being a rainy day","As being a rainy day","Being rainy day","No improvement"],
  correct:0, explanation:"Avoid dangling participle by adding the subject 'It'." },

{ id:"SIM021", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"He is accustomed with hard work. (Improve.)",
  options:["accustomed to","accustomed of","accustomed for","No improvement"],
  correct:0, explanation:"Correct preposition is 'to'." },

{ id:"SIM022", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"I have finished the work two hours ago. (Improve.)",
  options:["finished the work two hours ago","had finished the work two hours ago","was finished the work two hours ago","No improvement"],
  correct:0, explanation:"With 'ago' use simple past." },

{ id:"SIM023", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"She is one of those who always helps others. (Improve.)",
  options:["who always help others","who always helping others","who always has helped others","No improvement"],
  correct:0, explanation:"'Who' refers to 'those' (plural); use plural verb." },

{ id:"SIM024", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"The two first pages of the book are missing. (Improve.)",
  options:["The first two pages","The two first page","First the two pages","No improvement"],
  correct:0, explanation:"Ordinal comes before cardinal: 'first two'." },

{ id:"SIM025", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"Hardly he had entered when the lights went out. (Improve.)",
  options:["Hardly had he entered","Hardly he entered","Hardly has he entered","No improvement"],
  correct:0, explanation:"Inversion is required after 'hardly'." },

{ id:"SIM026", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"No sooner the sun rose than we started. (Improve.)",
  options:["No sooner did the sun rise","No sooner the sun rises","No sooner had the sun rise","No improvement"],
  correct:0, explanation:"Inversion is required after 'no sooner'." },

{ id:"SIM027", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"It is high time we start working seriously. (Improve.)",
  options:["we started working","we have started working","we will start working","No improvement"],
  correct:0, explanation:"After 'it is high time' use past subjunctive." },

{ id:"SIM028", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"I would rather you come tomorrow. (Improve.)",
  options:["you came tomorrow","you come tomorrow","you will come tomorrow","No improvement"],
  correct:0, explanation:"After 'would rather' + subject, use past tense." },

{ id:"SIM029", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"Unless you will not work hard, you will fail. (Improve.)",
  options:["Unless you work hard","Unless you do not work hard","Unless you will work hard","No improvement"],
  correct:0, explanation:"'Unless' already means 'if not'; avoid double negative." },

{ id:"SIM030", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"She denied to have met him earlier. (Improve.)",
  options:["denied having met him","denied to meet him","denied meet him","No improvement"],
  correct:0, explanation:"'Deny' is followed by a gerund." },

{ id:"SIM031", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"He is the tallest of the two brothers. (Improve.)",
  options:["the taller of the two brothers","taller of the two brothers","tallest of the two brothers","No improvement"],
  correct:0, explanation:"For comparison between two, use the comparative degree." },

{ id:"SIM032", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"Supposing if it rains, we shall cancel the trip. (Improve.)",
  options:["Supposing it rains","Supposing if it will rain","If supposing it rains","No improvement"],
  correct:0, explanation:"Use either 'Supposing' or 'If', not both." },

{ id:"SIM033", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"The reason why he left was because he was unhappy. (Improve.)",
  options:["was that he was unhappy","was because he is unhappy","is because he was unhappy","No improvement"],
  correct:0, explanation:"Avoid 'the reason…because'; use 'the reason…that'." },

{ id:"SIM034", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"He is working hard so that he will succeed. (Improve.)",
  options:["so that he may succeed","so that he succeeds","so that he succeeded","No improvement"],
  correct:0, explanation:"'So that' expressing purpose is often followed by 'may/might'." },

{ id:"SIM035", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"Scarcely had I reached the station than the train left. (Improve.)",
  options:["when the train left","then the train left","as the train left","No improvement"],
  correct:0, explanation:"'Scarcely…when' is the correct correlative." },

{ id:"SIM036", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"He is junior than me by three years. (Improve.)",
  options:["junior to me","junior from me","more junior than me","No improvement"],
  correct:0, explanation:"'Junior' is followed by 'to'." },

{ id:"SIM037", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"The committee have decided to postpone the meeting. (Improve.)",
  options:["has decided","have decide","were decided","No improvement"],
  correct:0, explanation:"Collective noun 'committee' is singular when acting as a unit." },

{ id:"SIM038", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"She is more better than her sister in studies. (Improve.)",
  options:["better than","more better from","most better than","No improvement"],
  correct:0, explanation:"Avoid double comparative; 'better' is already comparative." },

{ id:"SIM039", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"I suggested him to take a break. (Improve.)",
  options:["suggested that he take","suggested him take","suggested him for taking","No improvement"],
  correct:0, explanation:"'Suggest' is not followed by object + to-infinitive." },

{ id:"SIM040", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"He prevented me to go there. (Improve.)",
  options:["prevented me from going","prevented me go","prevented me for going","No improvement"],
  correct:0, explanation:"'Prevent' is followed by 'from + gerund'." },

{ id:"SIM041", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"The news are very encouraging today. (Improve.)",
  options:["is very encouraging","were very encouraging","have very encouraging","No improvement"],
  correct:0, explanation:"'News' is singular." },

{ id:"SIM042", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"She is taller than any girl in the class. (Improve.)",
  options:["any other girl","any girls","all girl","No improvement"],
  correct:0, explanation:"Use 'any other' to exclude herself from the comparison." },

{ id:"SIM043", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"He as well as his friends are coming. (Improve.)",
  options:["is coming","are come","have coming","No improvement"],
  correct:0, explanation:"When subjects are joined by 'as well as', the verb agrees with the first subject." },

{ id:"SIM044", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"Each of the players have been given a prize. (Improve.)",
  options:["has been given","have given","were given","No improvement"],
  correct:0, explanation:"'Each' is singular." },

{ id:"SIM045", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"The more you work hard, the more you succeed. (Improve.)",
  options:["The harder you work, the more you succeed","The more hard you work","The more you work harder","No improvement"],
  correct:0, explanation:"Correct correlative structure: 'The harder…the more…'." },

{ id:"SIM046", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"He is one of the best player of the team. (Improve.)",
  options:["one of the best players","one of the better player","one of best player","No improvement"],
  correct:0, explanation:"'One of the' requires a plural noun." },

{ id:"SIM047", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"She is confident to win the competition. (Improve.)",
  options:["confident of winning","confident for winning","confident in win","No improvement"],
  correct:0, explanation:"'Confident' is followed by 'of + gerund'." },

{ id:"SIM048", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"He insisted to pay the bill. (Improve.)",
  options:["insisted on paying","insisted for paying","insisted pay","No improvement"],
  correct:0, explanation:"'Insist' is followed by 'on + gerund'." },

{ id:"SIM049", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"The teacher asked the students that why they were late. (Improve.)",
  options:["why they were late","that why they are late","that why were they late","No improvement"],
  correct:0, explanation:"In reported questions, do not use 'that' before the question word." },

{ id:"SIM050", section:"verbal", topic:"Sentence Improvement", difficulty:"Medium",
  question:"He is capable to do this work alone. (Improve.)",
  options:["capable of doing","capable for doing","capable in doing","No improvement"],
  correct:0, explanation:"'Capable' is followed by 'of + gerund'." },

{ id:"SIM051", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"No sooner had the meeting begun when the fire alarm went off. (Improve.)",
  options:["than the fire alarm went off","when the fire alarm goes off","then the fire alarm went off","No improvement"],
  correct:0, explanation:"'No sooner…than' is the correct correlative pair." },

{ id:"SIM052", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"Hardly had he finished his speech than the audience started applauding. (Improve.)",
  options:["when the audience started","then the audience started","as the audience started","No improvement"],
  correct:0, explanation:"'Hardly…when' is the correct structure." },

{ id:"SIM053", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"If I would have known about the problem, I would have helped. (Improve.)",
  options:["If I had known","If I would know","If I have known","No improvement"],
  correct:0, explanation:"In third conditional, use past perfect in the if-clause." },

{ id:"SIM054", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"She is used to get up early in the morning. (Improve.)",
  options:["used to getting up","used to get","use to getting up","No improvement"],
  correct:0, explanation:"'Be used to' is followed by a gerund." },

{ id:"SIM055", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"The manager demanded that the report is submitted by Friday. (Improve.)",
  options:["be submitted","is submit","was submitted","No improvement"],
  correct:0, explanation:"After verbs like 'demand', use the subjunctive (base form)." },

{ id:"SIM056", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"It is essential that every employee arrives on time. (Improve.)",
  options:["arrive on time","arrives on time","arrived on time","No improvement"],
  correct:0, explanation:"After 'it is essential that', use the subjunctive (base form)." },

{ id:"SIM057", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"Had he worked harder, he will have succeeded. (Improve.)",
  options:["would have succeeded","will succeed","would succeed","No improvement"],
  correct:0, explanation:"Third conditional: 'Had + past participle… would have + past participle'." },

{ id:"SIM058", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"She suggested that he applies for the position. (Improve.)",
  options:["apply for the position","applies for the position","applied for the position","No improvement"],
  correct:0, explanation:"After 'suggest that', use the subjunctive (base form)." },

{ id:"SIM059", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"The data clearly indicate that the hypothesis is correct. (Improve.)",
  options:["indicates","indicate","indicating","No improvement"],
  correct:3, explanation:"'Data' can take a plural verb in formal usage; both are acceptable." },

{ id:"SIM060", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"Neither the CEO nor the directors was present at the meeting. (Improve.)",
  options:["were present","was present","has present","No improvement"],
  correct:0, explanation:"When subjects are joined by 'neither…nor', the verb agrees with the nearer subject (directors = plural)." },

{ id:"SIM061", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"He is one of the few people who has understood the concept fully. (Improve.)",
  options:["who have understood","who has understand","who having understood","No improvement"],
  correct:0, explanation:"'Who' refers to 'people' (plural); use plural verb." },

{ id:"SIM062", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"The committee, as well as the chairperson, are in favour of the proposal. (Improve.)",
  options:["is in favour","are in favour","have in favour","No improvement"],
  correct:0, explanation:"When 'as well as' joins subjects, the verb agrees with the first subject." },

{ id:"SIM063", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"Not only the students but also the teacher were surprised. (Improve.)",
  options:["was surprised","were surprised","have surprised","No improvement"],
  correct:0, explanation:"When subjects are joined by 'not only…but also', the verb agrees with the nearer subject." },

{ id:"SIM064", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"Each of the candidates have to submit their documents by Monday. (Improve.)",
  options:["has to submit his or her documents","have to submit their documents","has to submit their documents","No improvement"],
  correct:0, explanation:"'Each' is singular; use singular verb and singular pronoun." },

{ id:"SIM065", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"The majority of the population live in urban areas. (Improve.)",
  options:["lives in urban areas","live in urban areas","living in urban areas","No improvement"],
  correct:3, explanation:"'Majority' can take plural verb when referring to people; both are acceptable." },

{ id:"SIM066", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"She is taller than any of her sisters. (Improve.)",
  options:["any other of her sisters","any of her sister","any her sisters","No improvement"],
  correct:3, explanation:"'Any of her sisters' correctly excludes herself." },

{ id:"SIM067", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"I wish I was there with you at that moment. (Improve.)",
  options:["I were there","I was there","I am there","No improvement"],
  correct:0, explanation:"After 'wish' for unreal present/past, use the subjunctive 'were'." },

{ id:"SIM068", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"If I was you, I would accept the offer immediately. (Improve.)",
  options:["If I were you","If I was you","If I am you","No improvement"],
  correct:0, explanation:"In hypothetical conditions, use 'were' for all persons." },

{ id:"SIM069", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"The project, along with its ancillary reports, were submitted yesterday. (Improve.)",
  options:["was submitted","were submitted","have submitted","No improvement"],
  correct:0, explanation:"The main subject 'project' is singular; phrases like 'along with' do not affect the verb." },

{ id:"SIM070", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"He said that he will come the next day. (Improve.)",
  options:["he would come the next day","he will come the next day","he comes the next day","No improvement"],
  correct:0, explanation:"In reported speech, 'will' changes to 'would'." },

{ id:"SIM071", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"She asked me that what was my name. (Improve.)",
  options:["what my name was","that what my name was","what was my name","No improvement"],
  correct:0, explanation:"In reported questions, use statement word order and omit 'that' before the question word." },

{ id:"SIM072", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"The teacher told the students that the Earth moved round the Sun. (Improve.)",
  options:["moves round the Sun","moved round the Sun","moving round the Sun","No improvement"],
  correct:0, explanation:"Universal truths remain in present tense in reported speech." },

{ id:"SIM073", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"He is known for his ability of solving complex problems. (Improve.)",
  options:["ability to solve","ability of solve","ability for solving","No improvement"],
  correct:0, explanation:"'Ability' is followed by 'to-infinitive'." },

{ id:"SIM074", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"Despite of being warned, he continued to take risks. (Improve.)",
  options:["Despite being warned","Despite of being warn","In spite being warned","No improvement"],
  correct:0, explanation:"'Despite' is not followed by 'of'." },

{ id:"SIM075", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"The more the merrier, as the saying goes. (Improve.)",
  options:["No improvement","The more, the merrier","More the merrier","The more merrier"],
  correct:0, explanation:"The expression is correct as it stands." },

{ id:"SIM076", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"He has a good command over English language. (Improve.)",
  options:["command of the English language","command over English language","command on English language","No improvement"],
  correct:0, explanation:"'Command of' is the preferred preposition; also use the article." },

{ id:"SIM077", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"She is looking forward for the holidays. (Improve.)",
  options:["looking forward to","looking forward for","looking forward on","No improvement"],
  correct:0, explanation:"The correct phrase is 'look forward to'." },

{ id:"SIM078", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"The jury were divided in its opinion. (Improve.)",
  options:["were divided in their opinion","was divided in its opinion","were divided in its opinion","No improvement"],
  correct:0, explanation:"When members act individually, use plural verb and plural pronoun." },

{ id:"SIM079", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"He is senior than all other officers in the department. (Improve.)",
  options:["senior to all other officers","senior than all other officers","more senior to all other officers","No improvement"],
  correct:0, explanation:"'Senior' takes 'to'." },

{ id:"SIM080", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"The book contained a lot of informations about the topic. (Improve.)",
  options:["a lot of information","a lot of informations","many informations","No improvement"],
  correct:0, explanation:"'Information' is uncountable." },

{ id:"SIM081", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"She is more intelligent than any student in the class. (Improve.)",
  options:["any other student","any student","all student","No improvement"],
  correct:0, explanation:"Use 'any other' to exclude the subject from the comparison." },

{ id:"SIM082", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"I would prefer if you stayed a little longer. (Improve.)",
  options:["prefer it if you stayed","prefer if you stay","prefer you to stayed","No improvement"],
  correct:0, explanation:"'Prefer' in this structure usually takes 'it if'." },

{ id:"SIM083", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"The fact that he is late do not mean he is irresponsible. (Improve.)",
  options:["does not mean","do not mean","did not mean","No improvement"],
  correct:0, explanation:"The subject 'the fact' is singular." },

{ id:"SIM084", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"He is one of those rare individuals who has achieved success in both fields. (Improve.)",
  options:["who have achieved","who has achieved","who having achieved","No improvement"],
  correct:0, explanation:"'Who' refers to 'individuals' (plural)." },

{ id:"SIM085", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"The report, together with the annexures, were submitted on time. (Improve.)",
  options:["was submitted","were submitted","have submitted","No improvement"],
  correct:0, explanation:"Main subject 'report' is singular." },

{ id:"SIM086", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"If she would have told me earlier, I could have helped. (Improve.)",
  options:["If she had told me","If she would tell me","If she has told me","No improvement"],
  correct:0, explanation:"Third conditional requires past perfect in the if-clause." },

{ id:"SIM087", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"The number of applicants have increased this year. (Improve.)",
  options:["has increased","have increased","were increased","No improvement"],
  correct:0, explanation:"'The number of' takes a singular verb." },

{ id:"SIM088", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"A number of students is absent today. (Improve.)",
  options:["are absent","is absent","was absent","No improvement"],
  correct:0, explanation:"'A number of' takes a plural verb." },

{ id:"SIM089", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"He speaks as if he knows everything about the subject. (Improve.)",
  options:["knew everything","knows everything","known everything","No improvement"],
  correct:0, explanation:"After 'as if' for unreal situations, use past tense." },

{ id:"SIM090", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"It is high time that we do something about the situation. (Improve.)",
  options:["did something","do something","have done something","No improvement"],
  correct:0, explanation:"After 'it is high time' use past subjunctive." },

{ id:"SIM091", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"She would rather that her husband does not work late. (Improve.)",
  options:["did not work late","does not work late","do not work late","No improvement"],
  correct:0, explanation:"After 'would rather' + subject, use past tense." },

{ id:"SIM092", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"The data was carefully analysed by the research team. (Improve.)",
  options:["were carefully analysed","was carefully analysed","have carefully analysed","No improvement"],
  correct:3, explanation:"'Data' can be treated as singular in modern usage." },

{ id:"SIM093", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"Neither of the answers are correct. (Improve.)",
  options:["is correct","are correct","were correct","No improvement"],
  correct:0, explanation:"'Neither' is singular." },

{ id:"SIM094", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"He is the most intelligent of the two brothers. (Improve.)",
  options:["the more intelligent of the two","the most intelligent of the two","more intelligent of the two","No improvement"],
  correct:0, explanation:"Use comparative degree for two items." },

{ id:"SIM095", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"The teacher as well as the students were present. (Improve.)",
  options:["was present","were present","have present","No improvement"],
  correct:0, explanation:"Verb agrees with the first subject when joined by 'as well as'." },

{ id:"SIM096", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"She is confident to clear the examination. (Improve.)",
  options:["confident of clearing","confident to clear","confident for clearing","No improvement"],
  correct:0, explanation:"'Confident' takes 'of + gerund'." },

{ id:"SIM097", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"He is capable to handle the situation alone. (Improve.)",
  options:["capable of handling","capable to handle","capable for handling","No improvement"],
  correct:0, explanation:"'Capable' takes 'of + gerund'." },

{ id:"SIM098", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"I suggested him that he should apply for the job. (Improve.)",
  options:["suggested that he should apply","suggested him that he should apply","suggested him to apply","No improvement"],
  correct:0, explanation:"'Suggest' does not take an indirect object in this structure." },

{ id:"SIM099", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"The fact remains that he is guilty of the crime. (Improve.)",
  options:["No improvement","The fact remain","The facts remains","The fact remaining"],
  correct:0, explanation:"The sentence is already correct." },

{ id:"SIM100", section:"verbal", topic:"Sentence Improvement", difficulty:"Hard",
  question:"He is known by his honesty and integrity. (Improve.)",
  options:["known for","known by","known with","No improvement"],
  correct:0, explanation:"Use 'known for' to indicate the reason for reputation." },


// ─────────────────────────────────────────────────────────────────────────────
// IDIOMS & PHRASES — 100 Questions (IDP001–IDP100)
// ─────────────────────────────────────────────────────────────────────────────

{ id:"IDP001", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"What is the meaning of the idiom 'A blessing in disguise'?",
  options:["A misfortune that appears as a blessing","A good thing that initially seemed bad","A hidden curse","An obvious advantage"],
  correct:1, explanation:"Something that seems bad at first but results in something good." },

{ id:"IDP002", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Break the ice' means:",
  options:["To start a conversation in a social setting","To end a relationship","To destroy something","To freeze water"],
  correct:0, explanation:"To initiate conversation and relieve tension in a social situation." },

{ id:"IDP003", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Hit the nail on the head' means:",
  options:["To hurt someone","To describe exactly what is causing a situation","To fail completely","To work hard"],
  correct:1, explanation:"To be exactly right about something." },

{ id:"IDP004", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Once in a blue moon' means:",
  options:["Very frequently","Very rarely","Every month","During daytime"],
  correct:1, explanation:"Something that happens very infrequently." },

{ id:"IDP005", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Spill the beans' means:",
  options:["To cook food","To reveal a secret","To waste resources","To clean up"],
  correct:1, explanation:"To disclose confidential information." },

{ id:"IDP006", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Under the weather' means:",
  options:["Feeling healthy","Feeling slightly ill","Enjoying good weather","Travelling"],
  correct:1, explanation:"To feel unwell or sick." },

{ id:"IDP007", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Cost an arm and a leg' means:",
  options:["Very cheap","Extremely expensive","Free of cost","Moderately priced"],
  correct:1, explanation:"Something that is very costly." },

{ id:"IDP008", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Bite the bullet' means:",
  options:["To eat something hard","To face a difficult situation with courage","To avoid a problem","To surrender"],
  correct:1, explanation:"To endure a painful or difficult situation bravely." },

{ id:"IDP009", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Let the cat out of the bag' means:",
  options:["To free an animal","To reveal a secret unintentionally","To go shopping","To clean the house"],
  correct:1, explanation:"To disclose a secret by mistake." },

{ id:"IDP010", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'A piece of cake' means:",
  options:["Something difficult","Something very easy","A dessert","A reward"],
  correct:1, explanation:"A task that is very easy to accomplish." },

{ id:"IDP011", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Burn the midnight oil' means:",
  options:["To waste fuel","To work late into the night","To sleep early","To party at night"],
  correct:1, explanation:"To stay up late working or studying." },

{ id:"IDP012", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Call it a day' means:",
  options:["To start work","To stop working for the day","To celebrate","To take a holiday"],
  correct:1, explanation:"To decide to stop doing something for the rest of the day." },

{ id:"IDP013", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Get cold feet' means:",
  options:["To feel cold","To become nervous and hesitant","To run fast","To fall ill"],
  correct:1, explanation:"To suddenly become too frightened to do something." },

{ id:"IDP014", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Hit the books' means:",
  options:["To physically hit books","To study hard","To throw books","To buy books"],
  correct:1, explanation:"To study with serious effort." },

{ id:"IDP015", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Keep an eye on' means:",
  options:["To ignore","To watch carefully","To close one's eyes","To criticise"],
  correct:1, explanation:"To monitor or observe someone/something closely." },

{ id:"IDP016", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Miss the boat' means:",
  options:["To miss a journey","To miss an opportunity","To arrive early","To succeed"],
  correct:1, explanation:"To miss a chance to do something." },

{ id:"IDP017", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'On cloud nine' means:",
  options:["Extremely sad","Extremely happy","Confused","Angry"],
  correct:1, explanation:"To be in a state of great happiness." },

{ id:"IDP018", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Pull someone's leg' means:",
  options:["To hurt someone","To tease or joke with someone","To help someone","To ignore someone"],
  correct:1, explanation:"To deceive someone playfully; to tease." },

{ id:"IDP019", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Raining cats and dogs' means:",
  options:["Light rain","Raining very heavily","Animals falling","Pleasant weather"],
  correct:1, explanation:"Raining very hard." },

{ id:"IDP020", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Speak of the devil' means:",
  options:["To talk about something evil","The person just mentioned appears","To curse someone","To avoid someone"],
  correct:1, explanation:"Said when a person appears just after being mentioned." },

{ id:"IDP021", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'The ball is in your court' means:",
  options:["It is your turn to take action","You have lost the game","You are not responsible","You should wait"],
  correct:0, explanation:"It is now your responsibility to take the next step." },

{ id:"IDP022", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Through thick and thin' means:",
  options:["Only in good times","In both good and bad times","Only in bad times","Occasionally"],
  correct:1, explanation:"Supporting someone in all circumstances." },

{ id:"IDP023", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Turn a blind eye' means:",
  options:["To watch carefully","To ignore something deliberately","To become blind","To criticise openly"],
  correct:1, explanation:"To pretend not to notice something." },

{ id:"IDP024", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'When pigs fly' means:",
  options:["Something that will never happen","Something that happens often","A farm event","A miracle that occurs"],
  correct:0, explanation:"Used to say that something is impossible." },

{ id:"IDP025", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'A dime a dozen' means:",
  options:["Very rare","Very common and of little value","Expensive","Unique"],
  correct:1, explanation:"Something so common that it is not special or valuable." },

{ id:"IDP026", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Back to the drawing board' means:",
  options:["To start planning again after a failure","To draw pictures","To give up","To celebrate success"],
  correct:0, explanation:"To start over after a plan has failed." },

{ id:"IDP027", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Bite off more than you can chew' means:",
  options:["To eat too much","To take on a task that is too big","To refuse food","To share with others"],
  correct:1, explanation:"To attempt something that is beyond one's capability." },

{ id:"IDP028", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Cut corners' means:",
  options:["To do something thoroughly","To do something in the easiest or cheapest way","To improve quality","To take a long route"],
  correct:1, explanation:"To do something poorly or incompletely to save time or money." },

{ id:"IDP029", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Get a taste of your own medicine' means:",
  options:["To receive medical treatment","To experience the same bad treatment one has given others","To help others","To avoid trouble"],
  correct:1, explanation:"To be treated the same unpleasant way one has treated others." },

{ id:"IDP030", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Go the extra mile' means:",
  options:["To travel far","To make a special effort","To give up","To take a shortcut"],
  correct:1, explanation:"To do more than what is expected." },

{ id:"IDP031", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'In hot water' means:",
  options:["In a comfortable situation","In trouble","Enjoying a bath","Feeling warm"],
  correct:1, explanation:"In a difficult or embarrassing situation." },

{ id:"IDP032", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Kill two birds with one stone' means:",
  options:["To harm animals","To achieve two things with a single action","To fail at two tasks","To waste effort"],
  correct:1, explanation:"To accomplish two objectives with one effort." },

{ id:"IDP033", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Leave no stone unturned' means:",
  options:["To search thoroughly","To give up easily","To avoid effort","To hide things"],
  correct:0, explanation:"To do everything possible to achieve something." },

{ id:"IDP034", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'On the same page' means:",
  options:["Reading the same book","In agreement","In conflict","Confused"],
  correct:1, explanation:"Thinking or understanding in the same way." },

{ id:"IDP035", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Out of the blue' means:",
  options:["Expected","Suddenly and unexpectedly","From the sky","Slowly"],
  correct:1, explanation:"Happening without any warning." },

{ id:"IDP036", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Put all your eggs in one basket' means:",
  options:["To diversify investments","To risk everything on a single venture","To be careful","To share resources"],
  correct:1, explanation:"To depend entirely on one plan or course of action." },

{ id:"IDP037", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'See eye to eye' means:",
  options:["To look at each other","To agree completely","To disagree","To stare"],
  correct:1, explanation:"To have the same opinion." },

{ id:"IDP038", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'The last straw' means:",
  options:["The final problem that makes a situation unbearable","A useful tool","A lucky event","The beginning of trouble"],
  correct:0, explanation:"The last in a series of troubles that causes one to lose patience." },

{ id:"IDP039", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Throw in the towel' means:",
  options:["To clean up","To give up or admit defeat","To start a fight","To help someone"],
  correct:1, explanation:"To quit or surrender." },

{ id:"IDP040", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Under one's belt' means:",
  options:["Something already achieved or experienced","A clothing item","A future plan","A burden"],
  correct:0, explanation:"Something one has already accomplished or learned." },

{ id:"IDP041", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'A hot potato' means:",
  options:["A delicious food","A controversial or difficult issue","An easy task","A gift"],
  correct:1, explanation:"A situation or issue that is awkward or controversial." },

{ id:"IDP042", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Barking up the wrong tree' means:",
  options:["Accusing the wrong person","Climbing a tree","Making the right choice","Working hard"],
  correct:0, explanation:"To pursue a mistaken or misguided line of thought." },

{ id:"IDP043", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Beat around the bush' means:",
  options:["To speak directly","To avoid the main topic","To garden","To finish quickly"],
  correct:1, explanation:"To discuss a matter without coming to the point." },

{ id:"IDP044", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Cry over spilt milk' means:",
  options:["To clean up a mess","To waste time worrying about something that cannot be changed","To cry for no reason","To be careful"],
  correct:1, explanation:"To be upset about something that has already happened and cannot be undone." },

{ id:"IDP045", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Hit the sack' means:",
  options:["To go to bed","To start working","To exercise","To cook"],
  correct:0, explanation:"To go to sleep." },

{ id:"IDP046", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'In the same boat' means:",
  options:["Travelling together","In the same difficult situation","Competing","Successful"],
  correct:1, explanation:"Facing the same challenges or problems." },

{ id:"IDP047", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Jump on the bandwagon' means:",
  options:["To join a popular activity or trend","To start a band","To refuse to join","To lead a movement"],
  correct:0, explanation:"To join others in doing something that is currently fashionable." },

{ id:"IDP048", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Keep your chin up' means:",
  options:["To look up","To remain cheerful in a difficult situation","To be proud","To ignore problems"],
  correct:1, explanation:"To stay positive despite difficulties." },

{ id:"IDP049", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'Make a long story short' means:",
  options:["To tell a detailed story","To come to the point quickly","To exaggerate","To write a novel"],
  correct:1, explanation:"To give only the main points of a story." },

{ id:"IDP050", section:"verbal", topic:"Idioms & Phrases", difficulty:"Medium",
  question:"'No pain, no gain' means:",
  options:["Success requires hard work and sacrifice","Pain is unnecessary","Gain comes easily","Avoid effort"],
  correct:0, explanation:"One must work hard and endure hardship to achieve something." },

{ id:"IDP051", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"What does the idiom 'A storm in a teacup' mean?",
  options:["A major disaster","A big fuss about a trivial matter","Bad weather","A celebration"],
  correct:1, explanation:"An unnecessary exaggeration of a small problem." },

{ id:"IDP052", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Burning the candle at both ends' means:",
  options:["Saving resources","Exhausting oneself by doing too much","Working efficiently","Celebrating"],
  correct:1, explanation:"To overwork by doing too many things, especially late at night and early in the morning." },

{ id:"IDP053", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Catch-22' refers to:",
  options:["An easy solution","A paradoxical situation from which one cannot escape","A lucky break","A legal document"],
  correct:1, explanation:"A dilemma where the solution is prevented by a contradictory rule or condition." },

{ id:"IDP054", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Cut the mustard' means:",
  options:["To cook well","To meet expectations or perform adequately","To fail","To criticise"],
  correct:1, explanation:"To succeed or reach the required standard." },

{ id:"IDP055", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Devil's advocate' means:",
  options:["A supporter of evil","Someone who argues against a position for the sake of debate","A religious person","A lawyer"],
  correct:1, explanation:"A person who expresses a contrary opinion to stimulate discussion." },

{ id:"IDP056", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Elephant in the room' means:",
  options:["A large animal","An obvious problem that is being ignored","A party guest","A decoration"],
  correct:1, explanation:"A major issue that everyone is aware of but no one wants to discuss." },

{ id:"IDP057", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Flogging a dead horse' means:",
  options:["Working hard","Wasting effort on something that is already settled or hopeless","Training animals","Achieving success"],
  correct:1, explanation:"To continue a futile activity." },

{ id:"IDP058", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Grasping at straws' means:",
  options:["Being practical","Trying any desperate means to succeed","Farming","Being successful"],
  correct:1, explanation:"To make a hopeless or desperate attempt." },

{ id:"IDP059", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'In the doldrums' means:",
  options:["In high spirits","In a state of stagnation or depression","At sea","Celebrating"],
  correct:1, explanation:"In low spirits or a period of inactivity." },

{ id:"IDP060", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Jump the gun' means:",
  options:["To start too soon or act prematurely","To win a race","To be late","To refuse to participate"],
  correct:0, explanation:"To do something before the proper time." },

{ id:"IDP061", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Kick the bucket' means:",
  options:["To play a game","To die","To clean","To succeed"],
  correct:1, explanation:"A euphemism for dying." },

{ id:"IDP062", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Let sleeping dogs lie' means:",
  options:["To wake animals","To avoid interfering in a situation that is currently stable","To cause trouble","To investigate thoroughly"],
  correct:1, explanation:"To leave a situation alone to avoid trouble." },

{ id:"IDP063", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Move the goalposts' means:",
  options:["To play fairly","To change the rules or conditions unfairly","To score a goal","To give up"],
  correct:1, explanation:"To alter the terms of a situation in a way that makes it harder for others." },

{ id:"IDP064", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Not playing with a full deck' means:",
  options:["Being incomplete","Lacking intelligence or sanity","Playing cards","Being honest"],
  correct:1, explanation:"Not mentally sound or intelligent." },

{ id:"IDP065", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'On the back burner' means:",
  options:["Being cooked","Given low priority; postponed","Being urgent","Completed"],
  correct:1, explanation:"To be left for later attention." },

{ id:"IDP066", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Paint the town red' means:",
  options:["To renovate","To go out and celebrate wildly","To protest","To work late"],
  correct:1, explanation:"To enjoy oneself flamboyantly in public." },

{ id:"IDP067", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Pull the wool over someone's eyes' means:",
  options:["To keep warm","To deceive someone","To help someone see","To ignore"],
  correct:1, explanation:"To trick or mislead someone." },

{ id:"IDP068", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Read between the lines' means:",
  options:["To read carefully","To understand the hidden meaning","To skip pages","To criticise a book"],
  correct:1, explanation:"To perceive the intended meaning that is not explicitly stated." },

{ id:"IDP069", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Skeleton in the closet' means:",
  options:["A medical condition","A hidden and potentially embarrassing secret","A decoration","An old story"],
  correct:1, explanation:"A shameful or embarrassing fact from the past that one wants to keep hidden." },

{ id:"IDP070", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Take with a grain of salt' means:",
  options:["To accept completely","To view with scepticism","To cook","To ignore entirely"],
  correct:1, explanation:"To not take something completely at face value." },

{ id:"IDP071", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'The tip of the iceberg' means:",
  options:["A small visible part of a much larger problem","The end of a problem","A complete solution","A celebration"],
  correct:0, explanation:"A small, evident part of a much larger and usually hidden issue." },

{ id:"IDP072", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Throw caution to the wind' means:",
  options:["To be careful","To act recklessly without worrying about the consequences","To plan carefully","To give advice"],
  correct:1, explanation:"To behave in a risky or reckless manner." },

{ id:"IDP073", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Up in the air' means:",
  options:["Flying","Uncertain or undecided","Completed","Celebrated"],
  correct:1, explanation:"Still unsettled or unresolved." },

{ id:"IDP074", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Water under the bridge' means:",
  options:["A current problem","Something from the past that is no longer important","A flood","An ongoing issue"],
  correct:1, explanation:"Past events that are no longer worth worrying about." },

{ id:"IDP075", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Wear one's heart on one's sleeve' means:",
  options:["To hide emotions","To openly display one's feelings","To dress well","To be cold-hearted"],
  correct:1, explanation:"To make one's emotions and feelings obvious." },

{ id:"IDP076", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'A red herring' means:",
  options:["A type of fish","Something that misleads or distracts from the relevant issue","A warning","A solution"],
  correct:1, explanation:"A clue or piece of information that is intended to be misleading." },

{ id:"IDP077", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Bite the hand that feeds you' means:",
  options:["To be grateful","To act ungratefully toward someone who helps you","To share food","To work hard"],
  correct:1, explanation:"To harm or show ingratitude to a benefactor." },

{ id:"IDP078", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Cross that bridge when you come to it' means:",
  options:["To plan far ahead","To deal with a problem only when it arises","To avoid all problems","To worry constantly"],
  correct:1, explanation:"To not worry about a possible future problem until it actually happens." },

{ id:"IDP079", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Don't count your chickens before they hatch' means:",
  options:["To plan carefully","To not assume success before it happens","To raise poultry","To be optimistic always"],
  correct:1, explanation:"Do not make plans based on events that have not yet occurred." },

{ id:"IDP080", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Every cloud has a silver lining' means:",
  options:["Bad weather is coming","There is something good in every bad situation","Clouds are beautiful","Problems never end"],
  correct:1, explanation:"Even difficult situations have some positive aspect." },

{ id:"IDP081", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Get the short end of the stick' means:",
  options:["To receive the best treatment","To receive unfair or unfavourable treatment","To win","To share equally"],
  correct:1, explanation:"To end up in a worse position than others." },

{ id:"IDP082", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'In a nutshell' means:",
  options:["In great detail","In a few words; briefly","Inside a shell","Confusingly"],
  correct:1, explanation:"In a very concise form." },

{ id:"IDP083", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Keep one's cards close to one's chest' means:",
  options:["To be open","To be secretive about one's plans","To play cards","To share information freely"],
  correct:1, explanation:"To not reveal one's intentions or information." },

{ id:"IDP084", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Make hay while the sun shines' means:",
  options:["To work only in good weather","To take advantage of a favourable opportunity","To rest","To avoid work"],
  correct:1, explanation:"To make the most of a good situation while it lasts." },

{ id:"IDP085", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Not the sharpest tool in the shed' means:",
  options:["Being very intelligent","Lacking intelligence","Being skilled","Being useful"],
  correct:1, explanation:"A polite way of saying someone is not very clever." },

{ id:"IDP086", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Out of the frying pan into the fire' means:",
  options:["Moving from a bad situation to a worse one","Improving a situation","Cooking","Solving a problem"],
  correct:0, explanation:"Escaping one difficulty only to land in a greater one." },

{ id:"IDP087", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Put the cart before the horse' means:",
  options:["To do things in the correct order","To do things in the wrong order","To travel","To be efficient"],
  correct:1, explanation:"To reverse the proper order of things." },

{ id:"IDP088", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Rob Peter to pay Paul' means:",
  options:["To be generous","To take from one to give to another, solving nothing overall","To steal","To share fairly"],
  correct:1, explanation:"To discharge one debt by incurring another." },

{ id:"IDP089", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Steal someone's thunder' means:",
  options:["To help someone","To take credit for someone else's idea or achievement","To create a storm","To support"],
  correct:1, explanation:"To pre-empt or take the attention away from someone else's moment." },

{ id:"IDP090", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'The best of both worlds' means:",
  options:["A compromise","A situation where one can enjoy two different advantages","A conflict","A loss"],
  correct:1, explanation:"A situation in which one can enjoy two different opportunities." },

{ id:"IDP091", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Through rose-coloured glasses' means:",
  options:["Seeing things clearly","Viewing things more favourably than they really are","Being pessimistic","Being realistic"],
  correct:1, explanation:"Having an unrealistically optimistic view." },

{ id:"IDP092", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Turn the tables' means:",
  options:["To rearrange furniture","To reverse a situation and gain the upper hand","To surrender","To ignore"],
  correct:1, explanation:"To change a disadvantageous position into an advantageous one." },

{ id:"IDP093", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'When the chips are down' means:",
  options:["During a celebration","In a difficult or crucial situation","When gambling","When relaxed"],
  correct:1, explanation:"When a situation becomes difficult or critical." },

{ id:"IDP094", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'A wolf in sheep's clothing' means:",
  options:["A kind person","A dangerous person who appears harmless","An animal","A costume"],
  correct:1, explanation:"Someone who hides malicious intent under a friendly appearance." },

{ id:"IDP095", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Beat a dead horse' means:",
  options:["To continue arguing a point that is already settled","To work hard","To succeed","To train"],
  correct:0, explanation:"To waste effort on something that is no longer relevant." },

{ id:"IDP096", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Blow one's own trumpet' means:",
  options:["To play music","To boast about one's own achievements","To be humble","To criticise others"],
  correct:1, explanation:"To talk boastfully about oneself." },

{ id:"IDP097", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Get down to brass tacks' means:",
  options:["To discuss basic facts or practical details","To avoid the issue","To decorate","To postpone"],
  correct:0, explanation:"To start talking about the most important or practical aspects." },

{ id:"IDP098", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Have a chip on one's shoulder' means:",
  options:["To be proud","To be easily offended or hold a grudge","To be injured","To be generous"],
  correct:1, explanation:"To have a grievance or attitude of resentment." },

{ id:"IDP099", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'In the nick of time' means:",
  options:["Too late","Just in time; at the last possible moment","Early","Never"],
  correct:1, explanation:"At the last critical moment before it is too late." },

{ id:"IDP100", section:"verbal", topic:"Idioms & Phrases", difficulty:"Hard",
  question:"'Sweep under the rug' means:",
  options:["To clean thoroughly","To hide a problem instead of dealing with it","To solve a problem","To display openly"],
  correct:1, explanation:"To conceal something embarrassing or problematic." },

] // end COMMUNICATION_BANK
