import type { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

type Variant = 'primary' | 'secondary'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }

const StyledButton = styled.button<{ $variant: Variant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(2)};
  min-height: 44px;
  padding: 0 ${({ theme }) => theme.space(5)};
  border-radius: ${({ theme }) => theme.radius.md};
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s ease;

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? css`
          color: #fff;
          background: ${theme.color.primary};
          border: 1px solid ${theme.color.primary};
          &:hover:not(:disabled) {
            background: ${theme.color.primaryHover};
          }
        `
      : css`
          color: ${theme.color.primary};
          background: ${theme.color.surface};
          border: 1px solid ${theme.color.border};
          &:hover:not(:disabled) {
            background: ${theme.color.primaryWeak};
          }
        `}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`

export function Button({ variant = 'primary', type = 'button', ...rest }: ButtonProps) {
  return <StyledButton $variant={variant} type={type} {...rest} />
}
