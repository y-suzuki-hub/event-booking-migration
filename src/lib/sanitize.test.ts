import { sanitizeHtml } from './sanitize'

describe('sanitizeHtml', () => {
  it('許可したタグは残す', () => {
    expect(sanitizeHtml('<p>対象：<strong>小学生</strong></p>')).toBe('<p>対象：<strong>小学生</strong></p>')
  })

  it('scriptタグとイベントハンドラ属性を取り除く', () => {
    const result = sanitizeHtml('<p onclick="alert(1)">x</p><script>alert(1)</script><img src=x onerror="alert(1)">')
    expect(result).toBe('<p>x</p>')
  })

  it('javascript: スキームのリンクは href を落とす', () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">link</a>')).toBe('<a>link</a>')
  })

  it('http(s) のリンクは残す', () => {
    expect(sanitizeHtml('<a href="https://example.com">link</a>')).toBe('<a href="https://example.com">link</a>')
  })
})
