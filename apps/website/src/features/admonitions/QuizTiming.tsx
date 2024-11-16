import { chakra } from "@chakra-ui/react";
import { Bold, Tip } from "@components";
import React from "react";

export function QuizTiming(): JSX.Element {
  return (
    <Tip>
      <chakra.span>
        While it may seem counterintuitive, often the best time to receive a
        quiz is before you "officially" learn the content. Even if you don't
        answer "correctly", this process can strengthen your knowledge
        retention. Try your best to answer the questions below before viewing
        the <Bold>Answer</Bold> section.
      </chakra.span>
    </Tip>
  );
}
