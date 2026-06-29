export type DateFieldRef = {
  focus: () => void
  blur: () => void
}
export type DateFieldProps = {
  value: string | Date
  onChangeDate: (date: string) => void
  label: string
  inputRef?: React.Ref<DateFieldRef>
  isInvalid?: boolean
  testID?: string
  accessibilityHint?: string
  maximumDate?: string | Date
  minimumDate?: string | Date
  onConfirm?: (date: string) => void
  placeholder?: string
}
