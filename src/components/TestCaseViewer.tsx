import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  HStack,
  Textarea,
} from "@chakra-ui/react"
import React from "react"
import { TestCase } from "../shared/types/Lab"

interface Props {
  testCases?: TestCase
}

const TestCaseViewer = ({ testCases }: Props) => {
  if (!testCases) {
    return <h1>No test cases.</h1>
  }

  return (
    <Accordion allowToggle>
      {testCases?.inputs.map((inp, index) => {
        return (
          <>
            <AccordionItem>
              <AccordionButton>Test case {index + 1}</AccordionButton>
              <AccordionPanel>
                <HStack>
                  <Textarea readOnly defaultValue={inp.content} />
                  <Textarea
                    readOnly
                    defaultValue={testCases.outputs[index].content}
                  />
                </HStack>
              </AccordionPanel>
            </AccordionItem>
          </>
        )
      })}
    </Accordion>
  )
}

export default TestCaseViewer
