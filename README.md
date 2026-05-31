# System Command Agent

-שם המגישה: מרים פיונטק
- קורס: AI: שימוש הנדסי, אינטגרציה וארכיטקטורה
- תיאור: אפליקציית Agent שמסוגלת לזהות בקשות משתמש ולפתוח כלים בסיסיים במחשב.

## כלי מערכת מומשו
- `calculator` — פתיחת מחשבון
- `browser` — פתיחת דפדפן
- `clock` — פתיחת שעון
- `calendar` — פתיחת לוח שנה
- `downloads` — פתיחת תיקיית הורדות
- `screenshot` — צילום מסך
- `recycle` — פתיחת סל מיחזור
- `fileExplorer` — פתיחת סייר קבצים
- `notes` — פתיחת פנקס פתקים
- `terminal` — פתיחת טרמינל
- `settings` — פתיחת הגדרות מערכת

## ארכיטקטורה
### Client
- Angular application עם תיבת טקסט, כפתור `שלח`, ורכיבי תצוגה נפרדים לכל `type`:
  - `app-success-response`
  - `app-unsupported-response`
  - `app-irrelevant-response`
- הלקוח שולח את הבקשה אל ה־API היחיד של השרת (`/api/agent`).
- התצוגה מתעדכנת לפי `type` של התגובה.

### Server
- Express backend עם נקודת גישה אחת: `POST /api/agent`.
- Agent מבצע:
  - הסרת תנאים ובדיקות עבור בקשת משתמש
  - קריאת OpenAI לניתוח כוונה
  - בדיקת כלי נתמך
  - הפעלת `Tool` מתאים
  - החזרת JSON תקין ומובנה
- JSON Schema משמש לאימות בקשות ותגובות.
- קיימת לוגיקה של Retry עבור תוצאות שאינן תקינות.
- פעולות שגיאה מטופלות באמצעות middleware שמחזיר JSON תקין.

## דרישות מימוש
- `UNDERSTAND`: המערכת מזהה את בקשת המשתמש.
- `COMPUTER ACTION`: מזהה אם הבקשה קשורה לפעולה על מחשב.
- `SUPPORTED`: בודקת האם קיים כלי מתאים ומפעילה אותו.
- `UNSUPPORTED`: מחזירה `unsupported` עבור כלים לא נתמכים.
- `IRRELEVANT`: מחזירה `irrelevant` עבור בקשות שאינן קשורות להפעלת כלים.
- `STRUCTURED OUTPUT`: תמיד JSON תקין עם שדה `type`.
- `VALIDATION`: ביצוע אימות עם AJV.
- `ERROR HANDLING`: טיפול בשגיאות API ושגיאות JSON.

## כלים ששימשו לפיתוח
- Node.js
- Express
- Angular
- OpenAI SDK
- AJV
- TypeScript/JavaScript

## הוראות הפעלה
1. בשורש השרת: `npm install`
2. לשם הפעלת השרת: `npm start`
3. בשורש הלקוח: `npm install`
4. הפעלת הלקוח: `npm start` (Angular)

## Prompt files
- Canonical system prompt: `agentPrompts.js` (root) — זהו הטקסט המדויק שנשלח כ־system prompt ל‑OpenAI.
- Prompt documentation: `PROMPT_README.md` (root) — תיעוד מלא של הפרומפט, ה‑function schema ודוגמאות.

## Reports
- Canonical smoke-test outputs: `reports/tool-outputs.jsonl` — JSONL עם דוגמות תגובה לכל כלי ולתרחישים (supported/unsupported/irrelevant/error).

## Preparing for GitHub
1. ודא שאין מפתחות או סודות בקבצים (`.env` לא ישותף).
2. קבצים לא להעלות: `node_modules/`, `logs/`, `reports/tool-outputs.jsonl` (מופיע גם ב־.gitignore כברירת מחדל).
3. פקודות לדחיפה ל־GitHub:
```bash
git add .
git commit -m "Add prompt, prompt README, reports, and .gitignore"
git push origin main
```

## הערות
- השירות משתמש ב־`/api/agent` בלבד כאינטגרציה עם הלקוח.
