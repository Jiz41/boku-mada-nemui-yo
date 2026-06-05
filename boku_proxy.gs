// ボクマダネムイヨ予想 Gemini プロキシ
// ─────────────────────────────────────────────────
// 【デプロイ手順】
//   1. スクリプトプロパティに GEMINI_API_KEY を追加
//      （プロジェクト設定 → スクリプトプロパティ）
//   2. デプロイ → 新しいデプロイ
//      種類: ウェブアプリ
//      実行ユーザー: 自分
//      アクセスできるユーザー: 全員
//   3. デプロイURLを index.html の GAS_URL に差し替え
// ─────────────────────────────────────────────────

const MODEL = 'gemini-2.5-flash-lite';

function doPost(e) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) {
      return respond({ error: 'GEMINI_API_KEY がスクリプトプロパティに未設定です' });
    }

    const body = JSON.parse(e.postData.contents);
    const { systemInstruction, messages } = body;

    // messages: [{role:"user"|"assistant", content:"..."}] → Gemini contents形式
    const contents = (messages || []).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const payload = { contents };
    if (systemInstruction) {
      payload.system_instruction = { parts: [{ text: systemInstruction }] };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
    const res = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    });

    const json = JSON.parse(res.getContentText());
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text && json.error) {
      return respond({ error: json.error.message });
    }
    return respond({ response: text });

  } catch (err) {
    return respond({ error: err.message });
  }
}

// 疎通確認用
function doGet() {
  return respond({ status: 'ok', model: MODEL });
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
