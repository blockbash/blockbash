import { tutorialConfigConst } from "@blockbash/common";
import { ListItem, chakra } from "@chakra-ui/react";
import { Link, UnorderedList, Warning } from "@components";
import React from "react";

export function Liability(): JSX.Element {
  return (
    <Warning>
      <chakra.span>
        <UnorderedList>
          <ListItem>
            Content should be used for educational purposes only. You should not
            leverage this content for nefarious purposes. Blockbash's authors
            are not liable for misuse of this content.
          </ListItem>
          <ListItem>
            Everyone makes mistakes, including the authors of Blockbash. All
            content and recommendations should be verified via another source.
            Blockbash's authors are not liable for any mistakes. If you've found
            an error, please create a{" "}
            <Link
              href={tutorialConfigConst.BlockbashURLs.githubIssue}
              shouldOpenTab={true}
            >
              Github Issue
            </Link>
            .
          </ListItem>
        </UnorderedList>
      </chakra.span>
    </Warning>
  );
}
