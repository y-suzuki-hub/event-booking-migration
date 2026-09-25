import DOMPurify from 'dompurify'

// イベント説明文は管理者がリッチテキストで入力する想定。表示前に許可リスト方式で無害化する
const ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a']
const ALLOWED_ATTR = ['href']

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS, ALLOWED_ATTR, ALLOWED_URI_REGEXP: /^https?:\/\//i })
}
