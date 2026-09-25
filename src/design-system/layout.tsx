import styled from 'styled-components'

export const Card = styled.section`
  padding: ${({ theme }) => theme.space(5)};
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
`

export const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.font.xl};
  line-height: 1.4;
`

export const Muted = styled.p`
  font-size: ${({ theme }) => theme.font.sm};
  color: ${({ theme }) => theme.color.muted};
`

export const Notice = styled.div<{ $tone: 'success' | 'danger' | 'info' }>`
  padding: ${({ theme }) => `${theme.space(3)} ${theme.space(4)}`};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ $tone, theme }) =>
    ({ success: theme.color.success, danger: theme.color.danger, info: theme.color.primary })[$tone]};
  background: ${({ $tone, theme }) =>
    ({ success: theme.color.successWeak, danger: theme.color.dangerWeak, info: theme.color.primaryWeak })[$tone]};
`
