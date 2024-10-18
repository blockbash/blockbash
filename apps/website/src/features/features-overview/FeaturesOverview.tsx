import { tutorialConfigConst } from "@blockbash/common";
import {
  Box,
  type BoxProps,
  Button,
  Center,
  Flex,
  Heading,
  Hide,
  ListItem,
  Text,
  chakra,
} from "@chakra-ui/react";
import {
  Bold,
  Link,
  LinkAnchor,
  SVGModal,
  Tip,
  UnorderedList,
} from "@components";
import { useDependencies } from "@hooks";
import SVG from "@site/static/img/tutorials/reentrancy-fundamentals/theory.svg";
import { Styles } from "@src/css";
// @ts-expect-error: chakra-ui-steps: It looks like this package needs to
// update its export declaration.  This might be related:
// https://github.com/jeanverster/chakra-ui-steps/issues/134#issuecomment-1725255696
import { Step, Steps, useSteps } from "chakra-ui-steps";
import React, { type ReactNode } from "react";

import { EditorExample } from "./EditorExample";
import { ExampleWrapper } from "./ExampleWrapper";
import { TerminalExample } from "./TerminalExample";

interface IStep {
  Content: ReactNode;
  description: string;
  label: string;
}

interface FeaturesOverviewProps {
  stepBoxProps: BoxProps;
}

function FeaturesOverview(props: FeaturesOverviewProps): JSX.Element {
  const { activeStep, nextStep, prevStep, setStep } = useSteps({
    initialStep: 0,
  });
  const deps = useDependencies();
  const logger = deps
    .createLogger()
    .setGlobalContext({ logicPath: __filename });
  const beginnerPath = deps.tutorialConfig.getActivePlaylist(
    tutorialConfigConst.PlaylistGUID.beginner,
  );
  if (typeof beginnerPath === "undefined") {
    const errorMessage = "Couldn't find beginner path";
    logger.error({
      functionName: `${FeaturesOverview.name}`,
      message: errorMessage,
    });
    throw new Error(errorMessage);
  }

  const theoryCategory = (
    <LinkAnchor
      anchorGUID={tutorialConfigConst.AnchorGUID.tutorialSearch}
      content={"Theory"}
    />
  );
  const defendTheory = (
    <Bold textTransform={"capitalize"}>
      {" "}
      {tutorialConfigConst.TutorialTypeName.defendTheory}
    </Bold>
  );
  const attackTheory = (
    <Bold textTransform={"capitalize"}>
      {tutorialConfigConst.TutorialTypeName.attackTheory}
    </Bold>
  );
  const attackLab = (
    <Bold textTransform={"capitalize"}>
      {tutorialConfigConst.TutorialTypeName.attackLab}
    </Bold>
  );
  const defendLab = (
    <Bold textTransform={"capitalize"}>
      {tutorialConfigConst.TutorialTypeName.defendLab}
    </Bold>
  );

  const dontKnowWhereToStart = (
    <chakra.span>
      If you don't know where to start, navigate to the{" "}
      <Link href={beginnerPath.url} shouldOpenTab={true}>
        {`${beginnerPath.name}`}
      </Link>
      .
    </chakra.span>
  );

  const learnVisuallyStep = (
    <>
      <Heading fontSize={"2xl"} fontWeight={"light"} textAlign={"center"}>
        Are you a Solidity developer looking to increase your security
        knowledge? You're in the right place!{" "}
      </Heading>
      <Text mb={0}>
        To start, pick a {theoryCategory} tutorial to receive an introduction to
        a topic. Each tutorial has content that's dedicated to{" "}
        <Bold>visual learners</Bold>. This includes diagrams (as seen below), as
        well as code examples.
      </Text>
      <ExampleWrapper my={5}>
        <SVGModal
          SVG={SVG}
          SVGTitle={tutorialConfigConst.TutorialImageName.diagramExample}
          maxW={"xs"}
        />
      </ExampleWrapper>
      <Text>There are two types of {theoryCategory} tutorials:</Text>
      <UnorderedList textAlign={"left"}>
        <ListItem>
          {attackTheory}: In order to write secure Solidity code, you need to understand
          how it can be hacked. This tutorial type will teach a security topic
          from an offensive (or "hacker") viewpoint.
        </ListItem>
        <ListItem>
          {defendTheory}: Will teach design patterns that help mitigate a particular
          vulnerability class.
        </ListItem>
      </UnorderedList>
      <Center my={3}>
        <Tip>
          <Text display={"inline"}>
            Start with a{" "}
            <LinkAnchor
              anchorGUID={tutorialConfigConst.AnchorGUID.tutorialSearch}
              content={tutorialConfigConst.TutorialTypeName.attackTheory}
            />{" "}
            tutorial. {dontKnowWhereToStart}
          </Text>
        </Tip>
      </Center>
    </>
  );
  const handsOnStep = (
    <Box>
      <Text>
        After completing a {theoryCategory} tutorial, you'll test your knowledge
        through hands-on exercises. Each {theoryCategory} tutorial will
        automatically progress into an {attackLab} or {defendLab}.
      </Text>
      <UnorderedList textAlign={"left"}>
        <ListItem>
          {attackLab}: In order to write secure Solidity code, you need to understand how
          it can be hacked. In these exercises, you'll write code to exploit a
          vulnerability.
        </ListItem>
        <ListItem>
          {defendLab}: In these exercises, you'll implement a design pattern to
          fix a vulnerable piece of code.
        </ListItem>
      </UnorderedList>
      <ExampleWrapper>
        <EditorExample />
      </ExampleWrapper>
    </Box>
  );

  const automatedFeedback = (
    <Box>
      <Text>
        Not sure if your lab solution is correct? No worries! The lab will
        verify your solution and give you a call trace for debugging purposes.
      </Text>
      <Text>
        <Bold>Next Steps: </Bold>
        Now that you understand how Blockbash works, dive into a{" "}
        {theoryCategory} tutorial! {dontKnowWhereToStart}
      </Text>
      <ExampleWrapper>
        <TerminalExample />
      </ExampleWrapper>
    </Box>
  );

  const steps: IStep[] = [
    {
      Content: learnVisuallyStep,
      description: "Pick a Theory tutorial",
      label: "Step 1",
    },
    {
      Content: handsOnStep,
      description: "Do a hands-on lab",
      label: "Step 2",
    },
    {
      Content: automatedFeedback,
      description: "Get automated feedback",
      label: "Step 3",
    },
  ];

  const isLastStep = activeStep === steps.length - 1;
  const isBeginningStep = activeStep === 0;

  return (
    <>
      <Steps
        activeStep={activeStep}
        colorScheme="blue"
        expandVerticalSteps={true}
        mobileBreakpoint={Styles.mobileThresholdWidth}
        onClickStep={(i: number): void => {
          setStep(i);
        }}
        size={"lg"}
        sx={{
          /* Additional styles set in custom.css: div.cui-steps__vertical-step-content */
          "& .cui-steps__step-icon-container": {
            "&:hover": {
              cursor: "pointer",
            },
            "&[aria-current=step]": {
              borderStyle: "solid",
              borderWidth: "3px",
            },
          },
        }}
        variant="circles-alt"
      >
        {steps.map(
          ({ Content, description, label }): JSX.Element => (
            <Step description={description} key={label} label={label}>
              <Box
                backgroundColor={Styles.whiteBackgroundEmphasisColor}
                my={[2, 8, 8]}
                py={[4, 4, 8]}
                {...props.stepBoxProps}
              >
                <Heading as={"h2"} fontSize="xl" textAlign="center">
                  {label}: {description}
                </Heading>
                {Content}
              </Box>
            </Step>
          ),
        )}
      </Steps>
      <Hide below={Styles.mobileThresholdWidth} ssr={true}>
        <Flex gap={4} justify="flex-end" mb={4} width={["98%", "100%", "100%"]}>
          <>
            <Button
              isDisabled={isBeginningStep}
              onClick={prevStep}
              size="md"
              variant="ghost"
            >
              Prev
            </Button>
            <Button isDisabled={isLastStep} onClick={nextStep} size="md">
              Next
            </Button>
          </>
        </Flex>
      </Hide>
    </>
  );
}
export { FeaturesOverview };
