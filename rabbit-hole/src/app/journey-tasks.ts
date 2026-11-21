type DailyTasks = readonly [string, string, string];

const goalTemplates: ReadonlyArray<{ match: RegExp; tasks: DailyTasks }> = [
  {
    match: /\b(marathons?|race|5k|10k|jog(?:ging)?|running|run)\b/,
    tasks: ["Take a brisk walk", "Try short walk–run intervals", "Do an easy walk–run"],
  },
  {
    match: /\b(novel|memoir|short stor(?:y|ies)|fiction|screenplay|writing a book|write a book)\b/,
    tasks: ["Sketch one character", "Outline a scene", "Draft 250 words"],
  },
  {
    match: /\b(french|spanish|japanese|korean|german|italian|mandarin|learn a language)\b/,
    tasks: ["Review five words", "Read a short dialogue", "Record a spoken introduction"],
  },
  {
    match: /\b(guitar|piano|violin|drums|ukulele|singing|instrument)\b/,
    tasks: ["Practice a short warm-up", "Learn one musical phrase", "Record a short practice take"],
  },
  {
    match: /\b(paint(?:ing)?|sketch(?:ing)?|draw(?:ing)?|illustrat(?:e|ion))\b/,
    tasks: ["Sketch three basic shapes", "Draw an object nearby", "Finish a small study"],
  },
  {
    match: /\b(code|coding|programming|python|javascript|build (?:an app|a website))\b/,
    tasks: ["Run a small example", "Modify a working example", "Build one tiny feature"],
  },
  {
    match: /\b(save money|sav(?:e|ing) up|savings|budget|debt|retire(?:ment)?)\b|\bsave\s+\$?\d/,
    tasks: ["Write your savings target", "Review recent purchases", "Make a weekly budget"],
  },
  {
    match: /\b(job|hired|career|resume|résumé|internship)\b/,
    tasks: ["Save three job listings", "Improve one résumé bullet", "Tailor one job application"],
  },
  {
    match: /\b(business|startup|shop|freelanc(?:e|ing)|side hustle)\b/,
    tasks: ["Name one ideal customer", "Draft a simple offer", "Ask someone for feedback"],
  },
  {
    match: /\b(cook(?:ing)?|bake|baking|meal prep|recipes?)\b/,
    tasks: ["Pick one simple recipe", "Prep the ingredients", "Cook one serving"],
  },
  {
    match: /\b(fitness|work out|workout|exercise|yoga|strength|weight training)\b/,
    tasks: ["Do a gentle warm-up", "Practice two basic movements", "Try a beginner routine"],
  },
  {
    match: /\b(reading|read (?:more|a book|\d+ books))\b/,
    tasks: ["Pick your next book", "Read a few pages", "Read and jot notes"],
  },
  {
    match: /\b(writ(?:e|ing)|blog|newsletter|essay)\b/,
    tasks: ["List three ideas", "Outline one idea", "Draft a short section"],
  },
  {
    match: /\b(study|studying|exam|class|certification|learn)\b/,
    tasks: ["Choose one topic", "Review a short lesson", "Practice without notes"],
  },
];

export function getDailyTasks(goal: string): DailyTasks {
  const text = goal.trim().toLowerCase();
  // “Run a business” describes a project, not a fitness goal.
  const normalized = text.replace(
    /\brun(?:ning)? (?=(?:(?:a|my|the|your) )?(?:business|startup|shop)\b)/g,
    "",
  );
  return (
    goalTemplates.find(({ match }) => match.test(normalized))?.tasks ?? [
      "Define a first milestone",
      "List three next actions",
      "Try the smallest action",
    ]
  );
}
