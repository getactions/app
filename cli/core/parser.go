package core

import (
	"strings"

	"github.com/adrg/frontmatter"
)

func ParseWorkflowFile(rawContents *string) (*Workflow, error) {
	meta := meta{}

	rest, error := frontmatter.Parse(strings.NewReader(*rawContents), &meta)

	if error != nil {
		return nil, error
	}

	contents := string(rest)

	workflow := Workflow{
		Meta:     meta,
		Contents: contents,
	}

	return &workflow, nil
}
