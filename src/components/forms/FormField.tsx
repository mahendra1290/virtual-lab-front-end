import {
  FormErrorMessage,
  FormLabel,
  forwardRef,
  Input,
  InputElementProps,
  InputProps,
} from "@chakra-ui/react"
import React, { HTMLAttributes, HTMLInputTypeAttribute } from "react"
import { FieldError } from "react-hook-form"

type FormFieldProps = {
  label?: string
  error?: FieldError | undefined
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">

export const FormField = forwardRef<FormFieldProps, "div">(
  (props: FormFieldProps, ref) => {
    const { label, error, name } = props
    const restProps = props as Omit<FormFieldProps, "label" | "error">

    return (
      <>
        <FormLabel htmlFor={name}>{label || name}</FormLabel>
        <Input
          ref={ref}
          name={name}
          id={name}
          type={props.type}
          {...restProps}
        />
        <FormErrorMessage>{error && error.message}</FormErrorMessage>
      </>
    )
  }
)
