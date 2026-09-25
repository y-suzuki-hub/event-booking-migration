import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

const Wrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(1)};
`

const Label = styled.label`
  font-size: ${({ theme }) => theme.font.sm};
  font-weight: 700;
`

const control = css<{ $invalid: boolean }>`
  width: 100%;
  min-height: 44px;
  padding: 0 ${({ theme }) => theme.space(3)};
  font: inherit;
  color: ${({ theme }) => theme.color.text};
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ $invalid, theme }) => ($invalid ? theme.color.danger : theme.color.border)};
  border-radius: ${({ theme }) => theme.radius.md};
`

const Input = styled.input<{ $invalid: boolean }>`
  ${control}
`

const Select = styled.select<{ $invalid: boolean }>`
  ${control}
`

const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.font.sm};
  color: ${({ theme }) => theme.color.danger};
`

type BaseProps = { label: string; error?: string }

function FieldShell({ id, label, error, children }: BaseProps & { id: string; children: ReactNode }) {
  return (
    <Wrapper>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <ErrorText id={`${id}-error`} role="alert">
          {error}
        </ErrorText>
      )}
    </Wrapper>
  )
}

export function TextField({ label, error, ...rest }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} error={error}>
      <Input
        id={id}
        $invalid={Boolean(error)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
    </FieldShell>
  )
}

export function SelectField({
  label,
  error,
  children,
  ...rest
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} error={error}>
      <Select
        id={id}
        $invalid={Boolean(error)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      >
        {children}
      </Select>
    </FieldShell>
  )
}
