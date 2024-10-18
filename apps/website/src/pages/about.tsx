import { Box, Code, Flex, Image, ListItem, Text } from "@chakra-ui/react";
import {
  Bold,
  Header,
  Link,
  LinkAnchor,
  SectionWrapper,
  TopHeader,
  UnorderedList,
} from "@components";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useDependencies } from "@hooks";
import ZachImageUrl from "@site/static/img/authors/zroof.jpg";
import { Styles } from "@src/css";
import Layout from "@theme/Layout";
import { type navigationTypes, tutorialConfigConst } from "@utils";
import React, { useEffect } from "react";

function About() {
  const deps = useDependencies();
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation<navigationTypes.NavigationPositionState>();
  const logger = deps
    .createLogger()
    .setGlobalContext({ logicPath: __filename })
    .logInnerStartExecution({ functionName: About.name });
  useEffect(() => {
    logger.logInnerStartExecution({
      functionName: `${About.name}.${useEffect.name}`,
      metadata: { location: location.state },
    });
    deps.navigation.restoreNavigationState({ navigationState: location.state });
  }, [location.state]);

  return (
    <Layout description={siteConfig.tagline} title={siteConfig.title}>
      <Box bg="blackAlpha.50">
        <Flex
          alignItems="center"
          backgroundColor={Styles.whiteBackgroundEmphasisColor}
          flexDirection="column"
          pb={5}
          wrap="wrap"
        >
          <TopHeader title={"About"} />
        </Flex>
      </Box>
      <Box maxW={"4xl"} mx={"auto"} p={5}>
        <SectionWrapper>
          <Header
            anchorGUID={tutorialConfigConst.AnchorGUID.overview}
            headerMarginBottomOverride={5}
            level={2}
          ></Header>
          <Box>
            BlockBash is where developers learn Ethereum security concepts. It's
            run by volunteer{" "}
            <LinkAnchor
              anchorGUID={tutorialConfigConst.AnchorGUID.maintainers}
            />{" "}
            and is{" "}
            <Link
              href={tutorialConfigConst.BlockbashURLs.githubProject}
              shouldOpenTab={true}
            >
              open source
            </Link>
            . The project's mission is to minimize ethereum-related security
            incidents through developer education. If you're interested in a
            visual walkthrough of how Blockbash works, please visit the
            <Link
              href={tutorialConfigConst.BlockbashURLs.homePage}
              shouldOpenTab={true}
            >
              {" "}
              Tutorials page
            </Link>
            . If you'd like to contribute to BlockBash, please visit the{" "}
            <LinkAnchor
              anchorGUID={tutorialConfigConst.AnchorGUID.contributing}
            />{" "}
            section.
            <br />
          </Box>
          <Box>
            Blockbash distinguishes itself from other educational content by:
            <UnorderedList>
              <ListItem>
                <Bold>Developer Focus</Bold>: While a large percentage of
                ethereum security content caters to security researchers, we
                cater our content to developers. Additionally, we leverage
                tooling and concepts that are familiar to most developers (e.g.,
                Visual Studio Code, design patterns, etc.)
              </ListItem>
              <ListItem>
                <Bold>Hands-on Learning Experiences</Bold>: Every theory lesson
                has a corresponding hands-on learning experience (i.e., lab).
                <UnorderedList>
                  <ListItem>
                    <Bold>"One click" Initialization</Bold>: We provide
                    in-browser labs that can be created with one click. No more
                    complicated installations that might not work on your
                    computer.
                  </ListItem>
                  <ListItem>
                    <Bold>Immediate Feedback</Bold>: In some non-Blockbash labs,
                    you need to look at the solution to verify that you've
                    completed the lab correctly. We feel this is an impediment
                    to learning. Within BlockBash, all labs provide a cli
                    utility (<Code>cv</Code>) that verifies the learner's
                    solution. Additionally, <Code>cv</Code> accounts for the
                    fact that a lab can be solved multiple ways.
                  </ListItem>
                  <ListItem>
                    {" "}
                    <ListItem>
                      <Bold>Cost Effective</Bold>: All labs can be executed
                      within a i) in-browser Github Codespace (which has a
                      relatively generous free-tier); ii) local workstation.{" "}
                      <Text as={"u"}>
                        In general, Blockbash doesn't charge money for accessing
                        content
                      </Text>
                      .
                    </ListItem>
                    <ListItem>
                      <Bold>Offensive AND Defensive Labs</Bold>: A high
                      percentage of security content only focuses on how to hack
                      (i.e., the offensive perspective). We provide an equal
                      emphasis on how to defend against smart contract hacks.
                      Within BlockBash, the learner starts by creating an
                      exploit (Offensive Lab). Once the learner creates an
                      exploit, the learner must create a solution that defends
                      against the exploit (Defensive Lab). This "full cycle"
                      learning gives an "end-to-end" understanding of a topic.
                    </ListItem>
                  </ListItem>
                </UnorderedList>
              </ListItem>
              <ListItem>
                <Bold>Dedicated To Visual Learners</Bold>: Wherever possible,
                concepts are illustrated through visual examples. This includes
                diagrams, stack traces, <Code>git diff</Code> output, etc.
              </ListItem>
              <ListItem>
                <Bold>Up-to-date</Bold>: Tired of out-of-date screenshots within
                learning materials? So are we. If an external tool is integrated
                into a Blockbash tutorial, there is a process that i) executes
                the tool ii) embeds the tool's output in the UI. Whenever an
                external tool is upgraded (within Blockbash), we can ensure that
                all relevant learning examples are updated as well.
              </ListItem>
            </UnorderedList>
          </Box>
          <Header
            anchorGUID={tutorialConfigConst.AnchorGUID.maintainers}
            level={2}
          ></Header>
          <Image
            borderRadius="3xl"
            boxSize={150}
            mx={"auto"}
            src={ZachImageUrl}
          />

          <UnorderedList>
            <ListItem>
              <Bold>Zach Roof</Bold>: Zach describes himself as an ordinary guy
              who is extraordinarily curious. This curiosity has led him to
              become a{" "}
              <Link
                href={"https://www.pluralsight.com/authors/zach-roof"}
                shouldOpenTab={true}
              >
                Pluralsight author
              </Link>{" "}
              as well as roles within software development, devops, cloud
              security, and application security. By working on Blockbash, Zach
              hopes to mitigate the emotional (and financial) harm that comes
              from smart contract hacks. Outside of security, Zach is an outdoor
              enthusiast and is currently visiting all United States National
              Parks with his partner. If you'd like to reach out to Zach, email
              him at <Code>zach@blockbash.xyz</Code>.
            </ListItem>
          </UnorderedList>
          <Header
            anchorGUID={tutorialConfigConst.AnchorGUID.contributing}
            level={2}
          ></Header>

          <Box>
            Want to contribute to BlockBash? You are AWESOME! We welcome any
            help we can get. We're primarily interested in the areas listed
            below.{" "}
            <Bold>
              If you feel you're a match, please email Zach (
              <Code>zach@blockbash.xyz</Code>).
            </Bold>
          </Box>
          <UnorderedList>
            <ListItem>
              <Bold>Content Reviewer</Bold>: No matter what your experience
              level, we need your feedback! In this volunteer role, you'll
              periodically review BlockBash content before it goes live.
              Depending on your background, this can include: reviewing prose,
              technical recommendations, developer experience, etc.
            </ListItem>
          </UnorderedList>
        </SectionWrapper>
      </Box>
    </Layout>
  );
}

// Docusaurus assumes this component leverages a default export
export default About;
